<template>
  <a-form :form="form">
    <a-row :grabbed="48">
      <a-col :md="8" :xs="24">
        <a-form-item label="合同编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入合同编号"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['customerJob',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="合同签订日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择合同签订日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateStartDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="工期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入工期"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['buildContractWorkDate']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预计开工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择预计开工日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateStartDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预计完工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择预计完工日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateCompleteDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="实际开工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择实际开工日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateStartDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预计实际完工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择预计实际完工日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateCompleteDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="施工状况" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择客户客户状态" :disabled="type == 'detail'" v-decorator="['knownInfo',{ rules : [{ required: false, message: '客户其他信息,请选择客户了解信息!'}]}]">
            <a-select-option
              v-for="(item, index) in codeType.customerType"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="施工合同金额" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input
            type="number"
            :disabled="type == 'detail'"
            placeholder="请输入施工合同金额"
            autocomplete="off"
            v-decorator="['stockMoney',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '库存金额格式校验失败') }] }]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :md="24" :xs="24">
        <a-form-item label="合同特殊条款" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入合同特殊条款"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'specialClause',
              { rules: [{ required: false}] }
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { checkErrors, filedIsNull, maxLenValidator, numberValidator,regularCheck,regularCheck2 } from '@/utils/common'
  export default {
    name: 'ContractInfo',
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
          sm: { span: 9 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
        form: this.$form.createForm(this),
        codeType: {},
        id: '',
        sVal:''
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck2,
      regularCheck,
      change(e){
        const inputText = e.target.value
        console.log(inputText)
        if (inputText >= 100){
          const { form: { setFieldsValue } } = this
          this.$nextTick(()=>{
            setFieldsValue({
              successRate: 100
            })
          })
        }else if(inputText < 0){
          const { form: { setFieldsValue } } = this
          this.$nextTick(()=>{
            setFieldsValue({
              successRate: 0
            })
          })
        }
      },
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
              values.dateForDecoration = values.dateForDecoration ? moment(values.dateForDecoration).format('YYYY-MM-DD') : null
              values.dateForMeasure = values.dateForMeasure ? moment(values.dateForMeasure).format('YYYY-MM-DD') : null
              resolve(values)
            } else {
              const keys = ['knownInfo','focusOn']
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
          info.knownInfo = info.knownInfo || undefined
          info.focusOn = info.focusOn || undefined
          info.infoChannel = info.infoChannel || undefined
          const { form: { setFieldsValue } } = this
          info.dateForMeasure = info.dateForMeasure ? moment(info.dateForMeasure).format('YYYY-MM-DD')  : undefined
          info.dateForDecoration = info.dateForDecoration ? moment(info.dateForDecoration).format('YYYY-MM-DD')  : undefined
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

<style scoped>

</style>
