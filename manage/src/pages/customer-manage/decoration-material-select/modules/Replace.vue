<template>
  <a-modal
    title="选择方式"
    :visible="visible"
    :width="400"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <p style="font-size: 15px;padding-left: 12px">请选择更换方式</p>
      <div style="display: flex; justify-content: space-around">
        <a-button type="primary" @click="handleClick()">手动选材</a-button>
        <a-button type="primary" @click="handleActive()">活动选材</a-button>
        <a-button type="primary" @click="handlePacket()">主材包选材</a-button>
      </div>
    </a-spin>
    <!-- 选材料 -->
    <select-material ref="SelectMaterial" @ok="refresh"></select-material>
  </a-modal>
</template>

<script>
  import SelectMaterial from './SelectMaterial'
  export default {
    name: 'Replace',
    components: { SelectMaterial },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        customerId: '',
        list:[],
      }
    },
    methods: {
      show(record) {
        this.visible = true
        this.list = record
      },
      handleClick(){
        this.$refs.SelectMaterial.edit(this.list,'1087-20','edit')
      },
      handleActive(){
        this.$refs.SelectMaterial.edit(this.list,'1087-30','edit')
      },
      handlePacket(){
        this.$refs.SelectMaterial.edit(this.list,'1087-40','edit')
      },
      handleSubmit() {
        this.handleCancel()
      },
      refresh(){
        this.$emit('ok')
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>