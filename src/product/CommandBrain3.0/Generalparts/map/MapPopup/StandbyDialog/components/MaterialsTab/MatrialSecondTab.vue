<template>
  <div :class="$style.secondTab">
    <div :class="$style['search-box']">
      <el-input
        v-model="searchValue"
        placeholder="请输入物资名称检索"
        size="small"
        :class="$style['search-input']"
        @keyup.enter="searchDetail"
      >
        <template #suffix>
          <i
            class="el-input__icon el-icon-search"
            @click="searchDetail"
          />
        </template>
      </el-input>
    </div>
    <div :class="$style['dropDown-box']">
      <el-select
        ref="selectReport"
        v-model="speciesValue"
        :class="$style['el-dropdown-link']"
        placeholder="全部物资类型"
      >
        <el-option style="height:100%;max-height: 245px;overflow: auto;background-color:#fff">
          <el-tree
            ref="InnerTree"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-option>
      </el-select>

      <span>物资种类：{{ bodyParts.typeSize }}</span>
    </div>

    <ul :class="$style.goodsList">
      <li
        v-for="(item, index) in detailList"
        :key="index"
        @click="toDetail(item.id)"
      >
        <img
          :src="imgUrl(item.picPath)"
          alt=""
        >
        <div>
          <div :class="$style['lh-35']">
            <label>物资名称：</label>
            <span :class="$style['text-colr']">{{ item.name }}</span>
          </div>
          <div :class="$style['lh-35']">
            <label>物资类型：</label>
            <span>{{ item.typeName }}</span>
          </div>
          <div :class="$style['lh-35']">
            <label>库存数量：</label>
            <span>{{ item.amount }}{{ item.model }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  name: 'MatrialSecondTab',

  props: {
    bodyParts: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['detailPage'],
  setup(props, { emit }) {
    // 列表详情
    const detailList = ref<any>([]);
    // 列表详情所有
    const allDetailList: any = [];
    // 物资类型树
    const treeData = ref<any>([]);

    // 搜索
    const searchValue = ref<string>('');

    const speciesValue = ref('全部物资类型');
    const { $http } = useGlobal();
    const selectReport = ref<any>(null);
    function toDetail(id: number): void {
      emit('detailPage', id);
    }

    const imgUrl = (url: string) => {
      if (url) {
        return (window as any).config.baseURL + url;
      }
      return require('../../assets/img/empty.png');
    };

    // 获取物资详情列表
    const getResoureArticleList = (id: number) => {
      detailList.value.length = 0;
      const request = {
        method: 'post',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/resoure/resourearticle/list',
        data: {
          endTime: '',
          limit: 10000,
          page: 1,
          resoureArticleStorehouseId: id,
          search: '',
          startTime: '',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          console.log(
            '%c [ response ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            response,
          );
          const { list }: Record<string, any> = response.page;
          allDetailList.push(...list);

          detailList.value.push(...list);
        }
      });
    };
    console.log(props.bodyParts);

    // 获取物资种类树
    const getResourearticletype = () => {
      const request = {
        method: 'get',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/resoure/resourearticletype/tree',
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          treeData.value.push(
            ...[
              {
                name: '全部物资类型',
                children: [...response.tree],
              },
            ],
          );
          console.log(
            '%c [ response ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            treeData,
          );
        }
      });
    };

    getResoureArticleList(props.bodyParts.id);
    getResourearticletype();

    // 点击tree节点选中
    function handleNodeClick(node: any) {
      console.log(node);
      selectReport.value.blur();
      speciesValue.value = node.name;
      detailList.value = node.name === '全部物资类型'
          ? allDetailList
          : allDetailList.filter((item: any) => item.typeName === node.name);
      console.log(detailList, 'newData');
    }

    // 搜索物资
    const searchDetail = () => {
      detailList.value = searchValue.value === ''
          ? allDetailList
          : allDetailList.filter((item: any) => item.name.includes(searchValue.value));
    };

    return {
      searchValue,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      imgUrl,
      selectReport,
      speciesValue,
      detailList,
      treeData,
      toDetail,
      handleNodeClick,
      searchDetail,
    };
  },
});
</script>

<style lang="scss" module>
.secondTab {
  width: 355px;
  .lh-35 {
    line-height: 26px;
  }

  .text-colr {
    color: #00c1de;
  }

  .search-box {
    text-align: center;
    .search-input {
      :global(.el-input__inner) {
        width: 96%;
        background: #014b71;
        opacity: 0.6;
        border: 1px solid #00c1de;
        color: #fff;
      }
    }
  }

  .dropDown-box {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2%;
    .el-dropdown-link {
      :global(.el-input__inner) {
        display: inline-block;
        width: 130px;
        height: 28px;
        border-radius: 14px;
        border: 1px solid #00c1de;
        color: #00c1de;
        text-align: center;
        line-height: 28px;
        cursor: pointer;
        background: transparent;
      }
      :global(.el-select__caret) {
        color: #00c1de;
      }
    }
  }
  .goodsList {
    padding-inline-start: 0;
    width: 92%;
    min-height: 300px;
    margin: 0 auto;
    border: 1px solid #00c1de;
    margin-bottom: 10px;
    padding: 5px;
    max-height: 379px;
    overflow-y: auto;
    li {
      display: flex;
      align-items: center;
      padding: 5px;
      border-bottom: 1px solid #1c3a4c;

      img {
        width: 54px;
        height: 72px;
        margin-right: 5px;
      }
    }
  }
}
</style>
