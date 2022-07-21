<template>
  <a-modal
    :title="modalType === 'add' ? '新增菜单' : '编辑菜单'"
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
              label="父级菜单"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="parentTitle" disabled/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="菜单名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="请输入菜单名称"
                autocomplete="off"
                v-decorator="['name', {rules: [{required: true, message: '请输入菜单名称'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="菜单标题"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入菜单标题" autocomplete="off" v-decorator="['title', {rules: [{required: true, message: '请输入菜单标题'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="组件名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入组件名称" autocomplete="off" v-decorator="['component', {rules: [{required: true, message: '请输入组件名称'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="icon名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入icon名称" autocomplete="off" v-decorator="['icon', {rules: [ { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="等级"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number style="width: 100%" placeholder="请输入等级" autocomplete="off" v-decorator="['level', {rules: [{required: true, message: '请输入等级'},{validator:(r, v, fun)=> numberValidator(r, v, fun, 'int')}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="菜单类别"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select v-decorator="['type', {initialValue: '1004-10'}]">
                <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value"> {{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="排序值"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number style="width: 100%" placeholder="请输入排序值" autocomplete="off" v-decorator="['sequence', {rules: [{required: true, message: '请输入排序值'}, { validator:(r, v, fun)=> numberValidator(r, v, fun, 'int')}]}]"/>
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
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        parentId: '',
        parentTitle: '',
        backstage: 1,
        typeList: []
      }
    },
    methods: {
      maxLenValidator: maxLenValidator,
      numberValidator: numberValidator,
      getCode () {
        this.$getCodeList('1004', res => {
          this.typeList = res
        })
      },
      add (record) {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.backstage = typeof record.backstage === 'number' ? record.backstage : 1
        this.parentId = record.id ? record.id : null
        this.parentTitle = record.title || '菜单管理'
        this.visible = true
        !this.typeList.length && this.getCode()
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.backstage = typeof record.backstage === 'number' ? record.backstage : 1
        this.parentId = record.parentId
        this.parentTitle = record.parentTitle || '菜单管理'
        this.visible = true
        this.confirmLoading = true
        !this.typeList.length && this.getCode()
        this.$get({
          url: this.$api.system.menu.getDetail,
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
            values.parentId = this.parentId || null
            values.backstage = (values.type==='1004-10' ? 1 :0)
            this.$post({
              url: this.$api.system.menu.edit,
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
