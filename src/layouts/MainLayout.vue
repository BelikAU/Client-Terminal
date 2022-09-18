<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed, watch } from 'vue';
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

    const params = computed(() => {
      return {
        query: {},
      };
    });

    const userID = computed(() => {
      return auth.user._id;
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
      // console.log('play list', lists, user.value);
      const links = [];
      for (const list in lists) {
        // console.log('play list', lists[list]);
        for (const child in lists[list].children) {
          links.push(
            'http://localhost:3030/' + lists[list].children[child].data.link
          );
        }
      }
      console.log('links', links);
      electronApi.sendLinkToDownload(links);
    });

    watch(user, (val) => {
      console.log('user', val, pl.value);
    });

    return {
      pl,
      user,
    };
  },
});
</script>
