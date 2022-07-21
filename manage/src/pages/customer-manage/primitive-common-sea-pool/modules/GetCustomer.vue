<template>
  <a-modal
    title="捞取客户"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="客户类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择客户类型" v-decorator="['relationship']">
                <a-select-option
                  v-for="(item, index) in codeType.relationshipType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="营销类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择营销类型" v-decorator="['marketingType']">
                <a-select-option
                  v-for="(item, index) in codeType.marketingType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="装修风格" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择装修风格" v-decorator="['decorationStyle']">
                <a-select-option
                  v-for="(item, index) in codeType.decorationStyleType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="房型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择房型" v-decorator="['houseType']">
                <a-select-option
                  v-for="(item, index) in codeType.houseType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="户型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择户型" v-decorator="['roomType']">
                <a-select-option
                  v-for="(item, index) in codeType.roomType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="信息来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择信息来源" v-decorator="['infoSource']">
                <a-select-option
                  v-for="(item, index) in codeType.infoSourceType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="了解公司途径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select allowClear placeholder="请选择了解公司途径" v-decorator="['knowCoWay']">
                <a-select-option
                  v-for="(item, index) in codeType.knowCoWayType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否上门客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['visited',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否期房客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['future',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否有电梯" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['elevator',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'GetCustomer',
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        type: ''
      }
    },
    methods: {
      moment,
      show(type) {
        this.visible = true
        this.type = type
        this.$emit('getCodeList')
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        // this.confirmLoading = true
        this.getCustomer()
        // validateFields((errors, values) => {
        //   if (!errors) {
        //   } else {
        //     this.confirmLoading = false
        //   }
        // })
      },
      // 捞取客户数据
      getCustomer() {
        this.$get({
          url: this.$api.customInfo.customerCommon.getRandCustomer,
          params: { type: this.type},
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        // 重置表单数据
        this.type = ''
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
      }
    }
  }
</script>
