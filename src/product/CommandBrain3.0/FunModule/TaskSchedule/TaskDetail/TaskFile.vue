<template>
  <div class="detail__file">
    <div class="detail__file__liveVideo">
      <div class="detail__file__liveVideo__title">
        <div class="detail__title__icon" />
        <div class="file__liveVideo__title__name">
          任务直播
        </div>
      </div>
      <div class="detail__file__liveVideo__divs" />
    </div>
    <div class="detail__file__historFile">
      <div class="detail__file__historFile__title">
        <div class="detail__title__icon" />
        <div class="file__historFile__title__name">
          过往情报
        </div>
        <div class="file__historFile__title__checkbox">
          <p
            v-for="(item,index) in dictionaryArr"
            :key="index"
          >
            <input
              v-model="chooseCheckArr"
              type="checkbox"
              name="historyFile"
              :value="item.id"
              @change="filterFile()"
            >{{ item.name }}
          </p>
        </div>
      </div>
      <div class="detail__file__historFile__divs">
        <FileList :file-data="fileData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FileList from './components/FileList.vue';

export default defineComponent({
  name: 'TaskFile',
  components: {
    FileList,
  },
  props: {
    taskId: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      fileData: [],
      lastcheckval: '' as any,
      chooseCheckArr: [], // 选中的筛选类型
      dictionaryArr: [], // 字典数据
    };
  },
  watch: {
    taskId: {
      handler(val, old) {
        console.log(this.taskId);
        this.getFileList(this.taskId, this.dictionaryArr);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getdictionary();
  },
  methods: {
    getFileList(taskId: any, arr: any) {
      const param = {
        taskId,
        type: arr,
      };
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/getTaskAttachment',
        headers: {
          'Content-Type': 'application/json',
          token: 'PC_166c9588e794dc5c743e9b4ac731ad3e',
        },
        data: param,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          this.fileData = response.data;
        })
        .catch((error: any) => {
          (this as any).$message.error(`获取任务附件失败，错误信息：${error}`);
        });
    },
    filterFile() {
      console.log(this.chooseCheckArr);
      this.getFileList(this.taskId, this.chooseCheckArr);
    },
    // 获取字典
    getdictionary() {
      const param = {
        pcode: 'distribution_result_attachment_type',
      };
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/emergency/preparation/dictionary/getByParentCode',
        headers: {
          'Content-Type': 'application/json',
          token: 'PC_166c9588e794dc5c743e9b4ac731ad3e',
        },
        data: param,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          // this.fileData = response.data
          this.dictionaryArr = response.data;
        })
        .catch((error: any) => {
          (this as any).$message.error(`获取字典失败，错误信息：${error}`);
        });
    },
  },
});
</script>
<style lang="scss" src="./taskfile.scss"></style>