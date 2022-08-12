<template>
  <view class="category-commodity-item">
    <view class="commodity-category-anchor" :id="anchorId">
      <slot name="itemTitle">
        {{title}}
      </slot>
    </view>
    <slot></slot>
  </view>
</template>
<script>
  export default {
    props: {
      anchorId: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="scss">
  .category-commodity-item {
    .commodity-category-anchor {
      font-size: 28rpx;
      color: #666;
      padding: 0 30rpx 0 20rpx;
      box-sizing: border-box;
      word-break: break-all;
    }
  }
</style>
