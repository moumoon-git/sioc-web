<template>
  <div style="padding-right: 11px;">
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
    >
      <el-form-item label="事件标题" prop="title">
        <el-input
          v-model="dataForm.title"
          placeholder="请输入事件标题"
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="事发时间" prop="occurTime">
        <el-date-picker
          v-model="dataForm.occurTime"
          type="datetime"
          placeholder="请选择事发时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="sbs-date-picker"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="接报时间" prop="reportTime">
        <el-date-picker
          v-model="dataForm.reportTime"
          type="datetime"
          placeholder="请选择接报时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="sbs-date-picker"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="事故单位">
        <el-input
          v-model="dataForm.incidentUnit"
          placeholder="请输入事故单位"
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="所属区域" prop="area">
        <el-cascader
          ref="areaRef"
          v-model="dataForm.area"
          placeholder="请选择所属区域"
          :options="areaOptions"
          clearable
          :show-all-levels="false"
          :props="areaProps"
          class="sbs-cascader"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="事发地点" prop="occurAddress">
        <el-input
          v-model="dataForm.occurAddress"
          placeholder="请输入事发地点"
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="落图地点" prop="locationAddress">
        <el-input
          v-model="dataForm.locationAddress"
          placeholder="请选择落图地点"
          class="sbs-input"
          style="width: 83%;"
        />
        <el-button
          type="text"
          icon="el-icon-location-outline"
          class="sbs-button"
          @click="openLocationDialog"
        >
          地点
        </el-button>
        <!-- <LocationDialog
          ref="LocationDialogRef"
        /> -->
      </el-form-item>
      <el-form-item label="报告单位">
        <el-input
          v-model="dataForm.reportUnit"
          placeholder="请输入报告单位"
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="事件类型" prop="eventType">
        <el-cascader
          ref="eventTypeRef"
          v-model="dataForm.eventType"
          placeholder="请选择事件类型"
          :options="eventOptions"
          clearable
          :props="eventProps"
          :show-all-levels="false"
          class="sbs-cascader"
          style="width: 100%;"
          @change="getParameter"
        />
      </el-form-item>
      <div>
        <div
          v-for="(item, index) in parameter"
          :key="index"
          class="parameter"
        >
          <span>
            {{ item.name }}<span v-if="item.unit">({{ item.unit }})</span>:
          </span>
          <el-input-number
            v-if="item.type === '数字'"
            v-model="item.value"
            size="mini"
            :min="0"
            label="描述文字"
          />
          <el-input
            v-if="item.type === '文本'"
            v-model="item.value"
            type="text"
            size="mini"
            show-word-limit
          />
          <el-select
            v-if="item.type == '选择'"
            v-model="item.value"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="(items, i) in item.struct"
              :key="i"
              :value="items"
            />
          </el-select>
          <el-date-picker
            v-if="item.type == '时间'"
            v-model="item.value"
            size="mini"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          />
        </div>
      </div>
      <el-form-item label="事故简况" prop="remark">
        <el-button
          type="text"
          class="sbs-button"
          @click="createReport"
        >
          生成事件报文
        </el-button>
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          :rows="4"
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="现场处置情况" class="marginTop">
        <el-input
          v-model="dataForm.sceneRemark"
          type="textarea"
          :rows="4"
          class="sbs-input"
        />
      </el-form-item>
      <!-- <el-form-item label="其他附件">
        <el-upload
          ref="upload"
          action=""
          accept=".jpg, .jpeg, .png, .pdf, .doc"
          :http-request="uploadFileMethod"
          :file-list="dataForm.filelist"
        >
          <el-button class="sbs-button">上传文件</el-button>
        </el-upload>
      </el-form-item> -->
      <el-button
        class="sbs-button"
        type="text"
        style="color: #969799;margin-left: 36%;"
        @click="isExpand=!isExpand"
      >
        {{ `${isExpand?'收起':'展开查看'}更多扩展信息>>>` }}
      </el-button>
      <el-form-item label="事发原因" v-if="isExpand" class="marginTop">
        <el-input
          v-model="dataForm.cause"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="已造成后果" v-if="isExpand" class="marginTop">
        <el-input
          v-model="dataForm.result"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="事件发展趋势" v-if="isExpand" class="marginTop">
        <el-input
          v-model="dataForm.develop"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          class="sbs-input"
        />
      </el-form-item>
      <el-form-item label="已采取措施" v-if="isExpand" class="marginTop">
        <el-input
          v-model="dataForm.measure"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          class="sbs-input"
        />
      </el-form-item>
    </el-form>
  </div>
  <div class="line" />
  <div class="footer">
    <el-button class="sbs-button" type="primary" @click="submit" style="float: right;margin-left: 8px;">保存事件</el-button>
    <el-button class="sbs-button" @click="emit('close')" type="plain" style="color: #95A5BB;float: right;">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onMounted,
} from 'vue';
import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import {
  uploadFile,
} from './js/TaskManager';
import LocationDialog from '../../../generalparts/Location/LocationDialog.vue';

