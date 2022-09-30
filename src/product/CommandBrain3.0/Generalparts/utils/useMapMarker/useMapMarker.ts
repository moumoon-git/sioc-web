type MarkerName =
  '集群终端'
  | '默认'
  | '无人机'
  | '应急队伍'
  | '应急队伍-集群终端'
  | '应急队伍-wecomm'
  | '应急装备'
  | '应急装备库'
  | '应急专家'
  | '应急物资'
  | '应急物资库'
  | '联系人'
  | '联系人-集群终端'
  | '联系人-wecomm'
  | '监控'
  | '监控视频'
  | '视频链'
  | '防护目标'
  | '风险隐患'
  | '避难场所'
  | '任务'
  | '会场终端'
  | 'wecomm'
  | '医疗'
  | '医疗机构'
  | '直播'
  ;

const markerSet = new Map();
const miniMarkerSet = new Map();
markerSet.set('集群终端', require('./assets/imgs/cluster-terminal.svg'));
markerSet.set('集群终端--禁用', require('./assets/imgs/cluster-terminal--disabled.svg'));
markerSet.set('集群终端--红色', require('./assets/imgs/red/cluster-terminal.svg'));
markerSet.set('集群终端--激活', require('./assets/imgs/cluster-terminal--active.svg'));
markerSet.set('集群终端--禁用激活', require('./assets/imgs/cluster-terminal--disabled--active.svg'));
miniMarkerSet.set('集群终端', require('./assets/imgs/mini/cluster-terminal.svg'));
miniMarkerSet.set('集群终端--禁用', require('./assets/imgs/mini/cluster-terminal--disabled.svg'));
markerSet.set('默认', require('./assets/imgs/default.svg'));
markerSet.set('默认--禁用', require('./assets/imgs/default--disabled.svg'));
markerSet.set('默认--激活', require('./assets/imgs/default--active.svg'));
markerSet.set('默认--禁用激活', require('./assets/imgs/default--disabled--active.svg'));
miniMarkerSet.set('默认', require('./assets/imgs/mini/default.svg'));
miniMarkerSet.set('默认--禁用', require('./assets/imgs/mini/default--disabled.svg'));
markerSet.set('无人机', require('./assets/imgs/drone.svg'));
markerSet.set('无人机--禁用', require('./assets/imgs/drone--disabled.svg'));
markerSet.set('无人机--激活', require('./assets/imgs/drone--active.svg'));
markerSet.set('无人机--禁用激活', require('./assets/imgs/drone--disabled--active.svg'));
miniMarkerSet.set('无人机', require('./assets/imgs/mini/drone.svg'));
miniMarkerSet.set('无人机--禁用', require('./assets/imgs/mini/drone--disabled.svg'));
markerSet.set('应急队伍', require('./assets/imgs/emergency-battalion.svg'));
markerSet.set('应急队伍--禁用', require('./assets/imgs/emergency-battalion--disabled.svg'));
markerSet.set('应急队伍--红色', require('./assets/imgs/red/emergency-battalion.svg'));
markerSet.set('应急队伍--激活', require('./assets/imgs/emergency-battalion--active.svg'));
markerSet.set('应急队伍--禁用激活', require('./assets/imgs/emergency-battalion--disabled--active.svg'));
miniMarkerSet.set('应急队伍', require('./assets/imgs/mini/emergency-battalion.svg'));
miniMarkerSet.set('应急队伍--禁用', require('./assets/imgs/mini/emergency-battalion--disabled.svg'));
markerSet.set('应急队伍-集群终端', require('./assets/imgs/emergency-battalion-with-cluster-terminal.svg'));
markerSet.set('应急队伍-集群终端--禁用', require('./assets/imgs/emergency-battalion-with-cluster-terminal--disabled.svg'));
miniMarkerSet.set('应急队伍-集群终端', require('./assets/imgs/mini/emergency-battalion-with-cluster-terminal.svg'));
miniMarkerSet.set('应急队伍-集群终端--禁用', require('./assets/imgs/mini/emergency-battalion-with-cluster-terminal--disabled.svg'));
markerSet.set('应急队伍-wecomm', require('./assets/imgs/emergency-battalion-with-wecomm.svg'));
markerSet.set('应急队伍-wecomm--禁用', require('./assets/imgs/emergency-battalion-with-wecomm--disabled.svg'));
miniMarkerSet.set('应急队伍-wecomm', require('./assets/imgs/mini/emergency-battalion-with-wecomm.svg'));
miniMarkerSet.set('应急队伍-wecomm--禁用', require('./assets/imgs/mini/emergency-battalion-with-wecomm--disabled.svg'));
markerSet.set('应急装备', require('./assets/imgs/emergency-equipment.svg'));
markerSet.set('应急装备--禁用', require('./assets/imgs/emergency-equipment--disabled.svg'));
markerSet.set('应急装备--红色', require('./assets/imgs/red/emergency-equipment.svg'));
markerSet.set('应急装备--激活', require('./assets/imgs/emergency-equipment--active.svg'));
markerSet.set('应急装备--禁用激活', require('./assets/imgs/emergency-equipment--disabled--active.svg'));
miniMarkerSet.set('应急装备', require('./assets/imgs/mini/emergency-equipment.svg'));
miniMarkerSet.set('应急装备--禁用', require('./assets/imgs/mini/emergency-equipment--disabled.svg'));
markerSet.set('应急装备库', require('./assets/imgs/emergency-equipment-warehouse.svg'));
markerSet.set('应急装备库--禁用', require('./assets/imgs/emergency-equipment-warehouse--disabled.svg'));
markerSet.set('应急装备库--红色', require('./assets/imgs/red/emergency-equipment-warehouse.svg'));
markerSet.set('应急装备库--激活', require('./assets/imgs/emergency-equipment-warehouse--active.svg'));
markerSet.set('应急装备库--禁用激活', require('./assets/imgs/emergency-equipment-warehouse--disabled--active.svg'));
miniMarkerSet.set('应急装备库', require('./assets/imgs/mini/emergency-equipment-warehouse.svg'));
miniMarkerSet.set('应急装备库--禁用', require('./assets/imgs/mini/emergency-equipment-warehouse--disabled.svg'));
markerSet.set('应急专家', require('./assets/imgs/emergency-expert.svg'));
markerSet.set('应急专家--禁用', require('./assets/imgs/emergency-expert--disabled.svg'));
markerSet.set('应急专家--红色', require('./assets/imgs/red/emergency-expert.svg'));
markerSet.set('应急专家--激活', require('./assets/imgs/emergency-expert--active.svg'));
markerSet.set('应急专家--禁用激活', require('./assets/imgs/emergency-expert--disabled--active.svg'));
miniMarkerSet.set('应急专家', require('./assets/imgs/mini/emergency-expert.svg'));
miniMarkerSet.set('应急专家--禁用', require('./assets/imgs/mini/emergency-expert--disabled.svg'));
markerSet.set('应急物资', require('./assets/imgs/emergency-supplies.svg'));
markerSet.set('应急物资--禁用', require('./assets/imgs/emergency-supplies--disabled.svg'));
markerSet.set('应急物资--红色', require('./assets/imgs/red/emergency-supplies.svg'));
markerSet.set('应急物资--激活', require('./assets/imgs/emergency-supplies--active.svg'));
markerSet.set('应急物资--禁用激活', require('./assets/imgs/emergency-supplies--disabled--active.svg'));
miniMarkerSet.set('应急物资', require('./assets/imgs/mini/emergency-supplies.svg'));
miniMarkerSet.set('应急物资--禁用', require('./assets/imgs/mini/emergency-supplies--disabled.svg'));
markerSet.set('应急物资库', require('./assets/imgs/emergency-supplies-warehouse.svg'));
markerSet.set('应急物资库--禁用', require('./assets/imgs/emergency-supplies-warehouse--disabled.svg'));
markerSet.set('应急物资库--红色', require('./assets/imgs/red/emergency-supplies-warehouse.svg'));
markerSet.set('应急物资库--激活', require('./assets/imgs/emergency-supplies-warehouse--active.svg'));
markerSet.set('应急物资库--禁用激活', require('./assets/imgs/emergency-supplies-warehouse--disabled--active.svg'));
miniMarkerSet.set('应急物资库', require('./assets/imgs/mini/emergency-supplies-warehouse.svg'));
miniMarkerSet.set('应急物资库--禁用', require('./assets/imgs/mini/emergency-supplies-warehouse--disabled.svg'));
markerSet.set('联系人', require('./assets/imgs/liaison.svg'));
markerSet.set('联系人--禁用', require('./assets/imgs/liaison--disabled.svg'));
markerSet.set('联系人--红色', require('./assets/imgs/red/liaison.svg'));
markerSet.set('联系人--激活', require('./assets/imgs/liaison--active.svg'));
markerSet.set('联系人--禁用激活', require('./assets/imgs/liaison--disabled--active.svg'));
miniMarkerSet.set('联系人', require('./assets/imgs/mini/liaison.svg'));
miniMarkerSet.set('联系人--禁用', require('./assets/imgs/mini/liaison--disabled.svg'));
markerSet.set('联系人-集群终端', require('./assets/imgs/liaison-with-cluster-terminal.svg'));
markerSet.set('联系人-集群终端--禁用', require('./assets/imgs/liaison-with-cluster-terminal--disabled.svg'));
miniMarkerSet.set('联系人-集群终端', require('./assets/imgs/mini/liaison-with-cluster-terminal.svg'));
miniMarkerSet.set('联系人-集群终端--禁用', require('./assets/imgs/mini/liaison-with-cluster-terminal--disabled.svg'));
markerSet.set('联系人-wecomm', require('./assets/imgs/liaison-with-wecomm.svg'));
markerSet.set('联系人-wecomm--禁用', require('./assets/imgs/liaison-with-wecomm--disabled.svg'));
miniMarkerSet.set('联系人-wecomm', require('./assets/imgs/mini/liaison-with-wecomm.svg'));
miniMarkerSet.set('联系人-wecomm--禁用', require('./assets/imgs/mini/liaison-with-wecomm--disabled.svg'));
markerSet.set('监控', require('./assets/imgs/monitor.svg'));
markerSet.set('监控--禁用', require('./assets/imgs/monitor--disabled.svg'));
markerSet.set('监控--红色', require('./assets/imgs/red/monitor.svg'));
markerSet.set('监控--激活', require('./assets/imgs/monitor--active.svg'));
markerSet.set('监控--禁用激活', require('./assets/imgs/monitor--disabled--active.svg'));
miniMarkerSet.set('监控', require('./assets/imgs/mini/monitor.svg'));
miniMarkerSet.set('监控--禁用', require('./assets/imgs/mini/monitor--disabled.svg'));
// 列表图标
markerSet.set('医疗机构', require('./assets/imgs/mini/medical.svg'));
markerSet.set('医疗机构--禁用', require('./assets/imgs/mini/medical--disabled.svg'));
miniMarkerSet.set('医疗机构', require('./assets/imgs/mini/medical.svg'));
miniMarkerSet.set('医疗机构--禁用', require('./assets/imgs/mini/medical--disabled.svg'));
// 落点图标
markerSet.set('医疗', require('./assets/imgs/medical.svg'));
markerSet.set('医疗--激活', require('./assets/imgs/medical--active.svg'));
markerSet.set('医疗--禁用', require('./assets/imgs/medical--disabled.svg'));
markerSet.set('医疗--红色', require('./assets/imgs/red/medical.svg'));

