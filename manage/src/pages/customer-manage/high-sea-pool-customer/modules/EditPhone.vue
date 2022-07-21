<template>
  <a-modal :visible="visible" :centered="true" :width="400" title="修改手机号" @ok="handleSubmit" @cancel="handleCancel">
    <a-input
      type="number"
      placeholder="修改手机号"
      autocomplete="off"
      v-model="editPhone" />
  </a-modal>
</template>

<script>
  import regular from '@/utils/regular'
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'
  export default {
    name: 'EditPhone',
    data () {
      return {
        visible: false,
        id: '',
        editPhone: ''
      }
    },
    methods: {
      show (id) {
        this.id = id
        this.visible = true
      },
      handleSubmit () {
        if (regular['telOrMobile'].test(this.editPhone)){
          this.$post({
            url:this.$api.customInfo.highSeaPoolCustomer.changeMobileNumber,
            data: {
              customerId: this.id,
              mobileNumber: this.editPhone
            },
            needResponse: true
          }).then((res)=>{
            this.handleCancel()
            this.$emit('ok')
            this.$notification.success({
              message: labels.SAVE_SUCCESS,
              description: res.message || ''
            })
          }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
            .finally(() => { this.confirmLoading = false })
        }else {
          this.$notification.error({
            message: labels.SAVE_FAIL,
            description:  '手机号格式不正确'
          })
        }

      },
      handleCancel () {
        this.id = ''
        this.editPhone= ''
        this.visible = false
      }
    }
  }
</script>