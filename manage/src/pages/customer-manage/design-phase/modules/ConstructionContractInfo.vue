<template>
  <a-form :form="form">
    <!-- 基础信息 -->
    <a-row :grabbed="48">
      <a-col :md="8" :xs="24">
        <a-form-item label="施工合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入施工合同号"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['buildContractNo',{rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 30)}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="签施工合同日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择签施工合同日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['signDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预计开工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择预计开工日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateStartDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="合同工期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入合同工期"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['buildContractWorkDate',{rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 20)}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预计完工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择预计完工日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['estimateCompleteDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预算总金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入预算总金额"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['estimateTotalAmount',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [11,2], '预算总金额格式校验失败') }] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预算优惠金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入预算优惠金额"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['estimatePreferentialAmount',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [11,2], '预算优惠金额格式校验失败') }] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="预算优惠折率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入预算优惠折率"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['estimateDiscountRate',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [11,4], '预算优惠折率格式校验失败') }] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="合同金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="number"
            placeholder="请输入合同金额"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['contractAmount',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [11,2], '合同金额格式校验失败') }] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="参与活动" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            allowClear
            placeholder="请选择优惠活动"
            :disabled="type == 'detail'"
            v-decorator="['activityId']">
            <a-select-option v-for="(item, index) in activityList" :key="index" :value="item.id" >{{ item.promotionName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="中期款日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="请选择中期款日期"
            style="width: 100%;"
            :disabled="type == 'detail'"
            v-decorator="['interimPaymentDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="身份证" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入身份证"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['idCard', {rules: [{ validator: (r, v, fun) => regularCheck('identity', v, fun) }]}]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="有效通讯地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入有效通讯地址"
            :max-length="255"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['postalAddress']"/>
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
        <a-form-item label="甲方代表人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入甲方代表人"
            autocomplete="off"
            :max-length="32"
            :disabled="type == 'detail'"
            v-decorator="['representativePartA']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="乙方代表人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入乙方代表人"
            autocomplete="off"
            :max-length="32"
            :disabled="type == 'detail'"
            v-decorator="['representativePartB']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="紧急联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入紧急联系人"
            autocomplete="off"
            :max-length="32"
            :disabled="type == 'detail'"
            v-decorator="['urgentContact']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="紧急联系人电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入紧急联系人电话"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="[ 'urgentContactMobile', {rules: [{ validator:(r, v, fun)=> regularCheck('mobilePhone', v, fun)}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="紧急联系人地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入紧急联系人地址"
            autocomplete="off"
            :disabled="type == 'detail'"
            :max-length="32"
            v-decorator="['urgentContactAddress']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="是否允许签合同" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :disabled="type == 'detail'"
            v-decorator="['isAllowSign',{ valuePropName: 'checked', initialValue: true }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item label="是否主材包客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :disabled="type == 'detail'"
            v-decorator="['isMasterMaterial',{ valuePropName: 'checked', initialValue: true }]"/>
        </a-form-item>
      </a-col>

    </a-row>
    <!-- 其他信息 -->
    <a-row :grabbed="48">
      <a-col :md="24" :xs="24">
        <a-form-item label="其他" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入其他"
            autocomplete="off"
            :max-length="500"
            :disabled="type == 'detail'"
            v-decorator="[
              'remark',
              { rules: [{ required: false, message: rulesMessage.specialClause}] }
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :xs="24">
        <a-form-item label="补充约定内容" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入补充约定内容"
            autocomplete="off"
            :max-length="500"
            :disabled="type == 'detail'"
            v-decorator="[
              'supplyAppointmentInfo',
              { rules: [{ required: false, message: rulesMessage.remark}] }
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <!-- 指定人员 -->
    <a-row :grabbed="48">
      <a-button v-if="type !== 'detail'" type="primary" icon="plus" style="margin-bottom: 10px" @click="handleAdd">新增指定人员</a-button>
      <contact-item
        v-for="(item, index) in appointorsList"
        :key="item.index"
        ref="ContactItem"
        :data-info="item"
        :index="index + 1"
        :type="type"
        :show="appointorsList.length > 1"
        @delete="handleDelete(index)"
      ></contact-item>
    </a-row>
  </a-form>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { checkErrors, filedIsNull ,regularCheck2,regularCheck,maxLenValidator} from '@/utils/common'
  import ContactItem from './ContactItem'
  export default {
    components: { ContactItem },
    name: 'ConstructionContractInfo',
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
          designAgreementNo: '施工合同信息,请输入1到9位的设计协议号!',
          renovationType:'施工合同信息,请输入合同工期!',
          discountActivityId: '施工合同信息,请选择优惠活动!',
          depositUnitPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的定金单价!',
          depositPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的定金!',
          designUnitPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的设计费单价!',
          designPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的折前设计费!',
          beforeDesignUnitPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的折前设计价!',
          afterDesignPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的折后设计费!',
          afterDesignUnitPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的折后设计价!',
          beforeDesignPrice: '施工合同信息,请输入1到9位数字且有效小数为两位的设计费!',
          signDate: '施工合同信息,请选择签订日期!',
          pricingDate: '施工合同信息,请选择作价日期!',
          estimateMeasuringRoomDate: '施工合同信息,请选择预计量房日!',
          estimateSignBuildContractDate: '施工合同信息,请选择签施工合同日!',
          specialClause: '施工合同信息,请输入合同特殊条款!',
          serviceMode:'施工合同信息,请输入服务模式!',
          userCode:'施工合同信息,请输入登录账号',
          pwd:'施工合同信息,请输入登录密码',
          remark: '施工合同信息,请输入备注!'
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
        //  新增指定人员
        appointorsList: [],
      }
    },
    methods: {
      regularCheck2,regularCheck,maxLenValidator,
      getData() {
        const { form: { validateFields } } = this
        return new Promise((resolve,reject)=> {
          validateFields((errors, values) => {
            if(!errors) {
              values.signDate = values.signDate ? moment(values.signDate).format('YYYY-MM-DD') : null
              values.estimateStartDate = values.estimateStartDate ? moment(values.estimateStartDate).format('YYYY-MM-DD') : null
              values.estimateCompleteDate = values.estimateCompleteDate ? moment(values.estimateCompleteDate).format('YYYY-MM-DD') : null
              values.interimPaymentDate = values.interimPaymentDate ? moment(values.interimPaymentDate).format('YYYY-MM-DD') : null
              values.designAgreementNo = values.designAgreementNo ? moment(values.designAgreementNo).format('YYYY-MM-DD') : null
              // 验证联系人信息
              const appointorsList = []
              let flag = true
              for (const index in this.appointorsList) {
                this.$refs.ContactItem[index].form.validateFields((errors01, values01) => {
                  if (!errors01) {
                    values01.id = this.appointorsList[index].id
                    delete values01.index
                    appointorsList.push(values01)
                  } else {
                    flag = false
                    return
                  }
                })
              }
              if(flag) {
                values.appointors = appointorsList
                resolve(values)
              }
            }else {
              reject(checkErrors(Object.keys(errors), errors))
            }
          })
        })
      },
      setData(data,id) {
        this.appointorsList = [{
            appointorName: '',
            appointorIdCard: '',
            appointorRelationship: '',
            index:0,
            id: '',
        }]
        if(data) {
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          this.appointorsList = data.appointors
          data.signDate = data.signDate ? moment(data.signDate) : undefined
          data.estimateStartDate = data.estimateStartDate ? moment(data.estimateStartDate) : undefined
          data.estimateCompleteDate = data.estimateCompleteDate ? moment(data.estimateCompleteDate) : undefined
          data.interimPaymentDate = data.interimPaymentDate ? moment(data.interimPaymentDate) : undefined
          data.designAgreementNo = data.designAgreementNo ? moment(data.designAgreementNo) : undefined
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }

        this.getActivityList()
        // this.getAgreementListList(id)
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
      // 获取协议号
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
            customerId: id
          }
        }).then((res)=>{
          this.agreementList = res.rows
        })
      },
      // 新增指定人员
      handleAdd() {
        this.appointorsList.push({
          appointorName: '',
          appointorIdCard: '',
          appointorRelationship: '',
          index: this.appointorsList.length,
          id: '',
        })
      },
      // 删除指定人员
      handleDelete(index) {
        this.appointorsList.splice(index, 1)
      },
      clearInput() {
        this.agreementList = []
        this.activityList = []
        this.appointorsList = []
        this.form.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>