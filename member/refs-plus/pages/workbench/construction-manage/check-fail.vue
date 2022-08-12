<template>
	<view class="check-fail">
		<u-navbar :title-bold="true" title="验收问卷" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="xian">

		</view>
		<view class="center">
			<view class="check-fail-y">
				<view class="title">
					本次创建时间(默认当前)
				</view>
				<view class="set-input" @click="showTime('nowTime')">
					<input type="text" placeholder="请选择创建时间" v-model="nowTime" :disabled="true">
					<image src="/static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="check-fail-y">
				<view class="title">
					设置下次创建时间(默认当前)
				</view>
				<view class="set-input" @click="showTime('nextTime')">
					<input type="text" placeholder="请选择创建时间" v-model="nextTime" :disabled="true">
					<image src="/static/image/mine/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
		<view class="btn">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timeShow: false,
				nowTime: '',
				nextTime: '',
				currentName: '',
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false
				},
			}
		},
		onLoad() {
			this.nowTime=this.dateFormat(new Date().toISOString())
			this.nextTime=this.dateFormat(new Date().toISOString())
		},
		methods: {
			showTime(name){
				this.currentName=name
				this.timeShow=true
			},
			//获取当前时间
			dateFormat(time) {
				let date = new Date(time);
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				return year + "-" + month + "-" + day
				// return year + "-" + month + "-" + day;
			},
			selectTime(e) {
				let isNow = this.dateTimeStr(e)
				if (isNow) {
					this[this.currentName] = e.year + '-' + e.month + '-' + e.day
				} else {
					this.$Toast('请选择大于等于当前时间')
				}
			},
			//对比当前时间
			dateTimeStr(str) {
				var date = new Date(),
					year = date.getFullYear(), //年
					month = date.getMonth() + 1, //月
					day = date.getDate(), //日
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
					minute = date.getMinutes() < 10 ? date.getMinutes() : date.getMinutes(), //分
					second = date.getSeconds() < 10 ? date.getSeconds() : date.getSeconds(); //秒
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				hour >= 0 && hour <= 9 ? hour : "";
				minute >= 0 && minute <= 9 ? (minute = "0" + minute) : "";
				second >= 0 && second <= 9 ? (second = "0" + second) : "";
				if (str.year > year) {
					return true
				} else if (str.year == year) {
					if (str.month > month) {
						return true
					} else if (str.month == month) {
						if (str.day >= day) {
							return true
						} else {
							return false
						}
					} else {
						return false
					}
				} else {
					return false
				}
			},
		}
	}
</script>

<style scoped lang="less">
	.check-fail {
		.btn{
			width: 100%;
			height: 96rpx;
			padding: 0 75rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			text{
				display: inline-block;
				width: 100%;
				height: 88rpx;
				background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
				border-radius: 44rpx;
				text-align: center;
				line-height: 88rpx;
				color: #fff;
				font-size: 32rpx;
			}
		}
		.xian {
			width: 100%;
			height: 20rpx;
			background-color: #F6F6F6;
		}

		.center {
			padding: 32rpx 30rpx 96rpx 30rpx;
		}

		.check-fail-y {
			margin-bottom: 80rpx;

			.title {
				color: #333333;
				font-size: 30rpx;
				font-weight: bold;
				margin-bottom: 16rpx;
			}

			.set-input {
				width: 100%;
				height: 88rpx;
				background-color: #F5F5F5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;

				input {
					color: #333333;
					font-size: 30rpx;
				}

				image {
					width: 12rpx;
					height: 22rpx;
				}
			}
		}
	}
</style>
