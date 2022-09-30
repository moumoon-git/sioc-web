<template>
  <div class="iframe-container">
    <iframe
      :src="filePath"
      id="pdfIframe"
      width="100%"
      height="100%"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      allowtransparency="yes"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'FileViewer',
  setup() {
    const store = useStore();
    const filePath = ref(store.state.fileViewerPath);
    return {
      filePath,
    };
  },
});
</script>
<style lang="scss">
.iframe-container {
  padding: 13px 35px 43px 35px;
}
#pdfIframe {
  width: 631px;
  height: 748px;
  background: #ffffff;
} 

</style>
