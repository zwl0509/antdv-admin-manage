<template>
  <a-modal
    :title="'材料选择'"
    :width="1000"
    height="70%"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :bodyStyle="{padding: 0}"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="[0, 0]">
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            class="table-select"
            @resetParams="resetSearchForm"
            request-type="GET"
            size="small"
            :row-key="r => (r.id || r.materialId)"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bordered="false"
            disabled-active
            :createdLoadData="false"
            :scroll="{ x: 2960 }"
            :customRow="customRow"
            :rowSelection="{ fixed: true, columnWidth: 40, type: 'checkbox', selectedRowKeys: checkedRowIds, onChange: rowChange, onSelect: onSelect, onSelectAll: onSelectAll, getCheckboxProps: getCheckboxProps }"
          >
            <div slot="title" class="top-select-show">
              <!--<div style="margin-bottom: 16px">-->
              <!--  <a-button type="primary" class="refresh-btn" icon="reload" @click="$refs.listPage.refresh()">刷新</a-button>-->
              <!--</div>-->
              <span >已选：<span class="table-selected-total">{{ checkedRowIds.length ? checkedRowIds.length : '0' }}</span></span>
              <span style="margin-left: 16px" v-if="!!checkedRowIds.length"><a @click="() => {checkedRowIds = [],checkedRows = []}"> 清空</a></span>
            </div>
            <template slot="$search">
              <a-col :md="12" :sm="24">
                <a-form-item label="材料编码">
                  <a-input
                    v-model="queryParam.materialCode"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入材料编码"
                    :max-length="64"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="材料名称">
                  <a-input v-model="queryParam.materialName" autocomplete="off" placeholder="请输入材料名称" :max-length="100"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="规格">
                  <a-input v-model="queryParam.spec" autocomplete="off" placeholder="请输入规格" :max-length="100"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="是否启用">
                  <a-select placeholder="是否启用" v-model="queryParam.isActive">
                    <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template slot="ellipsis" slot-scope="text">
              <ellipsis tooltip :length="10">{{ text }}</ellipsis>
            </template>
            <template slot="ellipsis2" slot-scope="text">
              <ellipsis tooltip :length="17">{{ text }}</ellipsis>
            </template>
            <template slot="ellipsis3" slot-scope="text">
              <ellipsis tooltip :length="22">{{ text }}</ellipsis>
            </template>

            <template slot="isCheck" slot-scope="text">
              <a-icon :type="text ? 'check' : 'close'"/>
            </template>
          </list-page>
        </a-spin>
      </a-row>
    </a-spin>
    <div slot="footer">
      <a-button style="margin-bottom: 16px;" @click="handleCancel">取消</a-button>
      <template v-if="!!id">
        <a-popconfirm title="确定后将更新优惠活动的材料数据？" @confirm="handleSubmit()">
          <a-button type="primary" style="margin-bottom: 16px;">确定</a-button>
        </a-popconfirm>
      </template>
      <a-button v-else type="primary" style="margin-bottom: 16px;" @click="handleSubmit">确定</a-button>
    </div>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import STree from '@/components/MyTree'
  import ListPage from '@/components/ListPage'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator } from '@/utils/common'
  import labels from '@/utils/labels'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  export default {
    components: {
      STree,
      ListPage,
      Ellipsis
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        leftLoading: false,
        treeLoadText: undefined,
        loading: false,
        openKeys: ['key-01'],
        menuKey: '',
        menuId: null,
        menuTitle: null,
        // 查询参数
        queryParam: {
          promotionId: null
        },
        requestUrl: this.$api.basicData.materialInfo.getListPage,
        // 表头
        columns: [
          // {
          //   title: 'checkbox-title',
          //   width: 20,
          //   dataIndex: 'checked',
          //   align: 'center',
          //   scopedSlots: {
          //     customRender: 'checkbox'
          //   }
          // },
          { ...defaultTableColumns.serial, width: 60, fixed: 'left' },
          {
            title: '材料编码',
            dataIndex: 'materialCode',
            width: 160,
            scopedSlots: { customRender:'ellipsis2' }
          },
          {
            title: '材料名称',
            dataIndex: 'materialName',
            width: 200,
            scopedSlots: { customRender:'ellipsis3' }
          },
          {
            title: '品牌',
            dataIndex: 'brand',
            width: 120,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '型号',
            dataIndex: 'materialType',
            width: 160,
            scopedSlots: { customRender:'ellipsis2' }
          },
          {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '单位',
            dataIndex: 'unit',
            width: 120,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '采购价格',
            dataIndex: 'buyPrice',
            width: 100,
          },
          {
            title: '返点比例',
            dataIndex: 'rebateProportion',
            width: 100,
          },
          {
            title: '销售价格',
            dataIndex: 'salePrice',
            width: 100,
          },
          {
            title: '承包价',
            dataIndex: 'contractPrice',
            width: 100,
          },
          {
            title: '加盟价',
            dataIndex: 'joinPrice',
            width: 100,
          },
          {
            title: '结算方式',
            dataIndex: 'clearingType',
            width: 120,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '特项编码',
            dataIndex: 'specialCode',
            width: 120,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '材料条码',
            dataIndex: 'barcode',
            width: 160,
            scopedSlots: { customRender:'ellipsis2' }
          },
          {
            title: '供应商名称',
            dataIndex: 'supplyName',
            width: 200,
            scopedSlots: { customRender:'ellipsis3' }
          },
          {
            title: '仓库名称',
            dataIndex: 'stockName',
            width: 120,
            scopedSlots: { customRender:'ellipsis2' }
          },
          {
            title: '库存数量',
            dataIndex: 'stockNum',
            width: 100,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '库存金额',
            dataIndex: 'stockMoney',
            width: 100,
            scopedSlots: { customRender:'ellipsis' }
          },
          {
            title: '是否需要安装',
            dataIndex: 'isNeedInstall',
            width: 120,
            scopedSlots: { customRender:'isCheck'}
          },
          {
            title: '是否定制品',
            dataIndex: 'isCustomize',
            width: 120,
            scopedSlots: { customRender:'isCheck'}
          },
          {
            title: '是否库存记账',
            dataIndex: 'isStock',
            width: 120,
            scopedSlots: { customRender:'isCheck'}
          },
          {
            title: '是否允许修改',
            dataIndex: 'isCanEdit',
            width: 120,
            scopedSlots: { customRender:'isCheck'}
          },
          {
            title: '是否启用',
            dataIndex: 'isActive',
            width: 120,
            scopedSlots: { customRender:'isCheck'}
          },
        ],
        id: '', // 优惠活动的id
        checkedRowIds: [],
        checkedRows: [],
      }
    },
    created () {
      // console.log(this.columns.map(m => m.width || 0).reduce((a,b) => a+b))
    },
    methods: {
      maxLenValidator,
      numberValidator,
      rowChange (ids, rows) {
        this.checkedRowIds = ids
      },
      onSelect (record, selected) {
        if (selected) {
          this.checkedRows.push({ ...record })
        } else {
          this.checkedRows.splice(this.checkedRows.findIndex(m => m.id === record.id), 1)
        }
      },
      onSelectAll (selected, selectedRows, changeRows) {
        if (selected) {
          changeRows.forEach(record => {
            this.checkedRows.push({ ...record })
          })
        } else {
          changeRows.forEach(record => {
            this.checkedRows.splice(this.checkedRows.findIndex(m => m.id === record.id), 1)
          })
        }
      },
      getCheckboxProps (record) {
        return {
          props: {
            disabled: !!record.isPromotion
          }
        }
      },
      customRow (r) {
        return {
          on: {
            click: () => {
              if (this.checkedRowIds.includes(r.id)) {
                this.checkedRowIds.splice(this.checkedRowIds.indexOf(r.id), 1)
                this.checkedRows.splice(this.checkedRows.findIndex(m => m.id === r.id), 1)
              } else {
                this.checkedRowIds.push(r.id)
                this.checkedRows.push({ ...r })
              }
            }
          },
          class: { 'select-row': false }
        }
      },
      searchParams () {
        return { ...this.queryParam }
      },
      show (id, ids, rows) {
        this.id = id
        this.queryParam.promotionId = id
        if (ids && ids.length) {
          this.checkedRowIds = ids
          this.checkedRows = rows
        }
        this.visible = true
        this.$nextTick(() => {
          this.refresh()
        })
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      resetSearchForm () {
        this.queryParam = {
          workerName: '',
          workerPrincipal: ''
        }
      },
      handleSubmit () {
        this.confirmLoading = true
        if (!this.checkedRowIds.length) {
          this.$notification.warning({
            message: '请选择材料',
            description: '单击行，选择材料'
          })
          return
        }
        this.$emit('ok', [...this.checkedRows])
        this.handleCancel()
      },
      handleCancel () {
        // 重置表单数据
        this.confirmLoading = false
        this.visible = false
        this.queryParam = {}
        this.checkedRowIds = []
        this.checkedRows = []
      }
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-table-small .ant-table-thead th{
    background-color: #eaeaea !important;
  }
  ::v-deep .ant-table-small{
    border: none
  }
  ::v-deep .ant-table-tbody > tr.select-row td{
    background-color: $primaryColor;
    color: white;
  }
  ::v-deep .ant-table-tbody > tr.select-row:hover td,
  ::v-deep .select-row.ant-table-row-hover td{
    background-color: $primaryColor;
    color: white;
  }
  .top-select-show{
    margin-left: -8px;
  }
  ::v-deep .table-select{
    .ant-card:nth-child(2){
      margin-top: 0 !important;
      .ant-card-body{
        padding-top: 0;
      }
    }
  }
</style>