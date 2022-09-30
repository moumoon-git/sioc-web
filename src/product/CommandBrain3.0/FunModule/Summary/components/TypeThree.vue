<template>
  <div :class="$style.list">
    <!-- 时间 -->
    <div :class="$style.time">
      {{ `${(item.time.split(' ')[1]).split(':')[0]}:${(item.time.split(' ')[1]).split(':')[1]}` }}
    </div>
    <!-- 整体样式 -->
    <div
      :class="$style.listStyle"
      @click="handleClick"
    >
      <div :class="$style.headerStyle">
        <!-- 标签 -->
        <div :class="$style.listOne" />
        <!-- 电话头 -->
        <div v-if="item.type==='通讯调度-电话'">
          <div :class="$style.listTwo">
            {{ item.eventObj.ti_call_type ? '电话呼出' : '电话呼入' }}
          </div>
          <div :class="$style.line" />
          <!-- 打给谁 -->
          <div
            v-if="item.eventObj.ti_call_type"
            :class="$style.listThree"
          >
            {{ item.eventObj.vc_contactor || '-' }}
          </div>
          <!-- 谁打 -->
          <div
            v-else
            :class="$style.listThree"
          >
            {{ item.eventObj.vc_opr_name || '-' }}
          </div>
          <!-- 详情按钮 -->
          <!-- <div :class="$style.detailIcon">
            <ContactMoreButton
              :id="item.eventObj?.i_operator_id"
            />
          </div> -->
        </div>
        <!-- 短信头 -->
        <div v-if="item.type==='通讯调度-短信'">
          <div :class="$style.listTwo">
            {{ item.eventObj.contactor[0].direct ? '接收短信' : '发送短信' }}
          </div>
          <div :class="$style.line" />
          <div
            v-for="itemone in item.eventObj.contactor"
            :key="itemone.id"
          >
            <!-- 收到 -->
            <div
              v-if="itemone.direct"
              :class="$style.listThree"
            >
              {{ itemone.operatorName || '-' }}
            </div>
            <!-- 发给 -->
            <div
              v-else
              :class="$style.listThree"
            >
              {{ itemone.contactorName || '-' }}
            </div>
            <!-- 详情按钮 -->
            <div :class="$style.detailIcon">
              <ContactMoreButton
                :id="itemone?.contactorId"
              />
            </div>
          </div>
        </div>
        <!-- 传真头 -->
        <div v-if="item.type==='通讯调度-传真'">
          <div :class="$style.listTwo">
            {{ item.eventObj.contactor[0].direct ? '发送传真' : '接收传真' }}
          </div>
          <div :class="$style.line" />
          <div
            v-for="itemone in item.eventObj.contactor"
            :key="itemone.id"
          >
            <!-- 收到 -->
            <div
              v-if="itemone.direct"
              :class="$style.listThree"
            >
              {{ itemone.called || '-' }}
            </div>
            <!-- 发给 -->
            <div
              v-else
              :class="$style.listThree"
            >
              {{ itemone.calling || '-' }}
            </div>
          </div>
        </div>
        <!-- 会议 -->
        <div v-if="item.type==='通讯调度-会议'">
          <div :class="$style.listTwo">
            视频会议
          </div>
        </div>
      </div>
      <!-- 身体 -->
      <!-- 电话体 -->
      <div v-if="item.type==='通讯调度-电话'">
        <div :class="$style.listFour">
          坐席号：{{ item.eventObj.vc_extension }}
        </div>
        <!-- <div style="padding: 10px;">
          <Audio
            :id="item.eventObj.i_id"
            :audioData="{
              recordFile: item.eventObj.vc_record_file,
              remark: item.eventObj.vc_remark,
              eventId: $store.state.event?.id,
              id: item.eventObj.i_id,
            }"
            @hanleTurnText="toText(item)"
          />
        </div> -->
        <div :class="$style.listFour">
          备注: {{ item.eventObj.vc_remark }}
        </div>
      </div>
      <!-- 短信体 -->
      <div v-if="item.type==='通讯调度-短信'">
        <div :class="$style.listFour">
          {{ item.eventObj.contactor[0].content }}
        </div>
      </div>
      <!-- 传真体 -->
      <div v-if="item.type==='通讯调度-传真'">
        <div :class="$style.listFour">
          {{ item.eventObj.contactor[0].faxName }}
          <span
            style="color: #56E9FF;margin-left: 10px;cursor: pointer;"
            @click="downFax(item)"
          >下载</span>
          <!-- <span
            style="text-decoration: none;color: #56E9FF;margin-left: 20px;cursor: pointer;"
            @click="viewFax(item)"
          >预览</span> -->
        </div>
      </div>
      <!-- 会议体 -->
      <div v-if="item.type==='通讯调度-会议'">
        <div :class="$style.listFour">
          会议纪要：{{ item.eventObj.id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import ReservePlanDocument from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanDocument/ReservePlanDocument.vue'; // 预案文档
import Audio from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/components/Audio/Audio.vue';
import axios from 'axios';

export default defineComponent({
  name: 'TypeThree',
  components: {
    // 详情按钮
    ContactMoreButton,
    // 弹出框
    DialogBoat,
    // 语音进度条
    Audio,
  },
  inject: ['$addDialog'],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['handleClick'],
  data() {
    return {
      baseURL: (window as any).config.baseURL,
      ReservePlanDocumentDialog: null as any,
    };
  },
  methods: {
    handleClick(item: any): void {
      this.$emit('handleClick', item);
    },
    // 传真下载
    downFax(item: any): void {
      axios({
        url: `${this.baseURL}/fileupload/appAttachment/download?appAttachmentId=${item.eventObj.contactor[0].id}&isForceDownload=1`,
        method: 'get',
        headers: {
          token: (window as any).globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'arraybuffer',
      }).then((response: any) => {
        if (response) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = item.eventObj.contactor[0].faxName;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    // 传真预览
    viewFax(item: any): void {
      const request = {
        method: 'get',
        url: '/fax/previewFax',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
        params: {
          faxId: item.eventObj.contactor[0].id,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.data) {
        }
      });
      // (this as any).$store.commit('reservePlan/setDocument', `${(window as any).config.baseURL}${item.eventObj.contactor[0].faxFileUrl}`);
      // this.ReservePlanDocumentDialog = (this as any).$addDialog('', ReservePlanDocument);
    },
    // 语音转文字
    toText(item: any): void {
    },
  },
});
</script>

<style lang="scss" module>
$label: url('../assets/three.svg');
@import '../assets/css/public.scss';
</style>
