
<template>
	<view class="container">
 
		<view class="sigh-btns">
			<button class="btn" @tap="handleCancel">取消</button>
			<button class="btn" @tap="handleReset">重写</button>
			<button class="btn" @tap="handleConfirm">确认</button>
		</view>
		<view class="sign-box">
			<canvas class="mycanvas" canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove"
				@touchend="touchend"></canvas>
		</view>
	</view>
 
 
 
</template>
<script>
	var x = 20;
	var y = 20;
	var tempPoint = []; //用来存放当前画纸上的轨迹点，用来判断当前是否签名了
	var id = 0;
	var type = '';
	let that;
	export default {
		data() {
			return {
				ctx: '', //绘图图像
				points: [] //路径点集合
			};
		},
		mounted() {},
 
		onLoad(option) {
			 that = this;
			console.log(option)
			id = option.id;
			type = option.type;
			this.ctx = uni.createCanvasContext("mycanvas", this); //创建绘图对象
			//设置画笔样式
			this.ctx.lineWidth = 4;
			this.ctx.lineCap = "round"
			this.ctx.lineJoin = "round"
	
		},
 
		methods: {
			//触摸开始，获取到起点
			touchstart: function(e) {
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {
					X: startX,
					Y: startY
				};
 
				/* **************************************************
				    #由于uni对canvas的实现有所不同，这里需要把起点存起来
				 * **************************************************/
				this.points.push(startPoint);
 
				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},
 
			//触摸移动，获取到路径点
			touchmove: function(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {
					X: moveX,
					Y: moveY
				};
				this.points.push(movePoint); //存点
				let len = this.points.length;
				if (len >= 2) {
					this.draw(); //绘制路径
				}
				tempPoint.push(movePoint);
			},
 
			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend: function() {
				this.points = [];
				
			},
 
			/* ***********************************************
			#   绘制笔迹
			#   1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#   2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#   3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw: function() {
				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X, point1.Y)
				this.ctx.lineTo(point2.X, point2.Y)
				this.ctx.stroke()
				this.ctx.draw(true)
				
			},
			
			handleCancel(){
				uni.navigateBack({
					delta: 1
				});
			},
 
			//清空画布
			handleReset: function() {
				
				uni.getSystemInfo({
					success: function(res) {
						let canvasw = res.windowWidth;
						let canvash = res.windowHeight;
						that.ctx.clearRect(0, 0, canvasw, canvash);
						that.ctx.draw(true);
					},
				})
				tempPoint = [];
			},
 
			//将签名笔迹存到本地
			handleConfirm: function() {
				if (tempPoint.length == 0) {
					uni.showToast({
						title: '请先签名',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						let tempPath = res.tempFilePath;
						
                        //这里主要是根据实际需求要将笔迹旋转一定角度，再保存下来
						uni.compressImage({
						  src: tempPath,
						  quality: 100,
						  rotate:270,
						  success: function(result) {
						   
						  }
						})
						
						
					}
				})
			}
		}
	};
</script>
 
<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: row;
	}
 
	.sign-box {
		width: 80%;
		height: 90%;
		margin: auto;
	}
 
	.sign-view {
		height: 100%;
	}
 
	.sigh-btns {
		height: 100%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
 
	.btn {
		margin: auto;
		padding: 8rpx;
		transform: rotate(90deg);
		border: grey 1rpx solid;
	}
 
	.mycanvas {
		height: 100%;
		background-color: #ECECEC;
	}
</style>