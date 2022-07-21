<template>
  <!-- 施工合同表单 -->
  <a-modal
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="客户基本信息" forceRender>
          <a-tabs v-model="tabKey">
            <a-tab-pane key="1" tab="客户信息">
              <base-info ref="BaseInfo"></base-info>
            </a-tab-pane>
            <a-tab-pane key="2" tab="项目成员" forceRender>
              <project-menber ref="ProjectMenber"></project-menber>
            </a-tab-pane>
          </a-tabs>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="施工合同信息" forceRender>
          <construction-contract-info ref="ConstructionContractInfo" :type="type"></construction-contract-info>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
    <template slot="footer">
      <div v-if="type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import BaseInfo from '../../agreement-common-sea-pool/modules/BaseInfo'
  import ProjectMenber from '../../agreement-common-sea-pool/modules/ProjectMenber'
  import ConstructionContractInfo from './ConstructionContractInfo'
  export default {
    components: { BaseInfo, ProjectMenber, ConstructionContractInfo},
    name: 'DesignContract',
    data () {
      return {
        modal_title:'',
        confirmLoading: false,
        visible: false,
        tabKey: '1',
        activeKey:['1'],
        customerId: '',
        workFlowNodeId: '',
        workFlowInfoId: '',
        type: '',
        status:''
      }
    },
    methods: {
      show (record, rows, status) {
        this.modal_title = rows.name
        this.visible = true
        this.status = status
        this.customerId = record.id
        this.constructionContractId = record.constructionContractId
        this.type = 'add'
        this.workFlowNodeId = rows.id
        this.workFlowInfoId = rows.flowId
        this.getDetail(record.id,rows.id)
        this.getContract(record.constructionContractId)
      },
      detail(id, rows) {
        this.visible = true
        this.type = 'detail'
        this.modal_title = rows.name
        this.getDetail(id,rows.id)
      },
      getContract(constructionContractId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.contractInfo.getContractDetail,
          params: {
            constructionContractId
          }
        }).then((res)=>{
          const data = { ...res }
          this.$refs.ConstructionContractInfo.setData(data)
        })
      },
      // 获取详情
      getDetail(customerId,workFlowNodeId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerCommon.workFlowDetail,
          params: {
            customerId,
            workFlowNodeId,
          }
        }).then((res) =>{
          const data = { ...res }
          this.$refs.BaseInfo.setData(data.customerInfo)
          this.$refs.ProjectMenber.setData(data.employees)
          this.$refs.ConstructionContractInfo.setData(data.buildContractInfo, data.id)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        this.$refs.ConstructionContractInfo.getData().then(res =>{
          res.customerId = this.customerId
          res.workFlowNodeId = this.workFlowNodeId
          res.workFlowInfoId = this.workFlowInfoId
          if (this.status === '1033-70'){
            res.constructionContractId = null
          }else if (this.status === '1033-80'){
            res.id = this.constructionContractId
          }
          if (this.constructionContractId){
            res.type = '1081-20'
          }else {
            res.type = '1081-10'
          }
          return this.save(res)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 保存
      save(data) {
        console.log(data)
        this.$post({
          url:  this.$api.customInfo.contractInfo.customerBuildContractInfo,
          data,
          needResponse: true
        }).then(res => {
          this.$emit('ok')
          this.handleCancel()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
      },
      // 执行客户流程
      executionFlow() {
        const data = {
          customerId: this.customerId,
          workFlowInfoId: this.workFlowInfoId,
          workFlowNodeId: this.workFlowNodeId
        }
        this.$post({
          url: this.$api.workFlowTypeInfo.customerUpdateWorkFlowNode,
          data,
          needResponse: true
        }).then(res => {
          this.$emit('ok')
          this.handleCancel()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
      },
      handleCancel() {
        this.visible = false
        this.tabKey = '1'
        this.activeKey = ['1']
        this.customerId = ''
        this.workFlowNodeId = ''
        this.workFlowInfoId = ''
        this.type = ''
        this.$refs.ConstructionContractInfo.clearInput()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>