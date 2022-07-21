<template>
  <a-modal
    :title="modalType === 'add' ? '新增消息模板' : '编辑消息模板'"
    :width="700"
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
            <a-form-item
              label="类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择类型" v-decorator="['type', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in smstypeList" :key="index" :value="item.value">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="编号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入编号" autocomplete="off" v-decorator="['code', {rules: [{required: true, message: '请输入编号'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 20)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="标题"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入标题" autocomplete="off" v-decorator="['title', {rules: [{required: true, message: '请输入标题'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="是否启用"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择是否启用" v-decorator="['isEnabled', {rules: [{required: true, message: '请选择是否启用'}]}]">
                <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="平台Id"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01"
          >
            <a-input placeholder="请输入平台Id" autocomplete="off" v-decorator="['platformId', {rules: [{required: true, message: '请输入平台ID'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 200)}]}]"/>
          </a-form-item>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="内容"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01"
          >
            <a-textarea placeholder="请输入内容" v-decorator="['content', {rules: [{required: true, message: '请输入内容'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 900)}]}]"></a-textarea>
          </a-form-item>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="备注"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01"
          >
            <a-textarea placeholder="请输入备注" v-decorator="['remark', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]"></a-textarea>
          </a-form-item>
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
        labelCol01: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        smstypeList: []
      }
    },
    created () {
      this.$getCodeList('1024', res => {
        this.smstypeList = res
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
          url: this.$api.system.shortMessage.getDetail,
          params: { id: this.id }
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
              url: this.$api.system.shortMessage.edit,
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
