<template>
  <div class="sv-select-contact">
    <el-button
      class="sbs-button"
      @click="visible = true, init()"
      :disabled="isDisabled"
    >
      {{ `选择${title}` }}
    </el-button>
    <div>
      <span
        v-for="(item, index) in displayResult"
        :key="`contact_result_${index}`"
      >
        <span class="sv-select-contact__item">
          <span>{{ `${item.name}${ phoneNumber(item) }` }}</span>
          <span @click="deleteItem(index)">×</span>
        </span>
        <span
          v-if="isDisabled"
          :class="['noRead', {'hasRead': item?.raw?.readStatus}]"
        >
          <p>{{ item?.raw?.readStatus ? '已读' : '未读' }}</p>
        </span>
        <span v-if="(!(item?.raw?.readStatus))&&isDisabled">
          <div
            class="phoneStyle"
            @click.stop="callPhone(item)"
          />
          <div
            class="smsStyle"
            @click.stop="sendSms(taskId, item.id)"
          />
        </span>
      </span>
    </div>
    <el-dialog
      ref="dialog"
      v-model="visible"
      custom-class="sbs-dialog"
      width="950px"
      :title="`请选择${title}`"
    >
      <div class="sv-select-contact__container">
        <div class="sv-select-contact__left">
          <div class="sv-tree">
            <el-tree
              ref="group"
              class="sbs-tree"
              node-key="id"
              :data="groupList"
              :props="groupTreeProps"
              :highlight-current="true"
              :current-node-key="0"
              @node-click="groupClick"
            />
          </div>
        </div>
        <div class="sv-tree sv-select-contact__middle">
          <el-input
            v-model="searchKeyword"
            class="sbs-input sv-input-tree-search"
            placeholder="按enter搜索"
            clearable
            :style="{
              width: 'calc(100% - 20px)'
            }"
            @change="
              currentPage = 1;
              getContactList();
            "
          />
          <div
            v-loading="contactLoading"
            element-loading-spinner="sv-loading"
            class="sv-tree"
            style="width:100%;overflow:hidden;"
          >
            <el-tree
              ref="contact"
              class="el-tree sbs-tree"
              node-key="id"
              :data="contactList"
              :props="contactTreeProps"
              :highlight-current="true"
              :check-on-click-node="true"
              :show-checkbox="multiple"
              :default-checked-keys="contactCheckedIds"
              @node-click="contactClick"
              @check="contactCheck"
            />
          </div>
          <div style="text-align:right">
            <el-pagination
              small
              class="sbs-pagination"
              :total="totalCount"
              :current-page="currentPage"
              :page-size="10"
              :pager-count="5"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>
        <div
          v-if="multiple"
          class="sv-select-contact__right"
        >
          <div class="sv-select-contact__right__list">
            <div
              v-for="(man, index) in contactCheckedNodes"
              :key="`selected_man_${index}`"
              class="sv-select-contact__item"
            >
              <span>{{ `${man.name}${ phoneNumber(man) }` }}</span>
              <span @click="deleteDisplayItem(index)">×</span>
            </div>
          </div>
          <div class="sv-select-contact__right__total">
            <span>
              已选择{{ contactCheckedNodes.length }}人
            </span>
            <span @click="deleteAllDisplayItem">
              全部清空
            </span>
          </div>
        </div>
      </div>
      <div class="sv-select-contact__footer">
        <el-button plain class="sbs-button" @click="cancel">取消</el-button>
        <el-button type="primary" class="sbs-button" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

