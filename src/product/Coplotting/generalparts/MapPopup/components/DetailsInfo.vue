<template>
  <div
    :class="[
      $style.DetailsInfo,
      enter === 'commandBrain' ? $style.DetailsInfoMapPopup : '',
    ]"
  >
    <ul>
      <li v-for="(x, i) in renderData" v-show="x.value" :key="i">
        <span>{{ x.name }}：</span>
        <span>{{ x.type === 3 ? x.value.split('T')[0] : x.value }}</span>
        <!-- 电话和入会 -->
        <div v-show="(x.type === 4 || x.type === 5) && x.value">
          <!-- 电话呼叫 -->
          <div v-show="x.type === 4" @click="make(x)">
            <div></div>
            <div></div>
          </div>
          <!-- 终端入会 -->
          <div v-show="x.type === 5" @click="createMeetings(x)">
            <div></div>
            <div></div>
          </div>
        </div>
      </li>
      <!-- <li>
        <span>分类：</span>
        <span>地质灾害</span>
      </li>
      <li>
        <span>状态：</span>
        <span>较大级别</span>
      </li>
      <li>
        <span>影响面积：</span>
        <span>135平方米</span>
      </li>
      <li>
        <span>负责人姓名：</span>
        <span>张三</span>
      </li>
      <li>
        <span>负责人电话：</span>
        <span>13922396688</span>
      </li> -->
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import {
  makePhoneCall,
  createMeeting,
  addCallback,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

export default defineComponent({
  props: {
    renderData: {
      type: Array,
      default: () => [],
    },
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
  },
  setup() {
    const { $message }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    // 发起电话呼叫
    function make(x: any) {
      makePhoneCall({
        phone: x.value,
        type: 1,
        id: 0,
        name: '',
      });
    }
    // 发起终端会议
    function createMeetings(x: any) {
      createMeeting('', [x.value], 0);
    }
    // 处理回调方法
    function addCallbacks(code: number, message: any) {
      console.log(code, message);
      if (code === 103) {
        if (message.result === 1) {
          $message.info('入会成功');
        } else {
          $message.error('入会失败');
        }
      }
    }
    addCallback(addCallbacks);
    return {
      make,
      createMeetings,
    };
  },
});
</script>

<style lang="scss" module>
.DetailsInfo {
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  background: #fbfbfb;
  border: 1px solid rgba(245, 245, 245, 1);
  border-left: none;
  border-right: none;
  padding: 0 16px;
  box-sizing: border-box;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin: 7px 0;
      display: flex;
      & > span {
        display: inline-block;
      }
      & > span:first-child {
        width: 105px;
        margin-right: 10px;
        font-size: 17px;
        font-weight: 400;
        color: #333333;
      }
      & > span:last-child {
        width: calc(100% - 102px);
        font-size: 17px;
        font-weight: 400;
        color: #999999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      & > div {
        & > div {
          margin-left: 10px;
          cursor: pointer;
          & > div {
            width: 20px;
            height: 20px;
          }
          &:first-child {
            & > div {
              width: 16px;
              height: 16px;
            }
            & > div:first-child {
              background: url('../assets/dial.svg') no-repeat;
              background-size: 100% 100%;
            }
            & > div:last-child {
              background: url('../assets/dial_active.svg') no-repeat;
              background-size: 100% 100%;
              display: none;
            }
            &:hover div:first-child {
              display: none;
            }
            &:hover div:last-child {
              display: block;
            }
          }
          &:last-child {
            & > div:first-child {
              background: url('../assets/contacts.svg') no-repeat;
              background-size: 100% 100%;
            }
            & > div:last-child {
              background: url('../assets/contacts_active.svg') no-repeat;
              background-size: 100% 100%;
              display: none;
            }
            &:hover div:first-child {
              display: none;
            }
            &:hover div:last-child {
              display: block;
            }
          }
        }
      }
    }
  }
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
.DetailsInfoMapPopup {
  ul {
    li {
      span {
        &:nth-child(2) {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
