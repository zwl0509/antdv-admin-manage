<template>
  <a-modal
    :title="modalType === 'add' ? '问卷题目新增' : '编辑问卷题目'"
    :width="900"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="标题" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-input placeholder="请输入问题标题" autocomplete="off" v-decorator="['questionTitle',{rules: [{required: true, message: '请输入问题标题'}]}]" :max-length="300"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="副标题" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-input placeholder="请输入副标题" autocomplete="off" v-decorator="['questionSubtitle']" :max-length="300"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="问题类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择问题类型" allowClear v-decorator="['questionType',{rules: [{required: true, message: '请选择问题类型'}]}]" @change="tableChange">
                <a-select-option v-for="(item, index) in questionTypeList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入排序值"
                autocomplete="off"
                v-decorator="['sequence', {rules: [{required: true},{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 6, '请输入1到6位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否必填" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isRequired',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否拍照" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isPhoto',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          
        </a-row>
        <a-row :grabbed="48" v-if="isShowTable">
          <a-button type="primary" icon="plus" style="margin:10px 0;" @click="answerCreate">新增答案</a-button>
          <a-table
            :rowKey="r => (r.id || r.key || r.surveyQuestionId)"
            :columns="columns"
            :pagination="false"
            :dataSource="dataList"
            :scroll="{y: 340}">
            <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
            <template slot="content" slot-scope="text,record">
              <a-input v-model="record.content" placeholder="请输入选项内容" @change="upDataList"/>
            </template>
            <template slot="score" slot-scope="text,record">
              <a-input v-model="record.score" placeholder="请输入得分" @change="upDataList"/>
            </template>
            <template slot="sequence" slot-scope="text,record">
              <a-input v-model="record.sequence" placeholder="请输入排序" @change="upDataList"/>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <a-popconfirm title="是否要删除此行？" @confirm="handleSub(index)">
                <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { maxLenValidator,regularCheck2 } from '@/utils/common'
import { v4 as uuid } from 'uuid'

export default {
  name: 'QuestionnaireCreate',
  data () {
    return {
      visible: false,
      confirmLoading: false,
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
      columns: [
        {
          title: '序号',
          width: 60,
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '选项内容',
          align: 'center',
          dataIndex:'content',
          scopedSlots: { customRender: 'content' }
        },        
        {
          title: '得分',
          align: 'center',
          dataIndex:'score',
          width: 150,
          scopedSlots: { customRender: 'score' }
        },
        {
          title: '排序',
          align: 'center',
          width: 150,
          dataIndex:'sequence',
          scopedSlots: { customRender: 'sequence' }
        },
        {
          title: '操作',
          align: 'center',
          width: 60,
          scopedSlots: { customRender: 'action' }
        },
      ],
      form: this.$form.createForm(this),
      dataList: [],
      modalType: 'add',
      id: '',
      questionTypeList: [], // 问题类型
      positionList: [], // 职位
      isShowTable: false , // 是否展示table
    }
  },
  methods: {
    maxLenValidator,
    regularCheck2,
    add () {
      this.modalType = 'add'
      this.visible = true
      this.getCodeList()
      this.getPosition()
    },
    edit (record) {
      if(record.questionType == '1077-10') {
        this.isShowTable = false
      } else {
        this.isShowTable = true
      }
      this.modalType = 'edit'
      this.visible = true
      this.getCodeList()
      this.getPosition()
      this.dataList = record.surveyOptionsInfoDTOS
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(Object.assign({}, record), Object.keys(this.form.fieldsStore.fieldsMeta)))
      })
    },
    // 删除表格行数据
    handleSub (index){
      this.dataList.splice(index, 1)
    },
    getCodeList() {
      const params = {
        typeList: ['1042','1077']
      }
      this.$getCodesList(params, res => {
        this.questionTypeList = res['1077'] || []
      })
    },
    // 获取职位
    getPosition() {
      const params= { currentPage: 0, pageSize : 0, isLocked : true }
      this.$get({
        url: this.$api.system.position.getListPage,
        params,
      }).then((res)=>{
        const data = res.rows
        this.positionList = data
      })
    },
    // 答案新增
    answerCreate() {
      const newData = { key: uuid()}
      this.dataList.unshift(newData)
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    // 控制table是否展示
    tableChange(e) {
      if(e == '1077-10') {
        this.isShowTable = false
      } else {
        this.isShowTable = true
      }
    },
    upDataList() {
      this.$forceUpdate()
    },
    handleChange(e){
      const data = this.typeList.find(el=>el.value === e)
      if (data.name){
        this.form.setFieldsValue({
          name: data.name
        })
      }
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.key = uuid()
          values.questionTypeName = values.questionType && 
          this.questionTypeList.find(item=> item.value === values.questionType).name
          this.save(values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    save(data) {
      const list = []
      this.dataList.forEach(item=> {
        item.surveyQuestionId = null
        list.push(item)
      })
      data.surveyOptionsInfoDTOS = list
      this.$emit('getListItem',data)
      this.handleCancel()
      this.confirmLoading = false
    },
    handleCancel () {
      // 重置表单数据
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
      this.isShowTable = false
      this.dataList = []
      this.id = ''
    }
  }
}
</script>
