<template>
  <a-modal
    :title="modal_type == 'add'? '问卷调查' : '查看问卷'"
    :width="700"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-form :form="form" layout="vertical">
      <a-col :md="23" :xs="24" v-for="(item,index) in dataList" :key="index">
        <a-form-item :label="`${index + 1 }、` + item.questionTitle" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div v-if="item.questionSubtitle" class="label-sub">{{ item.questionSubtitle }}</div>
          <template v-if="item.questionType == '1077-10'">
            <div class="label-sub">
              <a-input placeholder="请输入答案" :disabled="modal_type == 'detail'" autocomplete="off" v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请填写！！`}]}]" :max-length="100"/>
            </div>
          </template>
          <template v-if="item.questionType == '1077-20'">
            <div class="label-ml">
              <a-radio-group :disabled="modal_type == 'detail'" v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请选择！！`}]}]">
                <a-radio v-for="(info, s_index) in item.surveyOptionsInfoVOS" :value="info.id" :key="s_index" >
                  {{ info.content }}
                </a-radio>
              </a-radio-group>
              <a-input
                style="margin-top: 20px;"
                placeholder="请输入描述内容:"
                :disabled="modal_type == 'detail'"
                autocomplete="off"
                v-model="item.content"
                :max-length="150"/>
            </div>
          </template>
          <template v-if="item.questionType == '1077-30'">
            <div class="label-ml">
              <a-checkbox-group :disabled="modal_type == 'detail'" v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请选择！！`}]}]">
                <a-checkbox v-for="(info, s_index) in item.surveyOptionsInfoVOS" :key="s_index" :value="info.id">
                  {{ info.content }}
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </template>
          <template v-if="item.questionType == '1077-40'">
            <div class="label-ml">
              <a-select :disabled="modal_type == 'detail'" placeholder="请选择答案" allowClear v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请选择！！`}]}]">
                <a-select-option v-for="(info, s_index) in item.surveyOptionsInfoVOS" :key="s_index" :value="info.id">
                  {{ info.content }}
                </a-select-option>
              </a-select>
            </div>
          </template>
          <template v-if="item.isPhoto">
            <a-upload
              multiple
              list-type="picture-card"
              class="avatar-uploader"
              style="width: 600px; margin: 20px 0 0 40px;"
              :file-list="item.fileList"
              :customRequest="info => customRequest(info, index)"
              @preview="handlePreview"
              :remove="info => handleRemove(info, index)"
              :beforeUpload="(file,fileList) => beforeUpload(file, fileList, index)"
              accept="image/jpeg,image/jpg,image/png"
              :disabled="modal_type == 'detail'">
              <div class="upload-box" v-if="modal_type !== 'detail' && item.fileList.length < 9">
                <a-icon :type="loading ? 'loading' : 'plus'"/>
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
              <img alt="example" style="width: 100%" :src="previewImage"/>
            </a-modal>
          </template>
        </a-form-item>
      </a-col>
    </a-form>
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import { commonFileUpload } from '@/api/common'
  import { defaultErrorMessage, checkErrors } from '@/utils/common'
