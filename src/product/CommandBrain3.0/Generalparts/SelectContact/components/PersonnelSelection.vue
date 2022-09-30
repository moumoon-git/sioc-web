<template>
  <div :class="$style.PersonnelSelection">
    <!-- 头部 -->
    <Title title="部门成员" />
    <!-- 人员选择 -->
    <main>
      <!-- 应急负责人 -->
      <Checkbox
        title="应急负责人"
        ref="Checkboxs"
        :deleteData="deleteData"
        :list-data="contactListObj.responsible"
        :cheackAll="cheackAll"
        @handleCheckedChange="handleCheckedChangex"
      />
      <!-- 应急联络人 -->
      <Checkbox
        title="应急联络人"
        ref="Checkboxxl"
        :deleteData="deleteData"
        :list-data="contactListObj.contact"
        :cheackAll="cheackAll"
        @handleCheckedChange="handleCheckedChangexl"
      />
      <!-- 其他人员 -->
      <Checkbox
        title="其他人员"
        ref="Checkboxxls"
        :deleteData="deleteData"
        :list-data="contactListObj.other"
        :cheackAll="cheackAll"
        @handleCheckedChange="handleCheckedChangexls"
      />
    </main>
    <!-- 全选和取消全选 -->
    <div>
      <span>全选</span>
      <el-checkbox v-model="checked"></el-checkbox>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Title from './Title.vue';
import Checkbox from './Checkbox.vue';

export default defineComponent({
  components: {
    Title,
    Checkbox,
  },
  props: {
    contactListObj: {
      type: Object,
      default: () => {},
    },
    deleteData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, contxt) {
    const checked = ref<any>(false);
    const fzArr = ref<any>([]);
    const llArr = ref<any>([]);
    const qtArr = ref<any>([]);
    const allArr = ref<any>([]);
    const cheackAll = ref<any>(false);
    // 向父组件传递消息
    function sendMsg() {
      const arr = [...fzArr.value, ...llArr.value, ...qtArr.value];
      const obj: Record<number | string, boolean> = {};
      allArr.value = arr.reduce((pre: any, x: any) => {
        if (!obj[x.id]) {
          obj[x.id] = true;
          pre.push(x);
        }
        return pre;
      }, []);
      contxt.emit('sendMsg', allArr.value);
    }
    // 应急负责人
    function handleCheckedChangex(params: any) {
      fzArr.value = params.arr;
      sendMsg();
    }
    // 应急联络人
    function handleCheckedChangexl(params: any) {
      llArr.value = params.arr;
      sendMsg();
    }
    // 其他人员
    function handleCheckedChangexls(params: any) {
      qtArr.value = params.arr;
      sendMsg();
    }
    // 全选
    watch(checked, (newV) => {
      cheackAll.value = newV;
    });
    return {
      checked,
      allArr,
      cheackAll,
      handleCheckedChangex,
      handleCheckedChangexl,
      handleCheckedChangexls,
    };
  },
  methods: {
    // 清除所有
    deleteAll() {
      if ((this as any).$refs.Checkboxs) {
        (this as any).checked = false;
        (this as any).$refs.Checkboxs.handleCheckAllChange(false);
        (this as any).$refs.Checkboxxl.handleCheckAllChange(false);
        (this as any).$refs.Checkboxxls.handleCheckAllChange(false);
      }
    },
  },
});
</script>

<style lang="scss" module>
.PersonnelSelection {
  display: flex;
  flex-direction: column;
  & > main {
    padding: 20px 15px;
    height: calc(100% - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    &::-webkit-scrollbar {
      width: 3px;
      height: 5px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
      background-color: #56e9ff;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
      border-radius: 10px;
      background-color: #646869;
    }
  }
  & > div {
    &:last-child {
      margin: 10px;
    }
    & > span {
      font-size: 16px;
      font-weight: 500;
      color: #56e9ff;
      margin-right: 8px;
    }
  }
}
</style>