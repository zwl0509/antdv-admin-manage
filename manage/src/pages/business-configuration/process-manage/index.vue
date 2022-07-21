<template>
  <div>
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        request-type="POST"
        :columns="columns"
        :request-url="requestUrl"
        :query-params="searchParams" >
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="流程名称">
              <a-input v-model="queryParam.name" autocomplete="off" placeholder="请输入流程名称" :max-length="30"/>
            </a-form-item>
          </a-col>
        </template>
        <template slot="$operate">
          <a-button type="primary" icon="plus" style="margin-bottom: 8px;" @click="$refs.createModal.add()">新建</a-button>
        </template>
        <template slot="version" slot-scope="text">
          <span>{{ text ? 'v' + text : '-' }}</span>
        </template>
        <template slot="switch" slot-scope="text, record">
          <span v-if="record.haveChildren">-</span>
          <a-switch 
            v-else
            checked-children="是" 
            un-checked-children="否"
            :checked="!!text" 
            :disabled="isCheck"
            @change="handleIsOpen(record.id)"/>
        </template>
        <template slot="action" slot-scope="text, record">
          <template v-if="record.haveChildren">
            <a @click="$refs.ProcessModal.add(record)">新增</a>
            <a-divider type="vertical"/>
            <a @click="$refs.createModal.edit(record,'edit')">编辑</a>
          </template>
          <template v-else>
            <a @click="$refs.ProcessModal.edit(record,'detail')">详情</a>
            <a-divider type="vertical"/>
            <a @click="$refs.ProcessModal.edit(record,'copy')">复制</a>
          </template>
        </template>
      </list-page>
    </a-spin>
    <action-modal ref="createModal" @ok="refresh"></action-modal>
    <process-modal ref="ProcessModal" @ok="refresh"></process-modal>
  </div>
</template>

<script>
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import ProcessModal from './modules/ProcessModal'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'TableList',
    components: {
      ListPage,
      ActionModal,
      Ellipsis,
      ProcessModal
    },
    data () {
      return {
        isCheck: false,
        loading: false,
        queryParam: {},
        requestUrl: this.$api.workFlowTypeInfo.getListPage,
        // 表头
        columns:[
          {
            title: '序号',
            width: 120,
            dataIndex: 'serial',
            scopedSlots: { customRender: 'serial' }
          },
          // {
          //   title: '流程类别',
          //   dataIndex: 'codeName',
          // },
          {
            title: '流程名称',
            dataIndex:'name',
          },
          {
            title: '版本',
            dataIndex:'version',
            scopedSlots: { customRender: 'version' }
          },
          {
            title: '是否启用',
            dataIndex:'enable',
            scopedSlots: { customRender: 'switch' }
          },
          {
            title: '备注信息',
            dataIndex:'remark',
          },
          {
            title: '编辑人',
            dataIndex: 'modifiedBy',
          },
          {
            title: '编辑时间',
            dataIndex: 'modifiedTime',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 160,
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
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
    },
    methods: {
      searchParams() {
        return this.queryParam
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      resetSearchForm () {
        this.queryParam = { }
      },
      // 是否禁用
      handleIsOpen (id) {
        this.isCheck = this.loading = true
        this.$get({
          url: this.$api.workFlowTypeInfo.isOpen,
          params: { id },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.refresh(true)
          })
          .catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.loading = this.isCheck = false })
      },
    },
    activated () {
      this.refresh()
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