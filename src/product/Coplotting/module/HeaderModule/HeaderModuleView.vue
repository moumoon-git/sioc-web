<template>
  <div :class="$style.HeaderModuleView">
    <HeaderLeft
      :handle-data="handleData"
      @goback="goback"
    />
    <!-- <HeaderRight /> -->
  </div>
</template>

<script lang="ts">
// import HeaderRight from './components/HeaderRight.vue';
import { defineComponent } from 'vue';
import HeaderLeft from './components/HeaderLeft.vue';

export default defineComponent({
  components: {
    // HeaderRight,
    HeaderLeft,
  },
  props: {
    handleData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    function goback() {
      context.emit('goback');
    }
    return {
      goback,
    };
  },
});
</script>

<style module>
.HeaderModuleView{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
