<template>
	<view class="add-daily">
		<u-navbar :title-bold="true" title="巡检添加" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="center">
			<view class="add-input">
				<view class="add-input-l">
					巡检标题
					<text>*</text>
				</view>
				<input type="text" placeholder="请输入巡检标题" v-model="title"
					placeholder-style="font-size: 32rpx;color:#D0D0D0">
			</view>
			<view class="add-input">
				<view class="add-input-l">
					巡检内容
					<text>*</text>
				</view>
				<input type="text" placeholder="请输入巡检内容" v-model="content"
					placeholder-style="font-size: 32rpx;color:#D0D0D0">
			</view>
		</view>
		<view class="unqualified-add">
			<text class="title">不合格情况说明</text>
			<view class="add" @click="add">
				<image src="/static/image/workbench/construction-manage/add.png" mode=""></image>
				<text>新增</text>
			</view>
		</view>
		<view class="unqualified-del" v-for="(val,index) in types" :key="index">
			<view class="unqualified-del-y">
				<text class="title">不合格类型</text>
				<view class="del" @click="del(index)" v-if="types.length!=1">
					<image src="/static/image/workbench/construction-manage/del.png" mode=""></image>
					<text>删除</text>
				</view>
			</view>
			<view class="unqualified-del-e">
				<view class="unqualified-select" @click="val.unqualifiedType=item.value"
					v-for="(item,index2) in unqualifiedType" :key="index2">
					<view class="circular" v-if="val.unqualifiedType!=item.value">

					</view>
					<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else></image>
					<text :class="val.unqualifiedType!=item.value ? 'text-g':'text-b'">{{item.name}}</text>
				</view>
			</view>
			<view class="">
				<view class="unqualified-del-s">
					<view class="content">
						<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon"
							v-if="!val.unqualifiedContent.length"></image>
						<textarea maxlength="200" v-model="val.unqualifiedContent" placeholder="     请输入申请原因" />
						<view class="count">
							<text class="count-r">{{val.unqualifiedContent.length}}</text>
							<text class="count-g">/200</text>
						</view>
						<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
							:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false"
							max-count="6" :custom-btn="true" @on-uploaded="onUpload($event,index)"
							@on-list-change="listChange">
							<view slot="addBtn">
								<image src="/static/image/mine/account/add.png"
									style="width: 196rpx;height: 196rpx;margin: 0;">
								</image>
							</view>
						</u-upload>
					</view>
				</view>
			</view>
		</view>
		<view class="btn" @click="submit">
			<text>提交</text>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				content: '',
				title: '',
				types: [{
					unqualifiedType: '',
					unqualifiedContent: '',
					attachIds: []
				}],
				trackContent: "",
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				uploadNumber: 0,
				unqualifiedType: [],
				typeValue: '',
				customerId: ''
			}
		},
		onLoad(options) {
			this.customerId=options.customerId
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
			this.getTypeList('1083')
		},
		methods: {
			//新增和编辑
			edit() {
				this.$post({
					url: this.api.CustomerInspectionRecordInfo.edit,
					data: {
						customerId: this.customerId,
						content: this.content,
						title: this.title,
						type: '1082-10',
						unqualifiedInfoDTOS: this.types
					}
				}).then(res => {
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//获取不合格类型
			getTypeList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					this.unqualifiedType = res.rows
					this.typeValue = res.rows[0].value
					this.types[0].unqualifiedType = res.rows[0].value
				})
			},
			//提交
			submit() {
				if (!this.title.length) {
					this.$Toast('请输入巡检标题')
					return
				}
				if (!this.content.length) {
					this.$Toast('请输入巡检内容')
					return
				}
				this.uploadNumber = 0
				for (let i = 0; i < this.$refs.uUpload.length; i++) {
					this.$refs.uUpload[i].upload()
				}
				// console.log(this.types)
			},
			listChange(list, name) {
				this.image = list.length
			},
			onUpload(lists, index) {
				let files = []
				let attaches = []
				// files = this.$refs.uUpload[index].lists.filter(val => {
				// 	return val.progress == 100;
				// })
				files = lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attaches.push(item.response.result[0].id)
				})
				this.types[index].attachIds = attaches
				console.log(index)
				this.uploadNumber++
				if (this.uploadNumber === this.types.length) {
					// submit
					this.edit()
				}
			},
			add() {
				let a = {
					unqualifiedType: this.typeValue,
					unqualifiedContent: '',
					attachIds: []
				}
				this.types.push(a)
				this.$Toast('添加成功')
			},
			del(index) {
				this.types.splice(index, 1)
			}
		},
		// watch: {
		// 	types: {
		// 		handler: function(val) {

		// 		},
		// 		deep: true
		// 	}
		// }
	}
</script>

<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.add-daily {
		padding-bottom: 120rpx;

		.center {
			padding: 0 30rpx 0 40rpx;
			margin-top: 20rpx;
			background: #fff;

			.add-input {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 112rpx;
				border-bottom: 1rpx solid #EEEEEE;

				&:last-child {
					border-bottom: none;
				}

				// padding: 0 30rpx 0 40rpx;
				.add-input-l {
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;

					text {
						color: #B80201;
					}
				}

				input {
					color: #333333;
					font-size: 32rpx;
					text-align: right;
				}
			}
		}

		.unqualified-add {
			padding: 32rpx 30rpx 16rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title {
				color: #666666;
				font-size: 28rpx;
			}

			.add {
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 8rpx;
				}

				text {
					color: #B80201;
					font-size: 28rpx;
				}
			}
		}

		.unqualified-del {
			background-color: #fff;
			padding: 32rpx 30rpx;
			margin-bottom: 20rpx;

			.unqualified-del-y {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 24rpx;

				.title {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				.del {
					display: flex;
					align-items: center;

					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 7rpx;
					}

					text {
						color: #999999;
						font-size: 28rpx;
					}
				}
			}

			.unqualified-del-e {
				margin-bottom: 24rpx;

				.unqualified-select {
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.circular {
						width: 32rpx;
						height: 32rpx;
						border: 2rpx solid #999999;
						border-radius: 50%;
					}

					image {
						width: 32rpx;
						height: 32rpx;
					}

					text {
						margin-left: 10rpx;
						font-size: 28rpx;
					}

					.text-g {
						color: #999999;
					}

					.text-b {
						color: #333333;
					}
				}
			}

			.unqualified-del-s {
				// padding: 30rpx;
				background-color: #FFFFFF;
				// padding-bottom: 50rpx;

				.content {
					background-color: #F9F9F9;
					padding: 20rpx;
					border-radius: 8rpx;
					position: relative;

					.writeIcon {
						position: absolute;
						width: 28rpx;
						height: 25rpx;
						top: 32rpx;
						left: 24rpx;
						z-index: 99;
					}

					textarea {
						height: 226rpx;
						width: 100%;
					}

					.count {
						text-align: right;
						font-size: 20rpx;
						margin-bottom: 40rpx;

						.count-r {
							color: #F43D1B;
						}

						.count-g {
							color: #B2B2B2;
						}
					}
				}
			}
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
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				line-height: 88rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 44rpx;
			}
		}
	}
</style>
