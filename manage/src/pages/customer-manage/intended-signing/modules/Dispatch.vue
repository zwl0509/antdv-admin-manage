<template>
  <!-- 派工人员流程 -->
  <a-modal 
    :title="modal_title"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="客户基本信息" forceRender>
          <customer-info ref="CustomerInfo" :modalTitle="modal_title" :positionIds="positionIds"></customer-info>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import CustomerInfo from './CustomerInfo'
  export default {
  components: { 
    CustomerInfo 
  },
    name: 'Dispatch',
    data () {
      return {
        modal_title: '',
        visible: false,
        confirmLoading: false,
        activeKey: ['1'],
        customerIds: [],
        workFlowNodeId: '',
        workFlowInfoId: '',
        positionIds: [] , // 岗位ID
      }
    },
    methods: {
      show(record , rows) {
        this.modal_title = rows.name
        this.customerIds = [record.id]
        this.workFlowNodeId = rows.id
        this.workFlowInfoId = rows.flowId
        this.positionIds = rows.employeePositionIds
        this.visible = true
        this.getDetail(record.id)
      },
      // 获取客户基本信息
      getDetail(customerId) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.intendedCustomInfo.getEvasionDetail,
          params: { customerId }
        }).then((res) =>{
          const data = { ...res }
          this.$refs.CustomerInfo.setData(data)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 保存
      handleSubmit() {
        this.confirmLoading = true
        const data  = this.$refs.CustomerInfo.getData()
        data.customerIds = this.customerIds
        data.workFlowNodeId = this.workFlowNodeId
        data.workFlowInfoId = this.workFlowInfoId
        data.isToIntentCustomer = false
        this.$post({
          url: this.$api.customInfo.highSeaPoolCustomer.editCustomer,
          data,
          needResponse: true
        }).then((res)=>{
          this.$emit('ok')
          this.handleCancel()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 执行客户流程
      executionFlow() {
        const data = {
          customerId: this.customerIds[0],
          workFlowInfoId: this.workFlowInfoId,
          workFlowNodeId: this.workFlowNodeId
        }
        this.$post({
          url: this.$api.workFlowTypeInfo.customerUpdateWorkFlowNode,
          data,
          needResponse: true
        }).then((res)=>{
          this.$emit('ok')
          this.handleCancel()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })

      },
      // 关闭
      handleCancel() {
        this.visible = false
        this.activeKey = ['1']
        this.customerIds = []
        this.workFlowNodeId = ''
        this.workFlowInfoId = ''
        this.positionIds = []
        this.confirmLoading = false
        this.$refs.CustomerInfo.clearInput()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>