<!--物资清单-->
<template>
  <div class="inventory-container">
    <div v-if="allocationDetails.length === 0" class="no-list_layout">
      <span class="no-data">暂无物资清单</span>
    </div>
    <ul v-else>
      <li v-for="(item, index) in allocationDetails" :key="getRandom()" class="card__container">
        <div class="card__header">
          <div class="card__header__left">{{item.storehouseName}}</div>
          <div class="card__header__right">
            <div class="icon-focus" @click="toMap(item)"></div>
            <div class="division"></div>
            <div class="icon-phone2" @click="handleCallUp(item.contactor)"></div>
          </div>
        </div>
        <div class="card__body">
          <ul class="list">
            <li v-for="el in item.resources" class="item">
              <div class="item__left">
                {{el.resourceName}}
              </div>
              <div class="item__right">
                <span class="number">{{el.allocationNum}}</span>
                <span class="unit">件</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
      
    </ul>
    <!-- todo 抽出来做公共组件 -->
    <van-popup v-model:show="show" round position="bottom" :style="{ height: 'auto' }">
      <div class="member-phone-container-layout">
        <div class="member-phone-container-header">请选择号码</div>
        <div class="member-phone-container-body">
          <a v-if="memberPhone.phone" :href="'tel:' + memberPhone.phone" class="member-phone">
            <div>手机号码1</div>
            <div class="phone">{{ memberPhone.phone }}</div>
          </a>
          <a v-if="memberPhone.mobile1" :href="'tel:' + memberPhone.mobile1" class="member-phone">
            <div>手机号码2</div>
            <div class="phone">{{ memberPhone.mobile1 }}</div>
          </a>
          <a v-if="memberPhone.mobile2" :href="'tel:' + memberPhone.mobile2" class="member-phone">
            <div>手机号码3</div>
            <div class="phone">{{ memberPhone.mobile2 }}</div>
          </a>
          <a
            v-if="memberPhone.officeTel"
            :href="'tel:' + memberPhone.officeTel"
            class="member-phone"
          >
            <div>办公电话</div>
            <div class="phone">{{ memberPhone.officeTel }}</div>
          </a>
          <a v-if="memberPhone.homeTel" :href="'tel:' + memberPhone.homeTel" class="member-phone">
            <div>家庭电话</div>
            <div class="phone">{{ memberPhone.homeTel }}</div>
          </a>
          <a v-if="memberPhone.otherTel" :href="'tel:' + memberPhone.otherTel" class="member-phone">
            <div>其他电话</div>
            <div class="phone">{{ memberPhone.otherTel }}</div>
          </a>
        </div>
        <div class="member-phone-container-footer" @click="handleClosePopup">
          取消
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import {useRouter} from 'vue-router';
export default defineComponent({
  props: {
    allocationDetails: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const router = useRouter();
    function getRandom() {
      return Math.random()*10
    }
    
    // 是否弹出框选择电话
    const show = ref(false);
    // 成员电话
    const memberPhone = reactive({});
    /**
     * @param {Object} phones 成员电话
     * @description 显示拨打号码弹窗
     */
    function handleCallUp(phones: any) {
      show.value = !show.value;
      Object.assign(memberPhone, phones);
    }

    function toMap(item: any) {
      const latitude = item.latitude;
      const longitude = item.longitude;
      router.push({
        path: '/MapNavigation',
        query: {
          latitude,
          longitude,
        }
      })
    }
    return {
      getRandom,
      handleCallUp,
      show,
      toMap,
      memberPhone
    }
  }
})
</script>

<style lang="scss">
@use '../assets/css/taskInventory.scss';
</style>