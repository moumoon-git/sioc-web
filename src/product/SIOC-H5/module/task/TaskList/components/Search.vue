<template>
  <!-- 搜索框内容 -->
  <header>
    <van-search
      v-model="tempSearch"
      shape="round"
      placeholder="请搜索关键字"
      @search="onSearch"
    />
    <label @click="$emit('update:searchVisible',false)">取消</label>
  </header>
  <!-- 主体内容 -->
  <main>
    <section class="search-record-title">
      <label class="search-record-title__label">搜索记录</label>
      <i class="search-record-title__delete" @click="showDeleteIcon"></i>
    </section>
    <ul class="search-record-content">
      <li v-for="(item, index) in searchRecordList" :key="index" >
        <label @click="tempSearch=item,$emit('update:searchVisible',false)">{{ item }}</label>
        <i v-if="isDeleteVisible" @click="deleteSearchRecord(index)"></i>
      </li>
    </ul>
  </main>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Search',
  components: {
  },
  props: {
    // 搜索框内容
    search: {
      type: String,
      default: '',
    },
    // 搜索组件是否可见
    searchVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:search', 'update:searchVisible'],
  setup(props, context) {
    // 搜索框内容
    const tempSearch = ref(props.search);
    // 是否显示搜索记录删除按钮
    const isDeleteVisible = ref(false);
    const searchRecordList = ref(JSON.parse(localStorage.getItem('searchRecord')));
    const searchRecord = localStorage.getItem('searchRecord')?JSON.parse(localStorage.getItem('searchRecord')):[];
    watch(tempSearch, (newValue, oldValue) => {
      const set = new Set(searchRecord);
      set.add(newValue);
      const tempArray = [...set];
      localStorage.setItem('searchRecord', JSON.stringify(tempArray));
      context.emit('update:search', newValue);
    });
    return { tempSearch, isDeleteVisible, searchRecordList };
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    // 点击显示搜索记录删除按钮
    showDeleteIcon() {
      this.isDeleteVisible = !this.isDeleteVisible;
    },
    // 确定搜索
    onSearch() {
      this.$emit('update:searchVisible', false);
    },
    // 删除搜索记录
    deleteSearchRecord(index) {
      this.searchRecordList.splice(index, 1);
      localStorage.setItem('searchRecord', JSON.stringify(this.searchRecordList));
    },
  },
});
</script>
<style lang='scss' scoped>
  header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0.2rem 0rem;
    label {
      cursor: pointer;
      font-size: 0.3rem;
      color: #0091FF;
    }
    :deep(.van-search) {
      padding: 0rem;
      width: 80%;
      .van-cell {
        display: flex;
        align-items: center;
      }
      .van-search__content {
        background: #F2F2F2;
      }
      .van-field__control::-webkit-input-placeholder{
        color: #999999;
      }
    }
  }
  main {
    .search-record-title {
        margin: 0.05rem 0rem;
        padding: 0rem 4%;
        position: relative;
        display: flex;
        align-items: center;
      .search-record-title__label {
        color: #333333;
        font-size: 0.3rem;
        font-weight: 500;
      }
      .search-record-title__delete {
        cursor: pointer;
        width: 0.2rem;
        height: 0.2rem;
        display: inline-block;
        background: url(../assets/deleteIcon.svg) no-repeat 0rem/0.2rem;
        position: absolute;
        right: 4%;
      }
    }
    .search-record-content {
        margin: 0.05rem 0rem;
        padding: 0rem 4%;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        li {
            position: relative;
            margin: 2.5% 1.5%;
            label {
              color: #7E7E7E;
              background: #F8F8F8;
              border-radius: 1rem;
              padding: 0.1rem 0.3rem;
              white-space: nowrap;
            }
            i {
              cursor: pointer;
              width: 0.2rem;
              height: 0.2rem;
              display: inline-block;
              background: url(../assets/closeIcon.svg) no-repeat 0rem/0.2rem;
              position: absolute;
              top: -0.15rem;
              right: -0.02rem;
            };
        }
    }
  }
</style>
