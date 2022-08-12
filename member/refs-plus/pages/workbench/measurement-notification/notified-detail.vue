<template>
	<view class="notified-detail">
		<u-navbar title="待通知详情" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="center">
			<image src="/static/image/workbench/measurement-notification/detail-bg.png" mode="" class="center-bg"></image>
			<view class="detail-company">
				<image src="/static/image/workbench/measurement-notification/icon.png" mode=""></image>
				<view class="detail-company-r">
					<view class="detail-company-r-title">
						<text>{{ title }}</text>
						<view class="">
							{{list.length}}
						</view>
					</view>
				</view>
			</view>
			<view class="detail-title">
				<view class="">

				</view>
				<text>材料列表</text>
				<view class="">

				</view>
			</view>
			<scroll-view scroll-y="true">
				<view class="detail-list">
					<view class="list-y" v-for="(val,index) in list" :key="index" @click="toDetail(val)">
						<view class="list-y-select" @click.stop="val.select=!val.select">
							<view class="select-no" v-if="!val.select">

							</view>
							<image src="/static/image/workbench/renovation-data/select.png" mode="" v-else></image>
						</view>
						<view class="list-y-r">
							<image src="/static/image/workbench/renovation-data/img.png" mode=""></image>
							<view class="list-y-r-content">
								<view class="list-y-r-content-y">
									<text>{{ val.materialName}}</text>
									<view class="" @click.stop="show=true ; newList=val">
										转不测量
									</view>
								</view>
								<view class="list-y-r-content-e">
									{{val.materialType ? val.materialType+';':''}}
									{{val.color ? val.color:''}}
									{{val.spec ? val.spec+';':''}}
								</view>
								<view class="list-y-r-content-s">
									<text>¥</text>{{ val.salePrice }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<u-modal v-model="show" :confirm-style='confirmStyle' :cancel-style='camcelStyle'
				content="是否确认转不测量" :show-cancel-button='true' title='提醒' @confirm='confirm' :title-style='titleStyle'
				:content-style="contentStyle">
			</u-modal>
			<view class="detail-btn">
				<view class="detail-btn-l" @click="selectAll">
					<view class="select-no" v-if="!allSelect">

					</view>
					<image src="/static/image/workbench/renovation-data/select.png" mode="" v-else></image>
					<text>全选</text>
				</view>
				<view class="detail-btn-r">
					<view class="count">
						<text>已选择</text>
						<text style="font-weight: bold;">{{slectList.length}}种</text>
					</view>
					<view class="btn" @click="toNotice">
						通知测量
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
				show:false,
				list: [],
				title:'',
				select:false,
				allSelect: false,
				slectList: [],
				titleStyle: {
					fontSize: '26rpx',
					color: '#333333',
					fontWeight: 'bold'
				},
				contentStyle: {
					color: '#333333',
					fontSize: '32rpx'
				},
				camcelStyle: {
					background: '#F5F5F5',
					color: "#333333",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 31rpx 40rpx 40rpx'
				},
				confirmStyle: {
					background: 'linear-gradient(90deg, #D80100 0%, #B80201 100%)',
					color: "#FFFFFF",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 40rpx 40rpx 31rpx'
				},
				newList: null
			}
		},
		onLoad(options){
			const info = JSON.parse(decodeURIComponent(options.info))
			info.productInfoList?.forEach(el=>{
				el.select = false
			})
			this.list = this.$u.deepClone(info.productInfoList)
			this.title = info.classifyName
		},
		methods: {
			toNotice(){
				uni.navigateTo({
					url: `measure-notice?list=${encodeURIComponent(JSON.stringify(this.slectList))}`
					// url: 'measure-notice?title=' + this.title + '&list='+JSON.stringify(this.slectList)
				})
			},
			toDetail(val){
				uni.navigateTo({
					url: `./data-detail?info=${encodeURIComponent(JSON.stringify(val))}`
				})
			},
			confirm(){
				this.$post({
					url: this.api.measureNotifyInfo.notMeasure,
					data: [ this.newList.id ]
				}).then(res => {
					uni.navigateBack({

					})
				})
			},
			selectAll() {
				if (this.allSelect) {
					this.list.forEach(item => {
						item.select = false
					})
				} else {
					this.list.forEach(item => {
						item.select = true
					})
				}
				this.allSelect = !this.allSelect
			},
		},
		watch: {
			list: {
				handler: function(val) {
					this.slectList=[]
					val.forEach(item => {
						if (item.select) {
							this.slectList.push(item)
						}
					})
					if (val.every(item => {
							return item.select == true
						})) {
						this.allSelect = true
					} else {
						this.allSelect = false
					}
				},
				deep: true
			}
		}
	}
