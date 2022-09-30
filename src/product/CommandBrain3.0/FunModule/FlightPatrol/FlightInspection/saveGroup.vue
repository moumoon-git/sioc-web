// 【存为分组弹窗】业务模块
<template>
  <div>
    <!-- 弹窗 -->
    <teleport to="body">
      <ModalDialog
        v-model="visible"
        title="存为分组"
      >
        <div
          v-loading="isSubmitting"
          class="flight-patrol-save-as-group"
        >
          <!-- 顶部选择器 -->
          <header>
            <span>分组名称：</span>
            <Select
              v-model="selectedExistGroupIndex"
              v-model:input-value="newCustomGroupName"
              :list="formattedExistGroupList"
              :editable="true"
              placeholder="下拉选择或输入名称"
              style="width: 370px; height: 32px;"
            />
          </header>
          <!-- 中部列表 -->
          <main>
            <List :list="deviceList">
              <template #default="{ item }">
                {{ item.name || item.deviceName || '暂无名称信息' }}
              </template>
            </List>
          </main>
          <!-- 底部按钮 -->
          <footer>
            <Button
              type="ghost"
              style="margin-right: 10px;"
              @click="visible = false;"
            >
              取消
            </Button>
            <Button
              type="primary"
              @click="handleSubmit"
            >
              保存
            </Button>
          </footer>
        </div>
      </ModalDialog>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalDialog from '@/product/CommandBrain3.0/Generalparts/dialog/ModalDialog/ModalDialog.vue';
import Select from '@/product/CommandBrain3.0/Generalparts/right/Select/Select.vue';
import List from '@/product/CommandBrain3.0/Generalparts/dialog/List/List.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';

export default defineComponent({
  name: 'SaveAsGroup',
  components: {
    // 带遮罩的弹窗
    ModalDialog,
    // 选择器
    Select,
    // 弹窗中用到的列表
    List,
    // 弹窗中用到的按钮组件
    Button,
  },
  props: {
    // 传入的摄像头列表
    deviceList: {
      type: Array,
      default: () => [],
    },
    taskData: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'refresh',
  ],
  data() {
    return {
      // 弹窗是否可见
      visible: false,
      // 选择的已有分组列表的下标
      selectedExistGroupIndex: -1,
      // 后台获取已有的分组列表
      existGroupList: [],
      // 正在提交
      isSubmitting: false,
      // 自定义新建分组名
      newCustomGroupName: '',
    };
  },
  computed: {
    formattedExistGroupList() {
      return (this as any).existGroupList.map((item: any) => item.name);
    },
  },
  mounted() {
    // this.getExistGroupList();
  },
  methods: {
    /**
     * 打开弹窗
     */
    open() {
      this.visible = true;
      this.selectedExistGroupIndex = -1;
      this.newCustomGroupName = '';
      this.getExistGroupList();
    },
    /**
     * 获取已有分组数据
     */
    getExistGroupList() {
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdrawgroup/list',
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0 && response?.data?.list) {
          this.existGroupList = response.data.list;
        } else {
          (this as any).$message.error(`获取已有分组数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        (this as any).$message.error(`获取已有分组数据失败，错误信息：${error}`);
      });
    },
    /**
     * 提交数据
     */
    handleSubmit() {
      // const list = this.deviceList as any;
      // // 勾选监控列表为空时直接返回
      // if (!list.length) {
      //   return;
      // }
      // 分组名不存在时提示
      if (!this.newCustomGroupName && !this.existGroupList[this.selectedExistGroupIndex]) {
        (this as any).$message.error('请输入分组名称或选择已有分组！');
        return;
      }
      this.isSubmitting = true;
      const request:any = {
        method: 'post',
        service: 'flight',
        // url: '/device/appdrawgroup/add',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
      };
      // 新建分组
      if (this.newCustomGroupName) {
        request.url = '/device/appdrawgroup/save';
        request.data = {
          groupName: this.newCustomGroupName,
          draws: this.taskData,
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            (this as any).$message.info('存为分组成功!');
            this.$emit('refresh');
            this.visible = false;
          } else {
            (this as any).$message.error(`存为分组失败，请重试!错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).finally(() => {
          this.isSubmitting = false;
        });
      } else {
        // 选中的已有分组
        const existGroup = this
          .existGroupList[this.selectedExistGroupIndex] as { id: number, name: string };
        request.url = '/device/appdrawgroup/add';
        request.data = {
          groupId: existGroup.id,
          draws: this.taskData,
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            (this as any).$message.info('加入分组成功!');
            this.$emit('refresh');
            this.visible = false;
          } else {
            (this as any).$message.error(`加入分组失败，请重试!错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).finally(() => {
          this.isSubmitting = false;
        });
      }
    },
  },
});
</script>

<style lang="scss">
.flight-patrol-save-as-group {
  width: 480px;
  height: 486px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  & > header {
    height: 70px;
    line-height: 70px;
    padding: 0 20px;
  }
  & > main {
    flex: 1;
    height: calc(100% - 120px);
    margin: 0 20px;
    padding: 0 10px;
    overflow-y: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  & > footer {
    height: 50px;
    line-height: 50px;
    text-align: right;
    padding: 0 20px;
    position: relative;
  }
}
</style>
