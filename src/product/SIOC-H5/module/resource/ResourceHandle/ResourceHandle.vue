<template>
  <div class="resource-form">
    <van-cell-group>
        <van-field label="资源清单" readonly :right-icon="!editTag ? '' : 'add-o' " @click="handleResource"/>
        <div class="resource-form-sth" v-for="(item,index) in resourceObj.resources" :key="index">
            <p class="resource-form-sth-item">{{item.name}}({{item.number}}{{item.unit}})</p>
            <p v-show="editTag" class="resource-form-sth-edit" @click="handleResource(item)"></p>
            <p v-show="editTag" class="resource-form-sth-delete" @click="handleResource(item.id)"></p>
        </div>
    </van-cell-group>
    <van-cell-group>
        <van-field :readonly="!editTag" v-model="resourceObj.name" label="申请名称" placeholder="请输入申请名称" />
        <van-field :readonly="!editTag" v-model="resourceObj.unit" label="申请单位" placeholder="请输入申请单位名称" />
    </van-cell-group>    
    <van-cell-group>
        <van-field :readonly="!editTag" v-model="resourceObj.contactName" label="联系人"   placeholder="请输入联系人姓名" />
        <van-field :readonly="!editTag" v-model="resourceObj.contactPhone" label="联系电话" placeholder="请输入申请电话" />
    </van-cell-group>      
    <van-cell-group>
        <van-field is-link readonly v-model="chooseDate" @click="!editTag ? timeSelectShow = false : timeSelectShow = true" label="到达时限" />
    </van-cell-group>
    <van-cell-group>
        <van-field :readonly="!editTag" v-model="resourceObj.remark" label="申请说明" placeholder="请输入申请说明" />
    </van-cell-group>     
    <van-cell-group>
    <van-field name="uploader" label="上传图片">
        <template v-if="detailTag && !editTag && !addTag" #input>
            <div class="resource-form-imgBox">
                <img v-for="(item,index) in resourceObj.pics" :key="index" :src="baseURL+'/fileupload'+item.path+item.name" alt="">
            </div>
        </template>   
       <template v-else #input>
            <van-uploader  :multiple="true" v-model="imgList" :after-read="afterRead" :before-read="beforeRead" @delete="deleteImg" />
        </template>           
    </van-field>
    </van-cell-group>    
    <!-- pop -->
    <!-- 资源 -->
    <van-popup :close-on-click-overlay="false" round closeable close-icon-position="top-left" v-model:show="resourceSelectShow" position="bottom" :style="{ height: '50%' }">
        <div class="resource-form-pop-header">
            <p class="resource-form-pop-header_title">添加资源</p>
            <p class="resource-form-pop-header_confirm" @click="handleResource('confirm')">确定</p>
        </div>
        <van-cell-group>
            <van-field v-model="resourceItems.name" label="资源名称"   placeholder="请输入资源名称" />
            <van-field v-model="resourceItems.number" label="资源数量"   placeholder="请输入数量" />
             <van-field v-model="resourceItems.unit" label="资源单位"   placeholder="请输入规格" />
        </van-cell-group>             
    </van-popup>    
    <!-- 时间 -->
    <van-popup v-model:show="timeSelectShow" position="bottom">
        <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择时间"
        @confirm="timeConfirm"
        />
    </van-popup>
    <!-- 删除 -->
    <van-popup :close-on-click-overlay="false" round   v-model:show="deleteSelectShow" position="bottom" :style="{ height: '20%' }">
        <div class="resource-form-pop-header">
            <p class="resource-form-pop-header_title">是否删除该现场支援</p>
        </div>
        <div class="resource-form-pop-box">
            <p class="resource-form-pop-box_delete" @click="deleteResource(resourceObj.id)">删除</p>
            <p class="resource-form-pop-box_cancel" @click="deleteSelectShow = false">取消</p>
        </div>
    </van-popup>     
  </div>
  <!-- 底部 -->
   <div v-show="addTag" class="resource-bottom_add">
       <div class="resource-bottom_add_cancel" @click="router.go(-1)">取消</div>
       <div class="resource-bottom_add_confirm" @click="reportResource">确定</div>
   </div>
   <div v-show="detailTag && !editTag" class="resource-bottom_detail">
       <div class="resource-bottom_detail_delete" @click="deleteSelectShow = true">删除</div>
       <div class="resource-bottom_detail_edit" @click="editTag = true">编辑</div>
   </div>   
   <div v-show="editTag && !addTag" class="resource-bottom_detail">
       <div class="resource-bottom_add_cancel" @click="editTag = false">取消编辑</div>
       <div class="resource-bottom_detail_edit" @click="reportResource">确定</div>
   </div>      
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import $handleLocation from '@/product/SIOC-H5/mainCapacity/Location/location';
export default defineComponent({
  name: 'ResourceHandle',
  components: {
  },
  setup() {
    // 定位相关
    const { GDLocation } = $handleLocation();
    let locationObj = ref({})
    // 路由实例
    const router = useRouter();
    const resourceId = router.currentRoute.value.params.resourceId
    console.log(resourceId)
    // 资源列表
    let resourceObj = ref({})
    let resourceIsEdit = ref(false)
    // 资源pop
    let resourceItems =ref({})
    let resourceSelectShow = ref(false)
    // 时间pop
    let currentDate = ref(new Date())
    let timeSelectShow = ref(false)
    let chooseDate = ref('')
    // 删除pop
    let deleteSelectShow = ref(false)
    // 图片
    let imgList = ref([])
    let resImgList = ref([])
    // 是否可编辑
    let editTag = ref(false)
    // 是否是新增资源
    let addTag = ref(false)
    // 是否是详情页
    let detailTag = ref(false)
    // 文件服务器前缀
    const baseURL = window.config.baseURL;
    return { 
    GDLocation,
    locationObj,
    router,
    resourceId,
    resourceObj,
    resourceIsEdit,
    resourceItems,
    resourceSelectShow,
    timeSelectShow,
    currentDate,
    chooseDate,
    deleteSelectShow,
    imgList,
    resImgList,
    editTag,
    addTag,
    detailTag,
    baseURL }
  },
  data() {
    return {
    };
  },
  mounted() {
    this.getResourceDetail(this.resourceId)
    this.GDLocation().then((res) => {
        console.log('高德定位结果', res)
        if (res) {
            this.locationObj = res
        }
    })
  },
  methods: {
    // 获取详情或为新增页
    getResourceDetail(resourceId) {
        if(resourceId == 0) {
            this.addTag = true
            this.editTag = true
            this.resourceObj.resources = []
            return
        }
        console.log(resourceId)
        const request = {
            method: 'get',
            url: '/event/resource/apply/detail',
            headers: {
            'Content-Type': 'application/json',
            },
            params:{
                id:resourceId
            }
        }
      this.$http(request)
        .then((response) => {
          console.log('/event/resource/apply/detail', response);
          if (response.errorcode === 0 && response?.data) {
            this.resourceObj = response.data
            this.chooseDate = this.resourceObj.arriveDate
            this.detailTag = true
            this.resourceObj.pics.forEach(ele => {
                this.imgList.push({
                    url:this.baseURL+'/fileupload'+ele.path+ele.name,
                    path:ele.path,
                    name:ele.name
                })
            })
            this.resImgList = this.imgList
          } else {
            this.$notify({
              type: 'danger',
              message: `获取资源详情数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        }).catch((error) => {
          this.$notify({
            type: 'danger',
            message: `获取资源详情数据失败，错误信息：${error}`,
          });
        });            
        
    },
    //资源清单相关
    handleResource(val) {
        console.log(val)
        if(!this.editTag) {
            return
        }
        else if(val.constructor == Number) {
            this.resourceObj.resources = this.resourceObj.resources.filter(ele => {
                return ele.id !== val
            })
            return
        }
        else if(val.constructor == Object) {
            this.resourceItems.id = val.id
            this.resourceItems.name = val.name
            this.resourceItems.number = val.number
            this.resourceItems.unit = val.unit
            this.resourceIsEdit = true
            this.resourceSelectShow = true
        }else if (val == 'confirm' ) {
            // 是否是为编辑
            if(this.resourceIsEdit) {
                this.resourceObj.resources.map(ele => {
                    if(ele.id == this.resourceItems.id) {
                        ele.name = this.resourceItems.name
                        ele.number = this.resourceItems.number
                        ele.unit = this.resourceItems.unit
                    }
                })
                this.resourceSelectShow = false
                this.resourceIsEdit = false
                return
            }
            this.resourceItems.id = Math.random()
            this.resourceObj.resources.push(this.resourceItems)
            this.resourceSelectShow = false
            this.resourceIsEdit = false
        }

        else {
            this.resourceItems = {}
            this.resourceSelectShow = true
        }
    },
    // 时间相关
    formatDateAll(date) {
        let h = date.getHours();  
        h=h < 10 ? ('0' + h) : h;  
        let minute = date.getMinutes();  
        minute = minute < 10 ? ('0' + minute) : minute;  
        return `${date.getFullYear()}-${date.getMonth() > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${h}:${minute}`;        
    },      
    timeConfirm(value) {
        this.chooseDate = `${this.formatDateAll(value)}`
        console.log('选择的时间',this.chooseDate)
        this.timeSelectShow = false
    },    
    // 修改或新增现场支援  
    reportResource() {
        let data = {
            resource:this.resourceObj.resources,
            apply:{
                id:this.resourceObj.id || undefined,
                name:this.resourceObj.name,
                unit:this.resourceObj.unit,
                contact_name:this.resourceObj.contactName,
                contact_phone:this.resourceObj.contactPhone,
                arrive_date:this.chooseDate,
                remark:this.resourceObj.remark,
                cgcsLongitude: this.locationObj.longitude,
                cgcsLatitude: this.locationObj.latitude,
                longitude: this.locationObj.longitude,
                latitude: this.locationObj.latitude,
                address:this.locationObj.address
            },
            pic:this.resImgList
        }
        const request = {
            method: 'post',
            url: '/event/resource/apply/save',
            headers: {
                'Content-Type': 'application/json',
            },
            data:{
                data:data
            }
        }
        this.$http(request)
            .then((response) => {
            console.log('/event/resource/apply/save', response);
            if (response.errorcode === 0) {
                this.$notify({
                type: 'success',
                message: `保存成功`,
                });
                this.router.push({path:`/resourceList`})
            } else {
                this.$notify({
                type: 'danger',
                message: `保存失败，错误代码${response.code}，错误信息：${response.msg}`,
                });
            }
            }).catch((error) => {
            this.$notify({
                type: 'danger',
                message: `保存失败，错误信息：${error}`,
            });
            });           
    },
    deleteResource(id) {
        const request = {
            method: 'post',
            url: '/event/resource/apply/delete',
            headers: {
            'Content-Type': 'application/json',
            },
            params:{
                id
            }
        }      
        this.$http(request)
            .then((response) => {
            console.log('/event/resource/apply/delete', response);
            if (response.errorcode === 0) {
                this.deleteSelectShow = false
                this.$notify({
                type: 'success',
                message: `删除成功`,
                });
                this.router.push({path:`/resourceList`})
            } else {
                this.$notify({
                type: 'danger',
                message: `删除失败，错误代码${response.code}，错误信息：${response.msg}`,
                });
            }
            }).catch((error) => {
            this.$notify({
                type: 'danger',
                message: `删除失败，错误信息：${error}`,
            });
            });                   
    },
    // 图片上传相关
    fileUploadAttachment(file) {
      let fileData = ref(new FormData());
      fileData.value.append('file', file);
      let requestData3 = ref({
        method: 'post',
        service: 'file',
        url: '/resource/apply/pic/upload',
        data: fileData.value,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      });
      this.$http(requestData3.value)
        .then((res) => {
          if (res.errorcode === 0 && res.data) {
            let path={
                url:this.baseURL+'/fileupload'+res.data.filePath,   
                path:res.data.path,
                name:res.data.fileName,
            }
            this.resImgList.push(path);
          } else {
            this.$notify({
              type: 'danger',
              message: `文件上传失败，错误代码${res.code}，错误信息：${res.msg}`,
            });
          }
        })
        .catch((error) => {
          if (error.code) {
            this.$notify({
              type: 'danger',
              message: `文件上传失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    },
    afterRead(file){
        console.log(file)
        if(Array.isArray(file)){
            file.forEach(ele=>{
                this.fileUploadAttachment(ele.file)
            })
        }else{
            this.fileUploadAttachment(file.file)
        }
    },
    beforeRead(file) {
        console.log(file)
        if(Array.isArray(file)){
            file.forEach(ele=>{
                if(ele.type != 'image/jpeg' && ele.type != 'image/png' ){
                    Toast('请选择jpg、png格式图片上传')
                    return false
                }
            })
        }else{
            if(file.type != 'image/jpeg' && file.type != 'image/png' ){
                Toast('请选择jpg、png格式图片上传')
                return false
            }
        }
        return true;
    },
    deleteImg(file,index) {
        this.resImgList.splice(index,1)
    },
  },
});
</script>
<style  scoped>
    .resource-form {
        background: #F2F2F2;
        height: 100vh;
        padding-top: 5px;
    }
    .van-cell-group:nth-child(1) {
        padding-bottom: 10px;
        overflow: hidden;
    }
    .resource-form-sth {
        display: flex;
        flex-flow: nowrap;
        background: #F7F8FA;
        width: 90%;
        margin: 10px auto 0;
    }    
    .resource-form-sth-item {
        width: 75%;
        padding-left: 10px;
    }        
    .resource-form-sth-delete {
        width: 15px;
        height: 18px;
        background: url(./assets/delete.png)  no-repeat;
        background-size: 100% 100%;
        margin-left: 15px;
    }      
    .resource-form-sth-edit {
        width: 15px;
        height: 18px;
        background: url(./assets/edit.png)  no-repeat ;
        background-size: 100% 100%;
        margin-right: 15px;
    }    
    .resource-form-sth-edit::after {
        content: '';
        position: relative;
        left: 30px;
        border-right: 1px solid #DCDEE0;
        width: 1px;
        height: 18px;
    }
    :deep(.van-field__right-icon) i{
        position: absolute;
        font-size: 21px;
        right: 0;
        color: #0091FF;
        transform: translateY(-50%);
    }  
    .van-cell-group {
        margin: 0 5px 5px;
    }    
    .resource-bottom_add,.resource-bottom_detail {
        position: fixed;
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        
        bottom: 0;
        background: #FFFFFF;
    }
    .resource-bottom_add div,.resource-bottom_detail div {
        font-size: 18px;
        font-weight: 400;
        height: 56px;
        line-height: 56px;
        flex:1;
        text-align: center;
    }
    .resource-bottom_add_cancel {
        color: #C8C9CC;
    }
    .resource-bottom_detail_delete {
        color: #F94E36;
    }
    .resource-bottom_add_confirm,.resource-bottom_detail_edit{
        color: #FFFFFF;
        background: #0091FF;
    }
    .resource-form-pop-header {
        display: flex;
        flex-flow: nowrap;
        padding-left: 30%;
    }
    .resource-form-pop-header_title {
        font-size: 18px;
        font-weight: 500;
        color: #333333;
    }
    .resource-form-pop-header_confirm {
        font-size: 18px;
        font-weight: 400;
        color: #0091FF;
    }
    .resource-form-pop-header p {
        height: 27px;
        line-height: 17px;
        width: 61%;
        text-align: center;
    }
    .resource-form-imgBox {
        display: flex;
        flex-flow: wrap;
        width: 100%;
    }
    .resource-form-imgBox img {
        width: 107px;
        height: 88px;
        border-radius: 2px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .resource-form-pop-box {
        display: flex;
        width: 100%;
        flex-flow: column;
    }
    .resource-form-pop-box p{
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
    }
    .resource-form-pop-box_cancel {
        color: #999999;
    }
    .resource-form-pop-box_delete {
        color: #F94E36;
    }
</style>
