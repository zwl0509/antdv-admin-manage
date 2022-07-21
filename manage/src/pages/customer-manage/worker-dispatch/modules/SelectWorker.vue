<template>
  <a-modal
    :visible="visible"
    :width="800"
    title="选择工人"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage2"
        @resetParams="resetSearchForm"
        :show-search="false"
        :request-url="requestUrl"
        :loadAfterRender="afterLoad"
        :columns="columns"
        :rowSelection="{ fixed: false, columnWidth: 40, type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :query-params="searchParams"
        :scroll="{ y: 360 }"
      >
      </list-page>
    </a-spin>
  </a-modal>
</template>

<script>
  import ListPage from '@/components/ListPage'
  export default {
     components: {
      ListPage
    },
    name: 'SelectWorker',
    data () {
      return {
        modal_type: 0,
        visible: false,
        loading: false,
        queryParam: {
        },
        requestUrl: this.$api.basicData.worker.getListPage,
        // 表头
        columns:[
          {
            title: '序号',
            width: 120,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '工人名称',
            dataIndex:'workerName',
          },
          {
            title: '机构名称',
            dataIndex:'workerOrgName',
          },
        ],
        dataList: [],
        selectedRowKeys:[],
        selectedRows: [],
      }
    },
    methods: {
      add () {
        this.visible = true
        this.$refs.listPage && this.refresh()
      },
      edit (workerId) {
        this.visible = true
        this.selectedRowKeys = workerId
        this.$refs.listPage && this.refresh()
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      afterLoad (res) {
        this.dataList = res.rows || []
        return res
      },
      handleSubmit () {
        const list = []
        this.dataList.forEach(item=>{
          this.selectedRowKeys.forEach(info=>{
            if (item.id === info){
              list.push(item)
            }
          })
        })
        const workerId = []
        const workerName = []
        list.forEach(item=>{
          workerId.push(item.id)
          workerName.push(item.workerName)
        })
        const data = {
          workerId: workerId,
          workerName: workerName,
        }
        this.$emit('getWorker',data)
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      searchParams () {
        return { ...this.queryParam }
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