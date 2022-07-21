<template>
  <a-modal
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="8" :xs="24">
            <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入客户名称"
                autocomplete="off"
                disabled
                v-model="customerName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入地址"
                autocomplete="off"
                disabled
                v-model="finalAddress"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入电话"
                autocomplete="off"
                disabled
                v-model="mobileNumber"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="门店" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入门店"
                autocomplete="off"
                disabled
                v-model="storeName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入项目经理"
                autocomplete="off"
                disabled
                v-model="customerName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="设计师" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入设计师"
                autocomplete="off"
                disabled
                v-model="designer"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="报修来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入报修来源"
                autocomplete="off"
                disabled
                v-model="recordSourceName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="报修时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                show-time
                placeholder="请选择报修时间"
                disabled
                style="width: 100%;"
                v-model="recordTime"
              ></a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :xs="24">
            <a-form-item label="报修类别" class="col-1-9">
              <a-input
                placeholder="请输入报修类别"
                autocomplete="off"
                disabled
                v-model="recordTypes"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="关联处理人" class="col-1-9" >
              <a-select
                mode="multiple"
                allowClear
                showArrow
                show-search
                :disabled="modal_type === 'detail'"
                change-on-select
                placeholder="请选择关联处理人"
                :filterOption="filterOption"
                v-decorator="['handlers']"
              >
                <a-select-option v-for="(item,index) in json.type2" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="抄送人" class="col-1-9" >
              <a-select
                mode="multiple"
                allowClear
                showArrow
                show-search
                change-on-select
                :disabled="modal_type === 'detail'"
                placeholder="请选择抄送人"
                :filterOption="filterOption"
                v-decorator="['reminders']"
              >
                <a-select-option v-for="(item,index) in json.type5" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :xs="24">
            <a-form-item
              v-for="(item,index) in list"
              :key="item"
              :label="'关联问题'+ (index + 1)"
              class="col-1-9"
              :required="false"
            >
              <a-textarea
                :rows="1"
                class="question"
                placeholder="请输入关联问题"
                autocomplete="off"
                :disabled="type == 'detail'"
                v-decorator="['question' + index, { validateTrigger: ['change', 'blur'], rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
              <div class="icon">
                <a-icon type="minus-circle" :disabled="type == 'detail'" class="dynamic-delete-button" @click="cancel" v-if="list.length > 1"/>
                <a-icon type="plus-circle" :disabled="type == 'detail'" class="dynamic-add-button" @click="add" v-if="index === list.length - 1"/>
              </div>
            </a-form-item>
          </a-col>
          <!--          <a-col :md="24" :xs="24">-->
          <!--            <a-form-item-->
          <!--              label="关联问题"-->
          <!--              class="col-1-9"-->
          <!--            >-->
          <!--              <a-select-->
          <!--                mode="multiple"-->
          <!--                allowClear-->
          <!--                showArrow-->
          <!--                show-search-->
          <!--                change-on-select-->
          <!--                :disabled="modal_type === 'detail'"-->
          <!--                placeholder="请选择关联问题"-->
          <!--                :filterOption="filterOption"-->
          <!--                v-decorator="['question']"-->
          <!--              >-->
          <!--                <a-select-option v-for="(item,index) in json.type6" :key="index" :value="item.value">-->
          <!--                  {{ item.name }}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="24" :xs="24">-->
          <!--            <a-form-item label="投诉内容" :labelCol="labelCol" :wrapperCol="wrapperCol" class="col-1-9">-->
          <!--              <a-textarea-->
          <!--                :rows="3"-->
          <!--                placeholder="请输入投诉内容"-->
          <!--                autocomplete="off"-->
          <!--                disabled-->
          <!--                v-decorator="['recordContent', { rules: [{ message: '请输入投诉内容!'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :md="24" :xs="24" v-if="modal_type==='detail'">
            <a-form-item label="回复内容" :labelCol="labelCol" :wrapperCol="wrapperCol" class="col-1-9">
              <a-textarea
                :rows="3"
                placeholder="请输入回复内容"
                autocomplete="off"
                :disabled="modal_type === 'detail'"
                v-decorator="['replayContent', { rules: [{ message: '请输入回复内容!'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注信息" class="col-1-9">
              <a-textarea
                :rows="3"
                placeholder="请输入备注信息"
                autocomplete="off"
                :disabled="modal_type === 'detail'"
                v-decorator="['remark', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import json from '@/pages/customer-service-manage/complaint-record/modules/mocks'
  import { defaultErrorMessage, maxLenValidator, numberValidator, regularCheck, regularCheck2 } from '@/utils/common'
  export default {
    name: 'DispatchOrder',
    components:{
    },
    props: {
      codeType: {
        type: Object,
        default: null
      },
      type: {
        type: String,
        default: '',
      },
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'edit' :
            return '新增派单'
          case 'detail' :
            return '派单详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        json,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        modal_type: 'edit',
        visible: false,
        confirmLoading: false,
        isError: false,
        form: this.$form.createForm(this),
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        id: '',
        list:[0],
        autoIndex: 0,
        customerName:'',
        finalAddress:'',
        mobileNumber:'',
        storeName:'',
        designer:'',
        recordTime:'',
        recordTypes:'',
        recordSourceName:'',
        csComplaintRecordId:''
      }
    },
    methods: {
      maxLenValidator, numberValidator,regularCheck,regularCheck2,
      edit(record , type) {
        this.modal_type = type
        this.visible = true
        this.getCustomerDetail(record.id)
        this.getDetail(record.id)
        this.$emit('getCodeList')
      },
      add() {
        this.autoIndex++
        this.list.push(this.autoIndex)
      },
      cancel(){
        this.list.splice(this.autoIndex)
        this.autoIndex--
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      // 获取详情
      getDetail(id){

      },
      // 获取客户详情
      getCustomerDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customerServiceInfo.getDetail,
          params: { id }
        }).then((res) =>{
          const data = { ...res }
          const recordType = []
          data.recordTypes.forEach(item=>{
            recordType.push(item.typeName)
          })
          data.recordType = recordType
          this.id = data.id
          this.customerName = data.customerName
          this.finalAddress = data.finalAddress
          this.recordTypes = data.recordType
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.save(values)
          }
        })
      },
      save(data) {
        this.confirmLoading = true
        data.csComplaintRecordId = this.id
        this.$post({
          url: this.$api.customerServiceInfo.dispatch,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.activeKey = ['1']
        this.isError = false
        this.form.resetFields()
        this.id = ''
      }
    }

  }
