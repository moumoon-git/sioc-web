<template>
  <div
    :class="[
      $style.SelectTemplatePopup,
      enter === 'commandBrain'
        ? `${$style.commandBrainSelectTemplatePopup} commandBrainSelectTemplatePopup`
        : '',
    ]"
  >
    <div>
      <header>
        <span>选择模板</span>
        <div @click="sendMsg('close')" />
      </header>
      <main>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(x, i) in templateList" :key="x.id" :label="x.id">
            {{ x.templateName }}
          </el-checkbox>
        </el-checkbox-group>
      </main>
      <footer>
        <el-button type="primary" @click="sendMsg('checkData')">
          保存
        </el-button>
        <el-button @click="sendMsg('close')"> 取消 </el-button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { defineComponent, ref, getCurrentInstance } from 'vue';

export default defineComponent({
  props: {
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
    checkData: {
      type: Array,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: () => [],
    },
  },
  setup(props, context) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const templateList: any = ref([]);
    const checkList = ref<any>(props.checkData); //props.checkData
    console.log(props.checkData);
    console.log(checkList.value);
    const store = useStore(); // 使用vuex
    // 发送消息
    function sendMsg(type: string) {
      console.log(checkList.value);
      // console.log(templateList.value);
      const obj: any = {
        type,
      };
      if (type === 'checkData') {
        const data: any = [];
        checkList.value.forEach((ele: any) => {
          const filterArr = templateList.value.filter((x: any) => x.id === ele);
          const objs = {
            ...filterArr[0],
            templateTypeId: ele, //模板类型id
          };
          data.push(objs);
        });
        obj.checkData = data;
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistmaptemplatetyperelated/save',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            mapId: store.state.coplotting.mapId,
            data,
          },
        };
        $http(request).then((res: any) => {
          // console.log(res);
          if (res.code === 0 && res.data) {
            templateList.value = res.data;
          }
        });
      }
      // console.log(checkList);
      // console.log(obj);
      context.emit('sendMsg', obj);
    }
    // 获取模板类型列表
    function getTemplateList() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assisttemplatetype/list',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request).then((res: any) => {
        // console.log(res);
        if (res.code === 0 && res.data) {
          templateList.value = res.data;
        }
      });
    }
    getTemplateList();
    return {
      templateList,
      checkList,
      sendMsg,
    };
  },
});
</script>

<style lang="scss" module>
.SelectTemplatePopup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    width: 506px;
    height: 484px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    border: 0px solid #979797;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    & > header {
      width: 100%;
      height: 56px;
      background: #f1f4f6;
      border-radius: 7px 7px 0px 0px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      & > span {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
      }
      & > div {
        width: 20px;
        height: 20px;
        cursor: pointer;
        background: url(../assets/close.svg) no-repeat;
        background-size: 100% 100%;
      }
    }
    & > main {
      height: 350px;
      box-sizing: border-box;
      border-bottom: 1px solid #e9ecf1;
      padding: 16px 40px;
      box-sizing: border-box;
      overflow-y: auto;
      & > div {
        display: flex;
        flex-direction: column;
        & > * {
          margin-bottom: 10px;
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
    & > footer {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 21px;
      box-sizing: border-box;
      & > button {
        width: 70px;
        height: 42px;
        line-height: 42px;
        padding: 0;
        text-align: center;
      }
    }
  }
}

// 指挥一张图进入
.commandBrainSelectTemplatePopup {
  & > div {
    width: 410px;
    height: 332px;
    background: #141d1f;
    opacity: 0.94;
    border: 1px solid #00c1de;
    border-radius: 0;
    & > header {
      background: transparent;
      font-size: 18px;
      font-weight: 500;
      height: 50px;
      min-height: 50px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      & > span {
        color: #ffffff;
      }
      & > div {
        width: 16px;
        height: 16px;
      }
    }
    & > main {
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      span {
        color: #ffffff;
        background: transparent;
      }
    }
    & > footer {
      height: 55px;
      min-height: 55px;
      flex-flow: row-reverse;
      justify-content: flex-start;
      padding-right: 15px;
      button {
        width: 65px;
        height: 32px;
        border-radius: 0;
        &:first-child {
          margin-left: 10px;
          background: #00c1de;
          border-color: transparent;
        }
        &:last-child {
          background: transparent;
          color: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.45);
          &:hover {
            color: rgba(255, 255, 255, 0.65);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.commandBrainSelectTemplatePopup {
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fff;
    border-color: #fff;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #fff;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #ffffff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    border-color: #141d1f;
    height: 9px;
    left: 3px;
    top: 0px;
    width: 5px;
  }
}
</style>
