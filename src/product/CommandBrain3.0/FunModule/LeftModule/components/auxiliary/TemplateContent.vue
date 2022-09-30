<template>
  <div :class="$style.TemplateContent">
    <!-- 上面按钮 -->
    <header>
      <ul>
        <li
          v-for="(x, i) in btnData"
          :key="i"
          :class="x.active ? $style['li-active'] : ''"
          @click="select(x)"
        >
          {{ x.name }}
        </li>
      </ul>
    </header>
    <!-- 底下显示 -->
    <main>
      <ul
        v-if="renderData && renderData.length !== 0"
        :class="$style[`${type}Ul`]"
      >
        <li
          v-for="(x, i) in renderData"
          :key="i"
          :class="x.active ? $style['main-ul-li-active'] : ''"
          @click="selectTemplate(x)"
        >
          <!-- 用来给点展示图片的 -->
          <img v-if="type === 'spot' && x.src" :src="x.src" alt="" />
          <!-- 用来给线展示样式 -->
          <div
            v-else-if="type === 'line'"
            :style="{
              width: '100%',
              opacity: x.stylePropertyJson
                ? x.stylePropertyJson.fillOpacity
                : 1,
              borderTop: `${
                x.stylePropertyJson ? x.stylePropertyJson.lineHeight : 1
              }px
              ${
                x.stylePropertyJson
                  ? x.stylePropertyJson.lineType === 0
                    ? 'dashed'
                    : 'solid'
                  : 'solid'
              }
              ${x.stylePropertyJson ? x.stylePropertyJson.fillColor : ''}`,
            }"
          />
          <!-- 用来给面展示样式 -->
          <div
            v-else-if="type === 'noodles'"
            :style="{
              width: '100%',
              opacity: x.stylePropertyJson
                ? x.stylePropertyJson.fillOpacity
                : 1,
              background: x.stylePropertyJson
                ? x.stylePropertyJson.fillColor
                : '',
              border: `${
                x.stylePropertyJson ? x.stylePropertyJson.lineHeight : 1
              }px
              ${
                x.stylePropertyJson
                  ? x.stylePropertyJson.lineType === 0
                    ? 'dashed'
                    : 'solid'
                  : 'solid'
              }
              ${x.stylePropertyJson ? x.stylePropertyJson.strokeColor : ''}`,
            }"
          />
          <!-- 用来给其他图形展示样式 -->
          <div v-else-if="type === 'other'">
            <svg
              v-if="x.d"
              :width="`${x.wd}px`"
              :height="`${x.hg}px`"
              :viewBox="`0 0 ${x.wd} ${x.hg}`"
              version="1.1"
              style="zoom: 1.5"
            >
              <title>形状结合</title>
              <g
                id="PC端"
                :stroke="x.stylePropertyJson.strokeColor"
                :stroke-width="x.stylePropertyJson.lineHeight"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="切图"
                  :transform="x.transform"
                  :stroke="x.stylePropertyJson.strokeColor"
                  :stroke-width="x.stylePropertyJson.lineHeight"
                >
                  <path id="形状结合" :d="x.d" :transform="x.pathTransform" />
                </g>
              </g>
            </svg>
          </div>
          <span>{{ x.className }}</span>
          <!-- 激活时显示的三角形 -->
          <div />
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    // 模板渲染的数据  ☆
    renderData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: any, context) {
    // 当前的类型
    const type = ref('spot');
    // 按钮数据
    const btnData = ref([
      {
        name: '点',
        type: 'spot',
        active: true,
        id: 0,
      },
      {
        name: '线',
        type: 'line',
        active: false,
        id: 2,
      },
      {
        name: '面',
        type: 'noodles',
        active: false,
        id: 1,
      },
      {
        name: '其他',
        type: 'other',
        active: false,
        id: 3,
      },
    ]);
    // 其他图形
    function other(params: any) {
      const renderDatas: any = params.reduce((pre: any, x: any) => {
        // 只有双箭头和 单箭头
        for (let i = 0; i < 2; i++) {
          if (i === 0) {
            x.wd =
              31 +
              x.stylePropertyJson.lineHeight +
              x.stylePropertyJson.lineHeight / 2;
            x.hg =
              22 +
              x.stylePropertyJson.lineHeight +
              x.stylePropertyJson.lineHeight / 2;
            x.modelType = 'doubleArrow';
            x.transform = `translate(${-66 + x.stylePropertyJson.lineHeight}, ${
              -130 + x.stylePropertyJson.lineHeight
            })`;
            x.d =
              'M67.0029382,152 C66.8598509,141.258448 71.9856364,136.44333 73.0361507,134.838291 L69.8393269,134.56931 L76.4412662,131 L78.355738,138.002359 L75.7185848,136.639757 L75.6515692,137.021994 C74.4815136,146.443415 77.915384,146.838162 79.8898512,147.007921 L81.5000361,146.999073 C83.8282535,146.999073 88.5439159,146.638072 87.348503,137.021994 L87.2814875,136.639757 L84.6443342,138.002359 L86.558806,131 L93.1607453,134.56931 L89.9639215,134.838291 C91.0144358,136.44333 96.1384101,141.258448 95.997134,152';
            pre.push(x);
          } else {
            const obj = {
              ...x,
              wd:
                17 +
                x.stylePropertyJson.lineHeight +
                x.stylePropertyJson.lineHeight / 2,
              hg:
                25 +
                x.stylePropertyJson.lineHeight +
                x.stylePropertyJson.lineHeight / 2,
              modelType: 'arrow',
              transform: `translate(${-26 + x.stylePropertyJson.lineHeight}, ${
                -89 + x.stylePropertyJson.lineHeight
              })`,
              d: 'M22.455,93.6097141 L34.0619747,97.0557066 L34.0621085,93.8276533 L46.1508902,101.5 L34.0621086,109.172347 L34.0619747,105.943243 L22.455,109.390236 L22.455,93.6097141 Z',
              pathTransform:
                'translate(34.500000, 101.500000) rotate(-90.000000) translate(-34.500000, -101.500000)',
            };
            pre.push(obj);
          }
        }
        return pre;
      }, []);
      return renderDatas;
    }
    // 渲染的数据
    // const renderData = ref([
    //   {
    //     iconUrl: '/fileupload/attach/plotting/2021-04/20210429105927433_collect.svg',
    //     relatedId: 11,
    //     basicClassId: 26,
    //     className: '面分类1',
    //     stylePropertyJson: {
    //       fillColor: '#F66E6E',
    //       fillOpacity: 0.35,
    //       lineType: 0,
    //       lineHeight: 2,
    //       strokeColor: '#0091FF',
    //     },
    //   },
    // ]);
    // 类型选择
    function select(params: any) {
      console.log(params);
      btnData.value.map((x: any) => {
        x.active = false;
      });
      params.active = true;
      type.value = params.type;
      const obj = {
        moduleType: 'btn',
        type: params.type,
        data: params,
      };
      context.emit('sendMsg', obj);
    }
    // 选择模板方法
    function selectTemplate(params: any) {
      props.renderData.forEach((ele: any) => {
        ele.active = false;
      });
      params.active = true;
      console.log(params);
      let types = type.value;
      if (type.value === 'other') {
        types = params.modelType;
      }
      if (params.stylePropertyJson && !params.stylePropertyJson.src) {
        params.stylePropertyJson.iconUrl = params.iconUrl;
        params.stylePropertyJson.src = params.src;
      }
      const obj = {
        moduleType: 'selectTemplate',
        type: types,
        data: params,
      };
      context.emit('sendMsg', obj);
    }
    watch(
      () => props.renderData,
      (newV) => {
        if (type.value === 'other') {
          context.emit('update:renderData', other(props.renderData));
        }
      },
    );
    return {
      // 按钮数据
      btnData,
      // 选择按钮
      select,
      // 当前选择类型
      type,
      // 选择模板方法
      selectTemplate,
    };
  },
});
</script>

