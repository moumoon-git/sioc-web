<template>
  <div :class="$style.StandbyDialog">
    <Main-content-dialog
      :active-component="activeComponent"
      :body-parts="composeData.responseData"
    >
      <!-- 底部按钮 -->
      <template #footer>
        <FooterOperation
          v-if="composeData.responseData.dialogType !== 'contactor'"
          :compose-data="composeData"
          v-bind="$attrs"
        />
        <button-list
          v-else
          :state="state"
          :dispatch="dispatch"
        />
      </template>
    </Main-content-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import myStore from './store/useStore';
import MainContentDialog from './MainContentDialog.vue';
import FooterOperation from '../FooterOperation/FooterOperation.vue';
import ButtonList from '../../../main/ContactOperation/ButtonList.vue';
import { createContactOperation } from '../../../main/ContactOperation/useContactOperation';

export default defineComponent({
  name: 'StandbyDialog',
  components: {
    MainContentDialog,
    FooterOperation,
    ButtonList,
  },
  props: {
    activeComponent: {
      type: String,
      default: 'NotabLocation',
    },
    selfModule: {
      type: String,
      default: '',
    },
    composeData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { dispatch: storeDispatch } = myStore(); // 我的store
    const flag = ref(true);
    const uid = inject<string>('uid');

    const contactOperation = props.composeData.responseData.dialogType !== 'contactor' ? {} as any : createContactOperation(props.composeData.responseData.id);

    function detail() {
      storeDispatch({
        type: 'isExpandAction',
        payload: {
          uid,
          status: flag.value,
        },
      }).then(() => flag.value = !flag.value);
    }

    function dispatch(action: { type: string; payload?: any }) {
      switch (action.type) {
        case 'phone':
          contactOperation?.phone(action.payload);
          break;
        case 'sms':
          contactOperation?.sms(action.payload);
          break;
        case 'voice':
          contactOperation?.voice(action.payload);
          break;
        case 'video':
          contactOperation?.video(action.payload);
          break;
        case 'track':
          contactOperation?.track();
          break;
        case 'meeting':
          contactOperation?.meeting(action.payload);
          break;
        case 'task':
          contactOperation?.task();
          break;
        case 'search':
          contactOperation?.search();
          break;
        case 'searchMonitor':
          contactOperation?.searchMonitor();
          break;
        case 'detail':
          detail();
          break;
        default:
      }
    }

    return {
      state: contactOperation.state,
      dispatch,
    };
  },
});
</script>
<style lang="scss" module>
.StandbyDialog {
}
</style>
