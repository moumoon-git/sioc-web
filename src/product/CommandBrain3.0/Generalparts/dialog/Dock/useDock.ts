import { getCurrentInstance } from 'vue';
import { useStore, Store } from 'vuex';

const context: any = {
  store: null,
  instance: null,
};

export const addDialog = (
  dialog: string,
  el: HTMLElement | any,
  props?: any,
): {
  hide: () => void,
  unhide: () => void,
  close: () => void,
} => context.instance?.proxy?.addDialog(dialog, el, props);

export const getStore = (): Store<any> => context.store;

export const mapDialog = (...args: any[]): any => {
  if (context.instance) {
    return context.instance.appContext.config.globalProperties?.$mapDialog(...args) || {
      open() {
        throw Error('missing global method: $mapDialog');
      },
    };
  }
};

export default () => {
  const instance = getCurrentInstance();
  if (instance) {
    context.instance = instance;
  }
  const store = useStore();
  if (store) {
    context.store = store;
  }
};
