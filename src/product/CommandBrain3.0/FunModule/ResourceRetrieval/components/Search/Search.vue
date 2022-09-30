<template>
  <div :class="$style['visualization-right-search']">
    <transition-group name="fade">
      <input
        v-if="!mapRouteVisible"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
        @keydown.enter="handleChange"
        @focus="focusFun"
        @blur="blurFun"
      />
      <div v-else :class="$style['map-route-wrap']">
        <label
          v-for="(labItem, labIndex) in mapRouteList"
          :key="labIndex"
          :class="{
            [$style['route-label--active']]: mapRouteActiveIndex === labIndex,
          }"
          @click="onHandleMapRouteClick(labIndex)"
        >
          {{ labItem.name }}
        </label>
      </div>
    </transition-group>
    <i
      :class="{
        [$style['clear']]: modelValue && !mapRouteVisible,
        [$style['clear-visible']]: modelValue && !mapRouteVisible,
        [$style['close']]: mapRouteVisible && mapRouteVisible,
        [$style['close-visible']]: mapRouteVisible && mapRouteVisible,
        [$style['map-route-icon']]: !modelValue && !mapRouteVisible,
        [$style['map-route-icon-visible']]: !modelValue && !mapRouteVisible,
      }"
      @click="handleClear"
    />
    <button @click="handleChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';

export default defineComponent({
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键词',
    },
    modelValue: {
      type: String,
      default: '',
    },
    modelModifiers: {
      type: Object,
      default: () => ({}),
    },
    // 地图路线输入框是否可见
    mapRouteVisible: {
      type: Boolean,
      default: true,
    },
    // 地图路线ActiveInde
    mapRouteActiveIndex: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'focus',
    'blur',
    'update:modelValue',
    'change',
    'update:mapRouteVisible',
    'update:mapRouteActiveIndex',
    'onHandleMapRouteClick',
  ],
  setup() {
    // 地图路线列表
    const mapRouteList = ref([
      {
        name: '步行',
      },
      {
        name: '骑行',
      },
      {
        name: '驾车',
      },
    ]);
    // 控制mainView切换
    const mainViewType = inject('mainViewType');
    return {
      mapRouteList,
      mainViewType,
    };
  },
  watch: {
    mainViewType(newValue, oldValue) {
      if (this.mainViewType === 'MapRoute') {
        this.$emit('update:mapRouteVisible', !this.mapRouteVisible);
      }
    },
  },
  methods: {
    handleInput(event: Event): void {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
      // if (!this.modelModifiers.lazy) {
      // this.$emit('change', (event.target as HTMLInputElement).value);
      // }
    },
    handleChange(event: Event): void {
      // if (this.modelModifiers.lazy) {
      this.$emit('change', (event.target as HTMLInputElement).value);
      // }
    },
    handleClear() {
      (this as any).$store.commit('retrieval/SET_isClosePeripheralSearch', true);
      if (this.modelValue && !this.mapRouteVisible) {
        this.$emit('update:modelValue', '');
        return;
      }
      if (this.mainViewType === 'RetrievalList') {
        this.$emit('update:modelValue', '');
        this.mainViewType = 'MapRoute';
      } else {
        this.mainViewType = 'RetrievalList';
        this.$emit('change', '');
        this.$emit('update:mapRouteVisible', !this.mapRouteVisible);
      }
    },
    // 地图路线类型切换
    onHandleMapRouteClick(labIndex: any) {
      this.$emit('update:mapRouteActiveIndex', labIndex);
      (this as any).$nextTick(() => {
        this.$emit('onHandleMapRouteClick');
      });
    },
    focusFun() {
      this.$emit('focus', '');
    },
    blurFun() {
      this.$emit('blur', '');
    },
  },
});
</script>

<style lang="scss" module>
.visualization-right-search {
  display: inline-flex;
  width: 198px;
  height: 38px;
  line-height: 38px;
  box-sizing: border-box;
  position: relative;
  background: #141d1f;
  border: 1px solid #01607d;
  vertical-align: top;
  padding: 0 30px 0 0;
  &:hover {
    // border-color: #56E9FF;
  }
  & input {
    width: calc(100% - 48px);
    background: transparent;
    outline: none;
    border: none;
    color: #ffffff;
    font-size: 16px;
    padding-left: 18px;
    position: absolute;
    left: 0%;
    top: 50%;
    transform: translateY(-50%);
    &::placeholder {
      color: #a6adb4;
    }
  }
  & .map-route-wrap {
    width: calc(100% - 78px);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    left: 0%;
    top: 50%;
    transform: translateY(-50%);
    & label {
      cursor: pointer;
      color: #ffffff;
      display: flex;
      align-items: center;
    }
    & label:nth-child(1) {
      &::before {
        content: '';
        display: inline-block;
        width: 14px;
        height: 22px;
        cursor: pointer;
        background: url(./assets/walk-icon.svg) center/100% 100%;
        margin-right: 4px;
      }
      &.route-label--active,
      &:hover {
        color: #56e9ff;
        &::before {
          background: url(./assets/walk-icon--active.svg) center/100% 100%;
        }
      }
    }
    & label:nth-child(2) {
      &::before {
        content: '';
        display: inline-block;
        width: 23px;
        height: 20px;
        cursor: pointer;
        background: url(./assets/Cycling-icon.svg) center/100% 100%;
        margin-right: 4px;
      }
      &.route-label--active,
      &:hover {
        color: #56e9ff;
        &::before {
          background: url(./assets/Cycling-icon--active.svg) center/100% 100%;
        }
      }
    }
    & label:nth-child(3) {
      &::before {
        content: '';
        display: inline-block;
        width: 18px;
        height: 17px;
        cursor: pointer;
        background: url(./assets/drive-icon.svg) center/100% 100%;
        margin-right: 4px;
      }
      &.route-label--active,
      &:hover {
        color: #56e9ff;
        &::before {
          background: url(./assets/drive-icon--active.svg) center/100% 100%;
        }
      }
    }
  }
  & .clear {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 52px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    cursor: pointer;
    background: url(./assets/clear.svg) center/100% 100%;
    opacity: 0;
    transition: all 0.5s;
    &.clear-visible {
      opacity: 1;
    }
  }
  & .close {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 52px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    cursor: pointer;
    background: url(./assets/close-icon.svg) center/100% 100%;
    opacity: 0;
    transition: all 0.5s;
    &.close-visible {
      opacity: 1;
    }
    &::before {
      display: inline-block;
      content: '';
      width: 2px;
      height: 36px;
      background: rgba(230, 230, 230, 0.19);
      position: absolute;
      top: 50%;
      right: 25px;
      transform: translateY(-50%);
    }
  }
  & .map-route-icon {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 52px;
    transform: translateY(-50%);
    width: 16px;
    height: 22px;
    cursor: pointer;
    background: url(./assets/map-route-icon.svg) center/100% 100%;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: all 0.5s;
    &::before {
      display: inline-block;
      content: '';
      width: 2px;
      height: 36px;
      background: rgba(230, 230, 230, 0.19);
      position: absolute;
      top: 50%;
      right: 25px;
      transform: translateY(-50%);
    }
    &.map-route-icon-visible {
      opacity: 1;
    }
  }
  & button {
    position: absolute;
    top: 50%;
    right: -2px;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border: none;
    outline: none;
    cursor: pointer;
    background: linear-gradient(180deg, #32acbe 0%, #61eaff 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      content: '';
      display: inline-block;
      width: 22px;
      height: 22px;
      background: no-repeat center/22px 22px url(./assets/search.svg);
    }
    &.visualization-right-search--clear {
      background-image: url(./assets/clear.svg);
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
