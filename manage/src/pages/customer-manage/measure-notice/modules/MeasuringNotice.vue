<template>
  <a-modal
    title="发送测量通知"
    :width="1200"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-table
        rowKey="id"
        ref="Table"
        :columns="columns"
        :dataSource="dataList"
        :scroll="{y:166}">
        <template #serial="t, record, index">
          <span>
            <span style="margin-left: 8px">{{ index + 1 }}</span>
          </span>
        </template>
      </a-table>
      <a-form :form="form" style="margin-top: 30px">
        <a-row>
          <a-col :md="8" :xs="24">
            <a-form-item label="计划测量日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                placeholder="请选择计划测量日期"
                v-decorator="['dateForDecoration',{ rules: [{ required: true, message: '测量通知信息,请输入计划测量日期!'}] }]"
                style="width: 100%">
              </a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="上传计划图片" class="col-1-2">
              <a-col :span="21">
                <a-upload
                  multiple
                  list-type="picture-card"
                  class="avatar-uploader"
                  style="width: 1020px;"
                  :file-list="fileList"
                  :customRequest="info => customRequest(info)"
                  @preview="handlePreview"
                  :remove="info => handleRemove(info)"
                  :beforeUpload="beforeUpload"
                  accept="image/jpeg,image/jpg,image/png"
                  v-decorator="['imgs',{ rules: [{ required: true, message: '测量通知信息,请上传计划图片!'}] }]">
                  <div class="upload-box" v-if="fileList.length < 9">
                    <a-icon :type="confirmLoading ? 'loading' : 'plus'"/>
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
                  <img alt="example" style="width: 100%" :src="previewImage"/>
                </a-modal>
              </a-col>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注信息" class="col-1-3">
              <a-textarea
                :rows="3"
                placeholder="请输入备注信息"
                autocomplete="off"
                v-decorator="['remark', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { checkErrors, defaultErrorMessage, maxLenValidator } from '@/utils/common'
import labels from '@/utils/labels'
import moment from 'moment'

export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      isError: false,
      errorMessage: '获取数据失败',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      columns:  [
        {
          title: '序号',
          fixed: 'left',
          width: 60,
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '材料名称',
          dataIndex:'materialName',
          width: 220,
          scopedSlots: {
            customRender: 'materialName',
            showSearch: {
              title: '材料名称',
              type: 'input'
            }
          }
        },
        {
          title: '材料编码',
          dataIndex: 'materialCode',
          width: 220,
        },

        {
          title: '材料品牌',
          dataIndex: 'brand'
        },
        {
          title: '材料型号',
          dataIndex: 'materialType'
        },
        {
          title: '材料规格',
          dataIndex: 'spec',
        },
        {
          title: '材料单位',
          dataIndex: 'unit'
        },
        {
          title: '材料价格',
          dataIndex: 'salePrice',
        },
      ],
      previewVisible: false,
      previewImage: '',
      dataList: [],
      fileList: [], // 上传图片
      file_info_list: [],
      attachIds: [],
      supplyId: '',
      supplyName: '',
      customerId: '',
    }
  },
  methods: {
    maxLenValidator,
    show (record,supplyId,customerId) {
      this.dataList = record
      this.supplyName = record[0].supplyName
      this.supplyId = supplyId
      this.customerId = customerId
      this.visible = true
    },
    // 图片上传
    customRequest(info) {
      this.confirmLoading = true
      this.file_info_list.push(info)
      this.getBase64(info.file, imageUrl => {
        const id = this.fileList.length
        this.fileList.push({
          id: id,
          uid: info.file.uid,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        })
        this.confirmLoading = false
      })
    },
    // 图片删除
    handleRemove(info) {
      this.fileList.splice(info.id, 1)
      this.file_info_list.splice(info.id, 1)
      this.attachIds.splice(info.id, 1)
      this.fileList.forEach((item, index) => {
        item.id = index
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
    getDate() {
      const { form: { validateFields } } = this
      return new Promise((resolve,reject)=> {
        validateFields((errors, values) => {
          if(!errors) {
            values.dateForDecoration = values.dateForDecoration ? moment(values.dateForDecoration).format('YYYY-MM-DD') : null
            resolve(values)
          } else {
            const keys = ['knownInfo','focusOn']
            reject(checkErrors(keys, errors))
          }
        })
      })
    },
    getDto () {
      const dto = {}
      const chooseMaterialIds = []
      const attachIds = []

      this.dataList.map( m =>{
        chooseMaterialIds.push(m.id)
      })
      dto.supplyId = this.supplyId
      dto.supplyName = this.supplyName
      dto.chooseMaterialIds = chooseMaterialIds
      dto.customerId = this.customerId

      this.getDate().then(res => {
        dto.planMeasureDate = res.dateForDecoration
        res.remark?dto.remark = res.remark : null
        res.imgs.fileList.map( item => {
          attachIds.push(item.uid)
        })
        dto.attachIds = attachIds
      })

      return dto
    },
    handleSubmit () {

      this.confirmLoading = true
      const dto = this.getDto()

      this.$post({
        url: this.$api.customInfo.measureNotifyInfo.sendMeasureNotify,
        data: dto
      }).then(res => {
        this.handleCancel()
        this.$emit('ok')
        this.$notification.success({
          message:labels.OPERATE_SUCCESS,
          description: res?.message || ''
        })
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
        .finally(()=> { this.confirmLoading = false})
    },
    handleCancel () {
      this.visible = false
      this.isError = false
      this.confirmLoading = false
      this.fileList = []
    },
  },
}
</script>

<style lang="scss" scoped>
  ::v-deep .col-1-2{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
    }
    .ant-form-item-control-wrapper{
      float: left;
    }
  }
  ::v-deep .col-1-3{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
    }
    .ant-form-item-control-wrapper{
      width: 88.888888%;
      float: left;
    }
  }
</style>