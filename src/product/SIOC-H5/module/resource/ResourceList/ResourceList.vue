<template>
  <!-- 搜索框内容 -->
  <header>
    <van-search v-model="search" placeholder="请输入事件名称" @search="onSearch" @input="onSearch"></van-search>
  </header> 
  <main>
    <section class="resource-card" v-for="(item, index) in resourceList" :key="index" @click="$router.push({path:`/resourceHandle/${item.id}`})">
      <div class="resource-card-title">
        <label class="resource-card-title__title">{{item.name}}</label>
      </div>
      <div class="resource-card-content">
        {{ item.remark }}
      </div>
      <div class="resource-card-sth">
        <template
          v-for="(resourceItem,resourceIndex) in item.resources"
          :key="resourceIndex"
        > 
          <!-- 资源 -->
          <span>{{resourceItem.name}}</span>
        </template>         
      </div>
      <div class="resource-card-file">
        <template
          v-for="(fileItem,fileIndex) in item.pics"
          :key="fileIndex"
        > 
          <!-- 图片 -->
          <img :src="baseURL+'/fileupload'+fileItem.path+fileItem.name"> 
        </template> 
      </div>
      <div class="resource-card-location">
        <i class="resource-card-location-icon"></i>
        <label class="resource-card-location-label">{{ item.address }}</label>
      </div>
      <div class="resource-card-date">
        <i class="resource-card-date-icon"></i>
        <label class="resource-card-date-label">发布时间：{{item.sysDtCreate}}</label>
      </div>
    </section>
  </main>   
  <footer>
    <div  @click="$router.push({path:`/resourceHandle/0`})">现场支援</div>
  </footer>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'ResourceList',
  components: {
  },
  setup() {
    // 资源列表
    let resourceList = ref([]);
    let search = ref('');
    // 文件服务器前缀
    const baseURL = window.config.baseURL;
    return { resourceList,search,baseURL};
  },
  data() {
    return {
    };
  },
  mounted() {
    this.getResourceList()
  },
  methods: {
    // 获取资源列表
    getResourceList() {
      const request = {
        method: 'get',
        url: '/event/resource/apply/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params:{
          keyword:this.search
        }
      }
      this.$http(request)
        .then((response) => {
          console.log('/event/resource/apply/list', response);
          if (response.errorcode === 0 && response?.data) {
            this.resourceList = response.data
            console.log(this.resourceList)
          } else {
            this.$notify({
              type: 'danger',
              message: `获取资源列表数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        }).catch((error) => {
          this.$notify({
            type: 'danger',
            message: `获取资源列表数据失败，错误信息：${error}`,
          });
        });      
    },
    // 搜索
    onSearch() {
      this.getResourceList()
    },
  },
});
</script>
<style lang='scss' scoped>
  header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #fff;
    border-top: 0.01rem solid #eeeeee;
    padding: 0.2rem 0.3rem;
    :deep(.van-search) {
      padding: 0rem;
      margin: 0 0.14rem;
      flex: 1;
      .van-cell__value {
        display: flex;
      }
      .van-search__content {
        background: #F2F2F2;
      }
      .van-field__control::-webkit-input-placeholder{
        color: #999999;
      }
    }
  }
  main {
    height: 84vh;
    overflow: auto;
    flex: 1;
    background: #F2F2F2;
    .resource-card {
      width: 95%;
      margin: 0.2rem auto;
      background: #FFFFFF;
      border-radius: 0.04rem;
      overflow: auto;
      padding: 0.2rem 0rem;
      & > div {
        position: relative;
        padding: 0rem 4%;
        margin: 0.05rem 0rem;
      }
      .resource-card-title {
        display: flex;
        align-items: center;
        .resource-card-title__title {
          color: #333333;
          font-weight: 500;
          font-size: 0.4rem;
        }
      }
      .resource-card-content {
        color: #666666;
        font-size: 0.25rem;
      }
      .resource-card-sth {
        display: flex;
        flex-wrap: wrap;
        span {
          margin-right: 15px;
          padding: 3px;
          height: 21px;
          line-height: 21px;
          background: #dcfbf0;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 400;
          color: #0ac384;
        }        
      }

      .resource-card-file {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &>div {
          width: 100%;
        }
        img {
          width: 48%;
          height: 0.98rem;
          margin: 0.05rem 0rem;
        }
        :deep(.document-list-layout) {
          .document_name {
            font-size: 0.25rem;
          }
        }

      }

      .resource-card-location {
        .resource-card-location-icon {
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          background: url(./assets/locationIcon.svg) no-repeat 0rem/0.2rem;
        }
        .resource-card-location-label {
          color: #999999;
          margin-left: 0.05rem;
        }
      }
      .resource-card-date {
        .resource-card-date-icon {
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          background: url(./assets/dateIcon.svg) no-repeat 0rem/0.2rem;
        }
        .resource-card-date-label {
          color: #999999;
          margin-left: 0.05rem;
        }
      }
    }
  }  

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 77px;
    background: #FFFFFF;
  }

  footer div {
    margin: 16px auto;
    text-align: center;
    width: 320px;
    height: 45px;
    line-height: 45px;
    background: linear-gradient(360deg, #2B80FF 0%, #65BCFF 100%);
    box-shadow: 0px 6px 12px 0px rgba(12, 126, 161, 0.35);
    border-radius: 75px;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }
</style>
