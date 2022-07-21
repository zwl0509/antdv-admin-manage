<template>
  <a-modal
    :title="modal_type == 'add' ? '新增流程' : '编辑流程' "
    :width="800"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-col :md="12" :xs="24">
          <a-form-item label="流程分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择流程分类" v-decorator="['code', {rules: [{required: true}]}]">
              <a-select-option v-for="(item, index) in codeList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="流程名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入流程名称"
              autocomplete="off"
              :maxLength="50"
              v-decorator="['name', {rules: [{required: true}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入排序"
              autocomplete="off"
              v-decorator="['sequence', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
            <a-textarea
              placeholder="请输入备注"
              autocomplete="off"
              :maxLength="500"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-col>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import pick from 'lodash.pick'
  import { checkErrors, defaultErrorMessage, filedIsNull, maxLenValidator, regularCheck2 } from '@/utils/common'
  export default {
    data () {
      return {
        modal_type: '',
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        baseInfo: null,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        form: this.$form.createForm(this),
        codeList: [],
        id: ''
      }
    },
    methods: {
      maxLenValidator,regularCheck2,
      add() {
        this.modal_type = 'add'
        this.visible = true
        this.getCodeList()
      },
      async edit(record, type) {
        this.modal_type = type
        this.visible = true
        this.id = record.id
        await this.getCodeList()
        await this.getDetail(record.id)
      },
      getDetail(id) {
        this.$get({
          url: this.$api.workFlowTypeInfo.getDetail,
          params:{ id }
        }).then((res)=>{
          const data = { ...res }
          for (const key in data) { 
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          this.$nextTick(()=>{
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getCodeList(){
        this.$getCodeList('1049', res => {
          this.codeList = res
        })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if(!errors) {
            values.id = this.id 
            this.save(values)
          }else {
            const keys=['sequence']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
            this.confirmLoading = false
          }
        })
      },
      save(data) {
        this.confirmLoading = true
        this.$post({
          url:this.$api.workFlowTypeInfo.edit,
          data,
          needResponse: true
        }).then(res => {
              this.handleCancel()
              this.$emit('ok')
              this.$notification.success({
                message: labels.SAVE_SUCCESS,
                description: res.message || ''
              })
            })
            .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
            .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.form.resetFields()
        this.id = ''
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>