<template>
  <div
    v-if="showDialog"
    class="wsMessage"
  >
    <div class="wsMessage__title">
      您有一条新消息
      <div
        class="wsMessage__title__delete"
        @click="close"
      />
    </div>
    <div class="wsMessage__content">
      {{ content }}<div class="wsMessage__content__close">
        <!-- {{ closetime }} -->
      </div>
    </div>
    <div class="wsMessage__sure">
      <div
        class="wsMessage__sure__btn"
        @click="toPathFun"
      >
        立即查看
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
 defineComponent, ref, onMounted, onBeforeUnmount,
} from 'vue';
import { setTimeout } from 'timers';

export default defineComponent({
  props: {
    content: {
      type: String,
      default: '暂无',
    },
    toPath: {
      type: String,
      default: '/',
    },
    mapId: {
      type: Number,
      default: 0,
    },
  },
  emits: ['refrash'],
  setup(props, { emit }) {
    const showDialog = ref(false);
    const closetime = ref(5);
  //  const timer = setInterval(() => {
  //     closetime.value -= 1;
  //     if (closetime.value === 0) {
  //       showDialog.value = false;
  //       // closetime.value = 5;
  //       // clearInterval(timer);
  //     }
  //   }, 1000);
    function close() {
      showDialog.value = false;
    }
    function open() {
      showDialog.value = true;
    }
    // onBeforeUnmount(() => {
    //   clearInterval(timer);
    // });
    return {
      showDialog,
      closetime,
      close,
      open,
    };
  },
  watch: {
    $route(to, from) {
        this.$router.go(0);
    },
},
  methods: {
    toPathFun() {
   const request = {
        method: 'get',
        service: 'coplotting',
        url: `/assist/assistmap/info/${this.mapId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          console.log(response.data);
          const mapsData = response.data.assistMap;
          (this as any).$store.state.coplotting.selfMap = mapsData;
          this.$router.push({ path: '/plottingIndex', query: { mapId: this.mapId } });
        });
    },
  },
});
</script>

<style lang="scss">
.wsMessage {
  position: absolute;
  z-index: 99999;
  right: 0;
  bottom: 0;
  width: 200px;
  height: 130px;
  background: #ffffff;
  box-shadow: 0px 3px 10px 2px rgb(44 45 46 / 16%);
  border-radius: 4px;
  &__title {
    width: 100%;
    height: 30px;
    background: linear-gradient(131deg, #1fa1ff 0%, #69c5ff 100%);
    box-shadow: 0px 3px 10px 0px rgb(44 45 46 / 16%);
    border-radius: 4px 4px 0px 0px;
    line-height: 30px;
    font-size: 12px;
    color: #fff;
    padding-left: 10px;
    position: relative;
    &__delete {
      position: absolute;
      top: 9px;
      right: 14px;
      width: 15px;
      height: 15px;
      background: url(./assets/cha.svg) no-repeat;
      cursor: pointer;
      background-size: 66%;
    }
  }
  &__content {
    width: 90%;
    height: 60px;
    color: #333333;
    line-height: 20px;
    margin: 0 auto;
    font-size: 12px;
    border-bottom: 1px solid rgba(233, 236, 241, 1);
    padding: 0 10px;
    &__close {
      display: inline;
    }
  }
  &__sure {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    overflow: hidden;
    &__btn {
      width: 80px;
      height: 24px;
      background: #ecf4ff;
      border-radius: 3px;
      border: 1px solid #0091ff;
      cursor: pointer;
      color: rgba(0, 145, 255, 1);
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      &:hover {
        background: rgba(0, 145, 255, 1);
        color: #fff;
      }
    }
  }
}
</style>
