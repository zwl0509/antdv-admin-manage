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
      <!-- isPhoto -->
      <a-col :md="23" :xs="24" v-for="(item,index) in dataList" :key="index">
        <a-form-item :label="`${index + 1 }、` + item.questionTitle" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div v-if="item.questionSubtitle" class="label-sub">{{ item.questionSubtitle }}</div>
          <template v-if="item.questionType == '1077-10'">
            <a-input placeholder="请输入答案" :disabled="modal_type == 'detail'" autocomplete="off" v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请填写！！`}]}]" :max-length="100"/>
          </template>
          <template v-if="item.questionType == '1077-20'">
            <a-radio-group :disabled="modal_type == 'detail'" v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请选择！！`}]}]">
              <a-radio v-for="(info, s_index) in item.surveyOptionsInfoVOS" :value="info.id" :key="s_index" >
                {{ info.content }}
              </a-radio>
            </a-radio-group>
          </template>
          <template v-if="item.questionType == '1077-30'">
            <a-checkbox-group :disabled="modal_type == 'detail'" v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请选择！！`}]}]">
              <a-checkbox v-for="(info, s_index) in item.surveyOptionsInfoVOS" :key="s_index" :value="info.id">
                {{ info.content }}
              </a-checkbox>
            </a-checkbox-group>
          </template>
          <template v-if="item.questionType == '1077-40'">
            <a-select :disabled="modal_type == 'detail'" placeholder="请选择答案" allowClear v-decorator="[item.key,{ rules: [{ required: item.isRequired, message: `第${index+1}问题，请选择！！`}]}]">
              <a-select-option v-for="(info, s_index) in item.surveyOptionsInfoVOS" :key="s_index" :value="info.id">
                {{ info.content }}
              </a-select-option>
            </a-select>
          </template>
          <template>
            <a-upload
              multiple
              list-type="picture-card"
              class="avatar-uploader"
              style="width: 600px; margin-top: 10px;"
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
        newDataList: []
      }
    },
    methods: {
      show(record,surveyType) {
        this.modal_type = 'add'
        this.id = record.id
        this.applicationId = record.applicationId
        this.visible = true
        this.getSelectQuestion(surveyType)
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
      // 选定问题
      getSelectQuestion(surveyType) {
        this.$get({
          url: this.$api.allocation.surveyInfo.getSurveyDetail,
          params: { surveyType},
        }).then((res)=>{
          const data = { ...res }
          this.surveyInfoId = data.id
          this.dataList = data.surveyQuestionInfoVOList
          data.surveyQuestionInfoVOList.forEach((item,index)=>{
            item.key = `${item.questionType}-${index}`
            item.fileList = []
            item.file_info_list = []
            item.attachIds = []
          })
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
                customerId: this.id,
                relationId: localStorage.getItem('userId'),
                surveyInfoId: this.surveyInfoId,
                applicationId: this.applicationId,
                surveyQuestionDTOList: res
              }
              return this.save(params)
            }).catch()
          } else {
            const keys = []
            this.dataList.forEach(item=> {
              keys.push(item.key)
            })
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
            this.confirmLoading = false
          }
        })
      },
      // 处理回填数据 
      getData(list){
       const pobject = {}
        list.forEach((item,index)=> {
          item.key = `${item.questionType}-${index}`
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
                content: null
              })
            })
            list.push({
              attachIds: item.attachIds,
              surveyQuestionId: item.id,
              sequence: item.sequence,
              surveyOptionsDTOList: plist
            })
          })
          keys.forEach(el=> {
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
              res.forEach(el => {
                ids.push(el.id)
              })
              item.attachIds = item.attachIds?.concat(ids)
              resolve()
            }).catch(err => defaultErrorMessage(err, labels.UPLOAD_FILE_FAIL))
          }else {
            resolve()
          }
        })
      },
      save(data) {
        this.$post({
          url: this.$api.allocation.surveyInfo.submitSurvey,
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
      handleRemove(info,index) {
        this.dataList[index].fileList.splice(info.uid, 1)
        this.dataList[index].file_info_list.splice(info.uid, 1)
        this.dataList[index].attachIds.splice(info.uid, 1)
        this.dataList[index].fileList.forEach((item, index) => {
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
        this.id = ''
        this.surveyInfoId = ''
        this.applicationId = ''
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
</style>