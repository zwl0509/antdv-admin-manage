<template>
  <a-modal
    :visible="visible"
    :width="1200"
    title="申请记录"
    :centered="true"
    :maskClosable="false"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-alert v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <list-page
        ref="listPage"
        :showSearch="false"
        :showOperateButton="false"
        :columns="columns"
        :request-url="requestUrl"
        request-type="GET"
        :bodyStyle="{padding: '0'}"
        :scroll="{ y:476 }">
        <template slot="action" slot-scope="text,record">
          <template>
            <a @click="$refs.ActionModal.show(record.id)">详情</a>
          </template>
        </template>

      </list-page>

    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <action-modal ref="ActionModal"></action-modal>
  </a-modal>
</template>

<script>

import ListPage from '@/components/ListPage'
import ActionModal from '@/pages/customer-manage/civilization-outbound/modules/ActionModal'

export default {
  name: 'ApplyRecord',
  props: {
    queryParams: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    ListPage,
    ActionModal,
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      requestUrl: this.$api.customInfo.civilizedDeliveryInfo.getList,
      errorMessage: '',
      isError: false,
      // 表头
      columns: [
        {
          title: '序号',
          width: 80,
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '申请状态',
          dataIndex: 'applyStatusName',
        },
        {
          title: '申请人',
          dataIndex: 'employeeName',
        },
        {
          title: '申请编码',
          dataIndex: 'applyNo',
        },
        {
          title: '出库状态',
          dataIndex: 'deliveryStatusName',
        },
        {
          title: '申请人机构',
          dataIndex: 'employeeOrgName',
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          // fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' },
        }
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
      this.isError = false
    },
  }
}
</script>

<style lang="scss" scoped>

</style>