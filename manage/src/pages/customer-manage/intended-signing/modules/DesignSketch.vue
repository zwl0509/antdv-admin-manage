<template>
  <a-modal 
    title="效果图查看"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-row :gutter="16">
      <a-col :span="6" v-for="(item, index) in dataList" :key="index">
        <a-card hoverable style="margin: 10px;">
          <img slot="cover" alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
          <p>存图名称：<span>xxxxxx</span></p>
          <p>存图类型：<span>施工图</span></p>
          <p>存图日期：<span>2022-09-20</span></p>
        </a-card>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  export default {
    name: 'DesignSketch',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        id: '',
        dataList: [{},{},{},{}],
      }
    },
    methods: {
      show() {
        this.visible = true
      },
      handleSubmit() {
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
      },
    }
    
  }
</script>

<style lang="scss" scoped>
</style>