<template>
  <div class="text-center flex flex-top">
    <div class="column text-white text-center full-width">
      <!-- titile -->
      <div class="row">
        <div class="col-2"></div>
        <!-- stat content -->
        <div class="col-8 q-gutter-y-md">
          <!-- title -->
          <div class="row q-pb-lg q-px-md">
            <div class="col text-left text-h6">
              Просмотры: c {{ statTime
              }}<span class="text-h4 q-pl-md">{{ linkCount }}</span>
            </div>
            <div class="col text-right">
              <q-btn flat round size="lg" icon="mdi-delete" @click="clear()" />
            </div>
          </div>
          <!-- stat -->
          <div class="text-grey-9">
            <apexchart
              type="treemap"
              height="1500"
              :options="chartOptions"
              :series="ser"
            ></apexchart>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import useStore from 'src/store/stat';
import VueApexCharts from 'vue3-apexcharts';
import { forEach } from 'lodash';
import { LocalStorage, date } from 'quasar';

export default defineComponent({
  name: 'PageStat',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    return {
      store,
      back() {
        router.push({ name: 'MenuPage' });
      },
      clear() {
        LocalStorage.set('statTime', new Date());
        store.clearPage();
        router.push({ name: 'MenuPage' });
      },
      ser: computed(() => {
        let series = [{ data: [] }];
        forEach(store.pages, function (value, key) {
          series[0].data.push({ x: value.title, y: value.count });
        });
        return series;
      }),
      linkCount: computed(() => {
        let count = 0;
        forEach(store.pages, function (value) {
          count = count + value.count;
        });
        return count;
      }),
      chartOptions: {
        legend: {
          show: false,
        },
        plotOptions: {
          treemap: {
            colorScale: {
              ranges: [
                {
                  from: 1,
                  to: 2,
                  color: '#CD363A',
                },
                {
                  from: 3,
                  to: 6,
                  color: '#52B12C',
                },
              ],
            },
          },
        },
        chart: {
          toolbar: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },

          animations: {
            enabled: false,
            dynamicAnimation: {
              enabled: false,
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (text, op) {
            return text + ' (' + op.value + ')';
          },
          offsetY: 0,
        },
      },
      statTime: ref(
        date.formatDate(LocalStorage.getItem('statTime'), 'DD.MM.YYYY')
      ),
    };
  },
});
</script>
