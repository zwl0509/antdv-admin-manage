<template>
  <a-modal
    :title="type == 'apply' ?'保留申请' : '保留审核'"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-if="type == 'apply'" label="保留天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入保留天数" value="10"/>
        </a-form-item>
        <a-form-item v-if="type == 'apply'" label="申请备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入申请备注"
            :rows="2"
            v-decorator="['remark']"
            :max-length="300"></a-textarea>
        </a-form-item>
        <a-form-item v-if="type == 'review'" label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择审核状态" v-decorator="['status',{initialValue: '1010-20'},{rules: [{required: true}]}]">
            <a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="type == 'review'" label="审核内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入审核内容"
            :rows="2"
            v-decorator="['auditContent',{rules: [{required: true}]}]"
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
    name: 'FutureHouseApply',
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
