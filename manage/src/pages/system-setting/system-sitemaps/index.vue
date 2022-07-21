<template>
  <a-card :bordered="false">
    <a-row :gutter="0">
      <a-col :span="5" style="padding-right: 24px">
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :search="false"
          :action="true"
          :actionAuth="actionAuth"
          :loading="leftLoading"
          :noDataText="treeLoadText"
          @remove="removeMenu"
          @edit="editMenu"
          @click="handleClick"
          @plus="addMenu">
        </s-tree>
      </a-col>
      <a-col class="borderLeft" :span="19" >
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            @resetParams="resetSearchForm"
            request-type="GET"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bodyStyle="{ padding: '0' }"
          >
            <template slot="$search">
              <a-col :md="8" :sm="24">
                <a-form-item label="名称">
                  <a-input v-model="queryParam.name" autocomplete="off" placeholder="请输入名称" :max-length="30"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="标题">
                  <a-input
                    v-model="queryParam.title"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入标题"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" :disabled="!menuKey" v-if="!!menuKey" @click="addAction">新建</a-button>
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
      OrgModal,
      ListPage,
      ActionModal
    },
    data () {
      return {
        leftLoading: false,
        treeLoadText: undefined,
        loading: false,
        openKeys: ['key-01'],

        menuKey: 0,
        menuId: null,
        menuTitle: null,

        // 查询参数
        queryParam: {},
        requestUrl: this.$api.system.menu.getActionList,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '区域',
            dataIndex: 'area'
          },
          {
            title: '键值',
            dataIndex: 'key'
          },
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '标题',
            dataIndex: 'title'
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
        isFirstEnter: true
      }
    },
    created () {
      this.refresh()
    },
    methods: {
      searchParams () {
        return { ...this.queryParam, sitemapId: this.menuKey }
      },
      refresh () {
        this.getMenuList()
      },
      getMenuList () {
        this.leftLoading = true
        this.treeLoadText = undefined
        this.$get({
          url: this.$api.system.menu.getListPage
        })
          .then(res => {
            // const parentMenu = []
            // res.forEach(item=>{
            //   const obj = {
            //     id: null,
            //     parentId: 'top',
            //     title: item.typeName,
            //     titleEn: item.nameEn,
            //     icon: 'bars',
            //     key: item.type,
            //     expanded: true,
            //     children: item.voList
            //   }
            //   parentMenu.push(obj)
            // })
            // const children1= res.filter(m => !m.backstage)[0] ? res.filter(m => !m.backstage)[0].voList : []
            // const children2= res.filter(m => m.backstage)[0] ? res.filter(m => m.backstage)[0].voList : []
            const parentMenu = [
              {
                id: 'top',
                'title': '菜单管理',
                'icon': 'bars',
                key: 'menu-top',
                expanded: true,
                'children': [
                  {
                    'id': null,
                    parentId: 'top',
                    'title': '后台系统菜单管理',
                    'icon': 'bars',
                    key: 'menu-manage',
                    expanded: true,
                    'children': res[0].voList
                  },
                  {
                    'id': null,
                    parentId: 'top',
                    'title': '前台导航栏目管理',
                    'icon': 'bars',
                    key: 'menu-reception',
                    expanded: true,
                    'children':  res[1].voList
                  }
                ]
              }
            ]
            this.orgTree = parentMenu
        })
          .catch(err => {
          this.treeLoadText = err && err.message || '菜单树加载失败'
        })
          .finally(() => {
          this.leftLoading = false
        })
      },
      // Menu Event
      addMenu (item) {
        this.$refs.add_menu.add(item)
      },
      editMenu (item) {
        this.$refs.add_menu.edit(item)
      },
      removeMenu (e) {

        this.leftLoading = true

        this.$delete({
          url: this.$api.system.menu.delete,
          params: { id: e.id },
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
          if (m.id === key && !(m.children && m.children.length)) {
            data = m
          } else if (m.children && m.children.length) {
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
        const array = [this.orgTree[0]]
        const data = this.findMenu(array, id)
        this.menuId = id
        if (data) {
          this.menuKey = id
          this.menuTitle = data.title
          this.$refs.listPage.refresh(true)
        }
      },

      // Action Event
      addAction () {
        const row = { menuId: this.menuId, menuTitle: this.menuTitle }
        this.$refs.add_action.add(row)
      },
      editAction (data) {
        data.menuId = this.menuId
        data.menuTitle = this.menuTitle
        this.$refs.add_action.edit(data)
      },
      removeAction (record) {
        this.loading = true
        this.$delete({
          url: this.$api.system.menu.actionDelete,
          params: { id: record.id },
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
        this.getMenuList()
      },
      handleSaveOk () {
        this.$refs.listPage.refresh(true)
      },
      resetSearchForm () {
        this.queryParam = {
          name: '',
          title: ''
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
