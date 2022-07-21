<template>
  <a-modal
    :title="modalType=='add'?'新增答疑资料': modalType=='edit'?'编辑答疑资料':'查看答疑资料'"
    :width="700"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-alert v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="分类"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                placeholder="请选择分类"
                v-decorator="['type', {rules: [{required: true}]}]"
                :disabled="modalType=='detail'">
                <a-select-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :value="item.value">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="标题"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="请输入标题"
                autocomplete="off"
                :disabled="modalType=='detail'"
                v-decorator="['title', {rules: [{required: true, message: '请输入标题'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 100)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="url"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01"
          >
            <a-input
              placeholder="请输url"
              v-decorator="['url', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 100)}]}]"
              :disabled="modalType == 'detail'"></a-input>
          </a-form-item>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="答案"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01"
          >
            <a-textarea
              placeholder="请输入答案"
              v-decorator="['content']"
              :disabled="modalType=='detail'"></a-textarea>
          </a-form-item>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="备注"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01"
          >
            <a-textarea
              placeholder="请输入备注"
              v-decorator="['remark', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]"
              :disabled="modalType=='detail'"></a-textarea>
          </a-form-item>
        </a-row>
        <a-row :grabbed="48">
          <a-form-item
            label="图片"
            :labelCol="labelCol01"
            :wrapperCol="wrapperCol01">
            <a-upload
              list-type="picture-card"
              class="avatar-uploader"
              :file-list="fileList"
              :customRequest="uploadImage"
              @preview="handlePreview"
              :remove="removeItem"
              accept="image/jpeg,image/jpg,image/png"
              :disabled="modalType=='detail'"
            >
              <div class="upload-box">
                <a-icon :type="loading ? 'loading' : 'plus'"/>
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-modal
              :centered="true"
              :visible="previewVisible"
              :footer="null"
              @cancel="cancelImage">
              <img
                alt="example"
                style="width: 100%"
                :src="previewImage"/>
            </a-modal>
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { commonFileUpload } from '@/api/common'
  import pick from 'lodash.pick'
  import { defaultErrorMessage, filedIsNull, maxLenValidator } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {

    data () {
      return {
        errorMessage: '',
        isError: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol01: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        typeList: [],
        fileList: [],
        loading: false,
        file_info_list: [],
        attachIds: [],
        previewVisible: false,
        previewImage: ''
      }
    },
    created () {
      this.$getCodeList('1039', res => {
        this.typeList = res
      })
    },
    methods: {
      maxLenValidator: maxLenValidator,
      add () {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
      },
      edit (record, type) {
        const { form: { setFieldsValue } } = this
        this.modalType = type
        this.id = record.id
        this.isError = false
        this.$get({
          url: this.$api.system.appQALibrary.getDetail,
          params: { id: record.id }
        }).then(res => {
          this.visible = true
          const fileList = []
          const ids = []
          res.attachInfoVOS.forEach(item => {
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
          const data = { ...res }
          for (const key in data) {
            if (filedIsNull(data[key])) {
              delete data[key]
            }
          }
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }).catch(err => {
          this.isError = true
          this.errorMessage = err && err.message || labels.GET_DATA_FAIL
        })
      },
      getBase64 (img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
      },
      uploadImage (info) {
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
      removeItem (e) {
        this.fileList.splice(e.uid, 1)
        this.file_info_list.splice(e.uid, 1)
        this.attachIds.splice(e.uid, 1)
        this.fileList.forEach((item, index) => {
          item.uid = index
        })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if (this.file_info_list.length) {
              const formdata = new FormData()
              formdata.append('attachType', '1003-50')
              this.file_info_list.forEach(item => {
                formdata.append('files', item.file)
              })
              commonFileUpload(formdata).then(res => {
                const ids = []
                res.forEach(item => {
                  ids.push(item.id)
                })
                values.id = this.id
                values.attachIds = this.attachIds.concat(ids)
                this.saveData(values)
              })
                .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => {
                  this.confirmLoading = false
                })
            } else {
              values.id = this.id
              values.attachIds = this.attachIds
              this.saveData(values)
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      saveData (data) {
        this.$post({
          url: this.$api.system.appQALibrary.edit,
          data,
          needResponse: true
        })
          .then(res => {
            this.handleCancel()
            this.$emit('ok', data)
            this.$notification.success({
              message: labels.SAVE_SUCCESS,
              description: res.message || ''
            })
          })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.file_info_list = []
        this.fileList = []
        this.visible = false
      },
      async handlePreview (file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj)
        }
        this.previewImage = file.url || file.preview
        this.previewVisible = true
      },
      cancelImage () {
        this.previewVisible = false
      }
    }
  }
</script>
