<template>
  <a-modal
    title="发送测量通知"
    :width="1200"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-tabs v-model="tabIndex" @change="changeTabs">
      <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
    </a-tabs>
    <a-spin :spinning="confirmLoading">
      <a-table
        rowKey="id"
        ref="Table"
        :columns="columns"
        :dataSource="dataList"></a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>

import { defaultErrorMessage } from '@/utils/common'
import labels from '@/utils/labels'

const columnsX =  [
    {
      title: '序号',
      fixed: 'left',
      width: 60,
      scopedSlots: { customRender: 'serial' },
    },
    {
      title: '材料名称',
      dataIndex:'materialName',
      width: 220,
      scopedSlots: {
        customRender: 'materialName',
        showSearch: {
          title: '材料名称',
          type: 'input'
        }
      }
    },
    {
      title: '材料编码',
      dataIndex: 'materialCode',
      width: 220,
    },

    {
      title: '材料品牌',
      dataIndex: 'brand'
    },
    {
      title: '材料型号',
      dataIndex: 'materialType'
    },
    {
      title: '材料规格',
      dataIndex: 'spec',
    },
    {
      title: '材料单位',
      dataIndex: 'unit'
    },
    {
      title: '材料价格',
      dataIndex: 'salePrice',
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
  ],
  columnsY =  [
    {
      title: '序号',
      fixed: 'left',
      width: 60,
      scopedSlots: { customRender: 'serial' },
    },
    {
      title: '材料名称',
      dataIndex:'materialName',
      width: 220,
      scopedSlots: {
        customRender: 'materialName',
        showSearch: {
          title: '材料名称',
          type: 'input'
        }
      }
    },
    {
      title: '材料编码',
      dataIndex: 'materialCode',
      width: 220,
    },

    {
      title: '材料品牌',
      dataIndex: 'brand'
    },
    {
      title: '材料型号',
      dataIndex: 'materialType'
    },
    {
      title: '材料规格',
      dataIndex: 'spec',
    },
    {
      title: '材料单位',
      dataIndex: 'unit'
    },
    {
      title: '材料价格',
      dataIndex: 'salePrice',
    },
  ]

export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      isError: false,
      columns:columnsX,
      errorMessage: '获取数据失败',
      tabIndex: 0,
      tabList:[
        { name: '待通知', value:'0' },
        { name: '已通知', value:'1' },
      ],
      dataList:[],
      customerId: '',
    }
  },
  created() {
    this.getNotifiedList()
  },
  methods: {
    show (id) {
      this.customerId = id
      this.visible = true
    },
    getNotifiedList () {
      this.confirmLoading = true
      this.$get({
        url: this.$api.customInfo.measureNotifyInfo.getNotifiedList,
        params: {
          customerId: this.customerId
        }
      }).then(res => {
        this.dataList = res.rows
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
        .finally(() => {this.confirmLoading = false })
    },
    handleCancel () {
      this.visible = false
      this.isError = false
      this.confirmLoading = false
      this.tabIndex = 0
      this.changeTabs(this.tabIndex)
    },
    changeTabs (e) {
      this.columns = e ? columnsY : columnsX
    },
  },
}
</script>

<style scoped>

</style>