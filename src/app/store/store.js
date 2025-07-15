import { create } from 'zustand';
import zukeeper from 'zukeeper';

export const biStore = create(
  zukeeper((set) => ({
    data: [],
    moList: [],
    userInfo: null,
    reports: [],
    setMoList: (list) => set({ moList: list }),
    setReports: (list) => set({ reports: list }),
    setUserInfo: (info) => set({ userInfo: info }),
    setData: (newData) => set({ data: newData }),
  }))
);

// Добавить store в window для отладки
window.store = biStore;

export default biStore;
