<template>
  <div :class="$style.SystemAccess">
    <el-checkbox v-model="x.active" @change="checkChange(x)" v-for="(x,i) in access" :key="i" >{{ x.name }}</el-checkbox>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';

export default defineComponent({
  setup() {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http, $mapSetSpot }: any = instance?.appContext.config.globalProperties;
    // 设置落点的script
    const { setDrawConverge } = $mapSetSpot;
    // 南海接入数据的数据格式
    const access = ref<any>([
      {
        // 图层名
        key: 'CLFXD_CGCS2000',
        // 接口
        api: 'http://10.171.142.15:8080/GISServices/spService/cfb7457737d841efs28daffa2d058e7800/services/map-NH_BYFXD/rest/maps/CLFXD_CGCS2000/queryResults.json?returnPostAction=true&getMethodForm=true&returnContent=true',
        // 控制勾选和显示的状态锁
        active: false,
        // 显示名
        name: '易涝风险点图层',
      },
    ]);

    // 发起图层数据请求
    function getCoverage() {
      access.value.forEach((x:any) => {
        const request = {
          method: 'post',
          baseURL: x.api,
          data: {
            queryMode: 'BoundsQuery',
            bounds: {
              leftBottom: { x: 112.8185, y: 22.78872 },
              rightTop: { x: 113.28493, y: 23.33666 },
            },
            distance: 1,
            queryParameters: {
                queryParams: [{ attributeFilter: 'SMID %26gt; 0', name: 'CLFXD@NH_BYFXD' }],
                startRecord: 0,
                expectCount: 20,
                networkType: 'LINE',
                queryOption: 'ATTRIBUTEANDGEOMETRY',
            },
            keywords: '',
            spatialQueryMode: 'INTERSECT',
          },
        };
        $http(request).then((res: any) => {
          // console.log(res.recordsets[0].features);
          const data = res?.recordsets; // [0].features
          if (data.length !== 0) {
            const features = data[0].features.reduce((pre:any, ele:any, i:number) => {
              const obj:any = {};
              ele.fieldNames.forEach((y:any, ind:number) => {
                obj[y] = ele.fieldValues[ind];
              });
              obj['longitude'] = obj['经度（X）'];
              obj['latitude'] = obj['维度（Y）'];
              obj['handleType'] = 'flood';
              pre.push(obj);
              return pre;
            }, []);
            const imgInfo = {
              img: require('../../assets/imgs/NL.svg'),
              width: 40,
              height: 40,
            };
            setDrawConverge(x.key, features, imgInfo);
          }
        });
      });
    }

    // 勾选
    function checkChange(params: any) {
      if (params.active) {
        (window as any).map.setCoverageShow(params.key);
      } else {
        (window as any).map.setCoverageHide(params.key);
      }
    }
    onMounted(() => {
      getCoverage();
    });
    return {
      access,
      checkChange,
    };
  },
});
</script>
<style lang="scss" module>
.SystemAccess {
  padding: 10px;
}
</style>
