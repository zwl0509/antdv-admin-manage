<template>
  <a-form :form="form">
    <a-row :grabbed="48">
      <a-col :md="8" :xs="24">
        <a-form-item label="设计协议号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            allowClear
            placeholder="请选择设计协议号"
            :disabled="type == 'detail'"
            v-decorator="[
              'designAgreementNo',
              { rules : [{ required: false, message: rulesMessage.designAgreementNo}]}
            ]">
            <a-select-option v-for="(item, index) in agreementList" :key="index" :value="item.designNo" >{{ item.designNo }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="装修类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入装修类别"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'renovationType',
              { rules: [{ required: true, message: rulesMessage.renovationType}] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="服务模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入服务模式"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'serviceMode',
              { rules: [{ required: true, message: rulesMessage.serviceMode}] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="优惠活动" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            allowClear
            placeholder="请选择优惠活动"
            :disabled="type == 'detail'"
            v-decorator="[
              'discountActivityId',
              { rules : [{ required: false, message: rulesMessage.discountActivityId}]}
            ]">
            <a-select-option v-for="(item, index) in activityList" :key="index" :value="item.id" >{{ item.promotionName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="折前设计费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入折前设计费"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'beforeDesignPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.beforeDesignPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="折前设计价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入折前设计价"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'beforeDesignUnitPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.beforeDesignUnitPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="折后设计费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入折后设计费"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'afterDesignPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.afterDesignPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="折后设计价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入折后设计价"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'afterDesignUnitPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.afterDesignUnitPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="定金单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入定金单价"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'depositUnitPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.depositUnitPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="定金" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入定金"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'depositPrice',
              { rules: [{ required: false }, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.depositPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="设计费单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入设计费"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'designUnitPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.designUnitPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="设计费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入设计费"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'designPrice',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.designPrice) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="设计费优惠" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入设计费优惠"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'designDiscountAmount',
              { rules: [{ required: false}, { validator: (r, v, fun) => regularCheck2(r, v,fun, 'number', [11,2], rulesMessage.designDiscountAmount) }] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="作价日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择作价日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="[
              'pricingDate',
              { rules : [{ required: false, message: rulesMessage.pricingDate }]}
            ]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="签订日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择签订日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="[
              'signDate',
              { rules : [{ required: false, message: rulesMessage.signDate }]}
            ]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预计量房日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择预计量房日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="[
              'estimateMeasuringRoomDate',
              { rules : [{ required: false, message: rulesMessage.estimateMeasuringRoomDate }]}
            ]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="签施工合同日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择签施工合同日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="[
              'estimateSignBuildContractDate',
              { rules : [{ required: false, message: rulesMessage.estimateSignBuildContractDate }]}
            ]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item label="智装登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :max-length="16"
            autocomplete="off"
            placeholder="请输入智装登录账号"
            v-decorator="['userCode',{rules: [{message: rulesMessage.userCode}]}]"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item label="智装登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-password
            placeholder="请输入智装登录密码"
            :max-length="16"
            autocomplete="off"
            v-decorator="['pwd',{rules: [{message: rulesMessage.pwd}]}]"
          ></a-input-password>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="是否远期客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            v-decorator="['isFarDate',{ valuePropName: 'checked', initialValue: true }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="是否首谈成功" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            v-decorator="['isFirstSuccess',{ valuePropName: 'checked', initialValue: true }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="是否免费设计" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            v-decorator="['isFreeDesign',{ valuePropName: 'checked', initialValue: true }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :xs="24">
        <a-form-item label="合同特殊条款" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入合同特殊条款"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'specialClause',
              { rules: [{ required: false, message: rulesMessage.specialClause}] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :xs="24">
        <a-form-item label="备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入备注"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[
              'remark',
              { rules: [{ required: false, message: rulesMessage.remark}] }
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { checkErrors, filedIsNull ,regularCheck2} from '@/utils/common'
  export default {
    name: 'DesignContractInfo',
    props: {
      type: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        form: this.$form.createForm(this),
        rulesMessage: {
          designAgreementNo: '设计合同信息,请输入1到9位的设计协议号!',
          renovationType:'设计合同信息,请输入装修类别!',
          discountActivityId: '设计合同信息,请选择优惠活动!',
          depositUnitPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的定金单价!',
          depositPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的定金!',
          designUnitPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的设计费单价!',
          designPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的折前设计费!',
          beforeDesignUnitPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的折前设计价!',
          afterDesignPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的折后设计费!',
          afterDesignUnitPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的折后设计价!',
          beforeDesignPrice: '设计合同信息,请输入1到9位数字且有效小数为两位的设计费!',
          signDate: '设计合同信息,请选择签订日期!',
          pricingDate: '设计合同信息,请选择作价日期!',
          estimateMeasuringRoomDate: '设计合同信息,请选择预计量房日!',
          estimateSignBuildContractDate: '设计合同信息,请选择签施工合同日!',
          specialClause: '设计合同信息,请输入合同特殊条款!',
          serviceMode:'设计合同信息,请输入服务模式!',
          userCode:'设计合同信息,请输入登录账号',
          pwd:'设计合同信息,请输入登录密码',
          remark: '设计合同信息,请输入备注!'
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 9 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        activityList: [], // 优惠活动列表
        agreementList:[],
      }
    },
    methods: {
      regularCheck2,
      getData() {
        const { form: { validateFields } } = this
        return new Promise((resolve,reject)=> {
          validateFields((errors, values) => {
            if(!errors) {
              values.signDate = values.signDate ? moment(values.signDate).format('YYYY-MM-DD') : null
              resolve(values)
            }else {
              reject(checkErrors(Object.keys(errors), errors))
            }
          })
        })
      },
      setData(data,id) {
        if(data) {
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          data.signDate = data.signDate ? moment(data.signDate).format('YYYY-MM-DD')  : null
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
        this.getActivityList()
        this.getAgreementListList(id)
      },
      // 获取优惠活动列表
      getActivityList() {
        this.$get({
          url: this.$api.basicData.promotionInfo.getList,
          params: {
            currentPage: 0,
            pageSize: 0,
          }
        }).then((res)=>{
          this.activityList = res.rows
        })
      },
      getAgreementListList(id) {
        this.$get({
          url: this.$api.customInfo.BasicNoInfo.getList,
          params: {
            currentPage: 0,
            pageSize: 0,
            type:'1061-10',
            isCancel:false,
            isUse: false,
            isWriteOff: false,
            // sysOrganizationId: 'dd6ff73c002adb9dcec6d87073174746'
            // this.$store.state.user.info.orgId
            customerId: id
          }
        }).then((res)=>{
          this.agreementList = res.rows
        })
      },
      clearInput() {
        this.agreementList = []
        this.activityList = []
        this.form.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>