</script>
<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.notified-detail {
		.center {
			padding: 0 30rpx;
			background-color: #fff;
			margin-top: 20rpx;
			position: relative;
			.center-bg{
				width: 100%;
				height: 184rpx;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
		
		.select-no {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			border: 2rpx solid #D5D5D5;
		}

		.detail-company {
			height: 158rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #F0F0F0;

			image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.detail-company-r {
				width: 100%;

				.detail-company-r-title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10rpx;

					text {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
					}

					view {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						background-color: #E53E3D;
						line-height: 40rpx;
						text-align: center;
						color: #FFFFFF;
						font-size: 26rpx;
					}
				}

				.detail-company-r-name {
					color: #333333;
					font-size: 28rpx;
				}
			}
		}

		.detail-title {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 104rpx;

			text {
				color: #999999;
				font-size: 28rpx;
				margin: 0 24rpx;
			}

			view {
				width: 40rpx;
				height: 0rpx;
				border: 2rpx solid #999999;
			}
		}

		.detail-list {
			height: calc(100vh - 88rpx - var(--status-bar-height) - 158rpx - 20rpx - 104rpx - 98rpx);
			width: 100%;

			.list-y {
				display: flex;
				align-items: center;
				margin-bottom: 40rpx;

				.list-y-select {
					flex-shrink: 0;

					image {
						width: 36rpx;
						height: 36rpx;
					}

					margin-right: 24rpx;
				}

				.list-y-r {
					display: flex;
					align-items: center;

					image {
						width: 136rpx;
						height: 136rpx;
						margin-right: 20rpx;
						flex-shrink: 0;
					}

					.list-y-r-content {
						height: 136rpx;
						display: flex;
						flex-direction: column;

						.list-y-r-content-y {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 10rpx;
							width: calc(100vw - 276rpx);

							text {
								color: #333333;
								font-weight: bold;
								font-size: 28rpx;
								overflow:hidden;
								text-overflow: ellipsis;//显示省略号
								display:-webkit-box;
								-webkit-line-clamp:1;//块元素显示的文本行数
								-webkit-box-orient:vertical;
							}

							view {
								width: 128rpx;
								height: 40rpx;
								line-height: 40rpx;
								border-radius: 20rpx;
								background-color: #FCEDED;
								text-align: center;
								color: #B80201;
								font-size: 24rpx;
							}
						}

						.list-y-r-content-e {
							color: #666666;
							font-size: 24rpx;
							margin-bottom: 20rpx;
						}

						.list-y-r-content-s {
							font-size: 28rpx;
							font-weight: 800;
							color: #B80201;

							text {
								font-size: 22rpx;
								font-weight: 400;
							}
						}
					}
				}
			}
		}

		.detail-btn {
			width: 100%;
			height: 98rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.detail-btn-l {
				display: flex;
				align-items: center;

				image {
					width: 36rpx;
					height: 36rpx;
				}

				text {
					color: #000000;
					font-size: 28rpx;
					margin-left: 16rpx;
				}
			}

			.detail-btn-r {
				display: flex;
				align-items: center;

				.count {
					font-size: 28rpx;
					color: #333333;
				}

				.btn {
					width: 204rpx;
					height: 88rpx;
					border-radius: 48rpx;
					line-height: 88rpx;
					text-align: center;
					background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
					color: #FFFFFF;
					font-size: 32rpx;
					margin-left: 32rpx;
				}
			}
		}
	}
</style>
