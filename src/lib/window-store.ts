import { create } from 'zustand';

export type WindowId = 'about' | 'eboard' | 'feed' | 'workshops' | 'contact';

type Position = { x: number; y: number };

type WindowState = {
  order: WindowId[];           // z-order (last = front)
  activeId?: WindowId;
  minimized: Set<WindowId>;
  positions: Partial<Record<WindowId, Position>>;
};

type WindowActions = {
  open: (id: WindowId) => void;
  close: (id: WindowId) => void;
  minimize: (id: WindowId) => void;
  focus: (id: WindowId) => void;
  move: (id: WindowId, pos: Position) => void;
  bringToFront: (id: WindowId) => void;
  restore: (id: WindowId) => void;
};

export const useWindowStore = create<WindowState & WindowActions>((set) => ({
  order: [],
  minimized: new Set(),
  positions: {},
  
  open: (id) => set((state) => {
    const order = state.order.includes(id) ? state.order : [...state.order, id];
    const minimized = new Set([...state.minimized]);
    minimized.delete(id);

    // Remove stored position so window will be re-centered
    const positions = { ...state.positions };
    delete positions[id];

    return {
      order,
      activeId: id,
      minimized,
      positions
    };
  }),
  
  close: (id) => set((state) => {
    const order = state.order.filter(w => w !== id);
    const minimized = new Set([...state.minimized]);
    minimized.delete(id);
    return { 
      order,
      activeId: state.activeId === id ? order.at(-1) : state.activeId,
      minimized
    };
  }),
  
  minimize: (id) => set((state) => {
    const minimized = new Set(state.minimized);
    minimized.add(id);
    return { 
      minimized,
      activeId: state.activeId === id ? undefined : state.activeId
    };
  }),
  
  restore: (id) => set((state) => {
    const minimized = new Set(state.minimized);
    minimized.delete(id);
    return { 
      minimized,
      activeId: id
    };
  }),
  
  focus: (id) => set((state) => {
    if (!state.order.includes(id)) return state;
    return { 
      activeId: id,
      order: [...state.order.filter(w => w !== id), id]
    };
  }),
  
  bringToFront: (id) => set((state) => {
    if (!state.order.includes(id)) return state;
    return { 
      order: [...state.order.filter(w => w !== id), id]
    };
  }),
  
  move: (id, pos) => set((state) => ({
    positions: { 
      ...state.positions, 
      [id]: { 
        x: Math.round(pos.x / 16) * 16, // Snap to 16px grid
        y: Math.round(pos.y / 16) * 16
      }
    }
  })),
}));

// Utility functions for working with the store
export const getWindowPosition = (id: WindowId, positions: Partial<Record<WindowId, Position>>): Position => {
  // If window has been moved, use that position
  if (positions[id]) {
    return positions[id]!;
  }

  // Calculate centered position ensuring window stays within screen bounds
  if (typeof window !== 'undefined') {
    const windowWidth = 400;  // min-w-[400px] from CSS
    const windowHeight = 600; // Increased to account for content
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Reserve space for taskbar (approximately 60px height)
    const taskbarHeight = 60;
    const availableHeight = screenHeight - taskbarHeight;

    // Calculate center position in available space
    let x = (screenWidth - windowWidth) / 2;
    let y = (availableHeight - windowHeight) / 2;

    // Ensure window doesn't go off screen
    x = Math.max(16, Math.min(x, screenWidth - windowWidth - 16));
    y = Math.max(16, Math.min(y, availableHeight - windowHeight - 16));

    return { x: Math.round(x), y: Math.round(y) };
  }

  // Fallback for server-side rendering
  return { x: 100, y: 100 };
};

export const isWindowOpen = (id: WindowId, order: WindowId[]): boolean => {
  return order.includes(id);
};

export const isWindowMinimized = (id: WindowId, minimized: Set<WindowId>): boolean => {
  return minimized.has(id);
};

export const getWindowZIndex = (id: WindowId, order: WindowId[]): number => {
  const index = order.indexOf(id);
  return index === -1 ? 0 : index + 10;
};