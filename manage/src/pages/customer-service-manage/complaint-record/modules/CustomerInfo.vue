<template>
  <a-modal
    :visible="visible"
    :width="1000"
    title="选择客户"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        :showOperateButton="false"
        request-type="GET"
        rowKey="customerId"
        :columns="columns"
        :request-url="requestUrl"
        :query-params="searchParams"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :scroll="{ y: 360 }"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="客户名称">
              <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="手机号">
              <a-input type="number" v-model="queryParam.mobileNumber" autocomplete="off" placeholder="请输入手机号" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="详细地址">
              <a-input v-model="queryParam.finalAddress" autocomplete="off" placeholder="请输入详细地址" :max-length="30"/>
            </a-form-item>
          </a-col>
        </template>
        <span slot="ellipsis" slot-scope="text">
          <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
        </span>
      </list-page>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'CustomerInfo',
    components: {
      ListPage,
      Ellipsis
    },
    data () {
      return {
        visible: false,
        loading: false,
        // 查询参数
        queryParam: {
        },
        requestUrl: this.$api.customerServiceInfo.getCustomerList,
        // 表头
        columns:[
          {
            title: '序号',
            width: 80,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '客户名称',
            width: 100,
            dataIndex:'customerName',
          },
          {
            title: '详细地址',
            align:'center',
            dataIndex: 'finalAddress',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '电话',
            align:'center',
            width: 140,
            dataIndex: 'mobileNumber'
          },
          {
            title: '门店',
            align:'center',
            width: 120,
            dataIndex: 'storeName'
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
      }
    },
    methods: {
      show () {
        this.visible = true
        this.$refs.listPage && this.refresh()
      },
      searchParams () {
        return { ...this.queryParam }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      customRow (r) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [r.customerId]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': false }
        }

      },
      handleSubmit () {
        const data = {
          customerId: this.selectedRows[0].customerId,
          customerName: this.selectedRows[0].customerName,
          finalAddress: this.selectedRows[0].finalAddress
        }
        this.handleCancel()
        this.$emit('getCustomer',data)
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      resetSearchForm () {
        this.queryParam = {
        }
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .ant-table-thead > tr > th {
    padding: 10px;
  }

  ::v-deep .ant-table-tbody > tr > td {
    padding: 10px;
  }
</style>