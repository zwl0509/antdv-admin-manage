<template>
  <a-modal
    title="新增消息回复"
    :width="800"
    :centered="true"
    :visible="visible"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="跟踪类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择跟踪类型" allowClear v-decorator="['trackType',{ rules : [{ required: true}]}]">
                <a-select-option
                  v-for="(item, index) in trackType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="记录类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择记录类型" allowClear @change="recordType" v-decorator="['recordType',{ rules : [{ required: true}]}]">
                <a-select-option
                  v-for="(item, index) in recordTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-if="isRecord">
            <a-form-item label="提醒时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                placeholder="请选择提醒时间"
                v-decorator="['isSpecial14']"
                style="width: 100%"
              ></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-if="isRecord">
            <a-form-item label="是否及时提醒" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isSpecial15',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" v-if="isRecord">
            <a-form-item label="提醒人" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <div>
                <a-button type="primary" style="margin-left: 10px;">选择人员</a-button>
              </div>
              <!-- <div>
                <span v-for="(item,index) in peoples" :key="item.id">{{ item.name + (index !== peoples.length-1? ',' : '') }}</span>
              </div> -->
              <a-card>
                <div class="peoples-class">
                  <div v-for="(item) in peoples" :key="item.id">{{ item.name }}</div>
                </div>
              </a-card>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="常用语" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-select placeholder="请选择常用语" allowClear @change="messageType" v-decorator="['isSpecial3']">
                <a-select-option
                  v-for="(item, index) in json.type22"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>   
          <a-col :md="24" :sm="24">
            <a-form-item label="跟踪记录内容" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-textarea placeholder="请输入跟踪记录内容" autocomplete="off" v-decorator="['trackContent']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <!-- 分配 -->
    <!-- <replace-personnel ref="ReplacePersonnel" @ok="handleOk"></replace-personnel> -->
  </a-modal>
</template>

<script>
  import json from './mocks.js'
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    data() {
      return {
        json,
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        id: '',
        isRecord: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        trackType: [],
        recordTypeList: [],
        peoples: [
          {id:0 ,name:'张先生'},
          {id:1 ,name:'张先生'},
          {id:2 ,name:'张先生'},
          {id:3 ,name:'张先生'},
          {id:4 ,name:'张先生'},
          {id:5 ,name:'张先生'},
          {id:6 ,name:'张先生'},
          {id:7 ,name:'张先生'},
        ]
      }
    },
    methods: {
      add(id) {
        this.visible = true
        this.id = id
        this.getCodeList()
      },
      getCodeList() {
        const params = {
          typeList: ['1037','1038']
        }
        this.$getCodesList(params, res => {
          this.trackType = res['1037'] || []  // 跟踪类型
          this.recordTypeList = res['1038'] || []  // 记录类型
        })
      },
      recordType(e){
        if(e == '1038-40') {
          // this.getList()
          this.isRecord = false
        }else {
          this.isRecord = false
        }
      },
      messageType(e) {
        const message = json.type22[e].name
        this.$nextTick(() => {
          this.form.setFieldsValue({
            'trackContent': message
          })
        })
      },
      handleSubmit (){
        this.confirmLoading = true
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if(!errors) {
            values.customerId = this.id
            this.$post({
              url: this.$api.customInfo.customerTrackingInfo.edit,
              data: values,
              needResponse: true
            }).then(res=>{
                this.handleCancel()
                this.$emit('ok')
                this.$notification.success({
                message: labels.SAVE_SUCCESS,
                description: res.message || ''
              })
            }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => { this.confirmLoading = false })
          }
        })
      },
      handleCancel() {
        this.form.resetFields()
        this.currentPage = 1
        this.visible = false
        this.isRecord = false
      }
    }
    
  }
</script>

<style lang="scss" scoped>
.peoples-class {
  display: flex;
}
</style>