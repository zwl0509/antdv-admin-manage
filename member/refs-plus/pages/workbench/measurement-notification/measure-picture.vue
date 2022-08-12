<template>
	<view class="">
		<u-navbar :title-bold="true" title="图片" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
				  :border-bottom="false">
		</u-navbar>
		<view class="imgs">
			<image :src="val.path" mode="" v-for="(val,index) in imgs" :key="index"></image>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				index: '',
				imgs: []
			}
		},
		onLoad(options) {
			if (options.index) {
				this.index = options.index
			}
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
			this.imgs = JSON.parse(options.imgs)
		},
		methods: {
			submit() {
				this.$refs.uUpload.upload();
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
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				uni.navigateBack({})
				prevPage.$vm.surveyQuestionDTOList[this.index].attachIds = attaches;
			},
		}
	}
</script>
<style>
	page{
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.imgs {
		padding: 30rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		image {
			width: 222rpx;
			height: 222rpx;
			margin-right: 10rpx;
			&:nth-child(3n){
				margin-right: 0;
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
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
			line-height: 88rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 44rpx;

		}
	}
</style>
