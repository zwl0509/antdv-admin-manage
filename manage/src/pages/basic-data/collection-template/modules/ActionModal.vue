<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="模板名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入模板名称"
                autocomplete="off"
                :maxLength="64"
                v-decorator="['templateName', {rules: [{required: true, message: '请输入模板名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isActive',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="描述" :labelCol="labelCol2" :wrapperCol="wrapperCol2" >
              <a-textarea
                :rows="4"
                placeholder="请输入描述"
                autocomplete="off"
                :maxLength="256"
                v-decorator="['description']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="labelCol2" :wrapperCol="wrapperCol2" >
              <a-textarea
                :rows="4"
                placeholder="请输入备注"
                autocomplete="off"
                :maxLength="500"
                v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider>收款模板详细信息</a-divider>
        <div style="margin-bottom: 20px;">
          <a-button type="primary" icon="plus" class="ml10" @click="addTemplate()">新建</a-button>
        </div>
        <a-table
          size="small"
          bordered
          :rowKey="r => (r.id || r.key)"
          :pagination="false"
          :columns="columns"
          :data-source="collectionTemplateDetails"
          :expandedRowKeys.sync="expandedRowKeys"
          :scroll="{ x: 2045 }"
          :locale="locale"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          <template slot="feeCategoryCode" slot-scope="text, record">
            <a-select v-model="record.feeCategoryCode" placeholder="请选择费用类别" @change="updateShowTable">
              <a-select-option v-for="(item, index) in codeList" :key="index" :value="item.value">{{ item.name }}</a-select-option>
            </a-select>
          </template>
          <template slot="specialCode" slot-scope="text, record">
            <a-input auto-size v-model="record.specialCode" @change="updateShowTable"/>
          </template>
          <template slot="itemName" slot-scope="text, record">
            <a-input auto-size v-model="record.itemName" @change="updateShowTable"/>
          </template>
          <template slot="dueAmountFormula" slot-scope="text, record">
            <a-input auto-size v-model="record.dueAmountFormula" @change="updateShowTable"/>
          </template>
          <template slot="betweenSubjects" slot-scope="text, record">
            <a-input auto-size v-model="record.betweenSubjects" @change="updateShowTable"/>
          </template>
          <template slot="isCanCollect" slot-scope="text, record">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-model="record.isCanCollect"
              @change="updateShowTable"
            ></a-switch>
          </template>
          <template slot="isCanEdit" slot-scope="text, record">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-model="record.isCanEdit"
              @change="updateShowTable"
            ></a-switch>
          </template>
          <template slot="sequence" slot-scope="text, record">
            <a-input-number auto-size v-model="record.sequence" @change="updateShowTable"/>
          </template>
          <template slot="remark" slot-scope="text, record">
            <a-textarea auto-size v-model="record.remark" @change="updateShowTable"/>
          </template>
          <template slot="action" slot-scope="t, record, index">
            <a @click="addChild(record, index)" v-if="!(typeof record.parentIndex === 'number' || record.parentId)">新增</a>
            <a-divider type="vertical" v-if="!(typeof record.parentIndex === 'number' || record.parentId)"/>
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record, index)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {
    dateFormatString,
    defaultErrorMessage,
    filedIsNull,
    maxLenValidator,
    numberValidator,
    zhStringLength
  } from '@/utils/common'
  import labels from '@/utils/labels'
  import moment from 'moment'
  import { v4 as uuid } from 'uuid'

  export default {

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
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        collectionTemplateDetails:[],
        // 表头
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' },
            width: 90
          },
          {
            title: '费用类别',
            dataIndex: 'feeCategoryCode',
            align: 'center',
            width: 160,
            scopedSlots: { customRender: 'feeCategoryCode' }
          },
          // {
          //   title: '模板名称',
          //   align: 'center',
          //   width: 200,
          //   dataIndex: 'templateName',
          //   scopedSlots: { customRender: 'templateName' }
          // },
          {
            title: '收款项目名称',
            align: 'center',
            width: 240,
            dataIndex: 'itemName',
            scopedSlots: { customRender: 'itemName' }
          },
          {
            title: '特项编码',
            dataIndex: 'specialCode',
            align: 'center',
            width: 160,
            scopedSlots: { customRender: 'specialCode' }
          },
          {
            title: '应收款公式',
            dataIndex: 'dueAmountFormula',
            align: 'center',
            width: 280,
            scopedSlots: { customRender: 'dueAmountFormula' }
          },
          {
            title: '用友科目编号',
            align: 'center',
            width: 160,
            dataIndex: 'betweenSubjects',
            scopedSlots: { customRender: 'betweenSubjects' }
          },
          {
            title: '是否收款项',
            dataIndex: 'isCanCollect',
            width: 100,
            align: 'center',
            scopedSlots: { customRender: 'isCanCollect' }
          },
          {
            title: '是否允许编辑',
            dataIndex: 'isCanEdit',
            align: 'center',
            width: 105,
            scopedSlots: { customRender: 'isCanEdit' }
          },
          {
            title: '排序',
            dataIndex: 'sequence',
            align: 'center',
            width: 110,
            scopedSlots: { customRender: 'sequence' }
          },
          {
            title: '备注',
            width: 320,
            dataIndex: 'remark',
            align: 'center',
            scopedSlots: { customRender: 'remark' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 100,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        codeList: [],
        expandedRowKeys: [],
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        }
      }
    },
    created () {
      // console.log(this.columns.map(m => m.width || 0).reduce((a,b) => a+b))
      this.getCodeList()
    },
    methods: {
      maxLenValidator,
      numberValidator,
      getCodeList () {
        this.$getCodeList('1014', res => {
          this.codeList = res
        })
      },
      add (record) {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        if (!this.codeList.length) this.getCodeList()
      },
      edit (record) {
        if (!this.codeList.length) this.getCodeList()
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.templateId = record.id
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.receiptTemplate.getDetail,
          params: { templateId: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.id = data.id
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            if (data.children) {
              data.children.forEach(m => {
                if (m.children) {
                  if (!m.children.length) {
                    delete m.children
                  } else {
                    m.children.forEach(m2 => {
                      delete m2.children
                    })
                  }
                }
              })
            }
            this.collectionTemplateDetails = data.children
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      //
      updateShowTable () {
        this.$forceUpdate()
      },
      // 表格添加子项
      addChild (record, index) {
        const item = this.collectionTemplateDetails[index]
        if (!this.expandedRowKeys.includes(item.id || item.key)) this.expandedRowKeys.push(item.id || item.key)
        if (!item.children)
          item.children = []
        const key = uuid()
        const newData = {
          parentIndex: index,
          key,
          parentId: record.id || '',
          templateId: this.id || '',
          itemName: '',
          feeCategoryCode: record.feeCategoryCode || '',
          specialCode: '',
          dueAmountFormula: '',
          isCanCollect: record.isCanCollect || false,
          isCanEdit: record.isCanEdit || false,
          betweenSubjects: '',
          remark: '',
          sequence:  0
        }
        !item.children.length ? item.children.push(newData) : item.children.unshift(newData)
        this.$set(this.collectionTemplateDetails, index, this.collectionTemplateDetails[index])
      },
      // 添加表格行数据
      addTemplate(){
        const key = uuid()
        const newData = {
          key,
          templateId: this.id || '',
          itemName: '',
          feeCategoryCode: '',
          specialCode: '',
          dueAmountFormula: '',
          isCanCollect: false,
          isCanEdit: false,
          betweenSubjects: '',
          remark: '',
          sequence: 0
        }
        // this.collectionTemplateDetails = [...collectionTemplateDetails,newData]
        this.collectionTemplateDetails.unshift(newData)
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
      // 删除表格行数据
      handleSub (record, index){
        if (typeof record.parentIndex === 'number' || record.parentId) {
          let pIndex = record.parentIndex || 0
          if (record.parentId)
            pIndex = this.collectionTemplateDetails.findIndex(m => m.id === record.parentId)
          this.collectionTemplateDetails[pIndex].children.splice(index, 1)
          this.$set(this.collectionTemplateDetails, pIndex, this.collectionTemplateDetails[pIndex])
        } else {
          this.collectionTemplateDetails.splice(index, 1)
        }
      },
      _verifyData (list) {
        let msg = '', item
        for (let i = 0; i < list.length; i++) {
          item = list[i]
          msg = !item.itemName && `第${i+1}行，请输入收款项目名称`
            || item.itemName && zhStringLength(item.itemName) > 256 && `第${i+1}行，收款项目名称超出长度`
            || item.specialCode && zhStringLength(item.specialCode) > 32 && `第${i+1}行，特向编码超出长度`
            || item.dueAmountFormula && zhStringLength(item.dueAmountFormula) > 4000 && `第${i+1}行，收款公式超出长度`
            || item.betweenSubjects && zhStringLength(item.betweenSubjects) > 64 && `第${i+1}行，用友科目超出长度`
            || item.remark && zhStringLength(item.remark) > 500 && `第${i+1}行，备注超出长度`
            || item.sequence && item.sequence.toString().indexOf('.') > -1 && `第${i+1}行，排序不能为小数`
            || item.sequence && item.sequence.toString().length > 11 && `第${i+1}行，排序超出长度`
          if (msg) return msg
          if (item.children && item.children.length)
            msg = this._verifyData(item.children)
          if (msg) return msg
        }
        return null
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            const msg = this._verifyData(this.collectionTemplateDetails)
            if (msg) {
              this.$notification.warning({
                message: labels.HINT,
                description: msg
              })
              this.confirmLoading = false
              return
            }
            values.children = this.collectionTemplateDetails
            this.$post({
              url: this.$api.basicData.receiptTemplate.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message || ''
                })
              })
              .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => {
                this.confirmLoading = false
              })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.id = ''
        this.collectionTemplateDetails= []
        this.confirmLoading = false
        this.visible = false
      },
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    background: red !important;
    color: #585A62;
  }
  .remark{
    margin-bottom: 20px;
  }
</style>
