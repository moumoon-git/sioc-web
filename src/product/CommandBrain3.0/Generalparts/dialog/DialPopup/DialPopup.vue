<template>
  <teleport to="body">
    <div
      v-if="showPopup"
      ref="dialog"
      :class="$style.popup"
    >
      <header
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
      >
        <span>拨号盘</span>
        <button @click.stop="showPopup = false;" />
      </header>
      <main>
        <input v-model="phoneNumber">
        <div :class="$style.numbers">
          <button
            v-for="index in 12"
            :key="index"
            @click="handleDialClick(index)"
          />
        </div>
        <div :class="$style.footer">
          <button
            v-show="showContact"
            @click="handleClickContact"
          />
          <button
            :class="{[$style.phone]: isPhone}"
            @click="handleSubmit"
          />
          <button @click="handleDelete" />
        </div>
      </main>
    </div>
  </teleport>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  getCurrentInstance,
} from 'vue';

export default defineComponent({
  name: 'DialPopup',
  setup() {
    const instance = getCurrentInstance()?.appContext.config.globalProperties;
    const showPopup = ref(false);
    const showContact = ref(false);
    const isPhone = ref(false);
    let $resolve: any;
    let $reject: any;
    instance!.$dial = (options?: {
      showContact?: boolean,
      isPhone?: boolean,
    }) => {
      if (!showPopup.value) {
        showPopup.value = true;
        showContact.value = !!options?.showContact;
        isPhone.value = !!options?.isPhone;
        return new Promise((resolve, reject) => {
          $resolve = resolve;
          $reject = reject;
        });
      }
      return Promise.reject();
    };
    const phoneNumber = ref('');
    watch(showPopup, (val) => {
      if (!val) {
        phoneNumber.value = '';
        $resolve = null;
        $reject();
        $reject = null;
      }
    });
    function handleDialClick(index: number) {
      switch (index) {
        case 10: {
          phoneNumber.value += '*';
          break;
        }
        case 11: {
          phoneNumber.value += 0;
          break;
        }
        case 12: {
          phoneNumber.value += '#';
          break;
        }
        default: {
          phoneNumber.value += index;
        }
      }
    }
    function handleSubmit() {
      if (phoneNumber.value) {
        $resolve(phoneNumber.value);
        showPopup.value = false;
      }
    }
    function handleDelete() {
      phoneNumber.value = phoneNumber.value.slice(0, phoneNumber.value.length - 1);
    }
    function handleClickContact() {
      $resolve(false);
      showPopup.value = false;
    }
    return {
      showPopup,
      phoneNumber,
      handleDialClick,
      handleSubmit,
      handleDelete,
      handleClickContact,
      showContact,
      isPhone,
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
      const dialog = this.$refs.dialog as HTMLElement;
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
      const dialog = this.$refs.dialog as HTMLElement;
      dialog.style.cursor = 'default';
      document.removeEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标移动，修改弹窗定位
     */
    handleMouseMove(event: MouseEvent) {
      const dialog = this.$refs.dialog as HTMLElement;
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

<style lang="scss" module src="./styles/DialPopup.scss" />
