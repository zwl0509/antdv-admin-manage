<template>
  <a-modal
    title="不合格整改"
    :width="900"
    :visible="visible"
    :centered="true"
    :mask-closable="false"
    @cancel="handleCancel">
    <a-card style="margin-bottom: 10px" v-for="(item, index) in dataList" :key="index" :value="item.id" :hoverable="true">
      <div slot="title" style="display: flex;justify-content: space-between;align-items: center">
        <span>{{ item.title }}</span>
      </div>
      <a-row>
        <a-col :span="12" style="margin-bottom: 10px">
          <a-col :span="6">
            <div class="left-content">负责人<span style="color:red;">*</span> :
            </div>
          </a-col>
          <a-col :span="16">
            <a-select
              style="width: 100%"
              v-model="item.chargePersonId"
              placeholder="请选择负责人"
              @dropdownVisibleChange="handlersSelect(index)">
              <a-select-option v-for="(s_item, s_index) in item.handlersList" :value="s_item.id" :key="s_index">
                {{ s_item.employeeName }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-col>
        <a-col :span="24" style="margin-bottom: 10px">
          <a-col :span="3">
            <div class="left-content">描述: </div>
          </a-col>
          <a-col :span="21">
            <a-textarea :rows="4" v-model="item.content" disabled autocomplete="off" />
          </a-col>
        </a-col>
        <a-col :span="24">
          <a-col :span="3">
            <div class="left-content">图片: </div>
          </a-col>
          <a-col :span="21">
            <img v-for="(k_item, k_index) in item.attachInfos" :key="k_index" :src="k_item.path" class="imgs" @click="openImgs(k_item.path)">
          </a-col>
        </a-col>
      </a-row>
    </a-card>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleSubmit">提交</a-button>
    </template>
    <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
    <!-- 选择抄送人 -->
    <reminder-select ref="ReminderSelect" @getReminders="getReminders"></reminder-select>
    <!-- 选择负责人 -->
    <handlers-select ref="HandlersSelect" @getHandlers="getHandlers" ></handlers-select>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { deepClone } from '@/utils/util'
  import { defaultErrorMessage } from '@/utils/common'
  import ReminderSelect from '@/pages/customer-service-manage/complaint-record/modules/ReminderSelect'
  import HandlersSelect from '@/pages/customer-service-manage/complaint-record/modules/HandlersSelect'
  export default {
    name: 'QuestionRectify',
    components: { ReminderSelect, HandlersSelect },
    data() {
      return {
        visible: false,
        previewImage: '',
        previewVisible: false,
        dataList: [],
        tableIndex: -1,
        taskId: ''
      }
    },
    methods: {
      show (list, id) {
        this.taskId = id
        const data = deepClone(list.surveyQuestionVOList)
        data?.forEach(el => {
          el.title = el.questionTitle
          el.content = el.surveyOptionsVOList[0].content
        })
        this.dataList = data
        this.visible = true
      },

      openImgs(path){
        if(path){
          this.previewImage = path
          this.previewVisible = true
        }
      },
      cancelImage( ) {
        this.previewVisible = false
      },
      // 更新数组
      updateShowTable() {
        this.$forceUpdate()
      },
      // 选择抄送人
      reminderSelect(index) {
        this.tableIndex = index
        this.$refs.ReminderSelect.add()
      },
      // 选择负责人
      handlersSelect(index) {
        this.tableIndex = index
        this.$refs.HandlersSelect.add()
      },
      // 获取负责人
      getHandlers(data) {
        if(this.tableIndex !== -1 ) {
          const item = { ...this.dataList[this.tableIndex]}
          item.chargePersonId= data.handlers[0]
          item.handlersList= data.handlersList
          this.$set(this.dataList,this.tableIndex, item)
        }
      },
      // 获取抄送人
      getReminders(data) {
        if(this.tableIndex !== -1 ) {
          const item = { ...this.dataList[this.tableIndex] }
          item.notifyIds = data.reminders
          item.remindersList =  data.remindersList
          this.$set(this.dataList,this.tableIndex, item)
        }
      },
      handleSubmit() {
        const list = []
        this.dataList.forEach((item,index)=> {
          const attachIds = []
          item?.attachInfos.forEach(info=> {
            attachIds.push(info.id)
          })
          const params = {
            attachIds,
            chargePersonId: item.chargePersonId,
            content: item.content,
            customerInspectionId: this.taskId,
            title: item.title,
            unqualifiedId: item.id,
            isRectification:'已整改'
          }
          list.push(params)
        })
        this.save(list)
      },
      save(data) {
        let flag = true
        for (let i = 0; i < data.length; i++) {
          if(!data[i].chargePersonId) {
            this.$notification.warning({
              message: '提示',
              description: `第${i + 1}项，请选择整改负责人！！！`
            })
            flag = false
            break
          }
        }
        if(flag) this.$post({
          url: this.$api.customInfo.acceptanceInfo.editRectification,
          data,
          needResponse: true
        }).then((res) => {
          this.handleCancel()
          this.$emit('getQuestionRectify',data)
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      handleCancel() {
        this.dataList = []
        this.visible = false
        this.tableIndex = -1
        this.taskId = ''
      }
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .ant-form-item {
    margin-bottom: 0;
  }
  ::v-deep .ant-card-head {
    height: 40px;
    min-height: 0;
    .ant-card-head-title {
      padding: 0;
      line-height: 40px;
    }
  }
  ::v-deep .ant-card-body {
    padding-top: 20px;
  }
  .imgs {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px dashed #c9c9c9;
    object-fit: contain;
  }
  .left-content {
    font-size: 16px;
    height: 32px;
    line-height: 32px;
  }
</style>