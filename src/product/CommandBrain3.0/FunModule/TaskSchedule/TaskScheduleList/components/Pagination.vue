<template>
  <section :class="$style['pagination__wrap']">
    <div :class="$style['pagination__prev']" @click="prev" :style="{cursor:Number(currentTemplatePage)==1?'no-drop':'pointer',}">上一页</div>
    <label v-if="!inputVisible" :class="$style['pagination__page-desc']" @click="inputVisible=true">{{ `${currentPage}/${Math.ceil(Number(totalItems)/10)}` }}</label>
    <input v-if="inputVisible" type="text" :class="$style['pagination__page-desc']" v-model="currentTemplatePage" @blur="pageChange" @keyup.enter="pageChange">
    <div :class="$style['pagination__next']" @click="next" :style="{cursor:Number(currentTemplatePage) >= Math.ceil(Number(totalItems)/10)?'no-drop':'pointer',}">下一页</div>
  </section>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Pagination',
  components: {
  },
  props: {
    currentPage: {
      type: String,
      default: '1',
    },
    totalItems: {
      type: String,
      default: '0',
    },
  },
  emits: ['change', 'update:currentPage'],
  setup(props, context) {
    // 输入框是否可见
    const inputVisible = ref(false);
    const currentTemplatePage = ref('1');
    watch(currentTemplatePage, (newValue, oldValue) => {
      context.emit('update:currentPage', newValue);
    });
    return {
      inputVisible,
      currentTemplatePage,
    };
  },
  data() {
    return {
    };
  },
  mounted() {

  },
  methods: {
    prev() {
      if (this.currentTemplatePage !== '1') {
        this.inputVisible = false;
        this.currentTemplatePage = String(Number(this.currentTemplatePage) - 1);
        this.$emit('change');
      }
    },
    next() {
      if (Number(this.currentTemplatePage) < Math.ceil(Number(this.totalItems)/10)) {
        this.inputVisible = false;
        this.currentTemplatePage = String(Number(this.currentTemplatePage) + 1);
        this.$emit('change');
      }
    },
    pageChange() {
      this.inputVisible = false;
      this.$emit('change');
      if (Number(this.currentTemplatePage) > Math.ceil(Number(this.totalItems)/10)) {
        this.currentTemplatePage = Math.ceil(Number(this.totalItems)/10);
      }
      if (Number(this.currentTemplatePage) < 1) {
        this.currentTemplatePage = 1;
      }
    },
  },
});
</script>
<style lang="scss" module>
    .pagination__wrap {
        width: 100%;
        text-align: center;
        white-space: nowrap;
        margin-bottom: 10px;
        .pagination__prev {
            padding: 10px 30px;
            background: linear-gradient( 90deg, rgba(0, 193, 222, 0.38) 50%, rgba(24, 38, 50, 0.38) 100%);
            color: #00ECFF;
            display: inline-block;
            cursor: pointer;
        }
        .pagination__page-desc {
            text-align: center;
            width: 16%;
            padding: 10px 30px;
            color:#fff;
            background: linear-gradient( 90deg, rgba(0, 193, 222, 0.1) 50%, rgba(24, 38, 50, 0.1) 100%);
            display: inline-block;
            border: transparent;
            &::-webkit-input-placeholder {
                color: #fff;
            }
            cursor: pointer;
        }
        .pagination__next {
            padding: 10px 30px;
            background: linear-gradient( 90deg, rgba(0, 193, 222, 0.38) 50%, rgba(24, 38, 50, 0.38) 100%);
            color: #00ECFF;
            display: inline-block;
            cursor: pointer;
        }
    }
</style>
