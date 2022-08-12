<template>
  <a-modal 
    :title="modal_title"
    :width="800"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading">
    <a-form :form="form">
      <!-- 停工申请 -->
      <a-row :grabbed="48" v-if="modal_type == '10'">
        <a-col :md="12" :xs="24">
          <a-form-item label="停工时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择停工时间"
              v-decorator="['stopDate',{ rules: [{ required: true, message: '请选择停工时间!!!'}]}]"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="复工时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择复工时间"
              v-decorator="['estimateStartDate',{ rules: [{ required: true, message: '请选择复工时间!!!'}]}]"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="停工原因" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            <a-textarea
              :rows="3"
              placeholder="请输入原因"
              autocomplete="off"
              :maxLength="300"
              v-decorator="['stopReason']"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="停工备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            <a-textarea
              :rows="3"
              placeholder="请输入备注"
              autocomplete="off"
              :maxLength="300"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="上传图片" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            <a-upload
              multiple
              list-type="picture-card"
              class="avatar-uploader"
              style="width: 600px;"
              :file-list="fileList"
              :customRequest="info => customRequest(info)"
              @preview="handlePreview"
              :remove="info => handleRemove(info)"
              :beforeUpload="beforeUpload"
              accept="image/jpeg,image/jpg,image/png"
              :disabled="modal_type == 'detail'"
              v-decorator="['imgs']">
              <div class="upload-box" v-if="modal_type !== 'detail' && fileList.length < 9">
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
      <!-- 复工申请 -->
      <a-row :grabbed="48" v-if="modal_type == '20'">
        <a-col :md="12" :xs="24">
          <a-form-item label="复工时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              placeholder="请选择复工时间"
              v-decorator="['actualStartDate',{ rules: [{ required: true, message: '请选择复工时间!!!'}]}]"
              style="width: 100%"
            ></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="复工备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            <a-textarea
              :rows="3"
              placeholder="请输入复工备注"
              autocomplete="off"
              :maxLength="300"
              v-decorator="['remark']"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="上传图片" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            <a-upload
              multiple
              list-type="picture-card"
              class="avatar-uploader"
              style="width: 600px;"
              :file-list="fileList"
              :customRequest="info => customRequest(info)"
              @preview="handlePreview"
              :remove="info => handleRemove(info)"
              :beforeUpload="beforeUpload"
              accept="image/jpeg,image/jpg,image/png"
              :disabled="modal_type == 'detail'"
              v-decorator="['imgs']">
              <div class="upload-box" v-if="modal_type !== 'detail' && fileList.length < 9">
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
      <!-- 停复工审核 -->
      <a-row :grabbed="48" v-if="modal_type == '30' || modal_type == '40'">
        <a-col :md="12" :xs="24">
          <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择审核状态" allowClear v-decorator="['status',{ rules : [{ required: true}], initialValue: '1010-20'}]">
              <a-select-option
                v-for="(item, index) in auditTypeList"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="审核备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            <a-textarea
              :rows="3"
              placeholder="请输入审核备注"
              autocomplete="off"
              :maxLength="300"
              v-decorator="['content']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import {  dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { commonFileUpload } from '@/api/common'
  export default {
    name: 'ResumeWorkPlan',
    props: {
      customerId: {
        type: String,
        default: ''
      },
      constructionPlanId: {
        type: String,
        default: ''
      },
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '10' :
            return '停工申请'
          case '20' :
            return '复工申请'
          case '30' :
            return '停工审核'
          case '40' :
            return '复工审核'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        auditTypeList: [
          { name: '审核通过', value: '1010-20' }, 
          { name: '审核驳回', value: '1010-30' }
        ],
        visible: false,
        previewVisible: false,
        loading: false,
        confirmLoading: false,
        previewImage: '',
        modal_type: '',
        form: this.$form.createForm(this),
        // 上传图片
        attachIds: [],
        fileList: [], 
        file_info_list: [],
      }
    },
    methods: {
      add(type, id) {
        this.id = id
        this.modal_type = type
        this.visible = true
      },
      handleSubmit(){
        this.confirmLoading = true
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if(!errors) {
            values.stopDate = values.stopDate ? moment(values.stopDate).format(dateFormatString) : null
            values.actualStartDate = values.actualStartDate ? moment(values.actualStartDate).format(dateFormatString) : null
            values.estimateStartDate = values.estimateStartDate ? moment(values.estimateStartDate).format(dateFormatString): null 
            if (this.file_info_list.length) {
              const formdata = new FormData()
              formdata.append('attachType', '1009-20')
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
                this.modal_type == '10' || this.modal_type == '20' ? this.apply(values) : this.audit(values)
              }).catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => { this.confirmLoading = false })
            }else {
              values.attachIds = this.attachIds
              this.modal_type == '10' || this.modal_type == '20' ? this.apply(values) : this.audit(values)
            }
          }else {
            this.confirmLoading = false
          }
        })
      },
      // 审核
      audit(data) {
        const url = this.$api.construction.customerConstructionTaskInfo.shutDownAudit
        if(this.modal_type == '30') {
          data.customerConstructionPlanStopId = this.id
          this.save(data, url)
        } else {
          data.customerConstructionPlanStopId = this.id
          this.save(data, url)
        }
      },
      // 申请
      apply(data){
        const url = this.$api.construction.customerConstructionTaskInfo.createShutDownApply
        if(data.estimateStartDate && data.stopDate && this.modal_type == '10') {
          data.stopDay = moment(data.estimateStartDate).diff(moment(data.stopDate), 'days')
          if(data.stopDay >= 0){
            data.customerConstructionPlanId = this.constructionPlanId
					  data.status = '1010-10'
            this.save(data, url)
          }else {
            this.$notification.warning({
              message: labels.HINT,
              description: '当前复工时间小于停工时间!!!'
            })
          }
        }else {
          data.customerConstructionPlanId = this.constructionPlanId
					data.parentId = this.id
          data.status = '1010-10'
          this.save(data, url)
        }
      },
      // 保存
      save(data, url) {
        this.$post({ url, data, needResponse: true }).then(res=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
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
      handleCancel() {
        this.confirmLoading = false
        this.form.resetFields()
        this.visible = false
        this.modal_type = ''
        this.attachIds = []
        this.fileList = []
        this.file_info_list = []
        this.id = ''
      },
    }
  }
</script>

<style lang="scss" scoped>
.status-color {
  color: $primaryColor;
}
</style>