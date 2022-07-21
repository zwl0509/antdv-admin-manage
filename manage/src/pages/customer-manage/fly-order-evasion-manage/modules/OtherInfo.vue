<template>
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="逃单分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择逃单分类" v-decorator="['type12',{ rules : [{ required: true}]}]">
              <a-select-option
                v-for="(item, index) in json.type10"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :grabbed="48">
        <a-col :md="24" :sm="24">
          <a-form-item label="逃单备注信息" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
            <a-textarea
              :rows="4"
              placeholder="请输入逃单备注信息"
              autocomplete="off" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import json from './mocks.js'
  import pick from 'lodash.pick'
  import { defaultErrorMessage, maxLenValidator, numberValidator } from '@/utils/common'

  export default {
    name: 'OtherInfo',
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
        json,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        percent: 0,
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,

    },
    watch: {
      info: {
        handler (newInfo,oldInfo) {
          this.percent = 20
          this.form.setFieldsValue(pick(Object.assign({}, newInfo), Object.keys(this.form.fieldsStore.fieldsMeta)))
          this.$nextTick(() => {
            this.form.setFieldsValue({})
          })
        },
        immediate: true,
        deep: true,
      },
      percent:{
        handler(newNum) {
          if(newNum >100) {
            this.percent = 100
          } else if(newNum < 0) {
            this.percent = 0
          }else {
            this.percent = Number(newNum)
          }
        },
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