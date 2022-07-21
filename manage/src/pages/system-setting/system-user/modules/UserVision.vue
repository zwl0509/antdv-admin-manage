<template>
  <a-row :gutter="0">
    <a-col :span="6" style="padding-right: 24px">
      <s-tree
        :dataSource="orgTree"
        :openKeys.sync="openKeys"
        :search="false"
        :action="false"
        :actionAuth="actionAuth"
        :loading="leftLoading"
        :noDataText="treeLoadText"
        show-title="title"
        class="tree-scroll"
        @click="handleClick">
      </s-tree>
    </a-col>
    <a-col :span="18" style="padding: 15px;background-color: #f0f2f5;">
      <a-spin :spinning="loading">
        <list-page
          ref="listPage"
          size="small"
          rowKey="userId"
          @resetParams="resetSearchForm"
          request-type="POST"
          :columns="columns"
          :request-url="requestUrl"
          :query-params="searchParams"
          :showRefresh="false"
          :pageSize="20"
          :pagination="{pageSize: 20, pageSizeOptions: ['20','40','80','100']}"
          :rowSelection="{columnWidth: 40, selectedRowKeys, onChange: onSelectChange}"
          :scroll="{ y: 300 }">
          <template slot="$search">
            <a-col :md="8" :sm="24">
              <a-form-item label="员工名称">
                <a-input
                  v-model="queryParam.employeeName"
                  autocomplete="off"
                  placeholder="请输入员工名称"
                  :max-length="30"
                />
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
</template>

<script>
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import ListPage from '@/components/ListPage'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  export default {
    name: 'UserVision',
    components: {
      STree,
      ListPage,
      Ellipsis
    },
    data () {
      return {
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
        requestUrl: this.$api.employeeManage.employeeInfo.getListPage,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '员工姓名',
            width: 120,
            dataIndex:'employeeName',
          },
          {
            title: '员工编码',
            dataIndex:'employeeCode',
          },
          {
            title: '部门名称',
            dataIndex:'organizationName',
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
      show (list) {
        this.selectedRowKeys = list
      },
      searchParams () {
        return { ...this.queryParam }
      },
      getMenuList () {
        this.leftLoading = true
        this.treeLoadText = undefined
        this.$get({
          url: this.$api.organization.getTreeList,
        })
          .then(res => {
            const parentMenu = []
            const data = res
            data.forEach(item=>{
              const obj = {
                id: item.id,
                parentId: 'top',
                name: item.name,
                icon: 'bars',
                code: item.code,
                key: item.type,
                expanded: true,
                children: item.children,
                parentCodes: item.parentCodes
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
          this.menuKey = data.code
          this.menuTitle = data.name
          this.queryParam.organizationCode = data.code
          this.parentCodes = data.parentCodes
        } else {
          this.menuKey = ''
          this.menuTitle = ''
          this.queryParam.organizationCode = null
        }
        this.refresh()
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      resetSearchForm () {
        this.queryParam = {}
      },
      getData(){
        return this.selectedRowKeys
      },
      setData(list) {
        this.selectedRowKeys = list
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      clear() {
        this.selectedRowKeys = []
        this.selectedRows = []
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
  .tree-scroll {
    max-height: 520px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>