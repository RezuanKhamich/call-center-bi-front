import { create } from 'zustand';

export const store = create((set) => ({
  data: [],
  setData: (newData) => set({ data: newData }),
}));
