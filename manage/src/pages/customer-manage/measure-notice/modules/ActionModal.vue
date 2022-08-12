<template>
  <a-modal
    title="测量通知"
    :width="1200"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="0">
        <a-col :span="8" style="padding-right: 10px; border-right: 3px solid #EFEFEF;">
          <list-pages
            ref="listPage"
            class="modal-table"
            @resetParams="resetSearchForm"
            request-type="GET"
            :columns="columns"
            :request-url="requestUrl"
            :show-search="false"
            :query-params="queryParam"
            :pagination="{simple: true}"
            :customRow="leftCustomRow"
            :loadAfterRender="afterLoad">
            <template slot="supplyName" slot-scope="text">
              <ellipsis tooltip :length="24">{{ text }}</ellipsis>
            </template>
          </list-pages>
        </a-col>
        <a-col :span="16">
          <list-pages
            ref="listPage2"
            class="modal-table"
            @resetParams="resetSearchForm2"
            :columns="columns2"
            :data="loadData"
            :show-search="false"
            :createdLoadData="false"
            :query-params="queryParam2"
            :scroll="{ x: 1200, y: 360 }"
            :rowSelection="{ fixed: true, columnWidth: 40, selectedRowKeys: selectedRowKeys, onChange: onChange, onSelect: onSelect, onSelectAll: onSelectAll}">
            <template slot="$operate" >
              <a-button type="primary" v-if="selectedRows.length" icon="edit" @click="handleApply" >发送测量通知</a-button>
              <a-alert style="margin-bottom: 16px">
                <template slot="message">
                  <span style="margin-right: 12px">已选择: <a style="font-weight: 500">{{ selectedRows.length }}</a></span>
                  <span style="margin-right: 12px"><a style="font-weight: 500" @click="handleClear">清空</a></span>
                </template>
              </a-alert>
            </template>
            <span slot="action" slot-scope="text, record">
              <template>
                <a-popconfirm title="是否要设置为不测量？" @confirm="handleMeasure(record)">
                  <a>转不测量</a>
                </a-popconfirm>
              </template>
            </span>
          </list-pages>
        </a-col>
      </a-row>
    </a-spin>
    <measuring-notice ref="MeasuringNotice" @ok="handleOk"></measuring-notice>
  </a-modal>
</template>

<script>

import ListPages from '@/components/ListPages'
import Ellipsis from '@/components/Ellipsis/Ellipsis'
import MeasuringNotice from '@/pages/customer-manage/measure-notice/modules/MeasuringNotice'
import labels from '@/utils/labels'
import { defaultErrorMessage } from '@/utils/common'

export default {
  components:{
    ListPages,
    Ellipsis,
    MeasuringNotice,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      queryParam:{},
      queryParam2:{},
      requestUrl:this.$api.basicData.supplyInfo.getListPage,
      selectedRowKeys:[],
      selectedRows: [],
      columns: [
        {
          title: '序号',
          width: 80,
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '供应商名称',
          dataIndex:'supplyName',
          align:'center',
          width: 220,
          scopedSlots: {
            customRender: 'supplyName',
            showSearch: {
              title: '供应商名称',
              type: 'input'
            }
          }
        },
      ],
      columns2: [
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
          title: '操作',
          dataIndex: 'action',
          width: 160,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      customerId: '',
      leftAlignId:'',
    }
  },
  methods: {
    show(record) {
      this.visible = true
      this.customerId = record.id
      this.selectedRowKeys= []
      this.selectedRows= []
      this.$refs.listPage && this.$refs.listPage.refresh(true)
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    resetSearchForm2 () {
      this.queryParam2 = {
        supplyId: this.queryParam2.supplyId,
        customerId: this.queryParam2.customerId
      }
    },
    loadData (parameter) {
      if (!this.queryParam2.supplyId) {
        return Promise.resolve({
          rows: [],
          total: 0
        })
      }
      return this.$get({
        url: this.$api.basicData.materialInfo.getListPage,
        params: { ...parameter, ...this.queryParam2 }
      })
    },
    afterLoad (res) {
      const parentMenu = [
        {
          id: null,
          // supplyName: res.rows.supplyName,
          key: 'menuTop',
          children: res.rows.map((item) => {
            item.children = []
            return item
          })
        }
      ]
      this.list = parentMenu
      if (res && res.rows && res.rows.length) {
        this.queryParam2.supplyId = res.rows[0].id
        this.$nextTick(() => {
          this.$refs.listPage2.refresh()
        })
      }
      return res
    },
    leftCustomRow(record){
      return {
        style: {
          'color': record.id === this.leftAlignId ? '#ffffff' : '',
          'background-color': record.id === this.leftAlignId ? '#b80201' : ''
        },
        on: { // 事件
          click: (event) => {
            this.leftAlignId = record.id

            this.queryParam2.supplyId = record.id
            this.$nextTick(() => {
              this.$refs.listPage2.refresh(true)
              this.handleClear()
            })
          },
        },
        class: { 'select-row': this.queryParam2.supplyId === record.id }
      }
    },
    handleClear () {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onChange(ids, record) {
      this.selectedRowKeys = ids
    },
    onSelect (record, selected) {
      if (selected) {
        this.selectedRows.push({ ...record })
      } else {
        this.selectedRows.splice(this.selectedRows.findIndex(m => m.id === record.id), 1)
      }
    },
    onSelectAll (selected, selectedRows, changeRows) {
      if (selected) {
        changeRows.forEach(record => {
          this.selectedRows.push({ ...record })
        })
      } else {
        changeRows.forEach(record => {
          this.selectedRows.splice(this.selectedRows.findIndex(m => m.id === record.id), 1)
        })
      }
    },
    handleApply () {
      this.$refs.MeasuringNotice.show(this.selectedRows,this.queryParam2.supplyId,this.customerId)
    },
    handleMeasure(record) {
      this.confirmLoading = true

      this.$post({
        url: this.$api.customInfo.measureNotifyInfo.notMeasure,
        data: [record.id]
      }).then(res => {
        this.$refs.listPage2.refresh()
        this.$notification.success({
          message:labels.OPERATE_SUCCESS,
          description: res?.message || ''
        })
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
      .finally(()=> { this.confirmLoading = false})
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
    handleOk() {
      this.$refs.listPage2.refresh()
    },
  },
}
</script>

<style lang="scss" scoped>
  ::v-deep .modal-table {
    .ant-table-thead > tr > th {
      padding: 8px;
    }
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
  ::v-deep .ant-table-title {
    padding: 0;
  }
  ::v-deep .table-back {
    background-color: #E5785F;
  }
</style>