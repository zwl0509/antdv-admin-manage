<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        :columns="columns"
        :request-url="requestUrl"
        request-type="GET"
        :query-params="searchParams"
        :bodyStyle="{padding: '0'}">
        <template slot="$search">
          <a-col :md="8" :sm="24">
            <a-form-item label="职位名称">
              <a-input v-model="queryParam.positionName" autocomplete="off" placeholder="请输入职位名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="创建日期">
              <a-range-picker v-model="queryParam.data" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="是否启用">
              <a-select placeholder="是否启用" v-model="queryParam.isLocked">
                <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
        <template slot="$operate">
          <a-button
            type="primary"
            icon="edit"
            style="margin-bottom: 8px;"
            @click="addAction"
            v-if="actionAuth.includes('Position.Create')">新建</a-button>
        </template>
        <span slot="isDeleted" slot-scope="bool, record">
          <template>
            <a-icon :type="record.isDeleted?'check':'close'"/>
          </template>
        </span>
        <span slot="isLocked" slot-scope="bool, record">
          <template>
            <a-icon :type="record.isLocked?'check':'close'"/>
          </template>
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="actionAuth.includes('Position.Modify')">
            <a @click="editAction(record)">编辑</a>
            <a-divider v-if="actionAuth.includes('Position.Delete')" type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('Position.Delete')">
            <a-popconfirm title="是否要删除此行？" @confirm="removeAction(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </span>
        <template slot="isLocked" slot-scope="text,record">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :checked="!!text"
            @change="isShowLocked(record.id)"
          />
        </template>
      </list-page>
    </a-spin>
    <action-modal ref="add_action" @ok="handleSaveOk" @close="handleSaveClose"/>
    <auth-modal ref="authModal" :targetId="targetId" :type="type" @clickId="clearId"></auth-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import ActionModal from './modules/ActionModal'
  import AuthModal from '@/components/AuthModal'
  import {  dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'

  export default {
    name: 'TreeList',
    components: {
      ActionModal,
      ListPage,
      AuthModal
    },
    data () {
      return {
        treeLoading: false,
        loadingErrorText: undefined,
        loading: false,
        type: 'position',
        targetId: '',
        // 高级搜索 展开/关闭
        advanced: false,
        openKeys: ['key-01'],

        orgTree: [],
        menuKey: null,
        menuId: 0,
        menuTitle: null,
        requestUrl: this.$api.system.position.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '职位名称',
            dataIndex: 'positionName'
          },
          {
            title: '职位类型',
            dataIndex: 'positionCodeName'
          },
          {
            title: '排序值',
            dataIndex: 'sequence'
          },
          {
            title: '是否启用',
            dataIndex: 'isLocked',
            scopedSlots: { customRender: 'isLocked' },
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
            width: '200px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: []
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
      // this.getOrgTreeData()
    },
    methods: {
      searchParams () {
        if (this.queryParam.data) {
          this.queryParam.startTime = moment(this.queryParam.data[0]).format('YYYY-MM-DD')
          this.queryParam.endTime = moment(this.queryParam.data[1]).format('YYYY-MM-DD')
        }
        delete this.queryParam.data
        return this.queryParam
      },
      // getOrgTreeData () {
      //   this.treeLoading = true
      //   this.loadingErrorText = undefined
      //   this.$get({
      //     url: this.$api.organization.getListPage
      //   })
      //     .then(res => {
      //       this.orgTree = res.rows
      //     })
      //     .catch(err => {
      //       this.loadingErrorText = err && err.message || labels.RESPONSE_RESULT_EXCEPTION
      //     })
      //     .finally(() => {
      //     this.treeLoading = false
      //   })
      // },
      // Menu Event
      handleAuth (record) {
        this.$refs.authModal.show(record.id)
      },
      findMenu (array, key) {
        let data = null
        array.forEach(m => {
          if (m.id === key) {
            data = m
          } else if (m.children && m.children.length) {
            const v = this.findMenu(m.children, key)
            v && (data = v)
          }
        })
        return data
      },
      isShowLocked(id){
        this.disabled = true
        this.$get({
          url:this.$api.system.position.isLocked,
          params: { id },
          needResponse: true,
        }).then(res=>{
          this.disabled = false
          this.handleSaveOk()
        })
      },
      handleClick (keys, e) {
        const id = keys[0]
        if (!id || id === this.menuId) {
          return
        }
        const array = this.orgTree
        const data = this.findMenu(array, id)
        this.menuId = id
        if (data) {
          this.menuKey = id
          this.menuTitle = data.name
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
          url: this.$api.system.position.delete,
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
      handleSaveOk () {
        this.$refs.listPage.refresh(true)
      },
      handleSaveClose () {

      },
      resetSearchForm () {
        this.queryParam = {
          date: null
        }
      },
      clearId () {
        this.targetId = null
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
