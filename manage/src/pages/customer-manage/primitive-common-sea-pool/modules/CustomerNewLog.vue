<template>
  <!-- 导入日志信息 -->
  <a-modal
    :visible="visible"
    :width="1200"
    title="客户新增日志"
    :centered="true"
    :maskClosable="false"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <list-page
        ref="listPage"
        :showSearch="false"
        :showOperateButton="false"
        request-type="GET"
        :columns="columns"
        :request-url="requestUrl"
        :queryParams="queryParam"
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
    name: 'CustomerNewLog',
    components: {
      ListPage
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        requestUrl: this.$api.customInfo.customerCommon.getLogList,
        queryParam: {},
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '操作人',
            dataIndex:'relationName',
          },
          {
            title: '重复地址',
            dataIndex:'repeatAddress',
          },
          {
            title: '重复手机号',
            dataIndex:'repeatPhone',
          },
          {
            title: '类型',
            dataIndex:'typeName',
          },
          {
            title: '创建时间',
            dataIndex:'createdTime',
          },
        ],
      }
    },

    methods: {
      show () {
        this.visible = true
        this.$refs.listPage && this.$refs.listPage.refresh()
      },
      handleCancel(){
        this.visible= false
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
</style>