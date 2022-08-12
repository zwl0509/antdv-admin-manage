<template>
	<!-- 停复工列表 -->
	<view class="resume-list">
		<u-navbar title="停复工列表" title-color='#333333' :titleBold="true" :border-bottom='false' class="navbar">
			<view slot='right' style="width: 88rpx;text-align: center;">
				<u-icon name="plus" color="#333333" size="34" @click="shutDownApply"></u-icon>
			</view>
		</u-navbar>
		<view v-for="(item, index) in list" :key="index" class="list-y">
			<image src="/static/image/workbench/construction-manage/resume.png" class="resume-icon"></image>
			<view class="list-info">
				<view class="list-info-t">
					<view class="list-info-t-l" @click="toDetail(item)">
						<view class="resume-time1">停工时间: {{ item.stopDate}}</view>
						<view class="resume-time2">停工{{ item.stopDay }}天</view>
					</view>
					<view class="list-info-t-r">
						<template v-if="!item.child">
							<text v-if="item.status == '1010-10' && isShutdownAudit" class="list-info-t-r-btn"
								@click="audit(item.id,'停工审核')">停工审核</text>
							<text v-if="item.status == '1010-10' && !isShutdownAudit"
								class="list-info-t-r-status await">停工待审核</text>
							<text v-if="item.status == '1010-20' && isResumeApply" class="list-info-t-r-btn"
								@click="apply(item)">复工申请</text>
							<text v-if="item.status == '1010-20' && !isResumeApply"
								class="list-info-t-r-status">待复工</text>
							<text v-if="item.status == '1010-30'" class="list-info-t-r-status refuse">停工驳回</text>
						</template>
						<template v-else>
							<text v-if="item.child.status == '1010-10' && isResumptionAudit" class="list-info-t-r-btn"
								@click="audit(item.child.id,'复工审核')">复工审核</text>
							<text v-if="item.child.status == '1010-10' && !isResumptionAudit">复工待审核</text>
							<text v-if="item.child.status == '1010-20'" class="list-info-t-r-status">已复工</text>
							<text v-if="item.child.status == '1010-30'" class="list-info-t-r-status refuse">复工驳回</text>
						</template>
					</view>
				</view>
				<view class="list-info-b" v-if="item.child">复工时间: {{ item.child.actualStartDate }} </view>
			</view>
		</view>
		<resume-audit ref="ResumeAudit" @ok="update"></resume-audit>
	</view>
</template>

<script>
	import ResumeAudit from './resume-audit'
	export default {
		components: {
			ResumeAudit
		},
		data() {
			return {
				customerId: '',
				isAuditShow: false,
				constructionPlanId: '',
				list: [],
				isShow: true,
				btnList: [],
				isShutdownAudit: false,
				isResumeApply: false,
				isResumptionAudit: false,
				isAdd: true
			}
		},
		onLoad(params) {
			this.customerId = params.customerId
			this.constructionPlanId = params.constructionPlanId
		},
		onShow() {
			this.getList(this.customerId)
			this.getJurisdiction()
		},
		methods: {
			//获取按钮权限
			getJurisdiction() {
				let targetIds = []
				this.listBtns = []
				this.singleBtns = []
				targetIds.push(this.vuex_user.id)
				this.vuex_user.roles.forEach(item => {
					targetIds.push(item.id)
				})
				this.$post({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: uni.getStorageSync('sitemapId'),
						targetIds: targetIds
					}
				}).then(res => {
					this.btnList = res
					this.btnList.forEach(item => {
						if (item.key.indexOf('ShutdownAudit') != -1) {
							this.isShutdownAudit = true
						}
						if (item.key.indexOf('ResumeApply') != -1) {
							this.isResumeApply = true
						}
						if (item.key.indexOf('ResumptionAudit') != -1) {
							this.isResumptionAudit = true
						}
					})
				})
			},
			// 获取停复工列表
			getList(customerId) {
				this.$post({
					url: this.api.CustomerConstructionTaskInfo.getConstructionPlanStopInfo,
					data: {
						customerId
					}
				}).then(res => {
					const data = [...res]
					this.list = data
					this.list.forEach(item => {
						if (!item.child && item.status == '1010-10') {
							this.isAdd = false
						}
					})
				}).catch(e => {
					console.log(e)
				})
			},
			// 停工申请
			shutDownApply() {
				uni.navigateTo({
					url: `./shutdown-apply?constructionPlanId=${this.constructionPlanId}`
				})
			},
			// 审核
			audit(id, title) {
				this.$refs.ResumeAudit.show(id, title)
			},
			// 申请
			apply(item) {
				uni.navigateTo({
					url: `./resume-apply?constructionPlanId=${this.constructionPlanId}&parentId=${item.id}`
				})
			},
			// 更新
			update() {
				this.getList(this.customerId)
			},
			//
			toDetail(val) {
				uni.navigateTo({
					url: './resume-detail?id=' + val.id
				})
			}
		},
	}
</script>

<style>
	page {
		background: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.list-y {
		background-color: #fff;
		margin-top: 20rpx;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 0 30rpx;

		.resume-icon {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
			padding-top: 32rpx;
		}

		.list-info {
			width: 100%;

			.list-info-t {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 32rpx 0 31rpx 0;

				.list-info-t-l {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.resume-time1 {
						margin-bottom: 10rpx;
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.resume-time2 {
						color: #B80201;
						font-size: 30rpx;
					}
				}

				.list-info-t-r {
					.list-info-t-r-btn {
						display: inline-block;
						width: 140rpx;
						height: 56rpx;
						line-height: 56rpx;
						background: #B80201;
						border-radius: 8rpx;
						text-align: center;
						font-size: 30rpx;
						color: #FFFFFF;
					}

					.list-info-t-r-status {
						color: #999999;
						font-size: 28rpx;
					}

					// 驳回
					.refuse {
						color: #B80201;
					}

					// 等待
					.await {
						color: #0AB4B3;
					}
				}
			}

			.list-info-b {
				width: 100%;
				border-top: 2rpx solid #F0F0F0;
				height: 71rpx;
				line-height: 71rpx;
				color: #999999;
				font-size: 24rpx;
			}
		}
	}
</style>
