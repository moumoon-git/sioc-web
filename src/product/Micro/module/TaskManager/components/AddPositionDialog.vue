<template>
  <el-button
    class="sbs-button"
    type="plain"
    :disabled="disabled"
    @click="openPopup"
  >
    选择{{ title }}
  </el-button>
  <div
    v-if="modelValue.length"
    :class="$style.inline"
  >
    <el-tag
      v-for="(item, index) in modelValue ?? []"
      :key="index"
      :class="$style.margin"
    >
      {{ item?.groupType === 467 ? '负责人' : '联络人' }}({{ item.name ?? '' }})
    </el-tag>
  </div>
  <el-dialog
    v-model="visible"
    :width="multiple ? 1117 : 755"
    :title="`选择${title}`"
    custom-class="sbs-dialog"
  >
    <div
      v-loading="isLoading"
      :class="$style.frame"
    >
      <!-- 左边 -->
      <div :class="$style.left">
        <!-- 通讯录树 -->
        <el-tree
          :data="treeData"
          :props="{
            label: 'name',
            children: 'children',
          }"
          node-key="id"
          @node-click="handleLeftListClick"
        />
      </div>
      <!-- 中间 -->
      <div :class="$style.middle">
        <div :class="$style.header">
          <span :class="$style.text">
            {{ currTree?.name || '' }}
          </span>
          <el-button
            type="text"
            :class="$style.allMiddle"
            @click="chooseRespond=true,chooseContact=true,pushIn(chooseRespond, 467),pushIn(chooseContact, 468)"
          >
            全选
          </el-button>
        </div>
        <!-- 负责人 -->
        <el-checkbox
          v-if="multiple"
          v-model="chooseRespond"
          :disabled="!respondList.length"
          @change="pushIn(chooseRespond, 467)"
        >
          负责人
        </el-checkbox>
        <el-button
          v-else
          class="sbs-button"
          :disabled="!respondList.length"
          @click="chooseRespond = true,pushIn(chooseRespond, 467)"
        >
          负责人
        </el-button>
        <section v-if="respondList.length">
          <div
            v-for="item in respondList"
            :key="item.id"
            :class="$style.listStyle"
          >
            <!-- label -->
            <div :class="$style.highLabel">
              <p>{{ item.labelName ?? '-' }}</p>
            </div>
            <!-- 名字 -->
            <span>
              {{ item.name ?? '-' }}({{ `${item.workUnit ?? '-'}/${item.position ?? '-'}` }})
            </span>
          </div>
        </section>
        <section v-else>
          暂无数据
        </section>
        <!-- 联络人 -->
        <el-checkbox
          v-if="multiple"
          v-model="chooseContact"
          :disabled="!contactList.length"
          @change="pushIn(chooseContact, 468)"
        >
          联络人
        </el-checkbox>
        <el-button
          v-else
          class="sbs-button"
          :disabled="!contactList.length"
          @click="chooseContact = true,pushIn(chooseContact, 468)"
        >
          联络人
        </el-button>
        <section v-if="contactList.length">
          <div
            v-for="item in contactList"
            :key="item?.id"
            :class="$style.listStyle"
          >
            <!-- label -->
            <div :class="$style.lowLabel">
              <p>{{ item.labelName ?? '-' }}</p>
            </div>
            <!-- 名字 -->
            <span>
              {{ item.name ?? '-' }}({{ `${item.workUnit ?? '-'}/${item.position ?? '-'}` }})
            </span>
          </div>
        </section>
        <section v-else>
          暂无数据
        </section>
      </div>
      <!-- 右边 -->
      <div
        v-if="multiple"
        :class="$style.right"
      >
        已选择({{ chooseGroup.length }})
        <el-button
          type="text"
          :class="$style.clearRight"
          @click="chooseGroup=[],chooseRespond=false,chooseContact=false,pushIn(chooseRespond, 467),pushIn(chooseContact, 468)"
        >
          全部清除
        </el-button>
        <div
          v-for="item in chooseGroup"
          :key="item?.id"
          :class="$style.listStyle"
        >
          <div :class="item?.groupType === 467 ? $style.highLabel : $style.lowLabel">
            <p>{{ item?.groupType === 467 ? '负责人' : '联络人' }}</p>
          </div>
          <span>
            {{ item.name ?? '-' }}
          </span>
          <div
            :class="$style.listIcon"
            @click="deleteMan(item)"
          />
        </div>
      </div>
      <!-- 按钮 -->
      <el-button
        v-if="multiple"
        type="primary"
        class="sbs-button"
        :class="$style.footer"
        @click="commit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

