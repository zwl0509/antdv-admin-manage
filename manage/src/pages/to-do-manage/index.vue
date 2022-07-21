<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :query-params="searchParams"
      :request-url="requestUrl"
      request-type="POST"
      :customRow="customRow"
    >
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="任务名称">
            <a-input v-model="queryParam.applyTypeName" autocomplete="off" placeholder="请输入任务名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否处理">
            <a-select placeholder="请选择是否处理" allowClear v-model="queryParam.isDeal">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.DetailModal.show(record)" v-if="record.isDeal">查看</a>
          <a @click="$refs.ActionModal.show(record)" v-if="!record.isDeal">去办理</a>
        </template>
      </span>
    </list-page>
    <detail-modal ref="DetailModal" @ok="handleOk()" :codeType="codeType" @getCodeList="getCodeList"></detail-modal>
    <action-modal ref="ActionModal" @ok="handleOk()" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import ActionModal from '@/pages/to-do-manage/modules/ActionModal'
  import DetailModal from '@/pages/to-do-manage/modules/DetailModal'
  export default {
    name: 'ToDoList',
    components: {
      DetailModal,
      ListPage,
      ActionModal
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.toDealWith.getListPage,
        // 表头
        queryParam:{
          isAll:true
        },
        columns: [
          {
            title: '序号',
            width: 80,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '任务名称',
            dataIndex: 'applyTypeName'
          },
          {
            title: '申请人姓名',
            align: 'center',
            dataIndex: 'assignName'
          },
          {
            title: '处理人姓名',
            align: 'center',
            dataIndex: 'executorName'
          },
          {
            title: '是否处理',
            dataIndex: 'isDeal',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '创建日期',
            dataIndex: 'showDate'
          },
          {
            title: '操作',
            width: 200,
            dataIndex: 'action',
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
          infoChannelType:[],
          trackType: [],
          recordType: [],
          replyOrderTag:[],
          applyType: [],
          statusList: []
        },
        id:'',
        actionAuth: [],
        isView: false
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
      getCodeList() {
        const params = {
          typeList: ['1003','1010','1022','1023','1025','1026','1027','1028','1029','1030','1031','1036','1037','1038','1044','1062']
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
          this.codeType.replyOrderTag =  res['1036'] || []  // 回单标志
          this.codeType.trackType = res['1037'] || []  // 跟踪类型
          this.codeType.recordType = res['1038'] || []  // 记录类型
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
          this.codeType.applyType = res['1062'] || []  // 信息来源
          this.codeType.statusList = res['1010'] || [] 
          this.codeType.statusList.forEach((item, index)=>{ // 审核状态
          if(item.value == '1010-10' || item.value == '1010-40') {
              this.codeType.statusList.splice(index,1)
            }
          })
        })
      },
      searchParams () {
        return { ...this.queryParam }
      },
      resetSearchForm () {
        this.queryParam = {
        }
      },
      customRow (row) {
        return {
          class: row.isView === true ? '' : 'test',
          style: { backgroundColor : row.isView === true ? 'unset' : '#e0e0e0'},
        }
      },
      handleSub (record) {
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
    },
    activated() {
      this.getCodeList()
      this.handleOk()
    }
  }
</script>
<style lang="scss" scoped>
  /*::v-deep .ant-spin-container{*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  padding: 15px 30px;*/
  /*}*/
  /*/deep/ .ant-table-tbody{*/
  /*  > tr:hover:not(.ant-table-expanded-row) > td,.ant-table-row-hover,.ant-table-row-hover>td{*/
  /*    background: #f1f3f4 !important;*/
  /*  }*/
  /*}*/
  /*/deep/ .ant-table-tbody{*/
  /*  > tr:hover:not(.ant-table-expanded-row) > td,.ant-table-row-hover,.ant-table-row-hover>td,.test-hover,.test-hover>td{*/
  /*    background: #f1f3f4 !important;*/
  /*  }*/
  /*}*/


</style>