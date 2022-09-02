import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import axios from 'axios';

let ip = 'localhost:3030';
if (LocalStorage.has('setup')) {
  ip = LocalStorage.getItem('setup').ip;
}

const apx = axios.create({ baseURL: 'http://' + ip });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, apx };
