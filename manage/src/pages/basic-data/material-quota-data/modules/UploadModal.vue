<template>
  <a-modal
    :title="'导入材料数据'"
    :width="500"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :bodyStyle="{padding: 0}"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :span="24" style="padding-top: 12px">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="导入材料数据"
            >
              <a-upload
                :customRequest="uploadImage"
                :remove="removeFile"
                :fileList="newFileList"
                v-decorator="['file', {rules: [{required: true}]}]"
              >
                <a-button v-if="newFileList.length<1">
                  <a-icon type="upload" />
                  {{ upload_text }}
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'

  export default {
    name: 'UploadModal',
    components: {},
    data () {
      return {
        visible: false,
        confirmLoading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 }
        },
        form: this.$form.createForm(this),
        newFileList: [],
        upload_text: '导入材料数据',
        id: ''
      }
    },
    created () {
    },
    methods: {
      show (id) {
        this.id = id
        this.visible = true
      },
      uploadImage(info) {
        this.newFileList.push(info.file)
      },
      removeFile(file) {
        for (let i = 0; i < this.newFileList.length; i++) {
          if (this.newFileList[i].uid === file.uid) {
            this.newFileList.splice(i, 1)
            break
          }
        }
      },
      handleSubmit () {
        this.confirmLoading = true
        this.form.validateFields((errors, values) => {
          if (!errors) {
            const formdata = new FormData()
            formdata.append('excel', this.newFileList[0])
            this.$post({
              url: this.$api.basicData.materialInfo.import,
              data: formdata
            }).then(res => {
              this.handleCancel()
              this.$emit('ok', values)
              this.$notification.success({
                message: labels.SAVE_SUCCESS,
                description: res?.message || ''
              })
            })
              .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => {
                this.confirmLoading = false
              })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.visible = false
        this.confirmLoading = false
        this.newFileList = []
        this.id = ''
      },
    },
    computed: {},
    watch: {}
  }
</script>

<style scoped>
</style>
