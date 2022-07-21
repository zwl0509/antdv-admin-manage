<template>
  <a-modal
    :title="modalType=='add'? '新增常用语' : '编辑常用语'"
    :width="700"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false" >
    <a-alert v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="所属模块" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                placeholder="请选择所属模块"
                v-decorator="['code', {rules: [{required: true}]}]"
                :disabled="modalType=='detail'">
                <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入内容"
                autocomplete="off"
                :disabled="modalType=='detail'"
                v-decorator="['words', {rules: [{required: true, message: '请输入标题'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 100)}]}]"/>
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
      errorMessage: '',
      isError: false,
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
      typeList: [],
      relationType:''
    }
  },
  created () {
    this.$getCodeList('1045', res => {
      this.typeList = res
    })
  },
  methods: {
    maxLenValidator: maxLenValidator,
    add (value) {
      this.relationType = value
      this.modalType = 'add'
      this.id = ''
      this.visible = true
    },
    edit (record, type) {
      const { form: { setFieldsValue } } = this
      this.modalType = type
      this.relationType = record.relationType
      this.id = record.id
      this.visible = true
      this.$get({
        url: this.$api.system.commonWords.getDetail,
        params: { id: record.id }
      }).then(res => {
        const data = { ...res }
        for (const key in data) {
          if (filedIsNull(data[key])) {
            delete data[key]
          }
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => { this.confirmLoading = false })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.relationType = this.relationType
          this.saveData(values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    saveData (data) {
      this.$post({
        url: this.$api.system.commonWords.edit,
        data,
        needResponse: true
      })
        .then(res => {
          this.handleCancel()
          this.$emit('ok', data)
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
        .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleCancel () {
      // 重置表单数据
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
    },
  }
}
</script>
