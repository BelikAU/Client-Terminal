<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from 'vue';
import { LocalStorage } from 'quasar';
import { electronApi } from 'src/api/electron-api';
import { api } from 'src/store/';
import { useAuth } from 'src/store/services/auth';

import { useStore } from 'src/store/connection';

export default defineComponent({
  name: 'App',
  setup() {
    const socket = api.io;
    const ioStore = useStore();

    const auth = useAuth();
    // auth.authenticate();

    onMounted(() => {
      LocalStorage.set('startTime', new Date());
      LocalStorage.set('statTime', new Date());

      setInterval(checkTimer, 60000);
    });

    socket.on('disconnect', (data) => {
      ioStore.setConnection(false);
      console.log('disconnect', data);
    });

    socket.on('connect', () => {
      ioStore.setConnection(true);
      console.log('connect');
      auth
        .authenticate()
        .then((val) => {
          console.log('auth status', val);
        })
        .catch(() => {
          console.log('no JWT');
          const setup = LocalStorage.getItem('setup');
          if (setup) {
            auth.authenticate({
              strategy: 'local',
              email: setup.name,
              password: setup.password,
            });
          }
        });
      // setTimeout(() => {
      //   if (!auth.isAuthenticated) {

      //   }
      // }, 60000);
    });

    socket.on('connect_error', (e) => {
      console.log('connect_error', e);
    });

    function checkTimer() {
      const useShadule = LocalStorage.getItem('setup');
      if (useShadule) {
        const time = new Date();
        const currentTime = time.getHours() * 60 + time.getMinutes();

        const _onTime = useShadule.onTime;
        const _offTime = useShadule.offTime;

        console.log('time: ', _onTime, _offTime, currentTime);

        const onTimeArr = _onTime.split(':');
        const onTime = parseInt(onTimeArr[0]) * 60 + parseInt(onTimeArr[1]);
        const offTimeArr = _offTime.split(':');
        const offTime = parseInt(offTimeArr[0]) * 60 + parseInt(offTimeArr[1]);

        if (currentTime == onTime) {
          console.log('on display');
          electronApi.displayOn();
        }
        if (currentTime == offTime) {
          console.log('off display');
          electronApi.displayOff();
        }
      }
    }
  },
});
</script>