interface CurrTreeType {
  name: string,
  id: number,
}

interface ChooseType {
  name: string | undefined,
  id: number | undefined,
  groupType: number | undefined,
}

export default defineComponent({
  name: 'AddPositionDialog',
  props: {
    // 按钮是否可点击
    disabled: {
      type: Boolean,
      default: false,
    },
    // 标题
    title: {
      type: String,
      default: '负责岗位',
    },
    modelValue: {
      type: [Object, Array],
      required: true,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['getAllMembers'],
  setup(prop, { emit }) {
    const visible = ref(false); // 弹窗可视化
    const isLoading = ref(0); // 加载中
    const keyword = ref(''); // 搜索关键词
    const treeData = ref<any[]>([]); // 通讯录树
    const currTree = ref<null | CurrTreeType>(null); // 当前左树节点
    const respondList = ref<any[]>([]); // 负责人
    const contactList = ref<any[]>([]); // 联络人
    const chooseGroup = ref<ChooseType[]>([]); // 已选择的所有组
    const chooseRespond = ref(false); // 勾选负责人
    const chooseContact = ref(false); // 勾选联络人
    // 左数据初始化
    function getLeftList() {
      isLoading.value = 1;
      // 通讯录
      const request: any = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/list?platformId=',
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = response?.data || [];
        }
      }).finally(() => {
        isLoading.value = 0;
      });
    }
    // 开窗
    function openPopup() {
      visible.value = true;
      currTree.value = null;
      respondList.value = [];
      contactList.value = [];
      chooseGroup.value = [];
      chooseRespond.value = false;
      chooseContact.value = false;
      getLeftList();
    }
    // 右数据靠左得
    function handleLeftListClick(data: any) {
      chooseRespond.value = false;
      chooseContact.value = false;
      currTree.value = data;
      isLoading.value = 1;
      $http({
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/getGroupManageEvent',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        data: {
          Ids: [data.id],
        },
      }).then((response: any) => {
        if (response.code === 0) {
          respondList.value = [];
          contactList.value = [];
          if (response.data) {
            response.data.forEach((el:any) => {
              el.groupResponsibleTypeList.forEach((ele:any) => {
                if (ele.malicontactorList) {
                  ele.malicontactorList.forEach((elem:any) => {
                    elem.label = '负责人'; // 决定底色用绿色
                    elem.labelName = el.name; // 具体岗位名字
                    elem.groupId = el.id;
                    respondList.value.push(elem);
                  });
                }
              });
              el.groupContactorTypeList.forEach((ele:any) => {
                if (ele.malicontactorList) {
                  ele.malicontactorList.forEach((elem:any) => {
                    elem.label = '联络人'; // 决定底色用蓝色
                    elem.labelName = el.name; // 具体岗位名字
                    elem.groupId = el.id;
                    contactList.value.push(elem);
                  });
                }
              });
            });
          }
        }
      }).finally(() => {
        isLoading.value = 0;
      });
    }
    /**
      * @description
      * @param {boolean} whichButton 负责人还是联络人按钮
      * @param {number} type 467，468
    */
    function pushIn(whichButton: boolean, type: number) {
      if (whichButton) {
        if (chooseGroup.value.filter((item:any) => item.id === currTree.value?.id && item.groupType === type).length) {
          // 避免全选时重复
        } else {
          chooseGroup.value.push({
            name: currTree.value?.name,
            id: currTree.value?.id,
            groupType: type,
          });
        }
      } else {
        const currentChooseArr = chooseGroup.value.filter((item:any) => item.id === currTree.value?.id && item.groupType !== type);
        const otherChooseArr = chooseGroup.value.filter((item:any) => item.id !== currTree.value?.id);
        chooseGroup.value = currentChooseArr.concat(otherChooseArr);
      }
      if (!prop.multiple) { // 单选
        // 关窗
        visible.value = false;
        // 所有选的人
        emit('getAllMembers', chooseGroup.value, prop.title);
      }
    }
    // 右边叉
    function deleteMan(el:any) {
      if (el.groupType === 467) {
        chooseRespond.value = false;
        pushIn(chooseRespond.value, 467);
      } else if (el.groupType === 468) {
        chooseContact.value = false;
        pushIn(chooseContact.value, 468);
      }
    }
    // 点击确定
    function commit() {
      // 关窗
      visible.value = false;
      // 所有选的人
      emit('getAllMembers', chooseGroup.value, prop.title);
    }
    return {
      chooseGroup,
      visible,
      keyword,
      chooseRespond,
      chooseContact,
      treeData,
      pushIn,
      currTree,
      respondList,
      contactList,
      deleteMan,
      openPopup,
      commit,
      getLeftList,
      handleLeftListClick,
    };
  },
});
</script>

