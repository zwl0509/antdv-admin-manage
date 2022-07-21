<template>
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="银行账号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入银行账号"
              autocomplete="off"
              v-decorator="['supplyAccount', {rules: [{message: '请输入银行账号'}, { validator:(r, v, fun)=> regularCheck('bank', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="经营范围" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入经营范围"
              autocomplete="off"
              :maxLength="100"
              v-decorator="['businessCope', {rules: [{message: '请输入经营范围'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="默认价格" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-select
              placeholder="请选择默认价格"
              v-decorator="['defaultPriceCode',{rules: [{ message: '请选择默认价格'},{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 10)}]}]">
              <a-select-option v-for="(item, index) in priceList" :value="item.value" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="供应商交易金额" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入供应商交易金额"
              autocomplete="off"
              disabled
              v-decorator="['supplyMoney']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="供应商支付金额" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入供应商支付金额"
              autocomplete="off"
              disabled
              v-decorator="['supplyPayMoney']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import { maxLenValidator, numberValidator,regularCheck,regularCheck2 } from '@/utils/common'
  export default {
    name: 'Payment',
    props: {
      info: {
        type: Object,
        default: null,
      },
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
        priceList:[],
        modalType:''
      }
    },
    created () {
      this.$getCodeList('1021', res => {
        this.priceList = res
      })
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck,
      regularCheck2
    },
    watch: {
      info: {
        handler(newInfo) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(Object.assign({}, newInfo), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>