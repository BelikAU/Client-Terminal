<template>
  <q-layout view="lHh Lpr lFf">
    <div style="background: #000">
      <!-- <div style="color: #fff">{{ downloaded }}</div> -->
      <div style="color: #ccc; font-size: 20px">{{ pl }}</div>
      <div style="color: #aaa; font-size: 20px">{{ user }}</div>
    </div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar';
import { defineComponent, ref, computed, watch } from 'vue';
import { usePlaylist } from 'src/store/services/playlist';
import { useAuth } from 'src/store/services/auth';
import { useUsers } from 'src/store/services/users';
import { useFind, useGet } from 'feathers-pinia';
import { electronApi } from 'src/api/electron-api';
import { useStore } from 'src/store/connection';
// import { some } from 'lodash';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const playlist = usePlaylist();
    const auth = useAuth();
    const users = useUsers();
    const store = useStore();
    const downloaded = ref(null);

    const defalutPlaylist = [
      {
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

    const userID = computed(() => {
      if (auth.user) {
        return auth.user._id;
      } else {
        return false;
      }
    });

    const { item: user } = useGet({
      model: users.Model,
      id: userID,
    });

    const params = computed(() => {
      return {
        query: {},
      };
    });

    const { items: pl } = useFind({
      model: playlist.Model,
      params,
    });

    const downloadPath = electronApi.getDownloadPath();

    watch(user, (val) => {
      console.log('user', val);

      const curentPlaylist = checkForExist(pl.value, '_id', val.setup.playlist);
      if (curentPlaylist) {
        const setup = LocalStorage.getItem('setup');
        console.log('curentPlaylist', setup);
        setup.playlist = curentPlaylist;
        LocalStorage.set('setup', setup);

        store.playlistDate = new Date();
      }
      // console.log('curentPlaylist', curentPlaylist, val.setup.playlist);
    });

    watch(pl, (lists) => {
      console.log('watch', lists);
      const links = [];
      let current_Playlist = [];
      // chek pl in storage
      if (LocalStorage.has('playlist')) {
        current_Playlist = LocalStorage.getItem('playlist');
      } else {
        console.log('new playlist');
      }

      for (const list in lists) {
        for (const child in lists[list].children) {
          if (
            !checkForExist(
              current_Playlist,
              '_id',
              lists[list].children[child]._id
            )
          ) {
            links.push(
              'http://localhost:3030/' + lists[list].children[child].data.link
            );
          }
        }
      }

      replaceLink(lists);
      if (links.length > 0) {
        electronApi.sendLinkToDownload(links).then(() => {
          console.log('download-finished');
        });
      }
    });

    function replaceLink(lists) {
      for (const list in lists) {
        for (const child in lists[list].children) {
          let filePath =
            'file:///' +
            downloadPath +
            '//' +
            lists[list].children[child].data.link;

          lists[list].children[child].data.link = filePath.replace(
            /\134/g,
            '//'
          );
          lists[list].children[child].data.link = lists[list].children[
            child
          ].data.link.replace('C:/', 'C://');
        }
        //
      }
      LocalStorage.set('playlist', defalutPlaylist.concat(lists));
      downloaded.value = defalutPlaylist.concat(lists);
    }

    function checkForExist(array, key, value) {
      var o;
      array.some(function iter(a) {
        if (a[key] === value) {
          o = a;
          return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
      });
      if (typeof o !== 'undefined') {
        return o;
      } else {
        return false;
      }
    }

    return {
      pl,
      user,
      downloaded,
    };
  },
});
</script>
