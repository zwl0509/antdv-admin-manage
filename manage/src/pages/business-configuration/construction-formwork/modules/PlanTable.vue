<template>
  <a-modal
    :visible="visible"
    :width="900"
    title="施工计划表"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <a-table
        class="small-table"
        rowKey="id"
        ref="Table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList"
        :rowSelection="{ fixed: false, columnWidth: 40, type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ y : 420}">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
  export default {
    name: 'PlanTable',
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
            title: '任务名称',
            align: 'center',
            dataIndex: 'taskName'
          },
          {
            title: '前置任务',
            align: 'center',
            dataIndex: 'startTaskName'
          },
          {
            title: '后置任务',
            align: 'center',
            dataIndex: 'endTaskName'
          },
          {
            title: '工期',
            align: 'center',
            dataIndex: 'duration'
          },
          {
            title: '是否关键节点',
            dataIndex: 'isRequired',
            align: 'center',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '排序值',
            align: 'center',
            dataIndex: 'sequence'
          },
        ],
        dataList:[],
        selectedRowKeys:[],
        selectedRows: [],
        taskName:'',
        duration:'',
        frontName:'',
        relationName:'',
        isRequired: false,
        sequence:'',
      }
    },
    computed: {},
    methods: {
      add () {
        this.visible = true
        this.$forceUpdate()
        this.getList()
      },
      edit (constructionTaskId) {
        this.visible = true
        this.selectedRowKeys = constructionTaskId
        this.$forceUpdate()
        this.getList()
      },
      updateShowTable () {
        this.$forceUpdate()
      },
      getList(){
        this.$post({
          url:this.$api.construction.basicConstructionTaskInfo.getListPage,
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
        const list = []
        this.dataList.forEach(item=>{
          this.selectedRowKeys.forEach(info=>{
            if (item.id === info){
              list.push(item)
            }
          })
        })
        this.$emit('getTaskInfo',list)
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
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>