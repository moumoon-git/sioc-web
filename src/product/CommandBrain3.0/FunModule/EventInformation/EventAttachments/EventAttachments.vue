<template>
  <div class="event-information-container">
    <main>
      <!-- 现场直播 -->
      <div
        v-loading="liveListLoading"
        class="information-item-container"
      >
        <div class="container-header">
          <div class="section-label">现场直播（在线{{ liveVideoList.length }}）</div>
          <div class="context-font section-right">
            <div @click="refreshLiveVideoList">
              <button
                class="refresh-live-list-btn"
                title="刷新列表"
              />
              刷新
            </div>
            <!-- 历史直播 -->
            <div @click="historyLive" >历史直播</div>
          </div>
        </div>

        <div class="container-body">
          <div class="video-list-wrap" ref="videoListWrap" v-if="liveVideoList.length">
            <div class="video-list" v-for="(itemArr, index) in liveVideoViewList" :key="index">
              <LiveVideo
                :components="itemArr"
                @handleSelectLiveVideo="handleSelectLiveVideo"
                @changeTask="changeTask"
                @relation="relation"
              />
            </div>
          </div>
          <EmptyHint v-else />
          <!-- 用来滚动的小点点的容器 -->
          <div class="video-list-spot" v-if="liveVideoList.length" >
            <!-- active -->
            <div :class="{'video-list-spot-active':index === spotActiveInd}" v-for="(itemArr, index) in liveVideoViewList" :key="index" @click="setSpotActiveInd(index)" />
          </div>
        </div>
      </div>
      <!-- 历史直播
      <div class="information-item-container">
        <div class="container-header">
          <div class="section-label">历史直播</div>
        </div>
        <div class="container-body">
          <div class="noData">暂无历史直播记录</div>
        </div>
      </div> -->
      <!-- 情报文件 -->
      <div class="information-item-container information-item-edgeFile">
        <div class="container-header">
          <div class="section-label">情报文件</div>
          <!-- 复选框 -->
          <div class="select-container">
            <div
              v-for="(item, index) in checkboxList"
              :key="item.id"
              class="select-item"
              @click="selectCheckbox(item, index)"
            >
              <div :class="'radio ' + (item.value ? 'radio--active' : '')"></div>
              <div class="label">{{ item.name }}</div>
            </div>
          </div>
        </div>

        <div class="container-body">
          <!-- 时间线倒叙排列 -->
          <div class="event-files">
            <template v-if="attachments.length > 0">
              <div
                v-for="(item, index) in attachments"
                class="event-file-item"
                :style="{
                  paddingTop: index === 0 ? '0' : '10px',
                  borderBottom: index === attachments.length - 1 ? 'none' : '',
                }"
              >
                <div class="time">{{ item.timeLine }}</div>
                <!-- 文件 -->
                <div class="file-list">
                  <!-- 视频、图片 -->
                  <div class="file-image-list">
                    <template v-if="item.images.length > 0">
                      <div
                        v-for="image in item.images"
                        :key="image.id"
                        class="image"
                        @click="handleImageViewer(image)"
                      >
                        <img :src="image.url" alt="" class="img-picture" />
                        <img src="./assets/svg/picture.svg" alt="" class="icon-picture" />
                      </div>
                    </template>
                    <template v-if="item.videos.length > 0">
                      <div
                        v-for="video in item.videos"
                        :key="video.id"
                        class="image"
                        @click="handleVideoViewer(video)"
                      >
                        <video :src="video.url" alt="" class="img-picture" />
                        <img src="./assets/svg/video.svg" alt="" class="icon-picture" />
                      </div>
                    </template>
                  </div>

                  <!-- 文档 -->
                  <div class="file-document-list">
                    <template v-if="item.files.length > 0">
                      <Document
                        v-for="(file, index) in item.files"
                        :key="file.id"
                        :file="file"
                        class="document"
                        @click="handleFileViewer(file)"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="noData">暂无数据</div>
            </template>
          </div>
        </div>
      </div>
    </main>
    <!-- <footer>
      <button class="footer-button" @click="handlePassback">邀请回传</button>
    </footer> -->

    <ImageViewer v-if="showImageViewer" />
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref, inject, nextTick, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
// 直播弹窗
import LiveStream from '@/product/CommandBrain3.0/Generalparts/dialog/LiveStream/LiveStream.vue';
import { getDetailedLiveRoom, createMiniPlayer, getLiveRoom } from '@/product/CommandBrain3.0/Generalparts/dialog/LiveStream/scripts/useLiveStream';
// 暂无数据提示
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
import LiveVideo from '@/product/CommandBrain3.0/FunModule/EventInformation/components/LiveVideo/LiveVideo.vue';

