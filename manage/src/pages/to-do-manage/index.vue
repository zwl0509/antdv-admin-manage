<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :query-params="searchParams"
      :request-url="requestUrl"
      request-type="POST"
      :customRow="customRow">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="任务名称">
            <a-input v-model="queryParam.applyTypeName" autocomplete="off" placeholder="请输入任务名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否处理">
            <a-select placeholder="请选择是否处理" allowClear v-model="queryParam.isDeal">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.type === '1060-90'">
          <a @click="$refs.OverhaulTask.show(record,'detail')" v-if="record.isDeal">查看</a>
          <a @click="$refs.OverhaulTask.show(record,'edit')" v-if="!record.isDeal">领任务</a>
        </template>
        <template v-else-if="record.type === '1060-60' || record.type === '1060-70' || record.type === '1060-100' ">
          <a @click="$refs.TaskManage.show(record,'detail')" v-if="record.isDeal">查看</a>
          <a @click="$refs.TaskManage.show(record,'edit')" v-if="!record.isDeal">去办理</a>
        </template>
        <template v-else-if="record.type === '1060-50' || record.type === '1060-80' || record.type === '1060-110' || record.type === '1060-120'">
          <a @click="toDoView(record)" v-if="record.isDeal">查看</a>
          <a @click="toDoView(record)" v-if="!record.isDeal">去办理</a>
        </template>
        <template v-else-if="record.auditStatus == '1076-10' || record.auditStatus == '1076-20'">
          <a @click="customerStageDetail(record)" v-if="record.isDeal">查看</a>
          <a @click="handleCustomerStage(record)" v-if="!record.isDeal">去办理</a>
        </template>
        <template v-else>
          <a @click="$refs.DetailModal.show(record)" v-if="record.isDeal">查看</a>
          <a @click="$refs.ActionModal.show(record)" v-if="!record.isDeal">去办理</a>
        </template>
      </span>
    </list-page>
    <action-modal ref="ActionModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
    <detail-modal ref="DetailModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></detail-modal>
    <overhaul-task ref="OverhaulTask" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></overhaul-task>
    <task-manage ref="TaskManage" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></task-manage>
    <!-- 验收任务 -->
    <acceptance-task ref="AcceptanceTask" @ok="handleOk" :actionChildAuth="actionChildAuth"></acceptance-task>
    <!-- 施工计划图 == 完工管理 -->
    <gantt-modal ref="GanttModal" @ok="handleOk" :actionChildAuth="actionChildAuth"></gantt-modal>
    <!-- 停复工管理 -->
    <resume-work-plan ref="ResumeWorkPlan" @ok="handleOk" :actionChildAuth="actionChildAuth"></resume-work-plan>
    <!-- 移交设计部 => 上传附件  -->
    <upload-attach ref="UploadAttach" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></upload-attach>
    <!-- 移交设计部 => 填写问卷 -->
    <questionnaire-modal ref="QuestionnaireModal" @ok="handleOk"></questionnaire-modal>
  </div>
</template>

