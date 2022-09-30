<template>
<div
    
    class="center__camera__name"
  >
    {{ dataString }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NameTip',
  components: {
    
  },
  props: {
    dataString: {
      type: String,
      default: '暂无数据',
    },
  },
  emits: [],
  data() {
    return {
      
    };
  },
  methods: {

  },
});
</script>

<style lang="scss">
.center__camera__name {
  position: absolute;
  height: 27px;
  background: #050505;
  box-shadow: 0px 4px 6px 0px rgb(0 0 0 / 80%);
  opacity: 0.9;
  border: 1px solid rgba(166, 173, 180, 0.3);
  color: #fff;
  padding: 0 10px;
  line-height: 27px;
  width: max-content;
}
</style>
