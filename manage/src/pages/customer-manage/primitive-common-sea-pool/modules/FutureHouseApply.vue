<template>
  <a-modal
    :title="modal_title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-if="modal_type == 3 || modal_type == 1" label="申请天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入申请天数"
            type="number"
            v-decorator="['daysOrNum', {rules: [{message: '请输入申请天数'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 3)}]}]">
          </a-input>
        </a-form-item>
        <a-form-item label="申请原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入申请原因"
            :rows="3" 
            v-decorator="['applicationReason']"
            :max-length="500"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage,maxLenValidator } from '@/utils/common'
  export default {
    name: 'FutureHouseApply',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case  1 :
            return '批量保留'
          case  2 :
            return '批量期房'
          case 3 :
            return '保留申请'
          case 4 :
            return '期房申请'
          case 5 :
            return '移交设计部申请'
          default:
            return ''
        }
      }
    },
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
        modal_type: '',
        visible: false,
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        statusList: [],
        type: '',
        status:''
        
      }
    },
    methods: {
      maxLenValidator,
      show(ids,status,type) {
        this.ids = ids
        this.status = status
        this.visible = true
        this.modal_type = type
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
        validateFields((errors, values) => {
          if (!errors) {
            values.type = this.status
            values.relationIds = this.ids
            this.save(values)
          } 
        })
      },
      save (data) {
        this.$post({
            url: this.$api.customInfo.customerCommon.application,
            data,
            needResponse: true
          }).then(res=>{
            this.handleCancel()
            this.$emit('ok')
            this.$notification.success({
              message: labels.APPLY_SUCCESS,
              description: res.message || ''
            })
          }).catch(err => defaultErrorMessage(err, labels.APPLY_ERROR))
            .finally(() => {
              this.confirmLoading = false
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