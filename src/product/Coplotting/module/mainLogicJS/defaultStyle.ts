import { ref, getCurrentInstance, onMounted } from 'vue';

function defaultStyle() {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    console.log(instance, '$http');
    console.log($http, '$http');

    const spotDafaultStyle = ref({ src: '' });
    const lineDafaultStyle = ref({ stylePropertyEntity: {} });
    const noodleDafaultStyle = ref({ stylePropertyEntity: {} });
    const otherDafaultStyle = ref({ stylePropertyEntity: {} });
    // 获取默认样式
    function getDafault(type:number) {
      const request:any = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistbasicclass/getDafault',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          type,
        },
      };
      return $http(request);
    }
    // 点
    getDafault(0).then((r:any) => {
      if (r.data) {
        const { data } = r;
        const style = data.statusList ? data.statusList[0] : {};
        style.src = (window as any).config.baseURL + style.iconUrl;
        spotDafaultStyle.value = style;
      }
    });
    // 面
    getDafault(1).then((r:any) => {
      if (r.data) {
        const { data } = r;
        const style = data.statusList ? data.statusList[0] : {};
        style.stylePropertyEntity.fillOpacity /= 100;
        style.stylePropertyEntity.strokeWidth = style.stylePropertyEntity.lineHeight;
        noodleDafaultStyle.value = style;
      }
    });
    // 线
    getDafault(2).then((r:any) => {
      if (r.data) {
        const { data } = r;
        const style = data.statusList ? data.statusList[0] : {};
        style.stylePropertyEntity.fillOpacity /= 100;
        style.stylePropertyEntity.strokeWidth = style.stylePropertyEntity.lineHeight;
        lineDafaultStyle.value = style;
      }
    });
    // 其他
    getDafault(3).then((r:any) => {
      if (r.data) {
        const { data } = r;
        const style = data.statusList && data.statusList[0] ? data.statusList[0] : {};
        if (style.stylePropertyEntity) {
          style.stylePropertyEntity.fillOpacity /= 100;
          style.stylePropertyEntity.strokeWidth = style.stylePropertyEntity.lineHeight;
        }
        otherDafaultStyle.value = style;
      }
    });
    return {
        spotDafaultStyle,
        lineDafaultStyle,
        noodleDafaultStyle,
        otherDafaultStyle,
    };
}

export default defaultStyle;