const $time: any = require('@/product/CommandBrain3.0/FunModule/EventInformation/assets/js/time/time.js')
  .default;
const json: any = require('./1.json');
// 逻辑——文件相关业务
import $file from '@/product/CommandBrain3.0/FunModule/EventInformation/assets/js/file/file';
import Document from '@/product/CommandBrain3.0/FunModule/EventInformation/components/FileExtensionImage/Document.vue';
import ImageViewer from '@/product/CommandBrain3.0/Generalparts/dialog/ImageViewer/ImageViewer.vue';
import { videoItme } from '@/product/CommandBrain3.0/FunModule/EventInformation/statement/statement';
import content from '*.svg';

export default defineComponent({
  components: {
    Document,
    ImageViewer,
    EmptyHint,
    LiveVideo,
  },
  setup(props,context) {
    const baseURL: string = (window as any).config.baseURL;
    const instance: any = getCurrentInstance();
    const addDialog = inject<any>('$addDialog');
    const {
      $http,
      $message,
      $imageViewer,
      $videoViewer,
      $fileViewer,
    } = instance?.appContext.config.globalProperties;
    const store = useStore();
    const showImageViewer = ref(true);
    const activeLiveVideoIndex: any = ref();
    // 现场直播视频
    const liveVideoList: any = ref([]);
    // 渲染的数据
    const liveVideoViewList: any = ref([]);
    // 情报文件
    const attachments: any = ref([]);
    // 小圆点激活
    const spotActiveInd = ref<number>(0);
    const videoListWrap = ref<HTMLElement|null>(null);
    // fomatterData(json.data);
    // 复选框
    const checkboxList = ref([
      {
        id: 2, // Id为传给后端的type
        value: true,
        name: '文件',
      },
      {
        id: 1, // Id为传给后端的type
        value: true,
        name: '图片',
      },
      {
        id: 3, // Id为传给后端的type
        value: true,
        name: '视频',
      },
    ]);
    /**
     * @description 勾选
     */
    function selectCheckbox(item: any, index: number) {
      checkboxList.value[index].value = !item.value;
      getEventAttachments();
    }

    function changeTask(param:videoItme) {
      console.log('更多', param);
    }

    let curStreamDialog: any;
    /**
     * @description 现场直播
     */
    function handleSelectLiveVideo(item: any, index: number) {
      activeLiveVideoIndex.value = index;
      if (item.origin === 'LIVE') {
        // 直播
        if (addDialog) {
          // 关闭上一次弹窗
          if (curStreamDialog) {
            curStreamDialog.close();
          }
          // 打开新的弹窗
          nextTick(() => {
            curStreamDialog = addDialog(item.title || '直播', LiveStream, {
              roomID: item.id,
              streamer: item.uploadContactor,
            });
          });
        }
      } else {
        $message.info('功能开发中，敬请期待');
      }
    }

    /**
     * @description 封装数据格式
     */
    function fomatterData(data: any) {
      data.forEach((item: any, index: number) => {
        if (item.array.length > 0) {
          // 总附件
          const attachmentObj: any = ref({});
          // 文档
          const files: any = ref([]);
          // 图片
          const images: any = ref([]);
          // 视频
          const videos: any = ref([]);
          // 归置文档，视频，图片
          item.array.forEach((el: any) => {
            const attachment = el.attachment;
            const file: any = ref({
              id: attachment.id || parseInt(String(Math.random() * 1000)), // 文件ID
              fileName: attachment.filename, // 文件名字
              name: attachment.title, // 文件名字
              title: attachment.title, // 文件名字
              url:
                attachment.url.indexOf('/fileupload') > -1 ?
                (window as any).config.baseURL +
                attachment.url
                : (window as any).config.baseURL +
                (window as any).config.service.file +
                attachment.url, // 文件路径
              size: attachment.size, // 文件大小
              extension: $file.getExtensions(attachment.filename), // 文件后缀
              origin: el.type, // 文件来源： 任务/事件
              contactorName: el.name || el.username, // 发送文件的用户name:用户昵称；username：用户登录名
              roleName: el.roleName, // 角色名称
              address: el.address, // 地址
              department: el.department, // 部门
            });
            // 文档类型:
            if ($file.judgeFileExtension(attachment.filename) === 'file') {
              files.value.push(file.value);
            }
            // 图片类型:
            if ($file.judgeFileExtension(attachment.filename) === 'image') {
              images.value.push(file.value);
            }
            // 视频类型:
            if ($file.judgeFileExtension(attachment.filename) === 'video') {
              videos.value.push(file.value);
            }
          });
          Object.assign(attachmentObj.value, { files: files.value });
          Object.assign(attachmentObj.value, { images: images.value });
          Object.assign(attachmentObj.value, { videos: videos.value });
          Object.assign(attachmentObj.value, { timeLine: $time.formatterDate(item.date) });
          attachments.value.push(attachmentObj.value);
        }
      });
    }

    /**
     * @description 获取事件附件
     */
    function getEventAttachments() {
      const arr = checkboxList.value.filter(el => {
        if (el.value) {
          return el.id;
        }
      });
      const type = arr.map(el => el.id).join(',');
      let requestData: any = ref({
        method: 'get',
        service: 'eoc',
        url: `/attach/${store.state.event?.id}?attachTypes=${type}`,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      });
      ($http as any)(requestData.value).then((res: any) => {
        if (res.errorcode === 0) {
          attachments.value = [];
          if (res.data && res.data.length > 0) {
            fomatterData(res.data);
          }
        }
      });
    }

    /**
     * @description 邀请回传
     */
    function handlePassback() {
      $message.info('功能开发中，敬请期待');
    }

    /**
     * @description 图片查看器
     */
    function handleImageViewer(item: any) {
      $imageViewer({
        title: '文件详情',
        path: item.url,
        contactor: {
          name: item.contactorName,
          roleName: item.roleName,
          department: item.department,
        },
        address: item.address,
      });
    }
    /**
     * @description 视频查看器
     */
    function handleVideoViewer(item: any) {
      $videoViewer({
        title: '文件详情',
        path: item.url,
        contactor: {
          name: item.contactorName,
          roleName: item.roleName,
          department: item.department,
        },
        address: item.address,
      });
    }

    /**
     * @description 文件查看器
     */
    function handleFileViewer(item: any) {
      // if ($file.getExtensions(item.fileName) !== 'pdf') {
      //   $message.info('该类型文件暂不支持预览');
      // }
      $fileViewer({
        title: item.fileName,
        path: item.url,
        contactor: {
          name: item.contactorName,
          roleName: item.roleName,
          department: item.department,
        },
        address: item.address,
      });
    }
    /**
     * 删除 mini 播放器
     */
    function destroyLivePlayers() {
      liveVideoList.value.forEach((room: any) => {
        if (room.stopStream) {
          room.stopStream();
        }
      });
    }
    // 载入中
    const liveListLoading = ref(0);
    /**
     * 刷新直播列表
     */
    function refreshLiveVideoList() {
      liveListLoading.value += 1;
      getDetailedLiveRoom()
        .then((response) => {
          console.log('获取房间列表', response);
          if (response.errorcode === 0) {
            destroyLivePlayers();
            // 筛选出直播状态的房间
            const list = (response?.data || []).filter((i: any) => i.liveStatus === '1');
            liveVideoList.value = [...list.map((i: videoItme) => ({
              origin: 'LIVE',
              id: i.roomId,
              title: i.liveRoomTitle,
              type: i.liveType === 0 ? '现场' : '任务',
              eventLinked: i.eventLinked,
              relationId: i.id,
              uploadContactor: {
                name: i.userVo?.name || '未知用户',
                position: i.userVo?.roleName || '暂无',
                groupName: i.userVo?.department || '暂无',
                address: i.liveAddress || '暂无地址',
              },
              number: '',
              image: '',
            }))];
            liveVideoViewList.value = [];
            // 次数
            const frequency: number = Math.ceil(liveVideoList.value.length / 4);
            let num: number = 0;
            for (let i = 0; i < frequency; i++) {
              let arr = [];
              if (frequency - 1 > i) {
                arr = liveVideoList.value.slice(num, num + 4);
                num += 4;
              } else {
                arr = liveVideoList.value.slice(num);
              }
              liveVideoViewList.value.push(arr);
            }
            console.log(liveVideoViewList.value);
            nextTick(() => {
              list.forEach((room: any) => {
                room.stopStream = createMiniPlayer(`mini-stream-${room.roomId}`, room.roomId);
              });
            });
          } else {
            $message.error(`获取房间列表失败，错误信息：${response.data.errorMessage}`);
          }
        })
        .catch((error: Error) => {
          $message.error(`获取房间列表失败，错误信息：${error}`);
        })
        .finally(() => {
          liveListLoading.value -= 1;
        });
    }
    // 设置查看的块
    function setSpotActiveInd(ind:number) {
      spotActiveInd.value = ind;
      const handleEl: any = videoListWrap.value;
      const parentEl = handleEl.parentElement;
      const wd = parentEl.offsetWidth;
      handleEl.style.marginLeft = `${(wd * ind) * -1}px`;
    }
    // 关联事件
    function relation(param:videoItme) {
        const request = {
          method: 'post',
          service: 'eoc',
          url: '/im/appImLive/linkEvent',
          data: {
            id: param.relationId,
            eventId: String(store.state.event.id),
            eventLinked: (param.eventLinked === 0 ? 1 : 0), // 关联事件，1：关联，0：取消
          },
        } as const;
        $http(request).then(() => {
          refreshLiveVideoList();
          getEventAttachments();
        });
    }
    // 历史直播
    function historyLive() {
      context.emit('historyLive', '');
    }
    onMounted(async () => {
      getEventAttachments();
      // 获取房间列表
      refreshLiveVideoList();
    });
    onBeforeUnmount(() => {
      destroyLivePlayers();
    });
    return {
      getEventAttachments,
      attachments,
      baseURL,
      checkboxList,
      spotActiveInd,
      selectCheckbox,
      liveVideoList,
      liveVideoViewList,
      changeTask,
      activeLiveVideoIndex,
      handleSelectLiveVideo,
      handlePassback,
      handleImageViewer,
      showImageViewer,
      handleVideoViewer,
      handleFileViewer,
      liveListLoading,
      refreshLiveVideoList,
      setSpotActiveInd,
      videoListWrap,
      relation,
      historyLive,
    };
  },
  computed: {
    eventId() {
      return (this as any).$store.state.event?.id;
    },
  },
  watch: {
    eventId: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getEventAttachments();
        }
      },
    },
  },
});
</script>

