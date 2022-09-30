<template>
  <section class="contactor-list-wrap">
    <!-- 顶部搜索框 -->
    <header>
      <van-search
        v-model="search"
        shape="round"
        placeholder="请搜索关键字"
      />
    </header>
    <!-- 主体内容 -->
    <main>
      <van-collapse v-model="activeNames">
        <van-collapse-item :name="listItem.title" v-model="listItem.checked" v-for="(listItem, listIndex) in contactorList" :key="listIndex">
          <template #title>
            <span style="margin-left:0.08rem;">{{ listItem.title }}</span>
          </template>
          <template #icon>
            <van-checkbox v-model="listItem.checkAll" @click="handleCheckBoxClick(listItem)"></van-checkbox>
          </template>
          <template #default>
            <van-checkbox-group :ref="listItem.ref" v-model="listItem.checkboxGroup" @change="handleCheckBoxGroupChange(listItem, listIndex)">
              <van-checkbox v-for="(childItem, childIndex) in listItem.children" :key="childIndex" :name="childItem.name">
                <template #default>
                  <div class="contactor-wrap">
                    <van-image
                      round
                      width="0.5rem"
                      height="0.5rem"
                      src="https://s2.ax1x.com/2019/07/23/eF0O1S.png"
                    />
                    <div style="margin-left: 0.1rem;">
                      <label class="contactor-name">{{ childItem.name }}</label>
                      <label class="contactor-profession">{{ childItem.profession }}</label>
                      <label class="contactor-address">{{ childItem.address }}</label>
                    </div>
                  </div>
                </template>
              </van-checkbox>
            </van-checkbox-group>
          </template>
        </van-collapse-item>
      </van-collapse>
    </main>
    <!-- 底部确认框 -->
    <footer>
      <label class="selected-total">
        {{ `${totalContactor}人，${totalGroup}个分组` }}
      </label>
      <div class="confirm">确定</div>
    </footer>
  </section>
</template>
<script>
import { defineComponent, ref, watch, getCurrentInstance, computed } from 'vue';

export default defineComponent({
  name: 'ContactorList',
  components: {
  },
  props: {
  },
  emits: [
  ],
  setup(prop, context) {
    // 搜索框内容
    const search = ref('');
    // 联系人列表
    const contactorList = ref([
      {
        title: '最近联系人',
        checkAll: false,
        checkboxGroup: [],
        children: [
          {
            name: '小明',
            profession: '主任',
            address: '增城区新塘镇朱村街道办',
          },
          {
            name: '小狗',
            profession: '主任',
            address: '增城区新塘镇朱村街道办',
          },
        ],
        ref: '最近联系人',
      },
      {
        title: '常用联系人',
        checkAll: false,
        checkboxGroup: [],
        children: [
          {
            name: '小明',
            profession: '主任',
            address: '增城区新塘镇朱村街道办',
          },
          {
            name: '小红',
            profession: '主任',
            address: '增城区新塘镇朱村街道办',
          },
        ],
        ref: '最近联系人',
      },
    ]);
    const activeNames = ref([]);
    // 已选人数
    const totalContactor = computed(() => contactorList.value.reduce(function (a, b) { return a.checkboxGroup.length + b.checkboxGroup.length }) );
    // 已选分组数
    const totalGroup = computed(() => contactorList.value.filter((item) => item.checkboxGroup.length !== 0).length);
    return { search, activeNames, contactorList, totalContactor, totalGroup};
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    // 联系人复选框组回调函数
    handleCheckBoxGroupChange(listItem, listIndex) {
      if (listItem.checkboxGroup.length === listItem.children.length) {
        this.contactorList[listIndex].checkAll = true;
      } else {
        this.contactorList[listIndex].checkAll = false;
      }
    },
    // 组复选框回调函数
    handleCheckBoxClick(listItem) {
      setTimeout(() => {
        if (listItem.checkAll) {
          this.$refs[listItem.ref].toggleAll(true);
        } else {
          this.$refs[listItem.ref].toggleAll();
        }
      }, 500);
    },
  },
});
</script>
<style lang='scss' scoped>
  .contactor-list-wrap {
    height: 100vh;
    position: relative;
    background: #F5F5F5;
    header {
      background: #fff;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 8%;
      :deep(.van-search) {
        padding: 0rem;
        width: 90%;
        .van-cell__value {
          display: flex;
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
      background: #F5F5F5;
      height: 80%;
      margin: 4% 0rem;
      overflow: auto;
      > section {
          overflow: auto;
          padding: 0rem 4%;
          margin: 0.05rem 0rem;
      }
      .van-checkbox-group {
        :deep(.van-checkbox) {
          padding: 0.1rem 0rem;
          border-bottom: 0.01rem solid rgba(221,221,221,0.3);
          &:last-child {
            border-bottom:initial;
          }
        }
      }
      .van-collapse {
        :deep(.van-collapse-item__content) {
          padding: 0rem 0.16rem;
        }
      }
      .van-cell {
        :deep(.collapse-title) {
          :deep(span) {
            margin-left: 0.08rem;
          }
        }
      }
      .van-image {
        display: block;
      }
      .contactor-name {
        display: inline-block;
        color: #333333;
        font-size: 0.16rem;
        font-weight: bold;
      }
      .contactor-profession {
        display: inline-block;
        color: #86A0BA;
        border-radius: 0.14rem;
        border: 0.01rem solid #CDD6E1;
        padding: 0.01rem 0.08rem;
        font-size: 0.12rem;
        margin-left: 0.05rem;
      }
      .contactor-address {
        display: block;
        color: #999999;
      }
      .contactor-wrap {
        display: flex;
        align-items: center;
      }
    }
    footer {
      width: 100%;
      height: 8%;
      position: fixed;
      bottom: 0%;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      .selected-total {
        margin-left: 4%;
        font-size: 0.16rem;
        color: #0091FF;
        &::before {
          content: '已选择：';
        }
      }
      .confirm {
        display: inline-block;
        font-size: 0.16rem;
        color: #FFFFFF;
        background: #0091FF;
        border-radius: 0.06rem;
        padding: 0.02rem 0.12rem;
        position: absolute;
        right: 4%;
      }
    }
  }
</style>
