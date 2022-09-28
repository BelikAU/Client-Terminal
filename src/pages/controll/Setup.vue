<template>
  <div class="text-center flex flex-top q-pt-xl">
    <div class="row justify-center full-width">
      <!-- setup content -->
      <div class="col-8 q-gutter-y-md">
        <!-- title -->
        <div class="row q-pb-lg q-px-md">
          <div class="col text-left text-h6">Настройки {{ time }}</div>
          <div class="col text-right">
            <q-icon v-if="store.connect" size="md" name="mdi-cloud-check" />
            <q-icon v-else size="md" name="mdi-cloud-off-outline" />
            <span class="q-pl-md">
              <q-icon
                v-if="auth.isAuthenticated"
                size="md"
                name="mdi-account-check-outline"
              />
            </span>
          </div>
        </div>
        <!-- Server IP -->
        <div class="row">
          <q-input
            class="col"
            filled
            dark
            v-model="mainSetup.ip"
            hint="Сервер"
            input-class="text-subtitle1"
          />
          <q-btn
            class="col-auto q-ml-sm"
            flat
            rounded
            :loading="connecting"
            @click="reconnect"
            icon="mdi-sync"
            size="14px"
            style="height: 56px"
          />
        </div>
        <!-- Terminal Name -->
        <div>
          <q-input
            filled
            dark
            v-model="mainSetup.name"
            hint="Имя терминала"
            input-class="text-subtitle1"
            @change="showKeyboard()"
          />
        </div>
        <!-- Password -->
        <div class="row">
          <q-input
            class="col"
            v-model="mainSetup.password"
            filled
            dark
            :type="isPwd ? 'password' : 'text'"
            hint="Пароль"
            @change="showKeyboard()"
          />
          <q-btn
            class="col-auto q-ml-sm"
            flat
            rounded
            @click="isPwd = !isPwd"
            :icon="isPwd ? 'visibility_off' : 'visibility'"
            size="14px"
            style="height: 56px"
          />
        </div>
        <!-- back time -->
        <div class="q-px-md q-pt-md">
          <q-slider
            v-model="mainSetup.backTime"
            :min="30"
            :max="300"
            :step="30"
            dark
            color="grey-2"
          />
        </div>
        <div
          class="text-left q-field__bottom"
          style="color: rgba(255, 255, 255, 0.7); padding-top: 0"
        >
          Время возврата на постер: {{ mainSetup.backTime / 60 }} мин.
        </div>
        <!-- playlist -->
        <div class="row">
          <q-select
            class="col"
            filled
            dark
            v-model="mainSetup.playlist"
            hint="Плей лист"
            :options="playlistOptions"
            behavior="dialog"
          />
          <q-btn
            class="col-auto q-ml-sm"
            flat
            rounded
            @click="playlistDialog = true"
            icon="mdi-playlist-play"
            size="14px"
            style="height: 56px; padding-top: 12px"
          />
        </div>
        <!-- Playlist Dialog -->
        <q-dialog v-model="playlistDialog">
          <q-card dark class="text-white" style="width: 500px">
            <q-card-section>
              <div class="text-subtitle1 text-center">Плейлист</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-tree :nodes="[playlist]" node-key="_id" default-expand-all>
                <template v-slot:header-generic="prop">
                  <div class="items-center text-white">
                    <div class="row">
                      <q-icon
                        :name="getTypeIcon(prop.node.data.type)"
                        color="primary"
                        size="18px"
                        class="q-mr-sm"
                      />
                      <div class="text-body2">{{ prop.node.label }}</div>
                    </div>
                    <div class="row" v-if="prop.node.data.type !== 'playlist'">
                      <div class="text-caption">
                        {{ getTime(prop.node.data.lastModified) }}
                      </div>
                      <div class="text-caption q-pl-sm">
                        {{ getSize(prop.node.data.size) }}
                      </div>
                      <div
                        v-if="prop.node.data.duration"
                        class="text-caption q-pl-sm"
                      >
                        {{ prop.node.data.duration }}сек
                      </div>
                    </div>
                  </div>
                </template>
              </q-tree>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn color="orange" flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- on/off Timer -->
        <div class="text-left">
          <q-toggle
            v-model="mainSetup.useShadule"
            dark
            label="Работать по расписанию"
            color="grey-2"
          />
        </div>
        <!-- time select -->
        <div class="row">
          <div class="col">
            <div class="row">
              <q-btn
                class="col-auto q-mr-sm"
                flat
                rounded
                icon="mdi-clock"
                size="14px"
                style="height: 56px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    color="orange"
                    landscape
                    dark
                    v-model="mainSetup.onTime"
                  />
                </q-popup-proxy>
              </q-btn>
              <q-input
                class="col"
                filled
                dark
                v-model="mainSetup.onTime"
                mask="time"
                :rules="['time']"
                hint="Время включения"
                input-class="text-subtitle1"
                :disable="!mainSetup.useShadule"
              />
            </div>
          </div>
          <div class="col">
            <div class="row q-ml-sm">
              <q-btn
                class="col-auto q-mr-sm"
                flat
                rounded
                icon="access_time"
                size="14px"
                style="height: 56px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    color="orange"
                    landscape
                    dark
                    v-model="mainSetup.offTime"
                  />
                </q-popup-proxy>
              </q-btn>
              <q-input
                class="col"
                filled
                dark
                v-model="mainSetup.offTime"
                mask="time"
                :rules="['time']"
                hint="Время выключения"
                input-class="text-localSetup.subtitle1"
                :disable="!mainSetup.useShadule"
              />
            </div>
          </div>
        </div>
        <!-- save button -->
        <div class="row q-pt-xl">
          <div class="text-right">
            <q-btn
              outline
              rounded
              size="16px"
              icon="mdi-close"
              label="Сбросить настройки"
              @click="clear()"
            />
          </div>
          <q-space />
          <div class="text-right">
            <q-btn
              outline
              rounded
              size="16px"
              icon="mdi-check"
              label="Сохранить"
              @click="saveSetup()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, LocalStorage, date, format } from 'quasar';
