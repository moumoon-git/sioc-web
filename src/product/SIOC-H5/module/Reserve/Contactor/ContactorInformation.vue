<template>
  <div class="contactorInformation-container">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />
    <div class="contactorInformation-container__header">
      <div class="contactor-header" :style="{ background: sex === '男' ? '#3296F9' : '#FF819F' }">
        <img v-if="picture" :src="picture" alt="" />
        <span v-else>
          {{ name }}
        </span>
      </div>
      <span class="contactor-name">{{ name === '' ? '-' : name }}</span>
      <div class="contactor-age">
        <img v-if="sex === '男'" src="./assets/svg/man.svg" alt="" />
        <img v-else src="./assets/svg/woman.svg" alt="" />
        {{ sex }}
      </div>
    </div>
    <div class="contactorInformation-container__body">
      <div v-for="item in contactorInformationData" class="contactorInformation-item">
        <div class="contactorInformation-item__key">{{ item.label }}</div>
        <a
          v-if="item.showPhone && item.value !== ''"
          :href="'tel:' + item.value"
          class="contactorInformation-item__value"
        >
          {{ item.value }}
          <div v-if="item.value" class="value-img">
            <img src="./assets/svg/phone.svg" alt="" class="img-phone" />
          </div>
        </a>
        <div v-else class="contactorInformation-item__value">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';

import { useRouter } from 'vue-router';
import { Notify } from 'vant';
export default defineComponent({
  name: 'ContactorInformation',
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const loading = ref(true);
    const navBarConfig = ref({
      title: '联系人详情',
      type: 'left',
      path: '',
    });
    const name = ref(''); // 姓名
    const age = ref(''); // 年龄
    const sex = ref('男'); // 性别
    const picture = ref(''); // 头像

    const contactorInformation = ref({
      unit: {
        key: '单位',
        value: '',
        showPhone: false,
      },
      position: {
        key: '职务',
        value: '',
        showPhone: false,
      },
      phone: {
        key: '手机号码',
        value: '',
        showPhone: true,
      },
      familyPhone: {
        key: '家庭电话',
        value: '',
        showPhone: true,
      },
      workPhone: {
        key: '办公电话',
        value: '',
        showPhone: true,
      },
      otherPhone: {
        key: '其他电话',
        value: '',
        showPhone: true,
      },
      email: {
        key: '电子邮箱',
        value: '',
        showPhone: false,
      },
    });
    const contactorInformationData: any = ref({});
    contactorInformationData.value = getObjectKey(contactorInformation.value);
    // 联系人Id
    const contactorId: any = ref(
      router.currentRoute.value.params.contactorId
        ? router.currentRoute.value.params.contactorId
        : '',
    );
    /**
     * @param {Object} list
     * @returns {Object} result
     */
    function getObjectKey(list: any) {
      let column = Object.keys(list).map((item, index) => ({
        key: `key${index}`,
        label: list[item].key,
        value: list[item].value,
        showPhone: list[item].showPhone,
      }));
      return column;
    }
    /**
     * @param {string | number} contactorId 联系人Id
     * @description 获取联系人信息
     */
    function getContactorInformation(contactorId: string) {
      let requestData: any = ref({
        method: 'post',
        service: 'soc',
        url: `/mail/mailcontactor/info/${contactorId}`,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          loading.value = false;
          if (res.code === 0) {
            if (res.mailContactor) {
              name.value =
                res.mailContactor.name.length > 2
                  ? res.mailContactor.name.substring(1, res.mailContactor.name.length)
                  : res.mailContactor.name;
              age.value = res.mailContactor.age;
              sex.value = res.mailContactor.sex === 1 ? '女' : '男';
              picture.value = res.mailContactor.images;
              contactorInformation.value.unit.value = res.mailContactor.group.replace(',', '');
              contactorInformation.value.position.value = res.mailContactor.position;
              contactorInformation.value.phone.value = res.mailContactor.phone
                ? res.mailContactor.phone
                : res.mailContactor.mobile1
                ? res.mailContactor.mobile1
                : res.mailContactor.mobile2;
              contactorInformation.value.familyPhone.value = res.mailContactor.homeTel;
              contactorInformation.value.workPhone.value = res.mailContactor.officeTel;
              contactorInformation.value.otherPhone.value = res.mailContactor.otherTel;
              contactorInformation.value.email.value = res.mailContactor.email;
              contactorInformationData.value = getObjectKey(contactorInformation.value);
            }
          }
        })
        .catch((error: any) => {
          loading.value = false;
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取联系人信息失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    onMounted(() => {
      getContactorInformation(contactorId.value);
    });

    return {
      navBarConfig,
      contactorInformationData,
      name,
      age,
      sex,
      picture,
    };
  },
});
</script>
<style lang="scss">
.contactorInformation-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f7fa;

  .contactorInformation-container__header {
    width: 100%;
    height: 1.6rem;
    margin-bottom: 0.21rem;
    background-image: url('./assets/svg/bg.svg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 0.2rem 0.32rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .contactor-header {
      width: 1.2rem;
      height: 1.2rem;
      background: orange;
      border-radius: 50%;
      margin-right: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;

      & > span {
        font-size: 0.36rem;
        font-weight: 400;
        color: #ffffff;
      }
    }

    .contactor-name {
      font-size: 0.36rem;
      font-weight: 500;
      color: #333333;
    }

    .contactor-age {
      height: 0.36rem;
      font-size: 0.24rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.5rem;
      margin-left: 0.24rem;

      & > img {
        width: 0.23rem;
        height: 0.22rem;
      }
    }
  }

  .contactorInformation-container__body {
    flex: 1;
    width: 100%;
    overflow: auto;
    background: #ffffff;
    padding: 0 0.32rem;
    box-sizing: border-box;

    .contactorInformation-item {
      width: 100%;
      height: 0.9rem;
      line-height: 0.9rem;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 0.01rem solid #dddddd;
      padding: 0 0.08rem;

      .contactorInformation-item__key {
        font-size: 0.28rem;
        font-weight: 400;
        color: #999999;
        line-height: 0.6rem;
        width: 2.08rem;
      }

      .contactorInformation-item__value {
        flex: 1;
        font-size: 0.28rem;
        font-weight: 500;
        color: #333333;
        display: flex;
        align-items: center;

        .value-img {
          width: 0.28rem;
          height: 0.28rem;
          overflow: hidden;
          margin-left: 0.4rem;
          .img-phone {
            width: 0.28rem;
            height: 0.28rem;
            filter: drop-shadow(#0091ff 50px 0);
            transform: translateX(-50px);
          }
        }
      }
    }
  }
}
</style>
