<template>
  <div :class="$style.VisInformation">
    <ul>
      <li>
        <span>物资库名称：</span>
        <div>
          <span :class="$style.contact">广州市增城区新塘镇应急保障仓库</span>
          <!-- 联系人 -->
          <ContactMoreButton />
          <!-- 定位 -->
          <i :class="$style.localtion"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// 联系人操作按钮
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';

export default defineComponent({
  components: {
    // 联系人更多操作按钮
    ContactMoreButton,
  },
});
</script>

<style lang="scss" module>
.VisInformation {
  ul {
    list-style: none;
    padding: 5px 0;
    li {
      margin: 5px 10px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      & > span {
        width: 100px;
        max-width: 100px;
      }
      & > div {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        & > div {
          display: inline-block;
          height: auto;
        }
      }
    }
  }
  .contact {
    color: rgba(86, 233, 255, 1);
  }
  .localtion {
    margin-left: 10px;
    display: block;
    width: 16px;
    height: 16px;
    background: url('../assets/localtion.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>