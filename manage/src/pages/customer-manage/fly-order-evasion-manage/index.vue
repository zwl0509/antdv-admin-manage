<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      request-type="GET"
      :columns="columns"
      :request-url="requestUrl"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :query-params="searchParams"
      :loadAfterRender="loadAfterRender"
      :scroll="{ x: 2500 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户编码">
            <a-input v-model="queryParam.customerCode" autocomplete="off" placeholder="请输入客户编码"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="手机号">
            <a-input v-model="queryParam.mobileNumber" autocomplete="off" placeholder="请输入手机号"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="申请人">
            <a-input v-model="queryParam.applicantName" autocomplete="off" placeholder="请输入申请人" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="审核人">
            <a-input v-model="queryParam.reviewer" autocomplete="off" placeholder="请输入审核人" :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="selectedRowKeys.length && queryParam.type === '1040-10'" type="primary" icon="edit" @click="$refs.Review.show(selectedRowKeys,4)">批量飞单审核</a-button>
        <a-button v-if="selectedRowKeys.length && queryParam.type === '1040-20'" type="primary" icon="edit" @click="$refs.Review.show(selectedRowKeys,5)">批量逃单审核</a-button>
        <!-- <a-button type="primary" class="download" icon="cloud-download" @click="add()">导出数据</a-button> -->
        <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
          <a-tab-pane v-for="(item, index) in list" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
        </a-tabs>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <template slot="customerName" slot-scope="text">
        <ellipsis tooltip :length="20">{{ text }}</ellipsis>
      </template>
      <template slot="finalAddress" slot-scope="text">
        <ellipsis tooltip :length="20">{{ text }}</ellipsis>
      </template>
      <template slot="switch" slot-scope="text">
        <a-switch
          checked-children="是"
          un-checked-children="否"
          :checked="!!text" />
      </template>
      <span slot="action" slot-scope="text, record">
        <!-- 飞单 -->
        <template v-if="queryParam.type =='1040-10'">
          <template v-if="actionAuth.includes('FlyOrderEvasion.FlyerDetail')">
            <a @click="$refs.FlightOrderApply.show(record,2)">详情</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="record.status == '1010-10' && !record.isReborn && !record.lost && actionAuth.includes('FlyOrderEvasion.review')">
            <a @click="$refs.Review.show([record.id],1)">飞单审核</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="record.lost && actionAuth.includes('FlyOrderEvasion.FlyerResurrectionApply')">
            <template v-if="record.status =='1010-20' && !record.isReborn && record.lost && !record.onApplication">
              <a @click="$refs.FlyResurrectionApply.show(record,1)">复活申请</a>
              <a-divider type="vertical"/>
            </template>
          </template>
          <template v-if="record.status =='1010-10' && record.isReborn && record.lost && actionAuth.includes('FlyOrderEvasion.FlyResurrectionReview')">
            <a @click="$refs.Review.show([record.id],3)">复活审核</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('FlyOrderEvasion.CustomerTracking')">
            <a @click="$refs.CustomerTracking.shows(record, queryParam.type, actionAuth.includes('FlyOrderEvasion.CustomerTrackingCreate'))">客户跟踪</a>
          </template>
        </template>

        <!-- 逃单 -->
        <template v-else>
          <template v-if="actionAuth.includes('FlyOrderEvasion.EvasionDetail')">
            <a @click="$refs.EvasionApply.show(record.id,2)">详情</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="record.status == '1010-10' && !record.isReborn && !record.lost && actionAuth.includes('FlyOrderEvasion.EvasionReview')">
            <a @click="$refs.Review.show([record.id],2)">逃单审核</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="record.lost && actionAuth.includes('FlyOrderEvasion.EvasionResurrectionApply')">
            <template v-if="record.status =='1010-20' && !record.isReborn && record.lost && !record.onApplication">
              <a @click="$refs.EscapeResurrectionApply.show(record,1)">复活申请</a>
              <a-divider type="vertical"/>
            </template>
          </template>
          <template v-if="record.status =='1010-10' && record.isReborn && record.lost && actionAuth.includes('FlyOrderEvasion.EvasionResurrectionReview')">
            <a @click="$refs.Review.show([record.id],3)">复活审核</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('FlyOrderEvasion.CustomerTracking')">
            <a @click="$refs.CustomerTracking.shows(record, queryParam.type, actionAuth.includes('FlyOrderEvasion.CustomerTrackingCreate'))">客户跟踪</a>
          </template>
        </template>
      </span>
    </list-page>
    <customer-tracking ref="CustomerTracking" @ok="handleOk"></customer-tracking>
    <replace-personnel ref="ReplacePersonnel" @ok="handleOk"></replace-personnel>
    <review ref="Review" @ok="handleOk"></review>
    <replace-personnel ref="ReplacePersonnel" @ok="handleOk"></replace-personnel>
    <flight-order-apply ref="FlightOrderApply" @ok="handleOk"></flight-order-apply>
    <escape-resurrection-apply ref="EscapeResurrectionApply" @ok="handleOk"></escape-resurrection-apply>
    <fly-resurrection-apply ref="FlyResurrectionApply" @ok="handleOk"></fly-resurrection-apply>
    <evasion-apply ref="EvasionApply" @ok="handleOk"></evasion-apply>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { defaultErrorMessage ,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { Ellipsis } from '@/components'
  import CustomerTracking from '../high-sea-pool-customer/modules/CustomerTracking'
  import Review from './modules/Review'
  import EvasionApply from './modules/EvasionApply'
  import FlightOrderApply from './modules/FlightOrderApply'
  import FlyResurrectionApply from './modules/FlyResurrectionApply'
  import EscapeResurrectionApply from './modules/EscapeResurrectionApply'
  import ReplacePersonnel from '@/pages/customer-manage/high-sea-pool-customer/modules/ReplacePersonnel'
  export default {
    name: 'TableList',
    components: {
      Ellipsis,
      ListPage,
      CustomerTracking,
      ReplacePersonnel,
      Review,
      EvasionApply,
      FlightOrderApply,
      FlyResurrectionApply,
      EscapeResurrectionApply
    },
    data () {
      return {
        loading: false,
        // 查询参数
        queryParam: {
          type: '1040-10'
        },
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
              this.selectedRows = []
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps:(record)=> {
              return {
                props: {
                  disabled: !(record.status == '1010-10' && !record.isReborn),
                },
              }
            }
          },
        },
        selectedRowKeys: [],
        selectedRows: [],
        actionAuth:[],
        value: 0,
        list:[
          { value: 0, name: '飞单' },
          { value: 1, name: '逃单' },
        ],
        // 表头
        columns: [],
        requestUrl: this.$api.customInfo.flyOrEvasionInfo.getListPage,
        columns1: [
          {
            title: '序号',
            width: 80,
            dataIndex: 'serial',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '客户名称',
            dataIndex: 'customerName',
            scopedSlots: {
              customRender: 'customerName'
            }
          },
          {
            title: '手机号',
            dataIndex: 'mobileNumber'
          },
          {
            title: '飞单分类',
            dataIndex: 'classificationName'
          },
          {
            title: '装修地址',
            dataIndex: 'finalAddress',
            width: 200,
            scopedSlots: {
              customRender: 'finalAddress'
            }
          },
          {
            title: '飞单申请日期',
            dataIndex: 'applicationDate'
          },
          {
            title: '飞单申请人',
            dataIndex: 'applicantName'
          },
          {
            title: '飞单审核日期',
            dataIndex: 'auditDate'
          },
          {
            title: '飞单审核人',
            dataIndex: 'reviewerName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 220,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        columns2: [
          {
            title: '序号',
            width: 80,
            dataIndex: 'serial',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '客户名称',
            dataIndex: 'customerName',
            scopedSlots: {
              customRender: 'customerName'
            }
          },
          {
            title: '手机号',
            dataIndex: 'mobileNumber'
          },
          {
            title: '客户状态',
            dataIndex: 'customerType'
          },
          {
            title: '逃单分类',
            dataIndex: 'classificationName'
          },
          {
            title: '装修地址',
            dataIndex: 'finalAddress',
            width: 200,
            scopedSlots: {
              customRender: 'finalAddress'
            }
          },
          {
            title: '逃单申请日期',
            dataIndex: 'applicationDate',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '逃单申请人',
            dataIndex: 'applicantName'
          },
          {
            title: '逃单审核日期',
            dataIndex: 'auditDate',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '逃单审核人',
            dataIndex: 'reviewerName'
          },
          {
            title: '门店',
            dataIndex: 'storeName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 220,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        id:''
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
      this.columns = [...this.columns1]
    },

    methods: {
      loadData (parameter) {
        return new Promise(resolve => {
          resolve({
            rows: data,
            total: data.length
          })
        })
      },
      searchParams () {
        if(this.queryParam) {
          this.queryParam.type = !this.value?'1040-10':'1040-20'
        }
        return this.queryParam
      },
      loadAfterRender(arr) {
        arr.rows.forEach((item, index) => {
          item.index = index
        })
        return arr
      },
      BatchFlyApply(rows) {
        // 
        // const ids = []
        // rows?.forEach()
        this.$refs.Review.show(rows,4)
      },
      BatchEvasionApply(rows) {
        // 
        // const ids = []
        // rows?.forEach()
        this.$refs.Review.show(rows,5)
      },
      changeTabs(value,columns,columns2){
        this.value = value
        this.columns = value ? [...this.columns2] : [...this.columns1]
        this.$forceUpdate()
        this.handleOk()
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      add() {
      },
      handleEdit (record) {
        // console.log(record)
      },
      handleIsOpen(record) {
        // console.log(record)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.customInfo.flyOrEvasionInfo.delete,
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
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage.updateSelect([],[])
      },
      resetSearchForm () {
        this.queryParam = {}
      },
    },
    activated() {
      this.selectedRowKeys= []
      this.$refs.listPage && this.$refs.listPage.updateSelect([],[])
      this.handleOk()
    }
  }
</script>
<style lang="scss" scoped>
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