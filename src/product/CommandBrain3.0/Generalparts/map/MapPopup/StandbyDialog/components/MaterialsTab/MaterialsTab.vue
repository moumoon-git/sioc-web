<template>
  <div :class="$style['materials-Tab']">
    <main>
      <el-tabs
        v-show="!isDetail"
        v-model="activeName"
      >
        <el-tab-pane
          :lazy="true"
          label="基本信息"
          name="first"
        >
          <MatrialFirstTab v-bind="$attrs" />
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="物资清单"
          name="second"
        >
          <MatrialSecondTab
            v-bind="$attrs"
            @detailPage="goDetail"
          />
        </el-tab-pane>
      </el-tabs>
      <MaterialsDetailList
        v-show="isDetail"
        :material-detail="materialDetail"
        @back="isDetail = false"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import MatrialFirstTab from './MatrialFirstTab.vue';
import MatrialSecondTab from './MatrialSecondTab.vue';
import MaterialsDetailList from './MaterialsDetailList.vue';

export default defineComponent({
  name: 'MaterialsTab',

  components: {
    MatrialFirstTab,
    MatrialSecondTab,
    MaterialsDetailList,
  },

  setup(props) {
    const activeName = ref<string>('first');
    const isDetail = ref<boolean>(false);
    const materialDetail = ref<any>({});
    const { $http } = useGlobal();
    const goDetail = (id: number): void => {
      console.log('%c [ id ]', 'font-size:13px; background:pink; color:#bf2c9f;', id);
      const request = {
        method: 'get',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/resoure/resourearticle/info/${id}`,
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          materialDetail.value = response.resoureArticle;
          isDetail.value = true;
        }
      });
    };

    return {
      activeName,
      isDetail,
      materialDetail,
      goDetail,
    };
  },
});
</script>

<style lang="scss" module>
.materials-Tab {
	:global(.el-tabs__item) {
		color: #fff;
	}
	:global(.el-tabs__item.is-active) {
		color: #00c1de;
	}

	:global(.el-tabs__active-bar) {
		width: 55px !important;
	}
	:global(.el-tabs__active-bar) {
		background-color: #00c1de;
	}
	:global(.el-tabs__nav-scroll) {
		display: flex;
		justify-content: center;
	}
}
</style>
