<template>
  <div class="reserve-item__container">
    <div class="reserve-item__header">
      {{ reserveData.preplanName }}
      <img v-if="reserveData.statusName === '未响应'" src="../assets/images/noResponse.png" alt="" class="header-image" />
      <img v-else src="../assets/images/responsed.png" alt="" class="header-image" />
    </div>

    <div class="reserve-item__body">
      <ul class="info-list">
        <li class="info-item">
          <div class="info-left">
            <div class="info-label">
              响应等级
            </div>
          </div>

          <div class="info-right">
            <div class="info-value">
              {{ reserveData.levelName }}
            </div>
          </div>
        </li>
        <li class="info-item">
          <div class="info-left">
            <div class="info-label">
              事件标题
            </div>
          </div>

          <div class="info-right">
            <div class="info-value">
              {{ reserveData.eventTitle }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="reserve-item__footer">
      <img src="../assets/images/clock.svg" alt="" class="reserve-item__footer__image" />
      <span class="reserve-item__footer__text">
       {{ reserveData.sendTime }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ReserveItem',
  props: {
    reserveData: {
      type: Object,
      default: () => { return {} }
    }
  }
});
</script>

<style lang="scss">
.reserve-item__container {
  padding: 0 0.2rem 0.29rem 0.2rem;
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  margin-bottom: 0.2rem;

  .reserve-item__header {
    line-height: 0.9rem;
    height: 0.9rem;
    border-bottom: 0.01rem solid #dddddd;
    position: relative;
    font-size: 0.28rem;
    font-weight: 500;
    color: #333333;

    .header-image {
      position: absolute;
      right: -0.2rem;
      top: 0;
      width: 0.8rem;
      height: 0.8rem;
    }
  }

  .reserve-item__body {
    .info-list {
      padding: 0.2rem 0 0.1rem 0;

      .info-item {
        min-height: 0.6rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .info-left {
          width: 1.12rem;
          margin-right: 0.4rem;

          .info-label {
            font-size: 0.28rem;
            font-weight: 400;
            color: #999999;
            line-height: 0.6rem;
          }
        }

        .info-right {
          flex: 1;

          .info-value {
            font-size: 0.28rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 0.6rem;
          }
        }
      }
    }
  }

  .reserve-item__footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .reserve-item__footer__image {
      width: 0.28rem;
      height: 0.28rem;
      margin-right: 0.12rem;
    }

    .reserve-item__footer__text {
      font-size: 0.28rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.4rem;
    }
  }
}
</style>
