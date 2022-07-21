<template>
  <a-modal 
    :visible="visible"
    :width="1200"
    title="客户选材" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-tabs v-model="tabIndex" @change="changeTabs">
      <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
    </a-tabs>
    <a-spin :spinning="loading">
      <a-row :gutter="0">
        <a-col :span="5" style="padding-right: 24px">
          <s-tree
            ref="refTree"
            textName="areaName"
            :dataSource="orgTree"
            :openKeys.sync="openKeys"
            :search="false"
            :action="false"
            :actionAuth="actionAuth"
            :loading="leftLoading"
            :noDataText="treeLoadText"
            show-title="title"
            @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19" style="padding: 10px; background-color: #f0f2f5;">
          <list-pages
            ref="listPage"
            class="modal-table"
            @resetParams="resetSearchForm"
            request-type="get"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="queryParam"
            :scroll="{ x: 2200,y: 400 }"
            :rowSelection="{ fixed: true, columnWidth: 40, selectedRowKeys: selectedRowKeys, onChange: onChange, onSelect: onSelect, onSelectAll: onSelectAll}">
            <template slot="$operate">
              <span>
                <template v-if="!tabIndex">
                  <a-button type="primary" @click="$refs.SelectMaterial.show(queryParam.customerId,'1087-20')">手动选材</a-button>
                  <a-button type="primary" @click="$refs.SelectMaterial.show(queryParam.customerId,'1087-30')">活动选材</a-button>
                  <a-button type="primary" @click="$refs.SelectMaterial.show(queryParam.customerId,'1087-40')">主材包选材</a-button>
<!--                  <a-button v-if="selectedRowKeys.length" type="primary">批量更换</a-button>-->
                  <a-button v-if="selectedRowKeys.length" type="primary" @click="handleConfirm(selectedRowKeys)">批量确认</a-button>
                </template>
                <template v-else>
                  <a-button v-if="selectedRowKeys.length" type="primary"@click="handleReset(selectedRowKeys)">批量重置</a-button>
                </template>
                <a-alert style="margin-bottom: 16px">
                  <template slot="message">
                    <span style="margin-right: 12px">已选择: <a style="font-weight: 500">{{ selectedRows.length }}</a></span>
                    <span style="margin-right: 12px"><a style="font-weight: 500" @click="() => {selectedRowKeys = [],selectedRows = []}">清空</a></span>
                  </template>
                </a-alert>
              </span>
            </template>
            <span slot="ellipsis" slot-scope="text">
              <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
            </span>
            <template slot="switch" slot-scope="text">
              <span>{{ !!text? '是' : '否' }}</span>
            </template>
            <span slot="action" slot-scope="text, record">
              <template v-if="!tabIndex">
                <a @click="$refs.ModifyMaterial.show(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleEdit(record)">更换</a>
                <a-divider type="vertical" />
                <a @click="handleConfirm([record.id])">确认</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="handleSub([record.id])">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
              <template v-else>
                <a @click="handleReset([record.id])">重置</a>
              </template>
            </span>
          </list-pages>
        </a-col>
      </a-row>
    </a-spin>
    <!-- 修改材料 -->
    <modify-material ref="ModifyMaterial" @ok="refresh"></modify-material>
    <!-- 选材料 -->
    <select-material ref="SelectMaterial" @ok="refresh"></select-material>
    <!-- 更换方式 -->
    <replace ref="Replace" @ok="refresh"></replace>
  </a-modal>
</template>

