// uds操作按钮
<template>
  <div class="udsItem">
    <div class="udsItem__item">
      <div class="udsItem__item__icon" />
      <div class="udsItem__item__name">
        {{type}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive,onMounted } from 'vue';

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'phone',
    },
  },
  setup(props) {
    //   const udsName = ref('电话呼叫');
    //   const returnUdsName = (type:string) =>{
    //       if(type===`phone`){
    //           udsName
    //       }
    //   }
      onMounted(()=>{

      })
    return {
        // udsName
    };
  },
});
</script>

<style lang="scss">
    .udsItem{
        width: 100px;
        height: 100px;
        border: 1px solid red;
        &__item{
            &__icon{

            }
            &__name{

            }
        }
    }
</style>
