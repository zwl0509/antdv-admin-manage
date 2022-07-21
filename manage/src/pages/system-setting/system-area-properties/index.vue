<template>
  <!-- 区域属性 -->
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        :columns="columns"
        :request-url="requestUrl"
        request-type="POST"
        :query-params="searchParams"
        :bodyStyle="{padding: '0'}">
        <template slot="$search">
          <a-col :md="8" :sm="24">
            <a-form-item label="区域名称">
              <a-input v-model="queryParam.groupName" autocomplete="off" placeholder="请输入区域名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="客户提成">
              <a-input v-model="queryParam.customerCommission" autocomplete="off" placeholder="请输入客户提成" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="创建日期">
              <a-range-picker v-model="queryParam.data" style="width: 100%"/>
            </a-form-item>
          </a-col>
        </template>
        <template slot="$operate">
          <a-button
            type="primary"
            icon="edit"
            style="margin-bottom: 8px;"
            @click="$refs.ActionModal.add('add')"
            v-if="actionAuth.includes('AreaProperties.Create')">新建</a-button>
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
          <template v-if="actionAuth.includes('AreaProperties.Detail')">
            <a @click="$refs.ActionModal.edit(record,'detail')">详情</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('AreaProperties.Modify')">
            <a @click="$refs.ActionModal.edit(record,'edit')">编辑</a>
            <a-divider type="vertical" v-if="actionAuth.includes('AreaProperties.Delete')"/>
          </template>
          <template v-if="actionAuth.includes('AreaProperties.Delete')">
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </list-page>
    </a-spin>
    <action-modal ref="ActionModal" @ok="handleOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import ActionModal from './modules/ActionModal'
  import {  dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'

  export default {
    name: 'TreeList',
    components: {
      ActionModal,
      ListPage
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
        requestUrl: this.$api.system.organizationGroup.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '区域名称',
            dataIndex: 'groupName'
          },
          {
            title: '客户提成',
            dataIndex: 'customerCommission'
          },
          {
            title: '排序值',
            dataIndex: 'sequence'
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
      handleSub (record) {
        this.loading = true
        this.$post({
          url: this.$api.system.organizationGroup.delete,
          data: [record.id] ,
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.DELETE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleOk () {
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
