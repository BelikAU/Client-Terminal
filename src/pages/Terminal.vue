<template>
  <q-page>
    <div>
      <webview
        ref="webview"
        :src="terminalURL"
        style="position: absolute; width: 100%; height: 100%"
        :preload="preloadPath"
      />
    </div>
    <q-linear-progress
      v-show="!posterState"
      :value="progress"
      :animation-speed="300"
      color="warning"
    />
    <!-- POSTERS STATE -->
    <div v-show="posterState" ref="poster">
      <div class="bg-black" />
      <poster-component />
      <div v-show="online" class="nav-button text-white">
        <q-btn unelevated rounded outline @click="showTerminal()">
          <img src="terminal_button.svg" style="width: 500px" />
        </q-btn>
      </div>
    </div>
    <!-- menu button -->
    <div class="touch-container" @click="handleSetup()">
      <q-img class="input-button" src="app-bear.png" no-spinner width="166px" />
    </div>
  </q-page>
</template>

<script>
import { electronApi } from 'src/api/electron-api';
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue';
import PosterComponent from 'components/PosterComponent.vue';
import { LocalStorage } from 'quasar';
import anime from 'animejs';
import { useRouter } from 'vue-router';
import useStore from 'src/store/stat';
// service
import { useWarning } from 'src/store/services/warningService';

export default defineComponent({
  name: 'TerminalPage',
  components: {
    PosterComponent,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const posterState = ref(true);
    const online = ref(false);

    // terminal
    const webview = ref(null);
    const poster = ref(null);
    const homePage = 'https://www.terminal.sochipark.ru/menu/';
    // const homePage = 'https://www.sochipark.ru/menu/';
    const terminalURL = ref(homePage);

    // back time in seconds
    const backTick = ref(0);
    let backTime = 0;
    let backTimer;
    let clickCount = 0;

    // feathers service
    const warningStore = useWarning();
    const Warning = warningStore.Model;

    // touch detect
    let touchCount = 0;
    let touchStart = 0;
    let noPoster = false;

    onMounted(() => {
      if (LocalStorage.has('setup')) {
        let setup = LocalStorage.getItem('setup');
        backTime = setup.backTime;
        // no poster
        if (setup.playlist.label == 'NO POSTER') {
          noPoster = true;
          posterState.value = false;
          showTerminal();
        }
      }

      webview.value.addEventListener('did-stop-loading', () => {
        console.log('did-stop-loading');
        let title = webview.value.getTitle();
        // save to Store
        if (
          title != 'Афиша мероприятий' ||
          title != 'https://www.terminal.sochipark.ru/menu/'
        ) {
          store.addPages(title);
        }
      });

      // error
      webview.value.addEventListener('did-fail-load', (error) => {
        console.log('did-fail-load', error);
        sendWarning('did_fail_load');
      });

      webview.value.addEventListener('crashed', () => {
        console.log('crashed');
        sendWarning('crashed');
      });

      // site error dom-ready
      webview.value.addEventListener('dom-ready', () => {
        console.log('dom-ready');
        // webview.value.openDevTools();
        webview.value.addEventListener(
          'ipc-message',
          (event) => {
            switch (event.channel) {
              case 'site error':
                console.log('siteErrorEvent', event);
                sendWarning('site_fail');
                break;
              case 'site ok':
                // console.log('site ok', event);
                online.value = true;
                let title = webview.value.getTitle();
                console.log('title', title);
                if (noPoster) {
                  if (title != 'Афиша мероприятий') {
                    showTerminal();
                  } else {
                    backTick.value = 0;
                    clearInterval(backTimer);
                  }
                }
                break;
              case 'touch error':
                console.log('touchErrorEvent', event);
                break;
            }
          },
          { once: true }
        );
      });

      // poster event
      document.body.addEventListener('touchstart', touchStartEvent);
      document.body.addEventListener('touchend', touchEndEvent);

      // animation
      anime({
        targets: '.nav-button',
        scale: 1.1,
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 1000,
        loop: true,
      });
    });

    function touchStartEvent(event) {
      let dif = event.timeStamp - touchStart;
      // console.log('start dif', dif, touchCount);
      if (dif < 1000) {
        touchCount++;
        if (touchCount >= 40) {
          console.log('touch error', touchCount);
          const warning = new Warning({ type: 'mutch_touch' });
          warning.timeStamp = Math.floor(Date.now() / 1000);
          warning.save();
          touchCount = 0;
        }
      } else if (dif > 5000) {
        touchCount = 0;
      }
      touchStart = event.timeStamp;
    }

    function touchEndEvent(event) {
      let dif = event.timeStamp - touchStart;
      // console.log('stop dif', dif);
      if (dif > 3000) {
        console.log('touch error to long', dif);
        const warning = new Warning({ type: 'long_touch' });
        warning.timeStamp = Math.floor(Date.now() / 1000);
        warning.save();
      }
    }

    onUnmounted(() => {
      console.log('unmount TerminalPage');
      clearInterval(backTimer);
      // remove event
      document.body.removeEventListener('touchstart', touchStartEvent);
      document.body.removeEventListener('touchend', touchEndEvent);
    });

    const progress = computed(() => {
      return 1 - (backTime - backTick.value) / backTime;
    });

    // send warning to host
    function sendWarning(value) {
      const warning = new Warning({ type: value });
      warning.timeStamp = Math.floor(Date.now() / 1000);
      warning.save();
      errorSite();
    }

    function showTerminal() {
      backTick.value = backTime;
      posterState.value = false;
      clearInterval(backTimer);
      backTimer = setInterval(updateInterval, 1000);
    }

    function showPoster() {
      posterState.value = true;
      clearInterval(backTimer);
      webview.value.loadURL(terminalURL.value);
    }

    function errorSite() {
      online.value = false;
      posterState.value = true;
      setTimeout(() => {
        webview.value.loadURL(terminalURL.value);
      }, 120000);
    }

    function updateInterval() {
      backTick.value--;
      if (backTick.value == 0) {
        if (noPoster) {
          webview.value.loadURL(terminalURL.value);
          clearInterval(backTimer);
        } else {
          showPoster();
        }
      }
    }

    function handleSetup() {
      clickCount++;
      if (clickCount === 10) {
        clickCount = 0;
        router.push({ name: 'ControlPage' });
      }
    }

    return {
      webview,
      poster,
      terminalURL,
      posterState,
      progress,
      online,
      preloadPath: ref(
        'file:' + electronApi.getPath() + '\\js\\webwiev-preload.js'
      ),
      showTerminal,
      handleSetup,
    };
  },
});
</script>
