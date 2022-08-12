<template>
  <a-modal 
    title="停复工列表"
    :width="1100"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <div style="margin-bottom: 10px;">
        <a-button type="primary" icon="redo" class="refresh-btn" style="margin-right: 10px;" @click="getData">刷新</a-button>
        <a-button v-if="actionChildAuth.includes('StopWorkCreate') && isShowCreate" type="primary" icon="plus" @click="$refs.ResumeWorkModal.add('10')">新增停工计划</a-button>
      </div>
      <a-table
        rowKey="id"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList"
        :scroll="{y : 500}">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="taskStatus" slot-scope="text, record">
          <span 
            v-html="taskStatusName(record)" 
            :class="record.status == '1010-30' || record.child && record.child.status == '1010-30'? 'status-color':''"></span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="actionChildAuth.includes('StopOrResumeWorkDetail')">
            <a @click="$refs.ResumeWorkDetail.show(record)">查看</a>
          </template>
          <template v-if="!record.child">
            <a-divider v-if="record.status == '1010-10' || record.status == '1010-20'" type="vertical"/>
            <a v-if="record.status == '1010-10' && actionChildAuth.includes('StopWorkApply')" @click="$refs.ResumeWorkModal.add('30', record.id)">停工审核</a>
            <a v-else-if="record.status == '1010-20' && actionChildAuth.includes('ResumeWorkApply')" @click="$refs.ResumeWorkModal.add('20', record.id)">复工申请</a>
          </template>
          <template v-else>
            <a-divider v-if="record.child.status == '1010-10'" type="vertical"/>
            <a v-if="record.child.status == '1010-10' && actionChildAuth.includes('ResumeWorkAudit')" @click="$refs.ResumeWorkModal.add('40', record.child.id)">复工审核</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!-- 操作 -->
    <resume-work-modal ref="ResumeWorkModal" :customerId="customerId" :constructionPlanId="constructionPlanId" @ok="getData"></resume-work-modal>
    <!-- 查看详情 -->
    <resume-work-detail ref="ResumeWorkDetail"></resume-work-detail>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import {  dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ResumeWorkModal from './ResumeWorkModal.vue'
  import ResumeWorkDetail from './ResumeWorkDetail.vue'

  export default {
    name: 'ResumeWorkPlan',
    components: { ResumeWorkModal, ResumeWorkDetail },
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
        dataList: [],
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          { 
            title: '停工时间',
            align: 'center',
            dataIndex: 'stopDate'
          },
          { 
            title: '停工天数',
            align: 'center',
            dataIndex: 'stopDay'
          },
          { 
            title: '复工时间',
            align: 'center',
            dataIndex: 'child.actualStartDate'
          },
          {
            title: '任务状态',
            align: 'center',
            scopedSlots: { customRender: 'taskStatus' }
          },
          { 
            title: '编辑人',
            align: 'center',
            dataIndex: 'modifiedBy'
          },
          {
            title: '编辑时间',
            align: 'center',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          { 
            title: '操作',
            align: 'center',
            width: 140,
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        customerId: '',
        constructionPlanId: '',
        isShowCreate: true,
      }
    },
    methods: {
      show(record) {
        this.visible = true
        this.customerId = record.id
        this.constructionPlanId = record.constructionPlanId
        this.getData()
      },
      getData() {
        this.confirmLoading = true
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.getResumeWorkPlanList,
          data: { customerId: this.customerId },
        }).then((res) => {
          this.dataList = res
          this.isShowCreate = true
          for (let i = 0; i < this.dataList.length; i++) {
            if(!this.dataList[i].child && this.dataList[i].status == '1010-10') {
              this.isShowCreate = false
              break
            }
          }
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 任务状态
      taskStatusName(record) {
        let statusName = ''
        if(!record.child){
          if(record.status == '1010-10') statusName = '停工(待审核)'
          if(record.status == '1010-20') statusName = '待复工'
          if(record.status == '1010-30') statusName = '停工驳回'
        }else {
          if(record.child.status == '1010-10') statusName = '复工(待审核)'
          if(record.child.status == '1010-20') statusName = '已复工'
          if(record.child.status == '1010-30') statusName = '复工驳回'
        }
        return statusName
      },
      handleCancel() {
        this.visible = false
        this.customerId = ''
        this.dataList = []
        this.isShowCreate = true
      },
    }
  }
</script>

<style lang="scss" scoped>
.status-color {
  color: $primaryColor;
}
</style>