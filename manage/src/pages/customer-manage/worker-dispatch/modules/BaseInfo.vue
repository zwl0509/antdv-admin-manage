<template>
  <div>
    <!-- 客户其他信息 -->
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="客户编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入客户编号"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['customerJob',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入客户姓名"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['telephone',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入装修地址"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['idCard',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入联系电话"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['linkmanMobile',{rules: [{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="客户状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
          <a-form-item label="营销部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入营销部门"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['familyMember',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="分总" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入分总"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['presentAddress',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="建筑面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入建筑面积(m²)"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['buildingArea',{ rules: [{ required: true, message: '客户基础信息,请输入建筑面积(m²)!'},{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [9,2], '建筑面积格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="实用面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入建筑面积(m²)"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['buildingArea',{ rules: [{ required: true, message: '客户基础信息,请输入建筑面积(m²)!'},{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [9,2], '建筑面积格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { checkErrors, filedIsNull, maxLenValidator, numberValidator,regularCheck,regularCheck2 } from '@/utils/common'
  export default {
    name: 'BaseInfo',
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
        form: this.$form.createForm(this),
        codeType: {
          customerType:[]
        },
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