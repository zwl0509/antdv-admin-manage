<template>
  <div>
    <!-- 客户深化信息 -->
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入年龄"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['age',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="身高(米)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入身高(米)"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['stature',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [5,2], '身高格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="体重(千克)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入体重(千克)"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['weight',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [5,2], '体重格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="民族" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入民族"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['nation',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="婚姻状况" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch 
              checked-children="是" 
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['married',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="配偶姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配偶姓名"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['spouseName',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="配偶电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配偶电话"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['spousePhone',{rules: [{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="配偶工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配偶工作单位"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['spouseWorkPlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="配偶职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入配偶职务"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['spousePost',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="籍贯" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入籍贯"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['nativePlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="成长地点" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入成长地点"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['growthPlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="宗教信仰" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入宗教信仰"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['education',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否服兵役" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch 
              checked-children="是" 
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['militaryService',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="体貌特征" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入体貌特征"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['features',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="教育背景" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入教育背景"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['education',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入工作单位"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['workPlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入职务"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['customerPost',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="工作年限" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入工作年限"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['workingYears',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [3,1], '工作年限校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="衣着风格" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入衣着风格"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['clothingStyle',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="性格特征" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入性格特征"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['personality',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="车辆品牌及车牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入车辆品牌及车牌"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['vehicleInfo',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :grabbed="48">
        <a-col :md="24" :xs="24">
          <a-form-item label="经济实力" class="col-1-9">
            <a-textarea
              placeholder="请输入经济实力"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['economicStrength',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item class="col-1-9">
            <span slot="label" style="padding-top:10px">选择我公司装修&nbsp;&nbsp;&nbsp;<br/>的原因</span>
            <a-textarea
              placeholder="请输入选择我公司装修的原因"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['reasonToChoose',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item class="col-1-9">
            <span slot="label" style="padding-top:10px">是否推介客户及&nbsp;&nbsp;&nbsp;<br/>其合同编号</span>
            <a-textarea
              placeholder="请输入是否推介客户及其合同编号"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['recommendedOrContractNo']"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="客户价值体现" class="col-1-9">
            <a-textarea
              placeholder="请输入客户价值体现"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['valueEmbodiment',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="兴趣爱好" class="col-1-9">
            <a-textarea
              placeholder="请输入兴趣爱好"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['hobbies',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="客户喜欢的话题" class="col-1-9">
            <a-textarea
              placeholder="请输入客户喜欢的话题"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['topicOfInterest',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="忌讳事项" class="col-1-9">
            <a-textarea
              placeholder="请输入忌讳事项"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['tabooMatters',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import { checkErrors, maxLenValidator, numberValidator, regularCheck,regularCheck2 } from '@/utils/common'
  export default {
    name: 'DeepenInfo',
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        codeType: {},
        id: ''
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck,
      regularCheck2,
      // 获取code数据
      getCodeList(codeType) {
        this.codeType = codeType 
      },
      getData() {
        const { form: { validateFields } } = this
        return new Promise((resolve,reject)=> {
          validateFields((errors, values) => {
            if(!errors) {
              values.id = this.id
              resolve(values)
            } else {
              const keys = []
              reject(checkErrors(keys, errors))
            }
          })
        })
      },
      setData(info) {
        if (info) {
          this.id = info.id
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, info), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      clearInput() {
        this.id = ''
        this.form.resetFields()
      }
    },
  }
</script>

<style lang="scss" scoped>
::v-deep .col-1-9{
  .ant-form-item-label{
    width: 11.111111%;
    float: left;
    line-height: 20px;
    label{
      white-space: break-spaces;
    }
  }
  .ant-form-item-control-wrapper{
    width: 88.888888%;
    float: left;
  }
}
</style>