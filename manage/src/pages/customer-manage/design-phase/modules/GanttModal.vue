<template>
  <a-modal
    title="查看施工计划图"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-button type="primary" icon="edit" style="float:right;margin-top: 8px;" @click="editConstructionPlan">编辑施工计划</a-button>
      <a-tabs v-model="tabIndex" @change="changeTabs">
        <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
      </a-tabs>
      <Gantt v-if="tabIndex == 1" ref="Gantt" class="left-container"></Gantt>
      <a-table
        v-if="tabIndex == 0"
        rowKey="id"
        class="small-table"
        ref="Table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList"
        :scroll="{ y : 420 }">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
        <span slot="ellipsis" slot-scope="text">
          <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="action" slot-scope="text, recoed, index">
          <template v-if="recoed.status !== '1080-20' && actionChildAuth.includes('Urge')">
            <a @click="customerTaskUrge(recoed)">催办</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionChildAuth.includes('ConstructionPlanDetail')">
            <a @click="constructionTaskDetail(recoed)">查看</a>
            <a-divider v-if="(!recoed.status && index == 0) || recoed.status == '1080-10' " type="vertical"/>
          </template>
          <template>
            <a v-if="!recoed.status && index == 0 && actionChildAuth.includes('StartWork')" @click="constructionAction(recoed,'1080-10')">开工</a>
            <a v-else-if="recoed.status == '1080-10' && actionChildAuth.includes('FinishWork')" @click="constructionAction(recoed,'1080-20')">完工</a>
            <a-divider v-if="recoed.status == '1080-10' && actionChildAuth.includes('Delay')" type="vertical"/>
          </template>
          <template v-if="recoed.status == '1080-10' && actionChildAuth.includes('Delay')">
            <a class="ant-btn-background-ghost ant-btn-danger" @click="constructionAction(recoed,'1080-30')">延期</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!-- 编辑施工计划表 -->
    <plan-table ref="PlanTable" @getTaskInfo="getTaskInfo"></plan-table>
    <!-- 开工、完工-->
    <construction-action-modal ref="ConstructionActionModal" @ok="handleOk"></construction-action-modal>
    <!-- 验收=>问卷调查 -->
    <questionnaire-modal ref="QuestionnaireModal" @ok="handleOk"></questionnaire-modal>
    <!-- 查看施工计划 -->
    <construction-task-detail ref="ConstructionTaskDetail"></construction-task-detail>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import PlanTable from './PlanTable'
  import Gantt from '@/components/Gentt/index'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  import { deepClone } from '@/utils/util'
  import ConstructionActionModal from './ConstructionActionModal'
  import QuestionnaireModal from '@/pages/customer-manage/first-common-sea-pool/modules/QuestionnaireModal'
  import ConstructionTaskDetail from './ConstructionTaskDetail.vue'
  export default {
    components: { Gantt, Ellipsis, PlanTable, ConstructionActionModal, QuestionnaireModal, ConstructionTaskDetail },
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
        id: '',
        tabList: [{ value: 0, name: '施工计划表'}, { value: 1, name: '施工计划图'}],
        columns:[
          {
            title: '序号',
            width: 60,
            align: 'center',
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '任务名称',
            align: 'center',
            width: 150,
            dataIndex: 'taskName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '工期',
            align: 'center',
            width: 60,
            dataIndex: 'duration'
          },
          {
            title: '前置任务',
            align: 'center',
            dataIndex: 'startTaskName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '后置任务',
            align: 'center',
            dataIndex: 'endTaskName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          // {
          //   title: '是否关键节点',
          //   dataIndex: 'isRequired',
          //   align: 'center',
          //   scopedSlots: {customRender: 'switch'}
          // },
          {
            title: '预计开始时间',
            align: 'center',
            dataIndex: 'estimateStartTime',
          },
          {
            title: '预计结束时间',
            align: 'center',
            dataIndex: 'estimateEndTime',
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
            scopedSlots: {customRender: 'action'}
          }
        ],
        dataList: [],
        selectedRowKeys: [],
        selectedRows: [],
        tabIndex: 0,
        tasks: { data: [], links: [] },
      }
    },
    methods: {
      show(record) {
        this.id  = record.id
        this.visible = true
        this.getTableData()
      },
      // 计划表
      getTableData() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.construction.customerConstructionTaskInfo.getTableData,
          params: {customerId : this.id }
        }).then((res)=> {
          this.dataList = res
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 甘特图
      getGanttDetail() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.construction.customerConstructionTaskInfo.getGanttDetail,
          params: {customerId : this.id },
        }).then((res)=> {
          this.tasks = res
          this.tasks.data.forEach(el=> {
            delete el.end_date
          })
          this.$nextTick(()=> {
            this.$refs.Gantt.clearAll()
            this.$refs.Gantt.config(this.tasks)
          })
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 施工操作页面跳转
      constructionAction(record, type) {
        if(type !== '1080-40') {
          this.$refs.ConstructionActionModal.show(record, type, this.id)
        }else {
          // 验收
          this.$refs.QuestionnaireModal.taskCheck(record, type, this.id, '1078-10')
        }
      },
      // 编辑施工计划
      editConstructionPlan() {
        const list = []
        this.dataList?.forEach(item=> {
          list.push({
            constructionTemplateId: item.constructionTemplateId,
            basicConstructionTaskId: item.basicConstructionTaskId,
            actualStartTime: item.actualStartTime,
            estimateStartTime: item.estimateStartTime,
          })
        })
        this.$refs.PlanTable.detailEdit(list)
      },
      // 催办
      customerTaskUrge(record) {
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.customerTaskUrge,
          data: { customerConstructionTaskId: record.id },
          needResponse: true
        }).then(res=> {
          this.handleOk()
          this.$notification.success({
            message: labels.OPERATE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
      },
      // 施工计划任务查看
      constructionTaskDetail(recoed) {
        this.$refs.ConstructionTaskDetail.show(recoed)
      },
      changeTabs(e) {
        if(e) {
          this.getGanttDetail()
        }else {
          this.getTableData()
        }
      },
      // 处理gantt数据回填编辑，并存上一个数据ID。
      getTaskInfo(data, params) {
        const list = deepClone(data.resource)
        const oldDataList = deepClone(this.dataList)
        if(data.resource) {
          oldDataList.forEach(item=> {
            list?.forEach(info=> {
              info.basicConstructionTaskId = info.uid
              info.customerId = this.id
              info.constructionTemplateId = params.templateId
              if(info.id == item.basicConstructionTaskId) {
                info.id = item.id
              }
            })
          })
          this.save(list)
        }else {
          this.$notification.warning({
            message: labels.HINT,
            description: '请生成施工计划!!!'
          })
        }
      },
      // 编辑后，保存施工计划
      save(data) {
        data.forEach(el => {
          if(el.id == el.basicConstructionTaskId) el.id = null
        })
        this.confirmLoading = true
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.edit,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleOk()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleOk(){
        this.tabIndex = 0
        this.getTableData()
      },
      handleCancel () {
        this.id = ''
        this.visible = false
        this.confirmLoading = false
        this.tabIndex = 0
        this.tasks = { data: [], links: [] }
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