<template>
  <div>
    <div style="margin-bottom: 20px;">
      <a-button :disabled="type == 'detail'" type="primary" style="margin-left: 10px;" icon="plus" @click="handleAdd">新增</a-button>
    </div>
    <a-table
      :rowKey="r => (r.id || r.key)"
      :pagination="false"
      :columns="columns"
      :data-source="dataList"
      :expandedRowKeys.sync="expandedRowKeys"
      :locale="locale"
      :scroll="{x :'max-content'}"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <template slot="handlers" slot-scope="text, record">
        <a-select
          style="width: 160px"
          mode="multiple"
          allowClear
          showArrow
          show-search
          :disabled="type == 'detail'"
          v-model="record.handlers"
          placeholder="请选择关联处理人"
          :filterOption="filterOption"
          @change="updateShowTable">
          <a-select-option v-for="item in stockManagerList" :value="item.id" :key="item.id">
            {{ item.realName }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="reminders" slot-scope="text, record">
        <a-select
          style="width: 160px"
          mode="multiple"
          allowClear
          showArrow
          show-search
          :disabled="type == 'detail'"
          v-model="record.reminders"
          placeholder="请选择抄送人"
          :filterOption="filterOption"
          @change="updateShowTable">
          <a-select-option v-for="item in stockManagerList1" :value="item.id" :key="item.id">
            {{ item.realName }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="handlerId" slot-scope="text, record">
        <a-select style="width: 160px" allowClear disabled v-model="record.handlerId" placeholder="请选择处理人" @change="updateShowTable">
          <a-select-option v-for="(item, index) in json.type2" :key="index" :value="item.value">{{ item.name }}</a-select-option>
        </a-select>
      </template>
      <template slot="dealTime" slot-scope="text, record">
        <a-date-picker disabled placeholder="请选择处理时间" v-model="record.dealTime" @change="updateShowTable"></a-date-picker>
      </template>
      <!-- <template slot="complaint1" slot-scope="text, record">
        <a-textarea :disabled="type == 'detail'" auto-size v-model="record.complaint1" @change="updateShowTable"/>
      </template> -->
      <template slot="replayContent" slot-scope="text, record">
        <a-textarea disabled auto-size v-model="record.replayContent" placeholder="请输入处理回复内容" @change="updateShowTable"/>
      </template>
      <template slot="question" slot-scope="text, record">
        <a-textarea :disabled="type == 'detail'" auto-size v-model="record.question" placeholder="请输入关联问题" @change="updateShowTable"/>
      </template>
      <template slot="remark" slot-scope="text, record">
        <a-textarea :disabled="type == 'detail'" auto-size v-model="record.remark" placeholder="请输入备注" @change="updateShowTable"/>
      </template>
      <template slot="action" slot-scope="text, record, index">
        <a @confirm="handleSub(record, index)" v-if="type == 'edit'">驳回</a>
        <a @click="$refs.DispatchOrder.edit(record,'detail')" v-if="type === 'detail'" >详情</a>
        <a-divider type="vertical" v-if="type !== 'add'"/>
        <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record, index)">
          <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <dispatch-order ref="DispatchOrder"></dispatch-order>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import {
    dateFormatString,
    defaultErrorMessage,
    filedIsNull,
    maxLenValidator,
    numberValidator,
    zhStringLength
  } from '@/utils/common'
  import labels from '@/utils/labels'
  import moment from 'moment'
  import { v4 as uuid } from 'uuid'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import DispatchOrder from '@/pages/customer-service-manage/complaint-record/modules/DispatchOrder'
  import json from '@/pages/customer-service-manage/complaint-record/modules/mocks'
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
      title: '处理人',
      align:'center',
      width: 200,
      dataIndex: 'handlerId',
      scopedSlots: { customRender: 'handlerId' }
    },
    {
      title: '处理时间',
      align:'center',
      width: 200,
      dataIndex: 'dealTime',
      scopedSlots: { customRender: 'dealTime' }
    },
    // {
    //   title: '投诉内容',
    //   align:'center',
    //   dataIndex: 'complaint1',
    //   scopedSlots: { customRender: 'complaint1' }
    // },
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
    {
      title: '操作',
      align:'center',
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    components: { DispatchOrder },
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        json,
        dataList:[],
        columns: [],
        // 表头
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        codeList: [],
        codeType: {},
        stockManagerList:[],
        stockManagerList1:[],
        expandedRowKeys: [],
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        }
      }
    },
    methods: {
      handleAdd(){
        const key = uuid()
        const newData = {
          key,
          text:  '',
          reminders: [],
          handlers: [],
          dealTime:'',
          replayContent: '',
          question: '',
          handlerId:'',
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
          this.scroll = {x : 2500}
        }else {
          this.columns = column_A
          this.scroll = {x : 2000}
        }
        this.$forceUpdate()

      },
      getData(){
        return this.dataList
      },
      setData(info) {
        this.dataList = info
        this.getList()
        this.getList1()
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
        this.columns = []
      },
    },
  }
</script>
<style scoped lang="scss">

</style>
