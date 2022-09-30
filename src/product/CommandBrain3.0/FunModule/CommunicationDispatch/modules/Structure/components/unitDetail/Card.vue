// 应急负责人、应急联络人卡片
<template>
  <div class="unitCard">
    <div class="unitCard__top">
      分管自然灾害
    </div>
    <div class="unitCard__list">
      <div class="unitCard__list__item">
        <div class="unitCard__list__item__left">
          张三（禅城区应急管理局 / 副局长)
        </div>
        <div class="unitCard__list__item__right" />
      </div>
      <div class="unitCard__list__item">
        <div class="unitCard__list__item__left">
          张三（禅城区应急管理局 / 副局长)
        </div>
        <div class="unitCard__list__item__right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    personData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {

    };
  },
});
</script>

<style lang="scss">
.unitCard{
    width: 322px;
// height: 98px;
background: linear-gradient(
90deg
 , rgba(0, 193, 222, 0.3) 0%, rgba(24, 38, 50, 0) 100%);
 margin: 16px 0;
 &__top{
height: 36px;
    line-height: 36px;
    text-align: center;
 }
 &__list{
     &__item{
             display: flex;
    justify-content: space-between;
    margin-bottom: 11px;
         &__left{
                 line-height: 26px;
    margin-left: 16px;
         }
         &__right{
             width: 16px;
             height: 26px;
             background: url(./assets/more.svg) no-repeat;
             cursor: pointer;
         }
     }
 }
}
</style>
