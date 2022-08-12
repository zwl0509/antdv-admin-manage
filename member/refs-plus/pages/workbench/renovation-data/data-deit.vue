<template>
	<view class="data-edit">
		<u-navbar title="材料修改" :border='false' :titleBold='true' title-size="34" class="navbar" title-color='#333333'>
			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 30rpx;color: #B80201;padding-right: 30rpx;" @click="save">
					保存
				</view>
			</view>
		</u-navbar>
		<scroll-view scroll-y="true">
			<view class="scroll-h">
				<view class="" v-for="(val,index) in list" :key="index">
					<view class="center">
						<view class="center-y">
							<view class="center-y-l">
								<image src="/static/image/workbench/renovation-data/icon.png" mode=""></image>
								<text class="title">{{val.materialName}}</text>
							</view>
						</view>
						<view class="center-y" style="border: none;">
							<view class="center-y-l">
								<text>所属区域</text>
							</view>
							<view class="center-y-r" v-if="!isEdit" @click="isDel=!isDel">
								<image src="/static/image/workbench/renovation-data/del.png" mode="" style="width: 30rpx;height: 30rpx;"></image>
							</view>
						</view>
						<view class="areas">
							<view class="" v-for="(item,index2) in val.areaName" :key="index2">
							{{item}}
							<image  v-if="isDel" src="/static/image/workbench/renovation-data/cha.png" mode="" class="area-del" @click="delArea(val,index2)"></image>
							</view>
							<view class="area-add" @click="areaClick(index)" v-if="!isEdit">
								添加
							</view>
						</view>
					</view>
					<view class="center">
						<view class="center-y">
							<view class="center-y-l">
								<text>铺装位置</text>
							</view>
							<view class="center-y-r" @click="pavementsClick(index)">
								<input type="text" v-model="val.pavingLocation" :disabled="true" placeholder="请选择铺装位置">
								<image src="/static/image/workbench/renovation-data/right.png" mode=""></image>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>颜色</text>
							</view>
							<view class="center-y-r">
								<input type="text" placeholder="请选择颜色" :disabled="true" v-model="val.color">
								<image src="/static/image/workbench/renovation-data/right.png" mode=""></image>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>是否测量</text>
							</view>
							<view class="center-y-r">
								<view class="select" @click="val.isMeasure=true">
									<image src="/static/image/workbench/renovation-data/select.png" mode=""
										v-if="val.isMeasure"></image>
									<view class="" v-else>

									</view>
									<text :class="!val.isMeasure ? '':'select-g'">是</text>
								</view>
								<view class="select" @click="val.isMeasure=false">
									<view class="" v-if="val.isMeasure">

									</view>
									<image src="/static/image/workbench/renovation-data/select.png" mode="" v-else>
									</image>
									<text :class="!val.isMeasure ? 'select-g':''">否</text>
								</view>
							</view>
						</view>
					</view>
					<view class="center">
						<view class="center-y">
							<view class="center-y-l">
								<text>材料规格</text>
							</view>
							<view class="center-y-r">
								<text>{{val.spec}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>材料单位</text>
							</view>
							<view class="center-y-r">
								<text>{{val.unit}}</text>
							</view>
						</view>
						<!-- 						<view class="center-y">
							<view class="center-y-l">
								<text>材料标识</text>
							</view>
							<view class="center-y-r">
								<text>699材料包</text>
							</view>
						</view> -->
						<view class="center-y">
							<view class="center-y-l">
								<text>材料价格</text>
							</view>
							<view class="center-y-r">
								<text class="center-y-r-red">￥{{val.salePrice}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>品牌</text>
							</view>
							<view class="center-y-r">
								<text>{{val.brand}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>材质</text>
							</view>
							<view class="center-y-r">
								<text>{{val.texture}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>型号</text>
							</view>
							<view class="center-y-r">
								<text>{{val.materialType}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>编码</text>
							</view>
							<view class="center-y-r">
								<text>{{val.materialCode}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>类别系列</text>
							</view>
							<view class="center-y-r">
								<text>{{val.typeSerial}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>预估量</text>
							</view>
							<view class="center-y-r">
								<input type="text" placeholder="请输入" v-model="val.forecast" :disabled="isEdit">
								<!-- <image src="/static/image/workbench/renovation-data/right.png" mode=""></image> -->
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>材料金额</text>
							</view>
							<view class="center-y-r">
								<text>{{val.finalPrice}}</text>
							</view>
						</view>
						<view class="center-y">
							<view class="center-y-l">
								<text>确认状态</text>
							</view>
							<view class="center-y-r">
								<text>{{val.isConfirm ? '已确认':'未确认'}}</text>
							</view>
						</view>
						<view class="center-e">
							<view class="center-e-t">
							</view>
							<view class="center-e-b">
								<textarea v-model="val.remark" id="" cols="30" rows="10"
									placeholder="请输入备注内容"></textarea>
							</view>
						</view>
					</view>
				</view>

			</view>
		</scroll-view>
		<u-select v-model="pavementsShow" :list="pavements" @confirm="pavementsConfirm" label-name="positionName" :default-value="[list[currentIndex].pavementsIndex]"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				areaList: [], //地区列表
				pavementsShow: false,
				currentIndex: 0, //点击的index
				backIndex: 1,
				isEdit: false,
				isDel:false,
				pavements:[]
			}
		},
		onLoad(options) {
			if (options.isEdit) {
				this.isEdit = options.isEdit
			}
			if (options.backIndex) {
				this.backIndex = options.backIndex
			}
			JSON.parse(options.data).forEach(item => {
				let val = {
					id:this.isEdit ? item.id :'',
					customerId: uni.getStorageSync('customerId'),
					materialId: this.backIndex > 1 ? item.id : item.materialId,
					materialName: item.materialName,
					area: item.area ? item.area : '',
					areas: item.areas ? [item.areas] : [],
					pavementsIndex:0,
					areaName: item.areaName ? [item.areaName] : [],
					pavingLocation: item.pavingLocation ? item.pavingLocation : '',
					color: item.color,
					isMeasure: item.isMeasure,
					spec: item.spec,
					unit: item.unit,
					salePrice: item.salePrice,
					brand: item.brand,
					texture: item.texture,
					materialType: item.materialType,
					materialCode: item.materialCode,
					typeSerial: item.typeSerial,
					forecast: item.forecast ? item.forecast : '',
					finalPrice: item.salePrice,
					isConfirm: item.isConfirm,
					remark: item.remark ? item.remark : ''
				}
				this.list.push(val)
			})
			// this.list = JSON.parse(options.data)
			this.getTypeList('1086')
			this.getDetail()
		},
		methods: {
			getDetail(){
				this.$get({
					url:this.api.CustomerChooseMaterialInfo.getChooseMaterialDetail,
					data:{
						id:this.list[0].id
					}
				}).then(res=>{
					this.pavements=res.pavements
				})
			},
			//删除区域
			delArea(val,index){
				val.areas.splice(index, 1)
				val.areaName.splice(index, 1)
			},
			//保存
			save() {
				for (let i = 0; i < this.list.length; i++) {
					if (!this.list[i].areas.length&&!this.isEdit) {
						this.$Toast('请选择所属区域')
						return
					}
				}
				this.$post({
					url: this.api.CustomerChooseMaterialInfo.edit,
					data: this.list
				}).then(res => {
					uni.navigateBack({
						delta: parseInt(this.backIndex)
					})
				})
			},
			//点击铺装位置
			pavementsClick(index) {
				this.currentIndex = index
				this.pavementsShow = true
			},
			//点击铺装选择
			areaConfirm(e) {
				console.log(e)
				if(this.list[this.currentIndex].areas.indexOf(e[0].value) == -1){
					this.list[this.currentIndex].areas.push(e[0].value)
					this.list[this.currentIndex].areaName.push(e[0].label)
				}else{
					this.$Toast("选中重复")
				}
				// this.areaList.forEach((item, index) => {
				// 	if (item.value == e[0].value) {
				// 		this.list[this.currentIndex].areaIndex = index
				// 	}
				// })
			},
			pavementsConfirm(e){
				console.log(e)
				this.list[this.currentIndex].pavingLocation=e[0].label
				this.pavements.forEach((item, index) => {
					if (item.positionName == e[0].label) {
						this.list[this.currentIndex].pavementsIndex = index
					}
				})
			},
			//获取code列表
			getTypeList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					this.areaList = res.rows
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.scroll-h {
		height: calc(100vh - 88rpx - var(--status-bar-height));
	}

	.center {
		border-top: 20rpx solid #F6F6F6;
		padding: 0 30rpx;
		background-color: #fff;
		.areas{
			display: flex;
			align-items: center;
			padding-bottom: 12rpx;
			flex-wrap: wrap;
			border: none;
			view {
				background-color: #F9F9F9;
				width: 218rpx;
				height: 80rpx;
				line-height: 76rpx;
				text-align: center;
				border-radius: 8rpx;
				color: #333333;
				font-size: 24rpx;
				margin-right: 18rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				position: relative;
				&:nth-child(3n){
					margin-right: 0;
				}
			}
			.area-del{
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				top: 0;
				right: 0;
			}
			.area-add{
				background-color: #fff;
				border: 2rpx solid #B80201;
				color: #B80201;
			}
		}
		.center-y {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
			border-bottom: 2rpx solid #F6F6F6;

			.center-y-l {
				display: flex;
				align-items: center;

				image {
					width: 20rpx;
					height: 36rpx;
					margin-right: 12rpx;
				}

				text {
					color: #333333;
					font-size: 30rpx;
				}

				.title {
					font-weight: bold;
				}
			}

			.center-y-r {
				display: flex;
				align-items: center;

				.center-y-r-red {
					color: #B80201;
				}

				text {
					color: #333333;
					font-size: 30rpx;
				}

				image {
					width: 14rpx;
					height: 26rpx;
					margin-left: 14rpx;
				}

				input {
					width: 400rpx;
					color: #333333;
					font-size: 30rpx;
					text-align: right;
				}

				.select {
					display: flex;
					align-items: center;
					margin-left: 40rpx;

					text {
						color: #999999;
						font-size: 30rpx;
						margin-left: 10rpx;
					}

					view {
						height: 32rpx;
						width: 32rpx;
						border-radius: 50%;
						border: 2rpx solid #999999;
					}

					image {
						height: 32rpx;
						width: 32rpx;
						margin: 0;
					}

					.select-g {
						color: #333333;
					}
				}
			}
		}

		.center-e {
			padding-bottom: 24rpx;

			.center-e-t {
				padding: 23rpx 0 20rpx 0;
				font-size: 30rpx;
				color: #333333;
			}

			.center-e-b {
				textarea {
					box-sizing: border-box;
					width: 100%;
					height: 128rpx;
					background-color: #F9F9F9;
					border-radius: 8rpx;
					padding: 14rpx 20rpx;
					font-size: 28rpx;
					color: #333333;
				}
			}
		}
	}
</style>
