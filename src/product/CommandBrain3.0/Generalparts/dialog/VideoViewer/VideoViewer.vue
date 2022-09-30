<template>
  <teleport to="body">
    <div v-if="showPopup">
      <!-- 最小化 -->
      <template v-if="hide">
        <div :class="$style.videoViewerMini" ref="videoViewerMini">
          <header
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            :class="$style.videoViewerHeaderMini"
          >
            <div :class="$style.videoViewerHeaderLeftMini">{{ title }}</div>
            <div :class="$style.videoViewerHeaderRight">
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

          <main :class="$style.videoViewerMainMin">
            <video width="340" height="192" controls>
              <!-- <source src="./lbxx.mp4" type="video/mp4"> -->
              <source :src="path" type="video/mp4" />
              <source :src="path" type="video/ogg" />
              您的浏览器不支持Video标签。
            </video>
            <img src="./assets/svg/video.svg" alt="" :class="$style.icon" />
          </main>

          <footer v-if="contactor" :class="$style.videoViewerFooterMini">
            <div>
              <span :class="$style.name"
                ><span :class="$style.name">{{
                  (contactor.name ? contactor.name : '-') +
                    '（' +
                    (contactor.department ? contactor.department : '-') +
                    '/' +
                    (contactor.roleName ? contactor.roleName : '-') +
                    '）'
                }}</span></span
              >
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
        <div :class="$style.videoViewer" ref="videoViewer">
          <header
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            :class="$style.videoViewerHeader"
          >
            <div :class="$style.videoViewerHeaderLeft">{{ title }}</div>
            <div :class="$style.videoViewerHeaderRight">
              <button v-if="fix" :class="$style.fixActive" @click.stop="handleFix" />
              <button v-else :class="$style.fix" @click.stop="handleFix" />
              <div :class="$style.hideButton" @click.stop="handleHide">
                <button :class="$style.hide" />
              </div>
              <button :class="$style.close" @click.stop="handleClose" />
            </div>
          </header>

          <main :class="$style.videoViewerMain">
            <video width="640" height="360" controls>
              <source :src="path" type="video/mp4" />
              <source :src="path" type="video/ogg" />
              您的浏览器不支持Video标签。
            </video>
          </main>

          <footer v-if="contactor" :class="$style.videoViewerFooter">
            <div>
              <span :class="$style.name"
                ><span :class="$style.name">{{
                  (contactor.name ? contactor.name : '-') +
                    '（' +
                    (contactor.department ? contactor.department : '-') +
                    '/' +
                    (contactor.roleName ? contactor.roleName : '-') +
                    '）'
                }}</span></span
              >
              <ContactMoreButton />
            </div>
            <div :class="$style.locationContainer">
              <img src="./assets/svg/site.svg" alt="" :class="$style.site" />
              <span :class="$style.address">{{ address || '暂无定位' }}</span>
            </div>
          </footer>
        </div>
      </template>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
export default defineComponent({
  name: 'VideoViewer',
  components: {
    ContactMoreButton,
  },
  setup() {
    const instance = getCurrentInstance()?.appContext.config.globalProperties;
    const showPopup = ref(false);
    const title: any = ref('文件详情');
    const path: any = ref('');
    const hide = ref(false);
    const fix = ref(false);
    const contactor: any = ref(null);
    const address: any = ref(''); // 地址

    instance!.$videoViewer = (options?: {
      path?: string;
      title?: string;
      contactor?: object;
      address?: string;
    }) => {
      console.log(options);
      title.value = options?.title;
      path.value = options?.path;
      contactor.value = options?.contactor;
      address.value = options?.address;
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
        ? (this.$refs.videoViewerMini as HTMLElement)
        : (this.$refs.videoViewer as HTMLElement);
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
        ? (this.$refs.videoViewerMini as HTMLElement)
        : (this.$refs.videoViewer as HTMLElement);
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
        ? (this.$refs.videoViewerMini as HTMLElement)
        : (this.$refs.videoViewer as HTMLElement);
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
.videoViewer {
  width: 660px;
  // height: 486px;
  background: rgba(5, 5, 5, 0.9);
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(166, 173, 180, 0.3);
  user-select: none;
  color: #fff;
  position: fixed;
  left: calc(50vw - 330px);
  top: calc(50vh - 243px);
  z-index: 20001;
  padding: 0 10px;
  box-sizing: border-box;
}

.videoViewerMini {
  width: 360px;
  // height: 311px;
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

.videoViewerHeader {
  width: 100%;
  height: 48px;
  line-height: 48px;
  line-height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.videoViewerHeaderMini {
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

.videoViewerHeaderLeft {
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
.videoViewerHeaderLeftMini {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
}
.videoViewerHeaderRight {
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

.videoViewerFooter {
  width: 100%;
  height: 78px;
  padding: 13px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.videoViewerFooterMini {
  width: 100%;
  height: 68px;
  padding: 13px 10px 10px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  opacity: 0.5;
}

.videoViewerMain {
  width: 100%;
  height: 360px;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.videoViewerMainMin {
  width: 100%;
  height: 201px;
  box-sizing: border-box;
  padding: 10px;
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
</style>