markerSet.set('监控视频', require('./assets/imgs/monitor.svg'));
markerSet.set('监控视频--禁用', require('./assets/imgs/monitor--disabled.svg'));
miniMarkerSet.set('监控视频', require('./assets/imgs/mini/monitor.svg'));
miniMarkerSet.set('监控视频--禁用', require('./assets/imgs/mini/monitor--disabled.svg'));
markerSet.set('视频链', require('./assets/imgs/monitor-link.svg'));
markerSet.set('视频链--禁用', require('./assets/imgs/monitor-link--disabled.svg'));
miniMarkerSet.set('视频链', require('./assets/imgs/mini/monitor-link.svg'));
miniMarkerSet.set('视频链--禁用', require('./assets/imgs/mini/monitor-link--disabled.svg'));
markerSet.set('防护目标', require('./assets/imgs/protection-target.svg'));
markerSet.set('防护目标--禁用', require('./assets/imgs/protection-target--disabled.svg'));
markerSet.set('防护目标--红色', require('./assets/imgs/red/protection-target.svg'));
markerSet.set('防护目标--激活', require('./assets/imgs/protection-target--active.svg'));
markerSet.set('防护目标--禁用激活', require('./assets/imgs/protection-target--disabled--active.svg'));
miniMarkerSet.set('防护目标', require('./assets/imgs/mini/protection-target.svg'));
miniMarkerSet.set('防护目标--禁用', require('./assets/imgs/mini/protection-target--disabled.svg'));
markerSet.set('风险隐患', require('./assets/imgs/risk.svg'));
markerSet.set('风险隐患--禁用', require('./assets/imgs/risk--disabled.svg'));
markerSet.set('风险隐患--红色', require('./assets/imgs/red/risk.svg'));
markerSet.set('风险隐患--激活', require('./assets/imgs/risk--active.svg'));
markerSet.set('风险隐患--禁用激活', require('./assets/imgs/risk--disabled--active.svg'));
miniMarkerSet.set('风险隐患', require('./assets/imgs/mini/risk.svg'));
miniMarkerSet.set('风险隐患--禁用', require('./assets/imgs/mini/risk--disabled.svg'));
markerSet.set('避难场所', require('./assets/imgs/shelter.svg'));
markerSet.set('避难场所--禁用', require('./assets/imgs/shelter--disabled.svg'));
markerSet.set('避难场所--红色', require('./assets/imgs/red/shelter.svg'));
markerSet.set('避难场所--激活', require('./assets/imgs/shelter--active.svg'));
markerSet.set('避难场所--禁用激活', require('./assets/imgs/shelter--disabled--active.svg'));
miniMarkerSet.set('避难场所', require('./assets/imgs/mini/shelter.svg'));
miniMarkerSet.set('避难场所--禁用', require('./assets/imgs/mini/shelter--disabled.svg'));
markerSet.set('任务', require('./assets/imgs/task.svg'));
markerSet.set('任务--禁用', require('./assets/imgs/task--disabled.svg'));
markerSet.set('任务--红色', require('./assets/imgs/red/task.svg'));
markerSet.set('任务--激活', require('./assets/imgs/task--active.svg'));
markerSet.set('任务--禁用激活', require('./assets/imgs/task--disabled--active.svg'));
miniMarkerSet.set('任务', require('./assets/imgs/mini/task.svg'));
miniMarkerSet.set('任务--禁用', require('./assets/imgs/mini/task--disabled.svg'));
markerSet.set('会场终端', require('./assets/imgs/venue-terminal.svg'));
markerSet.set('会场终端--禁用', require('./assets/imgs/venue-terminal--disabled.svg'));
markerSet.set('会场终端--红色', require('./assets/imgs/red/venue-terminal.svg'));
markerSet.set('会场终端--激活', require('./assets/imgs/venue-terminal--active.svg'));
markerSet.set('会场终端--禁用激活', require('./assets/imgs/venue-terminal--disabled--active.svg'));
miniMarkerSet.set('会场终端', require('./assets/imgs/mini/venue-terminal.svg'));
miniMarkerSet.set('会场终端--禁用', require('./assets/imgs/mini/venue-terminal--disabled.svg'));
markerSet.set('wecomm', require('./assets/imgs/wecomm.svg'));
markerSet.set('wecomm--禁用', require('./assets/imgs/wecomm--disabled.svg'));
markerSet.set('wecomm--激活', require('./assets/imgs/wecomm--active.svg'));
markerSet.set('wecomm--禁用激活', require('./assets/imgs/wecomm--disabled--active.svg'));
miniMarkerSet.set('wecomm', require('./assets/imgs/mini/wecomm.svg'));
miniMarkerSet.set('wecomm--禁用', require('./assets/imgs/mini/wecomm--disabled.svg'));
markerSet.set('直播', require('./assets/imgs/live.svg'));
/**
 * 获取对应标注的图标 URL，标注名称不存在时返回默认标注
 * @param markerName 标注名称
 * @param active 是否激活
 * @param isMini 是否小图标
 * 1. 正常图标尺寸 40 * 40
 * 2. 正常 mini 图标尺寸 20 * 24
 * 3. 正常图标带右上角小图标尺寸 42 * 48
 * 4. mini 图标带右上角小图标尺寸 26 * 29
 * @returns 标注图标 URL
 */
function useMapMarker(
  markerName: MarkerName = '默认',
  active = 1,
  isMini = false,
): string {
  // -1禁用激活 0禁用 1平常 2激活
  let suffix = '';
  switch (active) {
    case 3:
      suffix = '--红色';
      break;
    case 2:
      suffix = '--激活';
      break;
    case 0:
      suffix = '--禁用';
      break;
    case -1:
      suffix = '--禁用激活';
      break;
    default:
      break;
  }
  const set = isMini ? miniMarkerSet : markerSet;
  console.log(`${markerName}${suffix}`);
  return set.get(`${markerName}${suffix}`) ?? set.get(`默认${suffix}`);
}

export default useMapMarker;
