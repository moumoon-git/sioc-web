<template>
  <NavBar :config="navBarConfig" />
  <div :class="$style.list">
    <div :class="$style.box">
      <p>今日</p>
      <p>签到</p>
    </div>
    <div :class="$style.box">
      <p>{{ total }}</p>
      <p :class="$style.gray">签到人数</p>
    </div>
    <div :class="$style.box">
      <p :class="$style.orange">{{ waitCheck }}</p>
      <p :class="$style.gray">待审批</p>
    </div>
    <div :class="$style.box">
      <p :class="$style.green">{{ hasCheck }}</p>
      <p :class="$style.gray">已审批</p>
    </div>
    <div :class="$style.box">
      <p :class="$style.red">{{ disagreeCheck }}</p>
      <p :class="$style.gray">已驳回</p>
    </div>
    <div :class="$style.scroll">
      <div
        v-for="item in checkList"
        :key="item?.id"
        :class="{
          [$style.redframe]: item.auditStatus === 2,
          [$style.greenframe]: item.auditStatus === 1,
          [$style.orangeframe]: item.auditStatus === 0,
        }"
      >
        <div
          :class="{
            [$style.redmatrix]: item.auditStatus === 2,
            [$style.greenmatrix]: item.auditStatus === 1,
            [$style.orangematrix]: item.auditStatus === 0,
          }"
        >
          {{
            item.auditStatus === 2 ? '已驳回' :
            item.auditStatus === 1 ? '已审批' : '待审批'
          }}
        </div>
        <p>
          <span>签到时间</span>{{ item?.signDate || '-' }}
        </p>
        <p>
          <span>姓名</span>{{ item?.name || '-' }}
        </p>
        <p>
          <span>单位</span>{{ item?.groupName || '-' }}
        </p>
        <p>
          <span>职务</span>{{ item?.duty || '-' }}
        </p>
        <p>
          <span>电话</span>{{ item?.phone || '-' }}
        </p>
        <p>
          <span>备注</span>{{ item?.remark || '-' }}
        </p>
        <div v-if="!item.auditStatus">
          <button
            :class="$style.disagree"
            @click="disagree(item)"
          >
            驳回
          </button>
          <button
            :class="$style.agree"
            @click="agree(item)"
          >
            通过
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
} from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'vant';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';

export default defineComponent({
  name: 'SignCheck',
  components: {
    NavBar,
  },
  setup() {
    const checkList: any = ref([]); // 列表
    const total = ref(0); // 签到人数
    const waitCheck = ref(0); // 待审批
    const hasCheck = ref(0); // 已审批
    const disagreeCheck = ref(0); // 已驳回
    const router = useRouter(); // 路由跳转
    const { $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
    // 导航栏配置
    const navBarConfig = ref({
      title: '签到审批',
      type: 'left',
      path: '/HomePage',
    });
    const contactorId = !!(window as any)?.task?.getIsApp() ? Number((window as any)?.task?.getUserId()) : Number(localStorage.getItem('userId')); // 登录用户Id
    // 获取列表
    function getList() {
      const request = {
        method: 'get',
        url: '/eventconduct/eventSceneonductSign/sign/auditList',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          contactorId,
          dateTime: `${String(new Date().getFullYear()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, // 今天
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          checkList.value = response.data.signEntityList;
          total.value = response.data.total;
          waitCheck.value = response.data.readyAuditNum;
          hasCheck.value = response.data.passAuditNum;
          disagreeCheck.value = response.data.rejectAuditNum;
        }
      });
    }
    // 通过
    function agree(item: any) {
      const request = {
        method: 'post',
        url: `/eventconduct/eventSceneonductSign/sign/audit?id=${item.id}&auditStatus=1`,
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          Notify({
            type: "success",
            message: '签到审核已通过',
          });
          getList();
        }
      });
    }
    // 驳回
    function disagree(item: any) {
      const request = {
        method: 'post',
        url: `/eventconduct/eventSceneonductSign/sign/audit?id=${item.id}&auditStatus=2`,
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          Notify({
            type: "success",
            message: '签到审核已驳回',
          });
          getList();
        }
      });
    }
    onMounted(() => {
      getList();
    });
    return {
      checkList,
      total,
      waitCheck,
      hasCheck,
      disagreeCheck,
      getList,
      agree,
      disagree,
      navBarConfig,
      contactorId,
    };
  },
});
</script>

<style lang="scss" module>
@mixin allmatrix {
  width: 42px;
  height: 0px;
  border-top: 0px;
  border-right: 20px solid transparent;
  border-left: 20px solid transparent;
  transform: rotate(45deg);
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  float: right;
  margin-right: -29px;
  margin-top: 2px;
}
@mixin allframe {
  border-radius: 8px;
  margin: 10px;
  padding: 10px;
  width: 88%;
  position: relative;
  .orangematrix {
    border-bottom: 20px solid #FF7A45;
    @include allmatrix;
  }
  .greenmatrix {
    border-bottom: 20px solid #16C88B;
    @include allmatrix;
  }
  .redmatrix {
    border-bottom: 20px solid #F94E36;
    @include allmatrix;
  }
  p {
    font-size: 17px;
    margin: 4px 0px;
    color: #333333;
    span {
      font-size: 17px;
      color: #999999;
      margin-right: 15px;
    }
  }
  .disagree {
    width: 142px;
    height: 39px;
    background: rgba(249, 78, 54, 0.1);
    border-radius: 8px;
    border: 1px solid #F94E36;
    color: #F94E36;
    margin: 5px 0px 0px 20px;
  }
  .agree {
    width: 142px;
    height: 39px;
    background: rgba(22, 200, 139, 0.1);
    border-radius: 8px;
    border: 1px solid #16C88B;
    color: #16C88B;
    margin: 5px 0px 0px 20px;
  }
}
.list {
  width: 100vw;
  height: 100vh;
  position: relative;
  .box {
    width: 76px;
    float: left;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    p {
      color: #323233;
      margin: 0px;
      font-size: 17px;
      text-align: center;
    }
    .gray {
      color: #969799;
    }
    .red {
      color: #F94E36;
    }
    .orange {
      color: #FF7A45;
    }
    .green {
      color: #16C88B;
    }
  }
  .scroll {
    width: 100%;
    height: 87vh;
    overflow: auto;
    background: #F5F7FA;
    position: relative;
    .redframe {
      background: linear-gradient(180deg, rgba(248, 78, 54, 0.08) 0%, rgba(248, 78, 54, 0) 100%);
      @include allframe;
    }
    .greenframe {
      background: linear-gradient(180deg, rgba(22, 199, 138, 0.08) 0%, rgba(22, 199, 138, 0) 100%);
      @include allframe;
    }
    .orangeframe {
      background: linear-gradient(180deg, rgba(254, 121, 69, 0.08) 0%, rgba(254, 121, 69, 0) 100%);
      @include allframe;
    }
  }
}
</style>
