<template>
	<view class="journal">
		<u-navbar title="录入日志" :borderBottom='false' :titleBold='true' class="navbar" title-color='#333333'>
		</u-navbar>
		<view class="center">
			<view class="journal-y" v-for="(val,index) in list" :key="index">
				<view class="journal-info">
					<view class="journal-user">
						<image src="/static/image/mine/avatar-mis.png" mode=""></image>
						<view class="journal-user-text">
							<view class="">
								{{val.relationName}}
							</view>
							<view class="">
								{{val.orgName}}
							</view>
						</view>
					</view>
					<view class="journal-time">
						{{val.createdTime}}
					</view>
				</view>
				<view class="journal-title">
					{{val.typeName}}
				</view>
				<view class="journal-content">
					{{val.repeatType+'：'}}{{val.repeatAddress ? val.repeatAddress: ''}}{{val.repeatPhone ? val.repeatPhone :''}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[]
			}
		},
		onLoad() {
			this.getRepeatRecord()
		},
		methods:{
			getRepeatRecord(){
				this.$get({
					url:this.api.CustomInfo.getRepeatRecord
				}).then(res=>{
					this.list=res.rows
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.center{
		padding-top: 20rpx;
		.journal-y{
			width: 100%;
			padding: 24rpx 30rpx 32rpx 30rpx;
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			.journal-info{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 34rpx;
				.journal-user{
					display: flex;
					align-items: center;
					image{
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
					.journal-user-text{
						height: 76rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						view{
							font-size: 24rpx;
							font-weight: 500;
							color: #999999;
							&:first-child{
								font-size: 28rpx;
								font-weight: bold;
								color: #333333;
							}
						}
					}
				}
				.journal-time{
					color: #999999;
					font-size: 22rpx;
				}
			}
			.journal-title{
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 12rpx;
			}
			.journal-content{
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
		}
	}
</style>
