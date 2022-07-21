<template>
  <div>
    <!-- 客户扩展信息 -->
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="平面图状况" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入平面图状况"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['planarGraphCondition', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="电子邮件" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入电子邮件"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['mail']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否远程客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch 
              checked-children="是" 
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['autocomplete3',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="所属行业" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择所属行业" :disabled="type == 'detail'" v-decorator="['industryInvolved',{ rules : [{ required: false, message: '客户扩展信息,请选择所属行业!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.industryInvolvedType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="年龄区间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择年龄区间" :disabled="type == 'detail'" v-decorator="['ageRange',{ rules : [{ required: false, message: '客户扩展信息,请选择年龄区间!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.ageRangeType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否重点小区" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch 
              checked-children="是" 
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['remote',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="月收入" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入月收入"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['monthlyIncome',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 20) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="房价" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入房价"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['housePrice',{ rules: [{validator: (r,v,f) => regularCheck2(r, v, f, 'number', [11,2], '房价格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="回单标志" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择回单标志" :disabled="type == 'detail'" v-decorator="['replyOrderTag',{ rules : [{ required: false, message: '客户扩展信息,请选择回单标志!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.replyOrderTag"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否回访" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch 
              checked-children="是" 
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['returnVisit',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="回访日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择回访日期"
              :disabled="type == 'detail'"
              v-decorator="['returnVisitDate']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>

      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { checkErrors, maxLenValidator, numberValidator,regularCheck2, filedIsNull } from '@/utils/common'
  export default {
    name: 'ExtendInfo',
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
              values.returnVisitDate =values.returnVisitDate ? moment(values.returnVisitDate).format('YYYY-MM-DD'): null
              resolve(values)
            } else {
              const keys = ['industryInvolved','ageRange','replyOrderTag']
              reject(checkErrors(keys, errors))
            }
          })
        })
      },
      setData(info) {
        if (info) {
          this.id = info.id
          for (const key in info) {
            if (filedIsNull(info[key])) {
              delete info[key]
            }
          }
          info.industryInvolved = info.industryInvolved || undefined
          info.ageRange = info.ageRange || undefined
          info.eplyOrderTag = info.eplyOrderTag || undefined
          const { form: { setFieldsValue } } = this
          info.returnVisitDate = info.returnVisitDate ? moment(info.returnVisitDate) : ''
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, info), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      clearInput() {
        this.id = ''
        this.form.resetFields()
      }
    }
  }
</script>