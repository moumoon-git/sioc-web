<template>
  <section :class="$style['pagination__wrap']">
    <button :class="$style['pagination__prev']" @click="prev" />
    <input
      type="text"
      :class="$style['pagination__input']"
      v-model="currentTemplatePage"
      @keyup.enter="pageChange"
    />
    <label :class="$style['pagination__label']">{{
      Number(totalCount) ? Math.ceil(Number(totalCount) / Number(pageSize)) : 0
    }}</label>
    <button :class="$style['pagination__next']" @click="next" />
  </section>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Pagination',
  components: {},
  props: {
    currentPage: {
      type: String,
      default: '1',
    },
    pageSize: {
      type: String,
      default: '10',
    },
    totalCount: {
      type: String,
      default: '0',
    },
  },
  emits: ['handlePageChange', 'update:currentPage'],
  setup(prop, context) {
    // const nums = String(
    //   Number(prop.totalCount)
    //     ? Math.ceil(Number(prop.totalCount) / Number(prop.pageSize))
    //     : 0,
    // );
    // 当前临时页数
    const currentTemplatePage = ref(prop.currentPage);

    watch(
      () => prop.totalCount,
      () => {
        // const num = String(
        //   Number(prop.totalCount)
        //     ? Math.ceil(Number(prop.totalCount) / Number(prop.pageSize))
        //     : 0,
        // );
        // currentTemplatePage.value = num;
      },
    );
    watch(
      () => prop.currentPage,
      (newValue) => {
        currentTemplatePage.value = newValue;
      },
    );

    watch(currentTemplatePage, (newValue, oldValue) => {
      context.emit('update:currentPage', newValue);
      if (newValue) {
        context.emit('handlePageChange');
      }
    });

    return {
      currentTemplatePage,
    };
  },
  mounted() {},
  methods: {
    prev() {
      if (this.currentTemplatePage !== '1') {
        this.currentTemplatePage = String(Number(this.currentTemplatePage) - 1);
      }
    },
    next() {
      const allNum = Math.ceil(Number(this.totalCount) / Number(this.pageSize));
      if (
        Number(this.currentTemplatePage) !== allNum &&
        Number(this.currentTemplatePage) < allNum
      ) {
        console.log(Number(this.currentTemplatePage) < allNum);
        this.currentTemplatePage = String(Number(this.currentTemplatePage) + 1);
      }
    },
    pageChange() {
      if (
        Number(this.currentTemplatePage) >
        Math.ceil(Number(this.totalCount) / Number(this.pageSize))
      ) {
        this.currentTemplatePage = this.currentPage;
      }
      if (Number(this.currentTemplatePage) < 1) {
        this.currentTemplatePage = this.currentPage;
      }
    },
  },
});
</script>
<style lang="scss" module>
.pagination__wrap {
  width: 100%;
  white-space: nowrap;
  box-sizing: border-box;
  padding-left: 50px;
  display: flex;
  align-items: center;
  & .pagination__prev {
    display: inline-block;
    cursor: pointer;
    width: 10px;
    height: 16px;
    border: none;
    background: url(../../assets/pagination-icon.svg) no-repeat center/100% 100%;
    margin-right: 18px;
  }
  // .pagination__page-desc {
  //     text-align: center;
  //     width: 16%;
  //     padding: 10px 30px;
  //     color:#fff;
  //     background: linear-gradient( 90deg, rgba(0, 193, 222, 0.1) 50%, rgba(24, 38, 50, 0.1) 100%);
  //     display: inline-block;
  //     border: transparent;
  //     &::-webkit-input-placeholder {
  //         color: #fff;
  //     }
  //     cursor: pointer;
  // }
  & .pagination__input {
    width: 48px;
    height: 22px;
    background: transparent;
    color: #ffffff;
    text-align: center;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  & .pagination__label {
    margin-left: 16px;
    color: rgba(255, 255, 255, 0.65);
    &::before {
      content: '/';
      margin-right: 16px;
    }
  }

  & .pagination__next {
    display: inline-block;
    cursor: pointer;
    width: 10px;
    height: 16px;
    border: none;
    transform: rotateY(180deg);
    background: url(../../assets/pagination-icon.svg) no-repeat center/100% 100%;
    margin-left: 18px;
  }
}
</style>
