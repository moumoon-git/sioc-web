<template>
  <!-- 弹窗身体部分内的div -->
  <div :class="$style.right">
    <!-- 头 -->
    <div :class="$style.styleHead">
      <div :class="$style.styleHeadText">
        {{ item?.name }}
      </div>
      <!-- 叉 -->
      <div
        :class="$style.styleHeadClose"
        @click="$emit('close')"
      />      
    </div>
    <!-- 专项 -->
    <div v-if="!isUnit">
      <!-- 点专项 -->
      <div v-if="item?.flag===0">
        <div
          v-for="(itemseven, indexseven) in item.tempOuter"
          :key="indexseven"
        >
          <div style="display: flex;">
            <ListTemple
              :useCount="false"
              :title="itemseven.name"
              :useHeaderIcon="false"
              :useList="false"
            />
          </div>
          <div :class="$style.styleOne">
            {{ itemseven.remark }}
          </div>
          <div
            v-for="itemone in item.leftChildren"
            :key="itemone.id"
          >
            <div
              v-if="itemone.labelName===itemseven.name"
              :class="$style.nameStyle"
            >
              {{ itemone.name }}({{ itemone.workUnit || '-' }}/{{ itemone.position }})
            </div>
          </div>
        </div>
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'成员单位'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemtwo in item.children"
          :key="itemtwo.id"
        >
          <div :class="$style.nameStyle">
            {{ itemtwo.name }}
          </div>
        </div>
      </div>
      <!-- 点成员单位 -->
      <div v-if="item?.flag===11">
        <!-- 职责 -->
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急职责'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div :class="$style.styleOne">
          {{ item?.remark }}
        </div>
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急负责人'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemone in item.children"
          :key="itemone.id"
        >
          <div
            v-if="itemone.label === '应急负责人'"
            :class="$style.nameStyle"
          >
            {{ itemone.name }}({{ itemone.workUnit || '-' }}/{{ itemone.position }})
          </div>
        </div>
          <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急联络人'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemone in item.children"
          :key="itemone.id"
        >
          <div
            v-if="itemone.label === '应急联络人'"
            :class="$style.nameStyle"
          >
            {{ itemone.name }}({{ itemone.workUnit || '-' }}/{{ itemone.position }})
          </div>
        </div>
      </div>
    </div>
    <!-- 现场 -->
    <div v-if="isUnit">
      <!-- 点现场 -->
      <div v-if="item?.flag===0">
        <div
          v-for="(itemseven, indexseven) in item.tempOuter"
          :key="indexseven"
        >
          <div style="display: flex;">
            <ListTemple
              :useCount="false"
              :title="itemseven.name"
              :useHeaderIcon="false"
              :useList="false"
            />
          </div>
          <div :class="$style.styleOne">
            {{ itemseven.remark }}
          </div>
          <div
            v-for="itemone in item.leftChildren"
            :key="itemone.id"
          >
            <div
              v-if="itemone.labelName===itemseven.name"
              :class="$style.nameStyle"
            >
              {{ itemone.name }}({{ itemone.workUnit || '-' }}/{{ itemone.position }})
            </div>
          </div>
        </div>
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'功能组'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemtwo in item.children"
          :key="itemtwo.id"
        >
          <div :class="$style.nameStyle">
            {{ itemtwo.name }}
          </div>
        </div>
      </div>
      <!-- 点组 -->
      <div v-if="item?.flag===11">
        <!-- 职责 -->
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急职责'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div :class="$style.styleOne">
          {{ item?.remark }}
        </div>
          <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'成员单位'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemone in item.children"
          :key="itemone.id"
        >
          <div :class="$style.nameStyle">
            <span
              v-if="itemone.leadUnit===1"
              style="background: #F2B626;border-radius: 10px;padding: 1px 7px;font-size: 12px;"
            >牵头单位</span>
            {{ itemone.name }}
          </div>
        </div>
      </div>
      <!-- 点成员单位 一样 -->
      <div v-if="item?.flag===12">
        <!-- 职责 -->
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急职责'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div :class="$style.styleOne">
          {{ item?.remark }}
        </div>
        <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急负责人'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemone in item.children"
          :key="itemone.id"
        >
          <div
            v-if="itemone.label === '应急负责人'"
            :class="$style.nameStyle"
          >
            {{ itemone.name }}({{ itemone.workUnit || '-' }}/{{ itemone.position }})
          </div>
        </div>
          <div style="display: flex;">
          <ListTemple
            :useCount="false"
            :title="'应急联络人'"
            :useHeaderIcon="false"
            :useList="false"
          />
        </div>
        <div
          v-for="itemone in item.children"
          :key="itemone.id"
        >
          <div
            v-if="itemone.label === '应急联络人'"
            :class="$style.nameStyle"
          >
            {{ itemone.name }}({{ itemone.workUnit || '-' }}/{{ itemone.position }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 列表模板

export default defineComponent({
  components: {
    // 详情按钮
    ContactMoreButton,
    // 列表模板
    ListTemple,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    // false 领导小组 true 成员单位
    isUnit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
});
</script>

<style lang="scss" module>
  .right {
    color: rgba(255, 255, 255, 0.8);
    width: 100%;
    height: 100%;
    .styleHead {
      height: 49px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      .styleHeadText {
        font-size: 16px;
        margin-left: 14px;
        margin-top: 13px;
        float: left;
      }
      .styleHeadClose {
        background: url(../PublicComponents/assets/close.svg) no-repeat;
        width: 16px;
        height: 16px;
        margin-right: 15px;
        margin-top: 16px;
        background-size: 100%;
        cursor: pointer;
        float: right;
        opacity: 0.45;
      }
    }
    .styleOne {
      margin: 10px;
    }
    .nameStyle {
      cursor: pointer;
      background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
      margin: 10px;
      opacity: 0.7;
      padding: 10px;
    }
    .nameStyle:hover {
      opacity: 1;
    }
  }
</style>
