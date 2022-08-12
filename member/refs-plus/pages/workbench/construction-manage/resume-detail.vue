<template>
	<view class="resume-detail">
		<u-navbar :title="title" title-width='500' :title-size='34' title-color='#333333' :titleBold="true"
			:border-bottom='false' class="navbar">
<!-- 			<view slot='right' style="padding-right: 36rpx;color: #B80201;font-size: 28rpx;" @click="submit">
				提交
			</view> -->
		</u-navbar>
		<view class="detail">
			<view class="detail-title">
				停工信息
			</view>
			<view class="detail-info">
				<view class="detail-y">
					<text>停工时间</text>
					<text>{{detail.stopDate}}</text>
				</view>
				<view class="detail-y">
					<text>停工原因</text>
					<text>{{detail.stopReason}}</text>
				</view>
				<view class="detail-y">
					<text>停工天数</text>
					<text>{{detail.stopDay}}天</text>
				</view>
				<view class="detail-y">
					<text>停工备注</text>
					<text>{{detail.remark}}</text>
				</view>
				<view class="detail-e">
					<view class="detail-e-t">
						停工照片
					</view>
					<view class="detail-e-imgs">
						<image :src="val.path" mode="" v-for="(val,index) in detail.attachInfos"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="detail" v-if="detail.child">
			<view class="detail-title">
				审核复工信息
			</view>
			<view class="detail-info">
				<view class="detail-y">
					<text>复工时间</text>
					<text>{{detail.child.actualStartDate}}</text>
				</view>
				<view class="detail-y">
					<text>复工备注</text>
					<text>{{detail.child.remark}}</text>
				</view>
				<view class="detail-e">
					<view class="detail-e-t">
						审核复工照片
					</view>
					<view class="detail-e-imgs">
						<image :src="val.path" mode="" v-for="(val,index) in detail.child.attachInfos"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '详情',
				id:'',
				detail:{}
			}
		},
		onLoad(options) {
			// if (options.title) {
			// 	this.title = options.title
			// }
			if(options.id){
				this.id=options.id
				this.getDetail()
			}
		},
		methods: {
			submit() {
			
			},
			getDetail(){
				this.$get({
					url:this.api.CustomerConstructionTaskInfo.getConstructionPlanStopDetailInfo,
					data:{
						id:this.id
					}
				}).then(res=>{
					this.detail=res
				})
			}
		}
	}
</script>
<style>
	page {
		background: #F8F8FB;
	}
</style>
<style scoped lang="less">
		.detail{
			.detail-title{
				padding: 32rpx 30rpx 16rpx 30rpx;
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
			}
			.detail-info{
				background-color: #fff;
				padding: 30rpx;
				.detail-y{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 24rpx;
					&:last-child{
						margin-bottom: 0;
					}
					text{
						font-size: 28rpx;
						color: #333333;
					}
				}
				.detail-e{
					.detail-e-t{
						font-size: 28rpx;
						color: #333333;
						margin-bottom: 20rpx;
					}
					.detail-e-imgs{
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						image{
							width: 222rpx;
							height: 222rpx;
							border-radius: 8rpx;
							margin-right: 12rpx;
							margin-bottom: 20rpx;
							&:nth-child(3n){
								margin-right: 0;
							}
						}
					}
				}
			}
		}
</style>
