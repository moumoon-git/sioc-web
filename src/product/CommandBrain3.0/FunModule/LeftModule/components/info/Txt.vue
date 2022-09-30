<template>
  <div :class="$style.Txt">
    <ul>
      <li v-for="attachment in data" :key="attachment.id">
        <span
          :class="
            attachment.handleType !== 'TXT'
              ? $style[attachment.handleType + '-icon']
              : ''
          "
        ></span>
        <span>{{ attachment.fileName }}</span>
        <!-- <span @click="download(attachment, '/appAttachment/download')"
          >下载</span> -->
        <span @click="download(attachment)">下载</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { remove } from 'lodash';
import { defineComponent, getCurrentInstance } from 'vue';
import EnclosureScript from '@/product/Coplotting/generalparts/SeeMore/components/script/EnclosureScript';

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { $downFile }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    // const { download } = EnclosureScript(props);
    function download(params: any) {
      // const a = document.createElement('a');
      // a.href = params.src;
      // a.download = params.fileName;
      // a.click();
      // setTimeout(() => {
      //   a.remove();
      // }, 500);
      const request = {
        method: 'get',
        url:
          (window as any).config.baseURL +
          (window as any).config.service.file +
          '/fileDownload/loadForStream',
        service: 'file',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          filePath: params.filePath,
          fileName: params.fileName,
        },
        responseType: 'arraybuffer',
      };
      $downFile(request, false).then((res: any) => {
        console.log(res);
        const a = document.createElement('a');
        if (params.suffix === 'xls') {
          a.href = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/vnd.ms-excel' }),
          );
        } else if (params.suffix === 'doc') {
          a.href = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/msword' }),
          );
        } else if (params.suffix === 'pdf') {
          a.href = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/pdf' }),
          );
        } else if (params.suffix === 'xlsx') {
          a.href = window.URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
          );
        } else if (params.suffix === 'ppt') {
          a.href = window.URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-powerpoint',
            }),
          );
        } else if (params.suffix === 'txt') {
          a.href = window.URL.createObjectURL(
            new Blob([res.data], {
              type: 'text/plain',
            }),
          );
        }
        a.download = `${params.fileName}`;
        document.body.appendChild(a); // 兼容Firefox浏览器
        a.click();
        a.remove();
      });
    }
    return {
      download,
    };
  },
});
</script>

<style lang="scss" module>
.Txt {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span {
      &:last-child {
        color: #00ecff;
        cursor: pointer;
      }
    }
  }
}

@each $animal in PDF, DOC, XLSX, XLS {
  .#{$animal}-icon {
    width: 20px;
    height: 22px;
    background-size: 100% 100%;
    background-image: url('../../assets/#{$animal}.svg');
  }
}
</style>