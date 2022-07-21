<template>
  <a-modal
    class="construction-formwork"
    :title="modal_title"
    :width="1000"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col :md="12" :xs="24">
            <a-form-item label="模板名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入模板名字"
                autocomplete="off"
                :maxLength="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['templateName', {rules: [{required: true, message: '请输入模板名字'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="最小面积" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入最小面积"
                autocomplete="off"
                suffix="(m²)"
                :disabled="modal_type == 'detail'"
                v-decorator="['minArea',{ rules: [{ required: true, message: '请输入最小面积'},{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [9,2], '最小面积格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="最大面积" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入最大面积"
                autocomplete="off"
                suffix="(m²)"
                :disabled="modal_type == 'detail'"
                v-decorator="['maxArea',{ rules: [{ required: true, message: '请输入最大面积'},{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [9,2], '最大面积格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入排序值"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['sequence', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isUse',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-button type="primary" @click="addTable()">新增施工计划表</a-button>
        </a-row>
        <a-row v-if="taskName || modal_type === 'edit'">
          <div>
            <div slot="header" class="all-or-reset">
              <div class="title-all">
                <div class="title">序号</div>
                <div class="title">计划名称</div>
                <div class="title">计划工期</div>
                <div class="title">前置任务</div>
                <div class="title">后置任务</div>
                <div class="title">是否关键节点</div>
                <div class="title">排序</div>
                <div class="title">操作</div>
              </div>
            </div>
            <div style="height: 400px;overflow-y: scroll">
              <draggable v-model="constructionList" draggable=".item" animation="300" filter=".forbid" :move="onMove">
                <div v-for="(item ,s_index) in constructionList" :key="s_index" class="item">
                  <div class="item-detail">
                    <div class="title-all">
                      <div class="title">{{ s_index + 1 }}</div>
                      <div class="title">
                        <ellipsis tooltip :length="12">{{ item.taskName }}</ellipsis>
                      </div>
                      <div class="title">{{ item.duration }}</div>
                      <div class="title">
                        <ellipsis tooltip :length="12">{{ item.startTaskName }}</ellipsis>
                      </div>
                      <div class="title">
                        <ellipsis tooltip :length="12">{{ item.endTaskName }}</ellipsis>
                      </div>
                      <div class="title">{{ !!item.isRequired ? '是' : '否' }}</div>
                      <div class="title">{{ item.sequence }}</div>
                      <div class="title">
                        <a class="ant-btn-background-ghost ant-btn-danger" @click="handleDelete(s_index)">删除</a>
                      </div>
                    </div>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </a-row>
      </a-form>
    </a-spin>
    <plan-table ref="PlanTable" @getTaskInfo="getTaskInfo"></plan-table>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import draggable from 'vuedraggable'
  import PlanTable from './PlanTable'
  import { deepClone } from '@/utils/util'
  import { defaultErrorMessage, filedIsNull, regularCheck2 } from '@/utils/common'
  import { Ellipsis } from '@/components'
  export default {
    components:{ Ellipsis, PlanTable, draggable},
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增施工计划模板'
          case 'edit' :
            return '编辑施工计划模板'
          case 'detail' :
            return '施工计划模板详情'
          default:
            return ''
        }
      }
    },
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
        modal_type: 'add',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        isError: false,
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        id: '',
        expandedRowKeys: [],
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        },
        taskList:[],
        constructionList: [],
        init_columns: [],
        indeterminate: false,
        checkAll: false,
        checkedList:[],
        columns_name: '',
        constructionTaskId:[],
        taskName:'',
        duration:'',
        frontVOS:[],
        relationVOS:[],
        frontTaskName:'',
        parallelTaskName:'',
      }
    },
    methods: {
      regularCheck2,
      add() {
        this.modal_type = 'add'
        this.visible = true
        this.$emit('getCodeList')
      },
      edit(record , type) {
        this.id = record.id
        this.modal_type = type
        this.visible = true
        this.getDetail(this.id)
        this.$emit('getCodeList')

      },
      getTaskInfo(data){
        this.constructionList = data
        const constructionTaskId = []
        const taskName = []
        data.forEach(item=>{
          constructionTaskId.push(item.id)
          taskName.push(item.taskName)
        })
        this.constructionTaskId = constructionTaskId
        this.taskName = taskName
      },
      handleDelete(index){
        this.constructionList.splice(index ,1)
      },
      addTable(){
        if (this.constructionList){
          const taskId = []
          this.constructionList.forEach(item=>{
            taskId.push(item.id)
          })
          this.constructionTaskId = taskId
          this.$refs.PlanTable.edit(taskId)
        }else {
          this.$refs.PlanTable.add()
        }
      },

      onMove (e) {
        if(e.relatedContext.index == 0) return false
        if(e.relatedContext.index + 1 == this.constructionList.length ) return false
        return true
      },
      // 获取详情
      getDetail(id) {
        const { form: { setFieldsValue } } = this
        this.$get({
          url: this.$api.construction.basicConstructionTemplateInfo.getDetail,
          params: {id}
        })
          .then(res => {
            const data = { ...res }
            this.constructionList = data.constructionTaskDetailVOS
            const taskId = []
            data.constructionTaskDetailVOS.forEach(m => {
              taskId.push(m.id)
            })
            this.constructionTaskId = taskId
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.constructionTaskId = this.constructionTaskId
            values.templateDetailEditDTOS = []
            if (values.constructionTaskId?.length) {
              this.constructionList.filter(m => values.constructionTaskId.includes(m.id)).forEach(m => {
                console.log(m)
                values.templateDetailEditDTOS.push({
                  sequence: m.sequence,
                  constructionTaskId: m.id,
                  constructionTemplateId: this.id,
                  constructionTaskName: m.taskName,
                })
              })
            }
            return this.save(values)
          }
        })
      },
      save(values) {
        this.confirmLoading = true
        this.$post({
          url: this.$api.construction.basicConstructionTemplateInfo.edit,
          data: { ...values },
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
        this.confirmLoading = false
        this.isError = false
        this.id = ''
        this.taskName = ''
        this.duration = ''
        this.constructionTaskId = ''
        this.constructionList = []
        this.form.resetFields()
      }
    }

  }
</script>

<style lang="scss" scoped>
  .construction-formwork {
    ::v-deep .ant-modal-body {
      max-height: 700px;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      height: 40px;
      font-size: 14px;
      margin-bottom: 5px;
      border-bottom: solid 1px #eee;
      border-radius: 6px;
      cursor: pointer;
    }

    .item:hover {
      background: #f7e3df;
    }

    .all-or-reset{
      padding: 5px 30px 5px 10px;
      height: 40px;
      margin-top: 10px;
      background-color: #E4EAEC;
      font-size: 14px;
      font-weight: 500;
      color: #333;
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
  }


</style>