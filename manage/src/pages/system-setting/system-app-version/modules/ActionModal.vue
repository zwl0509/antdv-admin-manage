<template>
  <a-modal
    :title="modalType === 'add' ? '新增应用版本' : '编辑应用版本'"
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
              label="app名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入app名称" autocomplete="off" :max-length="20" v-decorator="['appName', {rules: [{required: true, message: '请输入app名称'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="应用类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择应用类型" v-decorator="['appType', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in appTypeList" :key="index" :value="item.value">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="发布平台"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择发布平台" v-decorator="['publishPlatform', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in platformList" :key="index" :value="item.value">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="版本号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入版本号" autocomplete="off" v-decorator="['versionNumber', {rules: [{required: true, message: '请输入版本号'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="是否需要更新"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择是否需要更新" v-decorator="['isNeedUpdate', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-textarea auto-size placeholder="请输入备注" v-decorator="['remark', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]"></a-textarea>
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
          sm: { span: 9 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        appTypeList: [],
        platformList: []
      }
    },
    created () {
      this.getCodeList()
    },
    methods: {
      maxLenValidator: maxLenValidator,
      getCodeList () {
        this.$getCodeList('1005', res => {
          this.appTypeList = res
        })
        this.$getCodeList('1006', res => {
          this.platformList = res
        })
      },
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
          url: this.$api.system.appVersion.getDetail,
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
              url: this.$api.system.appVersion.edit,
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
        this.confirmLoading = false
        this.form.resetFields()
        this.visible = false
      }
    }
  }
</script>
