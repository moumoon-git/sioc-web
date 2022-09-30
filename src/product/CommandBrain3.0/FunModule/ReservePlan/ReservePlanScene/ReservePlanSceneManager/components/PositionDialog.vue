<template>
  <DialogBoat
    ref="DialogSceneBoat"
    title="职务管理"
  >
    <div style="width: 658px; height: 487px;position:relative;color: #FFF;">
      <div style="border-right: 1px solid rgba(255, 255, 255, 0.15);height: 100%;width: 252px;">
        <Button
          type="ghost"
          style="
            position:absolute;
            left: 10px;
            top: 10px;
            width: 231px;
            height: 40px;"
          @click="name='',remark='',isEdit=false"
        >
          新增职务
        </Button>
        <div :class="$style.scroll">
          <ListTemple
            :useHead="false"
            :list="leaderTeamList"
            @handleClick="handleClick"
          />
        </div>
      </div>
      <div style="position:absolute;left: 273px;top: 13px;color: #A6ADB4;">
        职务名称：
      </div>
      <input
        v-model="name"
        :disabled="isEdit"
        placeholder="请输入职务名称"
        :class="$style.input"
      >
      <div style="position:absolute;left: 273px;top: 67px;color: #A6ADB4;">
        职务职责：
      </div>
      <textarea
        v-model="remark"
        :disabled="isEdit"
        placeholder="请输入职务职责"
        :class="$style.text"
      />
      <div
        style="width: 405px;
        height: 0px;
        right: 0px;
        bottom: 51px;
        position: absolute;
        border: 1px solid rgba(255, 255, 255, 0.15)"
      />
      <div v-if="isEdit">
        <Button
          type="danger"
          style="position:absolute;right: 90px;bottom: 10px;"
          @click="deletePosition"
        >
          删除
        </Button>
        <Button
          type="primary"
          style="position:absolute;right: 16px;bottom: 10px;"
          @click="isEdit=false"
        >
          编辑
        </Button>
      </div>
      <div v-else>
        <Button
          type="ghost"
          style="position:absolute;right: 90px;bottom: 10px;"
          @click="isEdit=true"
        >
          取消
        </Button>
        <Button
          type="primary"
          style="position:absolute;right: 16px;bottom: 10px;"
          @click="commit"
        >
          保存
        </Button>
      </div>
    </div>
  </DialogBoat>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 列表模板

interface AddStateDialog {
  open: (data?: any) => void,
  close: (data?: any) => void,
}

export default defineComponent({
  name: 'PositionDialog',
  components: {
    // 弹出框
    DialogBoat,
    // 按钮
    Button,
    // 列表模板
    ListTemple,
  },
  props: {
    leaderTeamList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['init'],
  setup(props, context) {
    const store = useStore(); // 使用vuex
    const name = ref(''); // 职务名
    const remark = ref(''); // 职务职责
    const isEdit = ref(true); // 职务职责
    const currentPosition:any = ref({}); // 当前职务
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const DialogSceneBoat = ref<null | AddStateDialog>(null);
    // 开窗
    function openPopup() {
      if (DialogSceneBoat.value) {
        DialogSceneBoat.value.open();
      } else {
        setTimeout(() => openPopup(), 500);
      }
    }
    // 职务列点击
    function handleClick(item: any) {
      currentPosition.value = item;
      name.value = item.name;
      remark.value = item.remark;
    }
    // 点击确定
    function commit() {
      if (name.value === '') {
        $message.error('职务名不能为空！');
        return;
      }
      if (DialogSceneBoat.value) {
        DialogSceneBoat.value.close();
      }
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eventSceneConduct/addEventStuct',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          remark: remark.value, // 职务内容
          name: name.value, // 职务名
          type: 1, // 领导小组是467
          pid: 0, // 职务不要，就是0
          structType: 2, // 现场
          eventId: store.state.event?.id,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          $message.info('新增职务成功');
          context.emit('init');
        }
      });
    }
    function deletePosition() {
      if (currentPosition.value === '') {
        $message.error('请先选中要删除的职务');
        return;
      }
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eventSceneConduct/delEventStruct',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: currentPosition.value.id,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          $message.info('职务删除成功！');
          name.value = ''; // 清空
          remark.value = ''; // 清空
          currentPosition.value = {}; // 清空
          context.emit('init');
        }
      });
    }
    return {
      name,
      currentPosition,
      remark,
      isEdit,
      DialogSceneBoat,
      openPopup,
      handleClick,
      commit,
      deletePosition,
    };
  },
});
</script>

<style lang="scss" module>
  .scroll {
    width: 252px;
    height: 89%;
    overflow: auto;
    position:absolute;
    left: 0px;
    top: 52px;
    .listStyle {
      cursor: pointer;
      color: #FFFFFF;
      width: 231px;
      height: 38px;
      background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
      margin: 10px 0px 10px 10px;
      position: relative;
      opacity: 0.7;
      .listText {
        position: absolute;
        left: 10px;
        top: 9px;
      }
    }
    .listStyle:hover {
      opacity: 1;
    }
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .input {
    position:absolute;
    right: 10px;
    top: 10px;
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    color: #FFFFFF;
    width: 302px;
    height: 32px;
    border: 1px solid rgba(255, 255, 255, 0.65);
  }
  .text {
    position:absolute;
    right: 10px;
    top: 67px;
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    color: #FFFFFF;
    width: 302px;
    height: 185px;
    border: 1px solid rgba(255, 255, 255, 0.65);
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
</style>
