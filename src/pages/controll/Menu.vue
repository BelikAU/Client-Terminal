<template>
  <div class="text-center flex flex-center" style="height: 800px">
    <div class="column" style="width: 620px">
      <!-- Повер -->
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Перезагрузить"
            @click="reboot()"
          />
        </div>
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Выключить"
            @click="shutdown()"
          />
        </div>
      </div>
      <!-- Apps -->
      <div class="row q-col-gutter-lg q-pt-lg">
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Рестарт"
            @click="restart()"
          />
        </div>
        <div class="col-6">
          <!--  -->
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="DEV TOOLS"
            @click="showDevTools()"
          />
        </div>
      </div>
      <!-- Приложения -->
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Explorer"
            @click="runExplorer()"
          />
        </div>
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="iliTuningTool"
            @click="runTuning()"
          />
        </div>
      </div>
      <!--  -->
      <div class="row q-col-gutter-lg q-pt-lg">
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Статистика"
            @click="goStat"
          />
        </div>
        <div class="col-6">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Информация"
            @click="goInfo()"
          />
        </div>
      </div>
      <!--  -->
      <div class="row q-col-gutter-lg q-pt-lg">
        <div class="col-12">
          <q-btn
            outline
            class="full-width"
            size="lg"
            label="Настройка"
            @click="goSetup()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { electronApi } from 'src/api/electron-api';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup() {
    const router = useRouter();
    const $q = useQuasar();

    const inputPass = ref('');
    const pass = '447800';
    const auth = ref(false);

    function checkPass() {
      // console.log('pass', inputPass.value);
      if (pass === inputPass.value) {
        // console.log('pass OK');
        auth.value = true;
      }
    }
    return {
      auth,
      volume: ref(80),
      home() {
        router.push({ name: 'PostersPage' });
      },
      addNum(val) {
        if (inputPass.value.length < 9) {
          inputPass.value = inputPass.value + val.toString();
          checkPass();
        }
      },
      delNum() {
        inputPass.value = inputPass.value.slice(0, -1);
      },
      pass: computed(() => {
        let passStr = '##########';
        return passStr.slice(0, -(10 - inputPass.value.length));
      }),
      reboot() {
        $q.dialog({
          dark: true,
          message: 'Перегрузить терминал',
        })
          .onOk(() => {
            electronApi.reboot();
          })
          .onCancel(() => {
            console.log('Cancel');
          });
      },
      shutdown() {
        $q.dialog({
          dark: true,
          message: 'Выключить терминал',
        })
          .onOk(() => {
            electronApi.shutdown();
          })
          .onCancel(() => {
            console.log('Cancel');
          });
      },
      restart() {
        electronApi.restartApp();
      },
      goStat() {
        router.push({ name: 'StatPage' });
      },
      goInfo() {
        router.push({ name: 'InfoPage' });
      },
      disableTouch(val) {
        electronApi.disableTouch(val);
      },
      runExplorer() {
        electronApi.runExplorer();
      },
      runTuning() {
        electronApi.runTuning();
      },
      goSetup() {
        router.push({ name: 'SetupPage' });
      },
      showDevTools() {
        electronApi.showDevTools();
      },
      // };
      // displaySleep() {
      //   electronApi.disableTouch(true);
      //   let timOff = setTimeout(() => {
      //     electronApi.disableTouch(false);
      //     clearInterval(timOff);
      //   }, 30000);
      // },
    };
  },
});
</script>
