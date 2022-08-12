<template>
  <view class="modal">
    <u-popup v-model="isAuditShow"  mode="bottom" border-radius="20" :mask-close-able="false">
      <!-- 头部 -->
      <view class="head">
        <view class="head-left" @click="handleCancel">取消</view>
        <view class="head-center">{{ modal_title || '弹出框' }}</view>
        <view class="head-right" @click="handleSubmit">确认</view>
      </view>
      <!-- 内容 -->
      <scroll-view scroll-y="true" :scroll-top="scrollViewTop">
        <view class="card">
          <view class="form-item">
            <view class="lable">审核状态</view>
            <view class="radios">
              <u-radio-group v-model="info.status" active-color="#B80201">
                <u-radio 
                  v-for="(item, index) in auditTypeList" 
                  :key="index"  
                  :name="item.value" 
                  :disabled="item.disabled">{{item.name}}</u-radio>
              </u-radio-group>
            </view>
          </view>
          <view>
            <view class="lable no-form-item">审核备注</view>
            <view class="content">
              <image src="/static/image/tab-bar/write.png" class="textarea-icon" v-if="!info.content.length"></image>
              <textarea maxlength="200" v-model="info.content" placeholder="请输入审核备注" placeholder-style="margin-left: 40rpx"  @focus="onFocus" @blur="onBlur"/>
              <view class="count">
                <text class="count-r">{{ info.content.length }}</text>
                <text class="count-g">/200</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </u-popup>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        isAuditShow: false,
        scrollViewTop: 0,
        modal_title: '',
        info: {
          content: '',
          status: '1010-20'
        },
        id: '',
        auditTypeList: [
          { name: '通过', value: '1010-20' }, 
          { name: '驳回', value: '1010-30' }
        ]
			}
		},
		methods: {
      show(id , title) {
        this.id = id
        this.modal_title = title
        this.isAuditShow = true
      },
      onFocus() {
	      this.$nextTick(()=>{
					this.scrollViewTop = 99999
				})
      },
      onBlur() {
        this.$nextTick(()=>{
					this.scrollViewTop = 0
				})
      },
      handleSubmit() {
        const data = {
          customerConstructionPlanStopId: this.id,
          ...this.info
        }
        const url = this.api.CustomerConstructionTaskInfo.shutDownAudit
        this.$post({ url, data }).then(res => {
          this.$Toast('审核成功')
          this.$emit('ok')
          this.handleCancel()
				}).catch(e=>{ console.log(e)})
      },
      handleCancel() {
        this.id = ''
        this.isAuditShow = false
        this.modal_title = ''
        this.info = {
          content: '',
          status: '1010-20'
        }
      }
		}
	}
</script>
<style>

</style>
<style lang="scss">
.modal {
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120rpx;
    font-size: 30rpx;
    border-bottom: 2rpx solid #EEE;
    padding: 0 50rpx;
    .head-left {
      color: #AAA;
    }
    .head-center {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    .head-right {
      color: #B80201;
    }
  }
  .card {
    padding: 40rpx;
    height: 100%;

    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20rpx;
      height: 100rpx;
    }
    .no-form-item {
      padding-bottom: 20rpx;
    }
    .lable {
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }
		.content {
			background-color: #F9F9F9;
			padding: 20rpx;
			border-radius: 8rpx;
			position: relative;
			.textarea-icon {
				position: absolute;
				width: 28rpx;
				height: 25rpx;
				top: 32rpx;
				left: 24rpx;
				z-index: 3;
			}
			textarea {
				height: 200rpx;
				width: 100%;
			}
			.count {
				text-align: right;
				font-size: 20rpx;
				margin-bottom: 40rpx;
				.count-r {
					color: #F43D1B;
				}

				.count-g {
					color: #B2B2B2;
				}
			}
		}
  }
}

</style>
