<template>
  <div :class="$style.imgVis">
    <ul v-viewer>
      <li v-for="attachment in data" :key="attachment.id">
        <img :src="attachment.src" :alt="attachment.name" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style module lang="scss">
.imgVis {
  width: 100%;
  height: 100%;
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    li {
      margin-right: 10px;
      width: 82px;
      height: 75px;
      border: 1px solid rgba(0, 193, 222, 1);
      box-sizing: border-box;
      img {
        width: 100%;
      }
    }
  }
}
</style>
