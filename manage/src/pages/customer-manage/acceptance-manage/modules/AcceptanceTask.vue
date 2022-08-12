<template>
  <!-- 验收任务 -->
  <a-modal 
    title="验收任务"
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
      <span slot="action" slot-scope="text, record">
        <template v-if="actionChildAuth.includes('AcceptanceDetail')">
          <a v-if="record.status" @click="$refs.AcceptanceTaskDetail.show(record)">查看验收</a>
          <a v-else @click="fillInQuestionnaire(record)">填写问卷</a>
        </template>
      </span>
    </a-table>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!-- 验收计划列表 -->
    <acceptance-task-detail ref="AcceptanceTaskDetail" :actionChildAuth="actionChildAuth"></acceptance-task-detail>
    <!-- 验收=>问卷调查 -->
    <questionnaire-modal ref="QuestionnaireModal" @ok="getList"></questionnaire-modal>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import AcceptanceTaskDetail from './AcceptanceTaskDetail.vue'
  import QuestionnaireModal from '@/pages/customer-manage/first-common-sea-pool/modules/QuestionnaireModal'

  export default {
    name: 'AcceptanceTask',
    components: { AcceptanceTaskDetail ,QuestionnaireModal},
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
            title: '任务名称',
            align: 'center',
            dataIndex: 'taskName'
          },
          {
            title: '任务状态',
            align: 'center',
            dataIndex: 'statusName'
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataList: [],
        id: ''
      }
    },
    methods: {
      show(id) {
        this.id = id 
        this.visible = true
        this.getList()
      },
      getList() {
        this.$get({
          url: this.$api.customInfo.acceptanceInfo.getCheckTypeList,
          params: { customerId: this.id }
        }).then((res) => {
          this.dataList = res || []
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 填写问卷
      fillInQuestionnaire(recoed) {
        this.$refs.QuestionnaireModal.acceptanceTask(recoed.id, '1080-40', recoed.customerId, recoed.surveyId)
      },
      handleCancel() {
        this.visible = false
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