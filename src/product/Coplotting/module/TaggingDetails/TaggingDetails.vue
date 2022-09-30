<template>
  <div
    :class="
      enter === 'commandBrain'
        ? $style.CommandBrainTaggingDetail
        : $style.TaggingDetails
    "
  >
    <div>
      <ul :class="$style.TaggingDetailsUl">
        <!-- 名称 -->
        <li>
          <span>名称</span>
          <div
            :class="[
              $style.border,
              $style.name,
              !editOrDisplay ? $style.editInput : '',
            ]"
          >
            <input v-model="markName" type="text" :disabled="!editOrDisplay" />
            <!-- <Switchs
              ref="switchs"
              v-model="SwitchsFlag"
              :enter="enter"
              :disabled="!editOrDisplay"
              :width="enter === 'commandBrain' ? 44 : 62"
              :height="enter === 'commandBrain' ? 22 : 31"
              :activebgr="enter === 'commandBrain' ? '#00C1DE' : '#0091FF'"
            /> -->
          </div>
        </li>
        <!-- 分组 -->
        <li>
          <span>分组</span>
          <div :class="[$style.select, !editOrDisplay ? $style.editInput : '']">
            <el-select
              v-model="grouping"
              :popper-append-to-body="false"
              placeholder="请选择"
              :disabled="!editOrDisplay"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </div>
        </li>
        <!-- 分类 -->
        <li>
          <span>分类</span>
          <div :class="!editOrDisplay ? $style.editInput : ''">
            <SelectClass
              ref="selectClass"
              v-model="classEcho"
              :enter="enter"
              :class-data="classData"
              :disabled="!editOrDisplay"
              @selecrData="selecrData"
            />
          </div>
        </li>
        <!-- 状态 -->
        <li>
          <span>状态</span>
          <div :class="!editOrDisplay ? $style.editInput : ''">
            <SelectClass
              ref="selectState"
              v-model="classStateEcho"
              :enter="enter"
              modelflag="stateSelect"
              :disabled="!editOrDisplay"
              @selectState="selectStateFun"
            />
          </div>
        </li>
        <!-- 属性 -->
        <li v-if="attributeFlag && definedList.length !== 0">
          <span>属性</span>
          <div style="border: none">
            <ul :class="$style.attribute">
              <li
                v-for="(x, index) in definedList"
                :key="index"
                :class="$style.border"
              >
                <div>{{ x.name }}</div>
                <input
                  v-if="x.type !== 3 && x.type !== 6"
                  v-model="x.value"
                  :disabled="!editOrDisplay"
                  type="text"
                  @input="rulesVal(x, $event)"
                />
                <el-select
                  v-else-if="x.type === 6"
                  v-model="x.value"
                  :popper-append-to-body="false"
                  placeholder="请选择"
                  :disabled="!editOrDisplay"
                >
                  <el-option
                    v-for="item in x.dicList"
                    :key="item.id"
                    :label="item.dictValue"
                    :value="item.dictValue"
                  />
                </el-select>
                <el-date-picker
                  v-else-if="x.type === 3"
                  v-model="x.value"
                  :disabled="!editOrDisplay"
                  type="date"
                  placeholder="选择日期"
                />
                <el-time-picker
                  v-else-if="x.type === 6"
                  v-model="x.value"
                  placeholder=""
                >
                </el-time-picker>
              </li>
            </ul>
          </div>
        </li>
        <!-- 系统属性 -->
        <li v-if="systemPropertiesFlag">
          <span>系统属性</span>
          <div style="border: none">
            <ul :class="$style.attribute">
              <li v-if="systemProper.creatorFlag" :class="$style.border">
                <div>标注创建人</div>
                <input
                  type="text"
                  disabled
                  :value="`${systemProper.creator} ${systemProper.createTime}`"
                />
              </li>
              <li v-if="systemProper.editorFlag" :class="$style.border">
                <div>最后编辑人</div>
                <input
                  type="text"
                  disabled
                  :value="systemProper.editor + systemProper.editTime"
                />
              </li>
              <li v-if="systemProper.addressFlag" :class="$style.border">
                <div>地图地址</div>
                <input disabled type="text" :value="systemProper.address" />
              </li>
            </ul>
          </div>
        </li>
        <!-- 附件 -->
        <li>
          <span>附件</span>
          <div
            v-if="editOrDisplay"
            :class="$style.enclosure"
          >
            <div>
              <span>本地上传：</span>
              <button @click="uploadFile">
                <span>上传文件</span>
              </button>
              <div>
                网络上传：
                <el-radio v-model="radioVal" label="image">图片</el-radio>
                <el-radio v-model="radioVal" label="video">视频</el-radio>
              </div>
              <div>
                <div :class="[$style.name, $style.uploadNetwork]">
                  <input v-model="uploadNetworkVal" type="text" />
                  <el-button type="primary" @click="addUploadNetworkVal">
                    添加
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 提示 -->
      <div v-if="editOrDisplay" :class="$style.tips">
        备注：（注：文档/图片大小不超过10M，视频不超过100M；）
      </div>
      <!-- 文件显示 -->
      <!-- 图片和视频 -->
      <ul :class="$style.exhibition">
        <li v-for="(item, index) in echo.videoAndImg" :key="index">
          <img
            v-if="item.type === 'image' || item.handleType === 'image'"
            :src="item.src"
            alt=""
            @click="seeMore('img')"
          />
          <!-- <video v-else :src="item.src" @click="play(item, $event)" /> -->
          <!-- <div
            v-if="item.type !== 'image' && !item.play"
            :class="$style.play"
            @click="play(item, $event)"
          /> -->
          <video v-else :src="item.src" @click="seeMore('video')" />
          <div
            v-if="item.type !== 'image' && item.handleType !== 'image' && !item.play"
            :class="$style.play"
            @click="seeMore('video')"
          />
          <span
            v-show="editOrDisplay"
            @click="deleteFile(echo.videoAndImg, Number(index), item)"
          />
          <div v-if="!item.serviceData && editOrDisplay && !item.fileUrl">
            <div></div>
          </div>
        </li>
      </ul>
      <!-- 文档 -->
      <ul :class="$style.fileVis">
        <li
          v-for="(item, index) in echo.txt"
          :key="index"
          @click="seeMore('enclosure')"
        >
          <span :class="$style[item.type + '-icon']" />
          <div>
            {{ item.name || item.fileName + item.fileSuffix || item.fileUrl }}
          </div>
          <span
            v-if="item.type !== 'link' && addOrUpdata!== 'add' && !item.addFlag "
            :class="$style.fileVisDown"
            @click.stop="fileVisDownload(item)"
          >
            下载
          </span>
          <span
            v-show="editOrDisplay"
            :class="$style.close"
            @click.stop="deleteFile(echo.txt, Number(index), item)"
          />
        </li>
      </ul>
    </div>

    <!-- 保存或取消按钮 -->
    <div :class="$style.footer">
      <el-button
        v-if="editOrDisplay"
        type="primary"
        @click="taggingDetailsSave"
      >
        保存
      </el-button>
      <el-button
        v-else
        type="primary"
        :disabled="disabledValue"
        @click="
          () => {
            editOrDisplay = true;
            addOrUpdata = 'edit';
          }
        "
      >
        编辑
      </el-button>
      <el-button @click="colsePopup('close')"> 取消 </el-button>
    </div>
    <!-- 上传文件的按钮 -->
    <Upfile ref="fileUpload" @sendMsg="getFileUploadData" />
  </div>
