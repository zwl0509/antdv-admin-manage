<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      request-type="POST"
      :request-url="requestUrl"
      :query-params="searchParams"
      :scroll="{ x: 2000 }">
      <template slot="$search">
        <a-col :md="8" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="员工名称">
            <a-input v-model="queryParam.employeeName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <span slot="action" slot-scope="text, record">
        <a v-if="actionAuth.includes('YunhuRecord.Detail')" @click="$refs.ActionModal.show(record)">查看</a>
      </span>
    </list-page>
    <action-modal ref="ActionModal" @ok="handleOk"></action-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ActionModal from './modules/ActionModal'
  export default {
    name: 'TableList',
    components: {
      ListPage,
      ActionModal
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.customInfo.CloudCallRecord.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '客户名称',
            dataIndex: 'customerName'
          },
          {
            title: '被叫号码',
            width: 140,
            dataIndex: 'calledNbr'
          },
          {
            title: '主叫号码',
            width: 140,
            dataIndex: 'callerNbr'
          },
          {
            title: '显示号码',
            width: 140,
            dataIndex: 'displayNbr'
          },
          {
            title: '通话响应状态',
            dataIndex: 'disposition'
          },
          {
            title: '话单类型',
            dataIndex: 'serviceType'
          },
          {
            title: '员工姓名',
            dataIndex: 'employeeName'
          },
          {
            title: '分机号',
            width: 140,
            dataIndex: 'extensionNum'
          },
          {
            title: '业务号码',
            width: 140,
            dataIndex: 'serviceNbr'
          },
          {
            title: '业务号码B',
            width: 140,
            dataIndex: 'serviceNbrB'
          },
          {
            title: '通话时长(分)',
            dataIndex: 'minDuration'
          },
          {
            title: '通话时长(秒)',
            dataIndex: 'duration'
          },
          {
            title: '拨打时间',
            width: 200,
            dataIndex: 'dialTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 80,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
      }
    },
    created () {
      this.$store.dispatch('GetActionAuth').then(res => {
        const arr = []
        res.forEach(item => {
          arr.push(item.key)
        })
        this.actionAuth = arr
      })
    },
    methods: {
      searchParams () {
        return { ...this.queryParam }
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = { }
      }
    },
  }
</script>
