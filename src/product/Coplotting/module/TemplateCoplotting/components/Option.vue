<template>
  <div :class="$style.Option">
    <header>
      <el-button
        v-for="(item, index) in btnListData"
        :key="index"
        :class="item.active ? $style.activeBtn : ''"
        @click="cancelDraw(item)"
      >
        {{ item.name }}
      </el-button>
    </header>
    <main>
      <!-- 根据类型去加载图标还是线、面 -->
      <ul :class="selfType !== 'spot' ? $style.lineWrap : ''">
        <li
          v-for="(item, index) in mainData"
          :key="index"
          :class="item.active ? $style['lineWrap_ul_li_active'] : ''"
          @click="select(item)"
        >
          <img v-if="selfType === 'spot'" :src="item.url" alt="" />
          <div
            v-else-if="selfType === 'line'"
            :style="{
              'border-top': `${
                item.stylePropertyJson
                  ? item.stylePropertyJson.lineHeight
                    ? item.stylePropertyJson.lineHeight
                    : 1
                  : 1
              }px ${
                item.stylePropertyJson
                  ? item.stylePropertyJson.lineType === 1
                    ? 'solid'
                    : 'dashed'
                  : 'dashed'
              } ${
                item.stylePropertyJson
                  ? item.stylePropertyJson.fillColor
                  : '#000'
              } `,
            }"
          />
          <div
            v-else-if="selfType === 'noodles'"
            :style="{
              border: `${
                item.stylePropertyJson
                  ? item.stylePropertyJson.lineHeight
                    ? item.stylePropertyJson.lineHeight
                    : 1
                  : 1
              }px ${
                item.stylePropertyJson
                  ? item.stylePropertyJson.lineType === 1
                    ? 'solid'
                    : 'dashed'
                  : 'dashed'
              } ${
                item.stylePropertyJson
                  ? item.stylePropertyJson.strokeColor
                  : '#000'
              } `,
              height: '20px',
              background: item.stylePropertyJson
                ? item.stylePropertyJson.fillColor
                : '',
            }"
          />
          <!-- 其他图形 -->
          <div v-else>
            <svg
              v-if="item.d"
              :width="`${item.wd}px`"
              :height="`${item.hg}px`"
              :viewBox="`0 0 ${item.wd} ${item.hg}`"
              version="1.1"
              style="zoom: 1.5"
            >
              <title>形状结合</title>
              <g
                id="PC端"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="切图"
                  :transform="item.transform"
                  :stroke="item.color"
                  :stroke-width="item.stylePropertyJson.lineHeight"
                >
                  <path
                    id="形状结合"
                    :d="item.d"
                    :transform="item.pathTransform"
                  />
                </g>
              </g>
            </svg>
          </div>
          <span>{{ item.className }}</span>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';

