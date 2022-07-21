<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <div class="title">红蚂蚁项目管理系统</div>
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误"/>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          :disabled="loginBtn"
          placeholder="请输入帐号"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请输入帐号' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
        >
          <img slot="prefix" :src="require('@/assets/images/account.prefix.png')" class="input-prefix"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          :disabled="loginBtn"
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <img slot="prefix" :src="require('@/assets/images/password.prefix.png')" class="input-prefix"/>
        </a-input>
      </a-form-item>
      <a-form-item style="border-bottom: 0;" class="btn-item">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="loginBtn"
        >登录
        </a-button>
      </a-form-item >
      <a-form-item style="border-bottom: 0;padding-top: 0">
        <div>
          <a-checkbox v-model="remember" :disabled="loginBtn" style="font-size: 21px;color: #999">
            记住密码
          </a-checkbox>
        </div>
      </a-form-item>
    </a-form>

    <!--<two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>-->
    <resetPassword ref="resetModal" @handleOk="handleReset"></resetPassword>
  </div>
</template>

<script>
  // import md5 from 'md5'
  // import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { mapActions } from 'vuex'
  import { getSmsCaptcha } from '@/api/login'
  import ResetPassword from '@/views/user/modules/ResetPassword'
  import labels from '@/utils/labels'
  import { USER_ACCOUNT } from '@/store/mutation-types'

  export default {
    components: {
      // TwoStepCaptcha,
      ResetPassword
    },
    data () {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        loginType: 0,
        isLoginError: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          loginBtn: false,
          loginType: 0,
          smsSendBtn: false
        },
        remember: false
      }
    },
    created () {
      const val = localStorage.getItem(USER_ACCOUNT)
      if (val) {
        const values = JSON.parse(val || '{}') || {}
        this.remember = !!values.remember
        this.$nextTick(() => {
          this.form.setFieldsValue({ username: values.username || '', password: values.password || '' })
        })
      }
    },
    methods: {
      ...mapActions(['Login', 'Logout']),
      // handler
      handleUsernameOrEmail (rule, value, callback) {
        const { state } = this
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          state.loginType = 0
        } else {
          state.loginType = 1
        }
        callback()
      },
      handleSubmit (e) {
        e.preventDefault()
        const {  form: { validateFields }, state, customActiveKey, Login } = this

        this.loginBtn = true
        const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

        validateFields(validateFieldsKey, { force: true }, (err, values) => {
          if (!err) {
            const loginParams = { ...values }
            delete loginParams.username
            loginParams[!state.loginType ? 'email' : 'loginName'] = values.username
            // loginParams.password = md5(values.password)
            loginParams.password = values.password
            loginParams.rememberMe = true
            Login(loginParams)
              .then((res) => this.loginSuccess(res))
              .catch(err => this.requestFailed(err))
              .finally(() => {
                this.loginBtn = false
              })
          } else {
            setTimeout(() => {
              this.loginBtn = false
            }, 600)
          }
        })
      },
      loginSuccess (res) {
        if (this.remember) {
          const data = this.form.getFieldsValue()
          localStorage.setItem(USER_ACCOUNT, JSON.stringify({ username: data.username, password: data.password, remember: true }))
        }
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        // setTimeout(() => {
        //   this.$notification.success({
        //     message: '欢迎',
        //     description: `${timeFix()}，欢迎回来`
        //   })
        // }, 1000)
        this.isLoginError = false
      },
      requestFailed (err) {
        this.isLoginError = true
        this.$notification['error']({
          message: labels.NET_ERROR,
          description: typeof err === 'string' && err || err && err.message || labels.RESPONSE_RESULT_EXCEPTION,
          duration: 4
        })
      },
      resetPwd () {
        this.$refs.resetModal.visible = true
      },
      handleReset () {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-layout-login {
    font-family: PingFangSC;
    .title {
      font-weight: 500;
      font-size: 36px;
      text-align: center;
      margin: 50px 0 55px;
      color: $primaryColor;
      letter-spacing: 2px;
    }
    .input-prefix{
      width: 32px;
    }
    .btn-item{
      padding-top: 84px;
    }
    ::v-deep .ant-form-item{
      box-sizing: border-box;
      min-height: 100px;
      padding-top: 39px;
      border-bottom: 1px solid #999;
    }
    ::v-deep .ant-input-affix-wrapper .ant-input-prefix{
      left: 0;
    }
    ::v-deep .ant-input {
      height: 60px;
      border: none !important;
      background: #f1f9fe;
      font-weight: 500;
      color: #333333;
      font-size: 24px;
      padding-left: 60px;
    }

    ::v-deep .ant-input:hover {
      border-color: $primaryColor;
      background-color: #f1f9fe
    }
    ::v-deep .ant-input:focus{
      box-shadow: none;
    }

    button.login-button {
      height: 60px;
      width: 100%;
      background: $primaryColor;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
      border: none !important;
      border-radius: 3px;
    }
  }

  @media screen and (max-width: 1660px){
    .user-layout-login{
      .title{
        font-size: 30px;
        margin: 16px 0;
      }
      .input-prefix{
        width: 32px;
      }
      ::v-deep .ant-form-item{
        box-sizing: border-box;
        min-height: 48px;
        padding-top: 32px;
        border-bottom: 1px solid #999;
      }
      ::v-deep .ant-input {
        height: 48px;
        font-size: 18px;
        padding-left: 54px;
      }
      .btn-item{
        padding-top: 32px;
      }
      button.login-button{
        height: 48px;
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 1366px){
    .user-layout-login{
      .title{
        font-size: 28px;
        margin: 0px 0;
      }
      .input-prefix{
        width: 18px;
      }
      ::v-deep .ant-form-item{
        box-sizing: border-box;
        min-height: 32px;
        padding-top: 16px;
        border-bottom: 1px solid #999;
      }
      ::v-deep .ant-input {
        height: 32px;
        font-size: 18px;
        padding-left: 42px;
      }
      .btn-item{
        padding-top: 16px;
      }
      button.login-button{
        height: 48px;
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 1280px){
    .user-layout-login{
      .title{
        font-size: 28px;
        margin: 0px 0;
      }
      .input-prefix{
        width: 18px;
      }
      ::v-deep .ant-form-item{
        box-sizing: border-box;
        min-height: 32px;
        padding-top: 16px;
        border-bottom: 1px solid #999;
      }
      ::v-deep .ant-input {
        height: 32px;
        font-size: 18px;
        padding-left: 42px;
      }
      .btn-item{
        padding-top: 16px;
      }
      button.login-button{
        height: 48px;
        font-size: 18px;
      }
    }
  }
  ::v-deep form input[type='checkbox']{
    width: 21px;
    height: 21px;
  }
  ::v-deep .ant-checkbox-inner{
    width: 21px;
    height: 21px;
  }
  ::v-deep .ant-checkbox-checked .ant-checkbox-inner::after{
    left: 26%;
    top: 45%
  }
</style>