</script>

<style lang="scss" scoped>
  ::v-deep .ant-form-item {
    display: flex;
    align-items: center;
  }
  ::v-deep .icon{
    width: 80px;
  }
  ::v-deep .dynamic-add-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #b80201;
    transition: all 0.3s;
  }
  .dynamic-add-button:hover {
    color: #b80201;
  }
  .dynamic-add-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ::v-deep .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
    margin-right: 20px;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ::v-deep .question{
    margin-right: 20px;
  }
  ::v-deep .col-1-9{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
      // line-height: 20px;
      label{
        white-space: break-spaces;
      }
    }
    .ant-form-item-control-wrapper{
      width: 88.888888%;
      float: left;
    }
  }
  ::v-deep .ant-form-item-children {
    display: flex;
  }
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    padding: 0;
    // background: red !important;
    color: #585A62;
  }
  ::v-deep .area-select .ant-select-dropdown-menu {
    padding-bottom: 40px;
    max-height: 384px;
  }
  ::v-deep .select-page{
    background: white;
    position:absolute;
    bottom: 0;
    width: 100%;
    pointer-events: none;
    padding: 0;
    .page-btn{
      padding: 10px 0;
    }
    .page-nav{
      padding: 10px 0;
    }
  }
  ::v-deep .select-page.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled){
    background: white;
  }
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 10px;
    max-width: 245px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
</style>