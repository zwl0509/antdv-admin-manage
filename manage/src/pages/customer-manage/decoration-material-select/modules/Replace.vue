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
        <a-button type="primary" v-if="actionAuth.includes('MaterialSelect.ManualSelect')" @click="handleClick()">手动选材</a-button>
        <a-button type="primary" v-if="actionAuth.includes('MaterialSelect.ActivitySelect')" @click="handleActive()">活动选材</a-button>
        <a-button type="primary" v-if="actionAuth.includes('MaterialSelect.MainPackageSelect')" @click="handlePacket()">主材包选材</a-button>
      </div>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!-- 选材料 -->
    <select-material ref="SelectMaterial" @ok="refresh"></select-material>
    <!-- 选材料 -->
    <package-select ref="PackageSelect" @ok="refresh"></package-select>
    <!-- 选材料 -->
    <activity-select ref="ActivitySelect" @ok="refresh"></activity-select>
  </a-modal>
</template>

<script>
  import SelectMaterial from './SelectMaterial'
  import PackageSelect from './PackageSelect'
  import ActivitySelect from './ActivitySelect'
  export default {
    name: 'Replace',
    components: { SelectMaterial,PackageSelect,ActivitySelect },
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
        actionAuth: [],
        list:[],
      }
    },
    created() {
      this.$store.dispatch('GetActionAuth').then(res => {
        const arr = []
        res.forEach(item => {
          arr.push(item.key)
        })
        this.actionAuth = arr
      })
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
        this.$refs.ActivitySelect.edit(this.list,'1087-30','edit')
      },
      handlePacket(){
        this.$refs.PackageSelect.edit(this.list,'1087-40','edit')
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