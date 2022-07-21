<template>
  <a-modal
    :visible="visible"
    :width="800"
    title="客户跟踪" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <div style="margin-bottom: 30px;">
      <a-button type="primary" class="refresh-btn" icon="reload" @click="refresh">刷新</a-button>
      <a-button type="primary" style="margin-left: 10px;" icon="plus" @click="add">新增</a-button>
      <a-button type="primary" style="margin-left: 10px;" icon="edit" @click="checkPhone">查看手机号</a-button>
    </div>
    <a-col :md="12" :sm="24">
      <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        {{ dataInfo.customerName || '暂无' }}
      </a-form-item>
    </a-col>
    <a-col :md="12" :sm="24">
      <a-form-item label="客户编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        {{ dataInfo.customerCode || '暂无' }}
      </a-form-item>
    </a-col>   
    <a-col :md="12" :sm="24">
      <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
        {{ dataInfo.fullAddress || '暂无' }}
      </a-form-item>
    </a-col>
    <a-col :md="12" :sm="24">
      <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
        {{ isShowPhone }}
      </a-form-item>
    </a-col>
    <a-table
      rowKey="id"
      ref="Table"
      :columns="columns"
      :dataSource="dataList">
      <template slot="serial" slot-scope="text,record,index">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot="action" slot-scope="text,record" >
        <a v-if="!record.parentId" @click="handeReply(record)">回复</a>
      </template>
    </a-table>
    <message-record ref="MessageRecord" @ok="refresh"></message-record>
    <a-modal 
      :visible="visibleReply" 
      title="消息回复"
      :centered="true"
      @ok="handleReplySubmit" 
      @cancel="handleReplyCancel">
      <a-textarea placeholder="请输入回复内容" autocomplete="off" v-model="replyMessage"/>
    </a-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import MessageRecord from './MessageRecord'
  import { dateFormatString ,defaultErrorMessage} from '@/utils/common'
  export default {
  components: { 
    MessageRecord 
  },
    name: 'CustomerTracking',
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
        dataInfo: {},
        form: this.$form.createForm(this),
        columns: [ 
          {
            title: '序号',
            width: 120,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '跟踪类型',
            dataIndex:'trackTypeName',
          },
          {
            title: '发送人',
            dataIndex: 'trackerName',
          },
          {
            title: '记录类型',
            dataIndex:'recordTypeName',
          },
          {
            title: '消息时间',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '跟踪记录内容',
            dataIndex:'trackContent',
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'}
          }
        ],
        id: '',
        recordParent: null,
        dataList:[],
        replyMessage: '', //回复消息
        isShowPhone: '无权查看'
      }
    },
    methods: {
      show(id) {
        this.visible = true
        this.id = id
        this.getList(id)
      },
      getList(id) {
        this.loading = true
        this.$get({
          url: this.$api.customInfo.customerTrackingInfo.getListPage,
          params: { customerId: id},
        }).then((res) => {
          this.dataInfo = res || {}
          if (res)
          this.dataList =  this.updataList(res.children.rows) || []
          console.log( this.dataInfo)
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
      add() {
        this.$refs.MessageRecord.add(this.id)
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
      handleSubmit() {
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
        this.id = ''
        this.isShowPhone = '无权查看'
      },
      refresh() {
        this.getList(this.id)
      }
    }
    
  }
</script>