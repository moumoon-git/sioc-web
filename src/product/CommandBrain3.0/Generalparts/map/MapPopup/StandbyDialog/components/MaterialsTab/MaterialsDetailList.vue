<template>
  <div :class="$style.MaterialsDetailList">
    <i
      :class="['el-icon-arrow-left', $style.back]"
      @click.stop="$emit('back')"
    />
    <div :class="$style.banner">
      <img
        :src="imgUrl(materialDetail.picPath)"
        alt=""
      >
    </div>
    <div :class="$style.detail">
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">物资名称：</label>
        <span>{{ materialDetail.name }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">物资类型：</label>
        <span>{{ materialDetail.typeName }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">物资仓库：</label>
        <span class="text-colr">{{ materialDetail.storehouseName }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">物资型号：</label>
        <span>{{ materialDetail.model }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">生产厂家：</label>
        <span>{{ materialDetail.factory }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">物资数量：</label>
        <span>{{ materialDetail.amount }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">计量单位：</label>
        <span>{{ materialDetail.measureUnit }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">保质期：</label>
        <span>{{ materialDetail.expireTime }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">有效期：</label>
        <span>{{ materialDetail.replaceTime }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">维修状态：</label>
        <span>{{ manyMap.maintainStatus[materialDetail.maintainStatus] }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">现在状态：</label>
        <span>{{ manyMap.nowStatus[materialDetail.nowStatus] }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">物资级别：</label>
        <span>{{ manyMap.level[materialDetail.level] }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">保密标准：</label>
        <span>{{ manyMap.secret[materialDetail.secret] }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">调用方式：</label>
        <span>{{ materialDetail.transferMethod }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">是否易耗：</label>
        <span>{{ manyMap.consumables[materialDetail.consumables] }}</span>
      </div>
      <div :class="$style['lh-35']">
        <label :class="$style['label-title']">备注：</label>
        <span>{{ materialDetail.remark }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'MaterialsDetailList',
  props: {
    materialDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['back'],
  setup(props, { emit }) {
    console.log(
      '%c [ xxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      props.materialDetail,
    );
    const imgUrl = (url: string) => {
      if (url) {
        return (window as any).config.baseURL + url;
      }
      return require('../../assets/img/empty.png');
    };
    const manyMap = {
      secret: ['机密', '秘密', '限制', '公开', '其他'],
      level: ['国家级', '省级', '市级', '县级', '乡镇级', '其他'],
      nowStatus: ['可正常使用', '不可正常使用'],
      consumables: ['否', '是'],
      maintainStatus: ['好', '良好', '差'],
    };
    return {
      imgUrl,
      manyMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "../../assets/css/common.scss";
.MaterialsDetailList {
	padding-bottom: 20px;
	width: 355px;
	.back {
		position: absolute;
		left: 8px;
		top: 12px;
		cursor: pointer;
		font-size: 18px;
	}
	.lh-35 {
		padding-left: 1em;
		line-height: 26px;
	}

	.text-colr {
		color: #00c1de;
	}

	.label-title {
		@include inline_block_width(78px);
	}

	.banner {
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
		padding: 20px 0;
		width: 94%;
		img {
			width: 74px;
			height: 56px;
		}
	}
}
</style>
