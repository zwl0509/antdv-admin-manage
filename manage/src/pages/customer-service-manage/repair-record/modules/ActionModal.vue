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
        <a-collapse-panel key="1" header="历史记录" forceRender @click.native="getHistory">
          <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
            <a-tab-pane v-for="(item, index) in stateList" :key="index" :tab="item.name" :value="item.id"></a-tab-pane>
          </a-tabs>
          <history-table ref="HistoryTable"></history-table>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="报修信息" forceRender>
          <repair-info ref="RepairInfo" :type="modal_type" @getCustomerId="getCustomerId"></repair-info>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="工单列表" forceRender>
          <work-order-list ref="WorkOrderList" :type="modal_type"></work-order-list>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { checkErrors, defaultErrorMessage, filedIsNull } from '@/utils/common'
  import RepairInfo from './RepairInfo'
  import WorkOrderList from '@/pages/customer-service-manage/repair-record/modules/WorkOrderList'
  import { Ellipsis } from '@/components'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import moment from 'moment'
  import HistoryTable from '@/pages/customer-service-manage/repair-record/modules/HistoryTable'
  import pick from 'lodash.pick'
  export default {
    components:{
      HistoryTable,
      RepairInfo,
      WorkOrderList,
      Ellipsis
      // BaseInfo,
      // OtherInfo,
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
          case 'add' :
            return '新增投诉记录'
          case 'edit' :
            return '编辑投诉记录'
          case 'detail' :
            return '投诉记录详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: 'add',
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
        stateList:[
          {
            name:'历史投诉信息',key: 0
          },
          {
            name:'历史报修信息',key: 1
          },
          {
            name:'历史回访信息',key: 2
          }
        ],
        value: 0,
        customerId:'',
        status:'',
      }
    },
    methods: {
      add(status) {
        this.status = status
        this.modal_type = 'add'
        this.visible = true
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.RepairInfo.getCodeList(this.codeType)
          this.$refs.WorkOrderList.getCodeList(this.codeType)
        })
      },
      edit(record , type ,status) {
        this.id = record.id
        this.status = status
        this.customerId = record.customerId
        this.modal_type = type
        this.visible = true
        this.getDetail(this.id)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.RepairInfo.getCodeList(this.codeType)
          this.$refs.WorkOrderList.getCodeList(this.codeType)
        })
        this.getHistory()
      },
      getHistory(){
        this.$get({
          url: this.$api.customerServiceInfo.getListPage,
          params: { customerId:this.customerId , type: '1071-10' }
        }).then(() =>{
          this.$refs.HistoryTable.show(this.customerId,this.value)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      changeTabs(value) {
        const id = this.customerId
        this.$refs.HistoryTable.show(id,value)
        this.value = value
        this.$forceUpdate()
      },
      getCustomerId(data){
        this.customerId = data.customerId
      },
      // 获取详情
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customerServiceInfo.getDetail,
          params: { id }
        }).then((res) =>{
          const data = { ...res }
          const recordType = []
          data.recordTypes.forEach(item=>{
            recordType.push(item.type)
          })
          data.recordType = recordType
          this.customerId = data.customerId
          this.$refs.RepairInfo.setData(data)
          this.$refs.WorkOrderList.setData(data.dispatchInfos)
          this.$refs.HistoryTable.show(this.customerId,this.value)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const values = {
          dispatchInfos: null
        }
        this.$refs.RepairInfo.getData().then((res)=>{
          values.type = '1071-20'
          values.recordSource = res.recordSource
          values.recordTypes = res.recordTypes
          values.customerId = res.customerId
          values.recordTime = res.recordTime
          values.remark = res.remark
          values.dispatchInfos = this.$refs.WorkOrderList.getData()
          return this.save(values)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      save(values) {
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
      handleCancel() {
        this.visible = false
        this.activeKey = ['1']
        this.isError = false
        this.id = ''
        this.$refs.WorkOrderList.clearInput()
        this.$refs.RepairInfo.clearInput()
        this.$refs.HistoryTable.clearInput()
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>