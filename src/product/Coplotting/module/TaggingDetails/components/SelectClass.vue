<template>
  <div
    :class="[
      $style.selectClass,
      selectFlag ? $style.selectClassActive : '',
      enter === 'commandBrain' ? $style.commandBrainSelectClass : '',
    ]"
  >
    <input
      ref="focusEl"
      type="text"
      autocomplete="off"
      readonly
      :disabled="disabled"
      @focus="disabled ? '' : (selectFlag = true)"
    />
    <!-- readonly -->
    <!-- 状态的显示 -->
    <aside :class="[$style.stateVis, disabled ? $style.disabled : '']">
      <img
        v-if="modelflag === 'stateSelect' && visImg && typeNum === 0"
        :src="visImg"
        alt=""
      />
      <span>{{ visFont }}</span>
    </aside>
    <!-- 定位的容器 -->
    <div v-show="selectFlag" :style="{ height: `${selectHg}px` }">
      <!-- 分类循环的容器 -->
      <div v-if="modelflag === 'classFor'">
        <div
          v-for="(item, index) in classData"
          :key="index"
          :class="$style.classForWrap"
        >
          <div>{{ item.fileName }}</div>
          <ul>
            <li
              v-for="(x, i) in item.basicClassList"
              :key="i"
              :class="x.active ? $style['classForWrap_ul_li_active'] : ''"
              @click="selecrData(x)"
            >
              <img v-if="typeNum === 0 && x.src" :src="x.src" alt="" />
              <span>{{ x.className }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 状态选择的容器 typeNum === 0 ? $style.spotClass : ''-->
      <div v-else :class="[$style.stateSelect, $style.spotClass]">
        <ul v-if="stateSelectData.length !== 0">
          <li
            v-for="(x, index) in stateSelectData"
            :key="index"
            @click="selectState(x)"
          >
            <img
              v-if="typeNum === 0 && x.iconUrl && x.src"
              :src="x.src"
              alt=""
            />
            <!-- width: '100%', -->
            <div
              v-else-if="typeNum === 2 && x.stylePropertyEntity"
              :style="{
                width: '50px',
                'margin-right': '15px',
                opacity:
                  x.stylePropertyEntity.fillOpacity ||
                  x.stylePropertyEntity.strokeOpacity,
                borderTop: `${x.stylePropertyEntity.lineHeight}px ${
                  x.stylePropertyEntity.lineType === 0 ? 'dashed' : 'solid'
                } ${
                  x.stylePropertyEntity.fillColor ||
                  x.stylePropertyEntity.strokeColor
                }`,
              }"
            />
            <div
              v-else-if="typeNum === 1 && x.stylePropertyEntity"
              :style="{
                width: '90px',
                border: `${x.stylePropertyEntity.lineHeight}px ${
                  x.stylePropertyEntity.lineType === 0 ? 'dashed' : 'solid'
                } ${
                  x.stylePropertyEntity.strokeColor ||
                  x.stylePropertyEntity.strokeColor
                }`,
              }"
            >
              <div
                :style="{
                  width: '100%',
                  height: '28px',
                  background: x.stylePropertyEntity.fillColor,
                  opacity:
                    x.stylePropertyEntity.fillOpacity ||
                    x.stylePropertyEntity.strokeOpacity,
                }"
              />
            </div>
            <div
              v-else-if="typeNum === 3 && x.stylePropertyEntity"
              :style="{
                width: '90px',
                height: `${x.stylePropertyEntity.lineHeight}px`,
                background: x.stylePropertyEntity.strokeColor,
                opacity:
                  x.stylePropertyEntity.fillOpacity ||
                  x.stylePropertyEntity.strokeOpacity,
              }"
            />
            <span>{{ x.statusType }}</span>
          </li>
        </ul>
        <div v-else>暂时无数据</div>
      </div>
    </div>
    <!-- 箭头 -->
    <span
      :class="[$style.dowArrow, selectFlag ? $style.transFromArrow : '']"
    ></span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  watch,
} from 'vue';

const datas = require('./data.json');

