<template>
  <a-card style="margin-bottom: 10px">
    <div slot="title" style="display: flex;justify-content: space-between;align-items: center">
      <span>{{ '情况说明' + number }}</span>
      <a-button type="primary" @click="handleDelete" v-if="show && type !== 'detail'">删除情况说明</a-button>
    </div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="12">
          <a-form-item label="不合格类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择不合格类型" :disabled="type == 'detail'" v-decorator="['unqualifiedType',{ rules: [{ required: true, message: '请选择不合格类型!' }] }]">
              <a-select-option
                v-for="(item, index) in codeType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="原因说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入原因说明"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['unqualifiedContent']"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :grabbed="48">
        <a-col :md="24" :sm="24">
          <a-form-item label="图片" :labelCol="labelCol1" :wrapperCol="labelCol1">
            <a-upload
              multiple
              list-type="picture-card"
              class="avatar-uploader"
              style="width: 700px;padding-top: 10px"
              :file-list="fileList"
              :customRequest="info => customRequest(info)"
              @preview="handlePreview"
              :remove="info => handleRemove(info)"
              :beforeUpload="beforeUpload"
              accept="image/jpeg,image/jpg,image/png"
              :disabled="type == 'detail'"
              v-decorator="['attachIds']">
              <div class="upload-box" v-if="type !== 'detail' && fileList.length < 6">
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
    </a-form>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { checkErrors, defaultErrorMessage, filedIsNull, maxLenValidator, regularCheck } from '@/utils/common'
import labels from '@/utils/labels'
import { commonFileUpload } from '@/api/common'
import moment from 'moment'
export default {
  props: {
    number: {
      type: Number,
      default: 1
    },
    dataInfo: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
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
      form: this.$form.createForm(this, {
        name: this.number
      }),
      previewVisible: false,
      previewImage: '',
      // 附件上传
      fileList: [],
      file_info_list: [],
      attachIds: [],
      codeType:[]
    }
  },
  created() {
    this.getCodeList()
  },
  methods: {
    maxLenValidator,
    regularCheck,
    getCodeList(){
      const params = {
        typeList: ['1083']
      }
      this.$getCodesList(params, res => {
        this.codeType = res['1083'] || [] // 任务关系
      })
    },
    handleDelete() {
      this.$emit('delete')
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
      if (this.fileList.length + imgList.length > 6) {
        this.$notification.warning({
          message: labels.UPLOAD_FILE_FAIL,
          description: '图片已超过6个,请重新上传！！',
        })
        return false
      }
    },
    getData() {
      const { form: { validateFields } } = this
      return new Promise((resolve,reject)=> {
        validateFields((errors, values) => {
          if(!errors) {
            if (this.file_info_list.length) {
              const formdata = new FormData()
              formdata.append('attachType', '1009-120')
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
          }
        })
      })
    },
    setData(data) {
      console.log(data)
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
        const { form: { setFieldsValue } } = this
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      }
    },
  },
  watch: {
    dataInfo: {
      handler(newInfo, oldInfo) {
        if (newInfo) {
          this.$nextTick(() => {
            const { form: { setFieldsValue }} = this
            const fileList = []
            const ids = []
            newInfo.attachInfos?.forEach(item => {
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
            for (const key in newInfo) {
              if (filedIsNull(newInfo[key])) {
                delete newInfo[key]
              }
            }
            setFieldsValue(pick(Object.assign({}, newInfo), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ant-form-item {
  margin-bottom: 0;
}
::v-deep .ant-card-head {
  height: 40px;
  min-height: 0;
  .ant-card-head-title {
    padding: 0;
    line-height: 40px;
  }
}
  ::v-deep .ant-card-body {
    padding-top: 20px;
  }
</style>
