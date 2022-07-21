<template>
  <a-modal
    :visible="visible"
    :width="600"
    title="选择施工模板"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <a-table
        rowKey="id"
        ref="Table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList"
        :customRow="customRow"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ y : 340}">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
  export default {
    name: 'ConstructionTemplate',
    data () {
      return {
        visible: false,
        loading: false,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            align: 'center',
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '模板名称',
            align: 'center',
            dataIndex: 'templateName'
          },
          {
            title: '最小面积',
            align: 'center',
            dataIndex: 'minArea'
          },
          {
            title: '最大面积',
            align: 'center',
            dataIndex: 'maxArea'
          },
        ],
        dataList:[],
        selectedRowKeys:[],
        selectedRows: [],
      }
    },
    computed: {},
    methods: {
      show () {
        this.visible = true
        this.$forceUpdate()
        this.getList()
      },
      show1 (id) {
        console.log(id)
        this.visible = true
        this.selectedRowKeys = id
        this.$forceUpdate()
        this.getList()
      },
      customRow (r) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [r.id]
              this.selectedRows = [r]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': false }
        }
      },
      getList(){
        this.$post({
          url:this.$api.construction.basicConstructionTemplateInfo.getListPage,
          data:{
            currentPage: 0,
            pageSize: 0
          }
        }).then(res => {
          this.dataList = res.rows || []
        })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      handleSubmit () {
        const data = this.selectedRows
        console.log(data)
        this.$emit('getMouldInfo',data)
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.loading = false
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$forceUpdate()
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .table-style {
    .ant-card-body {
      padding: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body {
      margin: 0;
    }
  }
  ::v-deep .ant-table-small .ant-table-thead th{
    background-color: #eaeaea !important;
  }
  ::v-deep .ant-table-small{
    border: none
  }
  ::v-deep .ant-table-tbody > tr.select-row td{
    background-color: $primaryColor;
    color: white;
  }
  ::v-deep .ant-table-tbody > tr.select-row:hover td,
  ::v-deep .select-row.ant-table-row-hover td{
    background-color: $primaryColor;
    color: white;
  }
  .top-select-show{
    margin-left: -8px;
  }
  ::v-deep .table-select{
    .ant-card:nth-child(2){
      margin-top: 0 !important;
      .ant-card-body{
        padding-top: 0;
      }
    }
  }
</style>
