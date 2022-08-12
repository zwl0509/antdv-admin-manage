<template>
  <div>
    <!-- 主材申报 -->
    <list-page
      ref="listPage"
      class="small-table"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :scroll="{ x: scroll_x }">
      <template slot="$search">
        <a-col :md="6" :xs="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="装修地址">
            <a-input v-model="queryParam.finalAddress" autocomplete="off" placeholder="请输入装修地址" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="12" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.ActionModal.show(record,'1095-10')">单据列表</a>
          <a-divider type="vertical"/>
        </template>
        <template>
          <a @click="$refs.TipsModal.show(record.id,'add')">选材</a>
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
    <!-- 选择材料 -->
    <tips-modal ref="TipsModal"></tips-modal>
  </div>
</template>

<script>
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import { Ellipsis } from '@/components'
import TipsModal from './modules/TipsModal'

export default {
  name: 'TableList',
  components: {
    TipsModal,
    ActionModal,
    ListPage,
    Ellipsis
  },
  data () {
    return {
      loading: false,
      scroll_x: 2500,
      requestUrl: this.$api.customInfo.chooseMaterialInfo.getCustomer,
      // 查询参数
      queryParam: {
        type: '1033-80'
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
          scopedSlots: { customRender: 'infoShow' },

        },
        // {
        //   title: '是否主材包客户',
        //   dataIndex: 'isPackageCustomer',
        //   scopedSlots: { customRender: 'switch' }
        // },
        // {
        //   title: '是否活动客户',
        //   dataIndex: 'isPromotionCustomer',
        //   scopedSlots: { customRender: 'switch' }
        // },
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
          title: '客户地址',
          dataIndex: 'finalAddress',
          scopedSlots: { customRender: 'ellipsis' }

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
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      actionAuth: [],
      typeList:[],
      value: 0,
      list:[
        { value: 0, name: '未完工' },
        { value: 1, name: '已完工' },
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
    searchParams(){
      if(this.queryParam) {
        this.queryParam.type = '1033-80'
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
