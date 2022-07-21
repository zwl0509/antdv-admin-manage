<template>
  <a-modal
    :title="modalType === 'add' ? '新增职位' : '编辑职位'"
    :width="700"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="职位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入职位名称"
                autocomplete="off"
                :maxLength="50"
                v-decorator="['positionName', {rules: [{required: true, message: '请输入职位名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入排序值"
                autocomplete="off"
                v-decorator="['sequence', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="职位类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择职位类型" v-decorator="['positionCode']" allowClear>
                <a-select-option v-for="(item, index) in codeType.positionType" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="原系统id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入原系统id"
                autocomplete="off"
                v-decorator="['oldId', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isLocked',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 4 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 }}">
              <a-textarea
                placeholder="请输入备注"
                :max-length="500"
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
    defaultErrorMessage,
    regularCheck2,
    filedIsNull,
    maxLenValidator,
    numberValidator,
    checkErrors
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
        organizationsId: '',
        menuTitle: '',
        positionCode:'',
        codeType: {
          positionType:[]
        }
      }
    },
    methods: {
      maxLenValidator: maxLenValidator,
      numberValidator: numberValidator,
      regularCheck2: regularCheck2,
      getCodeList(){
        // 逃单分类
        this.$getCodeList('1042', res => {
          this.codeType.positionType = res
        })
      },

      add (row) {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.organizationsId = row.menuId
        this.menuTitle = row.menuTitle
        this.visible = true
        this.getCodeList()
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.organizationsId = record.menuId
        this.menuTitle = record.menuTitle
        this.visible = true
        this.confirmLoading = true
        this.getCodeList()
        this.$get({
          url: this.$api.system.position.getDetail,
          params: {
            id: record.id,
          }
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
            values.organizationsId = this.organizationsId
            this.$post({
              url: this.$api.system.position.edit,
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
