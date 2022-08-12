<template>
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入客户名称"
              autocomplete="off"
              disabled
              v-decorator="['customerName']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入地址"
              autocomplete="off"
              disabled
              v-decorator="['finalAddress']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              disabled
              placeholder="请输入电话"
              autocomplete="off"
              v-decorator="['mobileNumber']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="户型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select disabled allowClear placeholder="请选择户型" v-decorator="['roomType']">
              <a-select-option
                v-for="(item, index) in roomType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="门店" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入门店"
              autocomplete="off"
              disabled
              v-decorator="['storeName']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入项目经理"
              autocomplete="off"
              disabled
              v-decorator="['signDate1']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="设计师" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入设计师"
              autocomplete="off"
              disabled
              v-decorator="['designer']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="完工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              show-time
              placeholder="请选择完工日期"
              style="width: 100%;"
              disabled
              v-decorator="['signDate']"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="客服邀约人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入客服邀约人"
              autocomplete="off"
              disabled
              v-decorator="['operateName']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="邀约时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              show-time
              :disabled="type === 'detail'"
              placeholder="请选择邀约时间"
              style="width: 100%;"
              v-decorator="['recordTime',{ rules : [{ required: true, message: '请选择邀约时间!'}]}]"
            ></a-date-picker>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import { defaultErrorMessage, checkErrors, filedIsNull, maxLenValidator, numberValidator, regularCheck,regularCheck2 } from '@/utils/common'
  import { Ellipsis } from '@/components'
  import moment from 'moment'

  export default {
    name: 'CustomerInfo',
    components: { Ellipsis },
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
        stockManagerList:[],
        text1:'',
        form: this.$form.createForm(this),
        addressForm: this.$form.createForm(this),
        roomType: [],
        id: '',
        customerId:'',
        customerName:'',
        qrCode: '',
        finalAddress:'',
        selectLoading: false,
        list:[0],
        autoIndex: 0
      }
    },
    created() {
      this.$getCodeList('1026', res => {
        this.roomType = res
      })
    },
    methods: {
      getCustomer(customerId){
        console.log(customerId)
        this.confirmLoading = true
        this.$get({
          url: this.$api.customerServiceInfo.getCustomerList,
          params: { customerId }
        }).then((res) =>{
          const data =  res.rows[0]
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      maxLenValidator, numberValidator,regularCheck,regularCheck2,
      // 获取code数据
      getCodeList(codeType) {
        this.codeType = codeType
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      getData(){
        const { form: { validateFields } } = this
        return new Promise((resolve, reject)=> {
          validateFields((errors, values) => {
            if(!errors) {
              values.customerId = this.customerId
              values.signDate = values.signDate ? moment(values.signDate).format('YYYY-MM-DD HH:mm:ss') : null
              values.recordTime = values.recordTime ? moment(values.recordTime).format('YYYY-MM-DD HH:mm:ss') : null
              resolve({ ...values })
            }else reject(errors)
          })
        })
      },
      setData(data) {
        if (data) {
          this.id = data.id
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          const { form: { setFieldsValue } } = this
          this.customerId = data.customerId
          data.signDate = data.signDate ? moment(data.signDate): undefined
          data.recordTime = data.recordTime ? moment(data.recordTime): undefined
          //将循环出来的type值传给recordTypes，渲染出来
          data.recordTypes = data.recordType
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      clearInput() {
        this.id = ''
        this.customerId = ''
        this.customerName = ''
        this.finalAddress = ''
        this.confirmLoading = false
        this.visible = false
        this.form.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .ant-form-item {
    display: flex;
    align-items: center;
  }
  ::v-deep .icon{
    width: 80px;
  }
  ::v-deep .qr-img{
    width: 200px;
    height: 200px;
  }
  ::v-deep .dynamic-add-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #b80201;
    transition: all 0.3s;
  }
  .dynamic-add-button:hover {
    color: #b80201;
  }
  .dynamic-add-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ::v-deep .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
    margin-right: 20px;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ::v-deep .question{
    margin-right: 20px;
  }
  ::v-deep .col-1-9{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
      // line-height: 20px;
      label{
        white-space: break-spaces;
      }
    }
    .ant-form-item-control-wrapper{
      width: 88.888888%;
      float: left;
    }
  }
  ::v-deep .ant-form-item-children {
    display: flex;
  }
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    padding: 0;
    // background: red !important;
    color: #585A62;
  }
  ::v-deep .area-select .ant-select-dropdown-menu {
    padding-bottom: 40px;
    max-height: 384px;
  }
  ::v-deep .select-page{
    background: white;
    position:absolute;
    bottom: 0;
    width: 100%;
    pointer-events: none;
    padding: 0;
    .page-btn{
      padding: 10px 0;
    }
    .page-nav{
      padding: 10px 0;
    }
  }
  ::v-deep .select-page.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled){
    background: white;
  }
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    color: #b8b8b8;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    width: 245px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
  .customer-name{
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 10px;
    max-width: 245px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
</style>
