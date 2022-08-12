<template>
  <!-- 选择材料类型 -->
  <a-modal
    title="选择材料类型"
    :width="300"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <div class="tips">请选择材料类型</div>
      <div class="btn">
        <a-button type="primary" @click="handleSelect" style="margin-right: 20px">常规选材</a-button>
        <a-button @click="handleSelect">材料退货</a-button>
      </div>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!-- 选择材料 -->
    <material-select ref="MaterialSelect" @ok="handleOk" @getMaterialInfo="getMaterialInfo"/>
  </a-modal>
</template>

<script>
  import MaterialSelect from './MaterialSelect'
  export default {
    name:'TipsModal',
    components:{ MaterialSelect  },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        customerId: '',
        type:'',
        ids:[]
      }
    },
    methods: {
      show(id,type) {
        this.type = type
        this.customerId = id
        this.visible = true
      },
      edit(id,type,ids) {
        this.type = type
        this.ids = ids
        this.customerId = id
        this.visible = true
      },
      handleSelect(){
        const type = this.type
        if (type === 'add'){
          this.$refs.MaterialSelect.show(this.customerId,type)
        }else {
          this.$refs.MaterialSelect.edit(this.customerId,type,this.ids)
        }
      },
      getMaterialInfo(data){
        this.$emit('getMaterialInfo',data)
        this.handleCancel()
      },
      handleOk(){
        this.$emit('ok')
        this.handleCancel()
      },
      handleCancel(){
        this.visible = false
        this.confirmLoading = false
      }
    }

  }
</script>

<style lang="scss" scoped>
  .tips{
  }
  .btn{
    padding-top: 15px;
    width: 100%;
    text-align: center;
  }
</style>