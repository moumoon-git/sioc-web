<template>
  <div style="width: 897px; height: 87vh;position:relative;">
    <div :class="$style.pdf">
      <div id="canvasIDpdfs" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      numPages: '', // 页数
      pdfDoc: '', // pdf文件
    };
  },
  mounted() {
    this.getPdf();
  },
  methods: {
    getPdf() {
      const that = this;
      const canvasID = document.getElementById('canvasIDpdfs');
      canvasID.innerHTML = '';
      const url = this.$store.state.reservePlan.document;
      PDFJS.getDocument({
        url,
        httpHeaders: {
          token: window.globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
        },
      }).then(function(pdfDoc_) {
        that.pdfDoc = pdfDoc_;
        var pdfDoc = pdfDoc_
        for (var i = 1; i <= pdfDoc.numPages; i++) {
          that.renderPage(i,canvasID);
        }
      });
    },
    renderPage(num, canvasID) {
      this.pdfDoc.getPage(num).then(function(page) {
        var canvasList = canvasID;
        var canvas = document.createElement('canvas');
        canvasList.appendChild(canvas);
        // canvasList.appendChild(document.createElement('hr'));
        var ctx = canvas.getContext('2d');
        var viewport = page.getViewport(1.5);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
        });
      });
    },
  },
});
</script>

<style lang="scss" module>
  .pdf {
    height: 87vh;
    overflow: auto;
    text-align: center;
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
</style>