<script>
  const columnX = [
    {
      title: '序号',
      fixed: 'left',
      width: 60,
      scopedSlots: { customRender: 'serial' },
    },
    {
      title: '所属区域',
      width: 160,
      dataIndex:'areaName',
      scopedSlots: {
        showSearch: {
          title: '所属区域',
          type: 'input'
        }
      }
    },
    {
      title: '材料名称',
      dataIndex:'materialName',
      width: 200,
      scopedSlots: { customRender: 'ellipsis' },
    },
    {
      title: '材料编码',
      dataIndex:'materialCode',
    },
    {
      title: '材料类型',
      dataIndex:'typeName',
    },
    {
      title: '添加方式',
      dataIndex:'addTypeName',
    },
    {
      title: '材料规格',
      dataIndex:'spec',
    },
    {
      title: '材料单位',
      dataIndex:'unitName',
    },
    {
      title: '品牌',
      dataIndex:'brand',
    },
    {
      title: '材料材质',
      dataIndex:'texture',
    },
    {
      title: '型号',
      dataIndex:'materialType',
    },
    {
      title: '材料颜色',
      dataIndex:'colorName',
    },
    {
      title: '铺装位置',
      dataIndex:'pavingLocation',
    },
    {
      title: '类别系列',
      dataIndex:'typeSerial',
    },
    {
      title: '价格标识',
      dataIndex:'priceSignName',
    },
    {
      title: '材料价格',
      dataIndex:'salePrice',
    },
    {
      title: '最终价格',
      dataIndex:'finalPrice',
    },
    {
      title: '预估量',
      dataIndex:'forecast',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
      scopedSlots: { customRender: 'action'}
    }
  ]
  import moment from 'moment'
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import { deepClone } from '@/utils/util'
  import ListPages from '@/components/ListPages'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ModifyMaterial from './ModifyMaterial.vue'
  import SelectMaterial from './SelectMaterial.vue'
  import Replace from './Replace'

  export default {
    name: 'ActionModal',
    components: {
      STree,
      ListPages,
      Ellipsis,
      ModifyMaterial,
      SelectMaterial,
      Replace
    },
    data () {
      return {
        visible: false,
        leftLoading: false,
        treeLoadText: undefined,
        loading: false,
        openKeys: ['key-01'],
        menuKey: '',
        menuId: null,
        menuTitle: null,
        // 查询参数
        queryParam: {
          isConfirm: false,
          customerId:''
        },
        isCheck: false,
        requestUrl: this.$api.customInfo.chooseMaterialInfo.getList,
        // 表头
        columns: columnX,
        selectedRowKeys:[],
        selectedRows: [],
        actionAuth: [],
        isFirstEnter: true,
        priceList:[],
        statusList:[],
        orgTree: [],
        parentCodes: [],
        tabIndex: 0,
        tabList: [{value: 0 , name: '待确认'},{value: 1 , name: '已确认'}],
        customerId :'',
        selectList:[],
        area:''
      }
    },
    created() {
      // 选材添加方式
      this.$getCodeList('1087', res => {
        this.selectList = res
      })
    },
    methods: {
      show (record) {
        this.queryParam.customerId = record.id
        this.visible = true
        this.columns = columnX
        this.selectedRowKeys= []
        this.selectedRows= []
        this.getMenuList()
      },
      // 活动选材
      activitySelectMaterial() {

      },
      handleSub(ids) {
        this.loading = true
        this.$delete({
          url: this.$api.customInfo.chooseMaterialInfo.delete,
          data: ids,
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.DELETE_SUCCESS,
              description: res.message || ''
            })
            this.refresh()
          }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleConfirm(ids){
        this.loading = true
        this.$post({
          url: this.$api.customInfo.chooseMaterialInfo.confirm,
          data: ids,
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.refresh()
          }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleEdit(record) {
        this.$refs.Replace.show(record)
      },
      handleReset(ids){
        this.loading = true
        this.$post({
          url: this.$api.customInfo.chooseMaterialInfo.reset,
          data: ids,
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.refresh()
          }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.loading = false })
      },
      changeTabs(e) {
        this.queryParam.isConfirm = e ?  true :  false
        const list = deepClone(columnX)
        list.forEach((item)=> { 
          if(item.dataIndex == 'action') {
            item.width = this.tabIndex ? 60 : 200
          }
        })
        this.queryParam.area = ''
        this.columns = list
        this.getMenuList()
        this.selectedRowKeys= []
        this.selectedRows= []
      },
      getMenuList () {
        this.leftLoading = true
        this.treeLoadText = undefined
        this.loading = true
        this.$get({
          url: this.$api.customInfo.chooseMaterialInfo.getAreaList,
          params:{
            customerId : this.queryParam.customerId,
            isConfirm : this.queryParam.isConfirm
          }
        }).then(res => {
          const data = res
          const parentMenu = [
            {
              id: null,
              areaName: '全部分类',
              key: 'menuTop',
              children: data.map((item) => {
                item.children = []
                return item
              })
            }
          ]
          this.orgTree = parentMenu
          this.$refs.listPage && this.$refs.listPage.refresh(true)
        }).catch(err => {
          this.treeLoadText = err && err.message || '菜单树加载失败'
        }).finally(() => {
          this.loading = false
          this.leftLoading = false
        })
      },
      findMenu (array, key) {
        let data = null
        array.forEach(m => {
          if ( m.id === key )  {
            data = m
          }
          if (!data && m.children && m.children.length) {
            const v = this.findMenu(m.children, key)
            data = v || data
          }
        })
        return data
      },
      handleClick (keys, e) {
        const id = keys[0]
        if (!id || id === 'top' || id === this.menuId) {
          return
        }
        const array = this.orgTree
        const data = this.findMenu(array, id)
        this.menuId = id
        if (data) {
          this.menuKey = data.id
          this.menuTitle = data.areaName
          this.queryParam.area = data.area

        } else {
          this.menuKey = ''
          this.menuTitle = ''
          this.queryParam.area = null
        }
        this.refresh()
      },
      onChange(ids, record) {
        this.selectedRowKeys = ids
      },
      /**
       *  单选
       * @param selected 复选框状态
       * @param record 选中的数据
       */
      onSelect (record, selected) {
        if (selected) {
          this.selectedRows.push({ ...record })
        } else {
          this.selectedRows.splice(this.selectedRows.findIndex(m => m.id === record.id), 1)
        }
      },
      /**
       *  全选
       * @param selected 复选框状态
       * @param selectedRows 选中的数据
       * @param changeRows 取消的数据
       */
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
      refresh () {
        this.$refs.listPage.refresh(true)
        this.getMenuList()
        this.selectedRowKeys= []
        this.selectedRows= []
      },
      handleSubmit () {
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.tabIndex = 0
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
  ::v-deep .ant-modal-body {
    max-height: 780px;
  }
</style>