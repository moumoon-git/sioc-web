<template>
  <TopHeader title="综合保障能力" />
  <Title title="救援队伍" sub="RESCUE TEAM" style="margin-top: 27px" />
  <RescueTeam :list-data="rescueTeamList.filter((item) => item.value)" />
  <Title title="应急物资" sub="EMERGENCY SUPPLIES" />
  <EmergencySupplies :list-data="emergencySuppliesList" />
  <Title title="重点场所" sub="KEY PLACES" />
  <KeyPlaces :list-data="keyPlacesList" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, getCurrentInstance } from 'vue';
import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
// 最顶部标题
import TopHeader from '../../components/TopHeader/TopHeader.vue';
// 小标题
import Title from '../../components/Title/Title.vue';
// 救援队伍
import RescueTeam from './modules/RescueTeam/RescueTeam.vue';
// 应急物资
import EmergencySupplies from './modules/EmergencySupplies/EmergencySupplies.vue';
// 重点场所
import KeyPlaces from './modules/KeyPlaces/KeyPlaces.vue';

// Composition API

// 救援队伍
import useRescueTeam from './services/useRescueTeam';
// 应急物资
import useEmergencySupplies from './services/useEmergencySupplies';
// 重点场所
import useKeyPlaces from './services/useKeyPlaces';

export default defineComponent({
  name: 'Right',
  components: {
    TopHeader,
    Title,
    RescueTeam,
    EmergencySupplies,
    KeyPlaces,
  },
  setup() {
    const instance = getCurrentInstance();
    const { $ws }: any = instance?.appContext.config.globalProperties;
    // 救援队伍
    const [rescueTeamList, getRescueTeamList] = useRescueTeam();
    // 应急物资
    const [emergencySuppliesList, getEmergencySuppliesList] =
      useEmergencySupplies();
    // 重点场所
    const [keyPlacesList, getKeyPlacesList] = useKeyPlaces();

    const un = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg: any) => {
        switch (msg?.msgType) {
          case 50001:
            getRescueTeamList();
            break;
          case 50003:
            getEmergencySuppliesList();
            break;
          case 50002:
          case 50004:
            getKeyPlacesList();
            break;
          default:
        }
      },
    );
    onBeforeUnmount(() => {
      un();
    });

    return {
      rescueTeamList,
      emergencySuppliesList,
      keyPlacesList,
    };
  },
});
</script>
