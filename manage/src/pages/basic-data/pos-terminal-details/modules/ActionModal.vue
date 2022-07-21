<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="900"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="银行卡号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                style="width: 100%"
                placeholder="请输入银行卡号"
                autocomplete="off"
                v-decorator="['bankAccount', {rules: [{ validator: (r, v, fun) => regularCheck('bank', v, fun) }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="开户行" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入开户行"
                autocomplete="off"
                :maxLength="200"
                v-decorator="['openingBank', {rules: [{required: true, message: '请输入开户行'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="pos机名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入pos机名称"
                autocomplete="off"
                :maxLength="100"
                v-decorator="['posName', {rules: [{required: true, message: '请输入pos机名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="pos机终端号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入pos机终端号"
                autocomplete="off"
                :maxLength="100"
                v-decorator="['posNum', {rules: [{required: true, message: '请输入pos机终端号'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="门店名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入门店名称"
                autocomplete="off"
                :max-length="100"
                v-decorator="['storeOrgName', {rules: [{required: true, message: '请输入门店名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="户名" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入户名"
                autocomplete="off"
                :maxLength="200"
                v-decorator="['username', {rules: [{required: true, message: '请输入户名'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}" >
              <a-textarea
                :rows="4"
                placeholder="请输入备注"
                autocomplete="off"
                :maxLength="500"
                v-decorator="['remark', {rules: [{message: '请输入备注'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator,regularCheck } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {

    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        parentId: ''
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck,
      add (record) {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''

        this.visible = true
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.posInfo.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.parentId = data.parentId
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.value = values.type !== undefined ? values.type + '-' + values.code : values.code
            this.$post({
              url: this.$api.basicData.posInfo.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message || ''
                })
              })
              .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => {
                this.confirmLoading = false
              })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.parentId = ''
        this.confirmLoading = false
        this.visible = false
      },
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    background: red !important;
    color: #585A62;
  }
</style>
