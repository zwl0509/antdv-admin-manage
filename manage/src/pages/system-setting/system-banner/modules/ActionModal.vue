<template>
  <a-modal
    :title="modalType === 'add' ? '新增Banner' : '编辑Banner'"
    :width="700"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="banner名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入banner名称" autocomplete="off" v-decorator="['bannerName', {rules: [{required: true, message: '请输入banner名称'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :xs="24">
            <a-form-item
              label="banner类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择banner类型" v-decorator="['bannerType', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="链接地址"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input placeholder="请输入链接地址" autocomplete="off" v-decorator="['linkUrl', {rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :xs="24">
            <a-form-item
              label="是否可用"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select placeholder="请选择是否可用" v-decorator="['isEnabled', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="banner图片"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-upload
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :customRequest="uploadImage"
                accept="image/jpeg,image/jpg,image/png"
                v-decorator="['imgUrl', {rules: [{required: true}]}]"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>
                <div class="upload-box" v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'"/>
                  <div class="ant-upload-text">
                    上传
                  </div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-textarea style="height: 116px" placeholder="请输入备注" v-decorator="['remark',{rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]" ></a-textarea>
            </a-form-item>
          </a-col>
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
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        typeList: [],
        loading: false,
        imageUrl: '',
        file_info: null,
        attachIds: []
      }
    },
    created () {
      this.$getCodeList('1003', res => {
        this.typeList = res
      })
    },
    methods: {
      maxLenValidator: maxLenValidator,
      add () {
        this.imageUrl = ''
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.system.banner.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            if (res.attachInfoVOS.length) {
              this.imageUrl = data.imgUrl = res.attachInfoVOS[0].path
              const arr = []
              arr.push(res.attachInfoVOS[0].id)
              this.attachIds = arr
            }
            delete data.attachInfoVOS
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      getBase64 (img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
      },
      uploadImage (info) {
        this.loading = true
        this.file_info = info
        this.getBase64(info.file, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        if (!this.imageUrl) {
          this.$notification.warning({
            message: 'Warning',
            description: '请上传banner图片'
          })
        }
        validateFields((errors, values) => {
          if (!errors) {
            if (this.file_info) {
              const formdata = new FormData()
              formdata.append('files', this.file_info.file)
              formdata.append('attachType', '1003-50')
              commonFileUpload(formdata).then(res => {
                values.id = this.id
                values.imgUrl = res[0].requestUrl
                const ids = []
                ids.push(res[0].id)
                values.attachIds = ids
                this.save(values)
              })
                .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => {
                  this.confirmLoading = false
                })
            } else {
              values.id = this.id
              values.imgUrl = ''
              values.attachIds = this.attachIds
              this.save(values)
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      save (data) {
        this.$post({
          url: this.$api.system.banner.edit,
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
        this.confirmLoading = false
        this.imageUrl = ''
        this.file_info = null
        this.logo = ''
        this.form.resetFields()
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .ant-upload {
    width: 100%;

    img {
      width: 100%;
      height: 100px;
      object-fit: cover;
    }

    .upload-box {
      height: 100px;
      display: flex;
      flex-flow: column;
      justify-content: center;
    }
  }
</style>
