<template>
  <a-modal 
    title="整改详情"
    :width="700"
    :visible="visible"
    :centered="true"
    @cancel="handleCancel">
    <a-card v-if="info">
      <div class="left-content">标题: {{ info.title }}</div>
      <div class="left-content">描述: {{ info.content }}</div>
      <div class="left-content">处理时间: {{ info.modifiedTime }}</div>
      <div class="left-content">整改负责人: {{ info.chargePersonName }}</div>
      <div class="left-content">整改抄送人: {{ info.notifyNames }}</div>
      <div class="left-content">图片:
        <img v-for="(k_item, k_index) in info.sysAttachInfoVOS" :key="k_index" :src="k_item.path" class="imgs" @click="openImgs(k_item.path)">
      </div>
    </a-card>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </a-modal>
</template>

<script>
  export default {
    name: 'RectificationDetail',
    data() {
      return {
        visible: false,
        previewImage: '',
        previewVisible: false,
        info: null
      }
    },
    methods: {
      show (recoed) { 
        this.visible = true
        this.getDetail(recoed.rectificationId)
      },
      getDetail(id) {
        this.$post({
          url: this.$api.customInfo.acceptanceInfo.getRectificationDetail,
          data: { id },
        }).then(res=> {
          this.info = res
        })
      },
      openImgs(path){
        if(path){
          this.previewImage = path
          this.previewVisible = true
        }
      },
      cancelImage( ) {
        this.previewVisible = false
      },
      handleCancel() {
        this.visible = false
        this.info = null
      }
    },
  }
</script>

<style lang="scss" scoped>
.imgs {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  cursor: pointer;
  border: 1px dashed #c9c9c9;
  object-fit: contain;
}
.left-content {
  margin: 10px 0;
  font-size: 16px;
}
.dispatch-user {
  display: inline-block;
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  padding: 0 10px; 
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
}
</style>
</style>