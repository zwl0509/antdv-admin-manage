<template>
  <a-modal
    title="移交设计部申请"
    :width="850"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col :md="12" :xs="24">
            <a-form-item label="移交部门" :labelCol="labelCol01" :wrapperCol="wrapperCol01" >
              <a-cascader
                :options="treeList"
                :display-render="displayRender"
                change-on-select
                expand-trigger="hover"
                :fieldNames="{ label: 'name', value: 'code', children: 'children' }"
                @change="orgChange"
                placeholder="请选择移交部门"
                v-decorator="['orgIds',{rules: [{required : true , message: '请选择移交部门'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="移交审核人" :labelCol="labelCol01" :wrapperCol="wrapperCol01">
              <a-select
                allowClear
                :disabled="isAuditor"
                placeholder="请选择移交审核人"
                v-decorator="['auditor',{ rules : [{ required: true}]}]">
                <a-select-option
                  v-for="(item, index) in auditorList"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="申请原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入申请原因"
            :rows="6" 
            v-decorator="['applicationReason', {rules: [{required: true}]}]"
            :max-length="500"></a-textarea>
        </a-form-item>
        <a-form-item v-if="false" label="申请图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            multiple
            list-type="picture-card"
            class="avatar-uploader"
            style="width: 700px;"
            :file-list="fileList"
            :customRequest="info => customRequest(info)"
            @preview="handlePreview"
            :remove="info => handleRemove(info)"
            :beforeUpload="beforeUpload"
            accept="image/jpeg,image/jpg,image/png"
            v-decorator="['imgs']">
            <div class="upload-box" v-if="fileList.length < 6">
              <a-icon :type="loading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
            <img alt="example" style="width: 100%" :src="previewImage"/>
          </a-modal>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import { commonFileUpload } from '@/api/common'

  export default {
    name: 'HandoverDesign',
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        labelCol01: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        visible: false,
        confirmLoading: false,
        id: '',
        ids: [],
        form: this.$form.createForm(this),
        type: '',
        previewVisible: false,
        loading: false,
        isAuditor: true,
        code:'',
        previewImage: '',
        fileList: [], // 上传图片
        file_info_list: [],
        attachIds: [],
        auditorList: [], // 阶段审核人
        treeList:[]
      }
    },
    created () {
      this.getTreeList()
    },
    methods: {
      show(ids) {
        this.ids = ids
        this.id = ids[0] || ''
        this.visible = true
        this.getEmployeeList()
      },
      getTreeList () {
        this.$get({
          url: this.$api.organization.getTreeList,
        }).then(res => {
          const data = this.updataList(res)
          this.treeList = data
        })
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
      orgChange(e) {
        if (e && e.length) {
          // 调用部门接口 并清空选输入内容
          this.isAuditor = false
          this.$nextTick(() => {
            this.code = e[e.length - 1]
            this.getEmployeeList(e[e.length - 1])
            this.form.setFieldsValue({
              auditor: undefined
            })
          })
        } else {
          // 清空人员数据
          this.isAuditor = true
          this.$nextTick(() => {
            this.auditorList = []
            this.form.setFieldsValue({
              auditor: undefined
            })
          })
        }
        this.getTreeList()
      },
      displayRender({ labels }) {
        return labels[labels.length - 1]
      },
      // 获取人员数据
      getEmployeeList() {
        const data = {
          currentPage: 0,
          pageSize: 0,
          positionCode:'1042-05',
          organizationCode: this.code
        }
        //
        this.$post({
          url: this.$api.employeeManage.employeeInfo.getEasyList,
          data
        }).then(res => {
          this.auditorList = res.rows
        }).catch(err => defaultErrorMessage(err, labels.APPLY_ERROR))
      },
      handleSubmit() {
        this.confirmLoading = true
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            values.type = '1056-40'
            values.relationIds = this.ids
            if (this.file_info_list.length) {
              const formdata = new FormData()
              formdata.append('attachType', '1009-60')
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
                .finally(() => { this.confirmLoading = false })
            } else {
              values.attachIds = this.attachIds
              this.save(values)
            }
          }else {
            this.confirmLoading = false
          }
        })
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
      save (data) {
        this.$post({
            url: this.$api.customInfo.customerCommon.application,
            data,
            needResponse: true
          }).then(res=>{
            this.handleCancel()
            this.$emit('ok')
            this.$notification.success({
              message: labels.APPLY_SUCCESS,
              description: res.message || ''
            })
          }).catch(err => defaultErrorMessage(err, labels.APPLY_ERROR))
            .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        // 重置表单数据
        this.id = ''
        this.ids = []
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.file_info_list = []
        this.fileList = []
        this.auditorList = []
      }
    }
  }
</script>