<script>
  import { defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import ActionModal from '@/pages/to-do-manage/modules/ActionModal'
  import DetailModal from '@/pages/to-do-manage/modules/DetailModal'
  import OverhaulTask from '@/pages/to-do-manage/modules/OverhaulTask'
  import TaskManage from '@/pages/to-do-manage/modules/TaskManage'
  import AcceptanceTask from '@/pages/customer-manage/acceptance-manage/modules/AcceptanceTask.vue'
  import ResumeWorkPlan from '@/pages/customer-manage/construction-stage/modules/ResumeWorkPlan'
  import GanttModal from '@/pages/customer-manage/design-phase/modules/GanttModal'
  import UploadAttach from '@/pages/customer-manage/first-common-sea-pool/modules/UploadAttach.vue'
  import QuestionnaireModal from '@/pages/customer-manage/first-common-sea-pool/modules/QuestionnaireModal'

  export default {
    name: 'ToDoList',
    components: {
      TaskManage,
      OverhaulTask,
      DetailModal,
      ListPage,
      ActionModal,
      AcceptanceTask,
      ResumeWorkPlan,
      GanttModal,
      UploadAttach,
      QuestionnaireModal
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.toDealWith.getListPage,
        // 表头
        queryParam:{
          isAll:true
        },
        columns: [
          {
            title: '序号',
            width: 80,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '任务名称',
            dataIndex: 'applyTypeName'
          },
          {
            title: '申请人姓名',
            align: 'center',
            dataIndex: 'assignName'
          },
          {
            title: '处理人姓名',
            align: 'center',
            dataIndex: 'executorName'
          },
          {
            title: '是否处理',
            dataIndex: 'isDeal',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '创建日期',
            dataIndex: 'showDate'
          },
          {
            title: '操作',
            width: 200,
            dataIndex: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }

        ],
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
        id:'',
        actionChildAuth: [],
        isView: false
      }
    },
    created () {
      // const key = 'ConstructionStage'
    },
    methods: {
      getCodeList() {
        const params = {
          typeList: ['1003','1010','1022','1023','1025','1026','1027','1028','1029','1030','1031','1036','1037','1038','1044','1062','1071','1072']
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
          this.codeType.applyType = res['1062'] || []  // 信息来源
          this.codeType.serviceType = res['1071'] || [] // 客服类型
          this.codeType.complaintType = res['1072'] || [] // 投诉类别
          this.codeType.statusList = res['1010'] || [] 
          this.codeType.statusList.forEach((item, index)=>{ // 审核状态
          if(item.value == '1010-10' || item.value == '1010-40') {
              this.codeType.statusList.splice(index,1)
            }
          })
        })
      },
      searchParams () {
        return { ...this.queryParam }
      },
      toDoView(record) {
        if(record.type == '1060-80'){
          // 验收任务
          const arr = [this.getMenuChildAuth('AcceptanceManage'),!record.isView && this.updataStatus(record)]
          Promise.all(arr).then(res=> {
            this.$refs.AcceptanceTask.show(record.customerId)
          })
        }else if (record.type == '1060-120'){ 
          // 停复工管理
          const arr = [this.getMenuChildAuth('ConstructionStage'),!record.isView && this.updataStatus(record)]
          const params = { 
            id: record.customerId,
            constructionPlanId: record.customerPlanId,
          }
          Promise.all(arr).then(res=> {
            this.$refs.ResumeWorkPlan.show(params)
          })
        }else if (record.type == '1060-50' || record.type == '1060-110') {
          // 查看施工计划
          const arr = [this.getMenuChildAuth('ConstructionStage'),!record.isView && this.updataStatus(record)]
          const params = {
            id :record.customerId
          }
           Promise.all(arr).then(res=> {
            this.$refs.GanttModal.show(params)
          })
        }
      },
      // 客户阶段处理
      handleCustomerStage(record) {
        if (record.auditStatus == '1076-10'){
          const params = { 
            id: record.applyRelationId,
            applicationId: record.applyId,
          }
          !record.isView && this.updataStatus(record)
          this.$refs.UploadAttach.show(params, true)
        }else if (record.auditStatus == '1076-20') {
          const params = { 
            id: record.applyRelationId,
            applicationId: record.applyId,
          }
          let surveyType  = ''
          if (record.customerType == '1033-40')  surveyType = '1078-10'
          if (record.customerType == '1033-50')  surveyType = '1078-30'
          if (record.customerType == '1033-55')  surveyType = '1078-40'
          !record.isView && this.updataStatus(record)
          this.$refs.QuestionnaireModal.show(params, surveyType)
        }
      },
      // 客户阶段查看
      customerStageDetail(record) {
        if (record.auditStatus == '1076-10'){
          const params = { 
            id: record.applyRelationId,
            applicationId: record.applyId,
          }
          !record.isView && this.updataStatus(record)
          this.$refs.UploadAttach.detail(params, true)
        }else if (record.auditStatus == '1076-20') {
          !record.isView && this.updataStatus(record)
          this.getAuditDetail(record.applyId)
        }
      },
      // 获取审核详情信息
      getAuditDetail(applicationId) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerAuditInfo.getDetail,
          params: { applicationId}
        }).then(res=> {
          const data = { ...res }
          this.$refs.QuestionnaireModal.detail(data.customerSurveyInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 更新状态
      updataStatus(record) {
        this.$get({
          url: this.$api.toDealWith.isView,
          params: { id: record.id },
          needResponse: true
        }).then(res => { this.handleOk() })
      },
      // 获取菜单权限
      getMenuChildAuth(key) {
        this.$store.dispatch('GetIdByKey', key).then(res=> {
          const arr = []
          res.forEach(item => {
            arr.push(item.key.split('.')[1])
          })
          this.actionChildAuth = arr
        }).catch(err=> { defaultErrorMessage(err, '获取页面权限失败')})
      },
      resetSearchForm () {
        this.queryParam = { }
      },
      customRow (row) {
        return {
          class: row.isView === true ? '' : 'test',
          style: { backgroundColor : row.isView === true ? 'unset' : '#e0e0e0'},
        }
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
    },
    activated() {
      this.getCodeList()
      this.handleOk()
    }
  }
</script>