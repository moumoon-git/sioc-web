<template>
  <teleport to="body">
    <div v-if="showPopup" class="file-viewer-wrap">
      <!-- 最小化 -->
      <template v-if="hide">
        <div :class="$style.fileViewerMini" ref="fileViewerMini">
          <header
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            :class="$style.fileViewerHeaderMini"
          >
            <div :class="$style.fileViewerHeaderLeftMini">文件详情</div>
            <div :class="$style.fileViewerHeaderRight">
              <button
                v-if="fix"
                :class="$style.fixActive"
                :style="{ width: '13px', height: '12px' }"
                @click.stop="handleFix"
              />
              <button v-else :class="$style.fixMini" @click.stop="handleFix" />
              <button :class="$style.closeMini" @click.stop="handleClose" />
            </div>
          </header>

          <main :class="$style.fileViewerMainMin">
            <div :class="$style.fileViewerMainMinLeft">
              <Document
                v-for="file in files"
                :key="file.name"
                :file="file"
                :class="$style.document"
              />
            </div>
            <div :class="$style.fileViewerMainMinLRight">
              <button @click="handlePreview">预览</button>
              <button @click="handleDownload">下载</button>
            </div>
          </main>

          <footer v-if="contactor" :class="$style.fileViewerFooterMini">
            <div>
              <span :class="$style.name">{{
                (contactor.name ? contactor.name : '-') +
                  '（' +
                  (contactor.department ? contactor.department : '-') +
                  '/' +
                  (contactor.roleName ? contactor.roleName : '-') +
                  '）'
              }}</span>
              <ContactMoreButton />
            </div>
            <div :class="$style.locationContainer">
              <img src="./assets/svg/site.svg" alt="" :class="$style.site" />
              <span :class="$style.address">{{ address || '暂无定位' }}</span>
            </div>
          </footer>
        </div>
      </template>
      <!-- 正常大小 -->
      <template v-else>
        <div :class="$style.fileViewer" ref="fileViewer">
          <header
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            :class="$style.fileViewerHeader"
          >
            <div :class="$style.fileViewerHeaderLeft">{{ title }}</div>
            <div :class="$style.fileViewerHeaderRight">
              <button v-if="fix" :class="$style.fixActive" @click.stop="handleFix" />
              <button v-else :class="$style.fix" @click.stop="handleFix" />
              <div :class="$style.hideButton" @click.stop="handleHide">
                <button :class="$style.hide" />
              </div>
              <button :class="$style.close" @click.stop="handleClose" />
            </div>
          </header>

          <main :class="$style.fileViewerMain">
            <iframe
              :src="path"
              id="pdfIframe"
              width="100%"
              height="100%"
              frameborder="no"
              border="0"
              marginwidth="0"
              marginheight="0"
              scrolling="no"
              allowtransparency="yes"
            ></iframe>
          </main>
        </div>
      </template>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import $file from '@/product/CommandBrain3.0/FunModule/EventInformation/assets/js/file/file';
import Document from '@/product/CommandBrain3.0/FunModule/EventInformation/components/FileExtensionImage/Document.vue';
export default defineComponent({
  name: 'FileViewer',
  components: {
    Document,
  },
  setup() {
    const instance = getCurrentInstance()?.appContext.config.globalProperties;
    const showPopup = ref(false);
    const title: any = ref('文件详情');
    const path: any = ref('');
    const hide = ref(false);
    const fix = ref(false);
    const contactor: any = ref(null);
    const files: any = ref([]);
    instance!.$fileViewer = (options?: { path?: string; title?: string; contactor?: object }) => {
      console.log(options);
      title.value = options?.title;
      path.value = options?.path;
      contactor.value = options?.contactor;
      files.value = [
        {
          name: title.value, // 文件名字
          title: title.value, // 文件名字
          url: path.value,
          id: '0', // 文件ID
          extension: $file.getExtensions(title.value), // 文件后缀
        },
      ];
      console.log(files.value);
      hide.value = false;
      fix.value = false;
      showPopup.value = true;
    };

    /**
     * @description 最小化弹窗
     */
    function handleHide() {
      hide.value = true;
      fix.value = false;
    }

    /**
     * @description 固定弹窗
     */
    function handleFix() {
      fix.value = !fix.value;
    }

    /**
     * @description 关闭弹窗
     */
    function handleClose() {
      showPopup.value = false;
    }

    /**
     * @description 预览文件
     */
    function handlePreview() {
      hide.value = false;
    }

    /**
     * @description 下载文件
     */
    function handleDownload() {
      let url = `${path.value}`;
      let eleLink: any = document.createElement('a');
      eleLink.download = title.value; // 文件名
      eleLink.href = url;
      eleLink.click();
      eleLink.remove();
    }
    return {
      path,
      title,
      showPopup,
      handleHide,
      handleFix,
      hide,
      fix,
      handleClose,
      contactor,
      files,
      handlePreview,
      handleDownload,
    };
  },
  data() {
    return {
      divX: 0,
      divY: 0,
    };
  },
  methods: {
    /**
     * 鼠标左键按下，开始拖动
     */
    handleMouseDown(event: MouseEvent) {
      if (this.fix) {
        return;
      }
      const dialog = this.hide
        ? (this.$refs.fileViewerMini as HTMLElement)
        : (this.$refs.fileViewer as HTMLElement);
      dialog.style.left = `${dialog.offsetLeft}px`;
      dialog.style.top = `${dialog.offsetTop}px`;
      dialog.style.cursor = 'move';
      this.divX = dialog.offsetLeft - event.x;
      this.divY = dialog.offsetTop - event.y;
      document.addEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标左键松开，结束拖动
     */
    handleMouseUp() {
      if (this.fix) {
        return;
      }
      const dialog = this.hide
        ? (this.$refs.fileViewerMini as HTMLElement)
        : (this.$refs.fileViewer as HTMLElement);
      dialog.style.cursor = 'default';
      document.removeEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标移动，修改弹窗定位
     */
    handleMouseMove(event: MouseEvent) {
      if (this.fix) {
        return;
      }
      const dialog = this.hide
        ? (this.$refs.fileViewerMini as HTMLElement)
        : (this.$refs.fileViewer as HTMLElement);
      // 限制弹窗极限位置
      let newX = event.x + this.divX;
      if (newX < 0) {
        newX = 0;
      }
      if (newX > document.body.clientWidth - dialog.offsetWidth) {
        newX = document.body.clientWidth - dialog.offsetWidth;
      }
      let newY = event.y + this.divY;
      if (newY < 0) {
        newY = 0;
      }
      if (newY > document.body.clientHeight - dialog.offsetHeight) {
        newY = document.body.clientHeight - dialog.offsetHeight;
      }
      dialog.style.left = `${newX}px`;
      dialog.style.top = `${newY}px`;
    },
  },
});
</script>
<style lang="scss" module>
#pdfIframe {
  width: 631px;
  height: 748px;
  background: #ffffff;
}

.fileViewer {
  width: 700px;
  background: rgba(5, 5, 5, 0.9);
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(166, 173, 180, 0.3);
  user-select: none;
  color: #fff;
  position: fixed;
  left: calc(50vw - 350px);
  top: calc(50vh - 427px);
  z-index: 20001;
  box-sizing: border-box;
}

.fileViewerMini {
  width: 360px;
  background: rgba(0, 36, 60, 0.82);
  border: 1px solid #014b71;
  user-select: none;
  color: #fff;
  position: fixed;
  left: calc(50vw - 180px);
  top: calc(50vh - 155px);
  z-index: 20001;
  box-sizing: border-box;

  .locationContainer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 4px;
  }
}

