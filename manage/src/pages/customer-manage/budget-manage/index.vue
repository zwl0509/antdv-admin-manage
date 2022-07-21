<template>
  <div>
    <!-- 预算管理 -->
    <list-page
      ref="listPage"
      class="small-table"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :xs="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="actionAuth.includes('BudgetManage.Create')" type="primary" icon="plus" @click="$refs.ActionModal.add()">新建</a-button>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('BudgetManage.Modify')">
          <a>编辑</a>
          <a-divider type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('BudgetManage.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="ActionModal" @ok="handleOk"/>
  </div>
</template>

<script>
import moment from 'moment'
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import { defaultTableColumns } from '@/components/ListPage/_utils'

export default {
  name: 'TableList',
  components: {
    ActionModal,
    ListPage
  },
  data () {
    return {
      loading: false,
      requestUrl: this.$api.mock.getListPage,
      // 查询参数
      queryParam: {},
     
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title: '客户编码',
          dataIndex: 'code1'
        },
        {
          title: '客户名称',
          dataIndex: 'name'
        },
        {
          title: '装修地址',
          dataIndex: 'address'
        },
        {
          title: '备注',
          dataIndex: 'text1'
        },
        {
          title: '编辑人',
          dataIndex: 'modifiedBy'
        },
        {
          title: '编辑时间',
          dataIndex: 'modifiedTime',
          customRender: txt => txt && moment(txt).format(dateFormatString) || ''
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      actionAuth: [],
      typeList:[]
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
    this.$getCodeList('1058', res => {
      this.typeList = res
    })
  },
  methods: {
    searchParams(){
      return { ...this.queryParam }
    },
    handleAuth (record) {
      this.$refs.authModal.show(record.id)
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleSub (record) {
      this.$notification.warning({
        message: labels.HINT,
        description: '暂未开发'
      })
      // this.loading = true
      // this.$delete({
      //   url: this.$api.allocation.CommissionInfo.delete,
      //   params: { id: record.id },
      //   needResponse: true
      // }).then(res => {
      //   this.$notification.success({
      //     message: labels.DELETE_SUCCESS,
      //     description: res.message || ''
      //   })
      //   this.handleOk()
      // }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
      //   .finally(() => { this.loading = false })
    },
    handleOk () {
      this.$refs.listPage.refresh()
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    clearId () {
      this.targetId = null
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>
