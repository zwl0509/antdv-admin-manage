<template>
  <a-modal
    :visible="visible"
    :width="1200"
    :title="modal_title"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-pages
        ref="listPage"
        class="modal-table"
        @resetParams="resetSearchForm"
        :columns="columns"
        request-type="GET"
        :request-url="requestUrl"
        :show-search="false"
        :query-params="queryParam"
        :scroll="{ x: 1200, y: 360 }"
        :rowSelection="{ fixed: true, columnWidth: 40, selectedRowKeys: selectedRowKeys, onChange: onChange, onSelect: onSelect, onSelectAll: onSelectAll}">
        <template slot="$operate">
          <a-alert style="margin-bottom: 16px">
            <template slot="message">
              <span style="margin-right: 12px">已选择: <a style="font-weight: 500">{{ selectedRows.length }}</a></span>
              <span style="margin-right: 12px"><a style="font-weight: 500" @click="() => {selectedRowKeys = [],selectedRows = []}">清空</a></span>
            </template>
          </a-alert>
        </template>
        <span slot="materialName" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </span>
      </list-pages>
    </a-spin>
    <!-- 已选材料 -->
    <common-check ref="CommonCheck" @ok="handleOk"></common-check>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import ListPages from '@/components/ListPages'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import CommonCheck from './CommonCheck'
  import { deepClone } from '@/utils/util'
  export default {
    name: 'ActivitySelect',
    components: {
      CommonCheck,
      STree,
      ListPages,
      Ellipsis
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1087-30' :
            return '活动选材'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        visible: false,
        modal_type: '',
        loading: false,
        // 查询参数
        queryParam: {},
        requestUrl: this.$api.customInfo.chooseMaterialInfo.getPromotionMaterials,
        // 表头2
        columns: [
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
            dataIndex:'materialCode',
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
        ],
        selectedRowKeys:[],
        selectedRows: [],
        list:[],
        customerId:'',
        replaceId:'',
        record:[],
        status:''
      }
    },
    methods: {
      show (customerId,type) {
        this.customerId = customerId
        this.queryParam.customerId = customerId
        this.modal_type = type
        this.visible = true
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage && this.refresh()
      },
      edit (record,type,status) {
        this.queryParam.customerId = record.customerId
        this.status = status
        this.record = record
        this.modal_type = type
        this.visible = true
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage && this.refresh()
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
      resetSearchForm () {
        this.queryParam = {

        }
      },
      handleOk() {
        this.$emit('ok')
        this.handleCancel()
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      handleSubmit () {
        const list = this.selectedRows
        list.forEach(el=>{
          el.materialId = el.id
        })
        const data = deepClone(list)
        if(this.selectedRows?.length) {
          if (this.status){
            this.$refs.CommonCheck.edit(data,this.modal_type,this.record,this.status)
          }else {
            this.$refs.CommonCheck.show(this.queryParam,data,this.modal_type)
          }
        }else {
          this.$notification.warning({
            message: '提示',
            description: `请选择材料数据！！！`
          })
        }
      },
      handleCancel () {
        this.selectedRows = []
        this.selectedRowKeys = []
        this.visible = false
      }
    }
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
</style>