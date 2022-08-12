<template>
  <!-- 巡检不合格整改 -->
  <a-modal
    :title="modal_title"
    :width="900"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-card style="margin-bottom: 10px" v-if="modal_type === 'detail'">
        <div slot="title" style="display: flex;justify-content: space-between;align-items: center">
          <span>{{ info.title }}</span>
        </div>
        <a-row>
          <a-col :span="24">
            <a-col :span="3">
              <div class="left-content">整改负责人<span style="color: red">*</span> :
              </div>
            </a-col>
            <a-col :span="21">
              <div class="right-content" style="width: 300px">{{ info.chargePersonName }}</div>
            </a-col>
          </a-col>
          <a-col :span="24" style="margin-top: 25px">
            <a-col :span="3">
              <div class="left-content">整改抄送人 :</div>
            </a-col>
            <a-col :span="21">
              <div class="right-content">{{ info.notifyNames }}</div>
            </a-col>
          </a-col>
          <a-col :span="24" style="display: flex;margin-top: 25px">
            <a-col :span="3">
              <div class="left-content">描述 :</div>
            </a-col>
            <a-col :span="21">
              <div class="right-content">{{ info.content }}</div>
            </a-col>
          </a-col>
          <a-col :span="24" style="display: flex;margin-top: 25px">
            <a-col :span="3">
              <div class="left-content">图片 :</div>
            </a-col>
            <a-col :span="21">
              <img v-for="(k_item, k_index) in info.sysAttachInfoVOS" :key="k_index" :src="k_item.path" class="imgs" @click="openImgs(k_item.path)">

            </a-col>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin-bottom: 10px" v-for="(item, index) in dataList" :key="index" :value="item.id" v-else>
        <div slot="title" style="display: flex;justify-content: space-between;align-items: center">
          <span>{{ item.title }}</span>
        </div>
        <a-row>
          <a-col :span="24">
            <a-col :span="3">
              <div class="left-content">整改负责人<span style="color: red">*</span> :</div>
            </a-col>
            <a-col :span="21">
              <a-select
                style="width: 300px"
                v-model="item.chargePersonId"
                placeholder="请选择负责人"
                @dropdownVisibleChange="handlersSelect(index)">
                <a-select-option v-for="i in item.handlersList" :value="i.id" :key="i.id">
                  {{ i.employeeName }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-col>
          <a-col :span="24" style="margin-top: 25px">
            <a-col :span="3">
              <div class="left-content">整改抄送人 : </div>
            </a-col>
            <a-col :span="21">
              <a-select
                style="width: 100%"
                mode="multiple"
                allowClear
                showArrow
                v-model="item.notifyIds"
                placeholder="请选择抄送人"
                @dropdownVisibleChange="reminderSelect(index)">
                <a-select-option v-for="i in item.remindersList" :value="i.id" :key="i.id">
                  {{ i.employeeName }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-col>
          <a-col :span="24" style="margin-top: 25px">
            <a-col :span="3">
              <div class="left-content">描述 : </div>
            </a-col>
            <a-col :span="21">
              <div class="right-content">{{ item.content }}</div>
            </a-col>
          </a-col>
          <a-col :span="24" style="margin-top: 25px">
            <a-col :span="3">
              <div class="left-content">图片 :</div>
            </a-col>
            <a-col :span="21">
              <img v-for="(k_item, k_index) in item.attachInfos" :key="k_index" :src="k_item.path" class="imgs" @click="openImgs(k_item.path)">
            </a-col>
          </a-col>
        </a-row>
      </a-card>
      <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
        <img alt="example" style="width: 100%" :src="previewImage"/>
      </a-modal>
    </a-spin>
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
    name: 'Rectification',
    components: { ReminderSelect, HandlersSelect },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        id: '',
        dataList: [],
        previewImage: '',
        modal_type:'',
        info: null,
        previewVisible: false,
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'detail' :
            return '巡检整改详情'
          default:
            return '巡检整改'
        }
      }
    },
    methods: {
      edit(record){
        console.log(record)
        this.visible = true
        this.id = record.id
        const data = deepClone(record.unqualifiedInfoVOS)
        data?.forEach(el => {
          el.content = el.unqualifiedContent
          el.title = el.unqualifiedTypeName
          el.unqualifiedId = el.id
        })
        this.dataList = deepClone(data)
        console.log(this.dataList)
        this.customerId = record.customerId
      },
      show(record,type){
        this.modal_type = type
        this.visible = true
        this.info = record
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
      // 关闭预览
      cancelImage() {
        this.previewVisible = false
      },
      openImgs(path){
        if(path){
          this.previewImage = path
          this.previewVisible = true
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
            customerInspectionId: this.id,
            notifyIds: item.notifyIds,
            status: '1092-10',
            title: item.title
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
        if(flag)this.$post({
          url: this.$api.customInfo.acceptanceInfo.editRectification,
          data,
          needResponse: true
        }).then((res) => {
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      handleCancel () {
        // 重置表单数据
        this.confirmLoading = false
        this.visible = false
        this.dataList = []
      }
    }
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
  .left-content{
    font-size: 16px;
    height: 32px;
    line-height: 32px;
  }
  .right-content{
    height: 32px;
    line-height: 32px;
    width: 100%;
    border: 1px solid #d9d9d9;
    padding-right: 11px;
    padding-left: 11px;
    border-top-width: 1.02px;
    border-radius: 4px;
  }
  .imgs {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px dashed #c9c9c9;
    object-fit: contain;
  }
</style>