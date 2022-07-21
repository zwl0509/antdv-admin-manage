<template>
  <a-modal
    :title="modal_type =='add' ? '新增客户跟踪' : '客户跟踪详情'"
    :width="800"
    :centered="true"
    :visible="visible"
    :mask-closable="false"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="跟踪类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择跟踪类型" :disabled="modal_type == 'detail'" allowClear v-decorator="['trackType',{ rules : [{ required: true}], initialValue: '1037-10'}]">
                <a-select-option
                  v-for="(item, index) in trackType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="记录类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择记录类型" :disabled="modal_type == 'detail'" allowClear v-decorator="['recordType',{ rules : [{ required: true}],initialValue: '1038-10'}]">
                <a-select-option
                  v-for="(item, index) in recordTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="12" :sm="24">
            <a-form-item label="下一阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择下一阶段" @change="stageChange" :disabled="modal_type == 'detail'" allowClear v-decorator="['type', { initialValue: status }]">
                <a-select-option value="">保持当前状态</a-select-option>
                <a-select-option
                  v-for="(item, index) in customerTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :md="12" :sm="24">
            <a-form-item label="提醒人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                v-if="modal_type !== 'detail'"
                mode="multiple"
                showArrow
                showSearch
                placeholder="请选择提醒人"
                @search="handleSearch"
                :filter-option="false"
                allowClear
                :not-found-content="selectLoading ? undefined : null"
                v-decorator="['reminder']">
                <a-spin v-if="selectLoading" slot="notFoundContent" size="small">
                </a-spin>
                <a-select-option v-for="(item, index) in employeeList" :key="index" :value="item.id">
                  <div style="display: flex; justify-content: space-between;">
                    <span>{{ item.organizationName }}</span>
                    <span>{{ item.name }}</span>
                  </div>
                </a-select-option>
                <a-select-option v-if="totalPage > 1" value="0" disabled class="select-page">
                  <template>
                    <a-row :grabbed="48">
                      <a-col :md="12" :xs="24" style="text-align: center" @click="prev" :style="[{ cursor: (currentPage>1?'pointer':'not-allowed')},{color: (currentPage>1?'#585A62':'')}]">
                        上一页
                      </a-col>
                      <a-col :md="12" :xs="24" style="text-align: center" @click="next" :style="[{ cursor: (currentPage<totalPage?'pointer':'not-allowed')},{color: (currentPage<totalPage?'#585A62':'')}]">
                        下一页
                      </a-col>
                    </a-row>
                  </template>
                </a-select-option>
              </a-select>
              <a-tooltip v-else :title="reminderNames">
                <div class="dispatch-user">{{ reminderNames || '请选择提醒人' }}</div>
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="客户状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择客户状态" :disabled="modal_type == 'detail'" allowClear v-decorator="['stage',{ initialValue: '' }]">
                <a-select-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="提醒时间" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-date-picker
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                style="width: 100%;"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['remindTime']"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" v-if="modal_type === 'add'">
            <a-form-item label="常用语" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-select placeholder="请选择常用语" @select="handleSelect" :disabled="modal_type == 'detail'" allowClear v-decorator="['']">
                <a-select-option
                  v-for="(item, index) in wordsList"
                  :key="index"
                  :value="item.id"
                >{{ item.words }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="跟踪记录内容" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-textarea placeholder="请输入跟踪记录内容" :disabled="modal_type == 'detail'" autocomplete="off" v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="图片" :labelCol="labelCol1" :wrapperCol="labelCol1">
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
        </a-row>
      </a-form>
    </a-spin>
    <!-- 分配 -->
    <!-- <replace-personnel ref="ReplacePersonnel" @ok="handleOk"></replace-personnel> -->
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { defaultErrorMessage , filedIsNull} from '@/utils/common'
  import { commonFileUpload } from '@/api/common'
  export default {
    data() {
      return {
        visible: false,
        previewVisible: false,
        loading: false,
        previewImage: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        selectLoading: false,
        currentPage: 1,
        totalPage: 1,
        pageSize: 6,
        modal_type: 'add',
        id: '',
        confirmLoading: false,
        form: this.$form.createForm(this),
        trackType: [],
        recordTypeList: [],
        customerTypeList: [],
        statusList:[],
        fileList: [], // 上传图片
        file_info_list: [],
        attachIds: [],
        status:'',
        isSkip: false,
        isCheckEmployee: false, // 是否选人
        employeeList: [],// 分总 设计师list
        employeeType: '' , // 职位
        wordsList:[],
        reminder:[],
        commonWordList:[],
        reminderNames: ''
      }
    },
    methods: {
      add(id,status) {
        this.modal_type = 'add'
        this.status = status
        this.visible = true
        this.id = id
        this.getCodeList()
        this.getWordsList()
        this.getEmployeeList()
      },
      edit(record, type, status){
        this.status = status
        this.modal_type = type
        this.reminderNames = record.reminderNames
        this.visible = true
        this.id = record.id
        this.getCodeList()
        this.getDetail(record)
        this.getWordsList()
        // this.getEmployeeList()
      },
      // 获取人员数据
      getEmployeeList(val) {
        this.selectLoading = true
        this.employeeList = []
        const data = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          employeeName: val || ''
        }
        this.$post({
          url: this.$api.employeeManage.employeeInfo.getEasyList,
          data
        }).then(res => {
          this.selectLoading = false
          this.employeeList = res.rows
          this.totalPage = Math.ceil(res.total / this.pageSize)
        }).catch(err => {
          this.isError = true
          this.errorMessage = err && err.message || '获取父级code数据失败'
        })
      },
      handleSearch(val) {
        this.getEmployeeList(val)
      },
      prev () {
        if (this.currentPage > 1) {
          this.currentPage--
          this.getEmployeeList()
        }
      },
      next () {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
          this.getEmployeeList()
        }
      },
      handleSelect(e, node){
        console.log(e, node)
        const data = this.wordsList.find(el=> el.id === e)
        if (data.words){
          const val = this.form.getFieldValue('remark') || ''
          this.form.setFieldsValue({
            remark: val + data.words
          })
        }

      },
      getWordsList(){
        this.wordsList = []
        const data = {
          currentPage: 0,
          pageSize: 0,
          code: '1045-30'
        }
        this.$post({
          url: this.$api.customInfo.commonWords.getList,
          data
        }).then(res => {
          this.wordsList = res.rows
        })
      },
      getDetail(data) {
        this.confirmLoading = true
        const { form: { setFieldsValue } } = this
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
        for (const key in data) {
          if (filedIsNull(data[key])) {
            delete data[key]
          }
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
        this.confirmLoading = false
      },
      getCodeList() {
        const params = {
          typeList: ['1037','1038','1033','1057','1045']
        }
        this.$getCodesList(params, res => {
          this.trackType = res['1037'] || []  // 跟踪类型
          this.recordTypeList = res['1038'] || []  // 记录类型
          this.customerTypeList = res['1033'] || []  // 记录类型
          this.statusList = res['1057'] || []  // 记录类型
          this.commonWordList = res['1045'] || [] //常用语类型
          if(this.status && this.modal_type == 'add') {
            this.customerTypeList.forEach((el,index)=>{
              if(el.value == this.status) {
                this.customerTypeList.splice(0, index)
              }
            })
          }
        })
      },
      // 是否确定新增客户跟踪
      confirm() {
        this.handleSubmit()
      },
      async stageChange(e) {
        await this.isSkipChange(e)
        this.form.setFieldsValue({ employeeId: undefined })
        if(e == this.status) {
          this.isCheckEmployee = false
        } else {
          if(e == '1033-60') {
            this.isCheckEmployee = true
            this.employeeType = '1042-03'
            await this.getEmployeeList()
          } else if (e == '1033-70') {
            this.isCheckEmployee = true
            this.employeeType = '1042-05'
            await this.getEmployeeList()
          }else {
            this.isCheckEmployee = false
          }
        }
      },
      // 查看是否有跳过当前流程
      isSkipChange(e) {
        console.log(2)
        const params = {
          type: e || '',
          customerId: this.id
        }
        this.$get({
          url: this.$api.customInfo.customerCommon.checkWorkFlow,
          params,
        }).then((res)=>{
          this.isSkip = res
        })
      },
      handleSubmit (){
        this.confirmLoading = true
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if(!errors) {
            values.customerIds = [this.id]
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
              })
                .catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
                .finally(() => {
                  this.confirmLoading = false
                })
            } else {
              values.attachIds = this.attachIds
              this.save(values)
            }
          }
        })
      },
      save(data) {
        this.confirmLoading = true
        data.stage = data.stage ? data.stage : null
        data.isSkip = this.isSkip
        data.employeeType = this.employeeType
        data.remindTime = moment(data.remindTime).format('YYYY-MM-DD HH:mm')
        this.$post({
          url: this.$api.customInfo.customerCommon.trackingCustomer,
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
        this.form.resetFields()
        this.visible = false
        this.isSkip = false
        this.isCheckEmployee = false
        this.employeeType = ''
        this.file_info_list = []
        this.fileList = []
        this.status = ''
        this.reminderNames = ''
        this.attachIds = []
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    color: #BFBFBF;
    width: 250px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
</style>