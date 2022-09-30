<template>
  <div class="chat-content-container">
    <!-- 任务进度 R1先不做 -->
    <div></div>

    <!-- 聊天内容 -->
    <div class="chat-content-container-body" @click="handleClickChatContent">
      <van-pull-refresh v-model="isLoading" success-text="" @refresh="onRefresh">
        <ChatContent :chatList="chatList" @clickRead="handleClickRead"/>
      </van-pull-refresh>
    </div>

    <!-- 底部 -->
    <div ref="chatFooter" class="chat-content-container-footer">
      <div
        v-if="
          chatForm.attachments.images.length > 0 ||
            chatForm.attachments.files.length > 0 ||
            chatForm.attachments.videos.length > 0
        "
        class="chat-content-container-footer-arrow"
        @click="handleShowContentToBeSent"
      >
        <div class="img-arrow-down"></div>
      </div>

      <!-- 待发送的内容 -->
      <div v-if="isShowContentToBeSent" class="footer-container_response-content-container">
        <ContentToBeSent
          :chatForm="chatForm"
          @handleDeleteFile="handleDeleteFile"
          @handleDeleteImage="handleDeleteImage"
          @handleDeleteLocation="handleDeleteLocation"
        />
      </div>

      <!-- 按钮 -->
      <div class="footer-container_button-list">
        <!-- 语音 R1版本不开发 -->
        <!-- <div v-if="isVoice" class="img-voice" @click="switchVoiceOrText"></div> -->

        <!-- 键盘 -->
        <!-- <div
            v-if="!isVoice"
            class="img-keyboard"
            @click="switchVoiceOrText"
          ></div> -->

        <!-- 语音——按住说话  R1版本不开发 -->
        <!-- <div v-if="isVoice" class="voice-input">按住说话</div> -->

        <!-- 输入文字内容 -->
        <van-field
          id="input"
          v-if="!isVoice"
          v-model="chatForm.text"
          :disabled="inputDisabled"
          label=""
          placeholder=""
          class="response-input"
          @focus="handleInputFocus"
          @click="handleInputClick"
        />
        <!-- 添加 -->
        <div class="img-add" @click="showPopup"></div>
        <!-- 发送 -->
        <div class="submit-button" @click="reportDistributionResult">发送</div>
      </div>

      <!-- 弹出的按钮 -->
      <!-- <div v-if="isShowPopupButton" class="footer-container_popup-button-list"> -->
      <div class="footer-container_popup-button-list">
        <div class="popup-button_item margin-right_1">
          <van-uploader
            v-model="fileList"
            :preview-image="false"
            :before-read="beforeUploadFiles"
            :after-read="afterRead"
            multiple
            :max-size="maxFileSize"
            @oversize="onOversize"
            lazy-load
          >
            <div class="popup-button_item_image">
              <div class="img-picture"></div>
            </div>
          </van-uploader>
          <span class="popup-button_item_label">图片</span>
        </div>
        <div class="popup-button_item margin-right_1">
          <van-uploader
            v-model="fileList"
            :preview-image="false"
            :before-read="beforeUploadFiles"
            :after-read="afterRead"
            capture="camera"
            accept="image/*"
            :max-size="maxFileSize"
            @oversize="onOversize"
            lazy-load
          >
            <div class="popup-button_item_image">
              <div class="img-camera"></div>
            </div>
          </van-uploader>
          <span class="popup-button_item_label">拍摄</span>
        </div>
        <!-- 以下都是R2才做的功能 -->
        <!-- <div class="popup-button_item margin-right_1">
            <van-uploader
              v-model="fileList"
              :preview-image="false"
              :before-read="beforeUploadFiles"
              :after-read="afterRead"
              :accept="acceptFileType"
              multiple
              :max-size="maxFileSize"
              @oversize="onOversize"
            >
              <div class="popup-button_item_image">
                <div class="img-file"></div>
              </div>
            </van-uploader>
            <span class="popup-button_item_label">文件</span>
          </div>
        <div class="popup-button_item">
          <div class="popup-button_item_image" @click="getLocation">
            <div class="img-location"></div>
          </div>
          <span class="popup-button_item_label">位置</span>
        </div>
        <div class="popup-button_item margin-right_1">
            <div class="popup-button_item_image">
              <div class="img-video"></div>
            </div>
            <span class="popup-button_item_label">短视频</span>
          </div>
          <div class="popup-button_item margin-right_1">
            <div class="popup-button_item_image">
              <div class="img-live"></div>
            </div>
            <span class="popup-button_item_label">直播</span>
          </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  onBeforeUnmount,
  getCurrentInstance,
  reactive,
} from 'vue';
// 组件——聊天内容
import ChatContent from './ChatContent.vue';
// 组件——待发送内容
import ContentToBeSent from './components/ContentToBeSent.vue';
// 逻辑——时间相关业务
import $time from '../assets/js/time';
// 逻辑——文件相关业务
import $file from '../assets/js/file';
// 组件——提示弹窗
import { Toast, Notify } from 'vant';
import $handleLocation from '@/product/SIOC-H5/mainCapacity/Location/location';

