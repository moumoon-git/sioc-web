// 确认弹窗
<template>
  <teleport to="body">
    <div v-if="visible">
      <div class="visualization-message-box">
        <!-- 标题 -->
        <header>
          {{ title }}
        </header>
        <main>
          <div>
            <!-- 图标 -->
            <i
              :class="[
                'visualization-message-box__icon',
                `visualization-message-box__icon--${type}`,
              ]"
            />
            <!-- 提示内容 -->
            <div class="visualization-message-box__content">
              <h3
                :class="[
                  'visualization-message-box__content__message',
                  `visualization-message-box__content__message--${type}`
                ]"
              >
                {{ message }}
              </h3>
              <p class="visualization-message-box__content__tips">
                {{ tips }}
              </p>
            </div>
          </div>
          <!-- 备注栏 -->
          <div
            v-if="showRemark"
            class="visualization-message-box__remark"
          >
            <h4>备注：</h4>
            <textarea
              v-model="remarkValue"
              :placeholder="remarkPlaceholder"
            />
          </div>
        </main>
        <!-- 下方按钮 -->
        <footer v-if="type !== 'success'">
          <Button
            type="ghost"
            @click="handleCancel"
          >
            取消
          </Button>
          <Button
            :type="type === 'delete' ? 'danger' : 'primary'"
            style="margin-left: 10px;"
            @click="handleConfirm"
          >
            确认
          </Button>
        </footer>
        <footer
          v-else
          style="text-align: center;"
        >
          <Button
            type="primary"
            @click="handleConfirm"
          >
            确定（{{ countDown }}s）
          </Button>
        </footer>
      </div>
      <div
        class="visualization-message-box__modal"
        @click="handleCancel"
      />
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../Button/Button.vue';
import useMB from './scripts/useMessageBox';

export default defineComponent({
  name: 'ConfirmDialog',
  components: {
    // 按钮
    Button,
  },
  emits: [
    'cancel',
    'confirm',
  ],
  setup() {
    return useMB();
  },
});
</script>

<style lang="scss">
.visualization-message-box {
  display: flex;
  flex-direction: column;
  background: rgba(20, 29, 31, .94);
  position: fixed;
  top: 50vh;
  left: 50vw;
  z-index: 10003;
  transform: translate(-50%, -50%);
  border: 1px solid #00C1DE;
  & > header {
    color: #FFF;
    font-size: 18px;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
  & > main {
    color: #FFF;
    flex: 1;
    min-width: 400px;
    max-width: 550px;
    & > div:first-child {
      display: flex;
      padding: 10px 50px;
      justify-content: center;
      align-items: center;
    }
  }
  & > footer {
    text-align: right;
    padding: 9px 18px 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
  // 遮罩
  &__modal {
    background: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10002;
  }
  &__icon {
    display: block;
    width: 80px;
    height: 80px;
    background: no-repeat center/100% 100% transparent;
    flex-shrink: 0;
    &--prompt {
      background-image: url(./assets/info.svg);
    }
    &--delete {
      background-image: url(./assets/alert.svg);
    }
    &--success {
      background-image: url(./assets/success.svg);
    }
  }
  // 内容
  &__content {
    margin-left: 10px;
    &__message {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      padding: 0;
      &--prompt {
        color: #00C1DE;
      }
      &--delete {
        color: #F66E6E;
      }
    }
    &__tips {
      margin: 0;
      padding: 0;
      max-height: 100px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        background: transparent;
      }
    }
  }
  // 备注
  &__remark {
    margin: 0 20px 10px;
    & > h4 {
      color: #A6ADB4;
      margin: 0 0 10px 0;
    }
    & > textarea {
      border: 1px solid #A6ADB4;
      resize: none;
      width: 100%;
      box-sizing: border-box;
      background: transparent;
      color: #FFF;
      outline: none;
      padding: 10px;
      height: 150px;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  }
}
</style>
