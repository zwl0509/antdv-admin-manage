<template>
  <a-modal
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="任务信息" forceRender>
          <task-info ref="TaskInfo" :type="type" :csTaskType="csTaskType" :status="modal_type"></task-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="工单列表" forceRender @click.native="getCustomer">
          <work-order-list ref="WorkOrderList" :type="'detail'" :status="modal_type"></work-order-list>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
    <template slot="footer">
      <template v-if="modal_type === '1060-60' || modal_type === '1060-100' && taskType === '1010-30' || type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </template>
      <template v-else>
        <a-button @click="handleClose" v-if="modal_type === '1060-70'">关闭</a-button>
        <a-button @click="handleCancel">取消</a-button>
        <a-button v-if="modal_type" type="primary" @click="handleSubmit">确认</a-button>
      </template>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { checkErrors, defaultErrorMessage, filedIsNull } from '@/utils/common'
  import WorkOrderList from './WorkOrderList'
  import { Ellipsis } from '@/components'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import moment from 'moment'
  import pick from 'lodash.pick'
  import TaskInfo from './TaskInfo'
  export default {
    name:'TaskManage',
    components:{
      TaskInfo,
      WorkOrderList,
      Ellipsis
    },
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1060-60' :
            return '处理人工单待办'
          case '1060-70' :
            return '客服任务完成提醒'
          case '1060-100' :
            return '客服回访'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: '',
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        id: '',
        expandedRowKeys: [],
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        },
        value: 0,
        customerId:'',
        status:'',
        employeeRole:'',
        csTaskType:'',
        type:'',
        csTaskId:'',
        csDispatchId:'',
        taskType:'',
      }
    },
    methods: {
      show(record , type) {
        this.type = type
        this.csTaskType = record.csTaskType || ''
        this.csTaskId = record.csTaskId || ''
        this.csDispatchId = record.csDispatchId || ''
        this.id = record.id
        this.modal_type = record.applyType
        this.visible = true
        this.customerId = record.customerId || ''
        !record.isView && this.getStatus(record)
        this.getCustomer(this.customerId)
        this.getDetail(this.csTaskId,record.csRevisitContent)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.TaskInfo.getCodeList(this.codeType)
          this.$refs.WorkOrderList.getCodeList(this.codeType)
        })
      },
      getStatus(record){
        this.$get({
          url: this.$api.toDealWith.isView,
          params: { id: record.id },
          needResponse: true
        }).then(res => {
          this.$emit('ok')
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      getCustomer(customerId){
        this.$get({
          url: this.$api.customerServiceInfo.getListPage,
          params: { customerId }
        }).then(() =>{
          this.$refs.WorkOrderList.show(this.customerId)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 获取详情
      getDetail(id,csRevisitContent) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customerServiceInfo.getDetail,
          params: { id }
        }).then((res) =>{
          const data = { ...res }
          const recordType = []
          //从data里面的recordTypes做for循环，拿到type的值并赋值给recordType
          data.recordTypes.forEach(item =>{
            recordType.push(item.type)
          })
          //令recordType成为data.recordType并且传到ComplaintInfo里面
          data.recordType = recordType
          this.customerId = data.customerId
          this.taskType = data.type
          if (this.type === 'detail'){
            data.returnVisitContent = csRevisitContent
            this.$refs.TaskInfo.setData(data)
          }else {
            this.$refs.TaskInfo.setData(data)
          }
          if (this.modal_type === '1060-60'){
            const list = []
            data.dispatchInfos.forEach(item=>{
              if (item.id === this.csDispatchId){
                list.push(item)
              }
            })
            this.$refs.WorkOrderList.setData(list)
          }else {
            this.$refs.WorkOrderList.setData(data.dispatchInfos)
          }
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const values = {
          dispatchInfos: null
        }
        this.$refs.TaskInfo.getData().then((res)=>{
          values.type = res.type
          values.recordSource = res.recordSource
          values.recordTypes = res.recordTypes
          values.customerId = res.customerId
          values.recordTime = res.recordTime
          values.remark = res.remark
          values.dispatchInfos = this.$refs.WorkOrderList.getData()
          if (this.csTaskId.length){
            values.id = this.csTaskId
          }else {
            values.id = this.csDispatchId
          }
          if (this.modal_type === '1060-100'){
            values.returnVisitContent = res.returnVisitContent
            values.csComplaintRecordId = this.csTaskId
            this.revisit(values)
            this.save(values)
          }else {
            this.save(values)
          }

        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      save(values) {
        console.log(values)
        this.confirmLoading = true
        this.$post({
          url: this.$api.customerServiceInfo.edit,
          data: { ...values },
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      revisit(values) {
        this.confirmLoading = true
        const data = {
          returnVisitContent : values.returnVisitContent,
          csComplaintRecordId : this.csTaskId,
          toDealId : this.id
        }
        this.$post({
          url: this.$api.customerServiceInfo.revisit,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleClose(){
        this.confirmLoading = true
        this.$put({
          url: this.$api.customerServiceInfo.closeTask,
          params: { id: this.csTaskId },
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.activeKey = ['1']
        this.isError = false
        this.id = ''
        this.value = 0
        this.customerId = ''
        this.$refs.WorkOrderList.clearInput()
        this.$refs.TaskInfo.clearInput()
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>