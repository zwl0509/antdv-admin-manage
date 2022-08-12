<template>
	<view class="materials-confirm">
		<u-navbar title="材料确认" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333' back-icon-color="#333333">
		</u-navbar>
		<view class="comfirm-y" v-for="(item, index) in dataList" :key="index">
			<view class="comfirm-y-info">
				<view class="comfirm-y-info-l">
					<image src="/static/image/workbench/customer-manage/fly.png" mode=""></image>
					<view class="">
						<view class="info-name">
							<view>{{ item.MaterialName }}</view>
							<view>全部</view>
						</view>
						<view class="info-area">{{ item.Spec }}</view>
					</view>
				</view>
				<view class="comfirm-y-info-r" @click="confirm(item)">全部确认</view>
			</view>
			<view class="comfirm-y-area">
				数量1.0893 (平米)
			</view>
			<view class="" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'>
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!item.remark.length">
				</image>
				<textarea style="height: 226rpx;width: 100%;" maxlength="200" v-model="item.remark"
					placeholder="     这里可以填写您的备注哦~" />
				<view class="" style='text-align: right;font-size: 20rpx;margin-bottom: 40rpx;'>
					<text style='color: #F43D1B;'>{{item.remark.length}}</text><text style='color: #B2B2B2;'>/200</text>
				</view>
				<!-- <u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
					:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false" max-count="3"
					:custom-btn="true" @on-uploaded="onUpload">
					<view slot="addBtn">
						<image src="/static/image/mine/account/add.png"
							style="width: 196rpx; height: 196rpx;margin: 0;">
						</image>
					</view>
				</u-upload> -->
			</view>
		</view>
		<view class="btn" @click="confirmBatch">
			<text>批量确认</text>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				action: '',
				header: { 'X-Auth-Token': '' },
				dataList: []
			}
		},
		onLoad(params= {}) {
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
			this.getDetail(params.id)
		},
		methods: {
			getDetail(id) {
				this.$get({
					url: this.api.MaterialConfirmInfo.getBillMasterDetail,
					data: { billMasterId: id }
				}).then((res) => {
					const list = [ ... res ]
					list.forEach(item=> {
						item.remark = ''
					})
					this.dataList = list  
				}).catch((err) => { console.log(e) })
			},
			onUpload(lists, name) {
				let files = []
				let attaches = []
				// console.log(lists)
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attaches.push(item.response.result[0].id)
				})
			},
			confirm(item) {
				const data  = {
					billDetailId: item.BillDetailId,
					checkNum: item.SaleNum,
					remark: item.remark
				}
				const url = this.api.MaterialConfirmInfo.allConfirm
				this.$get({ url, data }).then(res=> {
					this.$Toast('确认成功！')
					setTimeout(() => { 
						uni.navigateBack()
					}, 1000)
				}).catch(e=> { console.log(e)})
			},
			confirmBatch() {
				const list = []
        this.dataList.forEach(item=> {
          list.push({
            billDetailId: item.BillDetailId,
            checkNum: item.SaleNum,
            remark: item.remark,
          })
        })
				const url = this.api.MaterialConfirmInfo.allConfirmBatch
				this.$get({ url, data: list }).then(res=> {
					this.$Toast('批量确认成功！')
					setTimeout(() => { 
						uni.navigateBack()
					}, 1000)
				}).catch(e=> { console.log(e)})
			},
		}
	}
</script>

<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.materials-confirm {
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

		padding-bottom: 46rpx;

		.writeIcon {
			position: absolute;
			width: 28rpx;
			height: 25rpx;
			top: 32rpx;
			left: 24rpx;
			z-index: 99;
		}

		.comfirm-y {
			padding: 32rpx 30rpx;
			background-color: #fff;
			margin-top: 20rpx;

			.comfirm-y-info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 32rpx;
				border-bottom: 2rpx solid #EEEEEE;

				.comfirm-y-info-l {
					display: flex;
					align-items: center;

					image {
						width: 80rpx;
						height: 80rpx;
						margin-right: 20rpx;
					}

					.info-name {
						display: flex;
						align-items: center;
						margin-bottom: 10rpx;
	

						view {
							max-width: 360rpx;
							color: #333333;
							font-size: 28rpx;
							font-weight: bold;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;

							&:last-child {
								display: inline-block;
								width: 68rpx;
								height: 36rpx;
								border-radius: 4rpx;
								background-color: #FCEDED;
								color: #B80201;
								font-size: 24rpx;
								font-weight: 400;
								line-height: 36rpx;
								text-align: center;
								margin-left: 16rpx;
							}
						}
					}

					.info-area {
						color: #999999;
						font-size: 28rpx;
					}
				}

				.comfirm-y-info-r {
					width: 140rpx;
					height: 56rpx;
					border-radius: 8rpx;
					background-color: #B80201;
					line-height: 56rpx;
					text-align: center;
					color: #FFFFFF;
					font-size: 28rpx;
				}
			}

			.comfirm-y-area {
				padding: 34rpx 0 24rpx 0;
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
			}
		}
	}
</style>