import { useStore } from 'src/store/app';
// service
import { api } from 'src/store/';
import { useUsers } from 'src/store/services/users';
import { useAuth } from 'src/store/services/auth';

export default defineComponent({
  name: 'PageSetup',
  components: {},
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const userStore = useUsers();
    const auth = useAuth();

    const playlistDialog = ref(false);

    const store = useStore();
    const connecting = ref(false);

    const time = ref(null);
    let timeTimer;

    const playlist = {
      label: 'NO POSTER',
      header: 'generic',
      data: { type: 'playlist', timestamp: 1663678405420 },
      children: [
        {
          _id: '0',
          label: 'image 1',
          header: 'generic',
          data: {
            link: 'file:///C:///TerminalApps//PlayList//error.png',
            type: 'image/png',
            duration: 20,
          },
        },
      ],
    };

    const defaultSetup = {
      id: '',
      name: 'new-user',
      password: '4478',
      onTime: '08:00',
      offTime: '23:00',
      useShadule: false,
      backTime: 30,
      playlist: playlist,
      ip: 'localhost:3030',
    };
    const mainSetup = ref(defaultSetup);

    const defalutPlaylists = [
      {
        label: 'NO POSTER',
        header: 'generic',
        data: { type: 'playlist', timestamp: 1663678405420 },
        children: [
          {
            _id: '0',
            label: 'NO IMAGE',
            header: 'generic',
            data: {
              link: 'file:///C:///TerminalApps//PlayList//error.png',
              type: 'image/png',
              duration: 20,
            },
          },
        ],
      },
      {
        label: 'Default MP4',
        header: 'generic',
        data: { type: 'playlist', timestamp: 1663678405420 },
        children: [
          {
            _id: '1',
            label: 'default video',
            header: 'generic',
            data: {
              link: 'file:///C:///TerminalApps//PlayList//default.mp4',
              type: 'video/mp4',
              duration: 0,
            },
          },
        ],
      },
    ];

    const playlistOptions = ref(defalutPlaylists);

    onMounted(() => {
      if (LocalStorage.has('setup')) {
        mainSetup.value = LocalStorage.getItem('setup');
      }

      if (LocalStorage.has('playlists')) {
        playlistOptions.value = LocalStorage.getItem('playlists');
      } else {
        playlistOptions.value = defalutPlaylists;
      }

      // display time
      time.value = date.formatDate(new Date(), "HH:mm'ss");
      timeTimer = setInterval(() => {
        time.value = date.formatDate(new Date(), "HH:mm'ss");
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(timeTimer);
    });

    // save setup data
    function saveSetup() {
      if (store.connect) {
        if (mainSetup.value.id == '') {
          auth
            .authenticate({
              strategy: 'local',
              email: mainSetup.value.name,
              password: mainSetup.value.password,
            })
            .then((auth) => {
              LocalStorage.set('setup', mainSetup.value);
              //
              updateServerUser(auth.user);
              // updateLocalUser();
              console.log('mainSetup.value.id == ', auth.user);
              router.push({ name: 'MenuPage' });
            })
            .catch((error) => {
              console.log('error auth', error);
              $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: 'Неверное имя или пароль.',
                position: 'top',
              });
            });
        } else {
          LocalStorage.set('setup', mainSetup.value);

          // update treminal service
          userStore.get(mainSetup.value.id).then((terminal) => {
            terminal.email = mainSetup.value.name;
            terminal.password = mainSetup.value.password;
            terminal.timeStamp = Math.floor(Date.now() / 1000);
            terminal.setup = {
              useShadule: {
                state: mainSetup.value.useShadule,
                onTime: mainSetup.value.onTime,
                offTime: mainSetup.value.offTime,
              },
              backTime: mainSetup.value.backTime,
              playlist: mainSetup.value.playlist,
            };
            terminal.patch();
          });

          router.push({ name: 'MenuPage' });
        }
      } else {
        LocalStorage.set('setup', mainSetup.value);
        router.push({ name: 'MenuPage' });
      }
    }

    function updateServerUser(user) {
      console.log('user from auth', user);
      // user.setup = mainSetup.value;
      // user.patch();
    }

    function updateLocalUserSetup() {}

    return {
      store,
      auth,
      connecting,
      time,
      mainSetup,
      isPwd: ref(true),
      playlistDialog,
      playlist,
      playlistOptions,
      saveSetup,
      clear() {
        $q.dialog({
          dark: true,
          message: 'Сбросить настройки терминала?',
        }).onOk(() => {
          auth.logout();
          mainSetup.value = defaultSetup;
          LocalStorage.clear();
          LocalStorage.set('startTime', new Date());
          LocalStorage.set('statTime', new Date());
        });
      },

      reconnect() {
        api.io.io.uri = 'http://' + mainSetup.value.ip;
        console.log('api connected', api.io);
        connecting.value = true;
        setTimeout(() => {
          connecting.value = false;
        }, 3000);
      },

      getItemPath(val) {
        const pathArr = val.split('//');
        const sdf = pathArr.slice(-2);
        return sdf[0] + ' / ' + sdf[1];
        // return val;
      },

      getTypeIcon(type) {
        if (type == 'image/jpeg' || type == 'image/png') {
          return 'mdi-file-image';
        } else if (type == 'video/mp4' || type == 'video/quicktime') {
          return 'mdi-filmstrip';
        } else {
          return 'mdi-playlist-play';
        }
      },

      getSize(val) {
        return format.humanStorageSize(Number(val));
      },

      getTime(timeStamp) {
        return date.formatDate(timeStamp, 'DD.MM.YYYY HH:mm');
      },
    };
  },
});
</script>
