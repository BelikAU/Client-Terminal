<template>
  <q-layout view="lHh Lpr lFf" class="main-container">
    <q-page-container @mousedown.stop="userHasHold">
      <q-page class="text-white text-center q-pa-md">
        <div class="row q-pt-md">
          <div class="col-2">
            <q-btn
              v-if="backRoute"
              class="q-mt-lg"
              flat
              round
              size="xl"
              icon="mdi-keyboard-backspace"
              @click="setup()"
            />
          </div>
          <div class="col-8 q-pt-lg text-center">
            <q-img src="sochipark.svg" width="320px" />
            <span>v.{{ version }}</span>
          </div>
          <div class="col-2">
            <q-knob
              :max="290"
              v-model="duration"
              name="volume"
              class="text-white q-ma-md"
              size="90px"
              :thickness="0.1"
              color="blue-4"
              track-color="transparent"
              show-value
            >
              <q-btn flat round size="xl" icon="mdi-close" @click="home()" />
            </q-knob>
          </div>
        </div>
        <div class="column">
          <router-view ref="route" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { electronApi } from 'src/api/electron-api';

import { LocalStorage } from 'quasar';
import { version } from '../../package';

export default defineComponent({
  name: 'SetupLayout',
  components: {},

  setup() {
    const router = useRouter();
    const route = useRoute();
    const duration = ref(290);
    let timer;

    const backRoute = computed(() => {
      if (route.path === '/control' || route.path === '/menu') {
        return false;
      } else {
        return true;
      }
    });

    onMounted(() => {
      if (LocalStorage.has('setup')) {
        timer = setInterval(function () {
          duration.value--;
          if (duration.value < 0) {
            home();
          }
        }, 1000);
      }
    });

    function home() {
      electronApi.closeDevTools();
      clearInterval(timer);
      router.push({ name: 'TerminalPage' });
    }

    return {
      backRoute,
      duration,
      version,
      userHasHold() {
        duration.value = 290;
      },
      home,
      setup() {
        router.push({ name: 'MenuPage' });
      },
    };
  },
});
</script>
