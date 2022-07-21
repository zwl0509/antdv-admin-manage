<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: 10000 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
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
          <a-form-item label="营销类型">
            <a-select placeholder="请选择营销类型" allowClear v-model="queryParam.marketingType">
              <a-select-option v-for="(item, index) in codeType.marketingType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否意向客户">
            <a-select placeholder="请选择是否意向客户" allowClear v-model="queryParam.isIntended">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否飞单">
            <a-select placeholder="请选择是否飞单" allowClear v-model="queryParam.lost">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否期房客户">
            <a-select placeholder="请选择期房客户" allowClear v-model="queryParam.future">
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
        <a-col :md="6" :sm="24">
          <a-form-item label="预计量房日期">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="预计装修日期">
            <a-range-picker v-model="queryParam.decorationDate" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="创建日期">
            <a-range-picker v-model="queryParam.createDate" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
        <a-button type="primary" icon="download" @click="downloadTemplate">下载模版</a-button>
        <a-button type="primary" class="download" icon="cloud-download" @click="uploadData">导入数据</a-button>
        <a-button type="primary" class="download" icon="cloud-download" @click="downloadData">导出数据</a-button>
        <a-button v-if="selectedRowKeys.length" type="primary" icon="edit" @click="$refs.ReplacePersonnel.show(selectedRowKeys,3)">转为意向客户</a-button>
        <a-button v-if="selectedRowKeys.length" type="primary" icon="edit" @click="$refs.ReplacePersonnel.show(selectedRowKeys,0)">更换业务员</a-button>
        <a-popconfirm v-if="selectedRowKeys.length" title="是否要删除选中数据？" @confirm="handleSub(selectedRowKeys)">
          <a-button type="danger" icon="delete">批量删除</a-button>
        </a-popconfirm>
      </template>
      <template slot="iconSwitch" slot-scope="text">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="!!text" />
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text ? '是' : '否' }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.type == '1033-20'">
          <a @click="$refs.createModal.edit(record,'edit')">编辑</a>
          <a-divider type="vertical"/>
          <a @click="$refs.FlightOrderApply.show(record)">飞单申请</a>
          <a-divider type="vertical"/>
          <a @click="$refs.ReplacePersonnel.show([record.id],3)">转为意向客户</a>
          <br>
          <a @click="$refs.ReplacePersonnel.show([record.id],0)">更换业务员</a>
          <a-divider type="vertical"/>
          <a @click="$refs.EditPhone.show(record.id)">修改手机号</a>
          <a-divider type="vertical"/>
          <a @click="$refs.CustomerTracking.show(record.id)">客户跟踪</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub([record.id])">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
        <template v-else>
          <a @click="$refs.createModal.edit(record,'detail')">详情</a>
          <a-divider type="vertical"/>
          <a @click="$refs.CustomerTracking.show(record.id)">客户跟踪</a>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
    <edit-phone ref="EditPhone" @ok="handleOk"></edit-phone>
    <replace-personnel ref="ReplacePersonnel" @ok="handleOk"></replace-personnel>
    <customer-tracking ref="CustomerTracking"></customer-tracking>
    <flight-order-apply ref="FlightOrderApply" @ok="handleOk"></flight-order-apply>
    <upload-modal ref="uploadModal" @ok="handleOk"></upload-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'

  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import EditPhone from '../high-sea-pool-customer/modules/EditPhone'
  import ReplacePersonnel from '../high-sea-pool-customer/modules/ReplacePersonnel'
  import CustomerTracking from '../high-sea-pool-customer/modules/CustomerTracking'
  import FlightOrderApply from './modules/FlightOrderApply'
  import UploadModal from './modules/UploadModal'
  export default {
    name: 'TableList',
    components: {
      ListPage,
      Ellipsis,
      ActionModal,
      EditPhone,
      ReplacePersonnel,
      CustomerTracking,
      FlightOrderApply,
      UploadModal
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.customInfo.resourceCustomer.getListPage,
        // 查询参数
        queryParam: {},
        form: this.$form.createForm(this),
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps:(record)=> {
              return {
                props: {
                  disabled: record.type !== '1033-20',
                },
              }
            }
          },
        },
        selectedRowKeys: [],
        selectedRows: [],
        // 表头
        columns: [
          {
            title: '序号',
            width: 80,
            scopedSlots: { customRender: 'serial' }
          },
          // {
          //   title: '客户编码',
          //   dataIndex: 'customerCode'
          // },
          {
            title: '客户名称',
            dataIndex: 'customerName',
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
            title: '是否意向客户',
            dataIndex: 'isIntendedCustomer',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '未跟踪天数',
            dataIndex: 'daysNotTracked'
          },
          {
            title: '客户类型',
            dataIndex: 'relationshipName'
          },
          {
            title: '营销类型',
            dataIndex: 'marketingTypeName'
          },
          {
            title: '客户阶段',
            dataIndex: 'typeName'
          },
          {
            title: '成功率',
            dataIndex: 'successRate'
          },

          {
            title: '资源提供人',
            dataIndex: 'recommender'
          },
          {
            title: '建筑面积',
            dataIndex: 'buildingArea'
          },
          // {
          //   title: '实用面积',
          //   dataIndex: 'practicalArea'
          // },
          {
            title: '身份证',
            width: 200, 
            dataIndex: 'idCard'
          },
          // {
          //   title: '业务员',
          //   dataIndex: 'salesman'
          // },
          {
            title: '回单人',
            dataIndex: 'replyOrderStaff'
          },
          // {
          //   title: '推荐客户',
          //   dataIndex: 'name3'
          // },
          // {
          //   title: '推荐客户编码',
          //   dataIndex: 'code1'
          // },
          {
            title: '座机号',
            dataIndex: 'telephone'
          },
          {
            title: '备用电话',
            dataIndex: 'alternateMobile'
          },
          {
            title: '职业',
            dataIndex: 'customerJob'
          },
          {
            title: '生日',
            dataIndex: 'birth',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '其他联系人',
            dataIndex: 'linkman'
          },
          {
            title: '其他联系人电话',
            dataIndex: 'linkmanMobile'
          },
          {
            title: '信息渠道',
            dataIndex: 'infoSourceName'
          },
          {
            title: '现在住址',
            dataIndex: 'presentAddress'
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
            title: '装修风格',
            dataIndex: 'decorationStyleName'
          },
          // {
          //   title: '装修地址小区',
          //   dataIndex: 'address4'
          // },
          {
            title: '装修地址详细地址',
            dataIndex: 'fullAddress'
          },
          {
            title: '装修地址完整地址',
            width: 260,
            dataIndex: 'finalAddress'
          },
          {
            title: '家庭成员',
            dataIndex: 'familyMember'
          },
          {
            title: '上门次数',
            dataIndex: 'visitTrackCount'
          },
          // {
          //   title: '门店名称',
          //   dataIndex: 'text2'
          // },
          {
            title: '平面图状况',
            dataIndex: 'planarGraphCondition'
          },
          {
            title: '所属行业',
            dataIndex: 'industryInvolvedName'
          },
          {
            title: '年龄区间',
            dataIndex: 'ageRangeName'
          },
          {
            title: '月收入',
            dataIndex: 'monthlyIncome' 
          },
          {
            title: '房价',
            dataIndex: 'housePrice' 
          },
          {
            title: '电子邮件',
            dataIndex: 'mail'
          },
          {
            title: '市场经理',
            dataIndex: 'name1'
          },
          {
            title: '客户记录次数',
            dataIndex: 'customerTrackCount'
          },  
          {
            title: '客户重点关注',
            dataIndex: 'focusOnName'
          },
          {
            title: '客户已了解信息',
            dataIndex: 'knownInfoName'
          },
          {
            title: '客户装修要求',
            dataIndex: 'customerDemand'
          },
          {
            title: '电话回访次数',
            dataIndex: 'phoneTrackCount'
          },
          {
            title: '了解公司途径',
            dataIndex: 'knowCoWayName'
          },
          {
            title: '预计装修造价',
            dataIndex: 'budget'
          },
          {
            title: '预计装修日期',
            dataIndex: 'dateForDecoration',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '预计量房日期',
            dataIndex: 'dateForMeasure',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '远期日期',
            dataIndex: 'dataTime1',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '最后一次电话回访日期',
            dataIndex: 'lastDayPhoneTrack',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },          
          {
            title: '最后一次客户记录日期',
            dataIndex: 'lastDayCustomerTrack',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },  
          {
            title: '最后一次上门日期',
            dataIndex: 'lastDayVisitTrack',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },  
          {
            title: '首次访问日期',
            dataIndex: 'firstDayTrack',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '是否上门客户',
            dataIndex: 'visited',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '是否有电梯',
            dataIndex: 'elevator',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '是否期房客户',
            dataIndex: 'future',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '是否飞单',
            dataIndex: 'isFlyingOrder',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 320,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
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
          ageRangeType: [],
          industryInvolvedType: [],
          replyOrderTag: [],
          infoChannelType: [],
        },
        actionAuth: []
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
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      add() {
      },
      handleSub (ids) {
        this.loading = true
        this.$post({
          url: this.$api.customInfo.resourceCustomer.delete,
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
          typeList: ['1003','1022','1023','1025','1026','1027','1028','1029','1030','1031','1034','1035','1036','1044']
        }
        this.$getCodesList(params, res => {
          this.codeType.genderType = res['1003'] || [] // 性别
          this.codeType.relationshipType = res['1022'] || []// 客户类型
          this.codeType.marketingType =  res['1023'] || [] // 营销类型
          this.codeType.houseType =  res['1025'] || []  // 房型
          this.codeType.roomType =  res['1026'] || [] // 户型
          this.codeType.decorationStyleType =  res['1027'] || []  // 装修风格
          this.codeType.infoChannelType =  res['1028'] || [] // 信息来源
          this.codeType.knowCoWayType =  res['1029'] || []  // 了解公司途径
          this.codeType.knownInfoType =  res['1030'] || []  // 客户了解信息
          this.codeType.focusOnType =  res['1031'] || []  // 客户重点关注
          this.codeType.industryInvolvedType =  res['1034'] || []  // 所属行业
          this.codeType.ageRangeType =  res['1035'] || []  // 年龄区间
          this.codeType.replyOrderTag =  res['1036'] || []  // 回单标志
          this.codeType.infoSourceType =  res['1044'] || []  // 信息来源
        })
      },
      // 上传材料数据
      uploadData () {
        this.$refs.uploadModal.show()
      },
      // 下载数据
      downloadData () {
        window.open(process.env.VUE_APP_API_BASE_URL +  this.$api.customInfo.highSeaPoolCustomer.export+
          `?type=${this.queryParam.type}`, '_self')
      },
      // 下载模板
      downloadTemplate () {
        this.$notification.warning({
          message: labels.HINT,
          description: '暂未开放'
        })
        // window.open(process.env.VUE_APP_TEMPLATE_BASE_URL + 'material-template.xlsx', '_self')
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {}
      },
    },
    activated() {
      this.selectedRowKeys = []
      this.$refs.listPage.updateSelect([],[])
      this.handleOk()
      this.getCodeList()
    }
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
</style>