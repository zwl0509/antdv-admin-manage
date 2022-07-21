<template>
  <a-form :form="form">
    <!-- 派单信息 -->
    <a-row :grabbed="48" v-if="isShowForm.isDispatch">
      <a-col :md="24" :sm="24">
        <a-form-item label="派单用户" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <div v-if="employeeName" class="dispatch-user">{{ employeeName || '' }}</div>
          <a-button :disabled="type == 'detail'" type="primary" @click="selectUser">选择用户</a-button>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="智装登录账号" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
          <a-input
            placeholder="请输入智装登录账号"
            :disabled="type == 'detail'"
            autocomplete="off"
            v-decorator="['userCode',{rules: [{message: '客户信息,请输入登录账号!'}]}]"
            :max-length="16"></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="智装登录密码" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
          <a-input-password
            type="password"
            autocomplete="off"
            :disabled="type == 'detail'"
            placeholder="请输入智装登录密码"
            v-decorator="['pwd',{rules: [{message: '客户信息,请输入登录密码!'}]}]"
            :max-length="16"></a-input-password>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="派单理由" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入派单理由"
            autocomplete="off" 
            :disabled="type == 'detail'" 
            v-decorator="['reason',{ rules : [{ required: false, message: '客户信息,请输入派单理由!'}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="特殊派单理由" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入特殊派单理由"
            autocomplete="off" 
            :disabled="type == 'detail'" 
            v-decorator="['specialReason',{ rules : [{ required: false, message: '客户信息,请输入特殊派单理由!'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <!-- 量房信息 -->
    <a-row :grabbed="48" v-if="isShowForm.measuringRoom">
      <a-col :md="24" :sm="24">
        <a-form-item label="量房日期" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-date-picker
            placeholder="请选择预计量房日期"
            :disabled="type == 'detail'" 
            v-decorator="['actualMeasuringDate',{ rules : [{ required: true, message: '客户信息,请选择预计量房日期!'}]}]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="智装登录账号" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
          <a-input
            :max-length="16"
            autocomplete="off"
            :disabled="type == 'detail'"
            placeholder="请输入智装登录账号"
            v-decorator="['userCode',{rules: [{message: '客户信息,请输入登录账号!'}]}]"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="智装登录密码" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
          <a-input-password
            placeholder="请输入智装登录密码"
            :max-length="16"
            autocomplete="off"
            :disabled="type == 'detail'"
            v-decorator="['pwd',{rules: [{message: '客户信息,请输入登录密码!'}]}]"
          ></a-input-password>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="量房注意事项" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入量房注意事项"
            autocomplete="off" 
            :disabled="type == 'detail'" 
            v-decorator="['measuringAttentionInfo',{ rules : [{ required: false, message: '客户信息,请输入量房注意事项!'}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入备注"
            autocomplete="off" 
            :disabled="type == 'detail'" 
            v-decorator="['remark',{ rules : [{ required: false, message: '客户信息,请输入备注!'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <!-- 待办信息 -->
    <a-row :grabbed="48" v-if="isShowForm.isDoList">
      <a-col :md="6" :xs="24">
        <a-form-item label="是否受理" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-switch
            checked-children="是"
            un-checked-children="否"
            v-decorator="['isDisabled',{ valuePropName: 'checked', initialValue: true }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="16" :xs="24">
        <a-form-item label="回访内容" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
          <a-textarea :rows="1" placeholder="请输入回访内容" v-decorator="['remark']" ></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
    <!-- 逃单信息 -->
    <a-row :grabbed="48" v-if="isShowForm.evasionApply">
      <a-col :md="24" :sm="24">
        <a-form-item label="逃单分类" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-select
            allowClear
            placeholder="请选择逃单分类" 
            style="width: 280px;"
            v-decorator="['classification',{ rules : [{ required: true, message: '客户信息,请选择预计量房日期!'}]}]">
            <a-select-option v-for="(item, index) in EvasionClassify" :key="index" :value="item.value">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="逃单备注信息" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入逃单备注信息"
            autocomplete="off"
            :max-length="500"
            v-decorator="['remark',{ rules : [{ required: false, message: '客户信息,请输入逃单备注信息!'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <!-- 附件信息 -->
    <a-row :grabbed="48" v-if="isShowForm.UploadPic">
      <a-col :md="12" :sm="24">
        <a-form-item label="智装登录账号" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
          <a-input
            placeholder="请输入智装登录账号"
            :disabled="type == 'detail'"
            autocomplete="off"
            v-decorator="['userCode',{rules: [{message: '客户信息,请输入登录账号!'}]}]"
            :max-length="16"></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="智装登录密码" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
          <a-input-password
            type="password"
            autocomplete="off"
            :disabled="type == 'detail'"
            placeholder="请输入智装登录密码"
            v-decorator="['pwd',{rules: [{message: '客户信息,请输入登录密码!'}]}]"
            :max-length="16"></a-input-password>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="图片" :labelCol="labelCol1" :wrapperCol="labelCol1">
          <a-upload
            multiple
            list-type="picture-card"
            class="avatar-uploader"
            style="width: 1100px;"
            :file-list="fileList"
            :customRequest="info => customRequest(info)"
            @preview="handlePreview"
            :remove="info => handleRemove(info)"
            :beforeUpload="beforeUpload"
            accept="image/jpeg,image/jpg,image/png"
            :disabled="type == 'detail'" 
            v-decorator="['enclosure']">
            <div class="upload-box" v-if="type !== 'detail' && fileList.length < 9">
              <a-icon :type="loading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
            <img alt="example" style="width: 100%" :src="previewImage"/>
          </a-modal>
        </a-form-item>
      </a-col>
    </a-row>
    <dispatch-personnel ref="DispatchPersonnel" @ok="handleOk"></dispatch-personnel>
  </a-form>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import { commonFileUpload } from '@/api/common'
  import { checkErrors, maxLenValidator , filedIsNull } from '@/utils/common'
  import DispatchPersonnel from './DispatchPersonnel'
  export default {
    name: 'OtherInfo',
    components: {
      DispatchPersonnel
    },
    props: {
      modalTitle: {
        type: String,
        default: ''
      },
      positionIds: {
        type: Array,
        default: () => {
          return []
        }
      },
      type: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        form: this.$form.createForm(this),
        previewVisible: false,
        loading: false,
        previewImage: '',
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
          sm: { span: 2 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 22 }
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        labelCol3: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol3: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        isShowForm: {
          isDispatch: false, // 是否展示派单
          measuringRoom: false, // 是否展示量房
          isDoList: false,
          evasionApply: false, // 逃单信息
          UploadPic: false , // 附件
        },
        customerId: '',
        employeeName: '',
        employeeId: '',
        EvasionClassify: [], // 逃单分类
        // 附件上传
        fileList: [],
        file_info_list: [],
        attachIds: [],
      }
    },
    methods: {
      getData() {
        const { form: { validateFields } } = this
        return new Promise((resolve,reject)=> {
          validateFields((errors, values) => {
            if(!errors) {
              values.employeeId = this.employeeId
              values.actualMeasuringDate = values.actualMeasuringDate ? moment(values.actualMeasuringDate).format('YYYY-MM-DD') : null
              if (this.file_info_list.length) {
                const formdata = new FormData()
                formdata.append('attachType', '1009-70')
                formdata.append('customerId', this.customerId)
                this.file_info_list.forEach(item => {
                  formdata.append('files', item.file)
                })
                commonFileUpload(formdata).then(res => {
                  const ids = []
                  res.forEach(item => {
                    ids.push(item.id)
                  })
                  values.attachIds = this.attachIds.concat(ids)
                  resolve(values)
                })
                  .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                  .finally(() => {
                    this.confirmLoading = false
                  })
              } else {
                values.attachIds = this.attachIds
                resolve(values)
              }
      
            }else {
              const keys = ['actualMeasuringDate']
              reject(checkErrors(keys, errors))
            }
          })
        })
      },
      setData(isShowForm, data, customerId) {
        this.isShowForm = isShowForm
        this.customerId = customerId
        isShowForm.evasionApply && this.getCodeList()

  
        if(data) {
          // 二次上传结构图
          const fileList = []
          const ids = []
          data.attachInfos?.forEach(item => {
            fileList.push({
              uid: fileList.length,
              name: 'image.png',
              status: 'done',
              url: item.path
            })
            ids.push(item.id)
          })
          this.fileList = fileList
          this.attachIds = ids
          this.employeeName =  data.employeeName
          this.employeeId =  data.employeeId
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          data.actualMeasuringDate = data.actualMeasuringDate ? moment(data.actualMeasuringDate).format('YYYY-MM-DD')  : null
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      handleOk (data) {
        this.employeeName = data.employeeName
        this.employeeId = data.employeeId
      },
      getCodeList(){
        this.$getCodeList('1041', res => {
          this.EvasionClassify = res 
        })
      },
      selectUser() {
        this.$refs.DispatchPersonnel.show(this.modalTitle, this.positionIds)
      },
      // 图片上传
      customRequest(info) {
        this.loading = true
        this.file_info_list.push(info)
        this.getBase64(info.file, imageUrl => {
          const id = this.fileList.length
          this.fileList.push({
            uid: id,
            name: 'image.png',
            status: 'done',
            url: imageUrl
          })
          this.loading = false
        })
      },
      // 图片删除
      handleRemove(info) {
        this.fileList.splice(info.uid, 1)
        this.file_info_list.splice(info.uid, 1)
        this.attachIds.splice(info.uid, 1)
        this.fileList.forEach((item, index) => {
          item.uid = index
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
      // 控制用户上传
      beforeUpload(file, imgList) {
        if (this.fileList.length + imgList.length > 9) {
          this.$notification.warning({
            message: labels.UPLOAD_FILE_FAIL,
            description: '图片已超过9个,请重新上传！！',
          })
          return false
        }
      },
      clearInput() {
        this.employeeId = ''
        this.employeeName = ''
        this.form.resetFields()
        this.attachIds = []
        this.fileList = []
        this.file_info_list = []
        this.customerId = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
.dispatch-user {
  display: inline-block;
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  padding: 0 10px; 
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
}
</style>