<template>
  <div :class="$style.container">
    <section>
      <Left />
    </section>
    <section>
      <Middle />
    </section>
    <section>
      <Right />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Left from './modules/Left/Left.vue';
import Middle from './modules/Middle/Middle.vue';
import Right from './modules/Right/Right.vue';
import './assets/css/common.css'; // 公共css

export default defineComponent({
  components: {
    Left,
    Middle,
    Right,
  },
});
</script>

<style lang="scss" module>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 70px;
  padding: 0 35px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  & > section {
    padding-top: 38px;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
