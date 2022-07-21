<template>
  <a-modal
    :visible="visible"
    :width="1200"
    title="客户跟踪" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <div style="margin-bottom: 30px;">
      <a-button type="primary" class="refresh-btn" icon="reload" @click="refresh">刷新</a-button>
      <a-button v-if="isBut" type="primary" style="margin-left: 10px;" icon="plus" @click="add">新增跟踪记录</a-button>
      <!-- <a-button v-if="!isBut" type="primary" style="margin-left: 10px;" icon="edit" @click="checkPhone">查看手机号</a-button> -->
    </div>
    <!-- <a-row :grabbed="48">
      <a-col :md="6" :sm="24">
        <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <ellipsis :length="20" tooltip>{{ dataInfo.customerName || '暂无' }}</ellipsis>
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span :style="{color:isShowPhone == '无权查看' ? 'red' : ''}">{{ isShowPhone }}</span>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="装修完整地址" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          {{ dataInfo.finalAddress || '暂无' }}
        </a-form-item>
      </a-col>
    </a-row> -->
    <a-tabs default-active-key="0" v-model="type_index" @change="changeTabs">
      <a-tab-pane v-for="item in type_list" :key="item.value" :tab="item.name" :value="item.value"></a-tab-pane>
    </a-tabs>
    <a-table v-if="type_index" rowKey="id" ref="Table" :columns="applyColumns" :dataSource="applyDataList" :pagination="false">
      <template slot="serial" slot-scope="text,record,index">
        <span>{{ index + 1 }}</span>
      </template>
      <!-- <template slot="action" slot-scope="text,record" >
        <a v-if="!record.parentId" @click="handeReply(record)">详情</a>
      </template> -->
    </a-table>
    <a-table v-else rowKey="id" ref="Table" :columns="columns" :dataSource="dataList" :pagination="false">
      <template slot="serial" slot-scope="text,record,index">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot="action" slot-scope="text,record" >
        <a v-if="!record.parentId" @click="$refs.MessageRecord.edit(record,'detail',type, id)">详情</a>
      </template>
    </a-table>
    <message-record ref="MessageRecord" @ok="refresh"></message-record>
    <!-- <a-modal 
      :visible="visibleReply" 
      title="消息回复"
      :centered="true"
      @ok="handleReplySubmit" 
      @cancel="handleReplyCancel">
      <a-textarea placeholder="请输入回复内容" autocomplete="off" v-model="replyMessage"/>
    </a-modal> -->
    <template slot="footer">
      <div>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import MessageRecord from './MessageRecord'
  import { Ellipsis } from '@/components'
  import { dateFormatString ,defaultErrorMessage} from '@/utils/common'
  export default {
    name: 'CustomerTracking',
    components: { 
      MessageRecord,
      Ellipsis
    },
    data () {
      return {
        visible: false,
        visibleReply: false,
        loading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        dataInfo: {},
        applyDataList: [],
        form: this.$form.createForm(this),
        columns: [ 
          {
            title: '序号',
            align: 'center',
            width: 120,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '跟踪类型',
            align: 'center',
            dataIndex:'trackTypeName',
          },
          {
            title: '跟踪人',
            align: 'center',
            dataIndex: 'employeeName',
          },
          {
            title: '记录类型',
            align: 'center',
            dataIndex:'recordTypeName',
          },
          {
            title: '跟踪记录时间',
            align: 'center',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '跟踪记录内容',
            align: 'center',
            dataIndex:'remark',
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'}
          }
        ],
        applyColumns: [
          {
            title: '序号',
            width: 120,
            align: 'center',
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '审核人',
            align: 'center',
            dataIndex:'auditorName',
          },
          {
            title: '审核状态',
            align: 'center',
            dataIndex: 'statusName',
          },
          {
            title: '审核回复',
            align: 'center',
            dataIndex:'auditContent',
          },
          {
            title: '申请人',
            align: 'center',
            dataIndex:'applicantName',
          },
          {
            title: '申请类型',
            align: 'center',
            dataIndex:'typeName',
          },
          {
            title: '申请天数',
            align: 'center',
            dataIndex: 'daysOrNum',
          },
          {
            title: '申请时间',
            align: 'center',
            dataIndex: 'applicationDate',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '申请原因',
            align: 'center',
            dataIndex:'applicationReason',
          },
          // {
          //   title: '操作',
          //   align: 'center',
          //   dataIndex: 'action',
          //   scopedSlots: {customRender: 'action'}
          // }
        ],
        type_index: 0,
        type_list: [
          { value: 0 , name: '客户跟踪记录'},
          { value: 1 , name: '客户申请记录'},
        ],
        id: '',
        recordParent: null,
        dataList:[],
        replyMessage: '', //回复消息
        isShowPhone: '',
        isBut: false,
        type: '', // 客户状态
      }
    },
    methods: {
      show(record, type, isBut) {
        this.type = type
        this.isBut = isBut
        this.isShowPhone = record.mobileNumber
        this.visible = true
        this.id = record.id
        this.getList(this.id)
        this.getApplyList(record.id)
      },
      shows(record, type, isBut) {
        this.type = type
        this.isBut = isBut
        this.isShowPhone = record.mobileNumber
        this.visible = true
        this.id = record.customerId
        this.getList(this.id)
        this.getApplyList(record.id)
      },
      // 获取跟踪记录
      getList(id) {
        this.loading = true
        this.$get({
          url: this.$api.customInfo.customerCommon.getTrackingList,
          params: { customerId: id},
        }).then((res) => {
          this.dataInfo = res || {}
          this.dataList = res && this.updataList(res.children.rows) || []
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      updataList(list){
        if(list.length){
          list.forEach((item) => {
            if (item.children.length == 0) {
              delete item.children
            } else {
              this.updataList(item.children)
            }
          })
          return list 
        }
      },
      // 获取申请记录
      getApplyList(id){
        this.$get({
          url: this.$api.customInfo.customerAuditInfo.getListPage,
          params:{ customerId:id }
        }).then((res)=>{
          const data = res.rows || []
          this.applyDataList = data
        })
      },
      add() {
        this.$refs.MessageRecord.add(this.id,this.type)
      },
      // tab 切换
      changeTabs(e) {
        e ? this.getApplyList(this.id) : this.getList(this.id)
      },
      checkPhone() {
        this.$get({
          url:this.$api.customInfo.customerTrackingInfo.getMobileNumber,
          params: { customerId: this.id },
          needResponse: true
        }).then((res) => {
          this.isShowPhone = res.message
        })
      },
      handeReply(record) {
        this.recordParent = record
        this.visibleReply = true
      },
      handleReplySubmit() {
        const data = {
          customerId: this.id,
          parentId: this.recordParent.id,
          trackContent: this.replyMessage,
          trackType: this.recordParent.trackType,
          recordType: this.recordParent.recordType
        }
        this.$post({
          url: this.$api.customInfo.customerTrackingInfo.edit,
          data,
          needResponse: true
        }).then(res=>{
            this.handleReplyCancel()
            this.refresh()
            this.$emit('ok')
            this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleReplyCancel() {
        this.visibleReply = false
        this.recordParent = null
        this.replyMessage = ''
      },
      refresh() {
        this.type_index ? this.getApplyList(this.id) : this.getList(this.id)
      },
      handleCancel() {
        this.visible = false
        this.isBut = false
        this.id = ''
        this.isShowPhone = '无权查看'
        this.type_index = 0
      },
    }
  }
</script>