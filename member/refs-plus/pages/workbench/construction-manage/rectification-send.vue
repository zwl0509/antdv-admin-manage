<template>
	<view class="rectification-send">
		<u-navbar :title-bold="true" title="整改发送" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="" v-if="!Inspection">
			<view class="rectification-send-y" v-for="(val,index) in list" :key="index">
				<view class="title">
					不合格项 {{index}}
				</view>
				<view class="content">
					<view class="content-y">
						<text>标题</text>
						<text>{{val.title}}</text>
					</view>
					<view class="content-y">
						<text>描述</text>
						<text>{{val.question_content}}</text>
					</view>
					<view class="content-imgs">
						<view class="content-imgs-title">
							图片
						</view>
						<view class="content-imgs-img">
							<image :src="img.path" mode="" v-for="(img,index2) in val.detailVOS[0].attachInfos"
								:list="index2"></image>
						</view>
					</view>
					<view class="content-e"
						@click="toSet(index,'operationPositionName','chargePersonId',val.chargePersonId)">
						<view class="content-e-l">
							整改负责人
						</view>
						<view class="content-e-r">
							<text>{{val.operationPositionName}}</text>
							<image src="/static/image/mine/right.png" mode=""></image>
						</view>
					</view>
					<view class="content-e" @click="toSet(index,'notifyName','notifyIds',val.notifyIds)">
						<view class="content-e-l">
							整改抄送人
						</view>
						<view class="content-e-r">
							<view class="">
								<text v-for="(name,index2) in val.notifyName">{{name+','}}</text>
							</view>
							<image src="/static/image/mine/right.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="" v-else>
			<view class="rectification-send-y" v-for="(val,index) in list" :key="index">
				<view class="title">
					不合格项 {{index}}
				</view>
				<view class="content">
					<view class="content-y">
						<text>标题</text>
						<text>{{val.unqualifiedTypeName ? val.unqualifiedTypeName : val.questionTitle}}</text>
					</view>
					<view class="content-y">
						<text>描述</text>
						<text>{{val.unqualifiedContent ? val.unqualifiedContent : val.questionContent}}</text>
					</view>
					<view class="content-imgs">
						<view class="content-imgs-title">
							图片
						</view>
						<view class="content-imgs-img">
							<image :src="img.path" mode="" v-for="(img,index2) in val.attachInfos" :list="index2">
							</image>
						</view>
					</view>
					<view class="content-e"
						@click="toSet(index,'operationPositionName','chargePersonId',val.chargePersonId)">
						<view class="content-e-l">
							整改负责人
						</view>
						<view class="content-e-r">
							<text>{{val.operationPositionName}}</text>
							<image src="/static/image/mine/right.png" mode=""></image>
						</view>
					</view>
					<view class="content-e" @click="toSet(index,'notifyName','notifyIds',val.notifyIds)">
						<view class="content-e-l">
							整改抄送人
						</view>
						<view class="content-e-r">
							<view class="">
								<text v-for="(name,index2) in val.notifyName">{{name+','}}</text>
							</view>
							<image src="/static/image/mine/right.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="btn" @click="send">
			<text>提交</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				operationPositionName: '',
				operationPositionId: '',
				Inspection: false,
			}
		},
		onLoad(options) {
			this.list = JSON.parse(options.data)
			if (options.Inspection) {
				this.Inspection = options.Inspection
			}
			this.customerConstructionTaskId = options.customerConstructionTaskId
			this.operationPositionName = options.operationPositionName
			this.operationPositionId = options.operationPositionId
			this.list.forEach(item => {
				item.operationPositionName = this.operationPositionName != 'null' ? this.operationPositionName : ''
				item.chargePersonId = this.operationPositionId != 'null' ? this.operationPositionId : ''
				item.customerConstructionTaskId = this.customerConstructionTaskId
				item.notifyName = []
				item.notifyIds = []
			})
			console.log(this.list)
		},
		methods: {
			send() {
				let data = []
				this.list.forEach(item => {
					let a = {
						attachIds: [],
						chargePersonId: item.chargePersonId,
						content: this.Inspection ? item.unqualifiedContent : item.question_content,
						customerConstructionTaskId: item.customerConstructionTaskId,
						notifyIds: item.notifyIds, //抄送人
						status: '1092-10',
						title: this.Inspection ? item.unqualifiedTypeName : item.title,
						unqualifiedId: item.id
					}
					console.log(this.Inspection)
					if (this.Inspection) {
						item.attachInfos.forEach(item => {
							a.attachIds.push(item.id)
						})
					} else {
						item.detailVOS[0].attachInfos.forEach(item => {
							a.attachIds.push(item.id)
						})
					}

					data.push(a)
				})
				if (data.every(item => {
						return item.chargePersonId == ''
					})) {
					this.$Toast('请选择整改人')
					return
				}
				this.submit(data)
			},
			submit(data) {
				this.$post({
					url: this.api.CustomerConstructionTaskInfo.editRectification,
					data: data
				}).then(res => {
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			toSet(index, name, idName, list) {
				if (idName == 'chargePersonId') {
					uni.navigateTo({
						url: 'set-remind?index=' + index + '&name=' + name + '&idName=' + idName +
							'&customerIds=' + JSON.stringify([list])
					})
				} else {
					console.log(list)
					uni.navigateTo({
						url: 'set-remind?index=' + index + '&name=' + name + '&idName=' + idName +
							'&customerIds=' + JSON.stringify(list)
					})
				}

			}
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.rectification-send {
		padding-bottom: 136rpx;
	}

	.btn {
		width: 100%;
		height: 96rpx;
		position: fixed;
		z-index: 99;
		bottom: 20rpx;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 75rpx;

		text {
			display: inline-block;
			width: 100%;
			height: 88rpx;
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
			line-height: 88rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 44rpx;
		}
	}

	.rectification-send-y {
		.title {
			padding: 32rpx 30rpx 16rpx 30rpx;
			color: #333333;
			font-size: 28rpx;
			font-weight: bold;
		}

		.content {
			background-color: #fff;
			padding: 30rpx 30rpx 0 30rpx;

			.content-y {
				margin-bottom: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					color: #333333;
					font-size: 28rpx;
				}
			}

			.content-imgs {
				.content-imgs-title {
					color: #333333;
					font-size: 28rpx;
					margin-bottom: 20rpx;
				}

				.content-imgs-img {
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					image {
						width: 222rpx;
						height: 222rpx;
						border-radius: 8rpx;
						margin-right: 12rpx;
						margin-bottom: 12rpx;

						&:nth-child(3n) {
							margin-right: 0rpx;
						}
					}
				}
			}

			.content-e {
				min-height: 96rpx;
				padding: 0 10rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.content-e-l {
					color: #333333;
					font-size: 28rpx;
				}

				.content-e-r {
					display: flex;
					align-items: center;

					input {
						color: #333333;
						font-size: 28rpx;
						text-align: right;
					}

					image {
						width: 14rpx;
						height: 27rpx;
						margin-left: 24rpx;
					}
				}
			}
		}
	}
</style>
