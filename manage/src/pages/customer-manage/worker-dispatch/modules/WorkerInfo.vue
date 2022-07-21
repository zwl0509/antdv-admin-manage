<template>
  <!-- 工人信息 -->
  <a-modal
    title="工人信息"
    :width="900"
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
              class="image"
              label="工人头像"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 78px;height: 78px" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              class="image"
              label="验证头像"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-upload
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :customRequest="uploadImage"
                accept="image/jpeg,image/jpg,image/png"
                v-decorator="['attachIds']"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
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
            <a-form-item label="工人类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择工人类型" disabled v-decorator="['type']">
                <a-select-option
                  v-for="(item, index) in jobsList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="工人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入工人姓名"
                autocomplete="off"
                disabled
                :maxLength="64"
                v-decorator="['workerName']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                disabled
                placeholder="请输入手机号码"
                autocomplete="off"
                v-decorator="['telPhone']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="身份证" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入身份证"
                disabled
                autocomplete="off"
                v-decorator="['idCard']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="银行账号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                disabled
                placeholder="请输入银行账号"
                autocomplete="off"
                v-decorator="['bankAccount']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { defaultErrorMessage, filedIsNull, maxLenValidator,regularCheck } from '@/utils/common'
  import labels from '@/utils/labels'
  import { commonFileUpload } from '@/api/common'
  export default {
    name: 'WorkerInfo',
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
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        workerOrgCode: '',
        imageUrl: '',
        loading: false,
        form: this.$form.createForm(this),
        treeList: [],
        jobsList:[],
        attachIds: [],
        customerId:'',
        workerId:'',
        isLeader: false,
        type:'',
      }
    },
    created() {
      this.$getCodeList('1011', res => {
        this.jobsList = res
      })
    },
    methods: {
      maxLenValidator,regularCheck,
      add (record) {
        const { form: { setFieldsValue } } = this
        this.form.resetFields()
        this.visible = true
        this.customerId = record.customerId
        this.workerId = record.workerId
        this.isLeader = record.isLeader
        this.type = record.type
        this.id = record.id
        const data = {
          type: record.type,
          workerName: record.workerName,
          telPhone: record.telPhone,
          idCard: record.idCard,
          bankAccount: record.bankAccount,
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      uploadImage (info) {
        this.loading = true
        this.file_info = info
        this.getBase64(info.file, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      },
      getBase64 (img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
      },
      updataList(list){
        if(list.length){
          list.forEach((item, index) => {
            if (item.children.length == 0) {
              delete item.children
            } else {
              this.updataList(item.children)
            }
          })
          return list
        }
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        if (!this.imageUrl) {
          this.$notification.warning({
            message: 'Warning',
            description: '请上传工人头像'
          })
        }
        validateFields((errors, values) => {
          if (!errors) {
            if (this.file_info) {
              values.id = this.id
              const formdata = new FormData()
              formdata.append('files', this.file_info.file)
              formdata.append('attachType', '1003-50')
              commonFileUpload(formdata).then(res => {
                values.id = this.id
                values.imgUrl = res[0].requestUrl
                const ids = []
                ids.push(res[0].id)
                values.attachIds = ids
                values.customerId = this.customerId
                values.workerId = this.workerId
                values.isLeader = this.isLeader
                values.type = this.type
                values.status = '1084-20'
                this.save(values)
              }) .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => {
                  this.confirmLoading = false
                })
            }else {
              values.id = this.id
              values.imgUrl = ''
              values.attachIds = this.attachIds
              values.customerId = this.customerId
              values.workerId = this.workerId
              values.isLeader = this.isLeader
              values.type = this.type
              values.status = '1084-20'
              this.save(values)
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      save (data) {
        this.$post({
          url: this.$api.customInfo.workerDispatchInfo.verify,
          data,
          needResponse: true
        })
          .then(res => {
            this.handleCancel()
            this.$emit('ok',data)
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
        this.imageUrl= ''
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
      },
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    background: red !important;
    color: #585A62;
  }
  ::v-deep .ant-upload {
    width: 78px;
    height: 78px;
    margin: 0;
    padding: 0 !important;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-box {
      display: flex;
      flex-flow: column;
      justify-content: center;
    }
  }
</style>
