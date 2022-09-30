<template>
  <header
    v-if="!isNotDetail"
    :class="$style.headerStyle"
  >
    <!-- 回到上一步箭头 -->
    <div
      :class="$style.headerIcon"
      @click="goBack"
    />
    <!-- 资源名字 -->
    <div :class="$style.headerText">
      {{ detailName }}
    </div>
  </header>
  <!-- 表头 -->
  <table
    border="0"
    :class="$style.tableHead"
  >
    <tr :class="$style.headTr">
      <th
        v-for="(item,index) in tableHeadList"
        :key="index"
        :class="$style.headTh"
      >
        {{ item.name }}
      </th>
    </tr>
  </table>
  <!-- 表身 -->
  <table
    border="0"
    :class="$style.tableBody"
  >
    <div
      :class="$style.scroll"
      :style="isNotDetail?'overflow: auto;height: 646px;':''"
    >
      <tr
        v-for="(item,index) in resourceTableList"
        :key="index"
        :class="$style.bodyTr"
        :style="currentItem===item&&isNotDetail?
          'background: linear-gradient(90deg, rgba(0, 193, 222, 0.7) 0%, rgba(24, 38, 50, 0) 100%);'
          :''"
      >
        <!-- 列属性动态获取 -->
        <td
          v-for="(itemTd, indexTd) in resourceTableItem"
          :key="indexTd"
          :class="$style.bodyTd"
          @click="handleClick(item)"
        >
          <!-- 防护目标 避难场所 -->
          <span v-if="itemTd==='contactsList'||itemTd==='contactorlist'">
            <span v-if="indexTd===2">
              {{ item[itemTd][0]?.name }}
            </span>
            <span v-if="indexTd===3">
              {{ item[itemTd][0]?.mobile1 }}
              <!-- 详情按钮 -->
              <span v-if="item[itemTd][0]?.mobile1">
                <ContactMoreButton
                  :id="item[itemTd][0]?.id"
                />
              </span>
            </span>
          </span>
          <!-- 队伍 -->
          <span v-else-if="itemTd==='responsiblesList'">
            <span v-if="indexTd===1">
              {{ item[itemTd][0]?.name }}
            </span>
            <span v-if="indexTd===2">
              {{ item[itemTd][0]?.mobile1 }}
              <!-- 详情按钮 -->
              <span v-if="item[itemTd][0]?.mobile1">
                <ContactMoreButton
                  :id="item[itemTd][0]?.id"
                />
              </span>
            </span>
          </span>
          <!-- 物资 -->
          <span v-else-if="itemTd==='resoureArticleStorehouse'">
            <span v-if="indexTd===2">
              {{ item[itemTd]?.contactorList[0]?.name }}
            </span>
            <span v-if="indexTd===3">
              {{ item[itemTd]?.contactorList[0]?.mobile1 }}
              <!-- 详情按钮 -->
              <span v-if="item[itemTd]?.contactorList[0]?.mobile1">
                <ContactMoreButton
                  :id="item[itemTd]?.contactorList[0]?.id"
                />
              </span>
            </span>
          </span>
          <!-- 其他不是数组的普通属性 -->
          <span v-else>
            {{ item[itemTd] }}
            <!-- 详情按钮 -->
            <span v-if="itemTd==='phone'&&item[itemTd]">
              <ContactMoreButton
                :id="item?.id"
              />
            </span>
          </span>
        </td>
        <td
          v-if="tableHeadList[0].name!=='专家名称'&&!isNotDetail"
          :class="$style.bodyTd"
        >
          <div
            :class="currentItem===item
              ? $style.locationActive
              : $style.locationUnactive"
            @click="location(item)"
          />
        </td>
      </tr>
    </div>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';

export default defineComponent({
  name: 'ResourceTable',
  components: {
    // 详情按钮
    ContactMoreButton,
  },
  props: {
    tableHeadList: {
      type: Array,
      default: () => [],
    },
    resourceTableList: {
      type: Array,
      default: () => [],
    },
    resourceTableItem: {
      type: Array,
      default: () => [],
    },
    detailName: {
      type: String,
      default: '',
    },
    isNotDetail: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['handleClick', 'goBack'],
  data() {
    return {
      currentItem: '', // 当前item
    };
  },
  // 卸载前清除图层
  beforeUnmount() {
    if ((window as any).map) {
      (window as any).map.clearDeleteCoverage('ResourceDetailMarker');
    }
  },
  methods: {
    handleClick(item: any): void {
      if (this.isNotDetail) {
        this.currentItem = item;
        this.$emit('handleClick', item);
      }
    },
    location(item: any): void {
      if (item.longitude && item.latitude) {
        this.currentItem = item;
        (window as any).map.clearAtPresentMarkData('ResourceDetailMarker');
        (window as any).map.clearDeleteCoverage('ResourceDetailMarker');
        (window as any).map.createdMarkCoverage('ResourceDetailMarker');
        (window as any).map.setCentent(
          {
            longitude: item.longitude,
            latitude: item.latitude,
          },
          17,
        );
        (window as any).map.setOneMarker(
          'ResourceDetailMarker',
          {
            longitude: item.longitude,
            latitude: item.latitude,
            wd: 40,
            hg: 40,
            src: useMapMarker(),
          },
        );
      } else {
        (this as any).$message.error('暂无经纬度信息');
      }
    },
    goBack(): void {
      this.$emit('goBack');
    },
  },
});
</script>

<style lang="scss" module>
  .headerStyle {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    color: #FFFFFF;
    .headerIcon {
      background: url(../../../PublicComponents/assets/left.svg) no-repeat;
      background-size: 100%;
      width: 10px;
      height: 17px;
      position: absolute;
      left: 8px;
      top: 17px;
      cursor: pointer;
    }
    .headerText {
      position: absolute;
      left: 29px;
      top: 12px;
      font-size: 16px;
    }
  }
  .locationActive {
    background: url(../../../PublicComponents/assets/locationActive.svg) no-repeat;
    width: 14px;
    height: 17px;
    right: 67px;
    top: 11px;
    position: absolute;
    cursor: pointer;
  }
  .locationUnactive {
    background: url(../../../PublicComponents/assets/locationUnActive.svg) no-repeat;
    width: 14px;
    height: 17px;
    right: 67px;
    top: 11px;
    position: absolute;
    cursor: pointer;
    &:hover {
      background: url(../../../PublicComponents/assets/locationActive.svg) no-repeat;
    }
  }
  .tableHead {
    color: #FFFFFF;
    border-spacing: 0px;
    width: 100%;
    .headTr {
      text-align: center;
      font-size: 16px;
      height: 52px;
      background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    }
  }
  .tableBody {
    color: #FFFFFF;
    border-spacing: 0px;
    width: 100%;
    .scroll {
      .bodyTr {
        text-align: center;
        font-size: 14px;
        height: 38px;
        .bodyTd {
          position: relative;
          width: 587px;
        }
        &:hover {
          background: linear-gradient(90deg, rgba(0, 193, 222, 0.7) 0%, rgba(24, 38, 50, 0) 100%);
        }
      }
      // 滚动条
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #56E9FF;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }
  }
</style>
