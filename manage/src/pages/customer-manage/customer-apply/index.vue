<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :query-params="searchParams"
      :scroll="{ x: 1800 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="申请人">
            <a-input v-model="queryParam.applicantName" autocomplete="off" placeholder="请输入申请人" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="审核状态">
            <a-select placeholder="请选择审核状态" allowClear v-model="queryParam.status">
              <a-select-option v-for="(item, index) in codeType.statusList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="queryParam.type !== '1056-40' && selectedRowKeys.length && actionAuth.includes('CustomerApply.BatchApply')" type="primary" icon="edit" @click="$refs.Apply.show(selectedRowKeys,queryParam.type,1)">批量审核</a-button>
        <a-tabs default-active-key="0" v-model="queryParam.type" @change="changeTabs">
          <a-tab-pane v-for="item in codeType.applyType" :key="item.value" :tab="item.name" :value="item.value"></a-tab-pane>
        </a-tabs>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="isShow" slot-scope="text">{{ text || '-' }}</span>
      <template slot="customerName" slot-scope="text">
        <ellipsis tooltip :length="20">{{ text }}</ellipsis>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('CustomerApply.Detail')">
          <a @click="$refs.createModal.show(record,'detail')">详情</a>
        </template>
        <template v-if="record.status == '1010-10' && actionAuth.includes('CustomerApply.Apply')">
          <template v-if="record.auditStatus == '1076-30' && queryParam.type == '1056-40'">
            <a-divider type="vertical"/>
            <a @click="review(record)">审核</a>
          </template>
          <template v-else-if="queryParam.type !== '1056-40'">
            <a-divider type="vertical"/>
            <a @click="review(record)">审核</a>
          </template>
        </template>
        <template v-if="record.customerSurveyInfo && actionAuth.includes('CustomerApply.QuestionnaireDetail')">
          <a-divider type="vertical" />
          <a @click="$refs.QuestionnaireModal.detail(record.customerSurveyInfo)">查看问卷</a>  
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"/>
    <apply ref="Apply" @ok="handleOk"></apply>
    <stage-apply ref="StageApply" @ok="handleOk"></stage-apply>
    <!-- 问卷调查 -->
    <questionnaire-modal ref="QuestionnaireModal" @ok="handleOk"></questionnaire-modal>
  </div>
</template>

<script>
  const columnsOs = [
    defaultTableColumns.serial,
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
      title: '申请人',
      dataIndex: 'applicantName'
    },
    {
      title: '申请类型',
      dataIndex: 'typeName'
    },
    {
      title: '审核状态',
      dataIndex: 'statusName'
    },
    {
      title: '设计师',
      dataIndex: 'designerName'
    },
    {
      title: '审核通过阶段',
      dataIndex: 'auditTypeName'
    },
    {
      title: '申请天数',
      dataIndex: 'daysOrNum',
      scopedSlots: { customRender: 'isShow'}
    },
    {
      title: '申请原因',
      dataIndex: 'applicationReason',
      scopedSlots: { customRender: 'ellipsis'}
    },
    {
      title: '申请时间',
      dataIndex:'applicationDate',
      customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import Apply from './modules/Apply'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import StageApply from './modules/StageApply'
  import { deepClone } from '@/utils/util'
  import QuestionnaireModal from '../first-common-sea-pool/modules/QuestionnaireModal'


  export default {
    name: 'TableList',
    components: {
      ActionModal,
      ListPage,
      Apply,
      Ellipsis,
      StageApply,
      QuestionnaireModal
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.customInfo.customerAuditInfo.getListPage,
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
                  disabled: record.status !== '1010-10',
                },
              }
            }
          },
        },
        selectedRowKeys: [],
        selectedRows: [],
        // 查询参数
        queryParam: {
          type: '1056-10'
        },
        searchParams: () => {
          return this.queryParam
        },
        // 表头
        columns: columnsOs,
        new_columns: [],
        actionAuth: [],
        codeType: {
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
          applyType: [],
          statusList: []
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
      this.selectedRowKeys= []
      this.selectedRows= []
    },
    methods: {
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      getCodeList() {
        const params = {
          typeList: ['1003','1010','1022','1023','1025','1026','1027','1028','1029','1030','1031','1036','1037','1038','1044','1056']
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
          this.codeType.replyOrderTag =  res['1036'] || []  // 回单标志
          this.codeType.trackType = res['1037'] || []  // 跟踪类型
          this.codeType.recordType = res['1038'] || []  // 记录类型
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
          this.codeType.applyType = res['1056'] || []  // 信息来源
          this.codeType.statusList = res['1010'] || [] // 审核状态
        })
      },
      changeTabs(e) {
        const new_column = []
        const list = deepClone(columnsOs)
        if (e == '1056-10') {
          list?.forEach(item=>{
            if(item.dataIndex !== 'auditTypeName' && item.dataIndex !== 'designerName') {
              new_column.push(item)
            }
          })
          this.columns = new_column
        }else if (e == '1056-20' || e == '1056-30'){
          list?.forEach(item=> {
            if (item.dataIndex !== 'daysOrNum' && item.dataIndex !== 'auditTypeName' && item.dataIndex !== 'designerName') {
              new_column.push(item)
            }
          })
          this.columns = new_column
        } else {
          list?.forEach(item=> {
            if (item.dataIndex !== 'daysOrNum') {
              new_column.push(item)
            }
          })
          this.columns = new_column
        }
        this.$forceUpdate()
        this.handleOk()
      },
      upDataColumns() {
        const new_column = []
        const list = deepClone(columnsOs)
        if(this.queryParam.type == '1056-10') {
          list?.forEach(item=>{
            if(item.dataIndex !== 'auditTypeName' && item.dataIndex !== 'designerName') {
              new_column.push(item)
            }
          })
          this.columns = new_column
        }
      },
      // 审核
      review(record) {
        if(this.queryParam.type == '1056-40'){
          this.$refs.StageApply.show(record)
        }else {
          this.$refs.Apply.show([record.id],this.queryParam.type,this.queryParam.type,record)
        }
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.allocation.customerAscriptionInfo.delete,
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
        this.selectedRowKeys= []
        this.selectedRows= []
        this.$refs.listPage.updateSelect([],[])
      },
      resetSearchForm () {
        this.queryParam = {
          type: this.queryParam.type,
          applicantName: '',
          status: undefined,
          customerName: ''
        }
      },
    },
    activated() {
      this.getCodeList()
      this.selectedRowKeys= []
      this.selectedRows= []
      this.upDataColumns()
    }
  }
</script>