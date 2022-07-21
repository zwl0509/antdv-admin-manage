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
        <span slot="action" slot-scope="text,recoed">
          <template>
            <a v-if="recoed.status == '1080-10'" @click="startOrEnd(recoed,'1080-20')">完工</a>
            <a v-if="!recoed.status" @click="startOrEnd(recoed,'1080-10')">开工</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a>验收</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!-- 编辑施工计划表 -->
    <plan-table ref="PlanTable" @getTaskInfo="getTaskInfo"></plan-table>
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
  export default {
    components: { Gantt, Ellipsis, PlanTable},
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
          {
            title: '是否关键节点',
            dataIndex: 'isRequired',
            align: 'center',
            scopedSlots: {customRender: 'switch'}
          },
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
            width: 120,
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
      // 开工or完工
      startOrEnd(record, type) {
        this.confirmLoading = true
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.startOrEnd,
          data: {
            customerConstructionTaskInfoId: record.id,
            type
          },
        }).then((res)=> {
          this.getTableData()
        }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.confirmLoading = false })
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
      changeTabs(e) {
        if(e) {
          this.getGanttDetail()
        }else {
          this.getTableData()
        }
      },
      getTaskInfo(data, params) {
        const list = deepClone(data.resource)
        if(data.resource) {
          list?.forEach(item=> {
            item.customerId = this.id
            item.basicConstructionTaskId = item.id
            item.constructionTemplateId = params.templateId
            item.id = null
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
        this.confirmLoading = true
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.edit,
          data,
          needResponse: true
        }).then((res)=>{
          this.tabIndex = 0
          this.getTableData()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
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