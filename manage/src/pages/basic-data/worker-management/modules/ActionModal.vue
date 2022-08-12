<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
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
            <a-row :grabbed="24">
              <a-form-item label="所属机构" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                <a-cascader
                  :options="treeList"
                  :display-render="displayRender"
                  change-on-select
                  expand-trigger="hover"
                  :fieldNames="{ label: 'name', value: 'code', children: 'children' }"
                  @change="orgChange"
                  placeholder="请选择上级分类"
                  v-decorator="['orgIds',{rules: [{required : true , message: '请选择上级分类'}]}]"/>
              </a-form-item>
            </a-row>
            <a-row :grabbed="24">
              <a-form-item label="工种类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                <a-select
                  mode="multiple"
                  allowClear
                  placeholder="请选择工种类型"
                  v-decorator="['workerInTypeList',{rules: [{required : true , message: '请选择工种类型'}]}]">
                  <a-select-option v-for="item in jobsList" :value="item.value" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-row>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              class="image"
              label="工人头像"
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
            <a-form-item label="工人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入工人姓名"
                autocomplete="off"
                :maxLength="64"
                v-decorator="['workerName', {rules: [{required: true, message: '请输入工人姓名'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入手机号码"
                autocomplete="off"
                v-decorator="['telPhone', {rules: [{required: true, message: '请输入手机号码'}, { validator: (r, v, fun) => regularCheck('mobilePhone', v, fun) }]}]"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :xs="24">
            <a-form-item label="籍贯" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入籍贯"
                autocomplete="off"
                :maxLength="32"
                v-decorator="['address']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入详细地址"
                autocomplete="off"
                :maxLength="500"
                v-decorator="['area']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="身份证" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入身份证"
                autocomplete="off"
                v-decorator="['idCard', {rules: [{ validator: (r, v, fun) => regularCheck('identity', v, fun) }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="社保号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入社保号"
                autocomplete="off"
                :maxLength="32"
                v-decorator="['socialSecurity']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="银行账号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入银行账号"
                autocomplete="off"
                v-decorator="['bankAccount', {rules: [{ validator: (r, v, fun) => regularCheck('bank', v, fun) }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                allowClear
                placeholder="请选择项目经理"
                v-decorator="['workerPrincipalId']">
                <a-select-option
                  v-for="(item, index) in workerList"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isActive',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="工人等级" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-rate v-decorator="['workerLevel']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}" >
              <a-textarea
                :rows="4"
                :maxLength="500"
                placeholder="请输入备注"
                autocomplete="off"
                v-decorator="['remark']"/>
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
    props: {
      jobsList: {
        type: Array,
        default: () => []
      },
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
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        workerOrgCode: '',
        imageUrl: '',
        loading: false,
        form: this.$form.createForm(this),
        treeList: [],
        attachIds: [],
        workerList:[],
      }
    },
    created () {
      this.getTreeList()
    },
    methods: {
      maxLenValidator,regularCheck,
      add (record) {
        this.form.resetFields()
        const { form: { setFieldsValue } } = this
        this.modalType = 'add'
        this.id = ''
        this.imageUrl= ''
        this.visible = true
        this.workerOrgCode =  record.menuId
        this.getEmployeeList()
        const data = {
          workerOrgName: record.menuTitle,
          orgIds: [...record.orgIds].reverse()
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getEmployeeList()
        this.$get({
          url: this.$api.basicData.worker.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.parentId = data.parentId
            this.workerOrgCode = data.workerOrgCode
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            if (res.attachInfoList.length) {
              this.imageUrl  = res.attachInfoList[0].path
              const arr = []
              arr.push(res.attachInfoList[0].id)
              this.attachIds = arr
            }
            delete data.attachInfoList
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      // 获取项目经理数据
      getEmployeeList() {
        const data = {
          currentPage: 0,
          pageSize: 0,
          positionCode:'1042-07'
        }
        this.$post({
          url: this.$api.employeeManage.employeeInfo.getEasyList,
          data
        }).then(res => {
          this.workerList = res.rows
        }).catch(err => defaultErrorMessage(err, labels.APPLY_ERROR))
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
      // 搜索
      handleSearch() {

      },
      orgChange(e) {
        // console.log(e)
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
              if(values.orgIds && values.orgIds.length) {
                values.workerOrgCode = values.orgIds[values.orgIds.length - 1]
              } else {
                values.workerOrgCode = this.workerOrgCode
              }
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
              }) .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => {
                  this.confirmLoading = false
                })
            }else {
              values.id = this.id
              if(values.orgIds && values.orgIds.length) {
                values.workerOrgCode = values.orgIds[values.orgIds.length - 1]
              } else {
                values.workerOrgCode = this.workerOrgCode
              }
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
          url: this.$api.basicData.worker.edit,
          data,
          needResponse: true
        })
          .then(res => {
            this.handleCancel()
            this.$emit('ok')
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
