import { ref, onBeforeUnmount } from 'vue';

const selectedContactMap = ref(new Map());
const selectedDeviceMap = ref(new Map());
const selectedExpertMap = ref(new Map());
let restoreFunc: any;

function toggleCheck(item: any, isContact: boolean | number) {
  if (isContact === 3) {
    if (selectedExpertMap.value.has(item.id)) {
      selectedExpertMap.value.delete(item.id);
    } else {
      selectedExpertMap.value.set(item.id, item);
    }
  } else if (isContact) {
    if (selectedContactMap.value.has(item.id)) {
      selectedContactMap.value.delete(item.id);
    } else {
      selectedContactMap.value.set(item.id, item);
    }
  } else {
    /* eslint-disable no-lonely-if */
    if (selectedDeviceMap.value.has(item.id)) {
      selectedDeviceMap.value.delete(item.id);
    } else {
      selectedDeviceMap.value.set(item.id, item);
    }
    /* eslint-enable no-lonely-if */
  }
  restoreFunc && restoreFunc();
}

function removeCheck(item: any, isContact: boolean | number) {
  if (isContact === 3) {
    selectedExpertMap.value.delete(item.id);
  } else if (isContact) {
    selectedContactMap.value.delete(item.id);
  } else {
    selectedDeviceMap.value.delete(item.id);
  }
  restoreFunc && restoreFunc();
}

export default function (keepUndeletableList: any) {
  restoreFunc = keepUndeletableList;
  onBeforeUnmount(() => {
    selectedContactMap.value.clear();
    selectedDeviceMap.value.clear();
    selectedExpertMap.value.clear();
  });
  return {
    selectedContactMap,
    selectedDeviceMap,
    selectedExpertMap,
    toggleCheck,
    removeCheck,
  };
}
