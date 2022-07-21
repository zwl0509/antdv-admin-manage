<template>
  <div>
    <!-- 客户其他信息 -->
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="职业" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入职业"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['customerJob',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="座机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入座机号"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['telephone',{rules: [{ validator:(r, v, fun)=> regularCheck('telephone', v, fun,'座机号格式错误')}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="身份证" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入身份证"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['idCard',{rules: [{ validator:(r, v, fun)=> regularCheck('identity', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="其他联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入其他联系人"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['linkman',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="其他联系人电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入其他联系人电话"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['linkmanMobile',{rules: [{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="8" :xs="24">
          <a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择生日"
              format="MM-DD"
              v-decorator="['signingDate']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col> -->
        <a-col :md="8" :xs="24">
          <a-form-item label="备用电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入备用电话"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['alternateMobile',{rules: [{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun,'备用电话格式错误')}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="家庭成员" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入家庭成员"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['familyMember',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="现在住址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入现在住址"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['presentAddress',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="客户了解信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择客户了解信息" :disabled="type == 'detail'" v-decorator="['knownInfo',{ rules : [{ required: false, message: '客户其他信息,请选择客户了解信息!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.knownInfoType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="客户重点关注" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择客户重点关注" :disabled="type == 'detail'" v-decorator="['focusOn',{ rules : [{ required: false, message: '客户其他信息,请选择客户重点关注!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.focusOnType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="信息渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择信息渠道" :disabled="type == 'detail'" v-decorator="['infoChannel']">
              <a-select-option
                v-for="(item, index) in codeType.infoChannelType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="预计装修造价" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入预计装修造价"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['budget',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [11,2], '装修预算格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="预计装修日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              :getCalendarContainer=" triggerNode => { return triggerNode.parentNode }"
              placeholder="请选择预计装修日期"
              :disabled="type == 'detail'"
              v-decorator="['dateForDecoration']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="预计量房日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              :getCalendarContainer=" triggerNode => { return triggerNode.parentNode }"
              placeholder="请选择预计量房日期"
              :disabled="type == 'detail'"
              v-decorator="['dateForMeasure']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="成功率" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              @change="change"
              placeholder="请输入成功率"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['successRate',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [5,2], '成功率格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :grabbed="48">
        <a-col :md="24" :xs="24">
          <a-form-item class="col-1-9">
            <span slot="label" style="padding-top:10px">客户装修&nbsp;&nbsp;&nbsp;<br/>要求</span>
            <a-textarea
              :rows="2"
              placeholder="请输入客户装修要求"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['customerDemand',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
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
    name: 'OtherInfo',
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