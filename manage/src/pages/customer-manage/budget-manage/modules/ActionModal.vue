<template>
  <a-modal
    class="budget-manage"
    :title="modal_type == 'add' ? '选材新增': '选材编辑' "
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 基础信息 -->
      <a-form>
        <a-row>
          <a-col :md="6" :xs="24">
            <a-form-item label="选择客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择客户">
                <a-select-option v-for="(item, index) in customerList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="24">
            <a-form-item label="客户编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input autocomplete="off" disabled placeholder="请输入客户编号"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="装修地址" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-input autocomplete="off" disabled placeholder="请输入装修地址"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="24">
            <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择套餐名称">
                <a-select-option v-for="(item, index) in customerList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="24">
            <a-form-item label="定额版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择定额版本">
                <a-select-option v-for="(item, index) in customerList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="24">
            <a-form-item label="主材包名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input autocomplete="off" disabled placeholder="请输入主材包名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="24">
            <a-form-item label="列表展示" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch v-model="isShowClass" checked-children="是" un-checked-children="否"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格信息 -->
      <select-materials ref="SelectMaterials" :isShowClass="isShowClass"></select-materials>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleSubmit">费用计算</a-button>
      <a-button type="primary" @click="handleSubmit">预算明细</a-button>
      <a-button type="primary" @click="handleSubmit">查看变更</a-button>
      <a-button type="primary" @click="handleSubmit">主材包材料</a-button>
      <a-button type="primary" @click="handleSubmit">选材对比清单</a-button>
      <a-button type="primary" @click="handleSubmit">导入模版</a-button>
      <a-button type="primary" @click="handleSubmit">导入预算</a-button>
      <a-button type="primary" @click="handleSubmit">主材选择清单</a-button>
      <a-button type="primary" @click="handleSubmit">存模版</a-button>
      <a-button type="primary" @click="handleSubmit">存预算</a-button>
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
  import SelectMaterials from './SelectMaterials.vue'
  export default {
  components: { SelectMaterials },
    name: 'ActionModal',
    data() {
      return {
        modal_type: 'add',
        visible: false,
        confirmLoading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        customerList: [],
        isShowClass: true
      }
    },
    methods: {
      add() {
        this.modal_type = 'add'
        this.visible = true
      },
      edit () {
        this.modal_type = 'edit'
      },
      handleSubmit() {

      },
      handleCancel () {
        this.modal_type = ''
        this.visible = false
        this.confirmLoading = false
        this.isShowClass = true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>