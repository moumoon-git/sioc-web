<template>
  <!-- // 联系人信息-地图弹窗 -->
  <!-- 弹窗内容 -->
  <div class="contact-info-dialog">
    <!-- 表单内容 -->
    <main>
      <div
        class="contact-info-dialog__item"
        style="position: relative;"
      >
        <label>姓名：</label>
        <div>张三</div>
        <!-- 头像 -->
        <img class="contact-info-dialog__avatar">
      </div>
      <div class="contact-info-dialog__item">
        <label>性别：</label>
        <div>女</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>单位：</label>
        <div>广州市海珠区应急管理办公室</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>职务：</label>
        <div>主任</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>联系方式：</label>
        <div>
          13800138000
          <ContactMoreButton />
        </div>
      </div>
      <div class="contact-info-dialog__item">
        <label>其他号码：</label>
        <div>020-33114000</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>终端号码：</label>
        <div>020-33114000</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>电子邮箱：</label>
        <div>13800138000@sinvie.cn</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>办公地址：</label>
        <div>广州市海珠区新港西路135号</div>
      </div>
      <div class="contact-info-dialog__item">
        <label>备注：</label>
        <div>靓女</div>
      </div>
      <LabelManagementList />
      <LabelManagementListAdd />
    </main>
    <!-- 底部按钮组 -->
    <footer>
      <div>
        <button
          :class="[
            'contact-info-dialog__button__voice-call',
            {
              'contact-info-dialog__button__voice-call--active': false,
              'contact-info-dialog__button__voice-call--disabled': false,
            }
          ]"
        >
          语音呼叫
        </button>
        <button
          :class="[
            'contact-info-dialog__button__video-call',
            {
              'contact-info-dialog__button__video-call--active': false,
              'contact-info-dialog__button__video-call--disabled': false,
            }
          ]"
        >
          视频呼叫
        </button>
        <button
          :class="[
            'contact-info-dialog__button__live-stream',
            {
              'contact-info-dialog__button__live-stream--active': false,
              'contact-info-dialog__button__live-stream--disabled': false,
            }
          ]"
        >
          现场直播
        </button>
        <button
          :class="[
            'contact-info-dialog__button__route-location',
            {
              'contact-info-dialog__button__route-location--active': false,
              'contact-info-dialog__button__route-location--disabled': false,
            }
          ]"
        >
          轨迹定位
        </button>
      </div>
      <div>
        <button
          :class="[
            'contact-info-dialog__button__dispatch-task',
            {
              'contact-info-dialog__button__dispatch-task--active': false,
              'contact-info-dialog__button__dispatch-task--disabled': false,
            }
          ]"
        >
          派发任务
        </button>
        <button
          :class="[
            'contact-info-dialog__button__dynamic-follow',
            {
              'contact-info-dialog__button__dynamic-follow--active': false,
              'contact-info-dialog__button__dynamic-follow--disabled': false,
            }
          ]"
        >
          动态关注
        </button>
        <button
          :class="[
            'contact-info-dialog__button__topo-graph',
            {
              'contact-info-dialog__button__topo-graph--active': false,
              'contact-info-dialog__button__topo-graph--disabled': false,
            }
          ]"
        >
          图谱
        </button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 联系人操作按钮
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
// 联系人标签
import LabelManagementList from '@/product/CommandBrain3.0/Generalparts/dialog/LabelManagement/LabelManagementList.vue';
// 联系人添加标签
import LabelManagementListAdd from '@/product/CommandBrain3.0/Generalparts/dialog/LabelManagement/LabelManagementListAdd.vue';

export default defineComponent({
  name: 'ContactInfoDialog',
  components: {
    // 联系人更多操作按钮
    ContactMoreButton,
    // 标签管理列表
    LabelManagementList,
    // 标签管理新增
    LabelManagementListAdd,
  },
  setup() {
    // return loadSetup();
  },
});
</script>

<style lang="scss" src="./styles/index.scss"></style>
