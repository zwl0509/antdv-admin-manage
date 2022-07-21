<template>
  <a-modal
    :title="modal_title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-col :md="24" :sm="24">
          <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择审核状态" @change="onChangeStatus" v-decorator="['status',{rules: [{required: true}],initialValue: '1010-20'}]">
              <a-select-option v-for="item in statusList" :key="item.value" :value="item.value">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" v-if="isStatus && modal_type == '1056-40'">
          <a-form-item label="下一阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择下一阶段" @change="stageChange" allowClear v-decorator="['type',{rules: [{required: true}], initialValue: status}]">
              <a-select-option
                v-for="(item, index) in customerTypeList"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" v-if="isStatus && modal_type == '1056-40' && isCheckEmployee">
          <a-form-item v-if="employeeType == '1042-03'" label="分总" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择分总" @change="employeeChange" allowClear v-decorator="['employeeId',{ rules : [{ required: true}]}]">
              <a-select-option
                v-for="(item, index) in employeeList"
                :key="index"
                :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
            <div class="active" v-show="isShow">
              智装erp不存在该分总
            </div>
          </a-form-item>
          <a-form-item v-else label="设计经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择设计经理" allowClear v-decorator="['employeeId',{ rules : [{ required: true}]}]">
              <a-select-option
                v-for="(item, index) in employeeList"
                :key="index"
                :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="审核内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea
              placeholder="请输入审核内容"
              :rows="2"
              v-decorator="['auditContent',{rules: [{required: true}]}]"
              :max-length="300"></a-textarea>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" v-if="isStatus && modal_type == '1056-40' && isCheckEmployee">
          <a-form-item label="智装登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入智装登录账号"
              autocomplete="off"
              :max-length="16"
              v-decorator="['userCode']"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" v-if="isStatus && modal_type == '1056-40' && isCheckEmployee">
          <a-form-item label="智装登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-password
              placeholder="请输入智装登录密码"
              autocomplete="off"
              :max-length="16"
              v-decorator="['pwd']"
            ></a-input-password>
          </a-form-item>
        </a-col>
      </a-form>
    </a-spin>
    <template slot="footer" v-if="modal_type == '1056-40' ">
      <div>
        <a-button @click="handleCancel">取消</a-button>
        <a-popconfirm v-if="isSkip" title="当前客户已有流程，是否确认跳过流程？" @confirm="handleSubmit()">
          <a-button type="primary">确定</a-button>
        </a-popconfirm>
        <a-button v-else type="primary" @click="handleSubmit">确定</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'Apply',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1056-10' :
            return '保留审核'
          case '1056-20' :
            return '期房审核'
          case '1056-30' :
            return '多房审核'
          case '1056-40' :
            return '客户阶段审核'
          case 1 :
            return '批量审核'
          default:
            return ''
        }
      }
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19}
        },
        visible: false,
        isActive: false,
        isShow:false,
        confirmLoading: false,
        ids: [],
        customerId: '',
        form: this.$form.createForm(this),
        statusList: [],
        customerTypeList: [],
        employeeList: [],
        type:'',
        modal_type: '',
        status: '',
        isCheckEmployee: false,
        isCheckName:false,
        isSkip: false,
        isStatus: true, // 驳回显示
        employeeType: '',
      }
    },
    methods: {
      show(ids, type, modal_type, record) {
        this.ids = ids
        this.type = type
        this.status = record && record.customerType
        this.customerId = record && record.customerId
        this.visible = true
        this.modal_type = modal_type
        this.getCodeList()
      },
      getCodeList() {
        const params = {
          typeList: ['1033','1010']
        }
        this.$getCodesList(params, res => {
          this.customerTypeList = res['1033'] || []  // 记录类型
          this.statusList = res['1010'] || []
          this.statusList.forEach((el,index)=> {
            if(el.value == '1010-10' || el.value == '1010-40') {
              this.statusList.splice(index,1)
            }
          })
          if(this.status) {
            this.customerTypeList.forEach((el,index)=>{
              if(el.value == this.status) {
                this.customerTypeList.splice(0, index)
              }
            })
          }
        })
      },
      async stageChange(e) {
        await this.isSkipChange(e)
        this.form.setFieldsValue({ employeeId: undefined })
        if(e == this.status) {
          this.isCheckEmployee = false
        } else {
          if(e == '1033-60') {
            this.isCheckEmployee = true
            this.employeeType = '1042-03'
            await this.getEmployeeList()
          } else if (e == '1033-70') {
            this.isCheckEmployee = true
            this.employeeType = '1042-05'
            await this.getEmployeeList()
          }else {
            this.isCheckEmployee = false
          }
        }
      },
      // 获取人员数据
      getEmployeeList() {
        const data = {
          positionCode: this.employeeType,
          currentPage: 0,
          pageSize: 0
        }
        this.$post({
          url: this.$api.employeeManage.employeeInfo.getEasyList,
          data,
        }).then((res)=>{
          this.employeeList = res.rows
        })
      },
      employeeChange(e){
          const item  = e && this.employeeList.find(el =>el.id === e)
          this.isShow = !e || item && item.userId ? false : true
      },
      // 查看是否有跳过当前流程
      isSkipChange(e) {
        const params = {
          type: e || '',
          customerId: this.customerId
        }
        this.$get({
          url: this.$api.customInfo.customerCommon.checkWorkFlow,
          params,
        }).then((res)=>{
          this.isSkip = res
        })
      },
      onChangeStatus(e) {
        if(e == '1010-30'){
          this.isStatus = false
        }else {
          this.isStatus = true
        }
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            values.ids = this.ids
            values.employeeType = this.employeeType
            this.save(values)
          }
        })
      },
      save (data) {
        this.confirmLoading = true
        data.isSkip = this.isSkip
        this.$post({
          url:this.$api.customInfo.customerCommon.audit,
          data,
          needResponse: true
        }).then(res=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message:labels.AUDIT_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err,labels.AUDIT_ERROR))
          .finally(() => {this.confirmLoading = false })
      },
      handleCancel() {
        // 重置表单数据
        this.id = ''
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.isCheckEmployee = false
        this.isCheckName = false
        this.customerId = ''
        this.status = ''
        this.employeeType = ''
        this.isStatus = true
        this.isShow = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .active{
    font-size: 15px;
    color: red;
  }
</style>