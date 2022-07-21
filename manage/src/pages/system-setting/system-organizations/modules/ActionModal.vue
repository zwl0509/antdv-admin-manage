<template>
  <a-modal
    :title="modalType === 'add' ? '新增组织机构' : '编辑组织机构'"
    :width="700"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-alert v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="上级机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-tree-select
                v-decorator="['parentCode']"
                style="width: 100%"
                allowClear
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="parentList"
                placeholder="请选择上级机构"
                :replace-fields="replaceFields"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="机构编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入机构编号"
                autocomplete="off"
                :max-length="50"
                v-decorator="['code', {rules: [{required: true, message: '请输入机构编号'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="机构名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入机构名称"
                autocomplete="off"
                :max-length="50"
                v-decorator="['name', {rules: [{required: true, message: '请输入机构名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="机构简码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入机构简码"
                autocomplete="off"
                :max-length="8"
                v-decorator="['shortCode', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="排序" :labelCol="{ xs: { span: 24 }, sm: { span: 4 } }" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 } }">
              <a-input
                placeholder="请输入排序值"
                autocomplete="off"
                type="number"
                v-decorator="['sequence', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否独立机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch un-checked-children="否" checked-children="是" v-decorator="['isSeparate', { initialValue: false, valuePropName: 'checked' }]"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch un-checked-children="否" checked-children="是" v-decorator="['isDepartment', { initialValue: false, valuePropName: 'checked' }]"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否集团" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch un-checked-children="否" checked-children="是" v-decorator="['isGroup', { initialValue: false, valuePropName: 'checked' }]"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否门店" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch un-checked-children="否" checked-children="是" v-decorator="['isStore', { initialValue: false, valuePropName: 'checked' }]"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 4 } }" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 } }">
              <a-textarea
                auto-size
                :max-length="500"
                placeholder="请输入备注"
                style="height: 80px"
                v-decorator="['remark']"></a-textarea>
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
        parentList: [],
        replaceFields: { title: 'name', key: 'code', value: 'code' },
        errorMessage: '',
        isError: false,
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck2,
      getParentList () {
        const data = {
          currentPage: 1,
          pageSize: 1000
        }
        this.isError = false
        this.$get({
          url: this.$api.organization.getListPage,
          params: data
        }).then(res => {
          this.parentList = res.rows
        }).catch(err => {
          this.isError = true
          this.errorMessage = err && err.message || '获取机构数据失败'
        })
      },
      add () {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        this.getParentList()
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getParentList()
        this.$get({
          url: this.$api.organization.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            if (data.parentCode === '0010001') {
              data.parentCode = ''
            }
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
      deepArr (node, value) {
        for (let i = 0; i < node.length; i++) {
          if (node[i].id === value) {
            return node[i].code
          } else if (node[i].children && node[i].children.length) {
            const val = this.deepArr(node[i].children, value)
            if (val) {
              return val
            }
          } else {
            return null
          }
        }
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            // if (values.parentId) {
            //   values.parentCode = this.deepArr(this.parentList, values.parentId)
            // }
            values.extraInfoDTO = {
              organizationId: this.id,
              organizationCode: values.code,
              organizationClass:  '1007-10',
              remark: values.remark
            }
            this.$post({
              url: this.$api.organization.edit,
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
            // })
          } else {
            const keys=['sequence']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
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
