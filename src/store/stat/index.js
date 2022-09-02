import { defineStore } from 'pinia';
import { some, forEach } from 'lodash';

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
const useStore = defineStore('storeId', {
  state: () => {
    return {
      pages: [],
    };
  },
  getters: {
    // fullName: (state) => `${state.firstName} ${state.lastName}`,
  },
  actions: {
    addPages(title) {
      let somePage = some(this.pages, { title: title });
      if (!somePage) {
        this.pages.push({ title: title, count: 1 });
      } else {
        forEach(this.pages, function (value, key) {
          if (value.title == title) {
            value.count++;
          }
        });
      }
    },
    clearPage() {
      this.pages = [];
    },
  },
});

export default useStore;
