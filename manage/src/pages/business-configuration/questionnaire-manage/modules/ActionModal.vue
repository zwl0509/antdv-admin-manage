<template>
  <a-modal
    :title="modalType === 'add' ? '问卷调查新增' : '编辑问卷调查'"
    :width="1200"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="问卷名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入问卷名称" autocomplete="off" v-decorator="['surveyName',{rules: [{required: true, message: '请输入问卷名称'}]}]" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="调查类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择调查类型" allowClear v-decorator="['surveyType']">
                <a-select-option v-for="(item, index) in surveyTypeList" :key="index" :value="item.value">
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
                v-decorator="['sequence', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 6, '请输入1到6位的数字') }]}]"/>
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
        <a-row :grabbed="48">
          <a-button type="primary" icon="plus" style="margin:10px 0;" @click="questionnaireCreate">新增题目</a-button>
          <a-table :rowKey="r => (r.id || r.key)" :columns="columns" :pagination="false" :dataSource="dataList" :scroll="{y: 380}">
            <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
            <span slot="isSwitch" slot-scope="text">{{ text ? '是' : '否' }}</span>
            <span slot="ellipsis" slot-scope="text">
              <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
            </span>
            <span slot="action" slot-scope="text, record, index">
              <a @click="handleEdit(record, index)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="是否要删除此行？" @confirm="handleSub(index)">
                <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-row>
      </a-form>
    </a-spin>
    <!-- 题目新增 -->
    <questionnaire-create ref="QuestionnaireCreate" @getListItem="getListItem"></questionnaire-create>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'

import QuestionnaireCreate from './QuestionnaireCreate.vue'
import { defaultErrorMessage, filedIsNull, maxLenValidator,regularCheck2 } from '@/utils/common'

export default {
  components: { QuestionnaireCreate, Ellipsis},
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      columns: [
        {
          title: '序号',
          width: 60,
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '标题',
          align: 'center',
          width: 200,
          dataIndex:'questionTitle',
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '副标题',
          align: 'center',
          width: 200,
          dataIndex:'questionSubtitle',
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '问题类型',
          align: 'center',
          dataIndex:'questionTypeName',
        },
        {
          title: '是否必填',
          align: 'center',
          dataIndex: 'isRequired',
          scopedSlots: { customRender: 'isSwitch' }
        },
        {
          title: '是否拍照',
          align: 'center',
          dataIndex: 'isPhoto',
          scopedSlots: { customRender: 'isSwitch' }
        },  
        {
          title: '操作',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action' }

        }
      ],
      dataList: [],
      visible: false,
      modalType: 'add',
      confirmLoading: false,
      id: '',
      s_index: -1,
      form: this.$form.createForm(this),
      surveyTypeList: [], // 调查类型
    }
  },
  methods: {
    maxLenValidator,
    regularCheck2,
    add () {
      this.modalType = 'add'
      this.visible = true
      this.getCodeList()
    },
    edit (record) {
      const { form: { setFieldsValue } } = this
      this.modalType = 'edit'
      this.id = record.id
      this.visible = true
      this.confirmLoading = true
      this.getCodeList()
      this.$get({
        url: this.$api.allocation.surveyInfo.getDetail,
        params: { id: record.id }
      })
        .then(res => {
          const data = { ...res }
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          this.dataList = data.surveyQuestionInfoDTOList = data.surveyQuestionInfoVOList
          this.dataList.forEach(item=>{
            item.surveyOptionsInfoDTOS = item.surveyOptionsInfoVOS
          })
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        })
        .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })

    },
    getCodeList() {
      const params = {
        typeList: ['1078']
      }
      this.$getCodesList(params, res => {
        this.surveyTypeList = res['1078'] || []
      })
    },
    // 新增题目
    questionnaireCreate() {
      this.s_index = -1
      this.$refs.QuestionnaireCreate.add()
    },
    // 编辑题目
    handleEdit(item,index) {
      this.s_index = index
      this.$refs.QuestionnaireCreate.edit(item)
    },
    // 获取数据
    getListItem(item) {
      if(this.s_index == -1 ) {
        this.dataList.unshift(item)
      } else {
        this.$set(this.dataList,this.s_index,item)
      }
    },
    // 删除
    handleSub(index) {
      this.dataList.splice(index, 1)
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          const list = []
          this.dataList.forEach(item=> {
            item.surveyInfoId = null
            list.push(item)
          })
          values.surveyQuestionInfoDTOList = list
          this.save(values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    save(data){
      this.$post({
        url: this.$api.allocation.surveyInfo.edit,
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
        .finally(() => { this.confirmLoading = false })
    },
    handleCancel () {
      // 重置表单数据
      this.id = ''
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
      this.dataList = []
      this.s_index = -1
    }
  }
}
</script>
