<template>
	<section>
		<header :class="$style['header-view']">
			<div>
				<!-- 资源类型列表 -->
				<button v-for="(btnItem, btnIndex) in resourceTypeList" :key="btnIndex" :class="{
            [$style['button--active']]: resourceTypeActiveIndex === btnIndex,
          }" @click="handleResourceTypeChanges(btnItem.resoureType,btnIndex)">
					<i :class="{
              [$style['button__i--active']]:
                resourceTypeActiveIndex === btnIndex,
            }" />
					<span>
						{{ btnItem?.name ?? '' }}
					</span>
				</button>
			</div>
			<div>
				<!-- 资源标签列表 -->
				<label v-for="(labItem, labIndex) in resourceLabelList" :key="labIndex + resourceTypeList.length"
					:class="{
            [$style['label--active']]:
              resourceTypeActiveIndex === labIndex + resourceTypeList.length,
          }" @click="handleResourceTypeChanges(labItem.resoureType)">
					{{ labItem?.name ?? '' }}
				</label>
			</div>
		</header>
		<main :class="$style['main-view']">
			<div v-if="
          activeIndex === 1 ||
          activeIndex === 2 ||
          activeIndex === 3 ||
          activeIndex === 4
        ">
				<!-- <label v-if="activeIndex === 2"
          >会场终端
          {{
            retrievalList?.facet?.filter((item) => {
              return item.name == '1';
            })[0]?.count || 0
          }}</label
        >
        <label v-if="activeIndex === 2"
          >集群终端
          {{
            retrievalList?.facet?.filter((item) => {
              return item.name == '2';
            })[0]?.count || 0
          }}</label
        >
        <label v-if="activeIndex === 2"
          >手持终端
          {{
            retrievalList?.facet?.filter((item) => {
              return item.name == '3';
            })[0]?.count || 0
          }}</label
        > -->
				<label v-if="activeIndex === 1 || activeIndex === 2 || activeIndex === 3">仅显示在线</label>
				<el-switch v-if="activeIndex === 1 || activeIndex === 2 || activeIndex === 3"
					:class="$style['el-switch']" v-model="isOnline" />
				<label v-if="activeIndex === 5">仅显示有库存</label>
				<el-switch v-if="activeIndex === 5" :class="$style['el-switch']" v-model="isOnline" />
				<label v-if="activeIndex === 4">执行中
					{{
            retrievalList?.facet?.filter((item) => {
              return item.name == '执行中';
            })[0]?.count || 0
          }}</label>
				<label v-if="activeIndex === 4">已完成
					{{
            retrievalList?.facet?.filter((item) => {
              return item.name == '已完成';
            })[0]?.count || 0
          }}</label>
				<label v-if="activeIndex === 4">已取消
					{{
            retrievalList?.facet?.filter((item) => {
              return item.name == '已取消';
            })[0]?.count || 0
          }}</label>
			</div>
			<ul>
				<!-- 资源列表 -->
				<li v-for="(liItem, liIndex) in retrievalList" :key="liIndex" :class="{
            [$style['li--active']]: retrievalLiActiveIndex === liIndex,
          }" @click="handleClickLi(liItem)" @mouseenter="hoverLi(liItem,liIndex)" @mouseleave="mouseleaveFun">
					<div :class="$style['li-left']">
						<i :class="[
                {
                  [$style['li-place-icon']]:
                    activeIndex === 0 ||
                    activeIndex === 5 ||
                    activeIndex === 6 ||
                    activeIndex === 7 ||
                    activeIndex === 8 ||
                    activeIndex === 9 ||
                    activeIndex === 11 ||
                    activeIndex === 12,
                },
                {
                  [$style['li-place-icon--active']]:
                    (activeIndex === 0 ||
                      activeIndex === 5 ||
                      activeIndex === 6 ||
                      activeIndex === 7 ||
                      activeIndex === 8 ||
                      activeIndex === 9 ||
                      activeIndex === 11 ||
                      activeIndex === 12) &&
                    retrievalLiActiveIndex === liIndex,
                },
                { [$style['li-camera-icon']]: activeIndex === 1 },
                {
                  [$style['li-camera-icon--active']]:
                    activeIndex === 1 &&
                    retrievalLiActiveIndex === liIndex,
                },
                {
                  [$style['li-hold-icon']]:
                    activeIndex === 2 && liItem.type === 3,
                },
                {
                  [$style['li-hold-icon--active']]:
                    activeIndex === 2 &&
                    liItem.type === 3 &&
                    retrievalLiActiveIndex === liIndex,
                },
                {
                  [$style['li-colony-icon']]:
                    activeIndex === 2 && liItem.type === 2,
                },
                {
                  [$style['li-colony-icon--active']]:
                    activeIndex === 2 &&
                    liItem.type === 2 &&
                    retrievalLiActiveIndex === liIndex,
                },
                {
                  [$style['li-conference-icon']]:
                    activeIndex === 2 && liItem.type === 1,
                },
                {
                  [$style['li-conference-icon--active']]:
                    activeIndex === 2 &&
                    liItem.type === 1 &&
                    retrievalLiActiveIndex === liIndex,
                },
                {
                  [$style['li-personnel-icon']]:
                    activeIndex === 3 ||
                    activeIndex === 10,
                },
                {
                  [$style['li-personnel-icon--active']]:
                    (activeIndex === 3 ||
                      activeIndex === 10) &&
                    retrievalLiActiveIndex === liIndex,
                },
                { [$style['li-task-icon']]: activeIndex === 4 },
                {
                  [$style['li-task-icon--active']]:
                    activeIndex === 4 &&
                    retrievalLiActiveIndex === liIndex,
                },
              ]">
							{{ liIndex+1 }}
						</i>
					</div>
					<div :class="$style['li-right']">
						<!-- 地点 -->
						<!-- <h3
              v-if="
                resourceTypeActiveIndex !== 104 &&
                resourceTypeActiveIndex !== 105 &&
                resourceTypeActiveIndex !== 109 &&
                resourceTypeActiveIndex !== 110 &&
                resourceTypeActiveIndex !== 111
              "
            > -->
						<h3>
							<!-- {{
                (resourceTypeActiveIndex === 0 ||
                resourceTypeActiveIndex === 103 ||
                resourceTypeActiveIndex === 106 ||
                resourceTypeActiveIndex === 107 ||
                resourceTypeActiveIndex === 108 ||
                resourceTypeActiveIndex === 112
                  ? liItem?.name ?? ''
                  : '') +
                (resourceTypeActiveIndex === 101 ||
                resourceTypeActiveIndex === 102
                  ? liItem?.deviceName ?? ''
                  : '')
              }} -->
							{{ liItem?.name }}
						</h3>
						<!-- <div v-else>
              <label
                :class="$style['li-task-label']"
                v-if="
                  resourceTypeActiveIndex === 104 ||
                  resourceTypeActiveIndex === 109
                "
                >{{ liItem?.typeName ?? '' }}</label
              >
              <h3
                :class="$style['li-task-h3']"
                v-if="resourceTypeActiveIndex === 104"
              >
                {{ liItem?.name ?? '' }}
              </h3>
              <h3
                :class="$style['li-task-h3']"
                v-if="resourceTypeActiveIndex === 109"
              >
                {{ liItem?.name ?? '' }}
              </h3>
              <span
                :class="$style['li-task-span']"
                v-if="resourceTypeActiveIndex === 104"
                >{{ liItem?.statusName ?? '' }}</span
              >

              <h3
                v-if="resourceTypeActiveIndex === 105"
                :class="$style['li-material-h3']"
              >
                {{ `${liItem?.name ?? ''} (${liItem?.storehouseName})` }}
              </h3>
              <h3
                v-if="resourceTypeActiveIndex === 110"
                :class="$style['li-material-h3']"
              >
                {{ `${liItem?.name ?? ''} (${liItem?.majorType})` }}
              </h3>
              <h3
                v-if="resourceTypeActiveIndex === 111"
                :class="$style['li-material-h3']"
              >
                {{ `${liItem?.name ?? ''} (${liItem?.groupName})` }}
              </h3>
              <span
                v-if="resourceTypeActiveIndex === 105"
                :class="$style['li-material-span']"
                >{{ liItem?.amount ?? '' }}</span
              >
              <span
                v-if="resourceTypeActiveIndex === 111"
                :class="$style['li-material-span']"
                >{{ liItem?.number ?? '' }}</span
              >
            </div> -->
						<p v-if="resourceTypeActiveIndex !== 110">
							{{ liItem?.address ?? '' }}
						</p>
					</div>
				</li>
			</ul>
		</main>
		<!-- 历史 -->
		<div v-show="!retrievalList.length">
			<RetrievalRecord :historyData="historyData" @deleteHistory="deleteHistory" @selectLi="selectLi" />
		</div>
		<!-- 分页 -->
		<footer v-show="retrievalList.length" :class="$style['footer-view']">
			<div :class="$style['footer-left']">
				<span>共{{ totalCount }}条</span>
			</div>
			<div :class="$style['footer-right']">
				<Pagination v-model:currentPage="currentPage" :pageSize="pageSize" :totalCount="totalCount"
					@handlePageChange="handleResourceTypeChange" />
			</div>
		</footer>
	</section>
  <!-- 协作标绘地图弹窗 -->
  <div v-show="false">
    <MapPopup ref="MapPopups" enter="commandBrain" />
  </div>