<style lang="scss" module>
@mixin label {
  padding: 0px 8px;
  border-radius: 10px;
  display: inline-block;
  margin: 0px 10px;
  p {
    color: #fff;
    text-align: center;
    font-size: 12px;
    margin: 0px;
    line-height: 25px;
  }
}
@mixin publicListStyle {
  background: #f2f2f2;
  margin: 10px 0;
  padding: 2px;
  position: relative;
  border-radius: 3px;
  .highLabel {
    background: #0BD295;
    @include label;
  }
  .lowLabel {
    background: #00C1DE;
    @include label;
  }
  .listText {
    display: inline-block;
  }
  .listIcon {
    background: url(../assets/close.svg) no-repeat #89c4f0 center;
    background-size: 38%;
    width: 26px;
    height: 26px;
    border-radius: 50px;
    float: right;
    margin-top: 8px;
  }
}
.inline {
  display: inline-block;
}
.margin {
  margin-left: 10px;
}
.frame {
  position: relative;
  .left {
    overflow: auto;
    width: 330px;
    height: 65vh;
    border: 1px solid #f2f2f2;
    position: relative;
    margin-left: 20px;
    margin-top: 20px;
    display: inline-block;
    padding: 10px;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #f2f2f2;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .middle {
    overflow: auto;
    width: 330px;
    height: 65vh;
    border: 1px solid #f2f2f2;
    position: relative;
    margin-left: 10px;
    margin-top: 20px;
    display: inline-block;
    padding: 10px;
    .header {
      position: relative;
      height: 40px;
      .text {
        font-weight: 700;
        float: left;
      }
      .allMiddle {
        float: right;
      }
    }
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #f2f2f2;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    // 负责人勾选框
    .respondCheck {
      margin: 10px 0px 0px -10px;
    }
    .respondCheck .checkBox {
      visibility: hidden;
    }
    .respondCheck .checkBox + .checkIcon {
      color: #fff;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid #a6adb4;
      display: inline-block;
      visibility: visible;
      padding-left: 0px;
      text-align: center;
      content: " ";
      box-sizing: border-box;
      line-height: 16px;
      margin-top: 3px;
      cursor: pointer;
    }
    .respondCheck .checkBox[type="checkbox"]:checked + .checkIcon {
      background-color: #56e9ff;
      border: none;
      content: "✓";
      font-size: 14px;
      color: #000;
    }
    // 联络人勾选框
    .contactCheck {
      margin: 10px 0px 0px -10px;
    }
    .contactCheck .checkBox {
      visibility: hidden;
    }
    .contactCheck .checkBox + .checkIcon {
      color: #fff;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid #a6adb4;
      display: inline-block;
      visibility: visible;
      padding-left: 0px;
      text-align: center;
      content: " ";
      box-sizing: border-box;
      line-height: 16px;
      margin-top: 3px;
      cursor: pointer;
    }
    .contactCheck .checkBox[type="checkbox"]:checked + .checkIcon {
      background-color: #56e9ff;
      border: none;
      content: "✓";
      font-size: 14px;
      color: #000;
    }
    // 列表样式
    .listStyle {
      @include publicListStyle;
    }
  }
  .right {
    overflow: auto;
    width: 330px;
    height: 65vh;
    border: 1px solid #f2f2f2;
    position: relative;
    margin-left: 10px;
    margin-top: 20px;
    display: inline-block;
    padding: 10px;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #f2f2f2;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    // 列表样式
    .listStyle {
      @include publicListStyle;
    }
    .clearRight {
      // margin: 10px;
      float: right;
    }
  }
  .footer {
    right: 23px;
    position: absolute;
    bottom: 18px;
  }
}
</style>
