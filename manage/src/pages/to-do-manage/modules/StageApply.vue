<template>
  <a-form :form="form">
    <!-- <a-col :md="24" :sm="24">
      <a-form-item label="申请图片" :labelCol="labelCol1" :wrapperCol="labelCol1">
        <a-upload
          multiple
          list-type="picture-card"
          class="avatar-uploader"
          style="width: 700px;"
          :file-list="fileList"
          @preview="handlePreview"
          accept="image/jpeg,image/jpg,image/png"
          disabled>
        </a-upload>
        <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
          <img alt="example" style="width: 100%" :src="previewImage"/>
        </a-modal>
      </a-form-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item label="申请原因" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
        <a-textarea
          placeholder="请输入审核内容"
          :rows="3"
          disabled
          v-decorator="['applicationReason']"
          :max-length="300"></a-textarea>
      </a-form-item>
    </a-col> -->
    <a-col :md="8" :sm="24">
      <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select placeholder="请选择审核状态" @change="onChangeStatus" v-decorator="['status',{rules: [{required: true}],initialValue: '1010-20'}]">
          <a-select-option v-for="item in statusList" :key="item.value" :value="item.value">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="isStatus">
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
    <a-col :md="8" :sm="24" v-if="isStatus && isCheckEmployee">
      <a-form-item label="智装登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="请输入智装登录账号"
          autocomplete="off"
          :max-length="16"
          v-decorator="['userCode']"
        ></a-input>
      </a-form-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="isStatus && isCheckEmployee">
      <a-form-item label="智装登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-password
          placeholder="请输入智装登录密码"
          autocomplete="off"
          :max-length="16"
          v-decorator="['pwd']"
        ></a-input-password>
      </a-form-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="isStatus">
      <a-form-item label="设计师" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select placeholder="请选择设计师" allowClear v-decorator="['designer',{ rules : [{ required: true}]}]">
          <a-select-option
            v-for="(item, index) in designerList"
            :key="index"
            :value="item.id"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :md="8" :sm="24" v-if="isStatus && isCheckEmployee">
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
      <a-form-item class="col-1-9" label="审核内容">
        <a-textarea
          placeholder="请输入审核内容"
          :rows="3"
          v-decorator="['auditContent',{rules: [{required: true}]}]"
          :max-length="300"></a-textarea>
      </a-form-item>
    </a-col>
  </a-form>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'StageApply',
    computed: {
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        visible: false,
        isActive: false,
        isShow: false,
        confirmLoading: false,
        ids: [],
        customerId: '',
        form: this.$form.createForm(this),
        statusList: [],
        customerTypeList: [],
        employeeList: [],
        status: '',
        isCheckEmployee: false,
        isCheckName: false,
        isSkip: false,
        isStatus: true, // 驳回显示
        employeeType: '',
        fileList: [],
        previewImage: '',
        previewVisible: false,
        designerList:[], // 设计师
        isKeepCurrent: false, // 是否保持当前状态
      }
    },
    methods: {
      setData(record) {
        this.ids = [record.applyId]
        this.status = record && record.customerType
        this.customerId = record && record.applyRelationId
        this.isKeepCurrent = !record.haveSubManager && record.customerType == '1033-60'
        this.visible = true
        this.getCodeList()
        // this.getDetail(record)
        this.getDesignerList('1042-06')
      },
      // 初始化时，检查当前是否有流程绑定且查询分总或设计师
      getInitSkip(status){
        this.isSkipChange(status)
        if(status == '1033-60'){
          this.isCheckEmployee = true
          this.employeeType = '1042-03'
          this.getEmployeeList()
        } else if (status == '1033-70') {
          this.isCheckEmployee = true
          this.employeeType = '1042-05'
          this.getEmployeeList()
        } else {
          this.isCheckEmployee = false
        }
      },
      getDetail(record) {
        const fileList = []
        record.attachInfos.forEach(item => {
          fileList.push({
            uid: fileList.length,
            name: 'image.png',
            status: 'done',
            url: item.path
          })
        })
        this.fileList = fileList
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            applicationReason: record.applicationReason || '' 
          })
        })
      },
      // 图片转换
      getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
      },
      // 图片预览
      handlePreview (file) {
        const image = ['png', 'jpg', 'jpeg', 'gif']
        const flag = image.some((item) => {
          return file.name.indexOf(item) !== -1
        })
        if (flag) {
          if (!file.url && !file.preview) {
            this.getBase64(file.originFileObj, (imageUrl) => {
              this.previewImage = imageUrl
            })
          } else {
            this.previewImage = file.url
          }
          this.previewVisible = true
        } else {
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = file.url
          link.setAttribute('download', file.name)
          document.body.appendChild(link)
          link.click()
        }
      },
      // 关闭预览
      cancelImage() {
        this.previewVisible = false
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
                this.customerTypeList.splice(0, this.isKeepCurrent ? index : index + 1)
              }
            })
          }
          this.status = this.customerTypeList[0].value
          this.getInitSkip(this.customerTypeList[0].value)
        })
      },
      async stageChange(e) {
        await this.isSkipChange(e)
        this.form.setFieldsValue({ employeeId: undefined })
        // if(e == this.status) {
        //   this.isCheckEmployee = false
        // } else {
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
        // }
      },
      // 获取设计经理数据
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
      // 获取设计师数据
      getDesignerList(code) {
        const data = {
          positionCode: code,
          currentPage: 0,
          pageSize: 0
        }
        this.$post({
          url: this.$api.employeeManage.employeeInfo.getEasyList,
          data,
        }).then((res)=>{
          this.designerList = res.rows
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
      getData() {
        const { form: { validateFields } } = this
        return new Promise((resolve,reject)=> {
          validateFields((errors, values) => {
            if (!errors) {
              values.ids = this.ids
              values.employeeType = this.employeeType
              values.isSkip = this.isSkip
              resolve(values)
            }
          })
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
        this.fileList = []
        this.designerList = []
        this.isKeepCurrent = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .active{
    font-size: 15px;
    color: red;
  }
  ::v-deep .col-1-9 {
    .ant-form-item-label {
      width: 11.111111%;
      float: left;
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