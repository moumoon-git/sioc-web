<template>
  <div class="detail__dynamic__card">
    <div class="detail__dynamic__card__top">
      <div class="detail__title__icon" />
      <div class="detail__dynamic__card__time">
        {{ dynamicData.reportTime }}
      </div>
      <div
        class="detail__dynamic__card__status"
        :class="`detail__dynamic__card__status__${dynamicData.operateTypeCode}`"
      >
        {{ dynamicData.operateTypeName }}
      </div>
    </div>
    <div class="detail__dynamic__card__sec">
      <div
        class="detail__dynamic__card__sec__role"
        :class="{'detail__dynamic__card__sec__role__admin':dynamicData.contactorTypeCode=='admin'}"
      >
        {{ dynamicData.contactorTypeName }}
      </div>
      <div class="detail__dynamic__card__sec__name">
        {{ returnName(dynamicData.contactorTypeCode,dynamicData) }}
      </div>
      <div
        v-if="dynamicData.contactorTypeCode==='responsible_person'"
        
      >
      <ContactMoreButton />
      </div>
    </div>
    <div class="detail__dynamic__card__border" />
    <div class="detail__dynamic__card__three">
      {{ dynamicData.content }}
    </div>
    <div
      v-viewer
      class="detail__dynamic__card__four"
    >
      <img
        v-for="(item,index) in returnfile(dynamicData.appAttachments,'image')"
        :key="index"
        :src="`${baseURL}${item.url}`"
        alt=""
      >
      <video
        v-for="(item,index) in returnfile(dynamicData.appAttachments,'video')"
        :key="index"
        :src="`${baseURL}${item.url}`"
        autoplay="autoplay"
        loop="loop"
      />
      <div class="detail__dynamic__card__four__file">
        <a
          v-for="(item,index) in returnfile(dynamicData.appAttachments,'file')"
          :key="index"
          :href="`${baseURL}${item.url}`"
          class="detail__dynamic__card__four__fileItem"
        >
          {{ item.title }}
        </a>
      </div>
    </div>
    <div class="detail__dynamic__card__addr">
      <Address>{{ dynamicData.address || '未获取定位信息' }}</Address>
    </div>
  </div>
  <TaskDynamicDialog ref="TaskDynamicDialogRef" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import TaskDynamicDialog from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/TaskDynamicDialog/TaskDynamicDialog.vue'

export default defineComponent({
  name: 'TaskDynamicCard',
  components: { Address, TaskDynamicDialog },
  inheritAttrs: false,
  props: {
    dynamicData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
      imgs: [], // 图片列表
    };
  },
  watch: {
    dynamicData: {
      handler(val, old) {
        console.log(this.dynamicData);
        // this.returnimgs()
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    returnName(usertype:any, obj:any) {
      let str = '';
      if (usertype === 'responsible_person') {
        str = `${obj?.mailContactorVo?.name ? obj.mailContactorVo.name : ''}(${obj?.mailContactorVo?.position ? obj.mailContactorVo.position : ''})`;
      } if (usertype === 'admin') {
        str = `${obj?.user?.username ? obj.user.username : ''}`;
      }
      return str;
    },
    // type文件类型 image、file、video
    returnfile(list:any, type:string) {
      const arr:any = [];
      list.forEach((element:any) => {
        if (element?.dictionaryType?.code === type) {
          arr.push(element);
        }
      });
      return arr;
    },
  },
});
</script>

<style  lang="scss">
.detail__dynamic__card {
  color: #fff;
    background: linear-gradient(
90deg
, rgba(0, 193, 222, 0.3) 0%, rgba(24, 38, 50, 0) 100%);
    padding-bottom: 10px;
    padding-top: 10px;
    margin: 0 auto;
    margin-bottom: 10px;
    width: 360px;
  .detail__dynamic__card__top {
    display: flex;
    align-items: center;
    .detail__dynamic__card__time {
      color: rgba(86, 233, 255, 1);
      font-size: 16px;
      width: 270px;
    }
    .detail__dynamic__card__status {
      color: #fff;
    }
    .detail__dynamic__card__status__cancel {
      color: #f66e6e;
      background: url(../assets/taskcancle.png) no-repeat;
      width: 86px;
      text-align: right;
      background-position-y: 50%;
    }
    .detail__dynamic__card__status__finish {
      color: #0bd295;
      background: url(../assets/taskover.png) no-repeat;
      width: 86px;
      text-align: right;
      background-position-y: 50%;
    }
    .detail__dynamic__card__status__restart {
      color: #f5b914;
      background: url(../assets/taskrestart.png) no-repeat;
      width: 86px;
      text-align: right;
      background-position-y: 50%;
    }
  }
  .detail__dynamic__card__sec {
    display: flex;
    margin: 0 auto;
    width: 339px;
    margin-top: 10px;
    margin-bottom: 10px;
    .detail__dynamic__card__sec__role {
      // width: 52px;
      height: 20px;
      background: #00c1de;
      border-radius: 10px;
      text-align: center;
      min-width: 42px;
      padding: 0 5px;
    }
    .detail__dynamic__card__sec__role__admin {
      background: #f66e6e;
    }
    .detail__dynamic__card__sec__name {
      margin-left: 8px;
    }
    .detail__dynamic__card__sec__more {
      background: url(../assets/more.svg) no-repeat;
      width: 10px;
      background-position: 50% 50%;
      cursor: pointer;
    }
  }
  .detail__dynamic__card__border {
    width: 360px;
    height: 9px;
    background: url(../assets/border.png) no-repeat;
  }
  .detail__dynamic__card__three {
    margin: 0 auto;
    width: 339px;
    margin-bottom: 9px;
  }
  .detail__dynamic__card__four {
    width: 100%;
    > img {
      width: 77px;
      height: 77px;
      border: 1px solid #00c1de;
      margin: 0 4px;
    }
    >video{
      width: 77px;
      height: 77px;
      border: 1px solid #00c1de;
      margin: 0 4px;
      outline: 0;
    }
    &__file {
      width: 95%;
      margin: 0 auto;

      .detail__dynamic__card__four__fileItem {
        cursor: pointer;
        text-decoration: none;
        color: #fff;
        display: block;
        &:hover {
          color: #56e9ff;
        }
      }
    }
  }
  .detail__dynamic__card__addr {
    margin: 0 auto;
    width: 346px;
  }
}
</style>
