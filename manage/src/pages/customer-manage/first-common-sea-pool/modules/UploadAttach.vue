<template>
  <a-modal
    title="附件图片"
    :width="modal_width"
    :visible="visible"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <template v-if="isTodo">
      <a-divider>客户基本信息</a-divider>
      <base-info ref="BaseInfo" :type="'detail'"></base-info>
      <a-divider>附件图片上传</a-divider>
    </template>
    <a-form :form="form">
      <a-form-item label="上传图片" class="col-1-9">
        <a-upload
          multiple
          list-type="picture-card"
          class="avatar-uploader"
          style="width: 680px;"
          :file-list="fileList"
          :customRequest="info => customRequest(info)"
          @preview="handlePreview"
          :remove="info => handleRemove(info)"
          :beforeUpload="beforeUpload"
          :disabled="type == 'detail'"
          accept="image/jpeg,image/jpg,image/png"
          v-decorator="['imgs',{ rules : [{ required: true, message: '请上传图片'}]}]">
          <div class="upload-box" v-if="type !== 'detail' && fileList.length < 9">
            <a-icon :type="loading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
          <img alt="example" style="width: 100%" :src="previewImage"/>
        </a-modal>
      </a-form-item>
    </a-form>
    <template slot="footer">
      <div v-if="type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { commonFileUpload } from '@/api/common'
  import { defaultErrorMessage } from '@/utils/common'
  import BaseInfo from '@/pages/customer-manage/high-sea-pool-customer/modules/BaseInfo.vue'
  export default {
    name: 'UploadAttach',
    components: { BaseInfo },
    props: {
      codeType: { type: Object, default: null }
    },
    data () {
      return {
        previewImage: '',
        modal_width: 850,
        visible: false,
        loading: false,
        confirmLoading: false,
        previewVisible: false,
        form: this.$form.createForm(this),
        id: '',
        type: '',
        applicationId: '',
        // 上传图片
        fileList: [], 
        file_info_list: [],
        attachIds: [],
        isTodo: false
      }
    },
    methods: {
      // applyId 待办申请ID
      show(record, isTodo) {
        this.visible = true
        this.id = record.id 
        this.applicationId = record.applicationId
        this.isTodo = !!isTodo
        this.isTodo && this.getTodoInfo()
      },
      detail(record, isTodo) {
        this.visible = true
        this.id = record.id 
        this.applicationId = record.applicationId
        this.isTodo = !!isTodo
        this.type = 'detail'
        this.isTodo && this.getTodoInfo()
      },
      // 待办处理信息
      getTodoInfo(){
        this.modal_width = this.isTodo ? 1200 : 850
        // this.$emit('getCodeList')
        this.$nextTick(()=> {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.getCustomerDetail()
          this.getPhotoDetail()
        })
      },
      // 获取图片上传详情信息
      getPhotoDetail() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerAuditInfo.getDetail,
          params: { applicationId: this.applicationId }
        }).then(res=> {
          const data = { ...res } 
          const fileList = []
          const ids = []
          data.attachInfos.forEach(item => {
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
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 待办 ==> 获取客户基础信息()
      getCustomerDetail(){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.resourceCustomer.getDetail,
          params: { id:  this.id }
        }).then((res) =>{
          const data = { ...res }
          this.$refs.BaseInfo.setData(data.customerBaseInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        this.confirmLoading = true
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if(!errors) {
            values.id =  this.applicationId
            if (this.file_info_list.length) {
              const formdata = new FormData()
              formdata.append('attachType', '1009-20')
              formdata.append('customerId', this.id)
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
              }).catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => {
                  this.confirmLoading = false
                })
            } else {
              values.attachIds = this.attachIds
              this.save(values)
            }
          }else {
            this.confirmLoading = false
          }
        })
      },
      save(data) {
        this.$post({
          url: this.$api.customInfo.customerAuditInfo.uploadAttach,
          data: data,
          needResponse: true
        }).then(res=>{
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
        this.visible = false
        this.id = ''
        this.type = ''
        this.applicationId = ''
        this.attachIds = []
        this.fileList = []
        this.file_info_list = []
        this.isTodo = false
      }
    }
  }
</script>

<style lang="scss" scoped>
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
</style>