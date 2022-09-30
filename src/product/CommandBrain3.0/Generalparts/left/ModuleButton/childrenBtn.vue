<template>
  <div
    v-show="children.length > 2"
    ref="childrenBtn"
    :class="$style.childrenBtn"
    :style="`top:${top}px;left:${left}px;z-index:1;`"
  >
    <!-- 视口 如果做收齐交互时，收起时样式不被挤压-->
    <div>
      <ul :class="$style.childrenBtn_ul">
        <li
          v-for="(item, index) in children"
          :key="index"
          :class="
            (item.activeState ? $style.submoduleActive : '') +
            ' ' +
            $style.submodule
          "
          @click="selectModule(item)"
          :style="{
            'pointer-events':
              item.disable && item.icon !== 'reservePlan_Admin'
                ? 'none'
                : 'all',
            color:
              item.disable && item.icon !== 'reservePlan_Admin' ? '#fff6' : '',
          }"
        >
          <div
            v-if="
              item.parentNode === 'reservePlan' &&
              item.icon !== 'reservePlan_Admin' &&
              item.icon !== 'putAway' &&
              item.disable
            "
            :class="
              $style.iconblock +
              ` icon-${item.icon}_not ` +
              (item.transform ? $style.transform : '')
            "
          />
          <div
            v-else
            :class="
              $style.iconblock +
              ` icon-${item.icon} ` +
              (item.transform ? $style.transform : '')
            "
          />
          <div
            :class="
              $style.iconhidden +
              ` icon-${item.icon}Active ` +
              (item.transform ? $style.transform : '')
            "
          />
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    childrenData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      children: [],
      parentNode: '',
    };
  },
  watch: {
    childrenData(newVal: any) {
      // console.log(newVal);
      if (newVal.children) {
        (this as any).btnLocation(newVal);
      }
    },
  },
  methods: {
    // 选择功能模块
    selectModule(item: any) {
      const items = item;
      if (items.type === 'putAway') {
        (this as any).children = [];
      } else {
        (this as any).children.forEach((ele: any) => {
          // eslint-disable-next-line no-param-reassign
          ele.activeState = false;
        });
        items.activeState = true;
      }
      items.parentNode = (this as any).parentNode;
      (this as any).$emit('selectModule', items);
    },
    // 按钮位置
    btnLocation(obj: any) {
      // 子功能位置计算，当它的子功能length * 子功能 + top，超过了ulEle的高度时，就要换个方向显示
      const ulH = obj.ulEle.offsetHeight;
      let { top } = obj;
      const childData = JSON.parse(JSON.stringify(obj.children));
      (this as any).left = obj.left;
      // 判断  子模块加收起按钮加起来的高度大于 母功能块的高度？
      // 默认的高度 60
      const childHeight = childData.length * 60;
      const flag = childHeight + 70 + top > ulH;
      const putAwayObj: any = {
        name: '收起',
        icon: 'putAway',
        type: 'putAway',
        activeState: false,
      };
      if (flag) {
        putAwayObj.transform = true;
        childData.push(putAwayObj);
        // 重新计算位置距离
        top = top - childHeight - 12;
      } else {
        childData.unshift(putAwayObj);
      }
      childData.forEach((e: any) => {
        e.parentNode = obj.parentNode;
      });
      (this as any).parentNode = obj.parentNode;
      (this as any).top = top;
      (this as any).children = childData;
    },
  },
};
</script>

<style module >
.childrenBtn {
  position: absolute;
  width: 65px;
  /*  height: 391px; */
  background: rgba(0, 36, 60, 0.82);
  border: 1px solid #00ecff;
  padding-top: 10px;
}
.childrenBtn div {
  width: 100%;
  text-align: center;
}
.childrenBtn_ul {
  list-style: none;
  padding: 0;
}
.submodule {
  color: #fff;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 15px;
}
.submodule div {
  width: 25px;
  height: 25px;
  margin: auto;
}
.submodule:hover {
  color: #00ecff;
}
.iconhidden {
  display: none;
}
.submodule:hover .iconhidden,
.submoduleActive .iconhidden {
  display: block;
}
.submodule:hover .iconblock,
.submoduleActive .iconblock {
  display: none;
}
.submoduleActive {
  color: #00ecff;
}
.transform {
  transform: rotate(180deg);
}
</style>

<style lang="scss">
.icon-hidden {
  display: none;
}
@each $animal in putAway, filghtPatrol_Inspection, filghtPatrol_record,
  filghtPatrol_grouping, filghtPatrol_resources, reservePlan_Admin,
  reservePlan_Document, reservePlan_Structure, reservePlan_Announce,
  reservePlan_Info, reservePlan_Scene, reservePlan_Sign, currentOnline,
  DynamicFollow
{
  .icon-#{$animal} {
    background: url('./assets/#{$animal}.svg') no-repeat;
    background-size: 100% 100%;
  }
  .icon-#{$animal}Active {
    background: url('./assets/#{$animal}_Active.svg') no-repeat;
    background-size: 100% 100%;
  }
}
@each $animal in reservePlan_Document, reservePlan_Structure,
  reservePlan_Announce, reservePlan_Info, reservePlan_Scene, reservePlan_Sign
{
  .icon-#{$animal}_not {
    background: url('./assets/#{$animal}_not.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
