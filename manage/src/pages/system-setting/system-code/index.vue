<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="queryParam"
    >
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="名称">
            <a-input v-model="queryParam.name" autocomplete="off" placeholder="请输入名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="值">
            <a-input v-model="queryParam.value" autocomplete="off" placeholder="请输入值" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('Dictionary.Create')">新建</a-button>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('Dictionary.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('Dictionary.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Dictionary.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"></action-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import labels from '@/utils/labels'

  export default {
    name: 'TableList',
    components: {
      STable,
      ActionModal,
      ListPage
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.system.code.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '编码',
            dataIndex: 'code'
          },
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '值',
            dataIndex: 'value'
          },
          {
            title: '创建人',
            dataIndex: 'createdBy'
          },
          {
            title: '创建时间',
            dataIndex: 'createdTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
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
            width: '120px',
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
    },
    methods: {
      delEmptyChildren (node) {
        node.forEach(item => {
          if (!item.children.length) {
            delete item.children
          } else {
            this.delEmptyChildren(item.children)
          }
        })
        return null
      },
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.system.code.delete,
          params: { id: record.id },
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
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
        }
      },
    }
  }
</script>
