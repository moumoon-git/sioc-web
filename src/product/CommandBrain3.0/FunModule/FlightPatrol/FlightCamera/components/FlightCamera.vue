<template>
  <!-- 视频链弹窗表单 -->
  <form v-loading="isLoading" :class="$style['flight-camera']">
    <div :class="$style['form-item']">
      <label :class="$style.label">名称：</label>
      <div :class="$style.content">
        <label :class="$style.value">{{ cameraDetail.name }}</label>
      </div>
    </div>
    <div :class="$style['form-item']">
      <label :class="$style.label">位置：</label>
      <div :class="$style.content">
        <label :class="$style.value">
          {{ cameraDetail.address }}
        </label>
      </div>
    </div>
    <div :class="$style['form-item']">
      <label :class="$style.label">标签：</label>
      <div :class="$style.content">
        <label
          v-if="cameraDetail?.labels?.[0]?.name"
          :class="[$style.value, $style['label-value']]"
          >{{ cameraDetail?.labels?.[0]?.name || '' }}</label
        >
        <i
          :class="[
            $style['triangle-down'],
            $style['label-icon'],
            hideLabelVisible ? $style['triangle-up'] : '',
          ]"
          @click="hideLabelVisible = !hideLabelVisible"
        />
      </div>
    </div>
    <div v-if="hideLabelVisible" :class="$style['hide-label']">
      <div :class="$style['hide-label-item']">
        <label :class="$style.label">常用标签：</label>
        <label
          v-for="(labelItem, labelIndex) in commonlyCameraLabels"
          :key="labelIndex"
          :class="[
            $style.value,
            cameraLabelTarget.id === labelItem.id ? $style['select-value'] : '',
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
          <div v-if="addLabelVisibel" :class="$style['add-label']">
            <input
              ref="add-label__input"
              type="text"
              :class="$style['add-label__input']"
            />
            <label
              :class="$style['add-label__cancel']"
              @click.self="addLabelVisibel = false"
              >取消</label
            >
            <label :class="$style['add-label__confirm']" @click.self="addLabel"
              >确定</label
            >
          </div>
        </label>
        <label
          v-for="(labelItem, labelIndex) in allCameraLabels"
          :key="labelIndex"
          :class="[
            $style.value,
            cameraLabelTarget.id === labelItem.id ? $style['select-value'] : '',
          ]"
          @click="saveCameraLabel(labelItem)"
        >
          {{ labelItem.name }}
        </label>
      </div>
    </div>
    <div v-if="cameraDetail.isMain === 0" :class="$style['form-item']">
      <label :class="$style.label">视频链：</label>
      <div :class="$style.content">
        <div
          v-for="(formItem, formIndex) in cameraDetail.devices"
          :key="formIndex"
          :class="[$style.value, $style['camera-link']]"
          @mouseenter="hoverIndex = formIndex"
          @mouseleave="hoverIndex = ''"
        >
          <input
            v-if="editVisible"
            type="checkbox"
            @click="getDeleteCheckedCamera(formItem)"
          />
          <span>{{ formItem.name }}</span>
          <div
            v-if="hoverIndex === formIndex && editVisible"
            :class="$style['checkbox-wrap']"
          >
            <label :class="$style['checkbox-circular']">
              <input
                v-model="formItem.checked"
                type="checkbox"
                @change="handleSetMainChainCheck(formIndex)"
              />
              <span />
            </label>
            <label>主链</label>
          </div>
          <i v-if="hoverIndex === formIndex" :class="$style['review-icon']" />
          <i
            v-if="hoverIndex === formIndex && editVisible"
            :class="$style['delete-icon']"
            @click="cameraDetail.devices.splice(formIndex, 1)"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { defineComponent, inject, watch, getCurrentInstance } from 'vue';
