<template>
  <a-modal
    :visible="visible"
    :width="1200"
    title="辅材申报"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
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
            <template slot="$operate">
              <a-alert style="margin-bottom: 16px">
                <template slot="message">
                  <span style="margin-right: 12px">已选择: <a style="font-weight: 500">{{ selectedRows.length }}</a></span>
                  <span style="margin-right: 12px"><a style="font-weight: 500" @click="() => {selectedRowKeys = [],selectedRows = []}">清空</a></span>
                </template>
              </a-alert>
            </template>
            <span slot="materialName" slot-scope="text">
              <ellipsis :length="26" tooltip>{{ text }}</ellipsis>
            </span>
          </list-pages>
        </a-col>
      </a-row>
    </a-spin>
    <!-- 已选材料 -->
    <material-info ref="MaterialInfo" @ok="handleOk"></material-info>
  </a-modal>
</template>

<script>
  import STree from '@/components/MyTree'
  import ListPages from '@/components/ListPages'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { deepClone } from '@/utils/util'
  import MaterialInfo from './MaterialInfo'
  export default {
    name: 'MaterialSelect',
    components: {
      MaterialInfo,
      STree,
      ListPages,
      Ellipsis,
    },
    data () {
      return {
        visible: false,
        loading: false,
        tabIndex: 0,
        // 查询参数
        queryParam: {
        },
        requestUrl: this.$api.materialDeclare.auxiliaryMaterialsInfo.getMaterialClassList,
        columns: [
          {
            title: '序号',
            width: 60,
            align:'center',
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '分类名称',
            dataIndex:'materialClassName',
            align:'center',
            width: 220,
            scopedSlots: {
              customRender: 'materialClassName',
              showSearch: {
                title: '分类名称',
                type: 'input'
              }
            }
          },
        ],
        // 查询参数
        queryParam2: {
        },
        requestUrl2: this.$api.basicData.materialInfo.getListPage,
        // 表头2
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
            title: '所属工种',
            dataIndex: 'workerType',
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
        status:'',
        type:''
      }
    },
    methods: {
      show (stockId,customerId,type) {
        console.log(type)
        this.type = type
        this.customerId = customerId
        this.queryParam.stockId = stockId
        this.visible = true
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage && this.refresh()
      },
      afterLoad (res) {
        if (res && res.rows && res.rows.length) {
          this.queryParam2.materialClassId = res.rows[0].id
          this.$nextTick(() => {
            this.$refs.listPage2.refresh()
          })
        }
        return res
      },
      loadData (parameter) {
        if (!this.queryParam2.materialClassId) {
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
      leftCustomRow(record){
        return {
          on: { // 事件
            click: (event) => {
              this.queryParam2.materialClassId = record.id
              this.$nextTick(() => {
                this.$refs.listPage2.refresh(true)
              })
            }
          },
          class: { 'select-row': this.queryParam2.materialClassId === record.id }
        }
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
        this.queryParam = {}
      },
      resetSearchForm2 () {
        this.queryParam2 = {
          stockId: this.queryParam2.stockId,
          materialClassId: this.queryParam2.materialClassId,
          customerId: this.queryParam2.customerId
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
          if (this.type === 'edit'){
            this.$emit('getMaterialInfo',data)
            this.handleCancel()
          }else {
            this.$refs.MaterialInfo.add(data,this.customerId)
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