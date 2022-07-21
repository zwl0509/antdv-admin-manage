<template>
  <a-modal
    :title="modalType === 'add' ? '新增角色' : '编辑角色'"
    :width="700"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择类型" v-decorator="['type', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入编号" autocomplete="off" v-decorator="['code', {rules: [{required: true, message: '请输入编号'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入名称" autocomplete="off" v-decorator="['name', {rules: [{required: true, message: '请输入名称'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="描述" :labelCol="{ xs: { span: 24 }, sm: { span: 4 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 }}">
              <a-textarea style="height: 100px" auto-size placeholder="请输入描述" v-decorator="['remark', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { defaultErrorMessage, filedIsNull, maxLenValidator } from '@/utils/common'
import labels from '@/utils/labels'

export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      modalType: 'add',
      confirmLoading: false,
      id: '',
      form: this.$form.createForm(this),
      typeList: []
    }
  },
  created () {
    this.$getCodeList('1001', res => {
      this.typeList = res
    })
  },
  methods: {
    maxLenValidator: maxLenValidator,
    add () {
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
        url: this.$api.system.role.getDetail,
        params: { id: record.id }
      })
        .then(res => {
          const data = { ...res }
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
          this.$post({
            url: this.$api.system.role.edit,
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
      this.confirmLoading = false
      this.visible = false
    }
  }
}
</script>
