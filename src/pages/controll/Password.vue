<template>
  <div class="fixed-center" style="width: 320px">
    <div class="text-h4 q-py-md" style="height: 72px">
      {{ pass }}
    </div>
    <div class="row">
      <div class="col">
        <q-btn flat round size="xl" label="1" @click="addNum('1')" />
      </div>
      <div class="col">
        <q-btn flat round size="xl" label="2" @click="addNum('2')" />
      </div>
      <div class="col">
        <q-btn flat round size="xl" label="3" @click="addNum('3')" />
      </div>
    </div>
    <div class="row q-py-md">
      <div class="col">
        <q-btn flat round size="xl" label="4" @click="addNum('4')" />
      </div>
      <div class="col">
        <q-btn flat round size="xl" label="5" @click="addNum('5')" />
      </div>
      <div class="col">
        <q-btn flat round size="xl" label="6" @click="addNum('6')" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn flat round size="xl" label="7" @click="addNum('7')" />
      </div>
      <div class="col">
        <q-btn flat round size="xl" label="8" @click="addNum('8')" />
      </div>
      <div class="col">
        <q-btn flat round size="xl" label="9" @click="addNum('9')" />
      </div>
    </div>
    <div class="row q-py-md">
      <div class="col"></div>
      <div class="col">
        <q-btn flat round size="xl" label="0" @click="addNum('0')" />
      </div>
      <div class="col">
        <q-btn
          flat
          round
          padding="lg"
          size="md"
          icon="mdi-backspace"
          @click="delNum()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup() {
    const router = useRouter();

    const inputPass = ref('');
    let pass = '';

    onMounted(() => {
      if (LocalStorage.has('setup')) {
        let setup = LocalStorage.getItem('setup');
        pass = setup.password;
      }
    });

    function checkPass() {
      if (pass === inputPass.value) {
        console.log('pass OK');
        router.push({ name: 'MenuPage' });
      }
    }
    return {
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
    };
  },
});
</script>
