<template>
  <div class="addunitSection">
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        上级单位:
      </div>
      <input
        v-model="unitData.name"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        单位名称:
      </div>
      <input
        v-model="unitData.name"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        单位地址:
      </div>
      <input
        v-model="unitData.address"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        单位负责人:
      </div>
      <input
        v-model="unitData.responsible"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        办公电话:
      </div>
      <input
        v-model="unitData.officePhone"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        传真号码:
      </div>
      <input
        v-model="unitData.fax"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        联系电话:
      </div>
      <input
        v-model="unitData.responsiblePhone"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
    <div class="addunitSection__item">
      <div class="addunitSection__item__left">
        电子邮箱:
      </div>
      <input
        v-model="unitData.email"
        type="text"
        class="addunitSection__item__right"
      >
    </div>
  </div>
  <div class="addindex__container__bottom">
    <div
      class="addindex__container__bottom__item"
      @click="close"
    >
      取消
    </div>
    <div
      class="addindex__container__bottom__item"
      @click="makeSureFun"
    >
      确定
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,getCurrentInstance } from 'vue';


export default defineComponent({
  components: {},
  props: {
    unitData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http, $message }: any = instance?.appContext.config.globalProperties;
    function close() {
      emit('close');
    }
    function makeSureFun() {
      const sendData:any = {
        address: props.unitData.address,
        email: props.unitData.email,
        fax: props.unitData.fax,
        id: props.unitData.id,
        name: props.unitData.name,
        officePhone: props.unitData.officePhone,
        parentId: '0',
        remark: '',
        responsible: props.unitData.responsible,
        responsiblePhone: props.unitData.responsiblePhone,
        t: '',
        type: 1,
      };
      console.log(sendData);
       const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: sendData,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          close()
        } else {
          $message.error(`保存失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`保存失败，错误信息：${error}`);
      });
    }
    return {
      close,
      makeSureFun,
    };
  },
});
</script>

<style lang="scss">
.addunitSection {
      width: 1183px;
    height: 588px;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.29);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-top: 16px;
  &__item {
    width: 582px;
    height: 60px;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: flex-end;
    &__left {
      height: 32px;
      line-height: 32px;
      margin-right: 10px;
      color: rgba(166, 173, 180, 1);
    }
    &__right {
      width: 484px;
      height: 32px;
      border: 1px solid rgba(255, 255, 255, 0.65);
      background: 0;
      outline: 0;
      color: #fff;
    }
  }
}
  .addindex__container__bottom {
          width: 100%;
    height: 56px;
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
      &__item {
        width: 65px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        text-align: center;
        line-height: 32px;
        color: rgba(255, 255, 255, 0.65);
        cursor: pointer;
        &:nth-child(1) {
          color: rgba(255, 255, 255, 0.65);
          margin-right: 8px;
        }
        &:nth-child(2) {
          color: #fff;
            margin-right: 27px;
          background: #00c1de;
        }
      }
    }
</style>
