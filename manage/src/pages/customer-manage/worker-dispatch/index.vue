<template>
  <div>
    <!-- 工人派工 -->
    <list-page
      ref="listPage"
      class="small-table"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :scroll="{ x:2500 }">
      <template slot="$search">
        <a-col :md="6" :xs="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="小区名称">
            <a-input v-model="queryParam.areaName" autocomplete="off" placeholder="请输入小区名称" :max-length="11"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否期房客户">
            <a-select placeholder="请选择期房客户" allowClear v-model="queryParam.future">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户类型">
            <a-select placeholder="请选择客户类型" allowClear v-model="queryParam.relationship">
              <a-select-option v-for="(item, index) in codeType.relationshipType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="了解公司途径">
            <a-select placeholder="请选择了解公司途径" allowClear v-model="queryParam.knowCoWay">
              <a-select-option v-for="(item, index) in codeType.knowCoWayType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="actionAuth.includes('WorkerDispatch.Create')" type="primary" icon="plus" @click="$refs.ActionModal.add()">新建</a-button>
        <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
          <a-tab-pane v-for="(item, index) in stateList" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
        </a-tabs>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('WorkerDispatch.Detail')">
          <a @click="$refs.ActionModal.show('detail')">详情</a>
          <a-divider type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('WorkerDispatch.Dispatch')">
          <a @click="$refs.Dispatch.show(record.id)">派工</a>
          <a-divider type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('WorkerDispatch.Dispatch')">
          <a @click="$refs.WorkerVerify.show(record.id)">工人验证</a>
          <a-divider type="vertical" v-if="actionAuth.includes('BudgetManage.Delete')"/>
        </template>
        <template v-if="actionAuth.includes('BudgetManage.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="ActionModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"/>
    <dispatch ref="Dispatch" @ok="handleOk"></dispatch>
    <worker-verify ref="WorkerVerify"></worker-verify>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import Dispatch from './modules/Dispatch'
  import WorkerVerify from './modules/WorkerVerify'

  export default {
    name: 'TableList',
    components: {
      WorkerVerify,
      Dispatch,
      ActionModal,
      ListPage
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.customInfo.customerCommon.getListPage,
        // 查询参数
        queryParam: {
          type: '1033-80',
          allData: false,
          menuId: this.$route.meta.id
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
          // {
          //   title: '门店',
          //   width: 150,
          //   dataIndex: 'storeName',
          //   scopedSlots: { customRender: 'ellipsis'}
          // },
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
        value: 0,
        stateList:[
          {name: '未完工',value: 0,},
          {name: '已完工',value: 1,}
        ],
        typeList:[],
        codeType: {
          customerType:[],
          houseType: [],
          roomType:[],
          genderType: [],
          infoSourceType: [],
          knowCoWayType: [],
          marketingType: [],
          relationshipType: [],
          decorationStyleType: [],
          focusOnType: [],
          knownInfoType: [],
          infoChannelType:[],
          trackType: [],
          recordType: [],
          replyOrderTag:[],
          industryInvolvedType: [],
          ageRangeType: []
        },
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
      changeTabs(value) {
        this.value = value
        this.handleOk()
        this.$forceUpdate()
      },
      getCodeList() {
        const params = {
          typeList: ['1003','1022','1023','1025','1026','1027','1028','1029','1030','1031','1033','1034','1035','1036','1037','1038','1044']
        }
        this.$getCodesList(params, res => {
          this.codeType.genderType = res['1003'] || [] // 性别
          this.codeType.relationshipType = res['1022'] || [] // 客户类型
          this.codeType.marketingType = res['1023'] || [] // 营销类型
          this.codeType.houseType = res['1025'] || []  // 房型
          this.codeType.roomType = res['1026'] || [] // 户型
          this.codeType.decorationStyleType = res['1027'] || []  // 装修风格
          this.codeType.infoChannelType = res['1028'] || [] // 信息渠道
          this.codeType.knowCoWayType = res['1029'] || []  // 了解公司途径
          this.codeType.knownInfoType = res['1030'] || []  // 客户了解信息
          this.codeType.focusOnType = res['1031'] || []  // 客户重点关注
          this.codeType.customerType = res['1033'] || [] // 客户阶段
          this.codeType.industryInvolvedType =  res['1034'] || []  // 所属行业
          this.codeType.ageRangeType =  res['1035'] || []  // 年龄区间
          this.codeType.replyOrderTag =  res['1036'] || []  // 回单标志
          this.codeType.trackType = res['1037'] || []  // 跟踪类型
          this.codeType.recordType = res['1038'] || []  // 记录类型
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
        })
      },
      searchParams(){
        return { ...this.queryParam }
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
        this.queryParam = {}
      },
      clearId () {
        this.targetId = null
      }
    },
    activated() {
      this.getCodeList()
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
