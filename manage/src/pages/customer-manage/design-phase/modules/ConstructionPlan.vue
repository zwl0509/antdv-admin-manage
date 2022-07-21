<template>
  <a-modal
    title="生成施工计划"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col :md="8" :xs="24">
            <a-form-item label="施工模板" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select placeholder="请选择施工模板" allowClear v-decorator="['templateId',{rules: [{required: true, message: '请选择施工模板'}]}]">
                <a-select-option
                  v-for="(item, s_index) in constructionTemplate"
                  :key="s_index"
                  :value="item.id"
                >{{ item.templateName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-date-picker
                placeholder="请选择开始时间"
                style="width: 100%;"
                v-decorator="['startDate',{ rules: [{required: true, message: '请选择开始时间'}]}]"
              ></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-button style="margin: 0 20px;" type="primary" @click="createGantt">生成施工计划图</a-button>
              <a-button v-if="isShow" type="primary" @click="addTable()">编辑施工计划</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div v-if="isShow">
        <div style="padding-bottom: 20px">
        </div>
        <Gantt ref="Gantt" class="left-container"></Gantt>
      </div>
    </a-spin>
    <plan-table ref="PlanTable" @getTaskInfo="getTaskInfo"></plan-table>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { deepClone } from '@/utils/util'
  import PlanTable from './PlanTable'
  import Gantt from '@/components/Gentt/index'
  import { defaultErrorMessage, filedIsNull } from '@/utils/common'

  export default {
    name:'ConstructionPlan',
    components:{ PlanTable, Gantt},
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        isShow: false,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        id: '',
        tasks: { data: [], links: [] },
        constructionTemplate: [],
      }
    },
    methods: {
      show(record) {
        this.id = record.id
        this.visible = true
        this.getTemplate()
      },
      // 获取施工模版
      getTemplate(){
        this.$post({
          url: this.$api.construction.basicConstructionTemplateInfo.getListPage,
          data:{
            currentPage: 0,
            pageSize: 0
          }
        }).then(res => {
          this.constructionTemplate = res.rows || []
        })
      },
      // 生成施工计划图
      createGantt() {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.startDate = values.startDate ? moment(values.startDate).format('YYYY-MM-DD') : null
            this.getGanttData(values)
          }else {
            this.confirmLoading = false
          }
        })
      },
      // 获取gantt 数据
      getGanttData(data) {
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.getGanttList,
          data,
          needResponse: true
        }).then((res)=>{
          const list = { ...res.result }
          this.tasks = list
          this.isShow = true
          this.$nextTick(()=> {
            this.$refs.Gantt.clearAll()
            this.$refs.Gantt.config(this.tasks)
          })
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getTaskInfo(list){
        this.tasks = list
        this.$nextTick(()=> {
          this.$refs.Gantt.clearAll()
          this.$refs.Gantt.config(this.tasks)
        })
      },
      // 编辑施工计划
      addTable(){
        const taskId = []
        const data = {
          startDate: this.form.getFieldValue('startDate') ? moment(this.form.getFieldValue('startDate')).format('YYYY-MM-DD') : null ,
          templateId: this.form.getFieldValue('templateId') || ''
        }
        if(data.startDate && data.templateId) {
          this.tasks.data?.forEach(el => { taskId.push(el.id) })
          this.$refs.PlanTable.edit(data ,taskId)
        }else {
          this.$notification.warning({
            message: labels.HINT,
            description: '请选择施工模板及开始时间！！！'
          })
        }
      },
      handleSubmit() {
        const data = deepClone(this.tasks.resource)
        if(this.tasks.resource) {
          const { form: { validateFields } } = this
          validateFields((errors, values) => {
            data?.forEach(item=> {
              item.customerId = this.id
              item.basicConstructionTaskId = item.id
              item.constructionTemplateId = values.templateId
              item.id = null
            })
            this.save(data)
          })
        } else {
          this.$notification.warning({
            message: labels.HINT,
            description: '请生成施工计划!!!'
          })
        }
      },
      save(data) {
        this.confirmLoading = true
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.edit,
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
        this.id = ''
        this.tasks = { data: [], links: [] }
        this.visible = false
        this.isShow = false
        this.confirmLoading = false
        this.constructionTemplate= []
        this.form.resetFields()
      }
    }

  }
</script>

<style lang="scss" scoped>
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    height: 50px;
    font-size: 16px;
    /*background-color: #fAfAfA;*/
    margin-bottom: 5px;
    border-bottom: solid 1px #eee;
    border-radius: 6px;
    cursor: pointer;
  }
  .all-or-reset{
    padding: 5px 30px 5px 10px;
    height: 50px;
    margin-top: 15px;
    background-color: #E4EAEC;
  }
  .head{
    font-size: 16px;
  }
  .all-or-reset,.item-detail{
    width: 100%;
    display: flex;
    align-items: center;
    .serial{
      width: 10%;
    }
    .title-all{
      width: 100%;
      display: flex;
      text-align: center;
      .title{
        width: 50%;
      }
    }
  }

</style>