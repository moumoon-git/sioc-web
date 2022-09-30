<template>
  <div :class="$style.ConterModel">
    <ul :class="$style.ConterModelUlWrap">
      <li
        v-for="(item,index) in modelBtnData"
        :key="index"
        :class="item.active?$style.activeModel:''"
        @click="selectModel(item)"
      >
        <!-- -active triangle-icon -->
        <span
          :class="[$style[`${item.type}-icon`],$style.show]"
        />
        <span
          :class="[$style[`${item.type}-active-icon`],$style.hidden]"
        />
        <!-- 功能名 -->
        <span>{{ item.modelName }}</span>
        <!-- 箭头 -->
        <span
          :class="[$style['triangle-icon'],item.triangleTrant?$style.triangleTrant:'']"
        />
        <!-- 子功能列表 -->
        <ul
          v-show="item.children && item.triangleTrant"
          :class="$style.childrenWrap"
        >
          <li
            v-for="(items,ind) in item.children"
            :key="ind"
            :class="items.active?$style.active:''"
            @click.stop="selectChildModel(items,item)"
          >
            <div
              v-if="item.type === 'other'"
              :class="items.active?$style.other:$style.otherNotAc"
            >
              <div
                :class="[$style[`${items.type}-icon`],$style.othershow]"
              />
              <div
                :class="[$style[`${items.type}-active-icon`],$style.otherhidden]"
              />
            </div>
            <span v-else>{{ items.modelName }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
// 功能菜单数据
import { defineComponent, ref } from 'vue';

const modelBtnDatas = require('./modelBtnData.json');

export default defineComponent({
  setup(props, context) {
    const modelBtnData = ref(modelBtnDatas);
    // 点击大模块
    function selectModel(item:any) {
      const params:any = item;
      //   先记录当前状态
      const stateFlag:boolean = params.triangleTrant;
      modelBtnData.value.forEach((y:any) => {
        const ele:any = y;
        const childArr:any = ele.children.filter((x:any) => x.active);
        // console.log(childArr);
        if (childArr.length !== 0) {
          ele.active = true;
        } else {
          ele.active = false;
        }
        ele.triangleTrant = false;
      });
      params.active = !stateFlag;
      params.triangleTrant = !stateFlag;
    }
    // 清除激活状态
    function clearActiveState() {
      modelBtnData.value.forEach((y:any) => {
        const ele:any = y;
        ele.children.forEach((x:any) => {
          x.active = false;
        });
        ele.active = false;
      });
    }
    // 选择小模块
    function selectChildModel(item:any, items:any) {
      const params:any = item;
      const parent:any = items;
      clearActiveState();
      params.active = true;
      parent.active = true;
      parent.triangleTrant = false;
      //   console.log(item);
      context.emit('selectModel', item);
    }
    return {
      modelBtnData,
      selectModel,
      selectChildModel,
      clearActiveState,
    };
  },
});
</script>

<style lang="scss" module>
.ConterModel{
    width: 100%;
    height: 100%;
    user-select: none;
    ul{
        list-style: none;
        margin: 0;
        padding: 0;
    }
}
.hidden{
    display: none;
}
.ConterModelUlWrap{
    display: flex;
    height: 100%;
    &>li{
        cursor: pointer;
        height: 100%;
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666666;
        &::after{
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
            width: 1px;
            height: 80%;
            background: #E6E6E6;
        }
        &:last-child::after{
            display: none;
        }
        &:hover{
            color: #0091FF;
        }
        &:hover .show{
            display: none;
        }
        &:hover .hidden{
            display: block;
        }
        &>span{
            font-size: 17px;
            font-weight: 400;
        }
    }
    .activeModel{
        color: #0091FF;
        .hidden{
            display: block;
        }
        .show{
            display: none;
        }
    }
}
.childrenWrap{
    position: absolute;
    top: 110%;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 3px 11px 0px rgba(0,0,0,0.1);
    border-radius: 6px;
    li{
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        height: 50px;
        border-radius: 4px 4px 0px 0px;
        color: #666666;
        &:hover{
            color: #0091FF;
            background: rgba(0, 145, 255, .1);
        }
        &>span{
            font-size: 17px;
            font-weight: 500;
        }
    }
    .active{
        color: #0091FF;
        background: rgba(0, 145, 255, .1);
    }
}
.other{
    &>div{
        width: 40px;
        height: 40px;
    }
    .othershow{
        display: none;
    }
    .otherhidden{
        display: block;
    }
}
.otherNotAc{
    &>div{
        width: 40px;
        height: 40px;
    }
    .othershow{
        display: block;
    }
    .otherhidden{
        display: none;
    }
    &:hover .otherhidden{
        display: block;
    }
    &:hover .othershow{
        display: none;
    }
}

@each $animal in
arrow,
doubleArrow,
spot,
line,
noodles,
other {
  .#{$animal}-icon {
    width: 22px;
    height: 22px;
    background-size:100% 100% ;
    background-image: url('./assets/#{$animal}.svg');
  }
  .#{$animal}-active-icon {
    width: 22px;
    height: 22px;
    background-size:100% 100% ;
    background-image: url('./assets/#{$animal}_Active.svg');
  }
}
.triangle-icon{
    width: 8px;
    height: 6px;
    background-size:100% 100% ;
    background-image: url('./assets/triangle.svg');
}
.triangleTrant{
    transform: rotate(180deg);
}
</style>
