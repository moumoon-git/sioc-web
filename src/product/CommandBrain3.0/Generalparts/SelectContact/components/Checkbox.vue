<template>
  <div :class="$style.Checkbox">
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >{{ title }}</el-checkbox
    >
    <el-checkbox-group
      :class="$style['checkbox-group']"
      v-model="checkedCities"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox v-for="(x, i) in cities" :label="x.id" :key="i">
        {{ x.name }}（{{ x.workUnit }}）
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    listData: {
      type: Array,
      default: () => [],
    },
    cheackAll: {
      type: Boolean,
      default: false,
    },
    deleteData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, contxt) {
    // 多选
    const checkAll = ref<any>(false);
    const checkedCities = ref<any>([]);
    const cities = ref<any>(props.listData);
    const isIndeterminate = ref<any>(false);
    // 向父级传递的数据
    function passToParent() {
      const arr = props.listData.reduce((pre: any, x: any) => {
        checkedCities.value.forEach((ele: any) => {
          if (ele === x.id) {
            pre.push(x);
          }
        });
        return pre;
      }, []);
      const obj = {
        title: props.title,
        arr,
      };
      contxt.emit('handleCheckedChange', obj);
    }
    // 全选
    function handleCheckAllChange(val: any) {
      const checkArr = props.listData.reduce((pre: any, x: any) => {
        pre.push(x.id);
        return pre;
      }, []);
      checkedCities.value = val ? checkArr : [];
      isIndeterminate.value = false;
      checkAll.value = val;
      passToParent();
    }
    // 选择单个
    function handleCheckedCitiesChange(value: any) {
      const checkedCount = value.length;
      checkAll.value = checkedCount === cities.value.length;
      isIndeterminate.value =
        checkedCount > 0 && checkedCount < cities.value.length;
      passToParent();
    }
    watch(
      () => props.listData,
      (newV) => {
        cities.value = newV;
      },
    );
    watch(
      () => props.cheackAll,
      (newV) => {
        handleCheckAllChange(newV);
        checkAll.value = newV;
      },
    );
    watch(checkedCities, (newV) => {
      passToParent();
    });
    watch(
      () => props.deleteData,
      (newV) => {
        checkedCities.value.forEach((ele: any, i: number) => {
          if (newV.id === ele) {
            checkedCities.value.splice(i, 1);
          }
        });
        checkAll.value = false;
      },
    );

    return {
      checkAll,
      checkedCities,
      cities,
      isIndeterminate,
      handleCheckAllChange,
      handleCheckedCitiesChange,
    };
  },
});
</script>

<style lang="scss" module>
.Checkbox {
}
:global(.el-checkbox__inner) {
  background: transparent;
}
:global(.el-checkbox__inner:hover),
:global(.el-checkbox__inner.is-focus),
:global(.el-checkbox__inner.is-focus .el-checkbox__inner) {
  border-color: #00c1de;
}
:global(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #00c1de;
  border-color: #00c1de;
}
:global(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background: #00c1de;
  border-color: #00c1de;
}
:global(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: rgba(255, 255, 255, 0.8);
}
:global(.el-checkbox__label) {
  color: #fff;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding: 5px 0;
  & > label {
    margin: 5px;
    :global(.el-checkbox__label) {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>