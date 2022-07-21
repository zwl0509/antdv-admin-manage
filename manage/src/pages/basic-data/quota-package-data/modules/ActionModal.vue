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
            <a-form-item label="定额包名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入定额包名称"
                autocomplete="off"
                :maxLength="200"
                v-decorator="['name', {rules: [{required: true, message: '请输入定额包名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入单价"
                autocomplete="off"
                v-decorator="['price',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '单价格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="特项代码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入特项代码"
                autocomplete="off"
                :maxLength="32"
                v-decorator="['specialCode', {rules: [{message: '请输入特项代码'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入单位"
                autocomplete="off"
                :maxLength="20"
                v-decorator="['unit', {rules: [{message: '请输入单位'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-date-picker
                format="YYYY-MM-DD"
                style="width: 100%;"
                autocomplete="off"
                v-decorator="['beginDate', {rules: [{required: true, message: '请输入开始时间'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-date-picker
                style="width: 100%"
                autocomplete="off"
                v-decorator="['endDate', {rules: [{required: true, message: '请输入结束时间'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 } }" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 } }" >
              <a-textarea
                placeholder="请输入备注"
                :rows="4"
                autocomplete="off"
                :maxLength="1000"
                v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isActive',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {
  checkErrors,
  defaultErrorMessage,
  filedIsNull,
  maxLenValidator,
  numberValidator,
  regularCheck2
} from '@/utils/common'
import labels from '@/utils/labels'
import moment from 'moment'
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
    regularCheck2,
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
        url: this.$api.basicData.packageInfo.getDetail,
        params: { id: record.id }
      })
        .then(res => {
            res.endDate= res.endDate ? moment(res.endDate,'YYYY-MM-DD HH:mm:ss') : null
            res.beginDate= res.beginDate ? moment(res.beginDate,'YYYY-MM-DD HH:mm:ss') : null

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
          values.endDate=values.endDate.format('YYYY-MM-DD')
          values.beginDate=values.beginDate.format('YYYY-MM-DD')
          values.id = this.id
          this.$post({
            url: this.$api.basicData.packageInfo.editMaster,
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
          const keys=['price']
          defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
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
input{
  text-align: left !important;
}
</style>
