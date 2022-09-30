<template>
  <div :class="$style.Search">
    <!-- 显示容器 -->
    <div :class="[$style.visWrap, visSelectFlag ? $style.visWrapActive : '']">
      <span>{{ visData.name }}</span>
      <div :class="$style.arrow" />
      <input
        ref="selectInp"
        type="text"
        autocomplete="off"
        readonly
        @focus="visSelectFlag = true"
      />
    </div>
    <!-- 选择容器 -->
    <div v-show="visSelectFlag" :class="$style.selectWrap">
      <ul>
        <li
          v-for="(item, index) in selectData"
          :key="index"
          @click="setVisData(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const selectInp = ref(null);
    const prop = props;
    const data = [
      {
        id: 0,
        name: '标注',
      },
      {
        id: 1,
        name: '地图',
      },
    ];
    // 显示选中的值
    const visData = ref(data[1]);
    prop.modelValue.value = visData;
    // 选择的列表
    const selectData = ref(data);
    // 控制选择的显示
    const visSelectFlag = ref(false);
    // 设置选中的值
    function setVisData(item) {
      visData.value = item.name;
      prop.modelValue.value = item;
    }
    function timeOutSet(e) {
      if (e.target.nodeName === 'INPUT') {
        if (selectInp.value === e.target) {
          visSelectFlag.value = !visSelectFlag.value;
          return;
        }
      }
      // console.log('失去焦点');
      setTimeout(() => {
        visSelectFlag.value = false;
      }, 150);
    }
    onMounted(() => {
      window.addEventListener('mousedown', timeOutSet, false);
    });
    onUnmounted(() => {
      window.removeEventListener('mousedown', timeOutSet, false);
    });
    return {
      selectInp,
      visData,
      selectData,
      visSelectFlag,
      setVisData,
    };
  },
};
</script>

<style lang="scss" module>
.Search {
  width: 100%;
  height: 100%;
  position: relative;
}
// 显示容器
.visWrap {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 80%;
    width: 1px;
    background: #e6e6e6;
  }
  & > span {
    font-size: 17px;
    font-weight: 400;
    color: #666666;
  }
  & > input {
    width: 100%;
    height: 100%;
    outline: none;
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    z-index: 9;
    &:focus {
      border-color: #409eff;
    }
  }
}
.visWrapActive {
  & > input {
    border-color: #409eff;
  }
}
.arrow {
  width: 8px;
  height: 7px;
  background: url('./assets/triangle.svg') no-repeat;
  background-size: 100% 100%;
  margin-left: 3px;
}
// 选择容器
.selectWrap {
  position: absolute;
  width: 80px;
  top: 105%;
  z-index: 10;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  & > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    & > li {
      font-size: 17px;
      font-weight: 400;
      color: #666666;
      background: rgba(255, 255, 255, 1);
      padding: 8px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
