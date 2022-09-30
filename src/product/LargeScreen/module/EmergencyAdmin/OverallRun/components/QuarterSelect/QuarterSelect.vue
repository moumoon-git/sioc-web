<template>
  <div
    ref="container"
    :class="$style.container"
    @click.stop="isExpanded = !isExpanded"
  >
    <input
      v-model="text"
      :class="$style.innerInput"
      :placeholder="placeholder"
      readonly
    >
    <button
      :class="{
        [$style.clear]: !!text,
        [$style.arrowDown]: !text && !isExpanded,
        [$style.arrowUp]: !text && isExpanded,
      }"
      @click="clearText"
    />
    <div
      :class="[
        $style.popup,
        { [$style.popupExpand]: isExpanded },
      ]"
      @click.stop
    >
      <div :class="$style.year">
        <button @click="year -= 1" />
        <span>{{ year }}</span>
        <button
          @click="year < today.getFullYear() ? year += 1 : null"
        />
      </div>
      <ul :class="$style.quarter">
        <li @click="selectQuarter(0)">
          第一季度
        </li>
        <li
          v-if="!(year === today.getFullYear() && maxQuarter < 2)"
          @click="selectQuarter(1)"
        >
          第二季度
        </li>
        <li
          v-if="!(year === today.getFullYear() && maxQuarter < 3)"
          @click="selectQuarter(2)"
        >
          第三季度
        </li>
        <li
          v-if="!(year === today.getFullYear() && maxQuarter < 4)"
          @click="selectQuarter(3)"
        >
          第四季度
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
} from 'vue';

export default defineComponent({
  name: 'QuarterSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const container = ref<HTMLDivElement | null>(null);
    const isExpanded = ref(false);
    const collapse = (evt: MouseEvent | any) => {
      if (container.value && !container.value.contains(evt.target)) {
        document.body.removeEventListener('click', collapse);
        isExpanded.value = false;
      }
    };
    watch(isExpanded, (newVal) => {
      if (newVal) {
        document.body.addEventListener('click', collapse);
      } else {
        document.body.removeEventListener('click', collapse);
      }
    });

    const text = ref('');
    const clearText = () => {
      text.value = '';
      emit('change', { year: '', quarter: '' });
    };

    const today = new Date();
    const month = today.getMonth() + 1;
    const maxQuarter =
      month >= 10 ? 4 :
        month >= 7 ? 3 :
          month >= 4 ? 2 : 1;
    const year = ref<number>(today.getFullYear());
    const selectQuarter = (quarter: 0 | 1 | 2 | 3) => {
      isExpanded.value = false;
      const quarterMap = ['一', '二', '三', '四'];
      text.value = `${year.value}年第${quarterMap[quarter]}季度`;
      emit('change', { year: year.value, quarter: quarter + 1 });
    };
    return {
      container,
      text,
      clearText,
      isExpanded,
      today,
      year,
      selectQuarter,
      maxQuarter,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  border: 1px solid #00C1DE;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 210px;
  height: 48px;
  padding: 0 14px;
  position: relative;
  cursor: pointer;
  user-select: none;
  &:hover { border-color: #56E9FF; }
  .innerInput {
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    background: none;
    color: #FFF;
    font-size: 20px;
    pointer-events: none;
    &::placeholder { color: rgba(#FFF, 0.5); }
  }
  & > button {
    width: 20px;
    height: 20px;
    outline: none;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    transition: transform .3s;
    &.clear {
      background: no-repeat center/100% 100% url(./assets/imgs/clear.svg);
      &:hover {
        opacity: 0.7;
      }
    }
    &.arrowDown {
      background: no-repeat center/70% 70% url(./assets/imgs/arrow.svg);
    }
    &.arrowUp {
      background: no-repeat center/70% 70% url(./assets/imgs/arrow.svg);
      transform: rotate(-180deg);
    }
  }
}
.popup {
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 210px;
  height: 150px;
  transform: translate(-50%, 100%) scale(0);
  transform-origin: top center;
  transition: transform , .3s;
  background: rgba(#141D1F, 0.94);
  border: 1px solid #00C1DE;
  border-radius: 4px;
  z-index: 1;
  cursor: default;
  display: flex;
  flex-direction: column;
  &.popupExpand {
    transform: translate(-50%, 100%) scale(1);
  }
  .year {
    display: flex;
    align-items: center;
    justify-content: center;
    & > span {
      color: #FFF;
      font-size: 25px;
    }
    & > button {
      background: no-repeat center/100% 100% url(./assets/imgs/left.svg);
      width: 20px;
      height: 20px;
      outline: none;
      border: none;
      cursor: pointer;
      margin: 0 20px;
      &:hover {
        opacity: .7;
      }
      &:last-child { transform: rotate(180deg); }
    }
  }
  .quarter {
    flex: 1;
    list-style: none;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    & > li {
      color: #FFF;
      text-align: center;
      font-size: 20px;
      cursor: pointer;
      margin: 10px;
      &:hover {
        background: linear-gradient(90deg, rgba(0, 236, 255, 0.71) 0%, rgba(3, 51, 70, 0.34) 100%);
      }
    }
  }
}
</style>
