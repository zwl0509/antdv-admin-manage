<template>
  <div class="home">
    <div class="content">
      <div class="left">
        <div class="title">
          <img class="images" :src="require('@/assets/images/icon-1.png')">
          <a @click="handleClick" class="text">待办事项</a>
        </div>
        <div class="body" v-if="dataList.length">
          <div class="table-title">
            <span class="serial">序号</span>
            <span class="name">任务名称</span>
            <span class="time">时间</span>
            <span class="action">操作</span>
          </div>
          <div class="item" v-for="(item,index) in dataList" :key="index">
            <span class="serial">{{ index + 1 }}</span>
            <span class="name">
              <ellipsis :length="16" tooltip>{{ item.applyTypeName }}</ellipsis>
            </span>
            <span class="time">{{ item.applicationDate }}</span>
            <span class="action">
              <span class="btn-detail">
                <template v-if="item.type === '1060-90'">
                  <a @click="$refs.OverhaulTask.show(item,'edit')">领任务</a>
                </template>
                <template v-else-if="item.type === '1060-60' || item.type === '1060-70' || item.type === '1060-100' ">
                  <a @click="$refs.TaskManage.show(item,'edit')">去办理</a>
                </template>
                <template v-else-if="item.type === '1060-50' || item.type === '1060-80' || item.type === '1060-110' || item.type === '1060-120'">
                  <a @click="toDoView(item)">去办理</a>
                </template>
                <template v-else-if="item.auditStatus == '1076-10' || item.auditStatus == '1076-20'">
                  <a @click="handleCustomerStage(item)">去办理</a>
                </template>
                <template v-else>
                  <a @click="$refs.ActionModal.show(item)">去办理</a>
                </template>
              </span>
              <a-divider type="vertical" />
              <span class="btn-detail">
                <a @click="ignore(item)">忽略</a>
              </span>
            </span>
          </div>
        </div>
        <div v-else class="others">
          <a-empty class="empty"/>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <img class="images" :src="require('@/assets/images/icon-2.png')">
          <a class="text">工作提醒</a>
        </div>
        <div class="others">
          <a-empty class="empty"/>
        </div>
      </div>
    </div>
    <div class="content1">
      <div class="left">
        <div class="title">
          <img class="images" :src="require('@/assets/images/icon-3.png')">
          <a class="text">系统公告</a>
        </div>
        <div class="others">
          <div class="others-box">
            <div class="action-down" @click="clickBtn">
              <img class="down-icon" :src="require('@/assets/images/action-1.png')" >
              <span>后台管理操作手册</span>
            </div>
            <div class="action-down" @click="clickAppBtn">
              <img class="down-icon" :src="require('@/assets/images/action-2.png')" >
              <span>APP操作手册</span>
            </div>
            <div class="action-down" @click="DownAppBtn">
              <img class="down-icon" :src="require('@/assets/images/action-3.png')" >
              <span>APP下载地址</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <img class="images" :src="require('@/assets/images/icon-4.png')">
          <a class="text">客户留言</a>
        </div>
        <div class="others">
          <a-empty class="empty"/>
        </div>
      </div>
    </div>
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
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
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
    name: 'Home',
    components:{
      ActionModal,
      Ellipsis,
      TaskManage,
      OverhaulTask,
      DetailModal,
      AcceptanceTask,
      ResumeWorkPlan,
      GanttModal,
      UploadAttach,
      QuestionnaireModal
    },
    data () {
      return {
        tableHeight: 0,
        dataList:[],
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
          statusList: [],
        },
        actionChildAuth: []
      }
    },
    created() {
      this.getCodeList()
    },
    methods: {
      getCodeList() {
        const params = {
          typeList: ['1003','1010','1022','1023','1025','1026','1027','1028','1029','1030','1031','1036','1037','1038','1044','1062']
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
          this.codeType.statusList = res['1010'] || []
          this.codeType.statusList.forEach((item, index)=>{ // 审核状态
            if(item.value == '1010-10' || item.value == '1010-40') {
              this.codeType.statusList.splice(index,1)
            }
          })
        })
      },
      getList(){
        this.selectLoading = true
        this.list = []
        const data = {
          currentPage: 1,
          pageSize: 6,
          isDeal: false,
          isAll:false
        }
        this.$post({
          url: this.$api.toDealWith.getListPage,
          data
        }).then(res => {
          this.selectLoading = false
          this.dataList = res.rows || []
          this.totalPage = Math.ceil(res.total / this.pageSize)
        }).catch(err => {
          this.isError = true
          this.errorMessage = err && err.message || '获取数据失败'
        })
      },
      toDoView(record) {
        if(record.type == '1060-80'){
          // 验收任务
          const arr = [this.getMenuChildAuth('AcceptanceManage'),!record.isView && this.updataStatus(record)]
          Promise.all(arr).then(res=> {
            this.$nextTick(()=> {
              this.$refs.AcceptanceTask.show(record.customerId)
            })
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
      handleClick(){
        this.$router.push('/to-do-manage')
      },
      clickBtn(){
        const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'guide.pdf'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          '后台管理操作手册'
        )
        document.body.appendChild(link)
        link.click()
      },
      clickAppBtn(){
        const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'user-manual.pdf'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          'APP操作手册'
        )
        document.body.appendChild(link)
        link.click()
      },
      DownAppBtn(){
        const url = 'http://222.92.142.228:9000/templates/red-ant.apk'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          'red-ant.apk'
        )
        document.body.appendChild(link)
        link.click()
      },
      // 忽略
      ignore(item) {
        this.loading = true
        this.$get({
          url: this.$api.toDealWith.ignore,
          params: { id: item.id },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.getList()
          }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleOk() {
        this.getList()
      }
    },
    activated() {
      this.getList()
    }
  }
</script>

<style scoped lang="scss">
  .others{
    height: calc((100vh - 347px)/2);
    overflow: hidden;
    .empty{
      padding-top: 20px;
      height: calc((100vh - 347px)/2)
    }
    .others-box {
      display: flex;
      flex-direction: row; 
      text-align: center;

      .action-down {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 150px;
        height: 100px;
        background: #FFFFFF;
        box-shadow: 2px 3px 4px 1px rgba(0,0,0,0.1);
        border-radius: 8px;
        margin-right: 20px;
        padding: 15px;
        span {
          color: #62978C;
        }
      }
    }
  }
  .serial{
    width: 50px;
    text-align: center;
  }
  .name{
    width: 200px;
    text-align: center;
  }
  .time{
    width: 120px;
    text-align: center;
  }
  .action{
    width: 120px;
    text-align: center;
  }
  .title{
    width: 100%;
    height: 40px;
    font-size: 16px;
    background-color: #f0f2f5;
    display: flex;
    align-items: center;
    padding-left: 10px;
    border-bottom:1px solid #DDDDDD;
    .text{
      color: #333333;
    }
    .text:hover{
      cursor:pointer;
    }
  }
  .body{
    width: 100%;
    height: calc((100vh - 345px)/2);
    font-size: 16px;
    border: none;
    text-align: center;
    .table-title{
      height: calc((100vh - 347px)/14);
      background-color: #ebecef;
      display: flex;
      justify-content: space-around;
      align-items: center;

    }
    .item{
      height: calc((100vh - 345px)/14);
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid #DDDDDD;
      &:last-child{
        border-bottom: none;
      }
    }
  }
  .home {
    width: 100%;
    height: calc(100vh - 223px);
    padding: 20px 0;
    position: relative;
    background-color: white;
    .content{
      margin-bottom: 18px;
    }
    .content,.content1{
      width: 100%;
      height: 50%;
      display: flex;
      padding: 0 20px;
      .left{
        width: 50%;
        background-color: white;
        border: 1px solid #DDDDDD;
      }
      .right{
        margin-left: 20px;
        width: 50%;
        border: 1px solid #DDDDDD;
      }
    }
    .content1{
      width: 100%;
      height: 50%;
      display: flex;
      padding: 0 20px;
      .left{
        width: 50%;
        height: 100%;
        .others{
          padding:15px 15px;
          font-size: 15px;
        }
      }
      .right{
        margin-left: 20px;
        width: 50%;
        height: 100%;
      }
    }
  }
  .images {
    margin-right: 5px;
    width: 16px;
    height: 16px;
  }
  .down-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
  }
</style>