</template>

  <script lang="ts">
import { useStore } from 'vuex';
import {
  defineComponent,
  ref,
  getCurrentInstance,
  watch,
  onMounted,
} from 'vue';
// 开关
import { ElMessage } from 'element-plus';
// 引入上传文件组件
import Upfile from '@/product/Coplotting/generalparts/Upload/UploadFile.vue';
import { reject } from 'node_modules/@types/lodash';
import Switchs from './components/Switchs.vue';
// 选择分类
import SelectClass from './components/SelectClass.vue';
// 下载
import EnclosureScript from '@/product/Coplotting/generalparts/SeeMore/components/script/EnclosureScript';

export default defineComponent({
  components: {
    Switchs,
    SelectClass,
    Upfile,
  },
  props: {
    enter: {
      type: String,
      // 空是协同标绘中进入，commandBrain为指挥一张图时进入
      default: '',
    },
  },
  setup(props, context) {
    const store = useStore(); // 使用vuex
    // 获取全局参数
    const instance = getCurrentInstance();
    // console.log(store.state.coplotting.mapId);
    const thisMapId: any = ref(store.state.coplotting.mapId); // 当前的地图id
    const { $http, $downFile }: any =
      instance?.appContext.config.globalProperties;
    const { download } = EnclosureScript();
    // 显示名字开关
    const SwitchsFlag = ref<boolean>(true);
    // 获取开关的el
    const switchs: any = ref<HTMLElement | null>(null);
    // 分组选择的数据
    const options: any = ref([]);
    const grouping = ref<string>('');
    const markName = ref<string>('');
    // 操作点的数据
    const handlePontData: any = ref({});
    handlePontData.value = store.state.coplotting.detailsPopUp.handleData;
    const { taggingInfo } = store.state.coplotting;
    // 上传文件的
    const fileUpload = ref<HTMLElement | null | any>(null);
    const echo = ref<any>({ txt: [], videoAndImg: [] });
    // 网络路径上传时的类型选择
    const radioVal = ref<any>('image');
    function uploadFile() {
      fileUpload.value.uploadFile();
    }
    function getFileUploadData(params: any) {
      console.log(params);
      echo.value = params;
    }
    // 属性显示
    const attributeFlag = ref<boolean>(false);
    // 系统属性显示
    const systemPropertiesFlag = ref<boolean>(false);
    const selectState: any = ref<HTMLElement | null>(null);
    const selectClass: any = ref<HTMLElement | null>(null);
    // 上传网络路径的值
    const uploadNetworkVal = ref<string>('');
    // 属性数据
    const definedList: any = ref([]);
    // 系统属性
    const systemProper: any = ref({
      // 创建人
      creatorFlag: false,
      creator: '',
      createTime: '',
      // 编辑人
      editorFlag: false,
      editor: '',
      editTime: '',
      // 地址
      addressFlag: false,
      address: '',
    });
    // 整个详情的数据
    const saveData: any = ref({
      markRecord: {
        mapId: thisMapId.value, // 当前地图id
        groupId: 0, // 分组id grouping
        basicClassId: 0, // 基础分类id
        markType: 0, // 标注类型（0：点，2：线，1：面，3：其他) ，必填字段
        markName: '地质灾害点', // markName
        address: '', //
        longitude: 0, // 若是点线面则填第一个点
        laitude: 0,
        classtStatus: 0, // 状态id
        statusName: '一般', // 状态名称
        styleConfigIconId: 1,
        statusIconUrl: '/xxx/xxx.png', // 状态图标
        statusStyle: null, // 状态样式（json,线/面标绘时保存）
        isShowOnAddress: 1, // 是否显示在地图上（0：否，1：是）
        isShowMarkName: 0, // 是否显示标绘名称（0：否，1：是）
        propertyType: 1, // 属性类别 1表单 2表格
        coordinatesJsonObject: {},
      },
      tablePropertys: [],
      files: [],
      needSetValue: 0,
    });
    // 新增或者修改
    const addOrUpdata: any = ref('add'); // add updata
    // 是编辑还是显示
    const editOrDisplay = ref(true);
    // 分类信息
    const classData = ref([]);
    // 分类回显
    const classEcho = ref(0);
    // 分类状态回显
    const classStateEcho = ref(0);
    // 删除的附件
    const fileDeletedIds: any = ref([]);
    // 绘制完成的图形参数
    const graphicalObj = store.state.coplotting.graphicParameters;
    // 是否禁用编辑按钮（当没有权限的时候禁用按钮）
    const disabledValue = ref(false);
    if (localStorage.getItem('fromCoop') === 'coop') {
      disabledValue.value = true;
    } else {
      disabledValue.value = false;
    }
    // 添加网络路径到显示中
    function addUploadNetworkVal() {
      // 堆的存储
      echo.value = fileUpload.value.echo;
      if (uploadNetworkVal.value.trim()) {
        const obj: object = {
          name: '',
          type: 'link',
          handleType: radioVal.value,
          serviceData: {
            url: uploadNetworkVal.value,
          },
          src: uploadNetworkVal.value,
        };
        console.log(obj);
        echo.value.videoAndImg.push(obj);
        uploadNetworkVal.value = '';
      }
    }
    // 关闭弹窗
    function colsePopup(type = '') {
      const { handleData } = store.state.coplotting.taggingInfo;
      const st = {
        src:
          (window as any).config.baseURL +
          handleData?.markRecord?.statusIconUrl,
      };
      (window as any).map.setOneMarkerStyle(handlePontData.value, st);
      const openDeta = {
        handleType: '', // 操作类型 add添加 vis显示 edit编辑
        handleData: {}, // 操作的数据 包括获取详情的id
        flag: false, // 打开或者关闭
        title: '标注详情', // 详情弹窗时的模块 标注详情
      };
      // 保存完成之后关闭弹窗
      const obj = {
        title: '', // 详情弹窗时的模块 标注详情
        flag: false, // 是否打开
        handleData: {}, // 传入的数据
      };
      if (!type) {
        editOrDisplay.value = false;
        openDeta.flag = true;
      }
      store.commit('coplotting/SET_detailsPopUp', openDeta);
      store.commit('coplotting/SET_taggingInfo', obj);
      store.commit('coplotting/SET_DISABLEDVALUE', false);
    }
    // 获取状态信息
    function getStateData(id: number, flag: boolean) {
      const type: string = store.state.coplotting.detailsPopUp.handleType;
      const promise = new Promise((resolve, reject) => {
        const request = {
          method: 'get',
          service: 'coplotting',
          url: `/assist/assistbasicclass/info/${id}`,
          headers: {
            'Content-Type': 'application/json',
          },
          params: '',
        };
        $http(request).then((res: any) => {
          if (res.code === 0) {
            if (res.data && res.data.assistBasicClass) {
              const statusData = res.data.assistBasicClass.statusList;
              const typeNum = res.data.assistBasicClass.basicClassType;
              statusData.map((x: any) => {
                if (x.stylePropertyEntity) {
                  x.style = JSON.parse(JSON.stringify(x.stylePropertyEntity));
                  const obj = {
                    strokeWidth: x.stylePropertyEntity.lineHeight,
                    strokeOpacity: x.stylePropertyEntity.fillOpacity / 100,
                    fillOpacity: x.stylePropertyEntity.fillOpacity / 100,
                    strokeDashstyle:
                      x.stylePropertyEntity.lineType === 0 ? 'dash' : 'solid',
                    strokeColor: x.stylePropertyEntity.strokeColor,
                  };
                  Object.assign(x.style, obj);
                  if (typeNum === 2) {
                    x.style.strokeColor = x.stylePropertyEntity.fillColor;
                  }
                }
                if (x.isDefault === 1 && type !== 'edit') {
                  classStateEcho.value = x.id;
                }
              });
              statusData.map((ele: any) => {
                ele.src = (window as any).config.baseURL + ele.iconUrl;
              });
              setTimeout(() => {
                selectState.value.stateSelectData = statusData;
                selectState.value.typeNum = typeNum;
                selectClass.value.typeNum = typeNum;
              }, 20);
              attributeFlag.value = true;
              // 默认
              if (flag) {
                const definedLists = res.data.assistBasicClass.definedList;
                definedList.value = definedLists;
                definedList.value.map((x: any) => {
                  x.value = '';
                });
              }
            }
            resolve(res.data);
          }
        });
      });
      return promise;
    }
    // 选择了分类
    function selecrData(params: any) {
      // console.log(params);
      // console.log(handlePontData.value);
      saveData.value.markRecord.basicClassId = params.id;
      getStateData(params.id, true);
    }
    // 选择了状态
    function selectStateFun(params: any) {
      // console.log(params);
      // console.log(graphicalObj);
      console.log(handlePontData.value);
      const style = params.style ? params.style : params.stylePropertyEntity;
      let editFlag = false;
      if (graphicalObj.convergeName === 'lineOrNoodles') {
        editFlag = true;
      }
      switch (graphicalObj.type) {
        case 'spot':
          if (!params.style) {
            params.style = {};
          }
          params.style.src = params.src;
          (window as any).map.setOneMarkerStyle(
            handlePontData.value,
            params.style,
          );
          break;
        case 'line':
          // console.log(handlePontData.value);
          const lineStyle = JSON.parse(JSON.stringify(style));
          lineStyle.fillOpacity = 0;
          handlePontData.value.sourceStyle = style;
          (window as any).map.setSingleStyle(
            handlePontData.value,
            lineStyle,
            editFlag,
          );
          break;
        case 'noodles':
          // console.log(handlePontData.value);
          const noodlesStyle = JSON.parse(JSON.stringify(style));
          handlePontData.value.sourceStyle = style;
          (window as any).map.setSingleStyle(
            handlePontData.value,
            noodlesStyle,
            editFlag,
          );
          break;
        case 'other':
          // console.log(handlePontData.value);
          const otherStyle = JSON.parse(JSON.stringify(style));
          handlePontData.value.sourceStyle = style;
          (window as any).map.setSingleStyle(handlePontData.value, otherStyle);
          break;
        default:
          break;
      }
    }
    // 获取分类信息
    function getClassData(type = 0) {
      const promise = new Promise((resolve, reject) => {
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistclassfile/listByType',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            basicClassType: type, // 0123 绘图类型（0：点，1：面，2：线，3：其他）
            mapId: store.state.coplotting.mapId,
          },
        };
        $http(request).then((res: any) => {
          if (res.code === 0) {
            console.log(res.data);
            const data: any = res.data ? res.data.data : [];
            data.map((e: any) => {
              if (e.basicClassList && Array.isArray(e.basicClassList)) {
                e.basicClassList.map((x: any) => {
                  const flag =
                    x.statusList &&
                    Array.isArray(x.statusList) &&
                    x.statusList.length !== 0;
                  const statusList = flag ? x.statusList[0] : {};
                  x.src =
                    (window as any).config.baseURL + x.defaultStatus?.iconUrl;
                  if (statusList.stylePropertyEntity) {
                    x.style = statusList;
                    const obj = {
                      strokeWidth: statusList.stylePropertyEntity.lineHeight,
                      strokeOpacity:
                        statusList.stylePropertyEntity.fillOpacity / 100,
                      fillOpacity:
                        statusList.stylePropertyEntity.fillOpacity / 100,
                      strokeDashstyle:
                        statusList.stylePropertyEntity.lineType === 0
                          ? 'dash'
                          : 'solid',
                      strokeColor: statusList.stylePropertyEntity.strokeColor,
                    };
                    Object.assign(statusList.stylePropertyEntity, obj);
                    if (x.basicClassType === 2) {
                      statusList.stylePropertyEntity.strokeColor =
                        statusList.stylePropertyEntity.fillColor;
                    }
                  }
                });
              }
            });
            // console.log(data);
            classData.value = data;
            classData.value.forEach((e: any) => {
              // 设置默认分类
              if (Array.isArray(e.basicClassList)) {
                e.basicClassList.forEach((x: any) => {
                  if (x.isDefault === 1 && !taggingInfo.flag) {
                    classEcho.value = x.id;
                    saveData.value.markRecord.basicClassId = x.id;
                  } else if (taggingInfo.flag) {
                  }
                });
              }
            });
            getStateData(classEcho.value, true).then(() => {
              resolve('');
            });
            selectState.value.typeNum = type;
            selectClass.value.typeNum = type;
          }
        });
      });
      return promise;
    }
    // 获取分组信息
    function getGroupingOptions() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmapgroup/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: store.state.coplotting.mapId,
        },
      };
      $http(request).then((res: any) => {
        if (res.code === 0 && res.data && Array.isArray(res.data)) {
          const rights = res.data[0]?.rights;
          const rightsEdit: any = [];
          if (!rights) {
            // 我的地图
            res.data.forEach((e: any) => {
              if (e.isDefault === 1 && !taggingInfo.flag) {
                grouping.value = e.id;
              }
            });
          } else {
            // 协作地图
            res.data.forEach((e: any) => {
              // 可编辑
              if (e.rights === '1') {
                rightsEdit.push(e);
              } else {
                // 只能查看
                e.disabled = true;
              }
            });
            grouping.value = rightsEdit[0]?.id;
          }
          options.value = res.data;
        }
      });
    }
    getGroupingOptions();
    // 删除文件
    function deleteFile(data: any, index: number, item: any) {
      fileDeletedIds.value.push(item.id);
      data.splice(index, 1);
    }
    // 保存
    function taggingDetailsSave() {
      const filterDefined = definedList.value.filter(
        (ele: any) => ele.regularFlag,
      );
      if (!markName.value) {
        ElMessage.error('名称不能为空');
        return;
      }
      if (filterDefined.length !== 0) {
        return;
      }
      saveData.value.markRecord.mapId = store.state.coplotting.mapId;
      saveData.value.markRecord.isShowMarkName = SwitchsFlag.value ? 1 : 0;
      saveData.value.markRecord.groupId = grouping.value;
      saveData.value.markRecord.markName = markName.value;
      saveData.value.markRecord.classtStatus = selectState.value.stateData.id;
      saveData.value.markRecord.statusName =
        selectState.value.stateData.statusType;
      saveData.value.markRecord.statusIconUrl =
        selectState.value.stateData.iconUrl;
      saveData.value.tablePropertys = definedList.value;
      // console.log(JSON.parse(handlePontData.value.geometry.toJSON()).controlPoints);
      if (saveData.value.markRecord.markType !== 0) {
        let editFlag = false;
        if (graphicalObj.convergeName === 'lineOrNoodles') {
          editFlag = true;
        }
        if (handlePontData.value.geometry) {
          let geometry = []; // _controlPoints components[0].components
          let handleDatas = { controlPoints: [] };
          // 可编辑的面和线
          if (editFlag) {
            geometry = handlePontData.value.geometry.components[0].components;
            handleDatas.controlPoints = geometry.reduce((pre: any, x: any) => {
              const obj = {
                x: x.x,
                y: x.y,
              };
              pre.push(obj);
              return pre;
            }, []);
          } else {
            geometry = JSON.parse(handlePontData.value.geometry.toJSON());
            handleDatas = geometry;
          }
          saveData.value.markRecord.coordinatesJsonObject = handleDatas;
          saveData.value.markRecord.statusStyleJsonObject =
            handlePontData.value.sourceStyle || {};
          let type =
            handlePontData.value.geometry.CLASS_NAME ===
            'SuperMap.Geometry.MultiLineString'
              ? 'SuperMap.Geometry.GeoPolyline'
              : handlePontData.value.geometry.CLASS_NAME;
          type =
            type === 'SuperMap.Geometry.Polygon'
              ? 'SuperMap.Geometry.GeoPolygonEx'
              : type;
          saveData.value.markRecord.statusStyleJsonObject.CLASS_NAME = type;
        }
      } else {
        if (addOrUpdata.value === 'add') {
          const { mapLocation } = store.state.coplotting.pointInformation;
          saveData.value.markRecord.coordinatesJsonObject.controlPoints = [
            { x: mapLocation.lon, y: mapLocation.lat },
          ];
        }
        const objdata = handlePontData.value?.icon?.drawingData;
        saveData.value.markRecord.statusStyleJsonObject = {
          ...(objdata || {}),
        };
      }
      const fileData: any = [...echo.value.txt, ...echo.value.videoAndImg];
      // 处理附件
      const reqFileData = fileData.reduce((pre: any, x: any) => {
        if (x.serviceData || x.fileUrl) {
          const fileObj = {
            fileType:
              x.type === 'video'
                ? 2
                : x.type === 'image'
                ? 1
                : x.type === 'link'
                ? x.handleType === 'video' ? 2 : 1
                : 3,
            fileUrl: x.serviceData
              ? x.serviceData.url
              : x.type === 'link'
              ? x.name
              : x.fileUrl,
            fileName:
              x.type !== 'link' && !x.fileName
                ? x.name.substring(0, x.name.lastIndexOf('.'))
                : x.fileName || x.name,
            fileSuffix:
              x.type !== 'link' && !x.fileSuffix
                ? x.name.substring(x.name.lastIndexOf('.') + 1)
                : x.fileSuffix || '',
          };
          pre.push(fileObj);
          return pre;
        } else {
          ElMessage.error('还有文件正在上传');
          throw new Error('还有文件正在上传');
        }
      }, []);
      saveData.value.files = reqFileData;
      // console.log(saveData.value);
      if (addOrUpdata.value === 'add') {
        const { pointInformation } = store.state.coplotting;
        // console.log(pointInformation);
        const address =
          pointInformation.res && pointInformation.res.result
            ? pointInformation.res.result.formatted_address
            : '';
        saveData.value.markRecord.address = Array.isArray(address)
          ? '无'
          : address;
        saveData.value.markRecord.laitude = pointInformation.mapLocation
          ? pointInformation.mapLocation.latitude
          : 0;
        saveData.value.markRecord.longitude = pointInformation.mapLocation
          ? pointInformation.mapLocation.longitude
          : 0;
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistmarkrecord/save',
          headers: {
            'Content-Type': 'application/json',
          },
          data: saveData.value,
        };
        $http(request).then((res: any) => {
          if (res.code === 0 && res.data) {
            ElMessage.success('保存成功');
            if (handlePontData.value && handlePontData.value.data) {
              handlePontData.value.data.dataId = res.data.id ? res.data.id : '';
            }
            saveData.value.markRecord.dataId = res.data.id ? res.data.id : '';
            const coverageBeforDraw: any = {
              // 操作类型 点和线或者面 spot line noodles other
              handleType: 'spot',
              // 操作数据
              handleData: [saveData.value.markRecord],
            };
            store.commit('coplotting/SET_coverageBeforDraw', coverageBeforDraw);
            store.commit('coplotting/SET_saveId', res.data.id || '');
            colsePopup();
          }
        });
      } else {
        saveData.value.fileDeletedIds = fileDeletedIds.value;
        const requestData = {
          files: saveData.value.files,
          markRecord: saveData.value.markRecord, // tablePropertys这个数组里的值每次更新都要传，即使没有更新也要原封不动的传回来
          tablePropertys: saveData.value.tablePropertys, // files要新增的附件,已存在的附件可以不用传
          fileDeletedIds: saveData.value.fileDeletedIds, // 需要删除的附件id
        };
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistmarkrecord/update',
          headers: {
            'Content-Type': 'application/json',
          },
          data: requestData,
        };
        $http(request).then((res: any) => {
          if (res.code === 0 && res.data) {
            ElMessage.success('保存成功');
            colsePopup('close');
          }
        });
      }
    }
    // 播放和停止
    function play(item: any, e: any) {
      if (e.target.nodeName === 'VIDEO') {
        e.target.pause();
        item.play = !item.play;
        return;
      }
      // 父元素
      const parentEl = e.target.parentElement;
      const allVideoEl = document.querySelectorAll('video');
      Array.from(allVideoEl).forEach((ele: any) => {
        ele.pause();
      });
      echo.value.videoAndImg.forEach((ele: any) => {
        ele.play = false;
      });
      const childRen = parentEl.children;
      Array.from(childRen).forEach((ele: any) => {
        if (ele.nodeName === 'VIDEO') {
          if (!item.play) {
            ele.play();
          } else {
            ele.pause();
          }
          item.play = !item.play;
        }
      });
    }
    // 获取图形绘制
    function getGraphical() {
      const { detailsPopUp } = store.state.coplotting;
      // console.log(graphicalObj);
      let typeNum = 0;
      switch (graphicalObj.type) {
        case 'spot':
          typeNum = 0;
          (window as any).map
            .markScreening(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              handlePontData.value = el;
            });
          break;
        case 'noodles':
          typeNum = 1;
          (window as any).map
            .getSpecifiedData(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              // console.log(el);
              handlePontData.value = el;
            });
          break;
        case 'line':
          typeNum = 2;
          (window as any).map
            .getSpecifiedData(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              // console.log(el);
              handlePontData.value = el;
            });
          break;
        case 'other':
          typeNum = 3;
          (window as any).map
            .getSpecifiedData(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              // console.log(el);
              handlePontData.value = el;
            });
          break;
        default:
          break;
      }
      if (detailsPopUp.handleType === 'add') {
        saveData.value.markRecord.markType = typeNum;
        getClassData(typeNum);
      }
    }
    getGraphical();
    // 查看是 add 还是vis 还是edit
    function getState() {
      const type: string = store.state.coplotting.detailsPopUp.handleType;
      if (type === 'add' || type === 'edit') {
        editOrDisplay.value = true;
      }
      addOrUpdata.value = type;
    }
    // 渲染详情数据
    function renderDetailsData() {
      const taggingInfos = store.state.coplotting.taggingInfo;
      const { handleData } = taggingInfos;
      if (taggingInfos.flag) {
        // console.log(handleData);
        const recordData = handleData.markRecord;
        const systemPropers: any = handleData.systemProperty;
        // console.log(component.value);
        // console.log(recordData);
        // 名称
        markName.value = recordData.markName;
        // 是否显示名称
        SwitchsFlag.value = recordData.isShowMarkName === 1;
        // 选择分组
        grouping.value = recordData.groupId;
        attributeFlag.value = recordData.propertyType === 1;
        // 系统属性
        systemPropertiesFlag.value = true;
        systemProper.value = {
          // 创建人
          creatorFlag: systemPropers.isShowCreator === 1,
          createTime: systemPropers.createTime,
          creator: systemPropers.creator,
          // 编辑人
          editorFlag: systemPropers.isShowLastEditor === 1,
          editor: systemPropers.lastEditor,
          editTime: systemPropers.lastEditTime,
          // 地址
          addressFlag: systemPropers.isShowMapAddress === 1,
          address: recordData.address,
        };
        // 附件
        const files = handleData.files.reduce(
          (pre: any, ele: any) => {
            ele.src = (window as any).config.baseURL + ele.fileUrl;
            if (
              ele.fileSuffix === 'mp4' ||
              ele.fileSuffix === 'ogg' ||
              ele.fileSuffix === 'mp3' ||
              ele.fileSuffix === 'png' ||
              ele.fileSuffix === 'gif' ||
              ele.fileSuffix === 'jpg' ||
              ele.fileSuffix === 'PNG' ||
              ele.fileSuffix === 'JPG' ||
              ele.fileSuffix === 'GIF'
            ) {
              if (
                ele.fileSuffix === 'png' ||
                ele.fileSuffix === 'gif' ||
                ele.fileSuffix === 'jpg' ||
                ele.fileSuffix === 'PNG' ||
                ele.fileSuffix === 'JPG' ||
                ele.fileSuffix === 'GIF'
              ) {
                ele.type = 'image';
              }
              pre.videoAndImg.push(ele);
            } else {
              ele.type = ele.fileSuffix;
              if (!ele.fileSuffix) {
                ele.type = 'link';
                ele.handleType = ele.fileType === 2 ? 'video' : 'image';
                ele.name = '';
                ele.serviceData = {
                  url: ele.fileUrl,
                };
                ele.src = ele.fileUrl;
                pre.videoAndImg.push(ele);
              } else {
                pre.txt.push(ele);
              }
            }
            return pre;
          },
          {
            txt: [],
            videoAndImg: [],
          },
        );
        // console.log(files);
        echo.value = files;
        if (fileUpload.value) {
          fileUpload.value.echo = echo.value;
        }
        editOrDisplay.value = handleData.editOrDisplay === 1;
        saveData.value = handleData;
        addOrUpdata.value = 'updata';
        // 获取分类
        let typeNum = 0;
        if (recordData && recordData) {
          typeNum = recordData.markType;
        }
        // 分类回显
        classEcho.value = recordData.basicClassId;
        // 分类状态回显
        classStateEcho.value = recordData.classtStatus;
        // 获取分类
        getClassData(typeNum).then(() => {
          // 分类
          // 状态
          // 属性
          definedList.value = handleData.tablePropertys;
        });
      }
    }
    // 校验验证
    function rulesVal(item: any, e: any) {
      const el = e.target;
      // 提示信息
      const span = document.createElement('sapn');
      const elArr = el.parentElement.children;
      // 控制提示显示开关
      let switchFlag = false;
      // 电话
      if (item.type === 4) {
        const regFlag = /^1[3|4|5|7|8]\d{9}$/.test(item.value.trim());
        if (!regFlag && item.value.trim()) {
          span.innerText = '请输入正确的手机号码';
          switchFlag = true;
        } else {
          switchFlag = false;
        }
      } else if (item.type === 5) {
        // 终端
        const regFlags = /^([a-z]|[A-Z])+(\d)+$/.test(item.value);
        if ((!regFlags || item.value.length > 20) && item.value.trim()) {
          switchFlag = true;
          span.innerText = '请输入格式英文加数字，且20个字符以内的终端号码';
        } else if (item.value.length < 20) {
          switchFlag = false;
        }
      } else if (item.type === 2) {
        // 数值类型
        if (String(item.value) !== String(parseFloat(item.value))) {
          switchFlag = true;
          span.innerText = '只能输入数字';
        } else {
          switchFlag = false;
        }
      }
      // 查看它有没有生成提示
      const addEl = el.getAttribute('addEl');
      if (!addEl && switchFlag) {
        el.style.border = '1px solid #f56c6c';
        span.className = 'el-form-item__error'; // 使用element的样式
        span.style.marginLeft = `${el.offsetLeft}px`;
        el.parentElement.appendChild(span);
        el.setAttribute('addEl', '1');
        item.regularFlag = true;
      } else if (addEl && !switchFlag) {
        el.style.border = 'none';
        // 删除提示
        elArr[elArr.length - 1].remove();
        el.setAttribute('addEl', '');
        item.regularFlag = false;
      }
      item.value = item.value.trim();
    }
    // 初始化
    function init() {
      markName.value = '';
      getClassData(0);
      echo.value = { txt: [], videoAndImg: [] };
    }
    // 下载
    function fileVisDownload(params: any) {
      console.log(params);
      download(params);
    }
    // 查看更多
    function seeMore(params?: any) {
      console.log(echo.value);
      if (addOrUpdata.value === 'add') {
        return;
      }
      const diffData = echo.value.videoAndImg.reduce(
        (pre: any, ele: any) => {
          if (ele.fileSuffix === 'mp4' || ele.fileSuffix === 'ogg') {
            pre.video.push(ele);
          } else if (
            ele.fileSuffix === 'png' ||
            ele.fileSuffix === 'gif' ||
            ele.fileSuffix === 'jpg' ||
            ele.fileSuffix === 'PNG' ||
            ele.fileSuffix === 'JPG' ||
            ele.fileSuffix === 'GIF'
          ) {
            pre.image.push(ele);
          } else if (!ele.fileSuffix && ele.handleType) {
            if (ele.handleType === 'image') {
              pre.image.push(ele);
            } else {
              pre.video.push(ele);
            }
          }
          return pre;
        },
        {
          image: [],
          video: [],
          word: [],
        },
      );
      echo.value.txt.forEach((ele: any) => {
        if (
          ele.fileSuffix === 'doc' ||
          ele.fileSuffix === 'pdf' ||
          ele.fileSuffix === 'xls' ||
          ele.fileSuffix === 'xlsx'
        ) {
          diffData.word.push(ele);
        }
      });
      const obj = {
        data: diffData,
        active: params,
        openFlag: true, // 打开更多的弹窗
      };
      store.commit('coplotting/SET_SeeMoreObj', obj);
    }
    getState();
    onMounted(() => {
      renderDetailsData();
    });
    watch(classStateEcho, (newV) => {
      // console.log(newV);
    });
    watch(
      () => store.state.coplotting.taggingInfo,
      (newV) => {
        if (newV.flag) {
          renderDetailsData();
        } else {
          const { handleData } = taggingInfo;
          const st = {
            src:
              (window as any).config.baseURL +
              handleData?.markRecord?.statusIconUrl,
          };
          (window as any).map.setOneMarkerStyle(handlePontData.value, st);
        }
      },
    );
    watch(
      () => store.state.coplotting.detailsPopUp,
      (newV) => {
        handlePontData.value = newV.handleData;
      },
    );
    return {
      addOrUpdata,
      classEcho,
      classStateEcho,
      editOrDisplay,
      systemProper,
      switchs,
      SwitchsFlag,
      saveData,
      handlePontData,
      options,
      grouping,
      markName,
      // 文件 ------- 👇
      uploadNetworkVal,
      addUploadNetworkVal,
      fileUpload,
      uploadFile,
      getFileUploadData,
      echo,
      play,
      deleteFile,
      // 文件 ------ 👆
      attributeFlag,
      systemPropertiesFlag,
      selectState,
      selectClass,
      selectStateFun,
      definedList,
      selecrData,
      taggingDetailsSave,
      classData,
      getStateData,
      getClassData,
      colsePopup,
      // 初始化
      init,
      // 校验
      rulesVal,
      disabledValue,
      // 下载
      fileVisDownload,
      // 查看更多
      seeMore,
      // 网络路径类型选择
      radioVal,
    };
  },
});
</script>

  <style lang="scss" module src="./style/TaggingDetails.scss"/>
