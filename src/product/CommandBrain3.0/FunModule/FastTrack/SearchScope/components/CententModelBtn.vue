<template>
  <div :class="$style.CententModelBtn">
    <ul>
      <li
        v-for="(x, i) in btnData"
        :key="i"
        :class="x.active ? $style['li-active'] : ''"
        @click="selectMudel(x)"
      >
        <span :class="$style['icon-' + x.icon]" />
        <span :class="$style[`icon-${x.icon}Active`]" />
        {{ x.name }}
        <ul v-if="x.childrenFlag">
          <li
            v-for="(item, ind) in x.children"
            :key="ind"
            :class="item.active ? $style['li-active'] : ''"
            @click.stop="selectChildren(item, x)"
          >
            <span :class="$style['icon-' + item.icon]" />
            <span :class="$style[`icon-${item.icon}Active`]" />
            {{ item.name }}
          </li>
        </ul>
      </li>
    </ul>
    <!-- <div
      :class="$style.esc"
      :style="escStyle"
      @click="escFun"
    >
      退出
    </div> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import {
  addFun,
  deleteFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
export default defineComponent({
  emits: ['selectModel'],
  setup(props, context) {
    const keyDownFlag = ref<any>(false);
    // 使用vuex
    const store = useStore();
    const { $message }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    const btnData = ref<any>([
      {
        name: '点检索',
        active: false,
        icon: 'circular',
        type: 'circular',
      },
      {
        name: '线检索',
        active: false,
        icon: 'line',
        type: 'line',
        childrenFlag: false,
        children: [
          {
            name: '自由线',
            active: false,
            icon: 'freeLine',
            type: 'freeLine',
          },
          {
            name: '行车线',
            active: false,
            icon: 'lane',
            type: 'lane',
          },
        ],
      },
      {
        name: '面检索',
        active: false,
        icon: 'rectangle',
        type: 'rectangle',
      },
      {
        name: '退出',
        active: false,
        icon: 'signOut',
        type: 'signOut',
      },
    ]);
    // 退出操作
    function signOut(val?: string) {
      const obj = {
        active: false,
        childrenFlag: false,
        icon: '',
        name: '',
        type: val || '',
      };
      if (val) {
        store.commit('closeModle/SET_closeModle', {
          name: '资源检索',
          flag: false,
        });
      }
      context.emit('selectModel', obj);
    }

    // 按键取消方法
    function keyDownCancel(e: any) {
      if (e.key === 'Escape' && keyDownFlag.value) {
        btnData.value.forEach((ele: any) => {
          ele.active = false;
          if (ele.children) {
            ele.children.forEach((x: any) => {
              x.active = false;
            });
          }
        });
        signOut();
        keyDownFlag.value = false;
      }
    }
    // 按键取消
    function keyDown() {
      addFun('keydown', keyDownCancel);
    }
    // 选择模块
    function selectMudel(item: any) {
      // console.log(item);
      if (!item.children) {
        btnData.value.forEach((e: any) => {
          e.active = false;
          e.childrenFlag = false;
          if (e.children) {
            e.children.forEach((x: any) => {
              x.active = false;
            });
          }
        });
        item.active = true;
      } else {
        item.childrenFlag = !item.childrenFlag;
      }
      if (item.name === '退出') {
        signOut(item.type);
        return;
      }
      if (item.name !== '线检索') {
        context.emit('selectModel', item);
        $message.success('使用ECS键取消当前操作');
        keyDownFlag.value = true;
      }
    }
    // 选择子模块
    function selectChildren(item: any, x: any) {
      x.children.forEach((e: any) => {
        e.active = false;
      });
      selectMudel(item);
      x.active = true;
    }
    /**
     * @desc 显示关闭退出按钮
     * @param {}
     * @returns {}
     */
    const escStyle = computed(() => ({
      display: `${store.state.flightPatrol.escShow ? 'flex' : 'none'}`,
    }));
    onMounted(() => {
      keyDown();
    });
    onUnmounted(() => {
      deleteFun('keydown', keyDownCancel);
    });
    return {
      btnData,
      selectMudel,
      selectChildren,
      escStyle,
    };
  },
});
</script>

<style lang="scss" module>
.CententModelBtn {
  position: fixed;
  top: 80px;
  left: 21%;
  right: 0;
  margin: auto;
  z-index: 1;
  width: 455px;
  height: 44px;
  display: flex;
  & > ul {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    height: 100%;
    & > li {
      flex: 2;
      height: 100%;
      text-align: center;
      background: url('../assets/btnBgr.png') no-repeat;
      background-size: 100% 100%;
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
      color: #ffffff;
      display: flex;
      align-items: center;
      position: relative;
      justify-content: center;
      & > span {
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-right: 5px;
        &:nth-child(2) {
          display: none;
        }
      }
      & > ul {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        list-style: none;
        padding: 0;
        margin: 0;
        flex-direction: column;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.8);
        box-sizing: border-box;
        li {
          width: 100%;
          background: rgba(5, 5, 5, 0.9);
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          &:first-child {
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          }
          & > span {
            display: inline-block;
            width: 21px;
            height: 21px;
            margin-right: 5px;
            &:nth-child(2) {
              display: none;
            }
          }
        }
      }
      &:last-child {
        flex: 1;
        & > span {
          display: none !important;
        }
      }
    }
    .li-active {
      color: #56e9ff;
      & > span {
        &:first-child {
          display: none;
        }
        &:nth-child(2) {
          display: inline-block;
        }
      }
    }
  }
  .esc {
    width: 100px;
    line-height: 44px;
    text-align: center;
    background: #000;
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    margin-left: 2px;
  }
}
@each $animal in circular, line, rectangle, freeLine, lane {
  .icon-#{$animal} {
    background: url('../assets/#{$animal}.png') no-repeat;
    background-size: 100% 100%;
  }
  .icon-#{$animal}Active {
    background: url('../assets/#{$animal}_Active.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
