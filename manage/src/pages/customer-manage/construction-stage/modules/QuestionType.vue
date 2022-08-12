<template>
  <!-- 巡检列表 -->
  <a-modal
    title="巡检列表"
    :width="900"
    :visible="visible"
    :centered="true"
    @cancel="handleCancel"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <a-table
      rowKey="id"
      class="small-table"
      :columns="columns"
      :pagination="false"
      :dataSource="dataList"
      :scroll="{y : 500}">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action" slot-scope="text, record, index">
        <template v-if="status === 'detail'">
          <a @click="fillInQuestionnaire(record, index)">查看问卷</a>
          <a-divider type="vertical" v-if="!record.isSend"/>
          <a v-if="!record.isSend" @click="questionRectify(record.customerSurveyInfo)">不合格整改</a>
        </template>
        <template v-else>
          <a v-if="!record.surveyStatusName" @click="fillInQuestionnaire(record,index)">填写问卷</a>
          <a v-else @click="questionEdit(record, index)">问卷编辑</a>
        </template>
      </span>
    </a-table>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button v-if="status !== 'detail'" type="primary" @click="handleSubmit">提交</a-button>
    </template>
    <!-- 问卷详情 -->
    <question-detail ref="QuestionDetail" @getInfo="getInfo"></question-detail>
    <!-- 问卷不合格整改 -->
    <question-rectify ref="QuestionRectify" @getQuestionRectify="getQuestionRectify"></question-rectify>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import QuestionDetail from './QuestionDetail'
  import QuestionRectify from './QuestionRectify'
  import { defaultErrorMessage } from '@/utils/common'
  const data = [
    { id: 1, surveyTypeName:'软装管测量反馈', surveyType:'1078-50'},
    { id: 2, surveyTypeName:'生活管测量反馈', surveyType:'1078-60'},
    { id: 3, surveyTypeName:'文明施工平层', surveyType:'1078-70'},
    { id: 4, surveyTypeName:'文明施工别墅', surveyType:'1078-80'}
  ]
  export default {
    name: 'QuestionType',
    components: { QuestionRectify, QuestionDetail },
    props: {
      actionChildAuth:{
        type: Array,
        default: ()=> []
      }
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        columns: [
          {
            title: '序号',
            width: 80,
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '问卷名称',
            align: 'center',
            dataIndex: 'surveyTypeName'
          },
          {
            title: '问卷状态',
            align: 'center',
            dataIndex: 'surveyStatusName'
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            width: 200,
            scopedSlots: { customRender: 'action' }
          },
        ],
        dataList: [],
        id: '',
        customerId: '',
        saveList: [],
        status: '',
        tableIndex: -1,
        questionList: [],
        inspectionId:''
      }
    },
    methods: {
      add(id) {
        this.customerId = id
        this.visible = true
        this.status = ''
        this.dataList = [ ...data ]
      },
      detail(record,type,customerId){
        this.visible = true
        this.customerId = customerId
        this.status = type
        this.inspectionId = record.id
        this.getDetail(record.id)
      },
      getDetail(inspectionId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerInspectionRecordInfo.getQuestionInfo,
          params: { inspectionId},
        }).then((res)=>{
          const list  = [ ...res ]
          const filterList = []
          list?.forEach(i=>{
            filterList.push(i.surveyType)
          })
          const newList = list.filter(item=> { return filterList.includes(item.surveyType) })
          this.dataList = newList
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      //获取问卷信息
      getInfo(params){
        if (this.tableIndex !== -1){
          const item = { ...this.dataList[this.tableIndex]}
          item.customerSurveyInfo = params
          item.surveyStatusName = '已检'
          this.$set(this.dataList, this.tableIndex, item)
        }
      },
      //问卷不合格整改
      questionRectify(record){
        this.$refs.QuestionRectify.show(record,this.inspectionId)
      },
      //获取整改信息
      getQuestionRectify(){
        this.handleCancel()
        this.$emit('ok')
      },
      // 填写问卷
      fillInQuestionnaire(record, index) {
        this.tableIndex = index
        if (this.status === 'detail'){
          const data = this.dataList[index].customerSurveyInfo
          this.$refs.QuestionDetail.detail(data)
        }else {
          this.$refs.QuestionDetail.show(record.surveyType,this.customerId)
        }
      },
      // 问卷编辑
      questionEdit(record, index) {
        this.tableIndex = index
        this.$refs.QuestionDetail.edit(record, this.customerId)
      },
      // 问卷新增
      questionCreate(record, index) {
        this.tableIndex = index
        this.$refs.QuestionDetail.show(record.surveyType, this.customerId)
      },
      handleSubmit(){
        const list = []
        this.dataList.forEach(i=>{
          if (i.customerSurveyInfo !== undefined){
            list.push(i.customerSurveyInfo)
          }
        })
        const data = {
          customerId: this.customerId,
          type: '1082-20',
          surveyInfoDTOS : list
        }
        this.save(data)
      },
      save(data){
        this.$post({
          url: this.$api.customInfo.customerInspectionRecordInfo.editStandard,
          data,
          needResponse: true
        }).then(res => {
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.confirmLoading = false
        this.dataList = []
        this.attachInfos = []
        this.tableIndex = -1
      },
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