export default {
  name: 'SvSelectContact',
  emits: [
    'update:modelValue',
  ],
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: [Object, Array],
      required: true,
    },
    title: {
      type: String,
      default: '联系人',
    },

    data: {
      type: [Array, String, Number],
      default: '',
    },

    detail: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        mobile1: '',
        phone: '',
      }),
    },

    // 接口
    api: {
      type: Array,
      default: () => [
        '/mail/mailgroup/list',
        '/mail/mailcontactor/list',
      ],
    },

    // 树形数据结构配置
    groupTreeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
      }),
    },

    // 树形数据结构配置
    contactTreeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
      }),
    },

    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      groupLoading: false,
      contactLoading: false,
      groupList: [],
      contactList: [],
      contactCheckedIds: [],
      contactCheckedNodes: [],
      searchKeyword: '',
      currentPage: 1,
      totalCount: 0,
      selectedResult: [],
      displayResult: [],
      currentGroupId: null,
      visible: false,
    };
  },

  computed: {
    phoneNumber() {
      return (item) => {
        if (item.phone) {
          return `（${item.phone}）`;
        }

        if (item.mobile1) {
          return `（${item.mobile1}）`;
        }

        return '';
      };
    },
  },

  watch: {
    modelValue: {
      deep: true,
      handler(val) {
        if (this.multiple) {
          // 多选
          if (val) {
            this.contactCheckedNodes = [...val];
            this.displayResult = [...this.contactCheckedNodes];
            this.contactCheckedIds = [];
            val.forEach((element) => {
              this.contactCheckedIds.push(element.id);
            });
          } else {
            this.contactCheckedNodes = [];
            this.displayResult = [];
            this.contactCheckedIds = [];
          }
        } else {
          // 单选
          if (val) {
            // 数据初始化时赋值
            if (this.detail && val === this.detail.id) {
              this.selectedResult = [{
                id: this.detail.id,
                name: this.detail.name,
                phone: this.detail.mobile1,
                raw: this.detail,
              }];
              this.displayResult = [...this.selectedResult];
            }
          } else {
            this.contactCheckedNodes = [];
            this.displayResult = [];
            this.contactCheckedIds = [];
          }
        }
      },
    },

    detail(val) {
      console.log(val, 'val');
      if (val) {
        this.selectedResult = [{
          id: val.id,
          name: val.name,
          phone: val.mobile1,
          raw: val,
        }];
        this.displayResult = [...this.selectedResult];
      } else {
        this.selectedResult = [];
        this.displayResult = [];
      }
    },
  },

  mounted() {
    this.currentGroupId = null;
    // 获取树形数据
    this.getGroupList();
    this.getContactList();
    this.init();
  },
  methods: {
    init() {
    // 设置选择的人
    if (this.multiple) {
      if (this.modelValue && this.modelValue.length > 0) {
        this.contactCheckedNodes = [...this.modelValue];
        this.displayResult = [...this.contactCheckedNodes];
        this.contactCheckedIds = [];
        this.contactCheckedNodes.forEach((element) => {
          this.contactCheckedIds.push(element.id);
        });
      }
    } else {
      if (this.modelValue && this.detail.id !== '') {
        this.selectedResult = [{
          id: this.detail.id,
          name: this.detail.name,
          phone: this.detail.mobile1 || this.detail.phone,
          raw: this.detail,
        }];
        this.displayResult = [...this.selectedResult];
      }
    }
  },
    /**
     * @method
     * @desc 获取分组数据
     */
    getGroupList() {
      this.groupLoading = true;
      const request = {
        method: 'get',
        url: this.api[0],
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          name: this.searchKeyword,
        },
      };
      $http(request)
        .then((response) => {
          if (response.code === 0) {
            const all = {};
            all[this.groupTreeProps.label] = '全部';
            all[this.contactTreeProps.value] = 0;
            this.groupList = [
              all,
              ...response.data,
            ];
          } else {
            this.$message.error(`获取分组数据失败！错误信息：${response}`);
          }
          this.groupLoading = false;
        })
        .catch((error) => {
          this.$message.error(`获取分组数据失败！错误信息：${error}`);
          this.groupLoading = false;
        });
    },

    /**
     * @method
     * @desc 获取联系人列表
     */
    getContactList() {
      this.contactLoading = true;
      const request = {
        method: 'post',
        url: this.api[1],
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          page: this.currentPage,
          limit: 10,
          search: this.searchKeyword,
          groupId: this.currentGroupId > 0 ? this.currentGroupId : [],
          groupIds: this.currentGroupId > 0 ? this.currentGroupId : [],
        },
      };

      $http(request).then((response) => {
        if (response.code === 0) {
          this.contactList = response.data ? response.data.list : response.page.list;
          this.totalCount = response.data
            ? response.data.totalCount
            : response.page.totalCount;
        } else {
          this.$message.error(`获取分组数据失败！错误信息：${response}`);
        }
        this.contactLoading = false;
      })
        .catch((error) => {
          this.$message.error(`获取分组数据失败！错误信息：${error}`);
          this.contactLoading = false;
        });
    },

    /**
     * @method
     * @desc 点击分组树，查询该分组的联系人
     */
    groupClick(nodeObj) {
      this.currentPage = 1;
      const result = [];
      const findAllChildren = (node) => {
        result.push(node[this.groupTreeProps.value]);
        if (node[this.groupTreeProps.children] && node[this.groupTreeProps.children].length) {
          node[this.groupTreeProps.children].forEach((child) => findAllChildren(child));
        }
      };
      findAllChildren(nodeObj);
      this.currentGroupId = result;
      this.getContactList();
    },

    /**
     * @method
     * @desc 点击联系人，单选的情况下有效
     */
    contactClick(nodeObj) {
      if (!this.multiple) {
        this.selectedResult = [{
          name: nodeObj.name,
          id: nodeObj.id,
          phone: nodeObj.mobile1 || nodeObj.phone,
          raw: nodeObj,
        }];
      }
    },

    /**
     * @method
     * @desc 联系人勾选，多选的情况下有效
     */
    contactCheck(nodeObj, allChecked) {
      if (this.multiple) {
        if (allChecked.checkedKeys.indexOf(nodeObj.id) > -1) {
          this.contactCheckedIds.push(nodeObj.id);
          this.contactCheckedNodes.push(nodeObj);
        } else {
          const index = this.contactCheckedIds.indexOf(nodeObj.id);
          this.contactCheckedIds.splice(index, 1);
          this.contactCheckedNodes.splice(index, 1);
        }
        this.$refs.contact.setCheckedKeys(this.contactCheckedIds);
      }
    },

    /**
     * @method
     * @desc 分页器换页
     */
    handlePageChange(val) {
      this.currentPage = val;
      this.getContactList();
    },

    /**
     * @method
     * @desc 外部删除项目
     * @param {Number} index 该项目在数组中的下标
     */
    deleteItem(index) {
      if (this.multiple) {
        // 更新v-model
        const result = [...this.modelValue];
        result.splice(index, 1);
        this.$emit('update:modelValue', result);
        this.contactCheckedNodes = [...result];
        this.displayResult = [...result];
        // 设置勾选
        this.contactCheckedIds = [];
        result.forEach((element) => {
          this.contactCheckedIds.push(element.id);
        });
      } else {
        this.selectedResult = [];
        this.displayResult = [];
        this.$emit('update:modelValue', '');
      }
    },

    // 打电话
    callPhone(item) {
      makePhoneCall({
        phone: item.phone,
        type: 1,
        id: item.id,
        name: item.name,
      });
    },
    // 发短信
    sendSms(taskId, contactorId) {
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/sendTaskNoticeMessage',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          taskId,
          contactorId,
        },
      };
      $http(request).then((response) => {
        if (response.errorcode === 0 || response.code === 0) {
          this.$message.success('短信发送成功！');
        }
      }).catch((error) => {
        this.$message.error(`短信发送失败！错误信息：${error}`);
      });
    },

    /**
     * @method
     * @desc 删除弹窗中的已选项目
     * @param {Number} index 该项目在数组中的下标
     */
    deleteDisplayItem(index) {
      this.contactCheckedNodes.splice(index, 1);
      this.contactCheckedIds.splice(index, 1);
      this.$refs.contact.setCheckedKeys(this.contactCheckedIds);
    },

    /**
     * @method
     * @desc 清空弹窗中的已选项目
     */
    deleteAllDisplayItem() {
      this.contactCheckedNodes = [];
      this.contactCheckedIds = [];
      this.$refs.contact.setCheckedKeys(this.contactCheckedIds);
    },

    /**
     * @method
     * @desc 点击确定，更新数据
     */
    confirm() {
      // 检测选择是否为空
      if (
        (this.selectedResult.length === 0 && !this.multiple)
        || (this.contactCheckedIds.length === 0 && this.multiple)
      ) {
        this.$message.error(`请选择${this.title}`);
        return;
      }
      if (this.multiple) {
        this.displayResult = [...this.contactCheckedNodes];
        this.$emit('update:modelValue', this.contactCheckedNodes);
      } else {
        this.$emit('update:modelValue', this.selectedResult[0].id, JSON.parse(JSON.stringify(this.selectedResult[0].raw || this.selectedResult[0])));
        this.displayResult = [...this.selectedResult];
      }
      // 初始化
      this.visible = false;
      this.currentPage = 1;
      this.currentGroupId = null;
      this.searchKeyword = '';
      this.getContactList();
    },

    /**
     * @method
     * @desc 点击取消，复原数据
     */
    cancel() {
      if (this.multiple) {
        if (this.modelValue && this.modelValue.length > 0) {
          this.contactCheckedNodes = [...this.modelValue];
          this.contactCheckedIds = [];
          this.contactCheckedNodes.forEach((element) => {
            this.contactCheckedIds.push(element.id);
          });
          this.$refs.contact.setCheckedKeys(this.contactCheckedIds);
        } else {
          this.contactCheckedNodes = [];
          this.contactCheckedIds = [];
          this.$refs.contact.setCheckedKeys(this.contactCheckedIds);
        }
      } else {
        if (this.modelValue && this.detail) {
          this.selectedResult = [{
            id: this.detail.id,
            name: this.detail.name,
            phone: this.detail.mobile1 || this.detail.phone,
          }];
        }
      }
      // 初始化
      this.visible = false;
      this.currentPage = 1;
      this.searchKeyword = '';
      this.currentGroupId = null;
      this.getContactList();
    },
  },
};
</script>

