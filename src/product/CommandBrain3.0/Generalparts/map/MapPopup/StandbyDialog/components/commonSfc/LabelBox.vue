<template>
  <div :class="$style.LabelBar">
    <label>标签：</label>
    <div :class="$style['tag-box']">
      <span
        v-for="(item, index) in labelData.labelList"
        :key="index"
        :class="$style.tag"
      >{{
        item.name
      }}</span>
    </div>
  </div>
  <div
    v-if="isCamera"
    :class="$style.camera"
  >
    <i
      :class="hideLabelVisible ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
      style="cursor: pointer;position: absolute;right: 7px;top: -21px;"
      @click="hideLabelVisible = !hideLabelVisible"
    />
    <div
      v-if="hideLabelVisible"
      :class="$style['hide-label']"
    >
      <div :class="$style['hide-label-item']">
        <label :class="$style.label">常用标签：</label>
        <label
          v-for="(labelItem, labelIndex) in commonlyCameraLabels"
          :key="labelIndex"
          :class="[
            $style.value,
            cameraLabelTarget.includes(labelItem.id) ? $style['select-value'] : '',
          ]"
          @click="saveCameraLabel(labelItem)"
        >
          {{ labelItem.name }}
        </label>
      </div>
      <div :class="$style['hide-label-item']">
        <label :class="$style.label">全部标签：</label>
        <label
          :class="[$style.value]"
          style="position: relative"
          @click.self="addLabelVisibel = !addLabelVisibel"
        >
          +
          <div
            v-if="addLabelVisibel"
            :class="$style['add-label']"
          >
            <el-input
              v-model="addLabelInput"
              type="text"
              :class="$style['add-label__input']"
            />
            <label
              :class="$style['add-label__cancel']"
              @click.self="addLabelVisibel = false"
            >取消</label>
            <label
              :class="$style['add-label__confirm']"
              @click.self="addLabel"
            >确定</label>
          </div>
        </label>
        <label
          v-for="(labelItem, labelIndex) in allCameraLabels"
          :key="labelIndex"
          :class="[
            $style.value,
            cameraLabelTarget.includes(labelItem.id) ? $style['select-value'] : '',
          ]"
          @click="saveCameraLabel(labelItem)"
        >
          {{ labelItem.name }}
        </label>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
 defineComponent, ref, reactive, computed,
} from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  name: 'LabelBox',
  props: {
    cameraDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const { $http, $message } = useGlobal();
    const labelData = reactive(props.cameraDetail);
    const allCameraLabels = ref([]);
    const commonlyCameraLabels = ref([]);
    const hideLabelVisible = ref(false);
    const addLabelVisibel = ref(false);
    // const cameraLabelTarget = ref<Record<string, any>>([]);
    const cameraLabelTarget = computed(
      () => labelData.labelList.map((cur: any) => cur.id),
    );

    const addLabelInput = ref('');
    const isCamera = computed(
      () => props.cameraDetail.dialogType + props.cameraDetail.type === 'device0',
    );

    // 获取视频链标签数据
    const getCameraLabelData = () => {
      const request1 = {
        method: 'get',
        service: 'flight',
        url: '/applabel/list',
        params: {
          type: 1,
        },
      };
      $http(request1)
        .then((response: any) => {
          console.log('/applabel/list', response);
          if (response.code === 0 && response?.data) {
            allCameraLabels.value = response.data || [];
          } else {
            $message.error(
              `获取全部标签数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          $message.error(`获取全部标签数据失败，错误信息：${error}`);
        });
      const request2 = {
        method: 'get',
        service: 'flight',
        url: '/applabel/frequentlyList',
        params: {
          type: 1,
        },
      };
      $http(request2)
        .then((response: any) => {
          console.log('/applabel/frequentlyList', response);
          if (response.code === 0 && response?.data) {
            commonlyCameraLabels.value = response.data || [];
          } else {
            $message.error(
              `获取常用标签数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          $message.error(`获取常用标签数据失败，错误信息：${error}`);
        });
    };

    getCameraLabelData();
    // 确定新增标签回调函数
    const addLabel = () => {
      addLabelVisibel.value = false;
      const request = {
        method: 'post',
        service: 'flight',
        url: '/applabel/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: addLabelInput.value, // 标签名称
          labelType: 1, // 标签类型，设备标签类型为1
          labelStyle: '', // 标签样式
        },
      };
      $http(request)
        .then((response: any) => {
          console.log('/applabel/save', response);
          if (response.code === 0) {
            $message.info('新增全部标签成功');
            getCameraLabelData();
          } else {
            $message.error(`新增全部标签失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        })
        .catch((error: Error) => {
          $message.error(`新增监控失败，错误信息：${error}`);
        });
    };

    // 视频链保存标签
    const saveCameraLabel = (el: any) => {
      const index = labelData.labelList?.findIndex((item: any) => item.id === el.id);
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', !~index);

      // 存在
      if (~index) {
        cameraLabelTarget.value.splice(index, 1);
      } else {
        cameraLabelTarget.value.push(el.id);
      }
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/applabeldevice/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          deviceId: labelData.id, // 设备id
          labelIds: cameraLabelTarget.value, // 标签id
        },
      };
      $http(request)
        .then((response: any) => {
          console.log('/device/applabeldevice/save', response);
          if (response.code === 0) {
            $message.info('视频链保存标签成功');
            if (~index) {
              labelData.labelList.splice(index, 1);
            } else {
              labelData.labelList.push({ name: el.name, id: el.id });
            }
          } else {
            $message.error(
              `视频链保存标签失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          $message.error(`视频链保存标签失败，错误信息：${error}`);
        });
    };

    return {
      labelData,
      commonlyCameraLabels,
      allCameraLabels,
      hideLabelVisible,
      cameraLabelTarget,
      addLabelInput,
      addLabelVisibel,
      addLabel,
      saveCameraLabel,
      isCamera,
    };
  },
});
</script>
<style lang="scss" module>
.LabelBar {
  box-sizing: border-box;
  min-height: 40px;
  padding: 5px 0;
  line-height: 40px;
  border-top: 1px solid #2b4454;
  padding-left: 9px;
  display: flex;
  align-items: center;
  > label {
    width: 50px;
    height: 25px;
  }
  .tag-box {
    display: flex;
    flex-wrap: wrap;
    .tag {
      box-sizing: border-box;
      width: 60px;
      padding: 0 5px;
      height: 20px;
      text-align: center;
      background: #ffffff;
      border-radius: 16px;
      color: #56e9ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 5px;
      margin-bottom: 5px;
    }
  }
}
.camera {
  position: relative;
  & .hide-label {
    margin: 10px 0px;
    margin-left: 7px;
    & .hide-label-item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      margin: 6px 0px;
      & .label {
        font-size: 14px;
        color: #ffffff;
        text-align: right;
        padding: 0 12px 0 0;
      }
      & .value {
        font-size: 12px;
        color: #ffffff;
        border-radius: 10px;
        border: 1px solid #ffffff;
        margin: 2px 3px;
        min-width: 62px;
        display: inline-block;
        text-align: center;
        margin: 6px 4px;
        cursor: pointer;
      }
      & .select-value {
        font-size: 12px;
        color: #00c1de;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #ffffff;
        margin: 2px 3px;
        min-width: 62px;
        display: inline-block;
        text-align: center;
        margin: 3px 4px;
        cursor: pointer;
      }
      & .add-label {
        font-size: 12px;
        background: rgba(5, 5, 5, 0.9);
        box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 84%;
        top: -87px;
        transform: translateX(-50%);
        padding: 10px 10px 0px 10px;
        &::after {
          content: '';
          width: 0px;
          height: 0px;
          border-right: 10px solid transparent;
          border-left: 10px solid transparent;
          border-top: 10px solid rgba(5, 5, 5, 0.9);
          position: absolute;
          left: 33%;
          transform: translateX(-50%);
          top: 72px;
        }
        & .add-label__input {
          width: 85px;
          height: 24px;
          color: #ffffff;
          background: rgba(5, 5, 5, 0.9);
          border: 1px solid #a6adb4;
        }
        & .add-label__cancel {
          color: #ffffff;
          cursor: pointer;
          margin: 5px;
          display: inline-block;
        }
        & .add-label__confirm {
          color: #56e9ff;
          cursor: pointer;
          margin: 5px;
          display: inline-block;
        }
      }
    }
  }
}
</style>
