import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'connect',
  state: () => ({
    connect: false,
    error: null,
  }),
  getters: {
    getConnection: (state) => {
      return state.connect;
    },
  },
  actions: {
    setConnection(val) {
      this.connect = val;
    },
  },
});
