<template>
  <q-layout view="lHh Lpr lFf">
    <div style="background: #000">
      <div style="color: #fff">{{ pl }}</div>
      <div style="color: #ccc">{{ downloaded }}</div>
      <div style="color: #aaa">{{ user }}</div>
    </div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { usePlaylist } from 'src/store/services/playlist';
import { useAuth } from 'src/store/services/auth';
import { useUsers } from 'src/store/services/users';
import { useFind, useGet } from 'feathers-pinia';
import { electronApi } from 'src/api/electron-api';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const playlist = usePlaylist();
    const auth = useAuth();
    const users = useUsers();

    const downloaded = ref(null);

    const params = computed(() => {
      return {
        query: {},
      };
    });

    const userID = computed(() => {
      if (auth.user) {
        return auth.user._id;
      } else {
        return false;
      }
    });

    const { items: pl } = useFind({
      model: playlist.Model,
      params,
    });

    const { item: user } = useGet({
      model: users.Model,
      id: userID,
    });

    watch(pl, (lists) => {
      const links = [];
      for (const list in lists) {
        for (const child in lists[list].children) {
          console.log('file:', lists[list].children[child]);
          links.push(
            'http://localhost:3030/' + lists[list].children[child].data.link
          );
        }
      }
      console.log('links', links);
      electronApi.sendLinkToDownload(links).then((val) => {
        downloaded.value = val;
      });
    });

    watch(user, (val) => {
      console.log('user', val, pl.value);
    });

    const defalutPlaylist = [
      {
        label: 'NO POSTER',
        header: 'generic',
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
      },
      {
        label: 'Default MP4',
        header: 'generic',
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

    return {
      pl,
      user,
      downloaded,
    };
  },
});
</script>
