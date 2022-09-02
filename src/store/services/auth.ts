import { defineAuthStore } from 'feathers-pinia';
import { api as feathersClient } from 'src/store/index';

export const useAuth = defineAuthStore({
  feathersClient,
  actions: {
    async logout() {
      this.isAuthenticated = false;
      await feathersClient.logout();
    },
  },
});
