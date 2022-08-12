<template>
  <!-- 施工计划表，操作页面 -->
  <a-modal
    :visible="visible"
    :width="800"
    :title="modal_title"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <a-form :form="form">
      <a-col :md="24" :xs="24" v-if="modal_type == '1080-30'">
        <a-form-item label="延期日期" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-date-picker
            placeholder="请选择延期日期"
            style="width: 200px;"
            v-decorator="['delayDate']"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :xs="24" v-if="modal_type == '1080-30'">
        <a-form-item label="延期原因" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-select placeholder="请选择延期原因" allowClear v-decorator="['reason']">
            <a-select-option
              v-for="(item, index) in reasonTypeList"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
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

      <a-col :md="24" :xs="24">
        <a-form-item label="备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
          <a-textarea
            :rows="3"
            placeholder="请输入备注信息"
            autocomplete="off"
            :maxLength="500"
            v-decorator="['remark']"/>
        </a-form-item>
      </a-col>
    </a-form>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import moment from 'moment'
  import { commonFileUpload } from '@/api/common'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'ConstructionActionModal',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1080-10' :
            return '开工'
          case '1080-20' :
            return '完工'
          case '1080-30' :
            return '延期申请'
          default:
            return ''
        }
      }
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        previewVisible: false,
        loading: false,
        previewImage: '',
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        modal_type: '',
        id: '',
        customerId: '',
        fileList: [], // 上传图片
        file_info_list: [],
        attachIds: [],
        reasonTypeList: []
      }
    },
    methods: {
      show(recoed, status, customerId) {
        this.customerId = customerId
        this.id = recoed.id
        this.visible = true
        this.modal_type = status
        this.getCodeList()
      },
      getCodeList() {
        const params = {
          typeList: ['1090']
        }
        this.$getCodesList(params, res => {
          this.reasonTypeList = res['1090'] || [] // 延期原因
        })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
            values.customerConstructionTaskInfoId = this.id
            values.type = this.modal_type
            values.delayDate = values.delayDate ? moment(values.delayDate).format('YYYY-MM-DD') : null
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
                this.save(values)
              })
                .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => { this.confirmLoading = false })
            } else {
              values.attachIds = this.attachIds
              this.save(values)
            }
        })
      },
      save(data) {
        const url = data.type == '1080-30'? this.$api.construction.customerConstructionTaskInfo.delay 
        :this.$api.construction.customerConstructionTaskInfo.startOrEnd
        this.confirmLoading = true
        this.$post({url, data}).then((res)=> {
          this.$emit('ok')
          this.handleCancel()
        }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
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
        this.form.resetFields()
        this.visible = false
        this.id = ''
        this.customerId = ''
        this.fileList = []
        this.file_info_list = []
        this.attachIds = []
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>