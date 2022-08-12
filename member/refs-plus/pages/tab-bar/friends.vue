<template>
  <view>
    <u-navbar :isBack="false" title="朋友圈">
      <view slot="right" style="padding-right: 30rpx" @click="tolist">朋友</view>
    </u-navbar>
	<view class="content">
		<view class="strip">
			<view class="info">
				<view class="info_left">
					<image src="/static/image/mine/avatar-mis.png" mode=""></image>
					<view class="info_text">
						<view class="name">
							GAI super
						</view>
						<view class="time">
							今天 16:09
						</view>
					</view>
				</view>
				<view class="info_right">
					560m
				</view>
			</view>
			<view class="strip_content">
				红蚂蚁APP真的太好用了,红蚂蚁APP真的太好用了吧
			</view>
			<view class="tag">
				#APP试玩#
			</view>
			<view class="btns">
				<view class="btn">
					<image src="/static/image/common/share.png" mode=""></image>
					<text>218</text>
				</view>
				<view class="btn">
					<image src="/static/image/common/chat.png" mode=""></image>
					<text>218</text>
				</view>
				<view class="btn">
					<image src="/static/image/common/chat.png" mode=""></image>
					<text>218</text>
				</view>
			</view>
		</view>
	</view>
  </view>
</template>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
		tolist(){
			uni.navigateTo({
				url:'../index/friends_list'
			})
		}
	}
  }
</script>
<style lang="scss">
	page{
		background-color: #F6F6F6;
	}
	.content{
		padding-top: 20rpx;
		.strip{
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 0 30rpx;
			.info{
				padding: 24rpx 0;
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				.info_left{
					display: flex;
					align-items: center;
					image{
						height: 76rpx;
						width: 76rpx;
						margin-right: 20rpx;
					}
					.info_text{
						height: 76rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.name{
							font-size: 28rpx;
							color: #333333;
							font-weight: 500;
						}
						.time{
							font-size: 22rpx;
							color: #BBBBBB;
							font-weight: 500;
						}
					}
				}
				.info_right{
					font-size: 22rpx;
					color: #BBBBBB;
					font-weight: 400;
				}
			}
			.tag{
				margin-bottom: 24rpx;
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #B80201;
				font-weight: 500;
			}
			.btns{
				display: flex;
				align-items: center;
				height: 70rpx;
				width: 100%;
				border-top: 1rpx solid #F0F0F0;
				.btn{
					width: calc( 100% / 3);
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 28rpx;
						height: 28rpx;
						margin-right: 12rpx;
					}
					text{
						font-size: 22rpx;
						font-weight: 500;
						color: #666666;
					}
				}
			}
		}
	}
</style>