import { deepClone } from '@/utils/util'
  export default {
    name: 'QuestionnaireModal',
    data () {
      return {
        modal_type:'add',
        previewVisible: false,
        loading: false,
        previewImage: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        },
        visible: false,
        dataList: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        id:'',
        surveyInfoId: '', // 问卷ID
        oldDataList: [],
        checkStatus: '',
        customerId:'',

      }
    },
    methods: {
      show(surveyType,customerId) {
        this.modal_type = 'add'
        this.customerId = customerId
        this.visible = true
        this.getSelectQuestion(surveyType).then(res=> {
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      edit(record, customerId) {
        this.modal_type = 'edit'
        this.visible = true
        this.customerId = customerId
        this.getQuestionDetail(record)
      },
      detail(data) {
        this.modal_type = 'detail'
        this.visible = true
        this.dataList = data.surveyQuestionVOList
        const pobject = this.getData(data.surveyQuestionVOList)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, pobject), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      /**
       *  查看问卷 => 回填
       * @param 1，获取问卷
       * @param 2，从列表里面拿数据
       * @param 3，处理拿到的数据，并且把key赋值。
       */
      getQuestionDetail(record) {
        this.getSelectQuestion(record.surveyType).then(res=> {
          // 处理数据
          const pobject = this.getEditData(record.customerSurveyInfo)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(Object.assign({}, pobject), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getEditData(data) {
        const list = deepClone(data.surveyQuestionDTOList)
        const newDataList = deepClone(this.dataList)
        const pobject = {}
        console.log(list)
        list?.forEach((item, index)=> {
          const fileList = []
          const ids = []
          item.attachPhoto.forEach((s_item, s_index) => {
            s_item.uid = s_index
            fileList.push({
              uid: fileList.length,
              name: 'image.png',
              status: 'done',
              url: s_item.requestUrl
            })
            ids.push(s_item.id)
          })
          item.fileList = fileList
          item.attachIds = ids
          item.key = `${item.questionType}-${index}`
          item.content = item.surveyOptionsDTOList[0]?.content || ''
          if(item.questionType == '1077-10') {
            pobject[`${item.questionType}-${index}`] = item.surveyOptionsDTOList[0].content || ''
          } else if (item.questionType == '1077-30') {
            const value = []
            item.surveyOptionsDTOList?.forEach(info=> {
                value.push(info.surveyOptionId)
            })
            pobject[`${item.questionType}-${index}`] = value
          } else {
            let value = ''
            item.surveyOptionsDTOList?.forEach(info=> {
              value = info.surveyOptionId
            })
            pobject[`${item.questionType}-${index}`] = value
          }
        })
        newDataList.forEach( _i => {
          list.forEach( _k => {
            if(_i.key == _k.key ) {
              _i.fileList = _k.fileList
              _i.content = _k.content
              _i.attachIds = _k.attachIds
              _i.attachPhoto = _k.attachPhoto
            }
          })
        })
        this.dataList = [ ...newDataList ]
        return pobject
      },
      getQuestionByIds(surveyId) {
        this.confirmLoading = true
        return this.$post({
          url: this.$api.allocation.surveyInfo.getQuestionByIds,
          data: surveyId ,
        }).then((res)=>{
          const list  = res
          list.forEach((item,index)=>{
            item.key = `${item.questionType}-${index}`
            item.fileList = []
            item.file_info_list = []
            item.attachIds = []
          })
          this.surveyInfoId = list[0]?.surveyInfoId || ''
          this.dataList = list || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 问卷ID查询
      getSurveyDetailById(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.allocation.surveyInfo.getSurveyDetailById,
          params: { id },
        }).then((res)=>{
          const data = { ...res }
          this.surveyInfoId = data.id
          data?.surveyQuestionInfoVOList.forEach((item,index)=>{
            item.key = `${item.questionType}-${index}`
            item.fileList = []
            item.file_info_list = []
            item.attachIds = []
          })
          this.dataList = data?.surveyQuestionInfoVOList || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 选定问题
      getSelectQuestion(surveyType) {
        this.confirmLoading = true
        return this.$get({
          url: this.$api.allocation.surveyInfo.getSurveyDetail,
          params: { surveyType},
        }).then((res)=>{
          const data = { ...res }
          this.surveyInfoId = data.id
          data?.surveyQuestionInfoVOList.forEach((item,index)=>{
            item.key = `${item.questionType}-${index}`
            item.fileList = []
            item.file_info_list = []
            item.attachIds = []
            item.attachPhoto = []
          })
          this.dataList = data?.surveyQuestionInfoVOList || []
        })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            const arr = []
            this.dataList.forEach(item=> {
              arr.push(this.uploadPtone(item))
            })
            Promise.all(arr).then(res=> {
              return this.setData(values,this.dataList)
            }).then(res=> {
              const params = {
                customerId: this.customerId,
                relationId: localStorage.getItem('userId'),
                surveyInfoId: this.surveyInfoId,
                surveyQuestionDTOList: res
              }
              this.$emit('getInfo',params)
              this.handleCancel()
            }).catch()
          }
        })
      },
      // 处理回填数据
      getData(list){
        console.log(list)
        const pobject = {}
        list.forEach((item,index)=> {
          const fileList = []
          const ids = []
          item.attachInfos.forEach(info => {
            fileList.push({
              uid: fileList.length,
              name: 'image.png',
              status: 'done',
              url: info.path
            })
            ids.push(item.id)
          })
          item.fileList = fileList
          item.attachIds = ids
          item.key = `${item.questionType}-${index}`
          item.content = item.surveyOptionsVOList[0]?.content || ''
          console.log(item.surveyOptionsVOList[0].content || '')
          if(item.questionType == '1077-10') {
            pobject[`${item.questionType}-${index}`] = item.surveyOptionsVOList[0].content || ''
          } else if (item.questionType == '1077-30') {
            const value = []
            item.surveyOptionsInfoVOS.forEach(info=> {
              if(info.isCustomerPick) {
                value.push(info.id)
              }
            })
            pobject[`${item.questionType}-${index}`] = value
          } else {
            let value = ''
            item.surveyOptionsInfoVOS.forEach(info=> {
              if(info.isCustomerPick) {
                value = info.id
              }
            })
            pobject[`${item.questionType}-${index}`] = value
          }
        })
        return pobject
      },
      // 处理数据 选中的数据
      setData(values, data) {
        return new Promise((resolve, reject) => {
          const keys = []
          const list = []
          for (const key in values) {
            keys.push({
              type: key.split('-')[1],
              index: Number(key.split('-')[2]),
              value: values[key]
            })
          }
          data.forEach(item=> {
            const plist = []
            item.surveyOptionsInfoVOS?.forEach(info=> {
              plist.push({
                surveyOptionId: info.id,
                score: info.score,
                content: item.content
              })
            })
            list.push({
              attachInfos: item.fileList,
              attachPhoto: item.attachPhoto,
              attachIds: item.attachIds,
              surveyQuestionId: item.id,
              sequence: item.sequence,
              surveyOptionsDTOList: plist
            })
          })
          keys.forEach(el=> {
            list[el.index].questionType = `1077-${el.type}`
            if(el.value) {
              if(el.type == '10') {
                list[el.index].surveyOptionsDTOList.push({
                  content: el.value
                })
              }else if (el.type == '30'){
                const nlist = []
                list[el.index].surveyOptionsDTOList.forEach(item =>{
                  el.value?.forEach(info=> {
                    if(item.surveyOptionId == info ) {
                      item.surveyOptionId = info
                      nlist.push(item)
                    }
                  })
                })
                list[el.index].surveyOptionsDTOList = nlist
              }else {
                const nlist = []
                list[el.index].surveyOptionsDTOList.forEach(item =>{
                  if(item.surveyOptionId == el.value ) {
                    item.surveyOptionId = el.value
                    nlist.push(item)
                  }
                })
                list[el.index].surveyOptionsDTOList = nlist
              }
            } else {
              list[el.index].surveyOptionsDTOList = []
            }
          })
          resolve(list)
        })
      },
      // 处理图片
      uploadPtone(item){
        return new Promise((resolve, reject) => {
          if(item.file_info_list.length) {
            const formdata = new FormData()
            formdata.append('attachType', '1009-20')
            formdata.append('customerId', this.id)
            item.file_info_list?.forEach(info => {
              formdata.append('files', info.file)
            })
            commonFileUpload(formdata).then(res => {
              const ids = []
              const attachPhoto = []
              res.forEach(el => {
                ids.push(el.id)
                attachPhoto.push(el)
              })
              item.attachIds = item.attachIds?.concat(ids)
              item.attachPhoto = item.attachPhoto?.concat(attachPhoto)
              resolve()
            }).catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
          }else {
            resolve()
          }
        })
      },
      // 验收 => 保存问卷
      taskCheckSave(params) {
        this.confirmLoading = false
        const data =  {
          customerSurveyInfoDTO: params,
          status: this.checkStatus,
          customerConstructionTaskId: this.applicationId, // 任务流程ID
        }
        this.$post({
          url: this.$api.allocation.surveyInfo.constructionTaskCheck,
          data,
          needResponse: true
        }).then(res => {
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      // 图片上传
      customRequest(info ,index) {
        this.loading = true
        this.dataList[index].file_info_list.push(info)
        this.getBase64(info.file, imageUrl => {
          const id = this.dataList[index].fileList.length
          this.dataList[index].fileList.push({
            uid: id,
            name: 'image.png',
            status: 'done',
            url: imageUrl
          })
          this.loading = false
        })
      },
      // 图片删除
      handleRemove(info, index) {
        this.dataList[index].file_info_list.splice(info.uid, 1)
        this.dataList[index].attachIds.splice(info.uid, 1)
        this.dataList[index].fileList.forEach((item, index) => { item.uid = index })
        this.dataList[index].fileList.splice(info.uid, 1)
        this.dataList[index].attachPhoto.forEach((item, index) => { item.uid = index })
        this.dataList[index].attachPhoto.splice(info.uid, 1)
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
      beforeUpload(file, imgList, index) {
        if (this.dataList[index].fileList.length + imgList.length > 9) {
          this.$notification.warning({
            message: labels.UPLOAD_FILE_FAIL,
            description: '图片已超过9个,请重新上传！！',
          })
          return false
        }
      },
      handleCancel() {
        this.visible = false
        this.confirmLoading = false
        this.oldDataList = []
        this.id = ''
        this.surveyInfoId = ''
        this.applicationId = ''
        this.checkStatus = ''
        this.dataList = []
        this.form.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .is-photo {
    text-align: right;
    position: relative;
    top: 24px;
    z-index: 99;
  }
  ::v-deep .ant-checkbox-wrapper + .ant-checkbox-wrapper  {
    margin-left: 0;
  }

  ::v-deep.ant-form-item label {
    font-size: 18px;
  }
  ::v-deep .ant-checkbox-group label {
    font-size: 14px;
  }
  ::v-deep .ant-radio-group label {
    font-size: 14px;
  }
  .label-sub {
    margin: 0 0 8px 42px;
    font-size: 16px;
    color: #999999;
  }
  .label-ml {
    margin-left: 40px;
  }
</style>