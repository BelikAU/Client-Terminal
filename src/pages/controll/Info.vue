<template>
  <div class="text-center flex flex-top">
    <div class="column text-white text-center full-width">
      <!-- title -->
      <div class="row">
        <div class="col-2"></div>
        <!-- info content -->
        <div class="col-8 q-gutter-y-md">
          <div class="text-h6 q-py-md">
            Время включения: <span>{{ startTime }}</span>
          </div>
          <!-- ip -->
          <div
            v-for="item in info"
            :key="item"
            class="text-center"
            style="width: 100%"
          >
            <div class="text-h6 q-py-md">{{ item[0] }}</div>
            <div class="text-body1" v-for="ip in item[1]" :key="ip">
              <div v-if="ip.family === 'IPv4'">
                <div>family: {{ ip.family }}</div>
                <div>ip: {{ ip.address }}</div>
                <div>netmask: {{ ip.netmask }}</div>
                <div>mac: {{ ip.mac }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useStore from 'src/store';
import { toPairs } from 'lodash';
import { LocalStorage } from 'quasar';

export default defineComponent({
  name: 'PageInfo',
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const info = ref('');

    onMounted(() => {
      let netInfo = getInfo();
      info.value = toPairs(netInfo);
      console.log('info.value', toPairs(netInfo));
    });

    const getInfo = () => {
      return electronApi.networkInterfaces();
    };

    return {
      store,
      info,
      back() {
        router.push({ name: 'MenuPage' });
      },
      startTime: ref(LocalStorage.getItem('startTime')),
    };
  },
});
</script>