export default defineComponent({
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const reqData: any = ref({});
    const btnType: any = ref({});
    // 按钮数据
    const btnListData = ref([
      {
        name: '点分类',
        type: 'spot',
        active: true,
        id: 0,
      },
      {
        name: '线分类',
        type: 'line',
        active: false,
        id: 2,
      },
      {
        name: '面分类',
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
    // 当前类型
    const selfType = ref('spot');
    // 主要数据
    const mainData = ref([
      // {
      //   name: '停车场',
      //   active: false,
      //   color: '#f00',
      //   d: '',
      // },
      // {
      //   name: '单箭头',
      //   active: false,
      //   color: '#f00',
      //   wd: 17,
      //   hg: 25,
      //   modelType: 'arrow',
      //   transform: 'translate(-26.000000, -89.000000)',
      //   d: 'M22.455,93.6097141 L34.0619747,97.0557066 L34.0621085,93.8276533 L46.1508902,101.5 L34.0621086,109.172347 L34.0619747,105.943243 L22.455,109.390236 L22.455,93.6097141 Z',
      //   pathTransform: 'translate(34.500000, 101.500000) rotate(-90.000000) translate(-34.500000, -101.500000)',
      // },
      // {
      //   name: '双箭头',
      //   active: false,
      //   color: '#f00',
      //   wd: 31,
      //   hg: 22,
      //   modelType: 'doubleArrow',
      //   transform: 'translate(-66.000000, -130.000000)',
      //   d: 'M67.0029382,152 C66.8598509,141.258448 71.9856364,136.44333 73.0361507,134.838291 L69.8393269,134.56931 L76.4412662,131 L78.355738,138.002359 L75.7185848,136.639757 L75.6515692,137.021994 C74.4815136,146.443415 77.915384,146.838162 79.8898512,147.007921 L81.5000361,146.999073 C83.8282535,146.999073 88.5439159,146.638072 87.348503,137.021994 L87.2814875,136.639757 L84.6443342,138.002359 L86.558806,131 L93.1607453,134.56931 L89.9639215,134.838291 C91.0144358,136.44333 96.1384101,141.258448 95.997134,152',
      // },
      // {
      //   name: '双箭头',
      //   active: false,
      //   modelType: 'doubleArrow',
      //   color: '#0091FF',
      //   wd: 31,
      //   hg: 22,
      //   transform: 'translate(-66.000000, -130.000000)',
      //   d: 'M67.0029382,152 C66.8598509,141.258448 71.9856364,136.44333 73.0361507,134.838291 L69.8393269,134.56931 L76.4412662,131 L78.355738,138.002359 L75.7185848,136.639757 L75.6515692,137.021994 C74.4815136,146.443415 77.915384,146.838162 79.8898512,147.007921 L81.5000361,146.999073 C83.8282535,146.999073 88.5439159,146.638072 87.348503,137.021994 L87.2814875,136.639757 L84.6443342,138.002359 L86.558806,131 L93.1607453,134.56931 L89.9639215,134.838291 C91.0144358,136.44333 96.1384101,141.258448 95.997134,152',
      // },
    ]);
    // 根据选择的类型发起请求
    function typeSelection() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assisttemplatebasicclassrelated/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          type: btnType.value.id || 0,
          templateTypeId: reqData.value.id || 0,
        },
      };
      $http(request).then((res: any) => {
        // console.log(res);
        if (res.code === 0 && res.data) {
          // console.log(res.data);
          let renderData = [];
          const data = res.data.reduce((pre: any, x: any) => {
            x.url = (window as any).config.baseURL + x.iconUrl;
            x.color = x.stylePropertyJson
              ? x.stylePropertyJson.strokeColor
                ? x.stylePropertyJson.strokeColor
                : x.stylePropertyJson.fillColor
              : '';
            pre.push(x);
            return pre;
          }, []);
          if (btnType.value.id === 3) {
            renderData = data.reduce((pre: any, x: any) => {
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
                  x.transform = `translate(${
                    -66 + x.stylePropertyJson.lineHeight
                  }, ${-130 + x.stylePropertyJson.lineHeight})`;
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
                    transform: `translate(${
                      -26 + x.stylePropertyJson.lineHeight
                    }, ${-89 + x.stylePropertyJson.lineHeight})`,
                    d: 'M22.455,93.6097141 L34.0619747,97.0557066 L34.0621085,93.8276533 L46.1508902,101.5 L34.0621086,109.172347 L34.0619747,105.943243 L22.455,109.390236 L22.455,93.6097141 Z',
                    pathTransform:
                      'translate(34.500000, 101.500000) rotate(-90.000000) translate(-34.500000, -101.500000)',
                  };
                  pre.push(obj);
                }
              }
              return pre;
            }, []);
          } else {
            renderData = data;
          }
          console.log(renderData);
          mainData.value = renderData;
        }
      });
    }
    // 选择了某个模板
    function selectTemplate() {
      props.listData.forEach((ele: any) => {
        if (ele.active) {
          reqData.value = ele;
        }
      });
      typeSelection();
    }
    // 点击了按钮
    function cancelDraw(params: any) {
      btnListData.value.forEach((x: any) => {
        const ele: any = x;
        ele.active = false;
      });
      selfType.value = params.type;
      params.active = true;
      btnType.value = params;
      selectTemplate();
      // console.log(params);
    }
    // 选中
    function select(params: any) {
      // console.log(params);
      const data: any = params;
      mainData.value.forEach((x: any) => {
        const ele: any = x;
        ele.active = false;
      });
      data.active = true;
      data.type = selfType.value;
      if (selfType.value === 'spot') {
        data.src = params.url;
      }
      context.emit('option', data);
    }
    return {
      selectTemplate,
      reqData,
      btnListData,
      selfType,
      mainData,
      cancelDraw,
      select,
    };
  },
});
</script>

<style lang="scss" module>
.Option {
  width: 100%;
  height: 100%;
  header {
    display: flex;
    justify-content: center;
    height: 42px;
    button {
      width: 112px;
      height: 42px;
      line-height: 42px;
      padding: 0 30px;
      margin-left: 8px;
      &:first-child {
        margin: 0 !important;
      }
    }
  }
  main {
    height: calc(100% - 42px);
    background: url('../assets/dropdown_basic.svg');
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      padding: 0 20px;
      li {
        width: 96px;
        margin-top: 28px;
        font-size: 17px;
        font-weight: 400;
        color: #333333;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        flex-direction: column;
        position: relative;
        padding-bottom: 8px;
        &:hover {
          color: rgba(0, 145, 255, 1);
        }
        & > img {
          width: 40px;
          height: 48px;
          margin-bottom: 3px;
        }
      }
    }
    .lineWrap {
      li {
        width: 100px;
        margin-right: 28px;
        &:nth-child(4n) {
          margin-right: 0;
        }
        & > div {
          width: 97px;
          // height: 42px;
          display: flex;
          justify-content: center;
        }
      }
      .lineWrap_ul_li_active {
        color: rgba(0, 145, 255, 1);
        &::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          right: 0;
          margin: auto;
          width: 1px;
          border: 8px solid transparent;
          border-bottom: 8px solid #0091ff;
        }
      }
    }
  }
}
.activeBtn {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>
