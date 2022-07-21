<template>
  <div>
    <!-- 客户扩展其他信息 -->
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="结婚纪念日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择结婚纪念日"
              :disabled="type == 'detail'"
              v-decorator="['weddingDay']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="配偶生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择配偶生日"
              :disabled="type == 'detail'"
              v-decorator="['spouseBirth']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="父亲生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择父亲生日"
              :disabled="type == 'detail'"
              v-decorator="['fatherBirth']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="父亲工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入父亲工作单位"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['fatherWorkPlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="母亲生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择母亲生日"
              :disabled="type == 'detail'"
              v-decorator="['motherBirth']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="母亲工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入母亲工作单位"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['motherWorkPlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="有无子女" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch 
              checked-children="是" 
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['offspring',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="子女姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入子女姓名"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['offspringName',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 200) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="子女生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择子女生日"
              :disabled="type == 'detail'"
              v-decorator="['offspringBirth']"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :grabbed="48">
        <a-col :md="24" :xs="24">
          <a-form-item class="col-1-9">
            <span slot="label" style="padding-top:10px">就读学校或&nbsp;&nbsp;&nbsp;<br/>工作单位</span>
            <a-textarea
              placeholder="请输入就读学校或工作单位"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['offspringStudyOrWorkPlace',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item class="col-1-9">
            <span slot="label" style="padding-top:10px">是否参加私人&nbsp;&nbsp;&nbsp;<br/>会所或俱乐部</span>
            <a-textarea
              placeholder="请输入是否参加私人会所或俱乐部"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['clubInfo',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="客户分类意见" class="col-1-9">
            <a-textarea
              placeholder="请输入客户分类意见"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['commentsOfClassification',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="备注" class="col-1-9">
            <a-textarea
              placeholder="请输入备注"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['remark',{ rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { checkErrors, maxLenValidator, numberValidator } from '@/utils/common'
  export default {
    name: 'MoreInfo',
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
              values.weddingDay = values.weddingDay ? moment(values.weddingDay).format('YYYY-MM-DD') : null
              values.spouseBirth = values.spouseBirth ? moment(values.spouseBirth).format('YYYY-MM-DD') : null
              values.fatherBirth = values.fatherBirth ? moment(values.fatherBirth).format('YYYY-MM-DD') : null
              values.motherBirth =  values.motherBirth ? moment(values.motherBirth).format('YYYY-MM-DD') : null
              values.offspringBirth = values.offspringBirth ? moment(values.offspringBirth).format('YYYY-MM-DD') : null
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
          info.weddingDay = info.weddingDay ? moment(info.weddingDay) : ''
          info.spouseBirth = info.spouseBirth ? moment(info.spouseBirth) : ''
          info.fatherBirth = info.fatherBirth ? moment(info.fatherBirth) : ''
          info.motherBirth = info.motherBirth ? moment(info.motherBirth) : ''
          info.offspringBirth = info.offspringBirth ? moment(info.offspringBirth) : ''
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