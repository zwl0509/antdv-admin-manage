<template>
  <a-modal
    class="to-do-action"
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="任务信息" forceRender>
          <customer-info ref="CustomerInfo" :type="type"></customer-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="工单列表" forceRender>
          <work-order-list ref="WorkOrderList" :type="type"></work-order-list>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
    <template slot="footer">
      <template v-if="type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </template>
      <template v-else>
        <a-button @click="handleCancel">取消</a-button>
        <a-button v-if="modal_type" type="primary" @click="handleSubmit">确认</a-button>
      </template>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import CustomerInfo from './CustomerInfo'
 import WorkOrderList from './WorkOrderList'
  export default {
    components: { CustomerInfo,WorkOrderList },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1060-90' :
            return '客服检修任务'
          default:
            return ''
        }
      }
    },
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    name: 'OverhaulTask',
    data () {
      return {
        type: '',
        activeKey: ['1'],
        modal_type:'',
        confirmLoading: false,
        visible: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol01: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        id: '',
        applyRelationId: '',
        stageButtonList: [],
        auditStatus: '', // 移交后走流程阶段
      }
    },
    methods: {
      show (record,type) {
        this.type = type
        this.visible = true
        this.id = record.applyId || ''
        this.csTaskId = record.csTaskId || ''
        this.auditStatus = record.auditStatus
        this.modal_type = record.applyType
        this.applyRelationId = record.applyRelationId || ''
        this.$emit('getCodeList')
        this.getDetail(this.csTaskId)
        this.customerId = record.customerId || ''
        !record.isView && this.getStatus(record)
        this.$nextTick(() => {
          this.$refs.CustomerInfo.getCustomer(record.customerId)
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
      getDetail(id){
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
          this.$refs.CustomerInfo.setData(data)
          this.$refs.WorkOrderList.setData(data.dispatchInfos)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const values = {
          dispatchInfos: null
        }
        this.$refs.CustomerInfo.getData().then((res)=>{
          values.customerId = res.customerId
          values.recordTime = res.recordTime
          values.dispatchInfos = this.$refs.WorkOrderList.getData()
          values.id = this.csTaskId
          values.type = '1071-30'
          this.save(values)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      save (values) {
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
      handleClose(){

      },
      handleOk(){
        this.handleCancel()
        this.$emit('ok')
      },
      handleCancel() {
        this.visible = false
        this.tabKey = '1'
        this.activeKey = ['1']
        this.modal_type = ''
        this.id = ''
        this.applyRelationId = ''
        this.stageButtonList = []
        this.auditStatus = ''
        this.$refs.WorkOrderList.clearInput()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .to-do-action {
    .tab-btn {
      display: inline-block;
      line-height: 3;
      overflow: hidden;
      margin-left: 20px;
    }

    .tab-apply {
      text-align: right;
    }

    ::v-deep .col-1-9 {
      .ant-form-item-label {
        width: 11.111111%;
        float: left;
        label{
          white-space: break-spaces;
        }
      }
      .ant-form-item-control-wrapper{
        width: 88.888888%;
        float: left;
      }
    }

    ::v-deep .ant-tabs-bar  {
      margin: 0;
      border-bottom: none;
    }

    ::v-deep .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
      background: #EEE;
    }

    ::v-deep .ant-tabs-nav .ant-tabs-tab-active {
      text-shadow: none;
    }

  }
</style>