<template>
  <div
    ref="container"
    :class="[$style.container, { [$style.active]: active }]"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
  >
    <div :class="$style.header">
      <span
        v-if="state.isOnline.value"
        style="color: #56e9ff"
      >在线</span>
      <span
        v-else
        style="color: #a6adb4"
      >离线</span>
    </div>
    <button-list :state="state" :dispatch="dispatch" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import ButtonList from './ButtonList.vue';

export default defineComponent({
  name: 'ContactOperation',
  components: {
    ButtonList,
  },
  props: {
    contactInfo: {
      type: Object,
      required: true,
    },
    state: {
      type: Object,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    reducer: {
      type: Function as PropType<
        (action: { type: string; payload?: any }) => void
      >,
      default: undefined,
    },
    destroy: {
      type: Function as PropType<() => void>,
      required: true,
    },
    getContactInfo: {
      type: Function as PropType<() => void>,
      required: true,
    },
    phone: {
      type: Function as PropType<(num: number | string) => void>,
      required: true,
    },
    sms: {
      type: Function as PropType<(num: number | string) => void>,
      required: true,
    },
    voice: {
      type: Function as PropType<(device: { id: number, name: string, value: number }) => void>,
      required: true,
    },
    video: {
      type: Function as PropType<(device: { id: number, name: string, value: number }) => void>,
      required: true,
    },
    track: {
      type: Function as PropType<() => void>,
      required: true,
    },
    meeting: {
      type: Function as PropType<(item: any) => void>,
      required: true,
    },
    task: {
      type: Function as PropType<() => void>,
      required: true,
    },
    search: {
      type: Function as PropType<() => void>,
      required: true,
    },
    searchMonitor: {
      type: Function as PropType<() => void>,
      required: true,
    },
    detail: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const active = ref(false);

    const container = ref<HTMLDivElement>();

    const doDestroy = () => {
      active.value = false;
      setTimeout(props.destroy, 300);
    };

    const clickListener = (ev: MouseEvent) => {
      if (container.value) {
        if (!container.value.contains(ev.target as Node)) {
          doDestroy();
        }
      } else {
        document.removeEventListener('click', clickListener, true);
      }
    };

    onMounted(() => {
      setTimeout(() => {
        active.value = true;
      }, 0);
      document.addEventListener('click', clickListener, true);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', clickListener, true);
    });

    function dispatch(action: { type: string; payload?: any }) {
      let payload: any;
      switch (action.type) {
        case 'phone':
          props.phone(action.payload);
          break;
        case 'sms':
          props.sms(action.payload);
          break;
        case 'voice':
          props.voice(action.payload);
          break;
        case 'video':
          props.video(action.payload);
          break;
        case 'track':
          props.track();
          break;
        case 'meeting':
          props.meeting(action.payload);
          break;
        case 'task':
          props.task();
          break;
        case 'search':
          props.search();
          break;
        case 'searchMonitor':
          props.searchMonitor();
          break;
        case 'detail':
          props.detail();
          break;
        default:
      }
      if (props.reducer) {
        props.reducer({
          type: action.type,
          payload: {
            ...action.payload,
            ...payload,
          },
        });
      }
      doDestroy();
    }

    return {
      dispatch,
      container,
      active,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  transform: scale(0) translate(-50%, 20px);
  position: fixed;
  transform-origin: left top;
  z-index: 99999;
  background: #000;
  color: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
  border: 1px solid #00c1de;
  transition: transform 0.3s;
  // 顶部三角形
  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-left: 1px solid #00c1de;
    border-top: 1px solid #00c1de;
    background: black;
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }
  &.active {
    transform: scale(1) translate(-50%, 20px);
  }
}
.header {
  border-bottom: 1px solid rgba(255, 255, 255, .15);
  padding: 5px;
  & > span:first-child::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    color: inherit;
    background: currentColor;
    margin-right: 5px;
  }
}
.buttonList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 400px;
  & > li {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #FFF;
    position: relative;
    margin: 5px;
    .subList {
      max-height: 0;
      position: absolute;
      left: -1px;
      top: -1px;
      width: 100%;
      overflow: hidden;
      background: #000;
      z-index: 2;
      text-align: center;
      color: #FFF;
      & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #56e9ff;
      }
      & > li:hover {
        background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
      }
      & > li {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &:hover {
      color: #56e9ff;
      .subList {
        max-height: 200px;
        border: 1px solid #008abf;
      }
    }
    &::before,
    .subList > div:first-child::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      color: inherit;
      background: currentColor;
      margin-right: 10px;
    }
    &.disabled {
      color: #a6adb4;
      cursor: not-allowed;
      pointer-events: none;
    }
    $icon-list: detail, live, meeting, monitor, phone, search, sms, task, track, video, voice;
    @each $icon in $icon-list {
      &.#{$icon}::before,
      &.#{$icon} > .subList > div:first-child::before {
        mask: no-repeat center/100% 100% url("./assets/imgs/#{$icon}.svg");
      }
    }
  }
}
</style>
