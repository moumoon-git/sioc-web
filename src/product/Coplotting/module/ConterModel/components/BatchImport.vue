<template>
  <div v-show="visFlag" :class="$style.BatchImport">
    <div>
      <header>
        <span>新增属性</span>
        <span @click="visFlag = false" />
      </header>
      <main>
        <ul>
          <li>
            <span>模板类别</span>
            <div>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="(item, i) in options"
                  :key="i"
                  :label="item.className"
                  :value="item.id"
                />
              </el-select>
              <span @click="loadTemplate">下载模板</span>
            </div>
          </li>
          <li>
            <span>导入文件</span>
            <div>
              <div>
                <el-input
                  v-model="input"
                  autocomplete="off"
                  readonly
                  placeholder="请选择文件"
                  @click="uploadFile"
                />
                <span @click="loadIng">删除</span>
              </div>
              <span @click="uploadFile">选择文件</span>
            </div>
          </li>
          <li>
            <span>导入地图类型</span>
            <div>
              <el-radio-group v-model="radio">
                <el-radio :label="1"> 百度地图 </el-radio>
                <el-radio :label="2"> 高德地图 </el-radio>
                <el-radio :label="3"> 天地图 </el-radio>
              </el-radio-group>
            </div>
          </li>
        </ul>
      </main>
      <footer>
        <el-button type="primary" @click="save"> 导入 </el-button>
        <el-button @click="visFlag = false"> 取消 </el-button>
      </footer>
    </div>
  </div>
  <!-- 上传文件的按钮 -->
  <Upfile
    ref="fileUpload"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
            application/vnd.ms-excel"
    result="file"
    :multiple="false"
    @sendMsg="getFileUploadData"
  />
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
// 引入上传文件组件
import Upfile from '@/product/Coplotting/generalparts/Upload/UploadFile.vue';

export default defineComponent({
  components: {
    Upfile,
  },
  provide: {},
  setup() {
    // 获取全局参数
    const instance = getCurrentInstance();
    const route = useRoute();
    const store = useStore(); // 使用vuex
    const thisMapId: any = ref(0); // 当前的地图id
    thisMapId.value = route.query.mapId;
    const { $http, $downFile }: any =
      instance?.appContext.config.globalProperties;
    const radio = ref<number | any>(1);
    const options = ref([{}]);
    const value = ref('');
    const input = ref('');
    const visFlag = ref(false);
    // 上传文件的
    const fileUpload = ref<HTMLElement | null | any>(null);
    const echo = ref<any>({ txt: [], videoAndImg: [] });
    // 读取到的xlxs文件数据
    function fileData(params: any) {
      console.log(params);
    }
    // 恢复文件框的初始值
    function loadIng() {
      echo.value.txt = [];
      input.value = '';
    }
    // 选择文件
    function uploadFile() {
      loadIng();
      fileUpload.value.uploadFile();
    }
    function getFileUploadData(params: any) {
      echo.value = params;
      input.value = echo.value.txt.length !== 0 ? echo.value.txt[0].name : '';
      // console.log(echo.value);
    }
    // 保存
    function save() {
      if (echo.value.txt.length !== 0 && echo.value.txt[0].serviceData) {
        const formData = new FormData();
        formData.append('file', echo.value.txt[0].file); // 导入文件
        formData.append('basicClassId', value.value); // 分类id
        formData.append('mapId', thisMapId.value); // 地图id
        formData.append('mapType', radio.value); // 地图类型(1.百度2.高德3.天地)
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistbasicclass/xlsInput',
          headers: {
            'Content-Type': 'application/json',
          },
          data: formData,
        };
        $http(request).then((res: any) => {
          if (res.code === 0) {
            visFlag.value = false;
            ElMessage.success('保存成功');
            store.commit(
              'coplotting/SET_saveId',
              Math.floor(Math.random() * 100000000),
            );
          }
        });
      }
    }
    // 加载模板类别
    function loadClass() {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistbasicclass/listOption',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          basicClassType: 0,
        },
      };
      $http(request).then((res: any) => {
        // console.log(res.data.data);
        if (res.code === 0) {
          options.value = res.data.data;
        }
      });
    }
    loadClass();
    // 导入模板
    function loadTemplate() {
      const data: any = options.value.filter((x: any) => x.id === value.value);
      if (data.length !== 0) {
        const request = {
          method: 'post',
          baseURL: (window as any).config.baseURL,
          url: `${
            (window as any).config.service.coplotting
          }/assist/assistbasicclass/getTemplate`,
          headers: {
            'Content-Type': 'application/json',
            token:
              document.cookie.match(/token=([^;]*)/)?.[1] ||
              (window as any).TOKEN,
          },
          data: data[0],
          responseType: 'arraybuffer',
        };
        $downFile(request).then((res: any) => {
          console.log(res);
        });
      }
    }
    return {
      // 读取到的xlxs文件数据
      fileData,
      radio,
      options,
      value,
      input,
      visFlag,
      fileUpload,
      uploadFile,
      getFileUploadData,
      loadTemplate,
      loadIng,
      save,
    };
  },
});
</script>

<style lang="scss" module>
.BatchImport {
  position: fixed;
  z-index: 10001;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    width: 850px;
    height: 360px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    border: 0px solid #979797;
    & > header {
      height: 56px;
      background: #f1f4f6;
      border-radius: 7px 7px 0px 0px;
      padding: 0 10px 0 30px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      justify-content: space-between;
      & > span {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        &:last-child {
          width: 15px;
          height: 15px;
          cursor: pointer;
          background: url('../assets/close.svg') no-repeat;
          background-size: 100% 100%;
          display: block;
        }
      }
    }
    & > main {
      overflow: hidden;
      height: calc(100% - 138px);
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        & > li {
          margin-top: 20px;
          display: flex;
          align-items: center;
          height: 42px;
          & > span {
            width: 224px;
            display: block;
            text-align: right;
            font-size: 17px;
            font-weight: 400;
            color: #555555;
            margin-right: 28px;
          }
          & > div {
            display: flex;
            align-items: center;
            & > div {
              position: relative;
              width: 422px;
              & > span {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 14px;
                margin: 0;
                font-size: 17px;
                font-weight: 400;
                color: #f66e6e;
                line-height: 40px;
                cursor: pointer;
              }
            }
            & > span {
              cursor: pointer;
              font-size: 17px;
              font-weight: 400;
              color: #0091ff;
              margin-left: 24px;
            }
          }
        }
      }
    }
    & > footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid rgba(233, 236, 241, 1);
      padding-right: 24px;
      box-sizing: border-box;
      height: 82px;
      & > button {
        height: 42px;
        width: 72px;
      }
    }
  }
}
</style>
