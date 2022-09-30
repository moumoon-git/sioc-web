<template>
  <div style="background: #fff;height: 100%; font-size:0">
    <div style="font-size: 14px; border: 1px solid red;">
      <el-tabs v-model="activeTab" class="sbs-tabs" @tab-click="switchTab">
        <el-tab-pane label="用户管理" name="first"></el-tab-pane>
        <el-tab-pane label="配置管理" name="second"></el-tab-pane>
        <el-tab-pane label="角色管理" name="third"></el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <span class="sbs-title">sbs-title</span>
    </div>
    <div>
      <el-button class="sbs-button" @click="handleLocation"> default </el-button>
      <el-button class="sbs-button" plain> plain </el-button>
      <el-button class="sbs-button" type="primary"> type="primary" </el-button>
      <el-button class="sbs-button" type="text"> type="text" </el-button>
      <el-button-group class="sbs-button-group">
        <el-button>上一页</el-button>
        <el-button>下一页</el-button>
      </el-button-group>
    </div>
    <div>
      <el-input
        v-model="textValue"
        class="sbs-input"
        style="width: 200px"
        clearable
      />
      <el-select
        v-model="selectValue"
        class="sbs-select"
        placeholder="请选择"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-cascader
        v-model="cascaderValue"
        class="sbs-cascader"
        :options="options"
      />
    </div>
    <div>
      <el-time-select
        v-model="timeValue1"
        class="sbs-time-select"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
        }"
        placeholder="选择时间"
      />
      <el-date-picker
        v-model="timeValue2"
        class="sbs-date-picker"
        type="date"
        placeholder="选择日期"
      />
      <el-date-picker
        v-model="timeValue3"
        class="sbs-date-picker"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>
    <div>
      <el-table :data="tableData" class="sbs-table" height="250" border>
        <el-table-column prop="date" label="日期" width="150">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="province" label="省份" width="120">
        </el-table-column>
        <el-table-column prop="city" label="市区" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="300">
        </el-table-column>
        <el-table-column prop="zip" label="邮编"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default>
            <el-button
              class="sbs-button"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="border: 1px solid red; width: 300px; height: 300px">
      <el-tree
        ref="tree"
        class="sbs-tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
      />
      <SvSelectContact
        v-model="selectedContact"
        title="联系人"
        :multiple="true"
        :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
      />
    </div>
    <div>
      <el-pagination
        class="sbs-pagination"
        small
        layout="prev, pager, next"
        :total="50"
      />
    </div>
    <div>
      <el-pagination
        class="sbs-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      custom-class="sbs-dialog"
      title="sbs-dialog"
    >
      <div>内部 padding: 0;</div>
      <div>页脚可能需要设置底部圆角为 5px</div>
    </el-dialog>
    <LocationDialog
      ref="LocationDialogRef"
    />
  </div>
</template>

<script>
import LocationDialog from '../../generalparts/Location/LocationDialog.vue';
import SvSelectContact from '../../generalparts/Temp/sv_select_contact.vue';

export default {
  name: 'Element',
  components: {
    LocationDialog,
    SvSelectContact,
  },
  data() {
    return {
      textValue: '',
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      selectValue: '',
      cascaderValue: '',
      timeValue1: '',
      timeValue2: '',
      timeValue3: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
      ],
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1',
                },
                {
                  id: 10,
                  label: '三级 1-1-2',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1',
            },
            {
              id: 6,
              label: '二级 2-2',
            },
          ],
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1',
            },
            {
              id: 8,
              label: '二级 3-2',
            },
          ],
        },
      ],
      dialogVisible: true,
      activeTab: 'first',
      currentPage: 1,
      selectedContact: [],
    };
  },
  methods: {
    switchTab(tab) {
      console.log(tab);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleLocation() {
      this.$refs.LocationDialogRef.open({
        longitude: 113.285146,
        latitude: 23.095991,
        address: '逸成教育海珠校区中山大学广州校区南校园',
      }).then(({ longitude, latitude, address }) => {
        this.longitude = longitude;
        this.latitude = latitude;
        this.emergencyForm.fallFigureAddress = address;
      });
    },
  },
};
</script>
