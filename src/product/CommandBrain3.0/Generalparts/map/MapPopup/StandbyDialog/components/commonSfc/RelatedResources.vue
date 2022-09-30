<template>
  <div :class="$style.RelatedResources">
    <div :class="$style.title">
      关联资源
    </div>
    <div
      v-for="(item, index) in relatedResourcesList"
      :key="index"
      :class="$style['equipment-box']"
    >
      <label :class="$style['label-title']">{{ item.title }}：</label>
      <span :class="$style['text-dec']">
        {{ item.dec }}
        <template v-if="item.hasContactBtn">
          <ContactMoreButton
            :id="ContactData.id"
          />
        </template>

      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'RelatedResources',
  components: {
    ContactMoreButton,
  },
  props: {
    relatedResourcesList: {
      type: Array,
      default: ():Record<string, any>[] => ([]),
    },
  },
  setup(props) {
    const store = useStore(); // 使用vuex
    const { $http } = useGlobal();
    const ContactData = reactive({});

    // forEach的回调是并行，不应该使用forEach
    const getContactData = (relatedResourcesList: any[]) => {
      relatedResourcesList.forEach((item: any) => {
        if (item.hasContactBtn) {
          const request = {
            method: 'post',
            service: 'soc',
            headers: {
              'Content-Type': 'application/json',
            },
            url: `/mail/mailcontactor/info/${item.entity.id}?eventId=${store.state.event?.id}`,
            data: {},
          };

          $http(request).then((res:any) => {
            if (res.errorcode === 0) {
              const { mailContactor } = res;
              const obj = {
                id: mailContactor.id,
                name: mailContactor.name,
                phone: mailContactor.mobile1,
                workUnit: mailContactor.workUnit,
                position: mailContactor.position,
                isOnline: mailContactor.appStatus,
                longitude: mailContactor.longitude,
                latitude: mailContactor.latitude,
              };
              Object.assign(ContactData, obj);
            }
          });
        }
      });
    };
    getContactData(props.relatedResourcesList);

    return {
      ContactData,
    };
  },
});
</script>
<style lang="scss" module>

.RelatedResources {
	padding-bottom: 5px;
	.title {
		margin-bottom: 10px;
		padding-left: 9px;
		background: linear-gradient(90deg, rgba(1, 75, 113, .6) 0%, rgba(1, 75, 113, 0) 100%);
		line-height: 30px;
	}
	.equipment-box {
		display: flex;
		align-items: center;
		padding-left: 9px;
		height: 35px;
		line-height: 35px;
		.label-title {
			width: 78px;
		}
		.text-dec {
			overflow: hidden;
			width: 162px;
			text-overflow: ellipsis;
			color: #00c1de;
			white-space: nowrap;
		}
	}
}
</style>