<style lang="scss" scoped>
.phoneStyle {
  width: 16px;
  height: 15px;
  cursor: pointer;
  display: inline-block;
  margin-left: 10px;
  transform: translateY(2px);
  background: url(../../module/TaskManager/assets/phone.svg) no-repeat;
}
.smsStyle {
  width: 16px;
  height: 15px;
  cursor: pointer;
  display: inline-block;
  margin: 0 10px;
  transform: translateY(2px);
  background: url(../../module/TaskManager/assets/sms.svg) no-repeat;
}
.noRead {
  width: 32px;
  height: 16px;
  background: #F7F8FA;
  border-radius: 8px;
  border: 1px solid #EBEDF0;
  color: #969799;
  display: inline-block;
  p {
    font-size: 10px;
    line-height: 14px;
    margin: 0px 0px 0px 4px;
  }
}
.hasRead {
  color: #0BD295;
}
.sv-select-contact {
    &__container {
      height: 560px;
      display: flex;
      justify-content: center;
    }
    &__left {
      width: 300px;
      height: 100%;
      border-right: 1px solid #E6E6E6;
      .sv-input-tree-search {
        margin: 10px;
      }
      .sv-tree {
        height: 100%;
        overflow-y: auto;
        :deep(.el-tree-node__label) {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    &__middle {
      overflow: hidden;
      width: 350px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .sv-input-tree-search {
        margin: 10px;
        flex: 0;
      }
      .sv-tree {
        flex-grow: 1;
      }
      .sv-pagination {
        padding: 10px;
      }
    }
    &__right {
        width: 300px;
        height: 100%;
        border-left: 1px solid #E6E6E6;
        display: flex;
        flex-direction: column;
        &__list {
            flex-grow: 1;
            overflow-x: auto;
            padding: 0 20px 10px;
            &::-webkit-scrollbar {
                background: transparent;
                width: 5px;
                height: 5px;
            }
            &::-webkit-scrollbar-thumb {
                background: #d5d5d5;
                border-radius: 5px;
            }
        }
        &__total {
            height: 54px;
            line-height: 54px;
            text-align: center;
            padding: 0 20px;
            & > span:first-child {
                float: left;
            }
            // 清空按钮
            & > span:last-child {
                float: right;
                color: #0091FF;
                cursor: pointer;
                user-select: none;
                &:hover {
                    color: #5eadff;
                }
                &:active {
                    color: #2476E0;
                }
            }
        }
    }
    &__item {
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        height: 30px;
        line-height: 28px;
        max-width: 100px;
        border: 1px solid #E0E0E0;
        border-radius: 3px;
        background: #FAFAFA;
        padding: 0 5px;
        margin: 10px 10px 0 0;
        cursor: default;
        color: #999999;
        span:first-child {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        // 删除按钮
        span:last-child {
          flex-shrink: 0;
            cursor: pointer;
            font-size: 18px;
            &:hover {
                color: #b4b4b4;
            }
        }
    }
    &__footer {
      padding: 10px;
      text-align: right;
      border-top: 1px solid #E6E6E6;
    }
}
</style>
