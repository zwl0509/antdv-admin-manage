<template>
  <div>
    <!-- 客户基本信息 -->
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8" :xs="24">
          <a-form-item v-if="type == 'add' || info.infoShow" label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入客户名称"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['customerName', { rules: [{ required: true, message: '客户基础信息,请输入客户名称!'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
          <a-form-item v-else label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入客户名称"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['customerShowName', { rules: [{ required: true, message: '客户基础信息,请输入客户名称!'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择性别" :disabled="type == 'detail'" v-decorator="['gender',{ rules : [{ required: true, message: '客户基础信息,请选择性别!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.genderType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24" v-if="(type !== 'edit' && type !== 'detail') || info.infoShow">
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入手机号"
              autocomplete="off"
              v-decorator="['mobileNumber', { rules: [{ required: true , message: '客户基础信息,请输入手机号!'}, { validator: (r, v, fun) => regularCheck('mobilePhone', v, fun,'手机号格式错误') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="客户类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择客户类型" :disabled="type == 'detail'" v-decorator="['relationship',{ rules : [{ required: true, message: '客户基础信息,请选择客户类型!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.relationshipType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="了解公司途径" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择了解公司途径" :disabled="type == 'detail'" v-decorator="['knowCoWay',{ rules : [{ required: true, message: '客户基础信息,请选择了解公司途径!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.knowCoWayType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24" v-if="type == 'add'|| type == 'apply'">
          <a-form-item label="是否自留" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['isSelf',{ valuePropName: 'checked', initialValue: true }]"/>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="8" :xs="24">
          <a-form-item label="门店" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-tooltip v-if="orgName" :title="orgName">
              <div v-if="orgName" class="dispatch-user">{{ orgName || '' }}</div>
            </a-tooltip>
            <a-button type="primary" :disabled="type == 'detail'" @click="selectOrg">选择门店</a-button>
          </a-form-item>
        </a-col> -->
        <a-col :md="8" :xs="24">
          <a-form-item label="装修风格" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择装修风格" :disabled="type == 'detail'" v-decorator="['decorationStyle',{ rules : [{ required: true, message: '客户基础信息,请选择装修风格!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.decorationStyleType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-cascader
              :disabled="type == 'detail' || type == 'edit'"
              :options="addressList"
              :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
              placeholder="装修地址"
              :show-search="{ filterOption }"
              @change="handleAddress"
              v-decorator="['areaIds']"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24" class="area-select">
          <a-form-item label="装修地址(小区)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              placeholder="装修地址(小区)"
              showSearch
              :filterOption="filterOption"
              :getPopupContainer=" triggerNode => { return triggerNode.parentNode }"
              @search="search"
              :filter-option="false"
              :disabled="type == 'detail' || isAddress || type == 'edit'"
              :dropdownStyle="{maxHeight: '384px',overflow: 'hidden'}"
              :not-found-content="selectLoading ? undefined : null"
              @change="getAreaInfo"
              v-decorator="['areaId']" >
              <a-spin v-if="selectLoading" slot="notFoundContent" size="small">
              </a-spin>
              <a-select-option v-for="(item, index) in areaList" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
              <a-select-option v-if="totalPage > 1" value="0" class="select-page">
                <template>
                  <a-row :grabbed="48">
                    <a-col
                      :md="8"
                      :xs="24"
                      class="page-btn"
                      style="text-align: center"
                      @click.stop="prev"
                      :style="{ pointerEvents: currentPage<=totalPage?'auto':'none', cursor: (currentPage>1?'pointer':'not-allowed'), color: (currentPage>1?'#585A62':'#ccc')}">
                      上一页
                    </a-col>
                    <a-col @click.stop="()=>{}" class="page-nav" :md="8" :xs="24" style="text-align:center">{{ currentPage }}/{{ totalPage }}</a-col>
                    <a-col
                      :md="8"
                      :xs="24"
                      class="page-btn"
                      style="text-align: center"
                      @click.stop="next"
                      :style="{ pointerEvents: currentPage<totalPage?'auto':'none', cursor: (currentPage<totalPage?'pointer':'not-allowed'),color: (currentPage<totalPage?'#585A62':'#ccc')}">
                      下一页
                    </a-col>
                  </a-row>
                </template>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="16" :xs="24" v-if="(type !== 'edit' && type !== 'detail') || info.infoShow">
          <a-form-item label="详情地址" :labelCol="{ xs: { span: 24 }, sm: { span: 4 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 }}">
            <a-input
              placeholder="请输入详情地址"
              autocomplete="off"
              :disabled="type == 'detail'"
              @input="fullAddressChange"
              v-decorator="['fullAddress', { rules: [{ required: true, message: '客户基础信息,详情地址!' }, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 300) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="建筑面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入建筑面积(m²)"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['buildingArea',{ rules: [{ required: true, message: '客户基础信息,请输入建筑面积(m²)!'},{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [9,2], '建筑面积格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="16" :xs="24" v-if="(type !== 'edit' && type !== 'detail') || info.infoShow">
          <a-form-item label="完整地址" :labelCol="{ xs: { span: 24 }, sm: { span: 4 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 }}" >
            <a-input
              placeholder="请输入完整地址"
              autocomplete="off"
              disabled
              v-decorator="['finalAddress', { rules: [{message: '客户基础信息,请输入客户名称!'}, { validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="实用面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入实用面积(m²)"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['actualArea',{ rules: [{ required: true, message: '客户基础信息,请输入实用面积(m²)!'}, { validator: (r,v,f) => regularCheck2(r, v, f, 'number', [9,2], '实用面积格式校验失败') }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="房型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear placeholder="请选择房型" :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" :disabled="type == 'detail'" v-decorator="['houseType',{ rules : [{ required: true, message: '客户基础信息,请选择房型!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.houseType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="户型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择户型" :disabled="type == 'detail'" v-decorator="['roomType',{ rules : [{ required: true, message: '客户基础信息,请选择户型!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.roomType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="楼层" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="number"
              placeholder="请输入楼层"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['floor', { rules: [{ required: true, message: '客户基础信息,请输入楼层!'},{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 20) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24" v-if="(type !== 'edit' && type !== 'detail') || info.infoShow">
          <a-form-item label="信息来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择信息来源" @change="infoSource" :disabled="type == 'detail'" v-decorator="['infoSource',{ rules : [{ required: true, message: '客户基础信息,请选择信息来源!'}]}]">
              <a-select-option
                v-for="(item, index) in codeType.infoSourceType"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="回单人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入回单人"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['replyOrderStaff', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 36,'回单人') }] }]"/>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="8" :xs="24">
          <a-form-item label="客户定位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-tooltip v-if="locationAddress" :title="locationAddress">
              <div @click="selectPosition" v-if="locationAddress" class="dispatch-user">{{ locationAddress || '' }}</div>
            </a-tooltip>
          </a-form-item>
        </a-col> -->
        <a-col :md="8" :xs="24">
          <a-form-item label="是否期房客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch
              checked-children="是"
              disabled
              v-decorator="['future',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否有电梯" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :disabled="type == 'detail'"
              v-decorator="['elevator',{ valuePropName: 'checked', initialValue: false }]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :xs="24" v-if="type == 'apply'">
          <a-form-item label="多房申请原因" class="col-1-9">
            <a-textarea
              :rows="3"
              placeholder="请输入多房申请原因"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['reason', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="备注信息" class="col-1-9">
            <a-textarea
              :rows="3"
              placeholder="请输入备注信息"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['remark', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 选择门店 -->
    <!-- <transfer-customer ref="TransferCustomer" @getOrg="getOrg"></transfer-customer> -->
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import { defaultErrorMessage, checkErrors, filedIsNull, maxLenValidator, numberValidator, regularCheck,regularCheck2 } from '@/utils/common'
  // import TransferCustomer from './TransferCustomer'

  export default {
    name: 'BaseInfo',
    components: {
      // TransferCustomer
    },
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        info: {},
        form: this.$form.createForm(this),
        addressForm: this.$form.createForm(this),
        codeType: {},
        id: '',
        addressList: [], // 市区信息
        areaList: [], // 小区信息
        isAddress: true, // 是否禁用小区
        classifyId: '',
        currentPage: 1,
        pageSize: 20,
        totalPage: 1,
        selectLoading: false,
        queryParam: {}, // 小区查询条件
        areaNamePath: '', // 完整地址拼接
        areaName: '', // 小区名字
        orgName: '',
        orgId: '',
        mobileNumber: '', // 手机号
        locationAddress: '', // 定位名称
        latitude: null , // 纬度
        longitude: null , // 经度
      }
    },
    methods: {
      maxLenValidator, numberValidator,regularCheck,regularCheck2,
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      // 获取code数据
      getCodeList(codeType,areaName) {
        this.codeType = codeType
        this.areaName = areaName
        // this.orgId = this.$store.state.user.info.orgId || ''
        // this.orgName = this.$store.state.user.info.orgName || ''
        this.getAddressList()
      },
      // 获取市区信息
      getAddressList() {
        this.$post({
          url: this.$api.basicData.areaInfo.getListPage,
        }).then(res => {
          this.addressList = this.updataList(res[0].children)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false})
      },
      // 获取小区接口
      handleAddress(e) {
        if (e && e.length) {
          // 调用小区列表接口 并清空选输入内容
          this.isAddress = false
          this.$nextTick(() => {
            this.classifyId = e[e.length - 1]
            this.getResidenceList(e[e.length - 1])
            this.form.setFieldsValue({
              areaId: undefined
            })
          })
        } else {
          // 清空小区列表数据
          this.isAddress = true
          this.$nextTick(() => {
            this.areaList = []
            this.form.setFieldsValue({
              areaId: undefined
            })
          })
        }
      },
      // 填充完整地址
      getAreaInfo(e) {
        const data = this.areaList.find(el=> el.id === e)
        if(data.areaNamePath){
          this.areaNamePath = data.areaNamePath.split('-').join('')
          this.form.setFieldsValue({
            finalAddress: data.areaNamePath.split('-').join('')
          })
        }
      },
      // 填充完整地址
      fullAddressChange(e) {
        const areaName = this.areaName && this.areaName.split('-').join('')
        this.form.setFieldsValue({
          finalAddress:(this.areaNamePath || areaName || '')  + e.target.value
        })
      },
      // 获取门店信息
      getOrg(data) {
        this.orgName = data.orgName
        this.orgId = data.orgId
      },
      // 小区表格
      getResidenceList(id) {
        this.selectLoading = true
        const data  = {
          classifyId: id || this.classifyId,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }
        this.$post({
          url: this.$api.basicData.areaInfo.getResidenceList,
          data: Object.assign(data, this.queryParam),
        }).then((res)=>{
          this.areaList = res.rows || []
          this.totalPage = Math.ceil(res.total / this.pageSize)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.selectLoading = false})
      },
      // 小区详情
      getResidenceDetail(id) {
        this.$get({
          url: this.$api.basicData.areaInfo.getDetail,
          params: { id }
        })
          .then(res => {
            const data = { ...res }
            const item = this.areaList.find(ele=> data.id === ele.id)
            if(!item) {
              this.areaList.unshift(data)
            }
          }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false})
      },
      // 装修小区 上一页
      prev () {
        if (this.currentPage > 1) {
          this.currentPage--
          this.getResidenceList()
        }
      },
      // 装修小区 上一页
      next () {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
          this.getResidenceList()
        }
      },
      // 装修小区 模糊查询
      search (val) {
        this.queryParam.name = val
        this.currentPage = 1
        this.pageSize = 20
        this.getResidenceList()
      },
      // 选择门店
      selectOrg() {
        this.$refs.TransferCustomer.show('',1)
      },
      selectPosition() {
        const mapPosition = [this.longitude,this.latitude]
        this.$refs.Map.show(mapPosition)
      },
      // 带入回单人
      infoSource(e) {
        if(e == '1044-01' || e == '1044-04' || e == '1044-05') {
          this.form.setFieldsValue({
            replyOrderStaff: this.$store.state.user.info.realName ||''
          })
        } else {
          this.form.setFieldsValue({
            replyOrderStaff: ''
          })
        }
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
      getData() {
        const { form: { validateFields } } = this
        return new Promise((resolve,reject)=> {
          validateFields((errors, values) => {
            if(!errors) {
              values.id = this.id
              values.storeId = this.orgId
              values.customerName = values.customerShowName && values.customerShowName !== this.info.customerShowName 
              ? values.customerShowName : values.customerName || this.info.customerName
              values.fullAddress = values.fullAddress ? values.fullAddress : this.info.fullAddress
              values.finalAddress = values.finalAddress ? values.finalAddress : this.info.finalAddress
              values.infoSource = values.infoSource ? values.infoSource : this.info.infoSource
              // values.latitude = this.latitude
              // values.longitude = this.longitude
              // values.locationAddress = this.locationAddress
              values.mobileNumber = this.type !== 'add' ? this.mobileNumber : values.mobileNumber
              resolve(values)
            } else {
              const keys = ['customerName','gender','mobileNumber','relationship','marketingType',
                'replyOrderStaff','fullAddress','recommender','buildingArea','actualArea',
                'houseType','roomType','floor','decorationStyle','infoSource','knowCoWay']
              reject(checkErrors(keys, errors))
            }
          })
        })
      },
      async setData(info) {
        if (info) {
          this.info = info 
          for (const key in info) {
            if (filedIsNull(info[key])) {
              delete info[key]
            }
          }
          this.id = info.id
          // this.orgId = info.storeId
          // this.orgName = info.storeName
          this.mobileNumber = info.mobileNumber
          // this.latitude = info.latitude // 纬度
          // this.longitude = info.longitude // 经度
          // this.locationAddress = info.locationAddress // map地址
          if(info.areaId) {
            this.isAddress = false
            this.classifyId = info.areaIds[info.areaIds.length -1]
            await this.getResidenceList(info.areaIds[info.areaIds.length -1])
            await this.getResidenceDetail(info.areaId)
          } else {
            this.isAddress = true
          }
          const { form: { setFieldsValue } } = this
          this.$nextTick(() => {
            setFieldsValue(pick(Object.assign({}, info), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      clearInput() {
        this.id = ''
        this.isAddress = true
        this.classifyId = ''
        this.areaNamePath = ''
        this.currentPage = 1
        this.pageSize = 20
        this.addressList = []
        this.areaList = []
        this.orgName = ''
        this.orgId = ''
        // this.latitude = null
        // this.longitude = null
        // this.locationAddress = ''
        this.mobileNumber = ''
        this.areaName = ''
        this.info = {}
        delete this.queryParam.name
        this.form.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .col-1-9{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
      // line-height: 20px;
      label{
        white-space: break-spaces;
      }
    }
    .ant-form-item-control-wrapper{
      width: 88.888888%;
      float: left;
    }
  }
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    padding: 0;
    // background: red !important;
    color: #585A62;
  }
  ::v-deep .area-select .ant-select-dropdown-menu {
    padding-bottom: 40px;
    max-height: 384px;
  }
  ::v-deep .select-page{
    background: white;
    position:absolute;
    bottom: 0;
    width: 100%;
    pointer-events: none;
    padding: 0;
    .page-btn{
      padding: 10px 0;
    }
    .page-nav{
      padding: 10px 0;
    }
  }
  ::v-deep .select-page.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled){
    background: white;
  }
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 10px;
    max-width: 245px;
    height: 32px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
  }
</style>