<template>
  <div :class="$style.Information">
    <!-- 直播 -->
    <div :class="$style.live" v-if="liveData && liveData.coverUrl" @click="openLive" >
      <img :src="liveData.coverUrl" alt="">
      <span :class="$style.liveState"></span>
      <span :class="$style.livePlay" ></span>
    </div>
    <div :class="$style.mainInfo">
      <div
        v-for="(item, index) in informationList.mainInfo"
        :key="index"
        :class="$style['information-box']"
      >
        <label :class="$style['label-title']">{{ item.title }}：</label>
        <template v-if="item.contactorList?.length">
          <templete v-for="(item1, i) in item.contactorList" :key="i">
            <span :class="$style['fit-content']">
              {{ item1.name }}
            </span>
            <ContactMoreButton :id="item1.id || item1.contactorId" />
          </templete>
        </template>
        <template v-else>
          <span :class="$style['text-dec']">
            {{ item.dec }}
          </span>
          <div
            v-if="item.longitude && item.latitude && item.hasLocationBtn && attentionBtnFlag"
            :class="$style.locationIcon"
            @click="positionTo(item)"
          />
        </template>
      </div>
      <div v-if="attentionBtnFlag && profilePic" :class="$style['attention-info']">
        <img :class="$style.profilePic" :src="profilePic ? profilePic : defaultAvatar" />
        <AttentionBtn v-if="attentionBtnFlag" :has-attention="isAttention" />
      </div>
    </div>

    <div v-for="(item, i) in moreInfo" :key="i" :class="$style['information-box']">
      <label :class="$style['label-title']">{{ item.title }}：</label>
      <template v-if="item.contactorList?.length">
        <templete v-for="(item1, v) in item.contactorList" :key="v">
          <span :class="$style['fit-content']">
            {{ item1.name }}
          </span>
          <ContactMoreButton :id="item1.id || item1.contactorId" />
        </templete>
      </template>
      <template v-else>
        <span :class="$style['text-dec']">
          {{ item.dec }}
        </span>
        <div
          v-if="item.longitude && item.latitude && item.hasLocationBtn && attentionBtnFlag"
          :class="$style.locationIcon"
          @click="positionTo(item)"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, watch, ref, reactive, inject, nextTick, getCurrentInstance } from 'vue';
// 直播弹窗
import LiveStream from '@/product/CommandBrain3.0/Generalparts/dialog/LiveStream/LiveStream.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import AttentionBtn from './AttentionBtn.vue';
import myStore from '../../store/useStore';

export default defineComponent({
  name: 'Information',
  components: {
    AttentionBtn,
    ContactMoreButton,
  },
  props: {
    liveData: {
      type: Object,
      default: ()=>{},
    },
    profilePic: {
      type: String,
      default: '',
    },
    isAttention: {
      type: Boolean,
      default: false,
    },
    informationList: {
      type: Object,
      default: (): Record<string, any> => ({
        mainInfo: [],
        _moreInfo: [],
        hasAttention: true,
      }),
    },
  },

  setup(props) {
    const defaultAvatar = require('../../assets/img/profile.svg');
    const store = useStore(); // 使用vuex
    const { $message } = useGlobal();
    const uid: any = inject<string>('uid');
    const instance: any = getCurrentInstance();
    const { $globalStorageFun } = instance?.appContext.config.globalProperties;
    const { $addDialog } = $globalStorageFun;
    const moreInfo: any = reactive([]);
    const { state } = myStore();
    const attentionBtnFlag = ref<boolean | any>(props.informationList.hasAttention ?? true);
    // 可视化应急管理的时候不出现关注
    if (store.state.btnTab) {
      if (store.state.btnTab.btnData[0].active) {
        attentionBtnFlag.value = false;
      }
    }
    // 监听详细信息按钮展开更多信息
    watch(
      () => (state as any)[uid]?.isExpand,
      newValue => {
        console.log(newValue, 'watch');
        // 注意proxy不能操作源赋值操作 就跟浅拷贝一个道理
        if (newValue) {
          moreInfo.push(...props.informationList._moreInfo);
        } else {
          moreInfo.length = 0;
        }
        console.log(moreInfo, 'moreInfo');
      },
    );
    function positionTo(data: any) {
      const { longitude, latitude } = data;
      window.map.setCentent({ longitude, latitude }, 15);
    }
    let curStreamDialog: any;
    function openLive() {
      // 关闭上一次弹窗
      if (curStreamDialog) {
        curStreamDialog.close();
      }
      const item = props.liveData;
      // 打开直播
      nextTick(() => {
        curStreamDialog = $addDialog(item.liveRoomTitle || '直播', LiveStream, {
          roomID: item.id,
          streamer: {
            name: item.userVo?.name || '未知用户',
            position: item.userVo?.roleName || '暂无',
            groupName: item.userVo?.department || '暂无',
            address: item.liveAddress || '暂无地址',
          },
        });
      });
    }

    return {
      defaultAvatar,
      moreInfo,
      positionTo,
      attentionBtnFlag,
      openLive,
    };
  },
});
</script>
<style lang="scss" module>
.Information {
  .live{
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    position: relative;
    img{
      width: 340px;
    }
    &::before{
      content: '';
      z-index: 3;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .3);
    }
    .liveState{
      position: absolute;
      width: 48px;
      height: 48px;
      top: 10px;
      right: 10px;
      z-index: 2;
      background: no-repeat 100% 100% url('../../assets/img/liveState.svg');
    }
    .livePlay{
      z-index: 4;
      position: absolute;
      width: 48px;
      height: 48px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background:no-repeat 100% 100% url('../../assets/img/livePlay.svg');
    }
  }
  .mainInfo {
    position: relative;
    .attention-info {
      position: absolute;
      right: 20px;
      top: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .profilePic {
        width: 40px;
        height: 40px;
        // background: url("../../assets/img/profile.png") no-repeat;
        margin-bottom: 5px;
      }
    }
  }
  .information-box {
    padding: 5px 0 5px 9px;
    display: flex;
    align-items: center;
    .label-title {
      // width: 78px;
      // text-align: right;
    }
    .text-dec {
      width: 162px;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
    .fit-content {
      width: fit-content;
    }
    .locationIcon {
      cursor: pointer;
      width: 16px;
      height: 16px;
      background: url('../../assets/img/target-icon.png');
    }
  }
}
</style>
