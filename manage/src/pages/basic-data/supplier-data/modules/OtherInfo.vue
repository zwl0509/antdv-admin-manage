<template>
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="测量拆单状态" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-select
              placeholder="请选择测量拆单状态"
              v-decorator="['measureStatusCode',{rules: [{ message: '请选择默认价格'}]}]">
              <a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="16" :xs="24">
          <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}" >
            <a-textarea
              :rows="4"
              placeholder="请输入备注"
              autocomplete="off"
              :maxLength="100"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import { maxLenValidator, numberValidator } from '@/utils/common'
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
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        statusList:[]
      }
    },
    created () {
      this.$getCodeList('1020', res => {
        this.statusList = res
      })
    },
    methods: {
      maxLenValidator,
      numberValidator,
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