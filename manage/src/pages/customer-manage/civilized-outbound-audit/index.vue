<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      request-type="GET"
      :columns="columns"
      :request-url="requestUrl"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="申请状态">
            <a-select placeholder="请选择申请状态" v-model="queryParam.applyStatus">
              <a-select-option v-for="(item,index) in applyStatusList" :value="item.value" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="申请人">
            <a-input v-model="queryParam.auditor" autocomplete="off" placeholder="请输入申请人姓名" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="申请日期">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="action" slot-scope="text,record" v-if="actionAuth.includes('CivilizedOutboundAudit.Audit')">
        <template>
          <a @click="$refs.AuditModal.show(record.id)">审核</a>
        </template>
      </template>
    </list-page>
    <audit-modal ref="AuditModal" @ok="handleOk" :code-type="type"></audit-modal>
  </div>
</template>

<script>

import ListPage from '@/components/ListPage'
import AuditModal from '@/pages/customer-manage/civilization-outbound/modules/AuditModal'
import { defaultErrorMessage } from '@/utils/common'
import labels from '@/utils/labels'
import moment from 'moment'


const columns = [
  {
    title: '序号',
    width: 60,
    scopedSlots: { customRender: 'serial' },
  },
  {
    title: '申请状态',
    dataIndex: 'applyStatusName',
  },
  {
    title: '申请人',
    dataIndex: 'employeeName',
  },
  {
    title: '申请编码',
    dataIndex: 'applyNo',
  },
  {
    title: '出库状态',
    dataIndex: 'deliveryStatusName',
  },
  {
    title: '申请人机构',
    dataIndex: 'employeeOrgName'
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 180,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    ListPage,
    AuditModal
  },
  data () {
    return {
      materialList: [],
      queryParam: {},
      requestUrl: this.$api.customInfo.civilizedDeliveryInfo.getList,
      actionAuth: [],
      columns,
      applyStatusList:[],
      type:[],
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
    this.getCodeList()
    this.getMaterialList()
  },
  methods: {
    searchParams () {
      if (this.queryParam.date) {
        this.queryParam.applyStartTime = moment(this.queryParam.date[0]).format('YYYY-MM-DD')
        this.queryParam.applyEndTime = moment(this.queryParam.date[1]).format('YYYY-MM-DD')
      }
      delete this.queryParam.date
      return this.queryParam
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    getCodeList () {
      this.$getCodeList('1010', res => {
        this.applyStatusList = res
        res.map(m => {
          m.value === '1010-20' || m.value === '1010-30'?this.type.push(m):null
        })
      })
    },
    getMaterialList() {
      this.$get({
        url:this.$api.customInfo.civilizedDeliveryInfo.getMaterialClassList ,
        params: {
          isActive: true,
          isCulture: true,
          currentPage: 0,
          pageSize: 0,
        }
      }).then((res)=>{
        this.materialList = res.rows
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
        .finally(() => {this.confirmLoading = false })
    },
    handleOk () {
      this.$refs.listPage.refresh()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>