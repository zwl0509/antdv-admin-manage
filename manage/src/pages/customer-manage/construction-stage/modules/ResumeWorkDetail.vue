<template>
  <a-modal
    title="查看停复工详情"
    :visible="visible"
    :width="800"
    :centered="true"
    @cancel="handleCancel">
    <a-divider v-if="info">停工信息</a-divider>
    <a-descriptions bordered :column="2" size="small" v-if="info">
      <a-descriptions-item label="停工时间">{{ info.stopDate }}</a-descriptions-item>
      <a-descriptions-item label="复工时间">{{ info.estimateStartDate }}</a-descriptions-item>
      <a-descriptions-item label="停工天数">{{ info.stopDay }}</a-descriptions-item>
      <a-descriptions-item label="停工原因" :span="2">{{ info.stopReason }}</a-descriptions-item>
      <a-descriptions-item label="停工备注" :span="2">{{ info.remark }}</a-descriptions-item>
      <a-descriptions-item label="停工照片" :span="2">
        <img v-for="(item, index) in info.attachInfos" :key="index" :src="item.path" class="imgs" @click="openImgs(item.path)">
      </a-descriptions-item>
    </a-descriptions>
    <a-divider v-if="info && info.child">复工信息</a-divider>
    <a-descriptions bordered :column="2" size="small" v-if="info && info.child">
      <a-descriptions-item label="复工时间">{{ info.child.actualStartDate }}</a-descriptions-item>
      <a-descriptions-item label="停工备注" :span="2">{{ info.child.remark }}</a-descriptions-item>
      <a-descriptions-item label="停工照片" :span="2">
      </a-descriptions-item>
    </a-descriptions>
    <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </a-modal>
</template>

<script>
  export default {
    name: 'ResumeWorkDetail',
    data() {
      return {
        visible: false,
        previewVisible: false,
        previewImage: '',
        info: null,
      }
    },
    methods: {
      show(record) {
        this.info = record
        this.visible = true
      },
      openImgs(imgs) {
        this.previewImage = imgs
        this.previewVisible = true
      },
      cancelImage() {
        this.previewVisible = false
      },
      handleCancel() {
        this.visible = false
      },
    }
  }
</script>

<style lang="scss" scoped>
.imgs {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border: 1px dashed #c9c9c9;
  object-fit: contain;
}
</style>