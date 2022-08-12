<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      request-type="GET"
      :columns="columns"
      :request-url="requestUrl"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :query-params="searchParams"
      :scroll="{ x: 3800 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="材料类型">
            <a-select placeholder="请选择材料类型" v-model="queryParam.materialClassId">
              <a-select-option v-for="(item) in materialList" :value="item.id" :key="item.id">
                {{ item.materialClassName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="材料编码">
            <a-input v-model="queryParam.materialCode" autocomplete="off" placeholder="请输入材料编码" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="材料名称">
            <a-input v-model="queryParam.materialName" autocomplete="off" placeholder="请输入材料名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="品牌">
            <a-input v-model="queryParam.brand" autocomplete="off" placeholder="请输入品牌" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="型号">
            <a-input v-model="queryParam.materialType" autocomplete="off" placeholder="请输入型号" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" v-if="actionAuth.includes('CivilizationOutbound.apply') && selectedRowKeys.length" icon="edit" @click="handleApply" >申请</a-button>
        <a-button type="primary" v-if="actionAuth.includes('CivilizationOutbound.applyRecord')" icon="eye" @click="$refs.ApplyRecord.show()" >申请记录</a-button>
      </template>
    </list-page>
    <apply-record ref="ApplyRecord"></apply-record>
    <action-modal ref="ActionModal" @ok="handleOk"></action-modal>
  </div>
</template>

<script>

import ListPage from '@/components/ListPage'
import ApplyRecord from '@/pages/customer-manage/civilization-outbound/modules/ApplyRecord'
import ActionModal from '@/pages/customer-manage/civilization-outbound/modules/ActionModal'
import AuditModal from '@/pages/customer-manage/civilization-outbound/modules/AuditModal'
import { defaultTableColumns } from '@/components/ListPage/_utils'
import { defaultErrorMessage } from '@/utils/common'
import labels from '@/utils/labels'


const columns =  [
  defaultTableColumns.serial,
  {
    title: '材料编码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '材料名称',
    dataIndex: 'materialName',
    width: 200,
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '品牌',
    dataIndex: 'brand'
  },
  {
    title: '型号',
    dataIndex: 'materialType'
  },
  {
    title: '规格',
    dataIndex: 'spec',
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '采购价格',
    dataIndex: 'buyPrice'
  },
  {
    title: '返点比例',
    dataIndex: 'rebateProportion'
  },
  {
    title: '销售价格',
    dataIndex: 'salePrice'
  },
  {
    title: '承包价',
    dataIndex: 'contractPrice'
  },
  {
    title: '加盟价',
    dataIndex: 'joinPrice'
  },
  {
    title: '结算方式',
    dataIndex: 'clearingType'
  },
  {
    title: '特项编码',
    dataIndex: 'specialCode'
  },
  {
    title: '材料条码',
    dataIndex: 'barcode'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplyName',
    width: 200,
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '仓库名称',
    dataIndex: 'stockName',
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '库存数量',
    dataIndex: 'stockNum'
  },
  {
    title: '库存金额',
    dataIndex: 'stockMoney'
  },
  {
    title: '操作',
    dataIndex: 'action',
    // fixed: 'right',
    width: 120,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    ListPage,
    ActionModal,
    ApplyRecord
  },
  data () {
    return {
      materialList: [],
      queryParam: {
        materialClassId: '8c5a54b12c434479acbd8c4e3bcc9379'
      },
      requestUrl: this.$api.customInfo.civilizedDeliveryInfo.getMaterialsByClassId,
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
            this.selectedRows = []
          },
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          getCheckboxProps:(record)=> {
            return {
              props: {},
            }
          }
        },
      },
      selectedRowKeys: [],
      selectedRows: [],
      actionAuth: [],
      columns,
    }
  },
  created () {
    this.$store.dispatch('GetActionAuth').then(res => {
      const arr = []
      res.forEach(item => {
        arr.push(item.key)
      })
      this.actionAuth = arr
    })
    this.getMaterialList()
  },
  methods: {
    searchParams () {
      return { ...this.queryParam }
    },
    resetSearchForm () {
      this.queryParam = { materialClassId: this.materialList[0].id}
    },
    handleApply () {
      this.$refs.ActionModal.show(this.selectedRows)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getMaterialList() {
      this.$get({
        url:this.$api.customInfo.civilizedDeliveryInfo.getMaterialClassList ,
        params: {
          isActive: true,
          isCulture: true,
          currentPage: 1,
          pageSize: 1000,
        }
      }).then((res)=>{
        this.materialList = res.rows
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
        .finally(() => {this.confirmLoading = false })
    },
    handleOk () {
      // this.$refs.listPage.refresh()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>