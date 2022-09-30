<template>
  <div>
    <!-- 弹窗 -->
    <teleport to="body">
      <ModalDialog
        v-model="visible"
        title="创建视频链"
      >
        <div
          v-loading="isSubmitting"
          class="flight-patrol-create-video-link"
        >
          <!-- 顶部选择器 -->
          <header>
            <span>主视频链：</span>
            <Select
              v-model="selectedMainVideoLinkIndex"
              :list="formattedMainVideoLinkList"
              placeholder="添加到已有主视频链"
              style="width: 370px; height: 32px;"
            />
          </header>
          <!-- 中部列表 -->
          <main>
            <List
              :list="deviceList"
            >
              <template #default="{ item, index }">
                <div class="flight-patrol-create-video-link__list-item">
                  {{ item.name }}
                  <span
                    v-if="index === checkedMainVideoLinkIndex"
                    class="flight-patrol-create-video-link__list-item__identifier"
                  >（主链）</span>
                  <div
                    v-if="selectedMainVideoLinkIndex === -1"
                    :class="{
                      'flight-patrol-create-video-link__list-item__checked':
                        index === checkedMainVideoLinkIndex,
                    }"
                    @click="checkedMainVideoLinkIndex = index;"
                  >
                    主链
                  </div>
                </div>
              </template>
            </List>
          </main>
          <!-- 底部按钮 -->
          <footer>
            <div
              :class="{
                'flight-patrol-create-video-link__checked': isDisplayed,
              }"
              @click="isDisplayed = !isDisplayed"
            >
              显示视频链监控
            </div>
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
  name: 'CreateVideoLink',
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
  },
  emits: [
    'refresh',
  ],
  data() {
    return {
      // 弹窗是否可见
      visible: false,
      // 选择的主视频链下标
      selectedMainVideoLinkIndex: -1,
      // 勾选的主视频链下标
      checkedMainVideoLinkIndex: -1,
      // 后台获取已有的主视频链列表
      mainVideoLinkList: [],
      // 正在提交
      isSubmitting: false,
      // 是否显示视频链监控
      isDisplayed: false,
    };
  },
  computed: {
    formattedMainVideoLinkList() {
      return (this as any).mainVideoLinkList.map((item: any) => item.name);
    },
  },
  watch: {
    // 选择已有主视频链的时候，禁用自定义主链
    selectedMainVideoLinkIndex(val: number) {
      if (val !== -1) {
        this.checkedMainVideoLinkIndex = -1;
        this.isDisplayed = !!(this.mainVideoLinkList[val] as any).display;
      }
    },
  },
  mounted() {
    this.getMainVideoList();
  },
  methods: {
    /**
     * 打开弹窗
     */
    open() {
      if (!this.deviceList?.length) {
        this.$message.error('请先勾选设备');
        return;
      }
      this.visible = true;
      this.selectedMainVideoLinkIndex = -1;
      this.checkedMainVideoLinkIndex = -1;
      this.isDisplayed = false;
      this.getMainVideoList();
    },
    /**
     * 获取已有主视频链数据
     */
    getMainVideoList() {
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdevicelist/list',
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0 && response?.data?.list) {
          this.mainVideoLinkList = response.data.list;
        } else {
          (this as any).$message.error(`获取已有主视频链数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        (this as any).$message.error(`获取已有主视频链数据失败，错误信息：${error}`);
      });
    },
    /**
     * 提交数据
     */
    handleSubmit() {
      const list = this.deviceList as any;
      // 勾选监控列表为空时直接返回
      if (!list.length) {
        return;
      }
      this.isSubmitting = true;
      // 创建视频链
      if (this.selectedMainVideoLinkIndex === -1) {
        const request = {
          method: 'post',
          service: 'flight',
          url: '/device/appdevicelist/saveOrUpdate',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            id: null,
            display: Number(this.isDisplayed),
            mainDeviceId: list[this.checkedMainVideoLinkIndex]?.id || list[0]?.id,
            deviceIds: list.map((item: { id: number }) => item.id),
            onlyAdd: false,
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            (this as any).$message.info('创建视频链成功!');
            this.$emit('refresh');
            this.visible = false;
          } else {
            (this as any).$message.error(`创建视频链失败，请重试!错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).finally(() => {
          this.isSubmitting = false;
        });
      } else {
        // 选中的已有视频链
        const mainVideoLink = this
          .mainVideoLinkList[this.selectedMainVideoLinkIndex] as {
            id: number,
            mainDeviceId: number
          };
        const request = {
          method: 'post',
          service: 'flight',
          url: '/device/appdevicelist/add',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            id: mainVideoLink.id,
            display: Number(this.isDisplayed),
            mainDeviceId: mainVideoLink.mainDeviceId,
            deviceIds: list.map((item: { id: number }) => item.id),
            onlyAdd: true,
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            (this as any).$message.info('加入视频链成功!');
            this.$emit('refresh');
            this.visible = false;
          } else {
            (this as any).$message.error(`加入视频链失败，请重试!错误代码${response.code}，错误信息：${response.msg}`);
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
.flight-patrol-create-video-link {
  width: 480px;
  height: 486px;
  color: #FFFFFF;
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
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  &__list-item {
    &:hover > &__identifier {
      display: none;
    }
    &:hover > div:last-child {
      display: block;
    }
    & > div:last-child {
      float: right;
      cursor: pointer;
      padding-left: 25px;
      position: relative;
      display: none;
      &::before {
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border: 1px solid #56E9FF;
        border-radius: 100%;
        transition: box-shadow .3s;
      }
      &.flight-patrol-create-video-link__list-item__checked::before {
        background: white;
        box-shadow: 0 0 0 3px #56E9FF inset;
      }
    }
  }
  & > footer {
    height: 50px;
    line-height: 50px;
    text-align: right;
    padding: 0 20px;
    position: relative;
    & > div:first-child {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      padding-left: 25px;
      color: #A6ADB4;
      &::before {
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border: 1px solid #A6ADB4;
        border-radius: 100%;
        transition: box-shadow .3s;
      }
      &:hover {
        color: #56E9FF;
        &::before {
          border-color: #56E9FF;
        }
      }
    }
  }
  &__checked::before {
    background: white;
    border-color: #56E9FF !important;
    box-shadow: 0 0 0 3px #56E9FF inset;
  }
}
</style>
