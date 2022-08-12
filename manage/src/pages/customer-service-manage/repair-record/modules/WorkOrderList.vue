<template>
  <div>
    <div style="margin-bottom: 20px;">
      <a-button :disabled="type == 'detail'" type="primary" style="margin-left: 10px;" icon="plus" @click="handleAdd()">新增</a-button>
    </div>
    <a-table
      :rowKey="r => (r.id || r.key)"
      :pagination="false"
      :columns="columns"
      :data-source="dataList"
      :expandedRowKeys.sync="expandedRowKeys"
      :locale="locale"
      :scroll="{x: 'max-content'}">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <template slot="handlers" slot-scope="text, record,index">
        <a-select
          style="width: 160px"
          show-search
          :disabled="type == 'detail' || record.status === '1074-30'"
          v-model="record.handlers"
          placeholder="请选择关联处理人"
          :filterOption="filterOption"
          @dropdownVisibleChange="selectPerson(index)"
          @change="updateShowTable">
          <a-select-option v-for="item in record.handlersList" :value="item.id" :key="item.id">
            {{ item.employeeName }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="reminders" slot-scope="text, record,index">
        <a-select
          style="width: 160px"
          mode="multiple"
          allowClear
          showArrow
          show-search
          :filterOption="filterOption"
          :disabled="type == 'detail' || record.status === '1074-30'"
          v-model="record.reminders"
          placeholder="请选择抄送人"
          @dropdownVisibleChange="selectReminders(index)"
          @change="updateShowTable">
          <a-select-option v-for="item in record.remindersList" :value="item.id" :key="item.id">
            {{ item.employeeName }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="dealTime" slot-scope="text, record">
        <a-date-picker disabled placeholder="请选择处理时间" v-model="record.dealTime" @change="updateShowTable"></a-date-picker>
      </template>
      <template slot="replayContent" slot-scope="text, record">
        <a-textarea disabled auto-size v-model="record.replayContent" placeholder="请输入处理回复内容" @change="updateShowTable"/>
      </template>
      <template slot="question" slot-scope="text, record">
        <a-textarea :disabled="type == 'detail' || record.status === '1074-30'" auto-size v-model="record.question" placeholder="请输入关联问题" @change="updateShowTable"/>
      </template>
      <template slot="remark" slot-scope="text, record">
        <a-textarea :disabled="type == 'detail' || record.status === '1074-30'" auto-size v-model="record.remark" placeholder="请输入备注" @change="updateShowTable"/>
      </template>

      <template slot="action" slot-scope="text, record, index">
        <template v-if="type == 'edit' && record.status === '1074-20'">
          <a @click="handleReject(record, index)">驳回</a>
          <a-divider type="vertical"/>
        </template>
        <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record, index)" :disabled="type == 'detail'">
          <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <reminder-select ref="ReminderSelect" @getReminders="getReminders"></reminder-select>
    <handlers-select ref="HandlersSelect" @getHandlers="getHandlers" ></handlers-select>
  </div>
</template>

<script>
  import { v4 as uuid } from 'uuid'
  import { deepClone } from '@/utils/util'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import json from '@/pages/customer-service-manage/complaint-record/modules/mocks'
  import ReminderSelect from './ReminderSelect'
  import HandlersSelect from './HandlersSelect'
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  const column_A=[
    defaultTableColumns.serial,
    {
      title: '关联处理人',
      align:'center',
      width: 200,
      dataIndex: 'handlers',
      scopedSlots: { customRender: 'handlers' }
    },
    {
      title: '抄送人',
      align:'center',
      width: 200,
      dataIndex: 'reminders',
      scopedSlots: { customRender: 'reminders' }
    },
    {
      title: '关联问题',
      align:'center',
      width: 500,
      dataIndex: 'question',
      scopedSlots: { customRender: 'question' }
    },
    {
      title: '备注',
      align:'center',
      width: 500,
      dataIndex: 'remark',
      scopedSlots: { customRender: 'remark' }
    },
    {
      title: '操作',
      align:'center',
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const column_B=[
    defaultTableColumns.serial,
    {
      title: '关联处理人',
      align:'center',
      width: 200,
      dataIndex: 'handlers',
      scopedSlots: { customRender: 'handlers' }
    },
    {
      title: '抄送人',
      align:'center',
      width: 200,
      dataIndex: 'reminders',
      scopedSlots: { customRender: 'reminders' }
    },
    {
      title: '处理时间',
      align:'center',
      width: 200,
      dataIndex: 'dealTime',
      scopedSlots: { customRender: 'dealTime' }
    },
    {
      title: '处理回复内容',
      align:'center',
      width: 500,
      dataIndex: 'replayContent',
      scopedSlots: { customRender: 'replayContent' }
    },
    {
      title: '关联问题',
      align:'center',
      width: 500,
      dataIndex: 'question',
      scopedSlots: { customRender: 'question' }
    },
    {
      title: '备注',
      align:'center',
      width: 500,
      dataIndex: 'remark',
      scopedSlots: { customRender: 'remark' }
    },
    // {
    //   title: '操作',
    //   align:'center',
    //   dataIndex: 'action',
    //   width: 120,
    //   fixed: 'right',
    //   scopedSlots: { customRender: 'action' }
    // }
  ]
  export default {
    components: { HandlersSelect, ReminderSelect,Ellipsis },
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        json,
        key:0,
        dataList:[],
        columns: column_A,
        // 表头
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        customerId:'',
        codeList: [],
        codeType: {},
        handlerId: '',
        handlers:[],
        reminders: [],
        handlersList:[],
        remindersList:[],
        expandedRowKeys: [],
        tableIndex: -1,
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        }
      }
    },
    methods: {
      show(id){
        this.customerId = id
      },
      handleAdd(){
        const key = uuid()
        const newData = {
          key,
          handlerId:'',
          handlers: [],
          reminders: [],
          handlersList:[],
          question: '',
          remark: ''
        }
        // this.dataList = [...dataList,newData]
        this.dataList.unshift(newData)
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        this.getList()
        this.getList1()
      },
      updateShowTable () {
        this.$forceUpdate()
      },
      getHandlers(data){
        if (this.tableIndex !== -1 ) {
          this.dataList[this.tableIndex].handlers = data.handlers
          this.dataList[this.tableIndex].handlerId = data.handlersList[0].id
          this.dataList[this.tableIndex].handlersList = data.handlersList
        }
        this.handlers = this.dataList[this.tableIndex].handlers
        this.handlersList = this.dataList[this.tableIndex].handlersList
      },
      selectPerson(index){
        this.tableIndex = index
        const handlers = this.dataList[this.tableIndex].handlers
        const customerId = this.customerId
        if (handlers.length){
          this.$refs.HandlersSelect.edit(handlers,customerId)
        }else {
          this.$refs.HandlersSelect.add(customerId)
        }
        this.$forceUpdate()
      },
      getReminders(data){
        if (this.tableIndex !== -1 ) {
          this.dataList[this.tableIndex].reminders = data.reminders
          this.dataList[this.tableIndex].remindersList = data.remindersList
        }
        this.reminders = this.dataList[this.tableIndex].reminders
        this.remindersList = this.dataList[this.tableIndex].remindersList
      },
      selectReminders(index){
        this.tableIndex = index
        const reminders = this.dataList[this.tableIndex].reminders
        const customerId = this.customerId
        if (reminders.length){
          this.$refs.ReminderSelect.edit(reminders,customerId)
        }else {
          this.$refs.ReminderSelect.add(customerId)
        }
        this.$forceUpdate()
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      getList(){
        const params = {
          currentPage: 0,
          pageSize: 0,
        }
        this.$post({
          url: this.$api.basicData.stock.getStockManager,
          data: params,
        }).then((res) => {
          this.stockManagerList = res
        })
      },
      getList1(){
        const params = {
          currentPage: 0,
          pageSize: 0,
        }
        this.$post({
          url: this.$api.basicData.stock.getStockManager,
          data: params,
        }).then((res) => {
          this.stockManagerList1 = res
        })
      },
      // 获取code数据
      getCodeList(codeType) {

        this.codeType = codeType
        if (this.type === 'detail'){
          this.columns = column_B
        }else {
          this.columns = column_A
        }
      },
      getData(){
        return this.dataList
      },
      setData(info,id,csComplaintDispatchIds) {
        this.id = id
        const list = []
        info.forEach(item=>{
          csComplaintDispatchIds.forEach(info=>{
            if (item.id === info){
              list.push(item)
            }
          })

        })
        list.forEach(i=>{
          i.handlers.forEach(l=>{
            l.id = l.employeeId
          })
          i.handlersList =  deepClone( i.handlers)
          i.handlers = []
          i.handlersList?.forEach(k=> {
            i.handlers.push(k.id)

          })
          i.reminders.forEach(l=>{
            l.id = l.employeeId
          })
          i.remindersList =  deepClone( i.reminders)
          i.reminders = []
          i.remindersList?.forEach(k=> {
            i.reminders.push(k.id)
          })
          this.handlers = i.handlers
          this.handlersList = i.handlersList
          this.reminders = i.reminders
          this.remindersList = i.remindersList
        })
        this.dataList = deepClone(info)
        //deepClone
        this.getList()
        this.getList1()
      },
      setHistoryData(info) {
        info.forEach(i=>{
          i.handlers.forEach(l=>{
            l.id = l.employeeId
          })
          i.handlersList =  deepClone( i.handlers)
          i.handlers = []
          i.handlersList?.forEach(k=> {
            i.handlers.push(k.id)

          })
          i.reminders.forEach(l=>{
            l.id = l.employeeId
          })
          i.remindersList =  deepClone( i.reminders)
          i.reminders = []
          i.remindersList?.forEach(k=> {
            i.reminders.push(k.id)
          })
          this.handlers = i.handlers
          this.handlersList = i.handlersList
          this.reminders = i.reminders
          this.remindersList = i.remindersList
        })
        this.dataList = deepClone(info)
        this.getList()
        this.getList1()
      },
      handleReject(data){
        data.status = '1074-30'
        this.confirmLoading = true
        this.$post({
          url: this.$api.customerServiceInfo.dispatch,
          data,
          needResponse: true
        }).then((res)=>{
          this.getDispatch(this.id)
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getDispatch(id){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customerServiceInfo.getDispatch,
          params:{recordId:id},
          needResponse: true
        }).then((res)=>{
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 删除表格行数据
      handleSub (record, index){
        this.dataList.splice(index, 1)
      },
      clearInput () {
        // 重置表单数据
        this.id = ''
        this.dataList = []
        this.confirmLoading = false
        this.visible = false
        this.tableIndex = -1
      },
    },
  }
</script>
<style scoped lang="scss">
</style>