const LocationDialogRef: any = ref(null);
const isExpand = ref(false); // 扩展信息
const dataFormRef: any = ref(null);
const areaRef: any = ref(null);
const eventTypeRef: any = ref(null);
const areaProps: any = ref({
  value: 'id',
  label: 'townName',
  checkStrictly: true,
});
const eventProps: any = ref({
  value: 'id',
  label: 'name',
  checkStrictly: true,
});
const dataForm: any = reactive({
  title: '', // 事件标题
  occurTime: '', // 事发时间
  reportTime: '', // 接报时间
  incidentUnit: '', // 事故单位
  area: [], // 所属区域
  occurAddress: '', // 事发地点
  locationAddress: '', // 落图地点
  locationLongitude: 0.0, // 落图地点经度
  locationLatitude: 0.0, // 落图地点纬度
  reportUnit: '', // 报告单位
  eventType: [], // 事件类型
  remark: '', // 事故简况
  sceneRemark: '', // 现场处置情况
  filelist: [], // 其他附件
  cause: '', // 事发原因
  result: '', // 已造成后果
  develop: '', // 事件发展趋势
  measure: '', // 已采取措施
});
const dataRule = ref({
	title: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	occurTime: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	reportTime: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	area: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	occurAddress: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	locationAddress: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	eventType: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
	remark: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
}); // 规则
const areaOptions = ref([]); // 所属区域
const eventOptions: any = ref([]); // 事件类型
const parameter: any = ref([]); // 事件类型对应参数
const emit = defineEmits(['fresh', 'close', 'openLocationDialog']);
const init = () => {
  dataForm.title = ''; // 事件标题
  dataForm.occurTime = ''; // 事发时间
  dataForm.reportTime = ''; // 接报时间
  dataForm.incidentUnit = ''; // 事故单位
  dataForm.area = []; // 所属区域
  dataForm.occurAddress = ''; // 事发地点
  dataForm.locationAddress = ''; // 落图地点
  dataForm.locationLongitude = 0.0; // 落图地点经度
  dataForm.locationLatitude = 0.0; // 落图地点纬度
  dataForm.reportUnit = ''; // 报告单位
  dataForm.eventType = []; // 事件类型
  dataForm.remark = ''; // 事故简况
  dataForm.sceneRemark = ''; // 现场处置情况
  dataForm.filelist = []; // 其他附件
  dataForm.cause = ''; // 事发原因
  dataForm.result = ''; // 已造成后果
  dataForm.develop = ''; // 事件发展趋势
  dataForm.measure = ''; // 已采取措施
};
// 获取所属区域
const getAreaOptions = () => {
  const request: any = {
    method: 'get',
    url: '/sys/systown/list',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {},
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      areaOptions.value = response.list;
    }
  });
};
// 获取事件类型
const getEventOptions = () => {
  const request: any = {
    method: 'post',
    url: '/eos/caseClass/getTree',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {},
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      eventOptions.value = response.data;
    }
  });
};
// 根据事件类型获得参数
const getParameter = () => {
  const request: any = {
    method: 'post',
    url: '/eos/event/param/eventList',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      caseId: dataForm.eventType[dataForm.eventType.length - 1],
    },
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      parameter.value = response.data;
    }
  });
};
// 生成事件报文
const replaceMessage = (data: any) => {
  const filterText = '当前事态进展情况及数据如下：';
  const index = data.indexOf(filterText);
  let text = '';
  let content = '';
  if (index === -1) {
    text = data;
  } else {
    text = data.substring(0, index);
  }
  parameter.value.forEach((item: any) => {
    if (item.name) {
      if (item.value) {
        content += `${item.name}：【${item.name}】；`;
      } else if (item.unit) {
        content += `${item.name}：【${item.value}】；`;
      } else {
        content += `${item.name}：${item.value}（${item.unit}）；`;
      }
    }
  });
  content = `${text}${filterText}\n${content}`;
  return content;
};
// 生成事件报文模板
const createReport = () => {
  const request: any = {
    method: 'post',
    url: '/eos/event/template/list',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      caseId: dataForm.eventType[dataForm.eventType.length - 1], // 事件类型id
      typeId: '699',
      page: 1,
      size: 10,
    },
  };
  $http(request).then((response: any) => {
    if (response.errorcode === 0) {
      response.data.data.forEach((item: any) => {
        let newMessage = item.content;
        newMessage = replaceMessage(newMessage);
        if (dataForm.title) {
          newMessage = newMessage.replace('【事件标题】', dataForm.title);
        }
        if (dataForm.reportTime) {
          newMessage = newMessage.replace('【接报时间】', dataForm.reportTime);
        }
        if (dataForm.occurTime) {
          newMessage = newMessage.replace('【事发时间】', dataForm.occurTime);
        }
        if (dataForm.area.length > 0) {
          newMessage = newMessage.replace('【事发区域】', dataForm.area);
        }
        if (dataForm.occurAddress) {
          newMessage = newMessage.replace('【事发地点】', dataForm.occurAddress);
        }
        if (dataForm.reportUnit) {
          newMessage = newMessage.replace('【报送单位】', dataForm.reportUnit);
        }
        if (dataForm.eventType.length > 0) {
          newMessage = newMessage.replace('【事件类型】', dataForm.eventType);
        }
        if (dataForm.cause) {
          newMessage = newMessage.replace('【事发原因】', dataForm.cause);
        }
        if (dataForm.result) {
          newMessage = newMessage.replace('【已造成后果】', dataForm.result);
        }
        if (dataForm.develop) {
          newMessage = newMessage.replace('【事件发展趋势】', dataForm.develop);
        }
        if (dataForm.measure) {
          newMessage = newMessage.replace('【已采取措施】', dataForm.measure);
        }
        parameter.value.forEach((param: any) => {
          if (param.name) {
            if (!param.value) {
              newMessage = newMessage.replace(`【${param.name}】`, '暂无');
            } else {
              let str = `${param.value}`;
              if (!param.unit) {
                str = `${param.value}`;
              } else {
                str = `${param.value}(${param.unit})`;
              }
              newMessage = newMessage.replaceAll(`【${param.name}】`, str);
            }
          }
        });
        dataForm.remark = newMessage;
      });
    }
  });
};
// 附件
const uploadFileMethod = (param: any) => {
  const formData = new FormData();
  formData.append('files', param.file);// 参数规整
  formData.append('type', '11'); // 11是附件
  uploadFile(formData).then((response: any) => {
    if (response.errorcode === 0) {
      dataForm.filelist = response.data || [];
    }
  });
};
// 打开定位窗
const openLocationDialog = () => {
  emit('openLocationDialog', 0.0, 0.0, '');
};
// 保存事件
const submit = () => {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      const request: any = {
        method: 'post',
        url: '/eos/event/receive/saveEventReceive',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          eventCode: '', // 事件编号
          vcTitle: dataForm.title, // 事件标题
          dtReportTime: dataForm.reportTime, // 接报时间
          dtOccurTime: dataForm.occurTime, // 事发时间
          iAreaId: dataForm.area[dataForm.area.length - 1], // 区域
          vcAddress: dataForm.occurAddress, // 事发地点
          dLongitude: dataForm.locationLongitude, // 经度
          dLatitude: dataForm.locationLatitude, // 纬度
          vcReportDepart: dataForm.reportUnit, // 报送单位
          vcReportDepartId: dataForm.reportUnit, // 报送单位
          iCaseClassId: dataForm.eventType[dataForm.eventType.length - 1], // 事件类型
          iEventLevel: '', // 事件等级
          iEvnetSetingParams: parameter.value, // 事件参数
          txtReportSuperior: dataForm.remark, // 上报情况
          txtReportDescription: '', // 总体情况
          vcReportMan: '',
          vcReportNum: '',
          phoneId: '',
          writtenReportTime: '', // 书面报送时间
          reportType: '', // 报送方式
          dutyPeople: '', // 值班员
          dutyLeader: '', // 值班领导
          // 扩展信息
          txtReason: dataForm.cause,
          txtResult: dataForm.result,
          txtGrowing: dataForm.develop,
          txtMessure: dataForm.measure,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          ElMessage({
            type: 'success',
            message: '新增成功!',
          });
          emit('fresh'); // 马上刷新事件列表
          emit('close');
        }
      });
    }
  });
};
onMounted(() => {
  init();
  getAreaOptions();
  getEventOptions();
});
watch(
  () => dataForm.area,
  () => {
  }
);
watch(
  () => dataForm.eventType,
  () => {
  }
);
defineExpose({
  dataForm,
});
</script>

<style lang="scss" scoped>
.line {
  margin-top: 22px;
  width: 100%;
  height: 1px;
  background: #E9ECF1;
}
.footer {
  margin-top: 11px;
  margin-right: 14px;
}
.parameter {
  margin: 0px 0px 10px 22px;
}
.marginTop {
  margin-top: 10px;
}
</style>
