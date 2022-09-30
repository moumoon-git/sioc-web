// 选择联系人弹窗
<template>
  <ModalDialog :zIndex="zIndex" v-model="visible" title="选择联系人">
    <div v-loading="isLoading" class="select-contact-dialog">
      <!-- 部门 -->
      <section class="select-contact-dialog__department">
        <header>通讯录</header>
        <main>
          <Search
            v-model="searchKeyword"
            placeholder="请输入部门名称"
            style="margin: 0 10px 10px; width: calc(100% - 20px)"
            @change="filterTree"
          />
          <DepartmentTree
            :tree-data="filteredTreeData"
            @node-click="handleTreeClick"
          />
        </main>
      </section>
      <!-- 联系人 -->
      <section class="select-contact-dialog__contact">
        <header>部门成员</header>
        <div v-if="multiple" class="select-contact-dialog__contact__select-all">
          <button @click="handleUncheckAll">取消全部</button>
          <button @click="handleCheckAll">选择全部</button>
        </div>
        <main>
          <h3>应急负责人</h3>
          <ul class="select-contact-dialog__contact__list">
            <li
              v-for="(
                responsiblePerson, responsiblePersonIndex
              ) in responsiblePersonList"
              :key="responsiblePersonIndex"
              :title="responsiblePerson?.name || '-'"
              @click="handleCheck(responsiblePerson, multiple)"
            >
              <i
                v-show="multiple"
                :class="[
                  'select-contact-dialog__contact__checkbox',
                  {
                    'select-contact-dialog__contact__checkbox--checked':
                      selectedContact.has(responsiblePerson.id),
                  },
                ]"
              />
              <div>
                {{ responsiblePerson?.name || '-' }}
                （{{ responsiblePerson?.workUnit || '暂无单位信息' }}/{{
                  responsiblePerson?.position || '暂无职务信息'
                }}）
              </div>
              <ContactMoreButton :id="responsiblePerson?.id" />
            </li>
          </ul>
          <h3>应急联络人</h3>
          <ul class="select-contact-dialog__contact__list">
            <li
              v-for="(contactPerson, contactPersonIndex) in contactPersonList"
              :key="contactPersonIndex"
              :title="responsiblePerson?.name || '-'"
              @click="handleCheck(contactPerson, multiple)"
            >
              <i
                v-show="multiple"
                :class="[
                  'select-contact-dialog__contact__checkbox',
                  {
                    'select-contact-dialog__contact__checkbox--checked':
                      selectedContact.has(contactPerson.id),
                  },
                ]"
              />
              <div>
                {{ contactPerson?.name || '-' }}
                （{{ contactPerson?.workUnit || '暂无单位信息' }}/{{
                  contactPerson?.position || '暂无职务信息'
                }}）
              </div>
              <ContactMoreButton :id="contactPerson?.id" />
            </li>
          </ul>
          <h3>其他人员</h3>
          <ul class="select-contact-dialog__contact__list">
            <li
              v-for="(otherPerson, otherPersonIndex) in otherPersonList"
              :key="otherPersonIndex"
              :title="responsiblePerson?.name || '-'"
              @click="handleCheck(otherPerson, multiple)"
            >
              <i
                v-show="multiple"
                :class="[
                  'select-contact-dialog__contact__checkbox',
                  {
                    'select-contact-dialog__contact__checkbox--checked':
                      selectedContact.has(otherPerson.id),
                  },
                ]"
              />
              <div>
                {{ otherPerson?.name || '-' }}
                （{{ otherPerson?.workUnit || '暂无单位信息' }}/{{
                  otherPerson?.position || '暂无职务信息'
                }}）
              </div>
              <ContactMoreButton :id="otherPerson?.id" />
            </li>
          </ul>
        </main>
      </section>
      <!-- 已选联系人 -->
      <section class="select-contact-dialog__selected">
        <header>已选择</header>
        <main>
          <ul>
            <li
              v-for="(
                selectedPerson, selectedPersonIndex
              ) in selectedContact.values()"
              :key="selectedPersonIndex"
            >
              <div>
                <div>
                  {{ selectedPerson.name || '-' }}
                  （{{ selectedPerson?.workUnit || '暂无单位信息' }}/{{
                    selectedPerson?.position || '暂无职务信息'
                  }}）
                </div>
                <ContactMoreButton :id="selectedPerson?.id" />
              </div>
              <button @click="selectedContact.delete(selectedPerson.id)" />
            </li>
          </ul>
        </main>
      </section>
    </div>
    <footer class="select-contact-dialog__footer">
      <Button type="ghost" @click="visible = false"> 取消 </Button>
      <Button type="primary" @click="handleConfirm"> 确定 </Button>
    </footer>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../Button/Button.vue';
import Search from '../Search/Search.vue';
import ModalDialog from '../ModalDialog/ModalDialog.vue';
import ContactMoreButton from '../../main/ContactMoreButton/ContactMoreButton.vue';
import DepartmentTree from './components/DepartmentTree.vue';
import loadSetup from './scripts';

export default defineComponent({
  name: 'SelectContactDialog',
  components: {
    // 搜索输入框
    Search,
    // 遮罩弹窗
    ModalDialog,
    // 部门树形组件
    DepartmentTree,
    // 联系人更多操作按钮
    ContactMoreButton,
    // 底部按钮
    Button,
  },
  props: {
    // 是否多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 已选择的联系人
    modelValue: {
      type: Array,
      default: () => [],
    },
    // 是否只加载激活APP的用户
    judgeActivationApp: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 100,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    return loadSetup(props);
  },
  methods: {
    /**
     * 打开弹窗
     */
    open() {
      this.visible = true;
      this.selectedContact.clear();
      if (Array.isArray(this.modelValue)) {
        this.modelValue.forEach((item) => {
          if (item.id) {
            this.selectedContact.set(item.id, item);
          }
        });
      }
    },
    /**
     * 确认
     */
    handleConfirm() {
      this.visible = false;
      this.$emit(
        'update:modelValue',
        Array.from(this.selectedContact.values()),
      );
    },
  },
});
</script>

<style lang="scss" src="./styles/index.scss"></style>
