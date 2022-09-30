<template>
  <div>
    <Expand
      v-for="(group, index) in groupData"
      :ref="(el) => { expandRefs.push(el) }"
      :key="index"
      :list="group[propSetting.children] || []"
      :show-check="showCheck"
      :show-sort="showSort"
      @check="handleCheck($event, group)"
      @uncheck="handleUncheck($event, group)"
      @check-all="handleGroupCheck(group[propSetting.id])"
      @uncheck-all="handleGroupUncheck(group[propSetting.id])"
    >
      <template #title>
        <div class="multi-video-expand__title">
          <EditInput
            v-if="edittingGroupIndex === index"
            style="width: 200px; font-size: 14px;"
            :value="group[propSetting.name] || '暂无分组名称信息'"
            @confirm="$emit('group-rename', $event, group)"
            @cancel="edittingGroupIndex = -1;"
            @click.stop
          />
          <template v-else>
            {{ group[propSetting.name] || '暂无分组名称信息' }}
            （{{ group[propSetting.children]?.length || 0 }}）
            <button
              v-if="showEdit"
              @click.stop="edittingGroupIndex = index"
            />
          </template>
        </div>
      </template>
      <template
        v-if="showSort"
        #groupSort
      >
        <div class="multi-video-expand__show">
          <div class="multi-video-expand__groupSort">
            <div
              class="multi-video-expand__groupSort--up"
              @click.stop="upFun(index,groupData)"
            />
            <div
              class="multi-video-expand__groupSort--down"
              @click.stop="downFun(index,groupData)"
            />
          </div>
        </div>
      </template>
      <template #default="{ item }">
        <div
          :class="[
            'multi-video-expand__item',
            {
              'multi-video-expand__item--previewing':
                item.visPreview,
            },
          ]"
          @click="$emit('node-click', item)"
        >
          <span
            :class="{
              'multi-video-expand__item--offline': item?.[propSetting?.isOffline]
            }"
          >
            {{ item[propSetting.name] || '暂无名称信息' }}
          </span>
          <button
            v-if="showPreview"
            @click.stop="handlePreview(item)"
          />
        </div>
      </template>
    </Expand>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Expand from '@/product/CommandBrain3.0/Generalparts/right/Expand/Expand.vue';
import EditInput from '@/product/CommandBrain3.0/Generalparts/right/EditInput/EditInput.vue';

