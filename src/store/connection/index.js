import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'connect',
  state: () => ({
    connect: false,
    error: null,
    playlistDate: 0,
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
    playlistUpdated(date) {
      this.playlistDate = date;
    },
  },
});
