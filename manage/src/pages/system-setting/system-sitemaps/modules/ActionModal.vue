<template>
  <a-modal
    :title="modalType === 'add' ? '新增菜单功能' : '编辑菜单功能'"
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
              label="所属菜单"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="menuTitle" disabled/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="区域"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入区域" autocomplete="off" v-decorator="['area', {rules: [{required: true, message: '请输入区域'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="键值"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入键值" autocomplete="off" v-decorator="['key', {rules: [{required: true, message: '请输入键值'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入名称" autocomplete="off" v-decorator="['name', {rules: [{required: true, message: '请输入名称'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
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
              <a-input placeholder="请输入标题" autocomplete="off" v-decorator="['title', {rules: [{required: true, message: '请输入标题'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 200)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="排序值"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number placeholder="请输入排序值" autocomplete="off" style="width: 100%" v-decorator="['sequence', {rules: [{required: true, message: '请输入排序值'}, { validator: (r, v, fun) => numberValidator(r, v, fun, 'int')}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="icon名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入icon名称" autocomplete="off" v-decorator="['icon', {rules: [ { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item
              label="描述"
              :labelCol="labelCol01"
              :wrapperCol="wrapperCol01"
            >
              <a-textarea placeholder="请输入描述" v-decorator="['description',{rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 200)}]}]" :max-length="300"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator } from '@/utils/common'
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
      sitemapId: '',
      menuTitle: ''
    }
  },
  methods: {
    maxLenValidator: maxLenValidator,
    numberValidator: numberValidator,
    add (row) {
      this.form.resetFields()
      this.modalType = 'add'
      this.id = ''
      this.sitemapId = row.menuId
      this.menuTitle = row.menuTitle
      this.visible = true
    },
    edit (record) {
      const { form: { setFieldsValue } } = this
      this.modalType = 'edit'
      this.id = record.id
      this.sitemapId = record.menuId
      this.menuTitle = record.menuTitle
      this.visible = true
      this.confirmLoading = true
      this.$get({
        url: this.$api.system.menu.getActionDetail,
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
          values.sitemapId = this.sitemapId
          this.$post({
            url: this.$api.system.menu.editAction,
            data: values,
            needResponse: true
          })
            .then(res => {
              this.handleCancel()
              this.$emit('ok', values)
              this.$notification.success({
                message: labels.SAVE_SUCCESS,
                description: res.message
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
