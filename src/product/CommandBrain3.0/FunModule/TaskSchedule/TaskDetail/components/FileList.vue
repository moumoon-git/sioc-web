<template>
  <div class="filelist__out">
    <div
      v-for="(item,index) in fileData"
      :key="index"
      class="filelist__out__Item"
    >
      <div class="filelist__out__Item__time">
        {{ item.time }}
      </div>
      <template v-if="item.list.length>0">
        <div class="filelist__out__Item__files">
          <div class="files__item__videodivs">
            <video
              v-for="(itemIn,index) in returnType(item.list,'video')"
              :key="index"
              class="files__item__videodivs__item"
              :src="`${baseURL}${itemIn.url}`"
              autoplay="autoplay" loop="loop"
            />
          </div>
          <div
            v-viewer
            class="files__item__imgdivs"
          >
            <img
              v-for="(itemIn,index) in returnType(item.list,'image')"
              :key="index"
              class="files__item__imgdivs__item"
              :src="`${baseURL}${itemIn.url}`"
              alt=""
            >
          </div>
          <div class="files__item__filedivs">
            <a
              v-for="(itemIn,index) in returnType(item.list,'file')"
              :key="index"
              :href="`${baseURL}${itemIn.url}`"
              class="files__item__filedivs__item"
            >
              {{ itemIn.filename }}
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FileList',
  components: {},
  inheritAttrs: false,
  props: {
    fileData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
  watch: {
    fileData: {
      handler(val) {
        console.log(val);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {

  },

  methods: {
    returnType(list:any, type:any) {
      const arr:any = [];
      list.forEach((element:any) => {
        if (element?.dictionaryType?.code === type) {
          arr.push(element);
        }
      });
      return arr;
    },
  },
});
</script>

<style  lang="scss">
.filelist__out {
  display: flex;
  flex-direction: column;
  .filelist__out__Item {
    display: flex;
    flex-direction: column;
    .filelist__out__Item__time {
      font-size: 16px;
      color: #fff;
      padding-left: 12px;
      margin-top: 14px;
      margin-bottom: 12px;
    }
    .filelist__out__Item__files {
      width: 336px;
      margin: 0 auto;
      .files__item__videodivs {
        .files__item__videodivs__item {
          width: 77px;
          height: 77px;
          border: 1px solid #00c1de;
          margin: 5px;
        }
      }
      .files__item__imgdivs {
        .files__item__imgdivs__item {
          width: 77px;
          height: 77px;
          border: 1px solid #00c1de;
          margin: 2px;
        }
      }
      .files__item__filedivs {
        .files__item__filedivs__item {
          color: #fff;
          margin: 5px 0;
          cursor: pointer;
          display: block;
          text-decoration:none;
          &:hover{
            color: #00c1de
          }
        }
      }
    }
  }
}
</style>
