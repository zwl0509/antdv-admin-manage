<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="POST"
      :query-params="queryParam"
    >
      <template slot="$search">
        <a-col :md="8" :sm="24">
          <a-form-item label="开户行">
            <a-input v-model="queryParam.openingBank" autocomplete="off" placeholder="请输入开户行" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="银行卡号">
            <a-input v-model="queryParam.bankAccount" autocomplete="off" placeholder="请输入银行卡号" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="pos机名称">
            <a-input v-model="queryParam.posName" autocomplete="off" placeholder="请输入pos机名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="pos机终端号">
            <a-input v-model="queryParam.posNum" autocomplete="off" placeholder="请输入pos机终端号" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="门店名称">
            <a-input v-model="queryParam.storeOrgName" autocomplete="off" placeholder="请输入门店名称" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('POSTerminalDetails.Create')">新建</a-button>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('POSTerminalDetails.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('POSTerminalDetails.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('POSTerminalDetails.Delete')">
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
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
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
        requestUrl: this.$api.basicData.posInfo.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '门店名称',
            dataIndex: 'storeOrgName'
          },
          {
            title: '银行卡号',
            dataIndex: 'bankAccount'
          },
          {
            title: '开户行',
            dataIndex: 'openingBank'
          },
          {
            title: 'pos机名称',
            dataIndex: 'posName'
          },
          {
            title: 'pos机终端号',
            dataIndex: 'posNum'
          },
          {
            title: '户名',
            dataIndex: 'username'
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
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleSub (record) {
        this.loading = true
        // data: [String,...]
        this.$post({
          url: this.$api.basicData.posInfo.delete,
          data: [record.id],
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
