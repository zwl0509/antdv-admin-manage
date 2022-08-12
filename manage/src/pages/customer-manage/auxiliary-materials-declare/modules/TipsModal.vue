<template>
  <!-- 选择仓库 -->
  <a-modal
    :visible="visible"
    :width="700"
    title="选择仓库"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-pages
        ref="listPage"
        class="small-table"
        @resetParams="resetSearchForm"
        request-type="GET"
        :columns="columns"
        :show-search="false"
        :show-operate-button="false"
        :request-url="requestUrl"
        :query-params="queryParam"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
        <template slot="customerName" slot-scope="text">
          <ellipsis tooltip :length="20">{{ text }}</ellipsis>
        </template>
      </list-pages>
    </a-spin>
    <material-select ref="MaterialSelect" @ok="handleOk" @getMaterialInfo="getMaterialInfo"></material-select>
  </a-modal>
</template>

<script>
  import ListPages from '@/components/ListPages'
  import { Ellipsis } from '@/components'
  import MaterialSelect from '@/pages/customer-manage/auxiliary-materials-declare/modules/MaterialSelect'
  export default {
    name: 'HandlersSelect',
    components: { MaterialSelect, ListPages , Ellipsis},
    data () {
      return {
        visible: false,
        loading: false,
        // 查询参数
        queryParam: {},
        requestUrl: this.$api.materialDeclare.auxiliaryMaterialsInfo.getStockList,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '仓库名称',
            dataIndex: 'stockName',
            scopedSlots: {
              customRender: 'ellipsis',
              showSearch: {
                title: '仓库名称',
                type: 'input'
              }
            }
          },
          {
            title: '仓库编码',
            dataIndex:'stockCode',
            scopedSlots: {
              showSearch: {
                title: '仓库编码',
                type: 'input'
              }
            }
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
        code:'',
        type:'',
        customerId: ''
      }
    },
    methods: {
      show (id,type) {
        this.type = type
        this.customerId = id
        this.visible = true
        this.queryParam.isLocked = false
        this.queryParam.isActive = true
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
              this.selectedRowKeys = [r.id]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': false }
        }
      },
      resetSearchForm () {
        this.queryParam = {}
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      handleSubmit () {
        const stockId = this.selectedRowKeys[0]
        const type = this.type
        this.$refs.MaterialSelect.show(stockId,this.customerId,type)
        // this.handleCancel()
      },
      getMaterialInfo(data){
        this.$emit('getMaterialInfo',data)
        this.handleCancel()
      },
      handleOk(){
        this.$emit('ok')
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$refs.listPage.refresh(true)
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