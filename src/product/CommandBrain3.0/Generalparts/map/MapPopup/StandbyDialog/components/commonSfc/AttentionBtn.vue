<template lang="">
  <div :class="$style.AttentionBtn">
    <el-tooltip
      class="item"
      effect="light"
      :content="attentionFlag ? '取消关注' : '点击关注'"
      placement="bottom"
    >
      <div
        :class="attentionFlag ? $style['btn-has-atten'] : $style['btn-atten']"
        @click="attentionClick"
        v-text="attentionFlag ? '已关注' : '+ 关注'"
      />
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AttentionBtn',

  props: {
    hasAttention: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { $http, $message } = useGlobal();
    const store = useStore();
    const attentionPayload = inject<any>('attentionPayload');

    const attentionFlag = ref(props.hasAttention);
    function attentionClick(): void {
      let url = '';
      let data:any = null;
      if (attentionFlag.value) {
        // 取消关注
        url = '/event/attention/delete';
        data = [{
          eventId: store.state.event?.id,
          id: attentionPayload.id,
          type: attentionPayload.dialogType,
        }];
      } else {
        // 关注
        url = '/event/attention/save';
        data = {
          eventId: store.state.event?.id,
          attentionId: attentionPayload.id,
          attentionType: attentionPayload.dialogType,
        };
      }
      const request = {
        method: 'post',
        service: 'soc',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      };
      console.log(request, 'req');
      $http(request).then((response:any) => {
        if (response.code === 0 || response.errorcode === 0) {
          console.log(response);
          attentionFlag.value = !attentionFlag.value;
        } else {
          $message.error(response.msg);
        }
      });
    }
    return {
      attentionFlag,
      attentionClick,
    };
  },
});
</script>
<style lang="scss" module>
.AttentionBtn {
  .btn-atten,
  .btn-has-atten {
    width: 44px;
    height: 22px;
    padding: 0 5px;
    line-height: 22px;
    text-align: center;
    cursor: pointer;
  }
  .btn-atten {
    border: 1px solid #00c1de;
    color: #00c1de;
  }
  .btn-has-atten {
    color: #fff;
    border: 1px solid #ffffff;
  }
}
</style>
