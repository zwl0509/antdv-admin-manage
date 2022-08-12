<template>
	<!-- 施工操作 -->
	<view class="construction-action">
		<u-navbar :title="'确认' + action_title" title-width="500" :title-size="34" title-color="#333333"
			:border-bottom="false">
		</u-navbar>
		<view class="center">
			<view class="add-input">
				<view class="add-input-l">{{ action_title + '日期' }}</view>
				<view class="add-input-r" v-if="type !== '1080-30' ">{{ currentTime }}</view>
				<view class="add-input-r" v-else @click="timeShow = true">
					<input type="text" placeholder="请选择日期" v-model="info.delayDate" :disabled="true"
						placeholder-style="font-size: 32rpx;color:#D0D0D0">
					<image src="/static/image/mine/right.png"></image>
				</view>
			</view>
			<view class="add-input" v-if="type == '1080-30'">
				<view class="add-input-l">{{ action_title + '原因' }}</view>
				<view class="add-input-r" @click="reasonTypeShow = true">
					<input type="text" placeholder="请选择延期原因" v-model="info.reasonName" :disabled="true"
						placeholder-style="font-size: 32rpx;color:#D0D0D0">
					<image src="/static/image/mine/right.png"></image>
				</view>
			</view>
		</view>

		<view style="background-color: #fff;padding-bottom: 32rpx;">
			<view class="remark-title">{{ action_title + '备注' }}</view>
			<view class="unqualified-del-s">
				<view class="content">
					<image v-if="!info.remark.length" src="/static/image/tab-bar/write.png" class="writeIcon"></image>
					<textarea maxlength="200" v-model="info.remark" placeholder="请输入备注"
						placeholder-style="margin-left: 40rpx" />
					<view class="count">
						<text class="count-r">{{info.remark.length}}</text><text class="count-g">/200</text>
					</view>
					<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
						:formData="{ attachType: '1009-20' }" :header="header" name="files" :auto-upload="false"
						max-count="6" :custom-btn="true" @on-uploaded="onUpload">
						<view slot="addBtn">
							<image src="/static/image/mine/account/add.png"
								style="width: 196rpx;height: 196rpx;margin: 0;">
							</image>
						</view>
					</u-upload>
				</view>
			</view>
		</view>
		<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
		<u-select :list="reasonTypeList" value-name="value" label-name="name" v-model="reasonTypeShow"
			@confirm="selectReasonType"></u-select>
		<view class="footer-page">
			<view class="primary" @click="handleSubmit">提交</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import variable from '@/common/service/variable.js'
	export default {
		computed: {
			action_title() {
				switch (this.type) {
					case '1080-10':
						return '开工'
					case '1080-20':
						return '完工'
					case '1080-30':
						return '延期'
					default:
						return ''
				}
			}
		},
		onLoad(params = {}) {
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
			const data = JSON.parse(decodeURIComponent(params.info))
			this.type = data.type
			this.id = data.id
			this.getCodeList()
		},
		data() {
			return {
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				currentTime: moment(new Date()).format('YYYY-MM-DD'),
				params: {
					year: true,
					month: true,
					day: true,
				},
				reasonTypeShow: false,
				reasonTypeList: [],
				timeShow: false,
				info: {
					remark: '',
					delayDate: '',
					reason: '',
					reasonName: ''
				},
				id: '',
				type: '',
			}
		},
		methods: {
			//获取延期原因code
			getCodeList() {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: '1090'
					}
				}).then(res => {
					this.reasonTypeList = res.rows
				})
			},
			selectReasonType(e) {
				this.info.reasonName = e[0].label
				this.info.reason = e[0].value
			},
			selectTime(e) {
				this.info.delayDate = e.year + '-' + e.month + '-' + e.day
			},
			handleSubmit() {
				this.$refs.uUpload.upload()
			},
			onUpload(lists) {
				let files = []
				let attachIds = []
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attachIds.push(item.response.result[0].id)
				})
				this.save(attachIds)
			},
			// 保存
			save(attachIds) {
				const data = {
					customerConstructionTaskInfoId: this.id,
					attachIds: attachIds,
					type: this.type,
					...this.info
				}
				const url = this.type == '1080-30' ? this.api.CustomerConstructionTaskInfo.delay : this.api
					.CustomerConstructionTaskInfo.startOrEnd
				this.$post({
					url,
					data
				}).then(res => {
					this.$Toast('保存成功')
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}).catch(e => {
					console.log(e)
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #F8F8FB;
	}

	.construction-action {
		.center {
			padding: 0 30rpx 0 40rpx;
			margin-top: 20rpx;
			background: #fff;

			.add-input {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 112rpx;
				border-bottom: 2rpx solid #EEEEEE;

				// &:last-child {
				// 	border-bottom: none;
				// }

				// padding: 0 30rpx 0 40rpx;
				.add-input-l {
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;

					text {
						color: #B80201;
					}
				}

				.add-input-r {
					display: flex;
					align-items: center;

					image {
						width: 14rpx;
						height: 27rpx;
						margin-left: 16rpx;
					}

					input {
						color: #333333;
						font-size: 32rpx;
						text-align: right;
					}
				}
			}
		}

		.remark-title {
			padding: 32rpx 30rpx 24rpx 40rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}

		.unqualified-del-s {
			background-color: #fff;
			padding: 0 30rpx;
		}

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
				z-index: 3;
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
</style>
