<template>
    <div v-if="components.length" >
        <div
            v-for="(item, index) in components"
            :key="item.id"
            class="video-item"
            @click="handleSelectLiveVideo(item, index)"
            >
            <div
                :class="'video-img ' + (activeLiveVideoIndex === index ? 'video-img--active' : '')"
            >
                <img v-if="item.image" :src="item.image" alt="" />
                <video v-else-if="item.localRecordUrl" :src="item.localRecordUrl"></video>
                <div
                v-else
                :id="`mini-stream-${item.id}`"
                class="video-no-img"
                >等待中</div>
            </div>
            <div v-if="item.origin === 'UAV'" class="video-name">
                {{ '无人机编号：' + item.number }}
            </div>
            <div v-else class="contactor">
                <!-- <span :class="'type ' + (item.type === '任务' ? 'green' : 'blue')">{{
                item.type
                }}</span> -->
                <span class="name">{{
                item.uploadContactor.name +
                    '(' +
                    item.uploadContactor.groupName +
                    '/' +
                    item.uploadContactor.position +
                    ')'
                }}</span>
            </div>
            <div :class="(item.origin === 'UAV' || item.origin === 'LIVE') ? 'type-img type-img-rightTop': 'type-img type-img-more'"> 
                <img v-if="item.origin === 'UAV'" src="../../EventAttachments/assets/svg/uav2.svg" alt="" />
                <img v-else-if="item.origin === 'LIVE'" src="../../EventAttachments/assets/svg/live2.svg" alt="" />
                <template v-else>
                    <img src="../../EventAttachments/assets/svg/more.svg" alt="" class="img-more" @click.stop="changeTask(item)" />
                    <!-- 更多 -->
                    <div v-if="item.showMoreButton" class="more-button">
                        <button>变更任务</button>
                        <button>取消任务</button>
                    </div>
                </template>
            </div>
            <!-- 关联按钮 -->
            <div :class="item.eventLinked?'video-relation video-relation-active':'video-relation'"  @click.stop="relation(item)" >
                {{ item.eventLinked ? '已关联' : '关联' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { videoItme, historyData } from '@/product/CommandBrain3.0/FunModule/EventInformation/statement/statement';

export default defineComponent({
    props: {
        components: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, context) {
       const showMoreButton = ref(false);
       function handleSelectLiveVideo(param:videoItme, index:number) {
           context.emit('handleSelectLiveVideo', param, index);
       }

       function changeTask(param:videoItme) {
           param.showMoreButton = !param.showMoreButton;
           context.emit('changeTask', '');
       }
       
       function relation(param:videoItme) {
           context.emit('relation', param);
       }
       return {
           handleSelectLiveVideo,
           showMoreButton,
           changeTask,
           relation,
       }
    }
})
</script>

<style lang="scss" module>
@use '../../EventAttachments/assets/css/eventAttachments.scss';
</style>