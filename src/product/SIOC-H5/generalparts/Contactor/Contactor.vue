<template>
  <div class="contactor-container">
    <!-- 左边 -->
    <div
      class="contactor-container__left"
      :style="{ background: contactor.sex === '男' ? '#3296F9' : '#FF819F' }"
    >
      <img v-if="contactor.picture" :src="contactor.picture" alt="" />
      <span v-else>
        {{ name }}
      </span>
    </div>
    <!-- 中间 -->
    <div class="contactor-container__center">
      <div class="name-position">
        <span class="name">{{ contactor.name }}</span>
        <span v-if="contactor.position" class="position">{{
          contactor.position
        }}</span>
      </div>
      <div v-if="contactor.unit" class="unit">{{ contactor.unit }}</div>
    </div>
    <!-- 右边 -->
    <div v-if="contactor.title" class="contactor-container__right">
      {{ contactor.title }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
export default defineComponent({
  name: 'Contactor',
  props: {
    contactor: {
      type: Object,
      default: () => ({
        sex: '',
        picture: '',
        name: '',
        position: '',
        title: '',
        unit: '',
      }),
    },
  },
  setup(props) {
    const name = ref('');
    name.value =
      props.contactor.name.length > 2
        ? props.contactor.name.substring(1, props.contactor.name.length)
        : props.contactor.name;

    return {
      name,
    };
  },
});
</script>
<style lang="scss">
.contactor-container {
  width: 100%;
  height: 1.16rem;
  display: flex;
  align-items: center;
  border-bottom: 0.01rem solid #dddddd;

  .contactor-container__left {
    width: 0.74rem;
    height: 0.74rem;
    border-radius: 50%;
    background: #ff819f;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    & > span {
      font-size: 0.28rem;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .contactor-container__center {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0.2rem;

    .name-position {
      display: flex;
      align-items: center;
    }
    .name {
      font-size: 0.32rem;
      font-weight: 400;
      color: #333333;
      line-height: 0.45rem;
      margin-right: 0.06rem;
    }
    .position {
      font-size: 0.2rem;
      font-weight: 400;
      color: #86a0ba;
      line-height: 0.28rem;
      height: 0.28rem;
      border-radius: 0.14rem;
      border: 0.02rem solid #cdd6e1;
      padding: 0 0.12rem;
    }
    .unit {
      font-size: 0.24rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.33rem;
    }
  }
  .contactor-container__right {
    height: 0.48rem;
    background: #e6efff;
    border-radius: 0.06rem;
    font-size: 0.24rem;
    font-weight: 400;
    color: #0091ff;
    line-height: 0.48rem;
    padding: 0 0.2rem;
  }
}
</style>
