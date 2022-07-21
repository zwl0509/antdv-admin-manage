<template>
  <a-modal
    :title="modal_title"
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
            <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入任务名称"
                autocomplete="off"
                :maxLength="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['taskName', {rules: [{required: true, message: '请输入任务名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入资源名称"
                autocomplete="off"
                :maxLength="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['resourceName', {rules: [{required: true, message: '请输入资源名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="工期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入工期"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['duration', {rules: [{required: true, message: '请输入工期'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="前置任务" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                allowClear
                placeholder="请选择前置任务"
                :disabled="modal_type == 'detail'"
                v-decorator="['startTaskId']">
                <a-select-option
                  v-for="(item, index) in taskList"
                  :key="index"
                  :value="item.id"
                >{{ item.taskName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="后置任务" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                allowClear
                placeholder="请选择后置任务"
                :disabled="modal_type == 'detail'"
                v-decorator="['endTaskId']">
                <a-select-option
                  v-for="(item, index) in taskList"
                  :key="index"
                  :value="item.id"
                >{{ item.taskName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入排序值"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['sequence', {rules: [{required: true},{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="操作岗位" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                allowClear
                placeholder="请选择操作岗位"
                :disabled="modal_type == 'detail'"
                v-decorator="['operationPositionId',{rules: [{required: true, message: '请选择操作岗位'}]}]">
                <a-select-option
                  v-for="(item, index) in postList"
                  :key="index"
                  :value="item.id"
                >{{ item.positionName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24" v-if="isRelationSurvey">
            <a-form-item label="选择问卷" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                allowClear
                placeholder="请选择问卷"
                :disabled="modal_type == 'detail'"
                v-decorator="['surveyId',{rules: [{required: true, message: '请选择问卷'}]}]">
                <a-select-option
                  v-for="(item, index) in surveyList"
                  :key="index"
                  :value="item.id"
                >{{ item.surveyName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否关联问卷" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                @change="handleSwitch"
                v-decorator="['isRelationSurvey',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否关键节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否" 
                v-decorator="['isRequired',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否操作" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否" 
                v-decorator="['isOperation',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import { defaultErrorMessage, regularCheck2, filedIsNull } from '@/utils/common'
  export default {
    name: 'AddTask',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增施工任务'
          case 'edit' :
            return '编辑施工任务'
          case 'detail' :
            return '施工任务详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        modal_type: 'add',
        id: '',
        form: this.$form.createForm(this),
        taskList: [],
        constructionTaskId:'',
        constructionRelationTaskId: [],
        isRelationSurvey: false, // 控制问卷选择
        surveyList: [], // 问卷
        postList: [], // 操作岗位
      }
    },
    methods: {
      regularCheck2,
      // 获取菜单数据

      add () {
        this.form.resetFields()
        this.modal_type = 'add'
        this.id = ''
        this.visible = true
        const arr = [ this.getTaskList(), this.getQuestionnaireList(),this.getPostList()]
        Promise.all(arr)
        .catch((err) => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
      },
      edit (record,type) {
        this.modal_type = type
        this.id = record.id
        this.visible = true
        const arr = [ this.getTaskList(), this.getQuestionnaireList(),this.getPostList(), this.getDetail(record.id)]
        Promise.all(arr)
        .catch((err) => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
      },
      getDetail(id){
        this.confirmLoading = true
        const { form: { setFieldsValue } } = this
        this.$get({
          url: this.$api.construction.basicConstructionTaskInfo.getDetail,
          params: {id}
        }).then(res => {
            const data = { ...res }
            console.log(data)
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
      },
      handleSwitch(e) {
        this.isRelationSurvey = e
      },
      // 获取任务
      getTaskList() {
        this.confirmLoading = true
        const data ={ pageSize:0, currentPage:0}
        this.$post({
          url:this.$api.construction.basicConstructionTaskInfo.getListPage,
          data
        }).then((res)=>{
          const list =  { ...res.rows }
          this.taskList = list || []
        })
      },
      // 获取问卷
      getQuestionnaireList() {
        this.confirmLoading = true
        this.$post({
          url: this.$api.allocation.surveyInfo.getListPage,
          data: {
            currentPage: 0,
            pageSize: 0,
            isUse: 1
          },
        }).then((res)=> {
          const list = { ...res.rows }
          this.surveyList = list || []
        })
      },
      // 获取岗位数据
      getPostList() {
        this.confirmLoading = true
        this.$get({
          url:this.$api.system.position.getListPage,
          params: {
            isLocked: true,
            currentPage: 0,
            pageSize: 0
          }
        }).then((res)=>{
          const list = { ...res.rows }
          this.postList = list || []
        })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            this.save(values)
          }else {
            this.confirmLoading = false
          }
        })
      },
      save(data) {
        this.$post({
          url: this.$api.construction.basicConstructionTaskInfo.edit,
          data,
          needResponse: true
        }).then(res => {
            this.handleCancel()
            this.$emit('ok')
            this.$notification.success({
              message: labels.SAVE_SUCCESS,
              description: res.message || ''
            })
          })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.isRelationSurvey = false
      }
    }
  }
</script>
