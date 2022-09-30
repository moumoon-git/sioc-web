<template>
  <div :class="$style.completion">
    <ul>
      <li
        v-for="(item,index) in listData"
        :key="index"
      >
        <div>{{ item.number }}</div>
        <div>{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style module lang="scss">
.completion{
    width: 100%;
    height: 100%;
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    li{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 1px;
        height: 20px;
        background: #E6E6E6;
        border-radius: 3px;
      }
      &:last-child::after{
        display: none;
      }
      div:first-child{
        font-size: 18px;
        line-height: 18px;
        color: #56E9FF;
        margin-bottom: 5px;
      }
      div:last-child{
        line-height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, .8);
      }
      &:last-child>div:first-child{
        color:rgba(247, 181, 0, 1);
      }
    }
  }
}

</style>