</template>

<script>
	import {
		defineComponent,
    getCurrentInstance,
		ref,
		inject,
		onMounted,
		watch
	} from 'vue';
  import { useStore } from 'vuex';
	import RetrievalRecord from '@/product/CommandBrain3.0/FunModule/ResourceRetrieval/modules/RetrievalRecord/RetrievalRecord.vue';
	import Pagination from '../../components/Pagination/Pagination.vue';
	import LayerData from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/script/LayerData';
	import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
  // 协作标绘地图弹窗
  import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
  // 设置落点
  // 点线面的渲染
  import spotOrLineOrNoodles from '@/product/Coplotting/module/mainLogicJS/spotOrLineOrNoodlesRender';
	export default defineComponent({
		name: 'RetrievalList',
		components: {
			// 分页组件
			Pagination,
			// 历史
			RetrievalRecord,
      MapPopup,
		},
		data() {
			return {
				// hover交互mark
				interactiveMark: '',
				// 当前类型
				currentType: '',
			};
		},
		props: {
			// 资源列表
			retrievalList: {
				type: Array,
				default: () => [],
			},
			// 资源类型ActiveIndex
			resourceTypeActiveIndex: {
				type: Number,
			},
			// 资源详情
			retrievalDetail: {
				type: Object,
				default: () => ({}),
			},
		},
		emits: [
			'handleResourceTypeChange',
			'update:resourceTypeActiveIndex',
			'update:retrievalDetail',
		],
		setup(props, context) {
      const store = useStore(); // 使用vuex
      // 获取全局参数
      const instance = getCurrentInstance();
      const { $http } = instance?.appContext.config.globalProperties;
			const {
				getSectionData,
			} = LayerData();
      // 渲染点线面的方法
      const MapPopups = ref(null);
      const coverObj = {
        vector: window.mapCoverageName.retrievalVector,
        mark: window.mapCoverageName.retrievalMark,
      }
      const { spotOrLineOrNoodlesRender,popupGetDataAndVis } = spotOrLineOrNoodles($http, MapPopups, coverObj);
			const currentTypeArr = ref([{
					name: '监控',
					currentType: 'camera',
          resoureType: 101,
				},
				{
					name: '集群终端',
					currentType: 'colony',
          resoureType: 114,
				},
				{
					name: '联系人',
					currentType: 'personnel',
          resoureType: 103,
				},
				{
					name: '任务',
					currentType: 'task',
          resoureType: 104,
				},
				{
					name: '应急物资库',
					currentType: 'materials',
          resoureType: 105,
				},
				{
					name: '应急物资库',
					currentType: 'material',
          resoureType: 106,
				},
				{
					name: '避难场所',
					currentType: 'refuge',
          resoureType: 107,
				},
				{
					name: '防护目标',
					currentType: 'protect',
          resoureType: 108,
				},
				{
					name: '应急队伍',
					currentType: 'team',
          resoureType: 109,
				},
				{
					name: '应急专家',
					currentType: '',
          resoureType: 110,
				},
				{
					name: '应急装备库',
					currentType: 'equipments',
          resoureType: 111,
				},
				{
					name: '应急装备库',
					currentType: 'equipment',
          resoureType: 112,
				},
				{
					name: '风险隐患',
					currentType: 'risk',
          resoureType: 113,
				},
				{
					name: '医疗',
					currentType: 'medical',
          resoureType: 117,
				},
        {
					name: '会场终端',
					currentType: 'device',
          resoureType: 115,
				},
			]);
			// 资源类型列表
			const resourceTypeList = ref([{
					name: '地点',
					resoureType: 0,
				},
				{
					name: '监控',
					resoureType: 101,
				},
				{
					name: '集群',
					resoureType: 114,
				},
				{
					name: '人员',
					resoureType: 103,
				},
				{
					name: '任务',
					resoureType: 104,
				},
			]);
			// 资源标签列表
			const resourceLabelList = ref([{
					name: '会场终端',
					resoureType: 115,
				},
				{
					name: '物资',
					resoureType: 105,
				},
				{
					name: '物资库',
					resoureType: 106,
				},
				{
					name: '避难场所',
					resoureType: 107,
				},
				{
					name: '防护目标',
					resoureType: 108,
				},
				{
					name: '应急队伍',
					resoureType: 109,
				},
				{
					name: '应急专家',
					resoureType: 110,
				},
				// {
				//   name: '文件', // R2
				// },
				{
					name: '装备',
					resoureType: 111,
				},
				{
					name: '装备库',
					resoureType: 112,
				},
				{
					name: '风险隐患', // R2
					resoureType: 113,
				},
				{
					name: '医疗机构', // R2
					resoureType: 117,
				},
        {
          name: '标绘数据', // R2
          resoureType: 116,
        }
			]);
      // 资源标签activeindex
			// const resourceLabelActiveIndex = ref('');
			// 资源列表activeindex
			const retrievalLiActiveIndex = ref('');

			const activeIndex = ref('');
			// 是否显示在线
			const isOnline = ref(false);
			// 分页当前页数
			const currentPage = ref('1');
			// 每页数据量
			const pageSize = ref('10');
			// 列表总数量
			const totalCount = ref('0');
			// 控制mainView切换
			const mainViewType = inject('mainViewType');
			// 历史记录显示的数据
			const historyData = ref([]);
			// 设置了点样式的数据
			const setStyleObj = ref('');
			// 资源落点
			const retrievalMarkerList = ref('');
			// 删除历史记录
			function deleteHistory(obj) {
				let location = localStorage.getItem('resourcesHistory');
				if (location) {
					location = JSON.parse(location);
					if (obj.type !== 'all') {
						location.splice(obj.index);
					} else {
						location = [];
					}
					localStorage.setItem('resourcesHistory', JSON.stringify(location));
					historyData.value = location;
				}
			}
			// 选择历史
			function selectLi(item) {
				context.emit('selectLi', item);
			}
			// 获取历史数据
			function getHistoryData() {
				// 历史数据存放在localStorage中
				const resourcesHistory = localStorage.getItem('resourcesHistory');
				historyData.value = resourcesHistory ? JSON.parse(resourcesHistory) : [];
			}
      // 获取对用的类型数据
      function getTypeData(typeNum) {
        const filterArr = currentTypeArr.value.filter((x)=>{
          if(x.resoureType === typeNum){
            return true
          }
        });
        return filterArr.length?filterArr[0]:{};
      }
			onMounted(() => {
				getHistoryData();
        // 禁用弹窗的编辑
        if (MapPopups.value) {
          MapPopups.value.editJurisdiction = false;
        }
			});
			watch(() => props.retrievalList, (newV) => {
				const obj = getTypeData(props.resourceTypeActiveIndex);
        if(props.resourceTypeActiveIndex === 116) {
          spotOrLineOrNoodlesRender(newV)
        }
        console.log('%c [ newV ]', 'font-size:13px; background:pink; color:#bf2c9f;', newV);
				if (props.resourceTypeActiveIndex === 0) {
					window.map.clearAtPresentMarkData('资源搜索落点');
					// 设置地点的mark落图
					const data = JSON.parse(JSON.stringify(props.retrievalList));
					const imgSrc = require('./assets/li-place-icon--red.svg');
					data.forEach((x, index) => {
						const arr = x.transFromLonLat.split(',');
						x.longitude = arr[0];
						x.latitude = arr[1];
						x.wd = 33;
						x.hg = 38;
						x.src = imgSrc;
						x.label = (index + 1);
						x.textPosition = 'ct';
					});
					window.map
						.setMultiMarker('资源搜索落点', data)
						.then((res) => {
							console.log(res);
							retrievalMarkerList.value = res;
						});
				} else {
					window.map.clearAtPresentMarkData('资源搜索落点');
				}
			})

			watch(isOnline, (newV) => {
				context.emit('changeIsOnline', newV);
			});

			return {
        coverObj,
        MapPopups,
				getTypeData,
				getSectionData,
				// 历史记录显示的数据
				historyData,
				// 删除历史记录
				deleteHistory,
				// 选择历史
				selectLi,
				resourceTypeList,
				resourceLabelList,
				// retrievalList,
				// resourceLabelActiveIndex,
				// 设置了点样式的数据
				setStyleObj,
				retrievalLiActiveIndex,
				activeIndex,
				isOnline,
				currentPage,
				pageSize,
				totalCount,
				mainViewType,
				retrievalMarkerList,
				getHistoryData,
        popupGetDataAndVis,
			};
		},
		mounted() {},
		methods: {
			// 点击了其他资源
			handleResourceTypeChanges(index, ind) {
				this.activeIndex = ind;
				console.log(ind);
				this.currentPage = '1';
				this.handleResourceTypeChange(index);
			},

			// 资源类型改变
			handleResourceTypeChange(index) {
				if (index !== undefined) {
					this.$emit('update:resourceTypeActiveIndex', index);
				}
				this.$emit('handleResourceTypeChange');
				const objs = this.getTypeData(index);
				let currentType = objs.currentType;
				let mapKey = '';
				if(objs.currentType === 'materials'){
					mapKey = 'material';
				} else if (objs.currentType === 'equipments') {
					mapKey = 'equipment'
				} else if(objs.currentType === 'task'){
					mapKey = 'task'
				}
				mapKey = mapKey || currentType
				this.$emit('handleMapCovg', mapKey)
			},
			// 设置点样式
			setMarkStyle(params) {
				console.log(params);
				if (this.setStyleObj) {
					// 把旧数据的进行恢复
					window.map.getFilterMark('资源搜索落点', 'id', this.setStyleObj.id).then((res) => {
						window.map.setOneMarkerStyle(res, {
							src: require('./assets/li-place-icon--red.svg')
						})
					});
				}
				// 设置点样式
				window.map.getFilterMark('资源搜索落点', 'id', params.id).then((res) => {
					window.map.setOneMarkerStyle(res, {
						src: require('./assets/li-place-icon--blue.svg')
					})
					this.setStyleObj = params;
				});
			},
			// 点击列表Li
			async handleClickLi(liItem) {
				console.log(liItem);
        if(this.resourceTypeActiveIndex !== 116) {
          if (this.resourceTypeActiveIndex === 0) {
            liItem.longitude = liItem.transFromLonLat.split(',')[0];
            liItem.latitude = liItem.transFromLonLat.split(',')[1];
          }
          const objs = this.getTypeData(this.resourceTypeActiveIndex);
          let currentType = objs.currentType;
          if(objs.currentType === 'materials'){
            currentType = 'material';
            liItem.id = liItem.articleStorehouseId;
          } else if (objs.currentType === 'equipments') {
            liItem.id = liItem.groupId;
            currentType = 'resource_equipmentgroup';
          } else if(objs.currentType === 'task'){
            currentType = 'task_';
          } else if (this.resourceTypeActiveIndex === 110) {
            currentType = 'resource_expert';
          }
          liItem.handleType = currentType;
          this.$mapSetSpot.spotClickFun.open(
            currentType,
            { ...liItem },
            this.$store.state.event?.id,
            window.map,
          )
          // 应急专家 只打开详情弹窗不进行落点和地图居中
          if(this.resourceTypeActiveIndex === 110){
          return
          }
          if (!liItem.longitude && !liItem.latitude) {
            this.$message.error(`该资源没有经纬度坐标`);
            return false;
          }
          let imgSrc;
          switch (this.resourceTypeActiveIndex) {
            case 0:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 12:
              imgSrc = require('./assets/li-place-icon--blue.svg');
              break;
            case 1:
              imgSrc = require('./assets/li-camera-icon--red.svg');
              break;
            case 2:
              if (liItem.type === '3') {
                imgSrc = require('./assets/li-hold-icon--red.svg');
              }
              if (liItem.type === '2') {
                imgSrc = require('./assets/li-colony-icon--red.svg');
              }
              if (liItem.type === '1') {
                imgSrc = require('./assets/li-conference-icon--red.svg');
              }
              break;
            case 3:
              imgSrc = require('./assets/li-personnel-icon.svg');
              break;
            case 4:
              imgSrc = require('./assets/li-task-icon.svg');
              break;
            case 10:
              imgSrc = require('./assets/li-personnel-icon--loser.svg');
              break;
            default:
          }
          // 只有地点的时候有红色的点
          if (this.resourceTypeActiveIndex === 0) {
            this.setMarkStyle(liItem);
          }
          this.$emit('update:retrievalDetail', liItem);
          this.mainViewType = 'RetrievalDetail';
        } else if(this.resourceTypeActiveIndex === 116) {
          const markType = Number(liItem.markType);
          if(markType === 0) {
            const soptObj = await window.map.getFilterMark(this.coverObj.mark, 'id', liItem.id)
            this.popupGetDataAndVis(liItem.id,liItem,soptObj)
          }
        }
        const zoom = await window.map.getMapMaxZoom()
        window.map.setCentent({
          longitude: liItem.longitude,
          latitude: liItem.latitude,
        },zoom).then(() => {
          if (this.resourceTypeActiveIndex !== 0 && this.resourceTypeActiveIndex !== 116) {
            setTimeout(() => {
              // 获取当前切片点信息
              this.getSectionData(window.map).then(() => {
                // 不是地点的时候要改变标点颜色
                const obj = this.getTypeData(this.resourceTypeActiveIndex);
                const markName = obj.name;
                let currentType = obj.currentType;
                // currentType
                // 应急专家没有落点，不做样式更换，物资和装备改变的是对应的资源库的落点图标
                if (currentType) {
                  setTimeout(() => {
                    // articleStorehouseId 物资库的id
                    // groupId 装备库的id
                    let id = liItem.id;
                    // 装备库和物资库
                    if (currentType === 'equipments' ) {
                      id = liItem.groupId;
                      currentType = 'equipment'
                    } else if(currentType === 'materials'){
                      id = liItem.articleStorehouseId;
                      currentType = 'material'
                    }
                    console.log(markName,currentType,id);
                    window.map.modifyStyle(currentType, 'id',
                      id, {
                        img: useMapMarker(markName, 3),
                        width: 40,
                        height: 40,
                      }).then((res) => {
                      // console.log(res);
                    })
                  }, 200);
                }
              });
            }, 200);
          }
        });
			},
			// hover
			hoverLi(params, liIndex) {
        if(this.resourceTypeActiveIndex !== 116) {
          // console.log(params);
          const obj = this.getTypeData(this.resourceTypeActiveIndex);
          const markName = obj.name;
          const currentType = obj.currentType;
          if (this.interactiveMark) {
            window.map.clearAtPresentMarkData('searchMark');
          }
          this.currentType = currentType;
          window.map.setOneMarker('searchMark', {
            wd: 40,
            hg: 40,
            src: useMapMarker(markName, 3),
            ...params,
          }).then((res) => {
            if (res) {
              res.events.element.style.top = `${parseFloat(res.events.element.style.top) + 4 }px`
              this.interactiveMark = res;
            }
          });
          this.retrievalLiActiveIndex = liIndex;
          if (this.resourceTypeActiveIndex === 0) {
            this.setMarkStyle(params);
          }
        }
			},
			mouseleaveFun() {
        if(this.resourceTypeActiveIndex !== 116) {
          this.retrievalLiActiveIndex = '';
          this.currentType = '';
          if (this.interactiveMark) {
            window.map.clearAtPresentMarkData('searchMark');
          }
        }
			}
		},
	});
</script>

<style lang="scss" src='./styles/RetrievalList.scss' module />
