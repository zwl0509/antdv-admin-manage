<template>
  <div>
    <!-- 预算管理 -->
    <list-page
      ref="listPage"
      class="small-table"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :scroll="{ x: scroll_x }">
      <template slot="$operate">
        <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
          <a-tab-pane v-for="(item, index) in list" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
        </a-tabs>
      </template>
      <template slot="$search">
        <a-col :md="6" :xs="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.ActionModal.show(record)">客户选材</a>
          <a-divider type="vertical"/>
        </template>
        <template>
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="ActionModal" @ok="handleOk"/>
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
      scroll_x: 2500,
      requestUrl: this.$api.customInfo.chooseMaterialInfo.getCustomer,
      // 查询参数
      queryParam: {
        type: '1033-70'
      },
      // 表头
      columns: [
        {
          title: '序号',
          width: 80,
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'infoShow' }
        },
        {
          title: '性别',
          dataIndex: 'genderName'
        },
        {
          title: '手机号',
          dataIndex: 'mobileNumber'
        },
        {
          title: '客户类型',
          dataIndex: 'relationshipName'
        },
        {
          title: '回单人',
          dataIndex: 'replyOrderStaff'
        },
        {
          title: '装修风格',
          dataIndex: 'decorationStyleName'
        },
        {
          title: '建筑面积',
          dataIndex: 'buildingArea'
        },
        {
          title: '实用面积',
          dataIndex: 'actualArea'
        },
        {
          title: '房型',
          dataIndex: 'houseTypeName'
        },
        {
          title: '户型',
          dataIndex: 'roomTypeName'
        },
        {
          title: '楼层',
          dataIndex: 'floor'
        },
        {
          title: '客户了解信息',
          dataIndex: 'knownInfoName'
        },
        {
          title: '了解公司途径',
          dataIndex: 'knowCoWayName'
        },
        {
          title: '客户重点关注',
          dataIndex: 'focusOnName'
        },

        {
          title: '操作',
          dataIndex: 'action',
          width: 160,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      actionAuth: [],
      typeList:[],
      value: 0,
      list:[
        { value: 0, name: '设计客户' },
        { value: 1, name: '施工客户' },
      ],
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
    changeTabs(value){
      this.value = value
      this.type = value ? '1033-80' : '1033-70'
      this.$forceUpdate()
      this.handleOk()
    },
    searchParams(){
      if(this.queryParam) {
        this.queryParam.type = !this.value ? '1033-70':'1033-80'
      }
      return this.queryParam
    },
    handleAuth (record) {
      this.$refs.authModal.show(record.id)
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleSub (record) {
      this.$notification.warning({
        message: labels.HINT,
        description: '暂未开发'
      })
      // this.loading = true
      // this.$delete({
      //   url: this.$api.allocation.CommissionInfo.delete,
      //   params: { id: record.id },
      //   needResponse: true
      // }).then(res => {
      //   this.$notification.success({
      //     message: labels.DELETE_SUCCESS,
      //     description: res.message || ''
      //   })
      //   this.handleOk()
      // }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
      //   .finally(() => { this.loading = false })
    },
    handleOk () {
      this.$refs.listPage.refresh()
    },
    resetSearchForm () {
      this.queryParam = {
        type: this.type,
      }
    },
    clearId () {
      this.targetId = null
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>
