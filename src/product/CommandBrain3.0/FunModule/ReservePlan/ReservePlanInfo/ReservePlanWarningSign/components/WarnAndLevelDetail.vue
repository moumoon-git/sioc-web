<template>
  <!-- 预警头部 -->
  <div :class="$style.headerStyle">
    <div
      :class="{
        [$style.headerIconBlue]: detailList?.signalName==='蓝',
        [$style.headerIconYellow]: detailList?.signalName==='黄',
        [$style.headerIconOrange]: detailList?.signalName==='橙',
        [$style.headerIconRed]: detailList?.signalName==='红',
      }"
    />
    <div :class="$style.headerText">
      {{ detailList.name }}
    </div>
  </div>
  <div :class="$style.signColor">
    <div :class="$style.signColorLabel">
      {{ title1 }}:
    </div>
    <div
      :class="{
        [$style.headerIconBlue]: detailList?.signalName==='蓝',
        [$style.headerIconYellow]: detailList?.signalName==='黄',
        [$style.headerIconOrange]: detailList?.signalName==='橙',
        [$style.headerIconRed]: detailList?.signalName==='红',
      }"
    />
  </div>
  <div :class="$style.eventLevel">
    <div :class="$style.eventLevelLabel">
      {{ title2 }}:
    </div>
    <div :class="$style.eventLevelText">
      {{ prop2 }}
    </div>
  </div>
  <div :class="$style.levelDescription">
    <div :class="$style.levelDescriptionLabel">
      {{ title3 }}:
    </div>
    <div :class="$style.levelDescriptionText">
      {{ prop3 }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WarnAndLevelDetail',
  props: {
    title1: {
      type: String,
      default: '',
    },
    title2: {
      type: String,
      default: '',
    },
    title3: {
      type: String,
      default: '',
    },
    prop2: {
      type: String,
      default: '',
    },
    prop3: {
      type: String,
      default: '',
    },
    detailList: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>

<style lang="scss" module>
  @mixin iconBlue {
    background: url(../../../PublicComponents/assets/blueSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 100%;
  }
  @mixin iconYellow {
    background: url(../../../PublicComponents/assets/yellowSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 100%;
  }
  @mixin iconOrange {
    background: url(../../../PublicComponents/assets/orangeSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 100%;
  }
  @mixin iconRed {
    background: url(../../../PublicComponents/assets/redSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 100%;
  }
  .headerStyle {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    color: #FFF;
    .headerIconBlue {
      @include iconBlue;
      float: left;
      margin-left: 10px;
      margin-top: 15px;
    }
    .headerIconYellow {
      @include iconYellow;
      float: left;
      margin-left: 10px;
      margin-top: 15px;
    }
    .headerIconOrange {
      @include iconOrange;
      float: left;
      margin-left: 10px;
      margin-top: 15px;
    }
    .headerIconRed {
      @include iconRed;
      float: left;
      margin-left: 10px;
      margin-top: 15px;
    }
    .headerText {
      float: left;
      margin-left: 4px;
      margin-top: 15px;
      font-size: 16px;
    }
  }
  .signColor {
    width: 814px;
    border: 1px solid rgba(0, 193, 222, 0.58);
    margin-left: 10px;
    margin-top: 10px;
    position: relative;
    color: #FFF;
    min-height: 41px;
    .signColorLabel {
      float: left;
      margin: 10px;
    }
    .headerIconBlue {
      @include iconBlue;
      float: right;
      margin: 10px 5px 0px 0px;
    }
    .headerIconYellow {
      @include iconYellow;
      float: right;
      margin: 10px 5px 0px 0px;
    }
    .headerIconOrange {
      @include iconOrange;
      float: right;
      margin: 10px 5px 0px 0px;
    }
    .headerIconRed {
      @include iconRed;
      float: right;
      margin: 10px 5px 0px 0px;
    }
  }
  .eventLevel {
    width: 814px;
    border: 1px solid rgba(0, 193, 222, 0.58);
    margin-left: 10px;
    margin-top: 10px;
    position: relative;
    color: #FFF;
    min-height: 41px;
    .eventLevelLabel {
      float: left;
      margin: 10px;
    }
    .eventLevelText {
      float: right;
      margin: 10px;
    }
  }
  .levelDescription {
    width: 814px;
    border: 1px solid rgba(0, 193, 222, 0.58);
    margin: 10px 0px 10px 10px;
    position: relative;
    color: #FFF;
    min-height: 90px;
    .levelDescriptionLabel {
      margin: 10px;
    }
    .levelDescriptionText {
      margin: 10px;
    }
  }
</style>