<style lang="scss">
@use './assets/css/eventAttachments.scss';

.event-information-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  main {
    flex: 1;
    overflow: scroll;
    padding: 10px 20px;
    // 滚动条样式
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

  // 信息详情
  .information-item-container {
    background: linear-gradient(90deg, rgba(0, 193, 222, 20%) 0%, rgba(24, 38, 50, 0) 100%);
    &:not(:first-child) {
      margin-top: 10px;
    }
    // 头部
    .container-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 36px;
      padding-right: 6px;

      .select-container {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .select-item {
          display: flex;
          justify-content: flex-start;
          margin-left: 22px;

          .radio {
            width: 16px;
            height: 16px;
            border-radius: 4px;
            border: 1px solid #a6adb4;
            cursor: pointer;

            &--active {
              background: url('./assets/svg/gou.svg');
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-size: 100% 100%;
              border: 1px solid #56e9ff;
            }
          }

          .label {
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            margin-left: 6px;

            &--active {
              color: #56e9ff;
            }
          }
        }
      }
    }

    .container-body {
      // 视频
      width: 355px;
      height: calc(328px - 36px);
      overflow: hidden;
      position: relative;
      .video-list-wrap{
        display: flex;
        position: absolute;
        transition: .3s;
        height: calc(100% - 28px);
      }
      .video-list {
        // overflow: hidden;
        padding-bottom: 5px;
        padding-left: 5px;
        // width: 100%;
        width: 355px;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        &>div{
          display: flex;
          flex-wrap: wrap;
        }
      }
      .video-list-spot{
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        &>div{
          width: 16px;
          height: 4px;
          background: #A6ADB4;
          border-radius: 2px;
          margin: 0 4px;
          cursor: pointer;
          transition: .3s;
        }
        &-active{
          width: 24px !important;
          background: #56E9FF !important;
        }
      }
      // 情报文件
      .event-files {
        .event-file-item {
          padding-top: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);

          // 时间
          .time {
            padding-left: 12px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
          }

          // 文件
          .file-list {
            padding: 7px 0 7px 7px;
            box-sizing: border-box;

            .file-image-list {
              overflow: hidden;

              .image {
                float: left;
                width: 77px;
                height: 77px;
                border: 1px solid #00c1de;
                margin: 5px;
                box-sizing: border-box;
                position: relative;
                cursor: pointer;

                .img-picture {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }

              .icon-picture {
                position: absolute;
                top: 23px;
                left: 23px;
                width: 30px;
                height: 30px;
                cursor: pointer;
              }
            }

            .file-document-list {
              margin-top: 5px;
              padding-left: 5px;
              box-sizing: border-box;

              .document {
                cursor: pointer;
              }

              .document-list-layout {
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
  // 情报文件
  .information-item-edgeFile{
    height: calc( 100% - 338px );
    overflow: hidden;
    .container-body{
      height: calc(100% - 36px);
    }
  }

  // 头部栏的右边部分
  .section-right{
    display: flex;
    height: 18px;
    & > div:last-child{
      margin-left: 10px;
      border-left: 1px solid #fff;
      padding-left: 30px;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        background:no-repeat center/100% 100% url('./assets/svg/history.svg');
        width: 14px;
        height: 14px;
        left: 10px;
        top: 3px;
      }
    }
  }


  .noData {
    @extend .context-font;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  footer {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    .footer-button {
      border: none;
      width: 152px;
      height: 42px;
      background: url('./assets/svg/button2.svg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      font-size: 14px;
      font-weight: 400;
      color: #00c1de;
      line-height: 42px;
      cursor: pointer;
    }
    .footer-button:hover {
      border: none;
      width: 152px;
      height: 42px;
      background: url('./assets/svg/button1.svg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      font-size: 14px;
      font-weight: 400;
      color: #00c1de;
      line-height: 42px;
      cursor: pointer;
    }
  }

  // 刷新直播列表按钮
  .refresh-live-list-btn {
    border: none;
    outline: none;
    width: 14px;
    height: 16px;
    background: no-repeat center/100% 100% url(./assets/svg/refresh.svg);
    cursor: pointer;
    transition: transform 0.3s;
    position: absolute;
    margin-top: 2px;
    margin-left: -20px;
    &:hover {
      transform: rotate(360deg);
    }
  }
}
</style>
