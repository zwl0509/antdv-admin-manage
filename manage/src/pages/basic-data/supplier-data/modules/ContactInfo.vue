<template>
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="供应商地址" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入供应商地址"
              autocomplete="off"
              :maxLength="100"
              v-decorator="['address', {rules: [{message: '请输入供应商地址'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="邮编" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入邮编"
              autocomplete="off"
              :maxLength="50"
              v-decorator="['postcode', {rules: [{message: '请输入邮编'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入电话"
              autocomplete="off"
              v-decorator="['phone', {rules: [{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="传真" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入传真"
              autocomplete="off"
              v-decorator="['fax', {rules: [{message: '请输入传真'}, { validator:(r, v, fun)=> regularCheck('fax', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入负责人"
              autocomplete="off"
              :maxLength="20"
              v-decorator="['headPerson', {rules: [{message: '请输入负责人'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="负责人电话" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入负责人电话"
              autocomplete="off"
              v-decorator="['headPersonPhone', {rules: [{message: '请输入负责人电话'},{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入联系人"
              autocomplete="off"
              :maxLength="20"
              v-decorator="['linkPerson', {rules: [{message: '请输入联系人'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="联系人电话" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入联系人电话"
              autocomplete="off"
              v-decorator="['linkPersonPhone', {rules: [{message: '请输入联系人电话'},{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="用友编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入用友编码"
              autocomplete="off"
              :maxLength="128"
              v-decorator="['thirdPartyCode', {rules: [{message: '请输入用友编码'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="开户行" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入开户行"
              autocomplete="off"
              :maxLength="128"
              v-decorator="['bankAccount', {rules: [{message: '请输入开户行'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="开户名" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入开户名"
              autocomplete="off"
              :maxLength="128"
              v-decorator="['bankUsername', {rules: [{message: '请输入开户名'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="税率" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入税率"
              autocomplete="off"
              v-decorator="['taxRate', {rules: [{ validator:(r, v, fun)=> regularCheck('taxRate', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import { maxLenValidator, numberValidator,regularCheck } from '@/utils/common'
  export default {
    name: 'ContactInfo',
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
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck,
      getData(){
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            return values
          } 
        })
        return
      },
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