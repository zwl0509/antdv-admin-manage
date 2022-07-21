<template>
  <div>
    <list-page
      ref="listPage"
      class="small-table"
      @resetParams="resetSearchForm"
      :columns="columns"
      :query-params="searchParams"
      :request-url="requestUrl"
      request-type="GET">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="业务员">
            <a-input v-model="queryParam.employeeName" autocomplete="off" placeholder="请输入业务员" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="创建日期">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="actionAuth.includes('CommissionManage.Export')" type="primary" class="download" icon="download" @click="downloadData">导出数据</a-button>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
    </list-page>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage, dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  export default {
    name: 'TableList',
    components: {
      ListPage,
      Ellipsis
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.customInfo.customerCommissionInfo.getListPage,
        // 表头
        queryParam:{},
        columns: [
          {
            title: '序号',
            width: 100,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '客户名称',
            width: 200,
            dataIndex: 'customerName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '业务员',
            dataIndex: 'employeeName'
          },
          {
            title: '所在部门',
            dataIndex: 'departmentName',
            width: 200
          },
          {
            title: '提成类型',
            dataIndex: 'commissionCodeName',
          },
          {
            title: '提成（百分比）',
            dataIndex: 'commissionPerCent',
            width: 160
          },
          {
            title: '总提成（百分比）',
            dataIndex: 'finalCommissionPerCent',
            width: 160
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
        ],
        actionAuth: []
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
        if (this.queryParam.date) {
          this.queryParam.createDateStart = moment(this.queryParam.date[0]).format('YYYY-MM-DD')
          this.queryParam.createDateEnd = moment(this.queryParam.date[1]).format('YYYY-MM-DD')
        }
        delete this.queryParam.date
        return this.queryParam
      },
      resetSearchForm () {
        this.queryParam = { }
      },
      handleSub (record) {
        console.log(record)
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      // 导出数据
      downloadData() {
        window.open(process.env.VUE_APP_API_BASE_URL + this.$api.customInfo.customerCommissionInfo.export + `?employeeName=${this.queryParam.employeeName || ''}&customerName=${this.queryParam.customerName || ''}&createDateStart=${this.queryParam.date ? moment(this.queryParam.date[0]).format('YYYY-MM-DD') : '' }&createDateEnd=${this.queryParam.date ? moment(this.queryParam.date[0]).format('YYYY-MM-DD') : '' }`, '_self')
      }
    },
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