export default defineComponent({
  props: {
    classData: {
      type: Array,
      default: () => [],
    },
    modelflag: {
      type: String,
      default: 'classFor', // stateSelect
    },
    selectHg: {
      type: Number,
      default: 320,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    // 操作类型
    handleType: {
      type: String,
      default: 'spot', // spot line noodle other
    },
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
  },
  setup(props, context) {
    const serverUrl: any = ref((window as any).config.baseURL);
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 显示字体
    const visFont: any = ref('');
    // 显示的图片
    const visImg: any = ref<string>('');
    // 聚焦的元素
    const focusEl: any = ref(null);
    // 分类选择的数据
    // const classData:any = ref([]);
    // 状态数据
    const stateSelectData = ref([]);
    // 选择的状态数据
    const stateData: any = ref({});
    const selectFlag = ref(false);
    const typeNum = ref(0); // 类型数据
    // 选择分类
    function selecrData(params: any) {
      // console.log(params);
      const data: any = params;
      visFont.value = params.className;
      props.classData.forEach((ele: any) => {
        ele.basicClassList.forEach((x: any) => {
          x.active = false;
        });
      });
      data.active = true;
      // console.log(data.src);
      context.emit('selecrData', data);
    }
    function blurs(e: any) {
      if (e.target.nodeName === 'INPUT') {
        if (focusEl.value === e.target) {
          // console.log('两次相等的元素');
          if (!props.disabled) {
            selectFlag.value = !selectFlag.value;
          }
          return;
        }
      }
      // console.log(e);
      setTimeout(() => {
        selectFlag.value = false;
      }, 300);
    }
    // 选择状态
    function selectState(item: any) {
      visFont.value = item.statusType;
      stateData.value = item;
      if (typeNum.value === 0) {
        visImg.value = item.src;
      }
      if (typeNum.value === 2 && item.stylePropertyEntity) {
        item.stylePropertyEntity.strokeColor =
          item.stylePropertyEntity.fillColor;
      }
      console.log(item);
      // console.log(visImg);
      context.emit('selectState', item);
    }
    onMounted(() => {
      window.addEventListener('mousedown', blurs, false);
    });
    onUnmounted(() => {
      window.removeEventListener('mousedown', blurs, false);
    });
    watch(
      () => props.classData,
      (newVal) => {
        // console.log(newVal);
        newVal.forEach((x: any) => {
          x.basicClassList.forEach((e: any) => {
            if (e.id === props.modelValue) {
              visFont.value = e.className;
            }
          });
        });
      },
    );
    watch(stateSelectData, (newVal) => {
      // console.log(newVal);
      newVal.forEach((x: any) => {
        if (x.id === props.modelValue) {
          visFont.value = x.statusType;
          visImg.value = x.src;
          stateData.value = x;
          // console.log(x);
          // 在选择默认的时候进行图标更换
          context.emit('selectState', x);
        }
      });
      // console.log(visImg);
    });
    //
    return {
      serverUrl,
      visFont,
      visImg,
      focusEl,
      selectFlag,
      selecrData,
      stateSelectData,
      selectState,
      stateData,
      typeNum,
    };
  },
});
</script>

<style lang="scss" module>
.selectClass {
  width: 100%;
  height: 100%;
  position: relative;
  & > input {
    caret-color: rgba(0, 0, 0, 0);
    position: relative;
    z-index: 8;
    height: 100%;
    width: 100%;
    outline: none;
    border: 1px solid transparent;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid #dddddd;
    border-radius: 4px;
    padding-left: 11px;
    font-size: 17px;
    font-weight: 400;
    color: #333333;
    background: transparent;
    &:focus,
    &:active {
      border-color: #409eff;
    }
    &:disabled {
      background: -internal-light-dark(
        rgba(239, 239, 239, 0.3),
        rgba(59, 59, 59, 0.3)
      );
      border-color: rgba(118, 118, 118, 0.3);
    }
  }
  & > div {
    position: absolute;
    top: 125%;
    z-index: 9;
    width: 100%;
    // height: 503px;
    box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 17px 11px 8px 11px;
    box-sizing: border-box;
    background: #fff url('../assets/dropdown_basic.svg');
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
}
.disabled {
  background: rgba(250, 250, 250);
  border-color: rgba(118, 118, 118, 0.3);
}
.selectClassActive {
  & > input {
    border-color: #409eff;
  }
}
.classForWrap {
  & > div {
    margin-bottom: 15px;
    font-size: 17px;
    font-weight: 500;
    color: #333333;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    & > li {
      display: flex;
      cursor: pointer;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      // width: 100%;
      min-width: 90px;
      margin-bottom: 15px;
      margin-right: 10px;
      padding-bottom: 8px;
      &:nth-child(4n) {
        margin-right: 0;
      }
      & > img {
        width: 39px;
        height: 47px;
        margin-bottom: 3px;
      }
      & > span {
        font-size: 17px;
        font-weight: 400;
        color: #333333;
      }
      & > div {
        box-sizing: border-box;
      }
    }
    .classForWrap_ul_li_active {
      & > span {
        color: rgba(0, 145, 255, 1);
      }
      &::after {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        margin: auto;
        width: 1px;
        border: 8px solid transparent;
        border-bottom: 8px solid #0091ff;
      }
    }
  }
}
.stateSelect {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    li {
      position: relative;
      width: 90px;
      min-width: 90px;
      margin-bottom: 25px;
      margin-right: 10px;
      padding-bottom: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 35px;
      &:hover {
        background: #f5f7fa;
      }
      & > img {
        width: 25px;
        height: 25px;
        margin-right: 4px;
      }
      & > span {
        font-size: 17px;
        font-weight: 400;
        color: #333333;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
      div {
        box-sizing: border-box;
      }
    }
  }
}
.spotClass {
  ul {
    display: block;
    li {
      width: auto;
      margin-bottom: 0px;
      margin-right: 0px;
      padding-bottom: 0px;
      align-items: center;
      flex-direction: inherit;
    }
  }
}

.stateVis {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 7px;
  box-sizing: border-box;
  & > img {
    width: 25px;
    height: 25px;
    margin-right: 4px;
  }
  & > span {
    font-size: 17px;
    font-weight: 400;
    color: #333333;
  }
}

// 指挥一张图样式
.commandBrainSelectClass {
  & > div {
    background: #050505;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(166, 173, 180, 0.3);
    padding: 10px;
  }
  & > input:disabled {
    border-color: #fff;
  }
  .disabled {
    background: transparent;
    border-color: rgba(118, 118, 118, 0.3);
  }
  .classForWrap {
    & > div {
      font-size: 14px;
      font-weight: 500;
      color: #56e9ff;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: -11px;
        margin: auto;
        width: 6px;
        height: 13px;
        background: #56e9ff;
        box-shadow: 0px 0px 16px 0px #008cff;
        border-radius: 2px;
      }
    }
    & > ul {
      & > li {
        &:nth-child(3n) {
          margin-right: 0px;
        }
        & > span {
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
  .stateVis {
    span {
      color: #fff;
    }
  }
  .stateSelect {
    span {
      color: #fff;
    }
  }
}

.dowArrow {
  width: 12px;
  height: 5px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 10px;
  margin: auto;
  background: url('../assets/down.svg') no-repeat;
  background-size: 100% 100%;
  transition: transform 0.3s;
}
.transFromArrow {
  transform: rotate(-180deg);
}
</style>
