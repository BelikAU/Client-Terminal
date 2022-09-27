<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from 'vue';
import { LocalStorage } from 'quasar';
import { electronApi } from 'src/api/electron-api';
import { api } from 'src/store/';
import { useAuth } from 'src/store/services/auth';

import { useStore } from 'src/store/app';

export default defineComponent({
  name: 'App',
  setup() {
    const socket = api.io;
    const store = useStore();

    const auth = useAuth();

    onMounted(() => {
      LocalStorage.set('startTime', new Date());
      LocalStorage.set('statTime', new Date());

      setInterval(checkTimer, 60000);
    });

    socket.on('disconnect', (data) => {
      store.setConnection(false);
      console.log('disconnect', data);
    });

    socket.on('connect', () => {
      store.setConnection(true);
      console.log('connect', auth);
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
    });

    socket.on('connect_error', (e) => {
      console.log('connect_error', e);
    });

    // 1 min timer for display OFF
    function checkTimer() {
      const useShadule = LocalStorage.getItem('setup');
      if (useShadule) {
        const time = new Date();
        const currentTime = time.getHours() * 60 + time.getMinutes();

        const _onTime = useShadule.onTime;
        const _offTime = useShadule.offTime;

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