export default defineComponent({
  name: 'MultiVideoExpand',
  components: {
    // 单个展开组件
    Expand,
    // 编辑输入框
    EditInput,
  },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    groupData: {
      type: Array,
      required: true,
    },
    propSetting: {
      type: Object,
      default: () => ({
        id: 'id',
        name: 'name',
        children: 'children',
        // 设备离线
        isOffline: 'isOffline',
      }),
    },
    // 显示勾选框
    showCheck: {
      type: Boolean,
      default: true,
    },
    // 显示预览
    showPreview: {
      type: Boolean,
      default: true,
    },
    // 显示编辑
    showEdit: {
      type: Boolean,
      default: true,
    },
    // 显示排序
    showSort: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:modelValue',
    // 分组重命名
    'group-rename',
    // 节点点击
    'node-click',
  ],
  data() {
    return {
      // 勾选的列表
      checkedList: [],
      // Expand 组件的 ref 引用
      expandRefs: [],
      // 正在预览的摄像头ID列表
      previewingIDList: [],
      // 勾选的分组id列表集合
      checkedGroupIDListSet: new Set(),
      // 正在改名的分组下标
      edittingGroupIndex: -1,
    };
  },
  computed: {
    // 勾选的分组id列表数组
    checkedGroupIDList(): number[] {
      return Array.from(this.checkedGroupIDListSet as any);
    },
  },
  watch: {
    modelValue: {
      handler(val) {
        let flag = false;
        // 判断是否父组件更改值
        if (val.length !== this.checkedList.length) {
          flag = true;
        } else {
          val.forEach((item: any) => {
            // 找不到相同元素时判定父组件修改了值
            if (!this.checkedList.find(
              (listItem: any) => listItem[this.propSetting.id] === item[this.propSetting.id],
            )) {
              flag = true;
            }
          });
        }
        if (flag) {
          this.checkedList = val;
          this.checkedGroupIDListSet.clear();
          this.expandRefs.forEach((item: any) => {
            item.setCheck(val);
          });
        }
      },
      deep: true,
    },

  },
  beforeUpdate() {
    this.expandRefs = [];
  },
  beforeUnmount() {
    this.checkedGroupIDListSet.clear();
  },
  methods: {
    /**
     * @description 勾选
     * @param {Array} arr 新增勾选的数组
     */
    handleCheck(arr: any[], group: any): void {
      const parent: any = JSON.parse(JSON.stringify(group));
      const newArr: any[] = [];
      // 添加父节点数据
      arr.forEach((item) => {
        const newVal = JSON.parse(JSON.stringify(item));
        newVal.parent = parent;
        newArr.push(newVal);
      });
      (this.checkedList as any[]).push(...newArr);
      this.$emit('update:modelValue', [...this.checkedList]);
    },
      /**
     * 全选或全不选
     * @param checkAll 是否全选
     */
     handleCheckAll(checkAll?: boolean) {
      this.expandRefs.forEach((item: any) => {
        item.handleCheckAll(checkAll);
      });
    },
    /**
     * @description 取消勾选
     * @param {Array} arr 取消勾选的数组
     */
    handleUncheck(arr: any[]): void {
      arr.forEach((item) => {
        const i = this.checkedList.findIndex(
          (checkedItem: any) => item[this.propSetting.id] === checkedItem[this.propSetting.id],
        );
        this.checkedList.splice(i, 1);
      });
      this.$emit('update:modelValue', [...this.checkedList]);
    },
    // TODO: 预览
    handlePreview(item:any): void {
      const s:any = item;
      if (!s.visPreview) {
        // 发起预览
        (this as any).$store.commit('flightPatrol/SET_flightPatrolPreviewCachePool', [s]);
      } else {
        // 取消预览
        (this as any).$store.commit('flightPatrol/SET_cancelFlightPatrolPreview', [s]);
      }
    },
    /**
     * 勾选分组
     *
     * @param {Number} groupId 分组id
     */
    handleGroupCheck(groupId: number) {
      this.checkedGroupIDListSet.add(groupId);
    },
    /**
     * 取消勾选分组
     *
     * @param {Number} groupId 分组id
     */
    handleGroupUncheck(groupId: number) {
      this.checkedGroupIDListSet.delete(groupId);
    },
      /**
    * @desc 上移
    * @param {}
    * @returns {}
    */
    upFun(index: number, arr: any) {
      if (index !== 0) {
        arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      } else {
        arr.push(arr.shift());
      }
    },
    /**
    * @desc 下移
    * @param {}
    * @returns {}
    */
    downFun(index: number, arr: any) {
      if (index !== arr.length - 1) {
        arr[index] = arr.splice(index + 1, 1, arr[index])[0];
      } else {
        arr.unshift(arr.splice(index, 1)[0]);
      }
    },
  },
});
</script>

<style lang="scss">
.multi-video-expand__title {
  line-height: inherit;
  height: 100%;
  & > button:last-child {
    border: none;
    outline: none;
    display: none;
    background: no-repeat center/100% url(./assets/edit.svg);
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    cursor: pointer;
    &:active {
      top: 3px;
    }
  }
  &:hover > button:last-child {
    display: inline-block;
  }
}
.multi-video-expand__item {
  flex: 1;
  padding-right: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  cursor: pointer;
  & > button:last-child {
    display: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 19px;
    height: 12px;
    outline: none;
    border: none;
    cursor: pointer;
    background: no-repeat center/100% url(./assets/preview-hover.svg);
  }
  &:hover > button:last-child {
    display: inline-block;
  }
  &--previewing {
    & > button:last-child {
      display: inline-block;
      background-image: url(./assets/previewing.svg);
    }
    &:hover > button:last-child {
      background-image: url(./assets/previewing-hover.svg);
    }
  }
  &--offline {
    color: #747474 !important;
    &::after {
      content: '已离线';
      color: #FFF;
      margin-left: 10px;
      background: #747474;
    }
  }
}
.multi-video-expand__show{
  width:100%;
  &:hover{
    .multi-video-expand__groupSort{
      display: flex;
    }
  }
}
.multi-video-expand__groupSort {
    width: 100%;
    display: none;
    height: 100%;
    align-items: center;
    justify-content: flex-end;
  &--up{
    width: 16px;
    height: 16px;
    font-size: 12px;
    margin-right: 10px;
    background: url(./assets/up.svg) no-repeat;
    &:hover{
      background: url(./assets/up-hover.svg) no-repeat;
    }
  }
  &--down{
    width: 16px;
    height: 16px;
    font-size: 12px;
    background: url(./assets/down.svg) no-repeat;
    &:hover{
      background: url(./assets/down-hover.svg) no-repeat;
    }
  }

}
</style>
