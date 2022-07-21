<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="POST"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="分类名称">
            <a-input v-model="queryParam.supplyClassName" autocomplete="off" placeholder="请输入分类名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="分类编码">
            <a-input v-model="queryParam.supplyClassCode" autocomplete="off" placeholder="请输入分类编码" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否启用">
            <a-select placeholder="是否启用" v-model="queryParam.active">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('SupplierClassification.Create')">新建</a-button>
      </template>
      <template slot="isActive" slot-scope="text, record">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="text" 
          :disabled="isCheck"
          @change="handleIsOpen(record.id ,record.isActive)"/>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('SupplierClassification.Create')">
          <a @click="$refs.createModal.add(record,true)">新增</a>
          <a-divider v-if="actionAuth.includes('SupplierClassification.Modify')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('SupplierClassification.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('SupplierClassification.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('SupplierClassification.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record.id)">
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
  import { dateFormatString , defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
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
        isCheck: false,
        requestUrl: this.$api.basicsClass.supplyClass.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '分类名称',
            dataIndex: 'supplyClassName'
          },
          {
            title: '分类编码',
            dataIndex: 'supplyClassCode'
          },
          {
            title: '编码前缀',
            dataIndex: 'supplyProCode'
          },
          {
            title: '特项编码',
            dataIndex: 'specialCode'
          },
          {
            title: '是否启用',
            dataIndex: 'isActive',
            scopedSlots: { customRender: 'isActive' }
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
      searchParams () {
        return this.queryParam
      },

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
      handleIsOpen (id ,active) {
        this.loading = this.isCheck = true
        this.$post({
          url: this.$api.basicsClass.supplyClass.isOpen,
          data: { 
            id,
            active: !active
          },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          })
          .catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.isCheck = this.loading = false  })
      },
      handleSub (id) {
        this.loading = true
        this.$delete({
          url: this.$api.basicsClass.supplyClass.delete,
          params: { id },
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
