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
              <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
            </span>
          </list-pages>
        </a-col>
      </a-row>
    </a-spin>
    <!-- 已选材料 -->
    <checked-material ref="CheckedMaterial" @ok="handleOk"></checked-material>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import ListPages from '@/components/ListPages'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import CheckedMaterial from './CheckedMaterial.vue'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import { deepClone } from '@/utils/util'
  export default {
    name: 'PackageSelect',
    components: {
      STree,
      ListPages,
      Ellipsis,
      CheckedMaterial
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1087-40' :
            return '主材包选材'
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
        requestUrl: this.$api.basicData.packageInfo.getMasterList,
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '主材包名称',
            dataIndex:'name',
            width: 220,
            scopedSlots: {
              customRender: 'name',
              showSearch: {
                title: '主材包名称',
                type: 'input'
              }
            }
          },
        ],
        // 查询参数
        queryParam2: {},
        requestUrl2: this.$api.customInfo.chooseMaterialInfo.getPackageMaterials,
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
            title: '铺装位置',
            dataIndex:'pavementName',
            width: 220,
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
        status:'',
      }
    },
    methods: {
      show (customerId,type) {
        this.queryParam2.customerId = customerId
        this.modal_type = type
        this.visible = true
        this.queryParam2.isPick = false
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage && this.refresh()
      },
      edit (record,type,status) {
        this.status = status
        this.record = record
        this.queryParam2.customerId = record.customerId
        this.modal_type = type
        this.visible = true
        this.queryParam2.isPick = true
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage && this.refresh()
      },
      afterLoad (res) {
        if (res && res.rows && res.rows.length) {
          this.queryParam2.packageId = res.rows[0].id
          this.$nextTick(() => {
            this.$refs.listPage2.refresh()
          })
        }
        return res
      },
      loadData (parameter) {
        if (!this.queryParam2.packageId) {
          return Promise.resolve({
            rows: [],
            total: 0
          })
        }
        return this.$get({
          url: this.$api.customInfo.chooseMaterialInfo.getPackageMaterials,
          params: { ...parameter, ...this.queryParam2 }
        })
      },
      leftCustomRow(record){
        return {
          on: { // 事件
            click: (event) => {
              this.queryParam2.packageId = record.id
              this.$nextTick(() => {
                this.$refs.listPage2.refresh(true)
              })
            }
          },
          class: { 'select-row': this.queryParam2.packageId === record.id }
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
          packageId: this.queryParam2.packageId,
          customerId: this.queryParam2.customerId,
          isPick:  this.queryParam2.isPick
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
        if(this.selectedRows?.length) {
          if (this.status){
            this.$refs.CheckedMaterial.edit(this.queryParam2,this.selectedRows,this.modal_type,this.record,this.status)
          }else {
            this.$refs.CheckedMaterial.show(this.queryParam2,this.selectedRows,this.modal_type)
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