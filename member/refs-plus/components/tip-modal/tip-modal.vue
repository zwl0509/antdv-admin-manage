<template>
	<view class="tip-modal">
		<u-popup custom-class="demo-popup" mode="center" v-model="visible" :noBgColor="true" :maskCloseAble="false" :borderRadius="16">
			<view class="popup-content">
				<view class="modal-content">
					<view class="title">{{title}}</view>
					<view class="con">
						<text>{{message}}</text>
						<slot></slot>
					</view>
				</view>
				<view class="btns">
					<view class="btn-item cancel" @click="hideModal">
						<text>{{cancelText}}</text>
					</view>
					<view class="btn-item pay" @click="confirm">
						<text>{{confirmText}}</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			message: String,
			title: String,
			cancelText: {
				type: String,
				default: '取消'
			},
			confirmText: {
				type: String,
				default: '确认'
			}
		},
		data() {
			return {
				visible: false
			};
		},
		methods: {
			hideModal() {
				this.visible = false;
				this.$emit('cancel')
			},
			confirm() {
				this.$emit('confirm')
			}
		}
	}
</script>

<style scoped lang="scss">
	.tip-modal {
		/deep/ .s-popup-visible {
			z-index: 1000 !important;
		}

		.popup-content {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
			border-radius: 20rpx;
		}

		.modal-content {
			width: 590rpx;
			padding: 30rpx;
			border-radius: 20rpx;

			.title {
				text-align: center;
				font-size: 36rpx;
				font-weight: bold;
				color: #131E34;
			}

			.con {
				display: flex;
				justify-content: center;
				font-size: 26rpx;
				margin: 30rpx 0 40rpx 0;
			}
		}

		.btns {
			height: 90rpx;
			padding: 0 30rpx 50rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.btn-item {
				width: 216rpx;
				height: 80rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 34rpx;
				font-weight: 500;
			}

			.cancel {
				background: #F5F5F5;
				color: #333333;
			}

			.pay {
				background: linear-gradient(90deg, #FF7373 0%, #E53E3D 100%);;
				color: #FFFFFF;
			}
		}

	}
</style>
