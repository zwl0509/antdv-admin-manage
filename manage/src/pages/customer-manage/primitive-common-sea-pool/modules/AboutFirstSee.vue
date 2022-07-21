<template>
  <a-modal
    title="约一见"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="约见日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择约见日期"
            v-decorator="['dateForMeasure']"
            style="width: 100%"
          ></a-date-picker>
        </a-form-item>
        <a-form-item label="约见备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入约见备注"
            :rows="2" 
            v-decorator="['remark']"
            :max-length="300"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import moment from 'moment'
  export default {
    name: 'AboutFirstSee',
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        visible: false,
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        statusList: [],
        type: ''
      }
    },
    methods: {
      moment,
      show(id,type) {
        this.id = id
        this.visible = true
        this.type = type
        this.getCode()
      },
      getCode() {
        this.$getCodeList('1010', res => {
          res.forEach((el,index) => {
            if(el.value == '1010-10' || el.value == '1010-40') {
              res.splice(index,1)
            }
          })
          this.statusList = res
        })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        // this.confirmLoading = true
        this.handleCancel()
        validateFields((errors, values) => {
          if (!errors) {
            // values.organizationId = this.id
            // $post({
            //   url: api.organization.audit,
            //   data: values,
            //   needResponse: true
            // }).then(res=>{
            //   this.handleCancel()
            //   this.$emit('ok')
            //   this.$notification.success({
            //     message: labels.AUDIT_SUCCESS,
            //     description: res.message || ''
            //   })
            // }).catch(err => defaultErrorMessage(err, labels.AUDIT_FAIL))
            //   .finally(() => {
            //     this.confirmLoading = false
            //   })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel() {
        // 重置表单数据
        this.id = ''
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
      }
    }
  }
</script>
