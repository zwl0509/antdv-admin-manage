<template>
	<view class="file">
		<u-navbar title="所有文件" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="" style="height: 88rpx;">
			
		</view>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>张颜齐先生187****5678</text>
			</view>
		</view>
		<view class="filelist">
			<view class="filelist-title">
				<text>总部回款情况</text>
				<view class="">
					已确认选材
				</view>
			</view>
			<view class="files" v-for="(val,index) in fileList" :key="index" v-show="index<=(showAll ? fileList.length : '3')">
				<image :src="val.img" mode=""></image>
				<text>{{val.name}}</text>
			</view>
			<view class="showmore" @click="showAll=!showAll">
				<image src="/static/image/mine/account/down.png" mode="" v-if="!showAll"></image>
				<image src="/static/image/workbench/customer-manage/up.png" mode="" v-else></image>
			</view>
		</view>
		<view class="huxing">
			<view class="title">
				户型图
			</view>
			<view class="imgs">
				<image src="/static/image/tab-bar/workbench-bg.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList: [{
					img: '/static/image/workbench/customer-manage/word.png',
					name: '主材配置明细20210528.doc'
				}, {
					img: '/static/image/workbench/customer-manage/word.png',
					name: '主材配置明细20210528.doc'
				}, {
					img: '/static/image/workbench/customer-manage/word.png',
					name: '主材配置明细20210528.doc'
				}, {
					img: '/static/image/workbench/customer-manage/word.png',
					name: '主材配置明细20210528.doc'
				}, {
					img: '/static/image/workbench/customer-manage/word.png',
					name: '主材配置明细20210528.doc'
				}, {
					img: '/static/image/workbench/customer-manage/word.png',
					name: '主材配置明细20210528.doc'
				}],
				showAll: false
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">

	.file {
		.userinfo {
			background-color: #FFFFFF;
			padding: 10rpx 0 12rpx 0;
			position: fixed;
			top: calc(66rpx + var(--status-bar-height));
			left: 0rpx;
			width: 100%;
			z-index: 999;
			border-bottom: 1rpx solid #F8F8FB;
			.info {
				width: 424rpx;
				height: 64rpx;
				background: #F9F9F9;
				border-radius: 36rpx;
				margin: auto;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 12rpx;
				}

				text {
					font-size: 26rpx;
					color: #666666;
					font-weight: 400;
				}
			}
		}
		.filelist{
			margin-top: 20rpx;
			padding: 0 30rpx;
			background-color: #FFFFFF;
			.filelist-title{
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #F0F0F0;
				justify-content: space-between;
				text{
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}
				view{
					padding: 4rpx 16rpx 2rpx 16rpx;
					border-radius: 4rpx;
					background-color: #E1FAFA;
					font-size: 24rpx;
					color: #0AB4B3;
				}
			}
			.files{
				height: 120rpx;
				display: flex;
				align-items: center;
				padding-left: 10rpx;
				image{
					width: 80rpx;
					height: 80rpx;
					margin-right: 16rpx;
				}
				text{
					font-size: 30rpx;
					color: #333333;
					font-weight: bold;
				}
			}
			.showmore{
				text-align: center;
				height: 64rpx;
				line-height: 64rpx;
				border-top: 1rpx solid #F0F0F0;
				image{
					width: 20rpx;
					height: 12rpx;
				}
			}
		}
		.huxing {
			background-color: #FFFFFF;
			padding: 30rpx;
			margin-top: 20rpx;
			.title {
				margin-bottom: 24rpx;
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
			}
		
			image {
				width: 222rpx;
				height: 222rpx;
				margin-right: 12rpx;
				margin-bottom: 20rpx;
			}
		
			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
		
				image {
					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
