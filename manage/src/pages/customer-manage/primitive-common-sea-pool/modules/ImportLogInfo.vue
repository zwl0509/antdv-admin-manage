<template>
  <!-- 导入日志信息 -->
  <a-modal
    class="import-log-info"
    :visible="visible"
    :width="1200"
    title="导入日志信息"
    :centered="true"
    :maskClosable="false"
    @cancel="handleCancel"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-page
        class="small-table"
        ref="listPage"
        :showSearch="false"
        :showOperateButton="false"
        request-type="GET"
        :columns="columns"
        :request-url="requestUrl"
        :query-params="queryParam"
        :scroll="{y: 450}"
        :bodyStyle="{padding: '0'}">
      </list-page>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import ListPage from '@/components/ListPage'
  export default {
    name: 'ImportLogInfo',
    components: {
      ListPage
    },
    data () {
      return {
        visible: false,
        loading: false,
        requestUrl: this.$api.logImportInfo.getListPage,
        queryParam: {},
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '任务名称',
            dataIndex:'taskName',
          },
          {
            title: '文件名',
            width: 120,
            dataIndex:'fileName',
          },
          {
            title: '关联人',
            width: 120,
            dataIndex:'relationName',
          },
          {
            title: '状态',
            width: 120,
            dataIndex:'statusName',
          },
          {
            title: '类型',
            dataIndex:'typeName',
          },
          {
            title: '执行时间',
            dataIndex:'execTime',
          }
        ],
      }
    },

    methods: {
      show (importType) {
        this.visible = true
        this.queryParam = {
          type : importType,
          relationId : this.$store.state.user.info.id,
        }
        this.$refs.listPage && this.$refs.listPage.refresh()
      },
      handleCancel(){
        this.visible= false
        this.loading= false
      }
    }
  }
</script>
<style lang="scss" scoped>
.import-log-info{
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
}
</style>