<template>
  <!-- 跟踪操作 -->
  <a-modal
    :title="type == '10' ? '送货通知' : '特权送货'"
    :width="700"
    :centered="true"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-form :form="form">
      <a-col :md="12" :xs="24">
        <a-form-item label="送货时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择送货时间"
            style="width: 100%;"
            v-decorator="['sendDate',{ initialValue: moment(new Date()) }]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :xs="24">
        <a-form-item label="送货备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="4"
            placeholder="请输入送货备注"
            autocomplete="off"
            :maxLength="300"
            v-decorator="['sendRemark']"/>
        </a-form-item>
      </a-col>
    </a-form>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'TrackingModal',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        type: '',
      }
    },
    methods: {
      moment,
      show(type, id) {
        this.id = id
        this.type = type
        this.visible = true
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.billMasterId = this.id 
            values.sendDate =  values.sendDate ? moment(values.sendDate).format('YYYY-MM-DD') : null
            const url = this.type == '10' ? this.$api.basicData.materialConfirmInfo.deliveryNotice :this.$api.basicData.materialConfirmInfo.deliveryPrivilege
            this.save(values, url)
          }else {
            this.confirmLoading = false
          }
        })
      },
      save(data) {
        this.$post({ url, data }).then((res) =>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.OPERATE_SUCCESS,
            description: res.Msg || ''
          })
          console.log(res)
        }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },

      handleCancel() {
        this.id = ''
        this.type = ''
        this.visible = false
        this.form.resetFields()
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>