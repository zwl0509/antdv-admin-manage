<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="900"
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
            <a-form-item label="定额包" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select placeholder="请选择定额包" v-decorator="['packageId',{rules: [{ required: true, message: '请选择定额包'}]}]">
                <a-select-option
                  v-for="(item, index) in superiorList"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="分类类别" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select placeholder="请选择分类类别" v-decorator="['detailType',{rules: [{required: true, message: '请选择类型'}]}]">
                <a-select-option
                  v-for="(item, index) in classType"
                  :key="index"
                  :value="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="名称"
                autocomplete="off"
                :maxLength="100"
                v-decorator="['sourceName', {rules: [{message: '请输入名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入编号"
                autocomplete="off"
                :maxLength="64"
                v-decorator="['sourceCode', {rules: [{message: '请输入编号'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="特项代码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入特项代码"
                autocomplete="off"
                :maxLength="32"
                v-decorator="['specialCode', {rules: [{message: '请输入特项代码'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入规格"
                autocomplete="off"
                :maxLength="100"
                v-decorator="['sourceSpec', {rules: [{message: '请输入规格'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="采购价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入采购价"
                autocomplete="off"
                v-decorator="['costPrice', { rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '采购价校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入数量"
                autocomplete="off"
                v-decorator="['budNum' ,{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '数量格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="销售单位" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入销售单位"
                autocomplete="off"
                :maxLength="10"
                v-decorator="['sourceUnit', {rules: [{message: '请输入销售单位'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入排序"
                autocomplete="off"
                v-decorator="['sequence',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的顺序') }]}]"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="12" :xs="24">
            <a-form-item label="源材料id" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入源材料id"
                autocomplete="off"
                v-decorator="['sourceMaterialId', {rules: [{message: '请输入源材料id'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-textarea
                placeholder="请输入备注"
                :maxLength="1000"
                autocomplete="off"
                v-decorator="['remark', {rules: [{message: '请输入备注'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="是否禁用" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isDisabled',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否固定数量" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isFixed',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {
  checkErrors,
  defaultErrorMessage,
  filedIsNull,
  maxLenValidator,
  numberValidator,
  regularCheck2
} from '@/utils/common'
import labels from '@/utils/labels'

export default {
  data () {
    return {
      superiorList:[],
      classType: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      visible: false,
      modalType: 'add',
      confirmLoading: false,
      id: '',
      form: this.$form.createForm(this),
      parentId: ''
    }
  },
  created() {
    this.$getCodeList('1015', res => {
      this.classType = res

    })
    this.getList()
  },
  methods: {
    maxLenValidator,
    regularCheck2,
    numberValidator,
    getList(){
      this.$get({
        url:this.$api.basicData.packageInfo.getMasterList
      }).then(res=>{
        this.superiorList=res.rows
      })
    },
    add (record) {
      this.form.resetFields()
      this.modalType = 'add'
      this.id = ''
      this.visible = true
    },
    edit (record) {
      const { form: { setFieldsValue } } = this
      this.modalType = 'edit'
      this.id = record
      this.visible = true
      this.confirmLoading = true
      this.$get({
        url: this.$api.basicData.packageInfo.getSlaveDetail,
        params: { id: record }
      })
        .then(res => {
          const data = { ...res }
          this.parentId = data.parentId
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
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.value = values.type !== undefined ? values.type + '-' + values.code : values.code
          this.$post({
            url: this.$api.basicData.packageInfo.editSlave,
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
        }else {
          const keys=['costPrice','budNum','sequence']
          defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      // 重置表单数据
      this.form.resetFields()
      this.parentId = ''
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
</style>
