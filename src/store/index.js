import { store } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import { createPinia } from 'pinia';

import { setupFeathersPinia } from 'feathers-pinia';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import auth from '@feathersjs/authentication-client';

let ip = process.env.SERVER_URL;
if (LocalStorage.has('setup')) {
  ip = LocalStorage.getItem('setup').ip;
}

const socket = io('http://' + ip, {
  transports: ['websocket'],
  extraHeaders: {
    token: 'some-token-value',
  },
});

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();
  // You can add Pinia plugins here
  return pinia;
});

// This variable name becomes the alias for this server.
export const api = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }));

export const { defineStore, BaseModel } = setupFeathersPinia({
  clients: { api },
  idField: '_id',
});
