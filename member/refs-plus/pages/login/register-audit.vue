<template>
	<view>
		<u-navbar
      :background="{background: 'linear-gradient(to right, #f23a3a, #f75e30)'}"
      :border-bottom='false'
      :is-back="true"
      title="注册申请"
      backIconColor="white"
      titleColor="white"
    ></u-navbar>
    <view class="divider"></view>
    <view class="body">
      <view class="audit-bg"></view>
      <view class="title">审核中</view>
      <view class="desc">注册尚在审核中，请耐心等待！</view>
      <view class="login-btn">
        <button  @click="handleOk">好的</button>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
      handleOk () {
        uni.redirectTo({
          url: './login'
        })
      }
		}
	}
</script>

<style scoped lang="scss">
  .divider{
    height: 20rpx;
    background-color: #F7F7F7;
  }

  .body{
    padding: 88rpx 46rpx 50rpx 49rpx;
    box-sizing: border-box;
    .audit-bg{
      width: 100%;
      height: 438rpx;
      background: url("/static/image/login/audit-bg.png") no-repeat center center;
      background-size: 100% auto;
    }
    .title{
      margin-top: 62rpx;
      font-size: 36rpx;
      text-align: center;
      line-height: 36rpx;
      color: #333;
      font-weight: bold;
    }
    .desc{
      font-size: 26rpx;
      line-height: 27rpx;
      color: #999;
      margin-top: 31rpx;
      text-align: center;
    }
  }
  .login-btn {
    margin-top: 78rpx;
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

</style>
