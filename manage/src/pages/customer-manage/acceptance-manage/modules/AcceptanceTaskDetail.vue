<template>
  <a-modal 
    title="验收任务列表"
    :width="900"
    :visible="visible"
    :centered="true"
    @cancel="handleCancel"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <a-collapse v-model="activeKey" accordion>
      <a-collapse-panel v-for="(item, index) in dataList" :key="index.toString()" :header="item.title">
        <a-card v-for="(s_item, s_index) in item.detailVOS" :key="s_index" :hoverable="true" style="margin-bottom: 10px;">
          <p>{{ s_item.modifiedTime }}</p>
          <div style="display: flex;justify-content: space-between;margin-bottom: 10px;"> 
            <span>验收人: {{ s_item.relationName }}</span>
            <span v-if="s_item.status">整改状态: {{ s_item.statusName }}</span>
            <a v-if="s_item.rectificationId" @click="detail(s_item)">查看详情</a>
          </div>
          <div>
            <img v-for="(k_item, k_index) in s_item.attachInfos" :key="k_index" :src="k_item.path" class="imgs" @click="openImgs(k_item.path)">
          </div>
        </a-card>
        <div slot="extra">{{ item.surveyOptionName }}</div>
      </a-collapse-panel>
    </a-collapse>
    <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button v-if="actionChildAuth.includes('GoToAcceptance')" type="primary" @click="goToAcceptance">去验收</a-button>
      <a-button v-if="actionChildAuth.includes('UnqualifiedRectification')" type="primary" @click="unqualifiedRectification">不合格整改</a-button>
    </template>
    <!-- 验收=>问卷调查 -->
    <questionnaire-modal ref="QuestionnaireModal" @ok="getList"></questionnaire-modal>
    <!-- 不合格整改 -->
    <rectification ref="Rectification" @ok="getList"></rectification>
    <!-- 查看详情 -->
    <rectification-detail ref="RectificationDetail"></rectification-detail>
  </a-modal >
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import QuestionnaireModal from '@/pages/customer-manage/first-common-sea-pool/modules/QuestionnaireModal'
  import Rectification from './Rectification'
  import RectificationDetail from './RectificationDetail'

  export default {
    name: 'AcceptanceTaskDetail',
    components: { QuestionnaireModal, Rectification, RectificationDetail },
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
        previewVisible: false,
        previewImage: '',
        activeKey: ['0'],
        dataList: [],
        id: '',
        surveyId: '',
        customerId: ''
      }
    },
    methods: {
      show(recoed) {
        this.visible = true
        this.id = recoed.id 
        this.customerId = recoed.customerId
        this.surveyId = recoed.surveyId
        this.getList()
      },
      getList() {
        this.$get({
          url: this.$api.customInfo.acceptanceInfo.getCheckList,
          params: { customerConstructionTaskId: this.id }
        }).then((res) => {
          const data = res?.customerTaskCheckListVOS || []
          this.dataList = data
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 去验收
      goToAcceptance() {
        const surveyIds = []
        this.dataList.forEach(item=> {
          if(item.score == 0) {
            surveyIds.push(item.questionId)
          }
        })
        this.$refs.QuestionnaireModal.acceptanceTask(this.id, '1080-40', this.customerId, surveyIds)
      },
      detail(item) {
        this.$refs.RectificationDetail.show(item)
      },
      unqualifiedRectification(){
        const list = []
        this.dataList.forEach(item=> {
          if(item.score == 0) {
            list.push(item)
          }
        })
        this.$refs.Rectification.show(list, this.id)
      },
      openImgs(path) {
        this.previewImage = path
        this.previewVisible = true
      },
      cancelImage() {
        this.previewVisible = false
      },
      handleCancel() {
        this.id = ''
        this.surveyId = ''
        this.customerId = ''
        this.visible = false
        this.previewImage = ''
        this.dataList = []
        this.activeKey = ['0']
      }
    }
  }
</script>

<style lang="scss" scoped>
.imgs {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  cursor: pointer;
  border: 1px dashed #c9c9c9;
  object-fit: contain;
}
</style>