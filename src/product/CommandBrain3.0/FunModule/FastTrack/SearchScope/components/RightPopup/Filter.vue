<template>
  <!-- 筛选 -->
  <div :class="$style.Filter">
    <header>
      <div>
        <div>周边资源</div>
        <div v-show="listData.length !== 0 && listData[1].active === 'false'">
          当前无支持预览的资源
        </div>
      </div>

      <div>
        <span>显示隐藏资源</span>
        <Switchs v-model="switchsFlag" :height="26" :width="53" />
      </div>
    </header>
    <main>
      <ul>
        <li
          v-for="(x, i) in listData"
          :key="i"
          :class="
            x.active === 'true'
              ? $style['li-active']
              : x.active === 'false'
              ? $style['li-notActive']
              : ''
          "
          @click="selectModel(x)"
        >
          {{ x.name }}
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Switchs from '@/product/Coplotting/module/TaggingDetails/components/Switchs.vue';
export default defineComponent({
  components: {
    Switchs,
  },
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const switchsFlag = ref<boolean>(false);
    // 选择的模块
    function selectModel(x: any) {
      if (x.active !== 'false') {
        props.listData.forEach((e: any) => {
          if (e.active !== 'false') {
            e.active = 'default';
          }
        });
        if (x.active === 'default') {
          x.active = 'true';
        } else if (x.active === 'true') {
          x.active = 'default';
        }
        let obj = {
          type: 'selectModel',
          handleData: props.listData,
        };
        context.emit('sendMsg', obj);
      }
    }
    watch(switchsFlag, (newV) => {
      let obj = {
        type: 'switchChange',
        handleData: newV,
      };
      context.emit('sendMsg', obj);
    });
    return {
      selectModel,
      switchsFlag,
    };
  },
});
</script>

<style lang="scss" module>
.Filter {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    & > div {
      display: flex;
      align-items: center;
      &:first-child {
        & > div {
          &:first-child {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            margin-right: 10px;
          }
          &:last-child {
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            background: #050505;
            padding: 5px;
            border: 1px solid rgba(166, 173, 180, 0.3);
          }
        }
      }
      &:last-child {
        & > span {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          margin-right: 6px;
        }
      }
    }
  }
  main {
    & > ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: space-between;
      li {
        height: 32px;
        flex: 1;
        margin-right: 10px;
        border: 1px solid #00c1de;
        font-size: 14px;
        font-weight: 400;
        color: #00c1de;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .li-active {
        background: #00c1de;
        color: #ffffff;
      }
      .li-notActive {
        opacity: 0.5;
        cursor: default;
      }
    }
  }
}
</style>
