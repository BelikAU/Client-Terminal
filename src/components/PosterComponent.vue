<template>
  <!-- <div class="bg-black" /> -->
  <div class="afish">
    <q-carousel
      ref="poster"
      class="carusel"
      animated
      v-model="slide"
      :navigation="true"
      infinite
      :arrows="false"
      :autoplay="false"
    >
      <q-carousel-slide
        v-for="slide in playList.children"
        :key="slide._id"
        :name="slide._id"
      >
        <video
          v-if="
            slide.data.type == 'video/mp4' ||
            slide.data.type == 'video/quicktime'
          "
          :src="slide.data.link"
          class="absolute-full"
          preload="auto"
          no-controls
          autoplay
          playsinline
          :loop="slide.data.loop"
          muted
          @ended="onEnd()"
        />
        <q-img
          v-else-if="
            slide.data.type == 'image/png' || slide.data.type == 'image/jpeg'
          "
          class="absolute-full"
          :src="slide.data.link"
          width="1080"
          @load="startDelay(slide.data.duration)"
        />
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar';
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useStore } from 'src/store/connection';

export default defineComponent({
  name: 'PosterComponent',
  setup(props) {
    const slide = ref(4);
    const poster = ref(null);
    const store = useStore();

    const playList = ref(LocalStorage.getItem('setup').playlist);

    onMounted(() => {
      poster.value.next();
    });

    watch(
      () => store.playlistDate,
      (val) => {
        // console.log('playlistDate updated', val);
        playList.value = LocalStorage.getItem('setup').playlist;
        slide.value = 0;
        poster.value.next();
      }
    );

    return {
      slide,
      poster,
      onEnd() {
        // console.log('newxt post');
        poster.value.next();
      },
      startDelay(delay) {
        setTimeout(() => {
          poster.value.next();
        }, delay * 1000);
      },
      playList,
    };
  },
});
</script>
