<template>
  <div>
    <!-- 原始公海池 -->
    <list-page
      ref="listPage"
      class="small-table"
      columnsName="primitive_common"
      :showActionBtn="true"
      :columns="columns"
      :initColumns="columnX"
      :request-url="requestUrl"
      request-type="GET"
      @resetParams="resetSearchForm"
      :query-params="searchParams"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: scroll_x }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="小区名称">
            <a-input v-model="queryParam.areaName" autocomplete="off" placeholder="请输入小区名称" :max-length="11"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户阶段">
            <a-select placeholder="请选择客户阶段" v-model="queryParam.type">
              <a-select-option v-for="(item, index) in codeType.stageType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户类型">
            <a-select placeholder="请选择客户类型" allowClear v-model="queryParam.relationship">
              <a-select-option v-for="(item, index) in codeType.relationshipType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否有人跟踪">
            <a-select placeholder="请选择" allowClear v-model="queryParam.blocked">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="了解公司途径">
            <a-select placeholder="请选择了解公司途径" allowClear v-model="queryParam.knowCoWay">
              <a-select-option v-for="(item, index) in codeType.knowCoWayType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" v-if="actionAuth.includes('PrimitiveCommon.Create')" @click="$refs.createModal.add('1033-40')">新建</a-button>
        <a-button v-if="selectedRowKeys.length && actionAuth.includes('PrimitiveCommon.BatchAllocation')" type="primary" icon="edit" @click="$refs.BatchAllocation.show(selectedRowKeys,'1033-10',1)">批量分配</a-button>
        <a-popconfirm v-if="selectedRowKeys.length" title="是否要批量删除选中数据？" @confirm="handleSub(selectedRowKeys)">
          <a-button type="primary" v-if="actionAuth.includes('PrimitiveCommon.Delete')" icon="delete">批量删除</a-button>
        </a-popconfirm>
        <a-button type="primary" class="download" icon="download" v-if="actionAuth.includes('PrimitiveCommon.Download')" @click="downloadTemplate">下载模版</a-button>
        <a-button type="primary" class="download" icon="cloud-download" v-if="actionAuth.includes('PrimitiveCommon.Import')" @click="uploadData">导入数据</a-button>
        <a-button type="primary" class="download" icon="download" v-if="actionAuth.includes('PrimitiveCommon.Export')" @click="downloadData">导出数据</a-button>
        <a-button type="primary" class="download" icon="eye" v-if="actionAuth.includes('PrimitiveCommon.LogInfo')" @click="$refs.ImportLogInfo.show('1066-10')">导入日志信息</a-button>
        <a-button type="primary" class="download" icon="eye" v-if="actionAuth.includes('PrimitiveCommon.NewLog')" @click="$refs.CustomerNewLog.show()">客户新增日志</a-button>
        <a-button type="primary" class="download" icon="cloud-download" v-if="actionAuth.includes('PrimitiveCommon.Import')" @click="uploadInfo">导入其他部门</a-button>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text ? '是' : '否' }}</span>
      </template>
      <span slot="infoShow" slot-scope="text,record">
        <span>{{ record.infoShow ? record.customerName : record.customerNameHide }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="!record.multiHouseStatus">
          <template v-if="actionAuth.includes('PrimitiveCommon.Modify')">
            <a @click="$refs.createModal.edit(record,'edit',record.type)">编辑</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('PrimitiveCommon.CustomerTracking')">
            <a @click="$refs.CustomerTracking.show(record, queryParam.type, actionAuth.includes('PrimitiveCommon.CreateCustomerTracking'))">客户跟踪</a>
          </template>
          <template v-if="!record.blocked">
            <a-divider v-if="actionAuth.includes('PrimitiveCommon.Allocation')" type="vertical"/>
            <a @click="$refs.BatchAllocation.show([record.id],'1033-40',2)">分配</a>
            <a-divider v-if="actionAuth.includes('PrimitiveCommon.Delete')" type="vertical"/>
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub([record.id])">
              <a class="ant-btn-background-ghost ant-btn-danger" v-if="actionAuth.includes('PrimitiveCommon.Delete')">删除</a>
            </a-popconfirm>
          </template>
        </template>
        <template v-else>
          <template v-if="actionAuth.includes('PrimitiveCommon.Modify')">
            <a @click="$refs.createModal.edit(record,'detail',queryParam.type)">详情</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a class="ant-btn-background-ghost ant-btn-danger">{{ record.multiHouseStatus == 1 ? '多房(审核中)': '多房(已驳回)' }}</a>
          </template>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
    <!-- 批量分配 -->
    <batch-allocation ref="BatchAllocation" @ok="handleOk"></batch-allocation>
    <!-- 客户跟踪 -->
    <customer-tracking ref="CustomerTracking" @ok="handleOk"></customer-tracking>
    <!-- 导入数据 -->
    <upload-modal ref="uploadModal" @ok="handleOk"></upload-modal>
    <!-- 导入日志信息 -->
    <import-log-info ref="ImportLogInfo" @ok="handleOk"></import-log-info>
    <!-- 新增客户日志 -->
    <customer-new-log ref="CustomerNewLog" @ok="handleOk"></customer-new-log>
    <!-- 导入部门信息 -->
    <import-department-info ref="ImportDepartmentInfo" @ok="handleOk"></import-department-info>
  </div>
</template>

<script>
  import ImportDepartmentInfo from '@/pages/customer-manage/primitive-common-sea-pool/modules/ImportDepartmentInfo'
  const columnX = [
    {
      title: '序号',
      width: 80,
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '客户阶段',
      dataIndex: 'typeName'
    },
    {
      title: '客户名称',
      scopedSlots: { customRender: 'infoShow' }
    },
    {
      title: '性别',
      dataIndex: 'genderName'
    },
    {
      title: '手机号',
      dataIndex: 'mobileNumber'
    },

    {
      title: '客户类型',
      dataIndex: 'relationshipName'
    },
    // {
    //   title: '门店',
    //   width: 150,
    //   dataIndex: 'storeName',
    //   scopedSlots: { customRender: 'ellipsis'}
    // },
    {
      title: '回单人',
      dataIndex: 'replyOrderStaff'
    },
    {
      title: '装修风格',
      dataIndex: 'decorationStyleName'
    },
    // {
    //   title: '装修地址完整地址',
    //   dataIndex: 'finalAddress',
    //   width: 200,
    //   scopedSlots: { customRender: 'ellipsis'}
    // },
    {
      title: '建筑面积',
      dataIndex: 'buildingArea'
    },
    {
      title: '实用面积',
      dataIndex: 'actualArea'
    },
    {
      title: '房型',
      dataIndex: 'houseTypeName'
    },
    {
      title: '户型',
      dataIndex: 'roomTypeName'
    },
    {
      title: '楼层',
      dataIndex: 'floor'
    },
    {
      title: '客户了解信息',
      dataIndex: 'knownInfoName'
    },
    {
      title: '了解公司途径',
      dataIndex: 'knowCoWayName'
    },
    {
      title: '客户重点关注',
      dataIndex: 'focusOnName'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import CustomerTracking from '../high-sea-pool-customer/modules/CustomerTracking'
  import UploadModal from '../high-sea-pool-customer/modules/UploadModal'
  import BatchAllocation from './modules/BatchAllocation'
  import ImportLogInfo from './modules/ImportLogInfo'
  import CustomerNewLog from '@/pages/customer-manage/primitive-common-sea-pool/modules/CustomerNewLog'
  export default {
    name: 'TableList',
    components: {
      ImportDepartmentInfo,
      CustomerNewLog,
      ImportLogInfo,
      ListPage,
      Ellipsis,
      ActionModal,
      CustomerTracking,
      UploadModal,
      BatchAllocation,
    },
    data () {
      return {
        columnX,
        loading: false,
        requestUrl: this.$api.customInfo.customerCommon.getListPage,
        form: this.$form.createForm(this),
        // 查询参数
        queryParam: {
          allData: true,
          type: '1033-10'
        },
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
              this.selectedRows = []
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps:(record)=> {
              return {
                props: {
                  disabled: record.blocked,
                },
              }
            }
          },
        },
        selectedRowKeys: [],
        selectedRows: [],
        // 表头
        columns: columnX,
        scroll_x: 2500,
        actionAuth: [],
        codeType: {
          houseType: [],
          roomType:[],
          genderType: [],
          infoSourceType: [],
          knowCoWayType: [],
          marketingType: [],
          relationshipType: [],
          decorationStyleType: [],
          focusOnType: [],
          knownInfoType: [],
          infoChannelType:[],
          trackType: [],
          recordType: [],
          stageType: [],
          importType: []
        },
        isStatus: true,
      }
    },
    created () {
      this.$store.dispatch('GetActionAuth').then(res => {
        const arr = []
        res.forEach(item => {
          arr.push(item.key)
        })
        this.actionAuth = arr
      })
    },
    methods: {
      searchParams () {
        if (this.queryParam.date) {
          this.queryParam.beginDateForMeasure = moment(this.queryParam.date[0]).format('YYYY-MM-DD')
          this.queryParam.endDateForMeasure = moment(this.queryParam.date[1]).format('YYYY-MM-DD')
        }
        if (this.queryParam.decorationDate) {
          this.queryParam.beginDateForDecoration = moment(this.queryParam.decorationDate[0]).format('YYYY-MM-DD')
          this.queryParam.endDateForDecoration = moment(this.queryParam.decorationDate[1]).format('YYYY-MM-DD')
        }
        if (this.queryParam.createDate) {
          this.queryParam.beginDateForCreated = moment(this.queryParam.createDate[0]).format('YYYY-MM-DD')
          this.queryParam.endDateForCreated = moment(this.queryParam.createDate[1]).format('YYYY-MM-DD')
        }
        delete this.queryParam.date
        delete this.queryParam.decorationDate
        delete this.queryParam.createDate
        return this.queryParam
      },
      // 获取自定义列
      getColumnX () {
        this.$get({
          url: this.$api.columnXManage.getColumnX,
          params: { type: 'primitive_common'}
        }).then((res)=>{
          const list = res?.columnX || []
          const new_columns = []
          list?.forEach(item => {
            if(item.checked){
              new_columns.push(item)
            }
          })
          this.columns = new_columns && new_columns.length ? new_columns : columnX
          let scrollX = 0
          this.columns.forEach(el=> {
            if(el.width){
              scrollX += el.width
            } else {
              scrollX += 120
            }
          })
          this.scroll_x = scrollX
        }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
          .finally(() => {this.confirmLoading = false })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      handleSub (ids) {
        this.loading = true
        this.$post({
          url: this.$api.customInfo.highSeaPoolCustomer.delete,
          data: ids,
          needResponse: true
        }).then(res => {
          this.$notification.success({
            message: labels.DELETE_SUCCESS,
            description: res.message || ''
          })
          this.handleOk()
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      getCodeList() {
        const params = {
          typeList: ['1003','1022','1023','1025','1026','1027','1028','1029','1030','1031','1037','1038','1044','1033','1066']
        }
        this.$getCodesList(params, res => {
          this.codeType.genderType = res['1003'] || [] // 性别
          this.codeType.relationshipType = res['1022'] || [] // 客户类型
          this.codeType.marketingType = res['1023'] || [] // 营销类型
          this.codeType.houseType = res['1025'] || []  // 房型
          this.codeType.roomType = res['1026'] || [] // 户型
          this.codeType.decorationStyleType = res['1027'] || []  // 装修风格
          this.codeType.infoChannelType = res['1028'] || [] // 信息渠道
          this.codeType.knowCoWayType = res['1029'] || []  // 了解公司途径
          this.codeType.knownInfoType = res['1030'] || []  // 客户了解信息
          this.codeType.focusOnType = res['1031'] || []  // 客户重点关注
          this.codeType.trackType = res['1037'] || []  // 跟踪类型
          this.codeType.recordType = res['1038'] || []  // 记录类型
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
          this.codeType.stageType = res['1033'] || []  // 客户阶段
          this.codeType.importType = res['1066'] || [] //导入日志类型
        })
      },
      handleOk () {
        this.selectedRowKeys = []
        this.$refs.listPage.updateSelect([],[])
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
          type: '1033-10',
          allData: true,
        }
      },
      // 上传材料数据
      uploadData () {
        this.$refs.uploadModal.show('1033-40','1066-10')
      },
      uploadInfo () {
        this.$refs.ImportDepartmentInfo.show('1033-40','1066-10')
      },
      // 下载数据
      downloadData () {
        window.open(process.env.VUE_APP_API_BASE_URL + this.$api.customInfo.highSeaPoolCustomer.export +`?type=${this.queryParam.type || ''}&customerName=${this.queryParam.customerName || ''}&knowCoWay=${this.queryParam.knowCoWay || ''}&mobileNumber=${this.queryParam.mobileNumber || ''}&relationship=${this.queryParam.relationship || ''}&blocked=${(this.queryParam.blocked === 0 ? 0 : this.queryParam.blocked ? 1 : '') }&currentId=${this.$store.state.user.info.id}&allData=true&pageSize=${0}&currentPage=${0}`, '_self')
      },
      // 下载模版
      downloadTemplate(){
        const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'customer-template.xlsx'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          '客户模版'
        )
        document.body.appendChild(link)
        link.click()
      },
      websocketonmessage(e) {
        const redata = JSON.parse(e.data)
        console.log(redata)
      }

    },
    activated() {
      if(this.$refs.listPage) {
        this.selectedRowKeys= []
        this.$refs.listPage.updateSelect([],[])
      }
      this.getColumnX()
      this.getCodeList()
    },
  }
</script>
<style lang="scss" scoped>
  .custom-tree {
    ::v-deep .ant-tree-node-content-wrapper {
      display: inline-block;
      width: calc(100% - 24px);
    }

    ::v-deep .ant-tree-title {
      display: flex;
      justify-content: space-between;
    }
  }

  .borderLeft {
    border-left: solid 1px #eee;
    padding-left: 20px !important;
  }
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>