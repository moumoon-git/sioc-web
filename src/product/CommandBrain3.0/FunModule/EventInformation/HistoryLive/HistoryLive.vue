<template>
    <div :class="$style.HistoryLive">
        <!-- 头部 -->
        <div :class="$style.header">
            <div @click="back">
                <span>返回</span>
            </div>
            <span>历史直播</span>
            <i>总数 34</i>
        </div>
        <!-- 主题内容 -->
        <div :class="$style.main">
            <div
                :class="$style.mainItem"
                v-for="(item, index) in historyDatas"
                :key="index"
            >
                <div :class="`${$style['section-label']} ${$style.liveMainHeader}`">
                    {{item.date}}
                    <span>
                        数量 {{item.records.length}}
                    </span>
                </div>
                <LiveVideo
                    :class="$style.liveVideo"
                    :components="item.records"
                    @handleSelectLiveVideo="handleSelectLiveVideo"
                    @relation="relation"
                />
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { videoItme, historyArray, historyData, videoObj } from '@/product/CommandBrain3.0/FunModule/EventInformation/statement/statement';
import LiveVideo from '@/product/CommandBrain3.0/FunModule/EventInformation/components/LiveVideo/LiveVideo.vue';

export default defineComponent({
    name: 'HistoryLive',
    components: {
        LiveVideo,
    },
    setup(props, context) {
        const store = useStore();
        const instance: any = getCurrentInstance();
        const {
            $http,
            $videoViewer,
        } = instance?.appContext.config.globalProperties;
        const historyDatas = ref<historyArray[]>([{date:'',records:[]}]);
        // 播放视频
        function handleSelectLiveVideo(param:historyData) {
            $videoViewer({
                title: '文件详情',
                path: param.localRecordUrl,
                contactor: {
                    name: param?.userVo.username,
                    roleName: param?.userVo.roleName,
                    department: param?.userVo.department,
                },
                address: param?.uploadContactor.address,
            });
        }
        // 返回
        function back() {
            context.emit('back', '');
        }
        // 处理时间
        function handleDate(date:string) {
            const dateArr = date.split('-');
            // 存储长度
            const leg = dateArr.length;
            // 赋值长度
            dateArr.length = 3;
            // 填充数组，确保一定有3个
            dateArr.fill('-', leg, 3);
            return `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`;
        }
        // 获取历史直播数据
        function getHistoryLive() {
            const requestData: any = {
                method: 'get',
                service: 'eoc',
                url: '/im/appImLive/history',
            };
            $http(requestData).then((res:{code:number, data:historyArray[] }) => {
                if (res.code === 0) {
                    historyDatas.value = res.data;
                    historyDatas.value.forEach((arr:historyArray) => {
                        arr.date = handleDate(arr.date);
                        arr.records.forEach((data:historyData) => {
                            data.origin = 'LIVE';
                            data.localRecordUrl = (window as any).config.baseURL + data.localRecordUrl;
                            data.uploadContactor = {
                                name: data.userVo?.name || '未知用户',
                                position: data.userVo?.roleName || '暂无',
                                groupName: data.userVo?.department || '暂无',
                                address: data.liveAddress || '暂无地址',
                            }
                        });
                    });
                    console.log(historyDatas.value);
                }
            });
        }
                // 关联
        function relation(param:videoItme) {
            console.log(param);
            const request = {
                method: 'post',
                service: 'eoc',
                url: '/im/appImLive/history/linkEvent',
                data: {
                    id: String(param.id),
                    eventId: String(store.state.event.id),
                    eventLinked: (param.eventLinked === 0 ? 1 : 0), // 关联事件，1：关联，0：取消
                },
            };
            $http(request).then(() => {
                getHistoryLive();
            });
        }
        onMounted(() => {
            getHistoryLive();
        });
        return {
            back,
            historyDatas,
            handleSelectLiveVideo,
            relation,
        }
    }
});
</script>

<style lang="scss" module>
@use '../EventAttachments/assets/css/eventAttachments.scss';

.HistoryLive{
    color: #fff;
    height: 100%;
    overflow: hidden;
    .header{
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background:no-repeat 100% 100% url('./assets/svg/headerBg.svg');
        padding: 5px 10px 0;
        box-sizing: border-box;
        &>div{
            cursor: pointer;
            position: relative;
            padding-left: 14px;
            &::before{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                margin: auto;
                width: 8px;
                height: 8px;
                border: 1px solid #fff;
                border-right: none;
                border-bottom: none;
                transform: rotate(-45deg);
            }
        }
        &>span{
            font-size: 18px;
            font-weight: 500;
            color: #00ECFF;
        }
    }
    .main{
        height: calc( 100% - 60px);
        width: calc( 100% - 20px);
        margin: 10px 0 10px 20px;
        padding: 10px 30px 10px 0;
        box-sizing: border-box;
        background: linear-gradient(90deg, rgba(0, 193, 222, 0.2) 0%, rgba(24, 38, 50, 0) 100%);
        .liveMainHeader{
            margin-bottom: 7px;
            &>span{
                position: absolute;
                font-size: 14px;
                font-weight: 400;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                color: #FFFFFF;
            }
        }
        .mainItem{
            margin-bottom: 20px;
            .liveVideo{
                display: flex;
                flex-wrap: wrap;
                &>div{
                    width: 164px;
                }
            }
        }
    }
}
</style>