export default defineComponent({
  name: 'TaskDynamic',
  components: {
    ChatContent,
    ContentToBeSent,
  },
  props: {
    // 任务id
    id: {
      type: [String, Number],
      default: 1,
    },
  },
  setup(props, {emit}) {
    const instance = getCurrentInstance();
    const { $http, $location, $websocket, $ws }: any = instance?.appContext.config.globalProperties;
    const isShowPopupButton = ref(false); // 显示|隐藏 弹出框
    const isShowContentToBeSent = ref(false); // 待发送的内容
    const isVoice = ref(false); // 切换输入语音和文本模式 false：文本 | true：语音
    const taskId = props.id; // 任务id 测试使用
    const acceptFileType = $file.acceptFileType; // 可支持上传的文件类型
    const { GDLocation }: any = $handleLocation();
    /** -------------------- 底部——样式的交互 start -------------------------------------------------------------------------- */

    /**
     * @description 获取底部的高度
     */
    function getFooterHeight() {
      nextTick(() => {
        const chatFooterPopupButton: any = document.getElementsByClassName(
          'footer-container_popup-button-list',
        )[0]; // 底部弹出按钮
        const chatFooter: any = document.getElementsByClassName('chat-content-container-footer')[0]; // 底部
        const chatBody: any = document.getElementsByClassName('chat-content-container-body')[0]; // 聊天内容
        const chatFooterPopupButtonHeight: any = chatFooterPopupButton.offsetHeight;
        const footerHeight: any = chatFooterPopupButton.offsetHeight;
        const chatFooterHeight: any = chatFooter.offsetHeight;
        if (isShowPopupButton.value) {
          chatFooter.style.cssText = 'transform: translate(0, 0);animation-duration: 4s';
          chatBody.style.cssText = 'padding-bottom:' + chatFooterHeight + 'px';
        } else {
          chatFooter.style.cssText =
            'transform: translate(0, ' + footerHeight + 'px);animation-duration: 4s';
          chatBody.style.cssText =
            'padding-bottom:' + (chatFooterHeight - chatFooterPopupButtonHeight) + 'px';
        }
        scrollToBottom(); // 将浏览器滚动条设置到最底部
      });
    }

    /**
     * @description 显示|隐藏 弹出框
     */
    function showPopup() {
      if (!handleInputDisabled()) {
        return false;
      }
      setTimeout(() => {
        isShowPopupButton.value = !isShowPopupButton.value;
        // setTimeout(() => {
        getFooterHeight();
        // }, 10)
      }, 100);
    }

    /**
     * @description 待发送内容-旋转箭头
     */
    function rotateArrow() {
      // 上下箭头
      const arrow = document.getElementsByClassName('chat-content-container-footer-arrow');
      if (!isShowContentToBeSent.value) {
        arrow[0].classList.add('rotate_180'); // 收缩状态 （图标初始状态是“下拉”的，要改成“上拉”状态）
      } else {
        arrow[0].classList.remove('rotate_180'); // 展开状态 （图标初始状态是“下拉”的，还原“下拉”状态）
      }
    }

    /**
     * @description 上拉显示待发送内容，下拉隐藏待发送内容
     */
    function handleShowContentToBeSent() {
      isShowContentToBeSent.value = !isShowContentToBeSent.value;
      // const chatBody: any = document.getElementsByClassName('chat-content-container-body')[0]; // 聊天内容
      // const chatFooter: any = document.getElementsByClassName('chat-content-container-footer')[0]; // 底部
      // const footerHeight = chatFooter.offsetHeight;
      // chatBody.style.cssText  = "padding-bottom:" + footerHeight + 'px';
      rotateArrow(); // 待发送内容-旋转箭头
      scrollToBottom(); // 将浏览器滚动条设置到最底部
    }

    /**
     * @description 将浏览器滚动条设置到最底部
     */
    function scrollToBottom() {
      nextTick(() => {
        const chatContainer: any = document.getElementsByClassName('chat-content-container')[0]; // 聊天内容-父级
        const chatBody: any = document.getElementsByClassName('chat-content-container-body')[0]; // 聊天内容-子级
        chatContainer.scrollTop = chatBody.offsetHeight;
      });
    }

    /**
     * @description 输入框获得焦点时触发
     */
    function handleInputFocus() {
      isShowPopupButton.value = false;
      setTimeout(() => {
        getFooterHeight();
      }, 10);
    }

    /**
     * @description 输入框点击触发
     */
    function handleInputClick() {
      handleInputDisabled();
    }

    /**
     * @description 任务是完成或取消状态，不能再发送任务动态
     */
    function handleInputDisabled() {
      if (inputDisabled.value) {
        Toast(`任务${taskStatus.value}，无法发送任务动态`);
        return false;
      } else {
        return true;
      }
    }
    /**
     * @description 点击聊天内容隐藏底下弹出框
     */
    function handleClickChatContent() {
      if (isShowPopupButton.value) {
        isShowPopupButton.value = false;
      }
    }

    /**
     * @description 切换输入语音和文本模式
     */
    function switchVoiceOrText() {
      isVoice.value = !isVoice.value;
    }

    const inputDisabled = ref(false); // 输入框是否禁止输入。任务是完成或取消状态，不能再发送任务动态
    const taskStatus = ref(''); // 任务状态
    /**
     * @description 获取任务动态详情, 任务是完成或取消状态，不能再发送任务动态
     */
    function getTaskDetail(taskId: string | number) {
      const requestData: Object = {
        method: 'get',
        service: 'app',
        url: '/task/getTaskDetail',
        params: {
          taskId: taskId,
        },
      };
      ($http as any)(requestData)
        .then((res: any) => {
          if (res.errorcode === 0) {
            // 任务状态
            taskStatus.value = res.data.statusCode === 'cancel' ? '已取消' : res.data.statusCode === 'finished' ? '已完成' : '执行中';

            if(res.data.statusCode === 'cancel' || res.data.statusCode === 'finished') {
              // 输入框禁用
              inputDisabled.value = true;
            }
          }
        }).catch((error: any) => {})
    }
    getTaskDetail(taskId);
    /** -------------------- 底部——样式的交互 end -------------------------------------------------------------------------- */

    /** ------------------------- 获取任务动态的数据和业务逻辑 start -------------------------------------- */
    // ------------------ 获取任务动态的数据：-------------------
    let totalPages = ref(0); // 总页数
    let totalElements = ref(0); // 总条数
    let page = ref(1); // 页数
    let size = ref(10); // 每页数据条数
    let chatList: any = ref([]); // 聊天列表
    const contactorId = !!(window as any)?.task?.getIsApp() ? Number((window as any)?.task?.getUserId()) : Number(localStorage.getItem('userId')) ; // 登录用户Id
    console.log('任务动态-用户id：', contactorId);
    let attachmentIds: any = ref([]); // 选中文件的ID
    let isLoading = ref(false); // 下拉刷新-刷新中的效果

    // 聊天内容表单
    let chatForm = ref({
      text: '', // 文字
      attachments: {
        images: [], // 图片
        files: [], // 文档
        videos: [], // 视频 R1版本先不做
      },
      // 定位
      location: {
        address: '', // 定位地址
        longitude: '', // 经度
        latitude: '', // 纬度
      },
    });

    // -------------------------------- 获取任务动态的业务逻辑：start --------------------------------
    
    /**
     * @description 将动态设为已读
     */
    function setDataReaded() {
      // 接口请求数据
      const requestData = {
        method: 'get',
        service: 'app',
        url: '/task/readResult',
        params: {
          taskId,
        }
      };
      ($http as any)(requestData)
        .then((res: any) => {
          if (res.errorcode === 0) {
            console.log('已设为已读')
          }
        })
    }

    /**
     * @description 设置反馈为已读状态
     */
    function setDistributionResultRead(id: string | number) {
      let formData = new FormData();
      formData.append('resultIds', `[${id}]`)
      // 接口请求数据
      const requestData = {
        method: 'post',
        service: 'app',
        url: '/task/setDistributionResultRead',
        data: {
          resultIds: [id]
        },
        headers: {
          applicationType: 'json'
        }
      };
      ($http as any)(requestData)
        .then((res: any) => {
          if (res.errorcode === 0) {
            console.log('已设为已读')
          }
        })
    }

    /**
     * @description 拿到消息后的回调
     */
    function websocketCallback(result: any) {
      let data = ref({}); // 数据
      if (result.taskId == taskId) {
        // 避免接收到重复的消息，先判断是否有加入到聊天列表，如果有加入的话，就不用重复加入
        let _index = chatList.value.findIndex((el: any) => {
          return el.id == result.data.id;
        });
        if (_index < 0) {
          data.value = formatData(result.data);
          chatList.value.push(data.value);
          // 接受的消息不是本人发送的，就设为已读
          if (result.data.contactorId !== Number(localStorage.getItem('userId'))) {
            setDistributionResultRead(result.data.id);
          }
        }
      }
      setDataReaded(); // 将动态设为已读
    }

    /**
     * @description 封装数据
     */
    function formatData(item: any) {
      console.log('封装数据')
      let reportTime = $time.getTimeDivision(item.reportTime.replace(/\-/g, "/"));
      let data = {
        id: item.id,
        contactor: {
          isMe: contactorId == item.contactorId ? 1 : 0, // 1：我；0：别人
          id: item.contactorId, // 联系人ID
          contactorTypeCode: item.contactorTypeCode, // 用户角色：管理员
          name:
            item.contactorTypeCode === 'admin' && item.user
              ? item.user.name
              : item.mailContactorVo
              ? item.mailContactorVo.name
              : '', // 联系人姓名
          // headPortraitUrl: "https://img.yzcdn.cn/vant/cat.jpeg", // 头像地址
          contactorTypeName: item.contactorTypeName, // 用户角色
          position:
            item.contactorTypeCode === 'admin'
              ? ''
              : item.mailContactorVo
              ? item.mailContactorVo.position
              : '', // 职位
          groupName:
            item.contactorTypeCode === 'admin'
              ? ''
              : item.mailContactorVo
              ? item.mailContactorVo.groupName
              : '', // 分组
          userInformation:
            item.contactorTypeCode === 'admin' && item.user
              ? item.user
              : item.mailContactorVo
              ? item.mailContactorVo
              : {}, // 用户信息
        },
        // 聊天内容
        chatContentInformation: {
          id: item.id, // 聊天ID
          reportTime: item.reportTime, // 报送时间 | 发送时间
          timeDivision: reportTime, // 时间分割
          taskStatusName: item.operateTypeName, // 任务状态-name
          taskStatusCode: item.operateTypeCode, // 任务状态-code
          text: item.content, // 聊天文本
          // 定位信息
          location: {
            address: item.address ? item.address : '', // 地址
            longitude: item.cgcsLongitude || item.longitude, // 经度
            latitude: item.cgcsLatitude || item.latitude, // 纬度
          },
          unreadNum: item.unreadNum // 未读人数
        },
        // 附件内容
        attachments: {
          files: [],
          images: [],
          videos: [],
        },
        // 回复内容
        beRepliedContent: {},
      };
      // 任务附件数据格式拼接：
      let attachments = {};
      if (item.appAttachments.length > 0) {
        let files: any = [];
        let images: any = [];
        let videos: any = [];
        item.appAttachments.forEach((el: any) => {
          let file: any = {
            id: el.id, // 文件ID
            fileName: el.filename, // 文件名字
            title: el.title, // 文件名字
            name: el.title, // 文件名字
            url: el.url, // 文件路径
            size: el.size, // 文件大小
            extension: $file.getExtensions(el.filename), // 文件后缀
          };
          // 文档类型:
          if (el.dictionaryType.code === 'file') {
            files.push(file);
          }
          // 图片类型:
          if (el.dictionaryType.code === 'image') {
            images.push(file);
          }
          // 视频类型:
          if (el.dictionaryType.code === 'video') {
            videos.push(file);
          }
        });
        Object.assign(attachments, { files: files });
        Object.assign(attachments, { images: images });
        Object.assign(attachments, { videos: videos });
        Object.assign(data, { attachments: attachments });
      }
      setTimeout(() => {
        scrollToBottom(); // 获取完最新数据，div高度会被内容撑开，使用此方法才能获取到最新高度，才能将浏览器滚动条设置到最底部
      }, 100)
      return data;
    }
    /**
     * @description 下拉刷新
     */
    function onRefresh() {
      page.value = page.value + 1;
      // 请求的页数不能超过总页数
      if (totalElements.value !== chatList.value.length) {
        getTaskDistributionResult(true); // true：要下拉刷新数据。false：不用下拉刷新数据
      } else {
        isLoading.value = false;
        page.value = totalPages.value - 1;
      }
    }

    /**
     * @description 初始化数据
     */
    function initTaskDynamicData() {
      chatForm.value.text = '';
      chatForm.value.attachments.images = [];
      chatForm.value.attachments.files = [];
      chatForm.value.attachments.videos = [];
      // 上报完信息不用清空地址
      // chatForm.value.location.address = '';
      // chatForm.value.location.longitude = '';
      // chatForm.value.location.latitude = '';

      images.value = [];
      files.value = [];
      videos.value = [];
    }

    /**
     * @param {Boolean} isRefresh true：要下拉刷新数据。false：不用下拉刷新数据
     * @description 获取任务动态
     */
    function getTaskDistributionResult(isRefresh: any) {
      // 接口请求数据
      const requestData: any = {
        method: 'get',
        service: 'app',
        url: '/task/getTaskDistributionResult',
        params: {
          taskId: taskId, // 任务ID
          page: page.value, // 页码
          size: size.value, // 每页数据条数
        },
      };
      ($http as any)(requestData)
        .then((res: any) => {
          if (res.errorcode === 0) {
            isLoading.value = false;
            var result: any = ref([]);
            result.value = isRefresh ? res.data.data.reverse() : res.data.data;
            result.value.forEach((item: any) => {
              let data= formatData(item); // 封装数据
              let _index = chatList.value.findIndex((el: any) => {
                return el.id == item.id;
              });
              if (_index < 0) {
                if (isRefresh) {
                  chatList.value.unshift(data);
                } else {
                  chatList.value.push(data);
                }
              }
            });

            Object.assign(chatList.value, chatList.value);
            Object.assign(chatList.value, { totalPages: res.data.totalPages });
            Object.assign(chatList.value, { totalElements: res.data.totalElements });
            totalPages.value = res.data.totalPages; // 总页数
            totalElements.value = res.data.totalElements; // 总条数

            // 不是下拉刷新数据，滚动条就不用置底 （isRefresh true：要下拉刷新数据。false：不用下拉刷新数据）
            if (!isRefresh) {
              scrollToBottom(); // 获取完最新数据，div高度会被内容撑开，使用此方法才能获取到最新高度，才能将浏览器滚动条设置到最底部
            }
          } else {
            Notify({
              type: 'danger',
              message: `获取任务动态失败，错误代码${res.code}，错误信息：${res.msg}`,
            });
          }
        })
        .catch((error: any) => {
          isLoading.value = false;
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取任务动态失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @description 任务反馈上报
     */
    function reportDistributionResult() {
      if (!handleInputDisabled()) {
        return false;
      }
      // 没有内容不能执行发送方法
      if (
        attachmentIds.value.length === 0 &&
        chatForm.value.text === ''
      ) {
        return;
      }
      const requestData = {
        method: 'post',
        service: 'app',
        url: '/task/reportDistributionResult',
        data: {
          taskId: taskId,
          data: {
            attachmentIds: attachmentIds.value,
            content: chatForm.value.text,
            address: chatForm.value.location.address,
            cgcsLatitude: chatForm.value.location.latitude,
            cgcsLongitude: chatForm.value.location.longitude,
            latitude: chatForm.value.location.latitude,
            longitude: chatForm.value.location.longitude,
          },
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
        ($http as any)(requestData)
          .then((res: any) => {
            if (res.errorcode === 0) {
              page.value = 1;
            } else {
              Notify({
                type: 'danger',
                message: `任务反馈上报失败，错误代码${res.code}，错误信息：${res.msg}`,
              });
            }
          })
          .catch((error: any) => {
            if (error.code) {
              Notify({
                type: 'danger',
                message: `任务反馈上报失败，错误代码${error.code}，错误信息：${error.msg}`,
              });
            }
          });

      setTimeout(() => {
        initTaskDynamicData();
      }, 100);
    }

    let fileList: any = reactive([]);
    let images: any = ref([]);
    let files: any = ref([]);
    let videos: any = ref([]);
    /**
     * @description 文件上传方法
     */
    function fileUploadAttachment(file: FileList) {
      let fileData: any = ref(new FormData());
      fileData.value.append('file', file);
      fileData.value.append('type', '3'); // 文件类型（0：系统文件 1 事件附件  2 预案附件  3 任务附件 4 协同标绘）
      var requestData3: any = ref({
        method: 'post',
        service: 'file',
        url: '/appAttachment/fileUploadAttachment',
        data: fileData.value,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      });
      ($http as any)(requestData3.value)
        .then((res: any) => {
          if (res.errorcode === 0 && res.data) {
            const extension = $file.getExtensions(res.data.title);
            if (res.data.fileContentType === 'image') {
              images.value.push(res.data);
              Object.assign(chatForm.value.attachments, { images: images.value });
            } else if (res.data.fileContentType === 'file') {
              files.value.push(res.data);
              Object.assign(chatForm.value.attachments, { files: files.value });
            } else if (res.data.fileContentType === 'video') {
              videos.value.push(res.data);
              Object.assign(chatForm.value.attachments, { videos: videos.value });
            }
          } else {
            Notify({
              type: 'danger',
              message: `文件上传失败，错误代码${res.code}，错误信息：${res.msg}`,
            });
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `文件上传失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 文件超出大小，给予提示
     */
    function onOversize(file: any) {
      Toast('文件大小不能超过 10MB');
    }

    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件之前，判断类型
     */
    function beforeUploadFiles(files: any) {
      console.log('调用相机：', files)
      return true;
    }

    /**
     * @param {Object | Array} file 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件后的回调方法
     * 
     */
    function afterRead(file: any) {
      fileList.value = file;
      if (file.length > 0) {
        file.forEach((el: any) => {
          fileUploadAttachment(el.file);
          console.log('多个上传：', el.file)
        });
      } else {
        fileUploadAttachment(file.file);
        console.log('单个上传：', file.file)
      }
    }
    /** -------------------------- 获取任务动态的数据和业务逻辑 end -------------------------------------- */

    /** --------------------------------------------- watch 监听 start------------------------------------------------------ */

    watch(chatForm.value, (newValue, oldValue) => {
      const submitButton: any = document.getElementsByClassName('submit-button')[0]; // 发送按钮
      if (
        newValue.attachments.images.length > 0 ||
        newValue.attachments.files.length > 0
      ) {
        isShowContentToBeSent.value = true;
      } else if (
        newValue.attachments.images.length === 0 &&
        newValue.attachments.files.length === 0
      ) {
        isShowContentToBeSent.value = false;
      }

      // if (
      //   newValue.attachments.images.length > 0 ||
      //   newValue.attachments.files.length > 0 ||
      //   newValue.location.address !== ''
      // ) {
      //   isShowContentToBeSent.value = true;
      // } else if (
      //   newValue.attachments.images.length === 0 &&
      //   newValue.attachments.files.length === 0 &&
      //   newValue.location.address === ''
      // ) {
      //   isShowContentToBeSent.value = false;
      // }

      // 获取文件ID，拼接成数组，发送接口使用
      attachmentIds.value = Array.from([]);
      newValue.attachments.images.forEach((el: any) => {
        attachmentIds.value.push(el.id);
      });
      newValue.attachments.files.forEach((el: any) => {
        attachmentIds.value.push(el.id);
      });

      if (
        attachmentIds.value.length === 0 &&
        newValue.location.address === '' &&
        newValue.text === ''
      ) {
        // 没有内容的情况下，发送按钮虚化，让用户觉得按钮是不可点的
        submitButton.style.cssText = 'opacity:0.5';
      } else {
        // 有内容的情况下，发送按钮才亮起，让用户觉得按钮是可点的
        submitButton.style.cssText = 'opacity:1';
      }
    });
    watch(isShowPopupButton, (newValue, oldValue) => {
      // 因为获取到容器的高度会延迟，所以添加计时器异步处理
      setTimeout(() => {
        getFooterHeight();
      }, 10);
    });
    watch(isShowContentToBeSent, (newValue, oldValue) => {
      // 因为获取到容器的高度会延迟，所以添加计时器异步处理
      setTimeout(() => {
        getFooterHeight();
      }, 10);
    });
    /** ---------------------------------------- watch 监听 end--------------------------------------------------------- */

    function deleteFile(filePath: string, fileId: string | number) {
      const requestData = {
        method: 'post',
        service: 'file',
        url: `/appAttachment/delFile?path=${filePath}&id=${fileId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      ($http as any)(requestData)
        .then((res: any) => {
          if (res.errorcode === 0) {
          } else {
            Notify({
              type: 'danger',
              message: `删除文件失败，错误代码${res.code}，错误信息：${res.msg}`,
            });
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `删除文件失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @param {Object} file 文件数据
     * @description 删除文件
     */
    function handleDeleteFile(file: any) {
      deleteFile(file.path + file.filename, file.id); // 删除文件
      if (chatForm.value.attachments.files.length > 0 && file) {
        const _index = chatForm.value.attachments.files.findIndex((el: any) => el.id === file.id);
        if (_index > -1) {
          chatForm.value.attachments.files.splice(_index, 1);
          files.value.splice(_index, 1);
        }
      }
    }

    /**
     * @param {Object} file 文件数据
     * @description 删除图片
     */
    function handleDeleteImage(image: any) {
      deleteFile(image.path + image.filename, image.id); // 删除文件
      if (chatForm.value.attachments.images.length > 0 && image) {
        const _index = chatForm.value.attachments.images.findIndex((el: any) => el.id === image.id);
        if (_index > -1) {
          chatForm.value.attachments.images.splice(_index, 1);
          images.value.splice(_index, 1);
        }
      }
    }

    /**
     * @param {Object} location 定位信息
     * @description 删除定位
     */
    function handleDeleteLocation(location: any) {
      chatForm.value.location.address = '';
      chatForm.value.location.latitude = '';
      chatForm.value.location.longitude = '';
    }

    /**
     * @description 获取定位
     */
    function getLocation() {
      console.log('是否能使用原生定位：', navigator.geolocation)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position: any) => {
            console.log('1-原生-获取定位', position)
            let getLongitude = position.coords.longitude;
            let getLatitude = position.coords.latitude;
            let address = ref('');
            ($location as any)
              .geocoder_Gd({ longitude: getLongitude, latitude: getLatitude })
              .then((res: any) => {
                console.log('2-原生-获取定位', res)
                address.value = res.regeocode.formatted_address;
                const location = {
                  address: address.value,
                  latitude: getLatitude,
                  longitude: getLongitude,
                };
                Object.assign(chatForm.value, {
                  location: location,
                });
              });
          },
          err => {
            var errorType = ['无定位权限，获取不到位置信息', '获取不到位置信息', '获取位置信息超时'];
            Toast(errorType[err.code - 1]);
          },
        );
      } else {
        Toast('对不起，您的设备不支持定位！');
      }
    }

    /**
     * @description 显示已读未读列表
     */
    function handleClickRead(id: string | number) {
      emit('clickRead', id)
    }
    /** -------------------------------- 生命周期 start ------------------------------- */

    /** 生命周期 —— 挂载 */
    onMounted(() => {
      getTaskDistributionResult(false);
      getFooterHeight(); // 获取底部的高度
      scrollToBottom(); // 将浏览器滚动条设置到最底部
      window.addEventListener('resize', () => {
        setTimeout(() => {
          getFooterHeight();
        }, 100);
      });
      // 原生定位：
      // getLocation(); // 获取当前定位
      // 高德获取定位：
      GDLocation().then((res: any) => {
        console.log('高德定位结果', res)
        if (res) {
          // Notify({
          //   type: 'success',
          //   message: '获取定位成功',
          // });
          Object.assign(chatForm.value, {
            location: res,
          });
          console.log(chatForm)
        }
      })
      setDataReaded(); // 将动态设为已读
    });
    // websoket
    const uns: any = $ws.subscribe(
      `/topic/eventTask/dynamic`,
      (msg: any) => {
        console.log(msg)
        websocketCallback(msg);
      },
    );
    // 平台id
    const platformId = localStorage.getItem('platformId');
    const uns2: any = $ws.subscribe(
      `/platform/${platformId}/message`,
      (msg: any) => {
        getMsgCallback(msg);
      },
    );
    /**
     * @description websocket消息回调
     */
    function getMsgCallback(msg: any) {
      console.log(msg)
      const {msgType, content} = msg
      console.log(content)
      // 60007 任务动态设为已读
      if (msgType === 60007) {
        // contactorType 1是系统用户，0是通讯录用户
        content.forEach((el: any) => {
          console.log(el)
          console.log(el.taskId, taskId)
          if (el.taskId == taskId && el.contactorType === 0) {
            const index: number = chatList.value.findIndex((item: any) => item.id === el.resultId);
            // 修改未读数
            if (index > -1) {
              chatList.value[index].chatContentInformation.unreadNum = el.unreadNum || 0;
            }
          }
        });
      }
    }
    onBeforeUnmount(() => {
      uns();
      uns2();
      setDataReaded(); // 将动态设为已读
    });
    /** -------------------------------- 生命周期 end ------------------------------- */

    return {
      isShowPopupButton,
      isVoice,
      showPopup,
      switchVoiceOrText,
      chatForm,
      isShowContentToBeSent,
      handleShowContentToBeSent,
      getTaskDistributionResult,
      chatList,
      beforeUploadFiles,
      fileList,
      afterRead,
      fileUploadAttachment,
      handleDeleteFile,
      handleDeleteImage,
      handleDeleteLocation,
      getLocation,
      reportDistributionResult,
      acceptFileType,
      getFooterHeight,
      deleteFile,
      handleInputFocus,
      handleClickChatContent,
      onRefresh,
      isLoading,
      initTaskDynamicData,
      onOversize,
      maxFileSize,
      inputDisabled,
      handleInputClick,
      handleClickRead,
      uns2
    };
  },
});
</script>
<style lang="scss">
@import './assets/css/index';
</style>
