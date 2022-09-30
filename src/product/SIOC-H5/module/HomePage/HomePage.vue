<template>
  <div :class="$style.homePage">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />
    <!-- 业务入口 -->
    <ul :class="$style['entrance-list']">
      <li v-for="item in list" :class="$style[item.className]" @click="handleJump(item.path)">
        <span :class="$style.name">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {useRouter} from 'vue-router';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
export default defineComponent({
  name: 'HomePage',
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const list = ref([
      {
        name: '预案响应',
        className: 'reserve',
        path: '/ReserveList'
      },
      {
        name: '任务管理',
        className: 'task',
        path: '/TaskList'
      },
      {
        name: '签到审批',
        className: 'signIn',
        path: '/SignCheck'
      },
      {
        name: '资源管理',
        className: 'resource',
        path: '/ResourceList'
      }
    ])
    const navBarConfig = ref({
      title: '应急通',
      type: '',
      path: '',
    });
    /**
     * @description 模块跳转
     */
    function handleJump(path: string) {
      router.push({
        path: path
      })
    }
    return {
      list,
      handleJump,
      navBarConfig
    }
  }
})
</script>
<style lang="scss" module>
.homePage {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.name {
  font-size: 0.4rem;
  font-weight: 600;
  color: #FFFFFF;
  position: absolute;
  top: 0.91rem;
  left: 0.49rem;
}

.entrance-list {
  padding-top: 0.62rem;
  flex: 1;
}

// 图片公共样式
.entrance-img {
  width: 6.5rem;
  height: 2.6rem;
  position: relative;
  margin-bottom: 0.27rem;
}

.task {
  background: url('./assets/svg/task.svg');
  background-size: 6.5rem 2.6rem;
  background-repeat: no-repeat;
  @extend .entrance-img;
}
.reserve {
  background: url('./assets/svg/reserve.svg');
  background-size: 6.5rem 2.6rem;
  background-repeat: no-repeat;
  @extend .entrance-img;
}
.signIn {
  background: url('./assets/svg/signIn.svg');
  background-size: 6.5rem 2.6rem;
  background-repeat: no-repeat;
  @extend .entrance-img;
}
.resource {
  background: url('./assets/svg/resource.svg');
  background-size: 6.5rem 2.6rem;
  background-repeat: no-repeat;
  @extend .entrance-img;
}

</style>