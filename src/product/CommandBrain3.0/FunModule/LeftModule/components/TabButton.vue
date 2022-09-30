<template>
  <div :class="$style.tabButton">
    <ul>
      <li
        v-for="(item, index) in btnData"
        :key="index"
        :class="item.active ? $style.liActive : ''"
        @click="tabModule(item)"
      >
        <div :class="$style.iconblock + ' icon-' + item.icon" />
        <div
          class=""
          :class="$style.iconhidden + ' icon-' + item.icon + 'Active'"
        />
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      // 按钮数据
      btnData: [
        {
          name: '事件信息',
          type: 'eventInfo',
          icon: 'eventInfo',
          active: true,
        },
        {
          name: '组织动态',
          type: 'organization',
          icon: 'organization',
          active: false,
        },
        {
          name: '辅助工具',
          type: 'auxiliary',
          icon: 'auxiliary',
          active: false,
        },
      ],
    };
  },
  methods: {
    tabModule(item: any) {
      const items: any = item;
      (this as any).btnData.forEach((ele: any) => {
        const eles: any = ele;
        eles.active = false;
      });
      items.active = true;
      (this as any).$emit('tabModule', items);
    },
  },
});
</script>

<style module>
.tabButton {
  color: #fff;
}
.tabButton ul {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  background: rgba(14, 23, 24, 0.8);
  border-right: 1px solid #00c1de;
}
.tabButton ul li {
  cursor: pointer;
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  padding: 13px 0;
  border: 1px solid #00c1de;
  border-right: none;
  display: flex;
  justify-content: center;
}
.tabButton ul li:hover,
.tabButton ul .liActive {
  color: #00ecff;
  background: linear-gradient(90deg, #00c1de 0%, rgba(24, 38, 50, 0) 100%);
}
.tabButton ul li:hover .iconblock,
.liActive .iconblock {
  display: none;
}
.tabButton ul li:hover .iconhidden,
.liActive .iconhidden {
  display: block;
}
.tabButton ul li div {
  width: 24px;
  height: 24px;
  margin-right: 7px;
}
.iconhidden {
  display: none;
}
</style>

<style lang="scss">
@each $animal in eventInfo, organization, auxiliary {
  .icon-#{$animal} {
    background: url('../assets/#{$animal}.png') no-repeat;
    background-size: 100% 100%;
  }
  .icon-#{$animal}Active {
    background: url('../assets/#{$animal}_Active.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
