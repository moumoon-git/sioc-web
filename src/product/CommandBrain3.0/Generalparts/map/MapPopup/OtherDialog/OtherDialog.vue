  <!-- <template>
  <div :class="$style.OtherDialog">
    OtherDialog
  </div>
</template>-->

<script lang="tsx">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup(props) {
    const count = ref(132)
    return {
      count
    }
  },
  render() {
    return (
      <div>{this.count}</div>
    )
  }
});
</script>

<style lang="scss" module>
.OtherDialog{
    width: 100%;
    height: 100%;
}
</style>
