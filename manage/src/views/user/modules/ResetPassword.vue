<template>
  <a-modal
    title="修改密码"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @cancel="handleCancel"
    footer=""
  >
    <div class="modal-content">
      <a-form
        id="formReset"
        class="user-layout-login"
        ref="formReset"
        :form="form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="请输入登录账号"
            disabled
            :value="$store.state.user.name"
          >
            <a-icon slot="prefix" type="user" :style="{ color: '#999999' }"/>
          </a-input>
        </a-form-item>
        <!--        <a-form-item>-->
        <!--          <a-input-->
        <!--            size="large"-->
        <!--            type="password"-->
        <!--            autocomplete="false"-->
        <!--            placeholder="请输入旧密码"-->
        <!--            v-decorator="[-->
        <!--                'oldPassWord',-->
        <!--                {rules: [{ required: true, message: '请输入旧密码' }], validateTrigger: 'blur'}-->
        <!--              ]"-->
        <!--          >-->
        <!--            <a-icon slot="prefix" type="lock" :style="{ color: '#999999' }"/>-->
        <!--          </a-input>-->
        <!--        </a-form-item>-->
        <a-form-item>
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder="请输入新密码"
            v-decorator="[
              'passWord',
              {rules: [{ required: true, message: '请输入新密码' }], validateTrigger: 'blur'}
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: '#999999' }"/>
          </a-input>
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="reset-button"
            :loading="state.resetBtn"
            :disabled="state.resetBtn"
          >确定
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'ResetPassword',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          resetBtn: false,
          // login type: 0 email, 1 username, 2 telephone
          resetType: 0,
          smsSendBtn: false
        }
      }
    },
    methods: {
      ...mapActions(['ResetPassword', 'Logout']),
      handleUsernameOrEmail (rule, value, callback) {
        const { state } = this
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          state.resetType = 0
        } else {
          state.resetType = 1
        }
        callback()
      },
      handleSubmit (e) {
        e.preventDefault()
        const {
          form: { validateFields },
          state,
          Logout,
          ResetPassword
        } = this
        state.resetBtn = true
        const validateFieldsKey = ['passWord']
        validateFields(validateFieldsKey, { force: true }, (err, values) => {
          if (!err) {
            const resetParams = { ...values }
            // delete resetParams.username
            // resetParams[!state.resetType ? 'email' : 'loginName'] = values.username
            // loginParams.password = md5(values.password)
            resetParams.loginName = this.$store.state.user.name
            // resetParams.password = values.password
            resetParams.resetOrUpdate = 1
            ResetPassword(resetParams).then((res) => {
              // console.log(res)
              this.$notification['success']({
                message: 'Success',
                description: res.message
              })
              Logout()
              this.$router.push('/user/login')
            }).catch(e => {
              // console.log(e)
              this.requestFailed(e)
            }).finally(() => {
              state.resetBtn = false
            })
          } else {
            setTimeout(() => {
              state.resetBtn = false
            }, 600)
          }
        })
      },
      handleCancel () {
        this.visible = false
        this.form.resetFields()
        this.confirmLoading = false
      },
      requestFailed (message) {
        this.$notification['error']({
          message: this.labels.NET_ERROR,
          description: message
        })
      }
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

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
    text-align: center;
    padding: 0;
    background: #17C39D;
    color: #FFFFFF;
    border-radius: 24px;
  }

  .getCaptcha:hover {
    border-color: $primaryColor;
  }

  .forge-password {
    font-size: 14px;
    color: $primaryColor;
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
