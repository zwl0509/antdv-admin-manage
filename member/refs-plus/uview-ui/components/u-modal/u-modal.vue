<template>
	<view>
		<u-popup :zoom="zoom" mode="center" :mask-custom-style="{background:'rgba(0, 0, 0, 0.2)'}" :popup="false"
			:z-index="uZIndex" v-model="value" :length="width" :mask-close-able="maskCloseAble"
			:border-radius="borderRadius" @close="popupClose" :negative-top="negativeTop">
			<view class="u-model">
				<view v-if="showTitle" class="u-model__title u-line-1" :style="[titleStyle]">{{ title }}</view>
				<view class="" v-if="noContent" style="display: flex;align-items: center;justify-content: center;margin: 40rpx 0 10rpx 0;">
					<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022">
					</u-picker>
					<text>验收时间：</text>
					<input type="text" v-model="nowTime" placeholder="请输入验收时间" :disabled="true" @click="timeShow=true">
				</view>
				<view class="u-model__content" v-else>
					<view :style="[contentStyle]" v-if="$slots.default  || $slots.$default">
						<slot />
					</view>
					<view v-else class="u-model__content__message" :style="[contentStyle]">{{ content }}</view>
				</view>
				<view class="u-model__footer" v-if="showCancelButton || showConfirmButton">
					<view v-if="showCancelButton" :hover-stay-time="100" hover-class="u-model__btn--hover"
						class="u-model__footer__button" :style="[cancelBtnStyle]" @tap="cancel">
						{{cancelText}}
					</view>
					<view v-if="showConfirmButton || $slots['confirm-button']" :hover-stay-time="100"
						:hover-class="asyncClose ? 'none' : 'u-model__btn--hover'"
						class="u-model__footer__button hairline-left" :style="[confirmBtnStyle]" @tap="confirm">
						<slot v-if="$slots['confirm-button']" name="confirm-button"></slot>
						<block v-else>
							<u-loading mode="circle" :color="confirmColor" v-if="loading"></u-loading>
							<block v-else>
								{{confirmText}}
							</block>
						</block>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	/**
	 * modal 模态框
	 * @description 弹出模态框，常用于消息提示、消息确认、在当前页面内完成特定的交互操作
	 * @tutorial https://www.uviewui.com/components/modal.html
	 * @property {Boolean} value 是否显示模态框
	 * @property {String | Number} z-index 层级
	 * @property {String} title 模态框标题（默认"提示"）
	 * @property {String | Number} width 模态框宽度（默认600）
	 * @property {String} content 模态框内容（默认"内容"）
	 * @property {Boolean} show-title 是否显示标题（默认true）
	 * @property {Boolean} async-close 是否异步关闭，只对确定按钮有效（默认false）
	 * @property {Boolean} show-confirm-button 是否显示确认按钮（默认true）
	 * @property {Stringr | Number} negative-top modal往上偏移的值
	 * @property {Boolean} show-cancel-button 是否显示取消按钮（默认false）
	 * @property {Boolean} mask-close-able 是否允许点击遮罩关闭modal（默认false）
	 * @property {String} confirm-text 确认按钮的文字内容（默认"确认"）
	 * @property {String} cancel-text 取消按钮的文字内容（默认"取消"）
	 * @property {String} cancel-color 取消按钮的颜色（默认"#606266"）
	 * @property {String} confirm-color 确认按钮的文字内容（默认"#2979ff"）
	 * @property {String | Number} border-radius 模态框圆角值，单位rpx（默认16）
	 * @property {Object} title-style 自定义标题样式，对象形式
	 * @property {Object} content-style 自定义内容样式，对象形式
	 * @property {Object} cancel-style 自定义取消按钮样式，对象形式
	 * @property {Object} confirm-style 自定义确认按钮样式，对象形式
	 * @property {Boolean} zoom 是否开启缩放模式（默认true）
	 * @event {Function} confirm 确认按钮被点击
	 * @event {Function} cancel 取消按钮被点击
	 * @example <u-modal :src="title" :content="content"></u-modal>
	 */
	export default {
		name: 'u-modal',
		props: {
			// 是否显示Modal
			value: {
				type: Boolean,
				default: false
			},
			// 层级z-index
			zIndex: {
				type: [Number, String],
				default: ''
			},
			//输入框
			noContent: {
				type: Boolean,
				default: false
			},
			// 标题
			title: {
				type: [String],
				default: '提示'
			},
			// 弹窗宽度，可以是数值(rpx)，百分比，auto等
			width: {
				type: [Number, String],
				default: 600
			},
			// 弹窗内容
			content: {
				type: String,
				default: '内容'
			},
			// 是否显示标题
			showTitle: {
				type: Boolean,
				default: true
			},
			// 是否显示确认按钮
			showConfirmButton: {
				type: Boolean,
				default: true
			},
			// 是否显示取消按钮
			showCancelButton: {
				type: Boolean,
				default: false
			},
			// 确认文案
			confirmText: {
				type: String,
				default: '确认'
			},
			// 取消文案
			cancelText: {
				type: String,
				default: '取消'
			},
			// 确认按钮颜色
			confirmColor: {
				type: String,
				default: '#2979ff'
			},
			// 取消文字颜色
			cancelColor: {
				type: String,
				default: '#606266'
			},
			// 圆角值
			borderRadius: {
				type: [Number, String],
				default: 16
			},
			// 标题的样式
			titleStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 内容的样式
			contentStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 取消按钮的样式
			cancelStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 确定按钮的样式
			confirmStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 是否开启缩放效果
			zoom: {
				type: Boolean,
				default: true
			},
			// 是否异步关闭，只对确定按钮有效
			asyncClose: {
				type: Boolean,
				default: false
			},
			// 是否允许点击遮罩关闭modal
			maskCloseAble: {
				type: Boolean,
				default: false
			},
			// 给一个负的margin-top，往上偏移，避免和键盘重合的情况
			negativeTop: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				loading: false, // 确认按钮是否正在加载中
				nowTime: this.dateFormat(new Date().toISOString()),
				timeShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false
				},
			}
		},
		computed: {
			cancelBtnStyle() {
				return Object.assign({
					color: this.cancelColor
				}, this.cancelStyle);
			},
			confirmBtnStyle() {
				return Object.assign({
					color: this.confirmColor
				}, this.confirmStyle);
			},
			uZIndex() {
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		watch: {
			// 如果是异步关闭时，外部修改v-model的值为false时，重置内部的loading状态
			// 避免下次打开的时候，状态混乱
			value(n) {
				this.nowTime = this.dateFormat(new Date().toISOString())
				if (n === true) this.loading = false;
			}
		},
		methods: {
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
			selectTime(e) {
				let isNow = this.dateTimeStr(e)
				if (isNow) {
					this.nowTime = e.year + '-' + e.month + '-' + e.day
					this.setTime()
				} else {
					this.$Toast('请选择大于等于当前时间')
				}
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
			//返回时间
			setTime() {
				this.$emit("setTime", this.nowTime)
			},
			confirm() {
				// 异步关闭
				if (this.asyncClose) {
					this.loading = true;
				} else {
					this.$emit('input', false);
				}
				this.$emit('confirm');
			},
			cancel() {
				this.$emit('cancel');
				this.$emit('input', false);
				// 目前popup弹窗关闭有一个延时操作，此处做一个延时
				// 避免确认按钮文字变成了"确定"字样，modal还没消失，造成视觉不好的效果
				setTimeout(() => {
					this.loading = false;
				}, 300);
			},
			// 点击遮罩关闭modal，设置v-model的值为false，否则无法第二次弹起modal
			popupClose() {
				this.$emit('input', false);
			},
			// 清除加载中的状态
			clearLoading() {
				this.loading = false;
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../libs/css/style.components.scss";

	.u-model {
		height: auto;
		overflow: hidden;
		font-size: 32rpx;
		background-color: #fff;

		&__btn--hover {
			background-color: rgb(230, 230, 230);
		}

		&__title {
			padding-top: 48rpx;
			font-weight: 500;
			text-align: center;
			color: $u-main-color;
		}

		&__content {
			&__message {
				padding: 48rpx;
				font-size: 30rpx;
				text-align: center;
				color: $u-content-color;
			}
		}

		&__footer {
			@include vue-flex;

			&__button {
				flex: 1;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 32rpx;
				box-sizing: border-box;
				cursor: pointer;
				text-align: center;
				border-radius: 4rpx;
			}
		}
	}
</style>
