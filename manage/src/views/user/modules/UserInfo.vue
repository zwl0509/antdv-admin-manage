<template>
  <a-modal
    title="智装帐号绑定"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @cancel="handleCancel"  
    footer="">
    <div class="modal-content">
      <a-form class="user-layout-login" :form="form">
        <a-form-item>
          <a-input 
            placeholder="请输入智装登录账号" 
            autocomplete="off"
            v-decorator="['userCode', {rules: [{ required: true, message: '请输入智装登录账号!'}]}]">
            <a-icon slot="prefix" type="user" :style="{ color: '#999999' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            autocomplete="off"
            placeholder="请输入智装密码"
            v-decorator="['pwd', {rules: [{ required: true, message: '请输入智装密码!' }]}]">
            <a-icon slot="prefix" type="lock" :style="{ color: '#999999' }"/>
          </a-input-password>
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <a-button type="primary" class="reset-button" :loading="confirmLoading" @click="handleSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'UserInfo',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
      }
    },
    methods: {
      ...mapActions(['ResetZhiZInfo','GetInfo']),
      show() {
        this.visible = true
        const data = this.$store.state.user.info.personalLoginInfo
        this.$nextTick(()=> {
          this.form.setFieldsValue({
            userCode: data?.userCode ?? '',
            pwd: data?.pwd ?? ''
          })
        })
      },
      handleSubmit () {
        this.confirmLoading = true
        const { form: { validateFields }} = this
        validateFields((errors, values) => {
          if (!errors) {
            this.save(values)
          } else {
            this.confirmLoading = false
          }
        })
      },
      // 保存
      save(data) {
        const { ResetZhiZInfo ,GetInfo } = this
        ResetZhiZInfo(data).then((res) => {
          this.handleCancel()
          this.$notification.success({
            message: '修改成功',
            description: res.message
          })
          GetInfo()
        }).catch(e => {
          this.$notification.error({
            message: '修改失败',
            description: e
          })
        }).finally(() => {
          this.confirmLoading = false
        })
      },  
      handleCancel () {
        this.visible = false
        this.form.resetFields()
        this.confirmLoading = false
      },
    }
  }
</script>

<style scoped lang="scss">

  ::v-deep .ant-modal {
    top: 200px;
  }

  label {
    font-size: 14px;
  }

  ::v-deep .ant-input {
    height: 40px;
    border: 1px solid rgba(191, 191, 191, 1);
    border-radius: 24px !important;
    font-weight: 500;
    color: #333333;
  }

  ::v-deep .ant-input:hover {
    border-color: $primaryColor;
  }

  button.reset-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    border-radius: 24px;
    background-image: $primaryColor;
    border: none;
  }
</style>