.fileViewerHeader {
  width: 100%;
  height: 50px;
  line-height: 50px;
  line-height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0 10px;
  box-sizing: border-box;
}

.fileViewerHeaderMini {
  width: 358px;
  height: 42px;
  line-height: 42px;
  background: linear-gradient(90deg, #32b0ff 0%, rgba(24, 38, 50, 0) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 11px 0 10px;
  box-sizing: border-box;
}

.fileViewerHeaderLeft {
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
.fileViewerHeaderLeftMini {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
}
.fileViewerHeaderRight {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.hideButton {
  width: 23px;
  height: 23px;
  margin-left: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
// 小化
.hide {
  width: 23px;
  height: 2px;
  background: #838282;
  border: none;
  outline: none;
  border-radius: 10px;
  cursor: pointer;
}
.hideButton:hover .hide {
  width: 23px;
  height: 2px;
  background: #ffffff;
  border: none;
  outline: none;
  border-radius: 10px;
  cursor: pointer;
}
// 关闭
.close {
  background: no-repeat center/100% url('./assets/svg/close.svg');
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}
.close:hover {
  background: no-repeat center/100% url('./assets/svg/closeHover.svg');
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
}
.closeMini {
  background: no-repeat center/100% url('./assets/svg/closeMini.svg');
  width: 9px;
  height: 9px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}

.fileViewerFooterMini {
  width: 100%;
  height: 64px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 2px;
    border-radius: 100%;
    background: rgba(86, 233, 255, 0.3);
    box-shadow: 0px 0px 0px 0px rgb(86 233 255 / 30%), 0px 0px 50px 2px rgb(86 233 255 / 30%);
  }
}
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
}

.icon {
  width: 22px;
  height: 22px;
  object-fit: cover;
  position: absolute;
  top: 60px;
  right: 15px;
}

.fileViewerMain {
  height: 804px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 35px;
}

// main
.fileViewerMainMin {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fileViewerMainMinLeft {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  flex: 1;
}

.fileViewerMainMinLRight {
  width: 80px;
  & > button {
    font-size: 14px;
    font-weight: 400;
    color: #56e9ff;
    line-height: 20px;
    cursor: pointer;
    border: none;
    outline: none;
    vertical-align: middle;
    background: transparent;
  }
}
// 固定按钮
.fix {
  background: no-repeat center/100% url('./assets/svg/fix.svg');
  width: 17px;
  height: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}

.fix:hover {
  background: no-repeat center/100% url('./assets/svg/fixHover.svg');
  width: 17px;
  height: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}

.fixActive {
  background: no-repeat center/100% url('./assets/svg/fixActive.svg');
  width: 17px;
  height: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}

.fixMini {
  background: no-repeat center/100% url('./assets/svg/fix.svg');
  width: 13px;
  height: 12px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}
.fixMini:hover {
  background: no-repeat center/100% url('./assets/svg/fixHover.svg');
  width: 13px;
  height: 12px;
  cursor: pointer;
  border: none;
  outline: none;
  vertical-align: middle;
  margin-left: 12px;
}

.name {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
}

.locationContainer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 12px;
}
.site {
  width: 13px;
  height: 16px;
}
.address {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  margin-left: 2px;
}
.document {
  margin: 0 !important;
}
</style>
