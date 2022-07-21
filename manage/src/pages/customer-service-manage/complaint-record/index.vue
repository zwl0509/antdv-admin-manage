<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :query-params="searchParams"
      :scroll="{x: 3600}">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="设计师">
            <a-input v-model="queryParam.designer" autocomplete="off" placeholder="请输入设计师" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="设计经理">
            <a-input v-model="queryParam.designManager" autocomplete="off" placeholder="请输入设计经理" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="详细地址">
            <a-input v-model="queryParam.finalAddress" autocomplete="off" placeholder="请输入详细地址" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="门店名称">
            <a-input v-model="queryParam.storeName" autocomplete="off" placeholder="请输入门店名称" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add(queryParam.type)">新建</a-button>
        <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
          <a-tab-pane v-for="(item, index) in stateList" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
        </a-tabs>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text ? '是' : '否' }}</span>
      </template>
      <span slot="isShow" slot-scope="text">{{ text || '-' }}</span>
      <template slot="customerName" slot-scope="text">
        <ellipsis tooltip :length="20">{{ text }}</ellipsis>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="!value">
          <a @click="$refs.createModal.edit(record,'edit','1071-10')">编辑</a>
          <a-divider type="vertical"/>
          <a @click="$refs.DispatchOrder.edit(record,'edit')">派单</a>
        </template>
        <template v-else>
          <a @click="$refs.createModal.edit(record,'detail')">详情</a>
          <a-divider type="vertical"/>
          <a @click="$refs.History.show(record)">历史记录</a>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" :codeType="codeType" @getCodeList="getCodeList" @ok="handleOk"/>
    <dispatch-order ref="DispatchOrder" @ok="handleOk"></dispatch-order>
    <history ref="History" @ok="handleOk"></history>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import { deepClone } from '@/utils/util'
  import DispatchOrder from '@/pages/customer-service-manage/complaint-record/modules/DispatchOrder'
  import History from '@/pages/customer-service-manage/complaint-record/modules/History'


  export default {
    name: 'TableList',
    components: {
      History,
      DispatchOrder,
      ListPage,
      ActionModal,
      Ellipsis
    },
    data () {
      return {
        loading: false,
        // requestUrl: ,
        requestUrl: this.$api.customerServiceInfo.getListPage,
        options: {},
        selectedRowKeys: [],
        selectedRows: [],
        // 查询参数
        queryParam: {
          type:'1079-10',
          isCompleted: false
        },
        value: 0,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '客户名称',
            dataIndex: 'customerName',
            scopedSlots: {
              customRender: 'customerName'
            }
          },
          {
            title: '地址',
            dataIndex: 'finalAddress',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '门店',
            dataIndex: 'storeName'
          },
          {
            title: '项目经理',
            dataIndex: 'name'
          },
          {
            title: '设计师',
            dataIndex: 'designer',
          },
          {
            title: '设计部经理',
            dataIndex: 'designManager',
          },
          {
            title: '软装设计师',
            dataIndex: 'name3',
          },
          {
            title: '宅配设计师',
            dataIndex: 'name4',
          },
          {
            title: '品管',
            dataIndex: 'name5',
          },
          {
            title: '市场部',
            dataIndex: 'text',
          },
          {
            title: '决算主材部分',
            dataIndex: 'text1',
          },
          {
            title: '实际开工日期',
            dataIndex: 'dataTime1',
          },
          {
            title: '实际竣工日期',
            dataIndex: 'dataTime2',
          },
          {
            title: '保修截止日期',
            dataIndex: 'dataTime3',
          },
          {
            title: '投诉时间',
            dataIndex: 'recordTime',
          },
          {
            title: '投诉内容',
            dataIndex: 'recordContent',
          },
          {
            title: '投诉来源',
            dataIndex: 'recordSourceName',
          },
          {
            title: '备注',
            dataIndex: 'remark',
            scopedSlots: { customRender: 'ellipsis'}

          },
          // {
          //   title: '状态',
          //   key:1,
          //   dataIndex: 'boolean12',
          //   scopedSlots: {customRender: 'switch'}
          // },
          {
            title: '操作',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
        isCompleted :true,
        stateList:[
          {name: '未完成',key: 0},
          {name: '已完成',key: 1}
        ],
        codeType:{
          complaintType:[],
          complaintSource:[],
        }
      }
    },
    created () {
      // this.$store.dispatch('GetActionAuth').then(res => {
      //   const arr = []
      //   res.forEach(item => {
      //     arr.push(item.key)
      //   })
      //   this.actionAuth = arr
      // })
      this.isCompleted = false
    },
    methods: {
      changeTabs(value) {
        this.value = value
        // if (value === 0){
        //   this.isCompleted = false
        // }else {
        //   this.isCompleted = true
        // }
        this.handleOk()
        this.$forceUpdate()
      },
      searchParams () {
        if(this.queryParam) {
          this.queryParam.type='1071-10'
          this.queryParam.isCompleted = !this.value ? 'false': 'true'
        }
        return this.queryParam
      },
      getCodeList() {
        const params = {
          typeList: ['1071','1051','1044']
        }
        this.$getCodesList(params, res => {
          this.codeType.serviceType = res['1071'] || [] // 客服类型
          this.codeType.complaintType = res['1051'] || [] // 投诉类别
          this.codeType.complaintSource = res['1044'] || [] // 投诉来源
        })
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {

        }
      },
    },
    activated() {
      this.$refs.listPage && this.$refs.listPage.updateSelect([],[])
      this.handleOk()
    }
  }
</script>