<template>
  <a-modal
    :title="'导入其他部门'"
    :width="450"
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
              label="导入其他部门">
              <a-upload
                :customRequest="uploadImage"
                :remove="removeFile"
                :fileList="newFileList"
                v-decorator="['file', {rules: [{required: true}]}]">
                <a-button v-if="newFileList.length<1">
                  <a-icon type="upload" />
                  {{ upload_text }}
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-cascader
                :options="treeList"
                :display-render="displayRender"
                change-on-select
                expand-trigger="hover"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                @change="orgChange"
                placeholder="请选择所属部门"
                v-decorator="['orgIds',{rules: [{required : true , message: '请选择所属部门'}]}]"/>
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
    name: 'ImportDepartmentInfo',
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
        upload_text: '导入其他部门',
        type: '',
        importType:'',
        departmentId:'',
        treeList: []
      }
    },
    created () {
    },
    methods: {
      show (type,importType) {
        this.type = type
        this.importType = importType
        this.visible = true
        this.getTreeList()
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
      displayRender({ labels }) {
        return labels[labels.length - 1]
      },
      orgChange(e) {
        this.departmentId = e[e.length - 1]
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
            formdata.append('type', this.type)
            formdata.append('importType', this.importType)
            formdata.append('departmentId', this.departmentId)
            this.$post({
              url: this.$api.customInfo.highSeaPoolCustomer.import,
              data: formdata,
              needResponse: true
            }).then(res => {
              this.handleCancel()
              this.$emit('ok')
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
        this.type = ''
        this.visible = false
        this.confirmLoading = false
        this.newFileList = []
      },
    },
    computed: {},
    watch: {}
  }
</script>

<style scoped>
  ::v-deep .ant-form-item-control {
    position: relative;
    line-height: 40px;
    zoom: 1;
    width: 138px;
  }
</style>