<style lang="scss" module>
.TemplateContent {
  width: 100%;
  height: calc(100% - 50px);
  // max-height: 195px;
  // min-height: 195px;
  box-sizing: border-box;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  header {
    padding: 0 22px;
    ul {
      display: flex;
      justify-content: space-between;
      li {
        flex: 1;
        border: 1px solid #00c1de;
        height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        margin-right: 10px;
        text-align: center;
        cursor: pointer;
        &:last-child {
          margin: 0;
        }
      }
      .li-active {
        background: url('../../assets/activeBgr.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  main {
    flex: 1;
    padding: 0 0 0 22px;
    // max-height: 226px;
    max-height: calc(100% - 26px);
    overflow-y: auto;
    overflow-x: hidden;
    ul {
      display: flex;
      padding: 13px 0 0 0;
      flex-wrap: wrap;
      li {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 20px;
        position: relative;
        color: #ffffff;
        img {
          width: 28px;
          height: 34px;
          margin-bottom: 2px;
        }
        & > div:last-child {
          position: absolute;
          bottom: -7px;
          left: 0;
          right: 0;
          margin: auto;
          width: 12px;
          height: 7px;
          display: none;
          background: url('./assets/auxiliary/triangle.svg') no-repeat;
          background-size: 100% 100%;
        }
      }
      .main-ul-li-active {
        font-size: 12px;
        font-weight: 400;
        color: #56e9ff;
        & > div:last-child {
          display: block;
        }
      }
    }
    .spotUl {
      li {
        min-width: 70px;
        max-width: 70px;
      }
    }
    .lineUl {
      li {
        max-width: 100px;
        min-width: 100px;
        margin-right: 26px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        & > div:first-child {
          margin: 12px 0;
        }
      }
    }
    .noodlesUl {
      li {
        max-width: 70px;
        min-width: 72px;
        margin-right: 20px;
        &:nth-child(4n) {
          margin-right: 0;
        }
        & > div:first-child {
          height: 28px;
        }
      }
    }
    .otherUl {
      li {
        max-width: 70px;
        min-width: 72px;
        margin-right: 20px;
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
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
</style>
