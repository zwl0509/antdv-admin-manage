<template>
  <a-modal
    title="材料确认"
    :width="850"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-card style="margin-bottom: 10px" v-for="(item, index) in dataList" :key="index" hoverable>
        <div slot="title" style="display: flex;justify-content: space-between;align-items: center">
          <span>{{ `${item.MaterialName} (${item.Spec})` }}</span>
          <a-button type="primary" @click="confirm(item)">确认</a-button>
        </div>
        <a-col :md="12" :xs="24" style="margin-bottom: 12px">
          <a-col :span="6" class="left-content">材料数量: </a-col>
          <a-col :span="18">
            <a-input v-model="item.SaleNum" placeholder="请输入数量" disabled autocomplete="off" />
          </a-col>
        </a-col>
        <a-col :md="24" :xs="24" style="margin-bottom: 12px">
          <a-col :span="3" class="left-content">确认备注: </a-col>
          <a-col :span="21">
            <a-textarea v-model="item.remark" :rows="3" placeholder="请输入发货备注" autocomplete="off" :maxLength="300" />
          </a-col>
        </a-col>
        <!-- <a-col :md="24" :xs="24" style="margin-bottom: 12px">
          <a-col :span="3" class="left-content">上传图片: </a-col>
          <a-col :span="21">
            <a-upload
              multiple
              list-type="picture-card"
              class="avatar-uploader"
              style="width: 680px;"
              :file-list="fileList"
              :customRequest="info => customRequest(info)"
              @preview="handlePreview"
              :remove="info => handleRemove(info)"
              :beforeUpload="beforeUpload"
              accept="image/jpeg,image/jpg,image/png"
              v-decorator="['imgs']">
              <div class="upload-box" v-if="fileList.length < 9">
                <a-icon :type="loading ? 'loading' : 'plus'"/>
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
              <img alt="example" style="width: 100%" :src="previewImage"/>
            </a-modal>
          </a-col>
        </a-col> -->
      </a-card>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="confirmBatch">批量确认</a-button>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'MaterialConfirm',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        previewVisible: false,
        loading: false,
        previewImage: '',
        fileList: [], // 上传图片
        file_info_list: [],
        attachIds: [],
        dataList: [],
        id: ''
      }
    },
    methods: {
      show(id) {
        this.id = id 
        this.visible = true
        this.getDetail()
      },
      // 获取材料明细
      getDetail() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.materialConfirmInfo.getBillMasterDetail,
          params: { billMasterId: this.id }
        }).then((res) =>{
          const list = [ ...res ]
          this.dataList = list
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      confirm(item) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.materialConfirmInfo.allConfirm,
          params: { 
            billDetailId:item.BillDetailId,
            checkNum: item.SaleNum,
            remark: item.remark || ''
          }
        }).then((res) =>{
          this.getDetail()
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      confirmBatch() {
        const list = []
        this.dataList.forEach(item=> {
          list.push({
            billDetailId: item.BillDetailId,
            checkNum: item.SaleNum,
            remark: item.remark,
          })
        })
        this.confirmLoading = true
        this.$post({
          url: this.$api.basicData.materialConfirmInfo.allConfirmBatch,
          data: list
        }).then((res) =>{
          this.getDetail()
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
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
        this.visible = false
        this.id = ''
      }
    }

  }
</script>

<style lang="scss" scoped>
.left-content {
  font-size: 16px;
  height: 32px;
  line-height: 32px;
}
</style>