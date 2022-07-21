<template>
  <a-card :bordered="false">
    <a-row :gutter="0">
      <a-col :span="4" style="padding-right: 24px">
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :search="false"
          :action="true"
          :actionAuth="actionAuth"
          :loading="leftLoading"
          :noDataText="treeLoadText"
          text-name="name"
          @remove="removeMenu"
          @edit="editMenu"
          @plus="addMenu"
          @click="handleClick">
        </s-tree>
      </a-col>
      <a-col class="borderLeft" :span="20" >
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            @resetParams="resetSearchForm"
            request-type="POST"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bodyStyle="{ padding: '0' }"

          >
            <template slot="$search">
              <a-col :md="8" :sm="24">
                <a-form-item label="小区名称">
                  <a-input
                    v-model="queryParam.name"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入小区名称"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="所属地区">
                  <a-input
                    v-model="queryParam.parentArea"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入所属地区"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" v-if="menuId !== 'menuTop'" @click="addAction">新建</a-button>
            </template>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="editAction(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="removeAction(record)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <org-modal ref="add_menu" @ok="handleMenuOk"/>
    <action-modal ref="add_action" @ok="handleSaveOk"/>
  </a-card>
</template>

<script>
  import STree from '@/components/MyTree'
  import { STable } from '@/components'
  import OrgModal from './modules/OrgModal'
  import ActionModal from './modules/ActionModal'
  import moment from 'moment'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import ListPage from '@/components/ListPage'
  import labels from '@/utils/labels'
  import { MENU_ID } from '@/store/mutation-types'

  export default {
    name: 'TreeList',
    components: {
      STable,
      STree,
      ListPage,
      ActionModal,
      OrgModal
    },
    data () {
      return {
        leftLoading: false,
        treeLoadText: undefined,
        loading: false,
        openKeys: ['menuTop'],
        menuKey: 'menuTop',
        menuId: 'menuTop',
        menuTitle: null,
        parentTitle: null,
        // 查询参数
        queryParam: {},
        requestUrl: this.$api.basicData.areaInfo.getResidenceList,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '小区名称',
            dataIndex: 'name'
          },
          {
            title: '所属地区',
            dataIndex: 'parentArea'
          },
          {
            title: '小区地址',
            dataIndex: 'areaNamePath'
          },
          {
            title: '备注',
            dataIndex: 'remark'
          },
          {
            title: '编辑人',
            dataIndex: 'modifiedBy'
          },
          {
            title: '编辑时间',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        orgTree: [],
        actionAuth: ['treeAuth.Create', 'treeAuth.Modify', 'treeAuth.Delete'],
        isFirstEnter: true,
        parentIds:[]
      }
    },
    created () {
      this.id = ''
      this.areaId = ''
      // this.refresh()
      this.getMenuList()
    },
    methods: {
      searchParams () {
        return { ...this.queryParam }
      },
      refresh () {
        this.handleSaveOk()
      },
      getMenuList () {
        this.leftLoading = true
        this.treeLoadText = undefined
        this.$post({
          url: this.$api.basicData.areaInfo.getListPage
        })
          .then((res) => {
            const parentMenu = [
              {
                id: null,
                name: '全部地区',
                key: 'menuTop',
                children: res[0]?.children || []
              }
            ]

            this.orgTree = parentMenu
            // console.log(parentMenu)
          })
          .catch(err => {
            this.treeLoadText = err && err.message || '菜单树加载失败'
          })
          .finally(() => {
            this.leftLoading = false
          })
      },
      addMenu (data) {
        const row = { parentId: data.id, menuTitle: data.name, parentArea: this.parentArea}
        this.$refs.add_menu.add(row, 1)
      },
      editMenu (data) {
        data.parentArea = data.parentArea
        data.menuId = data.parentId
        data.menuTitle = data.name
        this.$refs.add_menu.edit(data, 1)
      },
      removeMenu (e) {
        this.leftLoading = true
        this.$post({
          url: this.$api.basicData.areaInfo.delete,
          data: [ e.id ],
          needResponse: true
        }).then(res => {
          this.$notification.success({
            message: labels.DELETE_SUCCESS,
            description: res.message || ''
          })
          this.handleMenuOk()
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.leftLoading = false })
      },
      findMenu (array, key) {
        let data = null
        array.forEach(m => {
          if (m.id === key) {
            data = m
          } else if (!data && m.children && m.children.length) {
            const v = this.findMenu(m.children, key)
            data = v || data
          }
        })
        return data
      },
      handleClick (keys, e) {
        const id = keys[0]
        if (id === this.menuId) {
          return
        }
        if (id === 'menuTop') {
          this.queryParam.classifyId = null
        } else {
          this.queryParam.classifyId = id
        }
        if (!id || id === 'id' || id === this.menuId) {
          return
        }
        const array = this.orgTree
        const data = this.findMenu(array, id)
        this.menuId = this.menuKey = id
        if (data) {
          this.menuKey = id
          this.menuTitle = data.title
          this.parentArea = data.name
          this.parentIds = data.parentIdsList
          this.$refs.listPage.refresh(true)
        }
      },

      // Action Event
      addAction () {
        const row = { parentId: this.menuId, menuTitle: this.menuTitle, parentArea: this.parentArea, parentIdsList: this.parentIds}
        this.$refs.add_action.add(row, 1)
      },
      editAction (data) {
        data.menuId = data.parentId
        data.menuTitle = this.menuTitle
        this.$refs.add_action.edit(data, 1)
      },
      removeAction (record) {
        this.loading = true
        this.$post({
          url: this.$api.basicData.areaInfo.delete,
          data: [record.id],
          needResponse: true
        }).then(res => {
          this.$notification.success({
            message: labels.DELETE_SUCCESS,
            description: res.message || ''
          })
          this.handleSaveOk()
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      // public event
      handleMenuOk () {
        this.$refs.listPage.refresh(true)
        this.getMenuList()
      },
      handleSaveOk () {
        this.$refs.listPage.refresh(true)
        this.getMenuList()
      },
      resetSearchForm () {
        this.queryParam = {
          name: '',
          title: '',
          parentArea: ''
        }
      }
    },
    activated () {
      if (this.isFirstEnter) {
        this.isFirstEnter = false
      } else {
        this.refresh()
      }
    }
  }
</script>

<style lang="scss">
  .custom-tree {
    ::v-deep .ant-tree-node-content-wrapper {
      display: inline-block;
      width: calc(100% - 24px);
    }

    ::v-deep .ant-tree-title {
      display: flex;
      justify-content: space-between;
    }
  }

  .borderLeft {
    border-left: solid 1px #eee;
    padding-left: 20px !important;
  }
</style>
