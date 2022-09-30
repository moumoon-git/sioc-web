<template>
  <transition name="visualization-header-list__transition">
    <div
      v-bind="$attrs"
      :class="[
        'visualization-header-list',
        listData.length > 0 ? 'visualization-header-border' : '',
      ]"
    >
      <h3 v-if="title" :title="title">
        {{ title }}
      </h3>
      <ul>
        <li
          v-for="(item, index) in listData"
          :key="index"
          :title="item"
          @click="$emit('click', item)"
        >
          <div class="searchItemL">
            {{ index + 1 }}
          </div>
          <div class="searchItemR">
            <div class="searchItemR_t">
              {{ item.name }}
            </div>
            <div class="searchItemR_b">
              {{ item.address }}
            </div>
          </div>
          <div class="searchItemBtn" @click="showPointPanel(item)">搜周边</div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  name: 'FlightSearchList',
  props: {
    title: {
      type: String,
      default: () => '',
    },
    listData: {
      type: Array,
      default: (): Array<string | number> => [],
    },
  },
  emits: ['click'],
  data() {
    return {};
  },
  methods: {
    showPointPanel(obj: any) {
      (this as any).$emit('showPointPop', obj);
    },
  },
};
</script>

<style lang="scss">
@keyframes visualization-header-list__show {
  from {
    transform: translate(-50%, -5px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
  }
}
.visualization-header-list {
  width: 334px;
  background: rgba(5, 5, 5, 0.9);
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
  animation: visualization-header-list__show 0.3s ease;
  // 标题
  & > h3 {
    height: 48px;
    line-height: 48px;
    text-align: left;
    margin: 0;
    padding: 0 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 18px;
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // 列表
  & > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 598px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 3px;
    }
    & > li {
      text-align: left;
      color: #56e9ff;
      font-size: 18px;
      line-height: 18px;
      padding: 7px 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        background: linear-gradient(to right, #1d76ac, transparent);
        .searchItemBtn {
          display: block;
        }
        .searchItemL {
          background: url(./assets/iconb.svg) no-repeat;
        }
      }
      .searchItemL {
        width: 14px;
        height: 20px;
        background: url(./assets/iconr.svg) no-repeat;
        text-align: center;
        line-height: 15px;
        font-size: 12px;
        color: #fff;
      }
      .searchItemR {
        width: 220px;
        height: 40px;
        margin-left: 6px;
        .searchItemR_t {
          color: #ffffff;
        }
        .searchItemR_b {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #a6adb4;
        }
      }
      .searchItemBtn {
        width: 77px;
        height: 30px;
        line-height: 30px;
        text-align: right;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 12px;
        display: block;
        // background: url(./img/allIcon.8d1e5287.svg) no-repeat;
        background-position-x: 43%;
        background-position-y: 49%;
        background-size: 1282px 1203px;
        display: none;
      }
    }
  }
}
.visualization-header-border {
  border: 1px solid rgba(166, 173, 180, 0.3);
}
.visualization-header-list__transition-leave-active {
  transition: all 0.8s ease;
}
.visualization-header-list__transition-leave-to {
  opacity: 0;
}
</style>
