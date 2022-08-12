<template>
  <!-- 停复工管理 1060-120 -->
  <a-modal
    class="stop-or-resume-work"
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  export default {
    name: 'StopOrResumeWork',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        modal_title: ''
      }
    },
    methods: {
      show () {

      },
      handleCancel() {
        
      }
    }
  }
</script>

<style lang="scss" scoped>
.stop-or-resume-work {
  background-color: #fff;
}
</style>