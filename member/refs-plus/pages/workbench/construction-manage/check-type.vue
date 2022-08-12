<template>
	<view class="check-type">
		<u-navbar :title-bold="true" title="验收类型" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="type-y" v-for="(val,index) in list" :key="index" @click="go(val)">
			<view class="type-y-l">
				<image src="/static/image/workbench/construction-manage/type.png" mode=""></image>
				<text>{{val.taskName}}</text>
			</view>
			<text :class="val.status?(val.status=='1091-10' ? 'type-y-r-g':'type-y-r-r'):'type-y-r-b'">
				{{val.statusName ? val.statusName:'未验收'}}
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				list: []
			}
		},
		onLoad(options) {
			this.id = options.id
			if (options.agencyId) {
				this.toDealWithIsView(options.agencyId)
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			//待办已读
			toDealWithIsView(id) {
				this.$get({
					url: this.api.toDealWith.toDealWithIsView,
					data: {
						id: id
					}
				}).then(res => {
			
				})
			},
			go(val) {
				if (val.statusName) {
					// this.toQuestionnaire(val)
					this.toList(val)
				} else {
					this.toQuestionnaire(val)
				}
			},
			getList() {
				this.$get({
					url: this.api.CustomerConstructionTaskInfo.getCheckTypeList,
					data: {
						customerId: this.id
					}
				}).then(res => {
					this.list = res
				})
			},
			toList(val) {
				uni.navigateTo({
					url: 'check-list?id=' + val.id+'&customerId='+this.id
				})
			},
			toQuestionnaire(val) {
				uni.navigateTo({
					url: 'acceptance-questionnaire?id=' + val.surveyId + '&customerId=' + this.id +
						'&customerConstructionTaskId=' + val.id
				})
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
	.check-type {
		.type-y {
			width: 100%;
			height: 128rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			margin-top: 20rpx;
			background-color: #fff;

			.type-y-l {
				display: flex;
				align-items: center;

				image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
				}

				text {
					color: #333333;
					font-size: 30rpx;
					font-weight: bold;
				}
			}

			.type-y-r-r {
				color: #B80201;
				font-size: 28rpx;
			}

			.type-y-r-g {
				color: #0AB4B3;
				font-size: 28rpx;
			}

			.type-y-r-b {
				color: #333333;
				font-size: 28rpx;
			}
		}
	}
</style>