import rimHandler from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/script';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'FlightCamera',
  inject: ['$MessageBox'],
  props: {
    // 新增监控树状分组勾选数据
    cameraTreeCheckedNodes: {
      type: Array,
      default: () => [],
    },
    // 是否编辑视频链
    editVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const cameraDetail = inject('cameraDetail');
    const store = useStore(); // 使用vuex
    const internalInstance = getCurrentInstance();
    const { renderCircle, centerCircle, loadingMap } = rimHandler(
      internalInstance,
      store,
      'retrieval',
    );
    console.log('internalInstance', internalInstance);
    watch(cameraDetail, (newValue, oldValue) => {
      internalInstance.proxy.getCameraData();
    });
    cameraDetail?.devices?.forEach((item) => {
      item.checked = false;
    });

    // 周边检索
    function rim(isrim) {
      if (isrim) {
        const option = {
          longitude: cameraDetail.value?.longitude,
          latitude: cameraDetail.value?.latitude,
        };
        store.commit('retrieval/SET_peripheralSearch', {
          type: 'peripheralSearch',
          centerCircleData: option,
        });
        window.map.setCentent(option, 12);
      } else {
        loadingMap();
      }
    }
    return {
      // 监控详情数据
      cameraDetail,
      renderCircle,
      centerCircle,
      loadingMap,
      rim,
    };
  },
  data() {
    return {
      // 自定义标签是否可见
      hideLabelVisible: false,
      // 加载中
      isLoading: false,
      // 视频链表单对象
      cameraForm: {},
      // 全部标签数组
      allCameraLabels: [],
      // 常用标签数组
      commonlyCameraLabels: [],
      // 是否保存视频链编辑
      isSaveEdit: false,
      // 视频链标签对象
      cameraLabelTarget: {},
      // 视频链批量删除勾选中的对象
      deleteCheckedCamera: [],
      // 新增label是否可见
      addLabelVisibel: false,
      // hover的序号
      hoverIndex: '',
    };
  },
  // 2021 4-20添加，解决只能点击一次出现弹框的问题
  // watch: {
  //   cameraDetail: {
  //     handler(val) {
  //       this.getCameraLabelData();
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },
  mounted() {
    this.getCameraLabelData();
  },
  methods: {
    // 获取视频链数据
    getCameraData() {
      if (this.cameraDetail.isMain && this.cameraDetail.isMain === 1) {
        this.isLoading = true;
        const request = {
          method: 'post',
          service: 'flight',
          url: '/device/appdevicelist/listByMainId',
          headers: {
            'Content-Type': 'application/json',
          },
          data: [this.cameraDetail.id],
        };
        this.$http(request)
          .then((response) => {
            console.log('/device/appdevicelist/listByMainId', response);
            if (response.code === 0 && response?.data?.list) {
              this.cameraDetail.devices = response.data.list[0].devices;
            } else {
              this.$message.error(
                `获取监控视频数据失败，错误代码${response.code}，错误信息：${response.msg}`,
              );
            }
          })
          .catch((error) => {
            this.$message.error(`获取监控视频数据失败，错误信息：${error}`);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    // 获取视频链标签数据
    getCameraLabelData() {
      const request1 = {
        method: 'get',
        service: 'flight',
        url: '/applabel/list',
        params: {
          type: 1,
        },
      };
      this.$http(request1)
        .then((response) => {
          console.log('/applabel/list', response);
          if (response.code === 0 && response?.data) {
            this.allCameraLabels = response.data || [];
          } else {
            this.$message.error(
              `获取全部标签数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`获取全部标签数据失败，错误信息：${error}`);
        });
      const request2 = {
        method: 'get',
        service: 'flight',
        url: '/applabel/frequentlyList',
        params: {
          type: 1,
        },
      };
      this.$http(request2)
        .then((response) => {
          console.log('/applabel/frequentlyList', response);
          if (response.code === 0 && response?.data) {
            this.commonlyCameraLabels = response.data || [];
          } else {
            this.$message.error(
              `获取常用标签数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`获取常用标签数据失败，错误信息：${error}`);
        });
    },
    // 视频链保存标签
    saveCameraLabel(el) {
      const existLabel = this.cameraDetail?.labels?.find(
        (item) => item.id === el.id,
      );
      this.cameraLabelTarget = existLabel ? {} : el;
      this.cameraDetail.labels = existLabel ? [] : [this.cameraLabelTarget];

      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/applabeldevice/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          deviceId: this.cameraDetail.id, // 设备id
          labelIds: existLabel ? [] : [this.cameraLabelTarget.id], // 标签id
        },
      };
      this.$http(request)
        .then((response) => {
          console.log('/device/applabeldevice/save', response);
          if (response.code === 0) {
            this.getCameraData();
            if (existLabel) {
              this.$message.info('视频链取消标签成功');
            } else {
              this.$message.info('视频链保存标签成功');
            }
          } else {
            this.$message.error(
              `视频链保存标签失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`视频链保存标签失败，错误信息：${error}`);
        });
    },
    // 删除或全部解散视频链
    dismissCamera() {
      if (!this.isSaveEdit) {
        this.cameraDetail.devices = [];
      } else {
        this.updateCameraLink(
          this.cameraDetail.id,
          this.cameraDetail.mainDeviceId,
          this.cameraDetail.devices,
        )
          .then((response) => {
            console.log('/device/appdevicelist/add', response);
            if (response.code === 0) {
              this.$message.info('解散视频链成功');
            } else {
              this.$message.error(
                `解散视频链失败，错误代码${response.code}，错误信息：${response.msg}`,
              );
            }
          })
          .catch((error) => {
            this.$message.error(`解散视频链失败，错误信息：${error}`);
          });
      }
    },
    // 添加监控
    addFlightCamera() {
      if (this.isSaveEdit) {
        this.updateCameraLink(
          this.cameraDetail.id,
          this.cameraDetail.mainDeviceId,
          this.cameraTreeCheckedNodes.filter((item) => item.id),
        )
          .then((response) => {
            console.log('/device/appdevicelist/add', response);
            if (response.code === 0) {
              this.$message.info('新增监控成功');
            } else {
              this.$message.error(
                `新增监控失败，错误代码${response.code}，错误信息：${response.msg}`,
              );
            }
          })
          .catch((error) => {
            this.$message.error(`新增监控失败，错误信息：${error}`);
          });
      }
    },
    // 获取视频链批量删除勾选中的对象
    getDeleteCheckedCamera(el) {
      if (
        this.deleteCheckedCamera.filter((item) => item.id === el.id).length ===
        0
      ) {
        this.deleteCheckedCamera.push(el);
      } else {
        this.deleteCheckedCamera = this.deleteCheckedCamera.filter(
          (item) => item.id !== el.id,
        );
      }
    },
    // 批量删除视频链
    deleteCamera() {
      if (!this.isSaveEdit) {
        this.deleteCheckedCamera.forEach((deleteItem) => {
          this.cameraDetail.devices = this.cameraDetail.devices.filter(
            (item) => item.id !== deleteItem.id,
          );
        });
      } else {
        this.updateCameraLink(
          this.cameraDetail.id,
          this.cameraDetail.mainDeviceId,
          this.cameraDetail.devices.filter((item) => item.id),
        )
          .then((response) => {
            console.log('/device/appdevicelist/add', response);
            if (response.code === 0) {
              this.$message.info('批量删除视频链成功');
            } else {
              this.$message.error(
                `批量删除视频链失败，错误代码${response.code}，错误信息：${response.msg}`,
              );
            }
          })
          .catch((error) => {
            this.$message.error(`批量删除视频链失败，错误信息：${error}`);
          });
      }
    },
    // 更新视频链
    updateCameraLink(id, mainDeviceId, deviceIds) {
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdevicelist/add',
        data: {
          id, // 视频链id
          display: 1, // 是否显示
          mainDeviceId, // 主视频id
          deviceIds, // 要添加的视频id
          onlyAdd: true, // 是否加入已存在的视频链，当为true时,视频链id不能为null
        },
      };
      return this.$http(request);
    },
    // 编辑视频链保存
    saveFlightCamera() {
      this.$MessageBox({
        title: '保存提示',
        message: '确认保存视频链修改?',
      }).then(() => {
        // 设视频标签
        // this.saveCameraLabel();
        // 删除视频链
        this.dismissCamera();
        // 添加监控
        this.addFlightCamera();
        // 批量删除视频链
        this.deleteCamera();
        // 设为主链
        this.setAsMainChain();
      });
    },
    // 确定新增标签回调函数
    addLabel() {
      this.addLabelVisibel = false;
      const request = {
        method: 'post',
        service: 'flight',
        url: '/applabel/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: this.$refs['add-label__input'].value, // 标签名称
          labelType: 1, // 标签类型，设备标签类型为1
          labelStyle: '', // 标签样式
        },
      };
      this.$http(request)
        .then((response) => {
          console.log('/applabel/save', response);
          if (response.code === 0) {
            this.$message.info('新增全部标签成功');
            this.getCameraLabelData();
          } else {
            this.$message.error(
              `新增全部标签失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`新增监控失败，错误信息：${error}`);
        });
    },
    // 设为主链
    setAsMainChain() {
      if (
        this.cameraDetail.devices.filter((item) => item.checked === true)
          .length === 0
      ) {
        return false;
      }
      this.updateCameraLink(
        this.cameraDetail.id,
        this.cameraDetail.devices.filter((item) => item.checked === true),
        this.cameraDetail.devices,
      )
        .then((response) => {
          console.log('/device/appdevicelist/add', response);
          if (response.code === 0) {
            this.$message.info('设为主链成功');
          } else {
            this.$message.error(
              `设为主链成功失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`设为主链成功失败，错误信息：${error}`);
        });
    },
    // 设为主链checkbox点击回调函数
    handleSetMainChainCheck(index) {
      this.cameraDetail.devices.forEach((item) => {
        item.checked = false;
      });
      this.cameraDetail.devices[index].checked = true;
    },
    // 预览
    preview() {
      if (this.cameraDetail.isMain === 1) {
        this.$store.commit(
          'flightPatrol/SET_flightPatrolPreviewCachePool',
          this.cameraDetail.devices,
        );
      } else {
        this.$store.commit(
          'flightPatrol/SET_flightPatrolPreviewCachePool',
          this.cameraDetail,
        );
      }
    },
  },
});
</script>

<style lang="scss" module>
.flight-camera {
  width: 470px;
  padding: 8px 0px;
  & .form-item {
    display: table;
    margin: 10px 0px;
    width: 100%;
    & .triangle-down {
      width: 0;
      height: 0;
      border-left: 0.4em solid transparent;
      border-right: 0.4em solid transparent;
      border-top: 0.6em solid #a6adb4;
      transition: transform 0.3s;
    }
    & .triangle-up {
      transform: rotate(-180deg);
    }
    & .label {
      font-size: 14px;
      color: #ffffff;
      width: 80px;
      text-align: right;
      padding: 0 12px 0 0;
      display: table-cell;
    }
    & .content {
      display: table-cell;
      position: relative;
      & .value {
        font-size: 14px;
        color: #ffffff;
        margin-bottom: 8px;
        display: flex;
      }
      & .label-value {
        font-size: 12px;
        color: #00c1de;
        padding: 2px 8px;
        background: #ffffff;
        border-radius: 10px;
        cursor: pointer;
        display: inline;
      }
      & .label-icon {
        cursor: pointer;
        position: absolute;
        right: 6%;
        top: 50%;
        // transform: translateY(-50%);
      }
    }
    & .camera-link {
      position: relative;
      align-items: center;
      &:hover {
        color: #56e9ff;
      }
      & .review-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(../assets/review.svg) no-repeat 0px/16px;
        position: absolute;
        right: 30%;
        cursor: pointer;
      }
      & .delete-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(../assets/delete.svg) no-repeat 0px/16px;
        position: absolute;
        right: 20%;
        cursor: pointer;
      }
      & .checkbox-wrap {
        position: absolute;
        right: 40%;
        & > * {
          color: #56e9ff;
          margin-left: 4px;
        }
        & .checkbox-circular span {
          border-radius: 50%;
          border: 1px solid #56e9ff;
          width: 10px;
          height: 10px;
          line-height: 10px;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
        }
        & .checkbox-circular input[type='checkbox'] {
          display: none;
        }
        & .checkbox-circular input[type='checkbox']:checked + span {
          position: relative;
          background: #00c1de;
          border: 1px solid #00c1de;
        }
        & .checkbox-circular input[type='checkbox']:checked + span:after {
          content: '';
          border-radius: 50%;
          top: 50%;
          transform: translate(-49%, -50%);
          position: absolute;
          background: #fff;
          border: #00c1de solid 2px;
          height: 8px;
          width: 8px;
        }
      }
    }
  }
  & .hide-label {
    margin: 10px 0px;
    margin-left: 92px;
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
        left: 50%;
        top: 30px;
        transform: translateX(-50%);
        padding: 10px 10px 0px 10px;
        &::after {
          content: '';
          width: 0px;
          height: 0px;
          border-right: 10px solid transparent;
          border-left: 10px solid transparent;
          border-bottom: 10px solid rgba(5, 5, 5, 0.9);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -12px;
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
