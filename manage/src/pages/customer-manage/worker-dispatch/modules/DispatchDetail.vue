<template>
  <!-- 新增巡检 -->
  <a-modal
    title="选择工人"
    :width="800"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="工人类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择工人类型" v-decorator="['type',{ rules: [{ required: true, message: '请选择工人类型!' }] }]">
                <a-select-option
                  v-for="(item, index) in jobsList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="工人" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-tooltip v-if="workerName" :title="workerName">
                <div v-if="workerName" class="dispatch-user">{{ workerName || '' }}</div>
              </a-tooltip>
              <a-button type="primary" @click="selectOrg">选择工人</a-button>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="是否带班工人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isLeader',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!--选择工人 -->
      <select-worker ref="SelectWorker" @getWorker="getWorker"></select-worker>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {
    defaultErrorMessage,
    regularCheck2,
    filedIsNull,
    maxLenValidator,
    numberValidator,
    checkErrors
  } from '@/utils/common'
  import labels from '@/utils/labels'
  import moment from 'moment'
  import SelectWorker from './SelectWorker'

  export default {
    name: 'DispatchDetail',
    components: { SelectWorker  },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        visible: false,
        modal_type: 'add',
        workerName:'',
        confirmLoading: false,
        id: '',
        customerId:'',
        workerId: [],
        form: this.$form.createForm(this),
        jobsList:[],
        constructionTaskId:'',
        type: '',
      }
    },
    methods: {
      maxLenValidator: maxLenValidator,
      numberValidator: numberValidator,
      regularCheck2: regularCheck2,
      getCodeList(){
        const params = {
          typeList: ['1011']
        }
        this.$getCodesList(params, res => {
          this.jobsList = res['1011'] || [] // 任务关系
        })
      },
      add (customerId,type) {
        const { form: { setFieldsValue } } = this
        this.customerId = customerId
        this.form.resetFields()
        this.id = ''
        this.visible = true
        const data = {
          type: type
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
        this.getCodeList()
      },
      edit (customerId,type) {
        const { form: { setFieldsValue } } = this
        this.customerId = customerId
        this.form.resetFields()
        this.id = ''
        this.visible = true
        const data = {
          type: type
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
        this.getCodeList()
      },
      getWorker(data){
        this.workerName = data.workerName
        this.workerId = data.workerId
      },
      // 选择工人
      selectOrg() {
        if (this.workerId){
          this.$refs.SelectWorker.edit(this.workerId)
        }else {
          this.$refs.SelectWorker.add()
        }

      },
      getDetail(id,customerId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerInspectionRecordInfo.getDetail,
          params: {
            id,
            customerId
          }
        }).then((res) =>{
          const data = { ...res }
          if(data) {
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            const { form: { setFieldsValue } } = this
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          }
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.workerIds = this.workerId
            values.customerId = this.customerId
            this.save(values)
          }else {
            this.confirmLoading = false
          }
        })
      },
      save(data){
        this.$post({
          url: this.$api.customInfo.workerDispatchInfo.dispatch,
          data,
          needResponse: true
        }).then(res => {
          this.handleCancel()
          this.$emit('ok',data)
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.workerName = ''
        this.workerId = []
        this.jobsList = []
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .ant-modal-body {
    padding: 24px;
  }
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 10px;
    max-width: 200px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
</style>