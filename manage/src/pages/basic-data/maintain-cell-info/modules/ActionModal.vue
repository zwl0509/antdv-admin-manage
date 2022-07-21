<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="900"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-alert type="error" style="margin-bottom: 12px" v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="所属地区" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-cascader
                :options="addressList"
                :display-render="displayRender"
                placeholder="请选择所属地区"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                v-decorator="['parentIdsList']"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="小区名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入小区名称"
                autocomplete="off"
                :maxLength="256"
                v-decorator="['name', {rules: [{required: true, message: '请输入小区名称'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="小区定位" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
              <a-tooltip v-if="locationAddress" :title="locationAddress">
                <div v-if="locationAddress" class="dispatch-user">{{ locationAddress || '' }}</div>
              </a-tooltip>
              <a-button type="primary" @click="selectPosition">{{ locationAddress? '重新定位': '定位' }}</a-button>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}" >
              <a-textarea
                :rows="4"
                placeholder="请输入备注"
                autocomplete="off"
                :maxLength="500"
                v-decorator="['remark', {rules: [{message: '请输入备注'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <!-- 定位 -->
    <Map ref="Map" @updateLocation="updateLocation"></Map>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import debounce from 'lodash.debounce'
  import { defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator } from '@/utils/common'
  import labels from '@/utils/labels'
  import Map from './Map.vue'

  export default {
    components: { Map },
    data () {
      this.search = debounce(this.search, 800)
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
        form: this.$form.createForm(this),
        codeList: [],
        // 查询参数
        queryParam: {},
        currentPage: 1,
        pageSize: 6,
        totalPage: 1,
        selectLoading: false,
        errorMessage: '',
        isError: false,
        parentArea:'',
        parentId:'',
        parentIds:'',
        community: 0,
        addressList: [],
        locationAddress: '',
        locationLat: '',
        locationLon: '',
      }
    },
    created() {
      this.getCodeList()
    },
    methods: {
      maxLenValidator,
      numberValidator,
      getCodeList () {
        this.getAddressList()
      },
      getAddressList() {
        this.$post({
          url: this.$api.basicData.areaInfo.getListPage,
        }).then(res => {
          this.addressList = this.updataList(res[0].children)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false})
      },
      displayRender({ labels }) {
        return labels[labels.length - 1]
      },
      updataList(list){
        if(list.length){
          list.forEach((item) => {
            if (item.children.length == 0) {
              delete item.children
            }else {
              this.updataList(item.children)
            }
          })
          return list
        }
      },
      add (row, community = 0) {
        const { form: { setFieldsValue } } = this
        this.community = community
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        this.parentArea = row.parentArea || '全国'
        this.parentId = row.parentId
        this.getCodeList()
        const data = {
          parentIdsList: row.parentIdsList
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      edit (record, community = 0) {
        this.community = community
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getAddressList()
        this.$get({
          url: this.$api.basicData.areaInfo.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.parentArea = data.parentArea || '全国'
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.locationAddress = data.orgAddr
            this.locationLat= data.latitude // 纬度
            this.locationLon = data.longitude // 经度
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      selectPosition() {
        const locationInfo = [this.locationLon,this.locationLat]
        this.$refs.Map.show(locationInfo,this.parentArea,this.locationAddress)
      },
      // 位置信息
      updateLocation(info) {
        this.locationAddress = info.orgAddr
        this.locationLat= info.lat // 纬度
        this.locationLon = info.lon // 经度
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.community = this.community
            values.parentId = values.parentIdsList[values.parentIdsList.length - 1]
            values.level = 0
            values.latitude = this.locationLat
            values.longitude = this.locationLon
            values.orgAddr = this.locationAddress
            this.$post({
              url: this.$api.basicData.areaInfo.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message || ''
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
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.addressList = []
        this.locationAddress = ''
        this.locationLat = ''
        this.locationLon = ''
      },
      prev () {
        if (this.currentPage > 1) {
          this.currentPage--
          this.getCodeList()
        }
      },
      next () {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
          this.getCodeList()
        }
      },
      search (val) {
        this.queryParam.name = val
        this.getCodeList()
      }
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
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
</style>
