<template>
  <div>
    <!-- 提成配置 -->
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :xs="24">
          <a-form-item label="配置名称">
            <a-select placeholder="请选择配置名称" v-model="queryParam.code">
              <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="actionAuth.includes('RoyaltyAllocation.Create')" type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('RoyaltyAllocation.Create')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('RoyaltyAllocation.Create')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"/>
  </div>
</template>

<script>
import moment from 'moment'
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import { defaultTableColumns } from '@/components/ListPage/_utils'

export default {
  name: 'TableList',
  components: {
    ActionModal,
    ListPage
  },
  data () {
    return {
      loading: false,
      requestUrl: this.$api.allocation.CommissionInfo.getListPage,
      // 查询参数
      queryParam: {},
      searchParams: () => {
        return this.queryParam
      },
      // 表头
      columns: [
        defaultTableColumns.serial,
        // {
        //   title: '配置编码',
        //   dataIndex: 'code'
        // },
        {
          title: '配置名称',
          dataIndex: 'name'
        },
        {
          title: '提成百分比',
          dataIndex: 'percentage'
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
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      actionAuth: [],
      typeList:[]
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
    this.$getCodeList('1058', res => {
      this.typeList = res
    })
  },
  methods: {
    handleAuth (record) {
      this.$refs.authModal.show(record.id)
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleSub (record) {
      this.loading = true
      this.$delete({
        url: this.$api.allocation.CommissionInfo.delete,
        params: { id: record.id },
        needResponse: true
      }).then(res => {
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
      this.queryParam = {}
    },
    clearId () {
      this.targetId = null
    }
  }
}
</script>
