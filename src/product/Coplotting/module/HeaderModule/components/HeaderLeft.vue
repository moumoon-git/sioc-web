<template>
  <div :class="$style.HeaderLeft">
    <div :class="$style.leftVis">
      <!-- 返回按钮 -->
      <div v-if="showGoBack" :class="$style.back" @click="goback" />
      <div :class="$style.inputWrap">
        <div
          ref="titleWrap"
          :class="[$style.titleWrap, visFontFlag ? $style.hidden : '']"
        >
          {{ inputVal }}
        </div>
        <input
          ref="inputEl"
          v-model="inputVal"
          :style="{ minWidth: width + 'px' }"
          :class="visFontFlag ? '' : $style.hidden"
          type="text"
          @blur="changeName"
          @keydown.enter="changeName"
        />
      </div>
      <!-- 编辑按钮 -->
      <div v-show="!visFontFlag" :class="$style.edit" @click="edit" />
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { defineComponent, ref, getCurrentInstance } from 'vue';

export default defineComponent({
  props: {
    handleData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const store = useStore(); // 使用vuex
    const route = useRoute();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 输入框的值
    const inputVal = ref(props.handleData?.mapName);
    // 编辑和显示的控制
    const visFontFlag = ref(false);
    // input的宽度
    const width = ref(0);
    // 标题的外套
    const titleWrap = ref(null);
    // 输入值的input的元素
    const inputEl = ref(null);
    // 是否显示返回首页按钮
    const showGoBack = ref(true);
    // 如果是通过分享链接进入地图，则不显示返回首页按钮
    if (route.query?.from === 'link') {
      showGoBack.value = false;
    }
    // 编辑
    function edit() {
      width.value = (titleWrap as any).value.offsetWidth;
      visFontFlag.value = true;
      // 使用宏任务去 获得焦点
      setTimeout(() => {
        (inputEl as any).value.focus();
      }, 20);
    }
    // 返回
    function goback() {
      context.emit('goback');
      // console.log(context.emit);
    }
    // 修改名字
    function changeName() {
      visFontFlag.value = false;
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmap/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: store.state.coplotting.mapId,
          mapName: inputVal.value,
        },
      };
      $http(request);
    }
    return {
      inputVal,
      visFontFlag,
      width,
      edit,
      titleWrap,
      inputEl,
      goback,
      changeName,
      showGoBack,
    };
  },
});
</script>

<style lang="scss" module>
.font {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  line-height: 35px;
}
.HeaderLeft {
  height: 100%;
  padding-left: 28px;
  box-sizing: border-box;
}
.leftVis {
  height: 100%;
  display: flex;
  align-items: center;
  .back {
    width: 15px;
    height: 27px;
    margin-right: 26px;
    background: url('./assets/left_arrow.svg') no-repeat;
    background-size: 70%;
    background-position: 50% 54%;
    cursor: pointer;
  }
  .inputWrap {
    @extend .font;
    margin-right: 15px;
  }
  .titleWrap {
    @extend .font;
  }
  .hidden {
    display: none;
  }
  input {
    @extend .font;
    border: none;
    padding: 0;
    outline: 0;
  }
  .edit {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url('./assets/edit.svg') no-repeat;
    background-size: 80%;
    background-position: 50%;
  }
}
</style>
