<template>
  <a-modal 
    :visible="visible"
    :width="1200"
    title="选择供应商" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-row :gutter="0">
      <a-col :span="5" style="padding-right: 24px">
        <s-tree
          textName="supplyClassName"
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
      <a-col :span="19" style="padding: 20px;background-color: #f0f2f5;">
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            size="small"
            @resetParams="resetSearchForm"
            request-type="get"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :customRow="customRow"
            :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
            <template slot="$search">
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商编码">
                  <a-input
                    v-model="queryParam.supplyCode"
                    autocomplete="off"
                    placeholder="请输入供应商编码"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商名称">
                  <a-input
                    v-model="queryParam.supplyName"
                    autocomplete="off"
                    placeholder="请输入供应商名称"
                    :max-length="30"/>
                </a-form-item>
              </a-col>
            </template>
            <span slot="ellipsis" slot-scope="text">
              <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import { STable } from '@/components'
  import ListPage from '@/components/ListPage'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'SelectSupply',
    components: {
      STable,
      STree,
      ListPage,
      Ellipsis
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
        },
        isCheck: false,
        requestUrl: this.$api.basicData.supplyInfo.getListPage,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '供应商编码',
            width: 120,
            dataIndex:'supplyCode',
          },
          {
            title: '供应商名称',
            dataIndex:'supplyName',
            width: 300,
            scopedSlots: { customRender: 'ellipsis' },
          },
          {
            title: '助记码',
            dataIndex:'help',
            scopedSlots: { customRender: 'ellipsis' },
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
        actionAuth: [],
        isFirstEnter: true,
        priceList:[],
        statusList:[],
        orgTree: [],
        parentCodes: []
      }
    },
    created () {
      this.getMenuList()
    },
    methods: {
      show () {
        this.visible = true
        this.selectedRowKeys= []
        this.selectedRows= []
      },
      searchParams () {
        return { ...this.queryParam }
      },
      getMenuList () {
        this.leftLoading = true
        this.treeLoadText = undefined
        this.$get({
          url: this.$api.basicsClass.supplyClass.getTreeList,
        })
          .then(res => {
            const parentMenu = []
            const data = res
            data.forEach(item=>{
              const obj = {
                id: item.id,
                parentId: item.parentId,
                supplyClassName: item.supplyClassName,
                key: item.id,
                expanded: true,
                children: item.children,
                supplyClassCode: item.supplyClassCode
              }
              parentMenu.push(obj)
            })
            this.orgTree = parentMenu
          })
          .catch(err => {
            this.treeLoadText = err && err.message || '菜单树加载失败'
          })
          .finally(() => {
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
          this.menuTitle = data.supplyClassName
          this.queryParam.supplyClassCode = data.supplyClassCode

        } else {
          this.menuKey = ''
          this.menuTitle = ''
          this.queryParam.supplyClassCode = null
        }
        this.refresh()
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      customRow (r) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [r.id]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': false }
        }
      },
      resetSearchForm () {
        this.queryParam = {}
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      handleSubmit () {
        this.$emit('ok',this.selectedRows[0])
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>

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