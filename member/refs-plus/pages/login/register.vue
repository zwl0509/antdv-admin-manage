<template>
  <view class="login-page">
    <u-navbar :background="background" :border-bottom='false' :is-back="true"></u-navbar>
    <view class="top">
      <view class="title">
        <text>注册后更精彩</text>
      </view>
    </view>
    <image src="/static/image/login/bg.png" mode="" class="login-bg"></image>
    <view class="form">
      <view class="form-item">
        <input class="input" type="number" :autocomplete="false" v-model="mobile" maxlength="20" placeholder="请输入手机号码"
               placeholder-style="font-size: 34rpx" />
        <view class="suf-icon clean-text" v-if="mobile && !noClick" @click="() => mobile = ''"></view>
      </view>
      <view class="form-item">
        <input class="input" type="text" :autocomplete="false" v-model="name" maxlength="20" placeholder="请输入姓名"
               placeholder-style="font-size: 34rpx" />
        <view class="suf-icon clean-text" v-if="name && !noClick" @click="() => name = ''"></view>
      </view>
      <!--<view class="form-item">-->
      <!--  <view class="label">请选择</view>-->
      <!--  <view class="radio-box">-->
      <!--    <u-radio-group>-->
      <!--      <u-radio name="1002-10" class="radio">男</u-radio>-->
      <!--      <u-radio name="1002-20" class="radio">女</u-radio>-->
      <!--    </u-radio-group>-->
      <!--  </view>-->
      <!--  <view class="suf-icon clean-text" v-if="name && !noClick" @click="() => name = ''"></view>-->
      <!--</view>-->
      <view class="form-item flex">
        <input class="input" v-model="code" maxlength="16" :type="showPwd ? 'text': 'password'" placeholder="请输入验证码"
          placeholder-style="font-size: 34rpx" />
        <view class="verify-text" @click="handleSend">{{ inSend ? time +'s' : '获取' }}</view>
      </view>
    </view>
    <view class="bottom">
      <view class="login-btn">
        <button :disabled="!name || !code || !mobile || noClick" @click="handleLogin">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
// import {
// 	wxGetUserInfo,
// 	wxProviderLogin
// } from '../../utils/weixin/auth'
// #ifdef APP-PLUS
import updata from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
// #endif
export default {
  data() {
    return {
      noClick: false,
      mobile: '',
      name: '',
      code: '',
      showPwd: false,
      readMe: false,
      background: {
        background: 'none'
      },
      interval: null,
      time: 0,
      inSend: false
    };
  },
  onLoad(params = {}) {
    // #ifdef APP-PLUS
    const clientInfo = plus.push.getClientInfo()
    uni.setStorageSync('clientInfo', clientInfo)
    console.log(clientInfo)
    // #endif
  },
  onReady() {
    // let ISPRIVACY = uni.getStorageSync('ISPRIVACY');
    // if (!ISPRIVACY) {
    //   // this.$refs.tipModal.visible = true
    // }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    toPage(url) {
      uni.navigateTo({
        url: '/pages/mine/about-us/' + url
      })
    },
    handleSend () {
      this.inSend = true
      this.time = 59
      this.intervalTime()
    },
    intervalTime () {
      if (this.interval !== null) clearTimeout(this.interval)
      this.interval = setTimeout(() => {
        if (this.time > 1) {
          this.time--
          this.intervalTime()
        } else {
          this.time = 0
          this.inSend = false
        }
      }, 1000)
    },
    handleLogin() {
      if (!this.mobile) {
        this.$Toast('请输入手机号码')
        return
      }
      if (!(/^1[23456789]\d{9}$/.test(this.mobile))) {
        this.$Toast('手机号码格式不正确')
        return
      }
      if (!this.name) {
        this.$Toast('请输入姓名')
        return
      }
      if (!this.code) {
        this.$Toast('请输入验证码')
        return
      }
      this.$Toast('正在注册')
      this.noClick = true
      setTimeout(() => {
        this.mobile = ''
        this.name = ''
        this.code = ''
        this.$store.commit('SET_REGISTER_INFO', { name: this.name, mobile: this.mobile, code: this.code })
        uni.navigateTo({
          url: './register-audit'
        })
        this.noClick = false
      }, 80)
    },
  }
}
</script>

<style lang="scss">
.login-page {
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  position: relative;

  .login-bg {
    width: 264rpx;
    height: 400rpx;
    position: absolute;
    top: 0rpx;
    right: 0rpx;
  }

  .top {
    width: 100%;
    height: 312rpx;
    padding-top: 128rpx;
    box-sizing: border-box;

    .title {
      margin-left: 56rpx;
      font-size: 56rpx;
      line-height: 80rpx;
      font-weight: bold;
      color: #111111;
    }
  }

  .form {
    padding: 0 56rpx;
    box-sizing: border-box;

    .form-item {
      height: 108rpx;
      position: relative;
      border-bottom: 1px solid #e0e0e0;

      .input {
        font-family: PingFang SC;
        color: #333;
        font-weight: normal;
        font-size: 34rpx;
        height: 100%;
        line-height: 104rpx;
        padding-right: 48rpx;
        box-sizing: border-box;
        border: 0;
        width: 100%;
        box-shadow: none;

        &:focus,
        &:focus-visible {
          border: none;
          outline: none;
        }
      }

      .suf-icon {
        position: absolute;
        right: 0;
        width: 44rpx;
        height: 44rpx;
        top: 30rpx;
      }

      .clean-text {
        background: url("/static/image/login/clean.png") no-repeat center center;
        background-size: 100% auto;
      }

      .show-password {
        background: url("/static/image/login/close.png") no-repeat center center;
        background-size: 100% auto;

        &.opened {
          background: url("/static/image/login/open.png") no-repeat center center;
          background-size: 100% auto;
        }
      }

      .verify-text{
        width: 186rpx;
        height: 100%;
        font-size: 34rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $primaryColor;
        position: relative;
        &:before{
          content: '';
          position: absolute;
          top: calc(50% - 15rpx);
          height: 30rpx;
          left: 0;
          width: 0;
          border-left: 1px solid #e0e0e0;
        }
      }
    }
    .flex{
      display: flex;
    }
  }

  .login-phone {
    font-size: 32rpx;
    color: #B80201;
    font-weight: 400;
    padding-left: 56rpx;
    margin-top: 32rpx;
  }

  .bottom {
    margin-top: 102rpx;
    width: 100%;

    .login-btn {
      width: 100%;

      button {
        color: white;
        font-size: 36rpx;
        width: 550rpx;
        margin: 0 auto;
        height: 96rpx;
        border-radius: 48rpx;
        background: linear-gradient(to right, #D80100, #B80201);

        &:after {
          border: none
        }

        &[disabled] {
          background: rgba(255, 182, 181, 0.39);
        }
      }
    }
    .register-line{
      width: 550rpx;
      margin: 20rpx auto 0rpx;
      color: $primaryColor;
      text-align: right;
      line-height: 48rpx;
      font-size: 24rpx;
      text{
        margin-right: 12rpx;
      }
    }
  }
}

</style>
