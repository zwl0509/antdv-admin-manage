<template>
  <!-- 派工表单or量房表单 -->
  <a-modal 
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="tabKey">
        <a-tab-pane key="1" tab="客户信息">
          <!-- 基础信息 -->
          <base-info ref="BaseInfo"></base-info>
          <!-- 其他信息 -->
          <other-info ref="OtherInfo" :type="type" :modalTitle="modal_title" :positionIds="positionIds"></other-info>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目成员" forceRender>
          <project-menber ref="ProjectMenber"></project-menber>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import BaseInfo from './BaseInfo'
  import OtherInfo from './OtherInfo'
  import ProjectMenber from './ProjectMenber'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
  components: { 
    BaseInfo, 
    ProjectMenber, 
    OtherInfo
  },
    name: 'DispatchFrom',
    data () {
      return {
        type: '',
        confirmLoading: false,
        visible: false,
        tabKey: '1',
        modal_title:'',
        workFlowNodeId: '',
        workFlowInfoId: '',
        positionIds: [] , // 岗位ID
        customerIds: [],
        formType: '', // 表单类型
      }
    },
    methods: {
      show (id, rows) {
        this.visible = true
        this.modal_title = rows.name
        this.customerIds = [id]
        this.workFlowNodeId = rows.id
        this.workFlowInfoId = rows.flowId
        this.positionIds = rows.employeePositionIds
        this.formType = rows.workFlowRelationFormCode
        this.getDetail(id, rows.id)
      },
      // 查看流程按钮记录
      detail(id,rows){
        this.visible = true
        this.type = 'detail'
        this.modal_title = rows.name
        this.formType = rows.workFlowRelationFormCode
        this.getDetail(id,rows.id)
      },
      // 获取详情
      getDetail(customerId,workFlowNodeId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerCommon.workFlowDetail,
          params: { 
            customerId,
            workFlowNodeId 
          }
        }).then((res) =>{
          const data = { ...res }
          this.$refs.BaseInfo.setData(data.customerInfo)
          this.$refs.ProjectMenber.setData(data.employees)
          this.$refs.OtherInfo.setData({ 
            isDispatch: this.formType == '1059-10' ? true : false,
            measuringRoom: this.formType == '1059-20' ? true : false
          },data.relateEmployeeInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 保存
      handleSubmit() {
        this.confirmLoading = true
        this.$refs.OtherInfo.getData().then(res=>{
          res.customerIds = this.customerIds
          res.workFlowNodeId = this.workFlowNodeId
          res.workFlowInfoId = this.workFlowInfoId
          res.isToIntentCustomer = false
          return this.save(res)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })

      },
      // 保存
      save(data) {
        this.$post({
          url: this.$api.customInfo.highSeaPoolCustomer.editCustomer,
          data,
          needResponse: true
        }).then(res => {
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
      handleCancel() {
        this.visible = false
        this.tabKey = '1'
        this.type = ''
        this.customerIds = []
        this.workFlowNodeId = ''
        this.workFlowInfoId = ''
        this.formType = ''
        this.positionIds = []
        this.$refs.OtherInfo.clearInput()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>