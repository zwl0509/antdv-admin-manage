<template>
  <!-- 查看巡检记录 -->
  <a-modal
    :visible="visible"
    :width="1200"
    title="查看巡检记录"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        class="small-table"
        @resetParams="resetSearchForm"
        :columns="columns"
        :request-url="requestUrl"
        request-type="GET"
        :showSearch="false"
        :query-params="searchParams"
        :scroll="{y : 400}">
        <template slot="$operate">
          <a-button
            type="primary"
            icon="edit"
            v-if="actionChildAuth.includes('PatrolCreate') && queryParam.type === '1082-20'"
            @click="handleAdd('1082-20')">标准巡检新增</a-button>
          <a-button
            type="primary"
            icon="edit"
            v-else-if="actionChildAuth.includes('PatrolCreate')"
            @click="handleAdd('1082-10')">日常巡检新增</a-button>
          <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
            <a-tab-pane v-for="(item, index) in PatrolList" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
          </a-tabs>
        </template>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
        <template slot="picture" slot-scope="text, record">
          <img v-if="record.unqualifiedInfoVOS && record.unqualifiedInfoVOS[0] && record.unqualifiedInfoVOS[0].attachInfos && record.unqualifiedInfoVOS[0].attachInfos.length" :src="record.unqualifiedInfoVOS[0].attachInfos[0].path" class="imgs" @click="openImgs(record.unqualifiedInfoVOS[0].attachInfos[0].path)">
        </template>
        <span slot="action" slot-scope="text, record">
          <template v-if="status === '1082-10'">
            <template v-if="actionChildAuth.includes('Rectify')">
              <a @click="$refs.Rectification.edit(record)">去整改</a>
              <a-divider type="vertical"/>
            </template>
            <template v-if="record.haveRectification === true && actionChildAuth.includes('RectifyTable')">
              <a @click="$refs.RectifyTable.show(record)">整改详情</a>
              <br/>
            </template>
            <template v-if="actionChildAuth.includes('PatrolDetail')">
              <a @click="$refs.AddRecord.edit(record,'detail',customerId)">详情</a>
              <a-divider type="vertical"/>
            </template>
            <template v-if="actionChildAuth.includes('PatrolDelete')">
              <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
                <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
              </a-popconfirm>
            </template>
          </template>
          <template v-if="status === '1082-20'">
            <template v-if="actionChildAuth.includes('PatrolDetail')">
              <a @click="$refs.QuestionType.detail(record,'detail',customerId)">详情</a>
              <a-divider type="vertical"/>
            </template>
            <template v-if="actionChildAuth.includes('PatrolDelete')">
              <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
                <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
              </a-popconfirm>
            </template>
          </template>
        </span>
      </list-page>
      <add-record ref="AddRecord" @ok="handleOk"></add-record>
      <!-- 标准巡检 -->
      <question-type ref="QuestionType" @ok="handleOk"></question-type>
      <!-- 不合格整改 -->
      <rectification ref="Rectification" @ok="handleOk"></rectification>
      <!-- 整改表 -->
      <rectify-table ref="RectifyTable" @ok="handleOk" :actionChildAuth="actionChildAuth"></rectify-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import QuestionType from '@/pages/customer-manage/construction-stage/modules/QuestionType'
  const columnX = [
    defaultTableColumns.serial,
    {
      title: '巡检图片',
      dataIndex: 'picture',
      scopedSlots: {
        customRender: 'picture',
      },
    },
    {
      title: '巡检名称',
      dataIndex: 'title'
    },
    {
      title: '巡检类型',
      dataIndex: 'typeName'
    },
    {
      title: '巡检日期',
      dataIndex: 'inspectionTime',
      customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    },
    {
      title: '编辑人',
      dataIndex: 'modifiedBy'
    },
    {
      title: '编辑时间',
      dataIndex: 'modifiedTime',
      customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  const columnY = [
    defaultTableColumns.serial,
    {
      title: '巡检图片',
      dataIndex: 'picture',
      align: 'center',
      scopedSlots: {
        customRender: 'picture',
      },
    },
    {
      title: '巡检名称',
      align: 'center',
      dataIndex: 'title'
    },
    {
      title: '是否整改',
      align: 'center',
      dataIndex: 'haveRectification',
      scopedSlots: {
        customRender: 'switch',
      },
    },
    {
      title: '编辑人',
      align: 'center',
      dataIndex: 'modifiedBy'
    },
    {
      title: '编辑时间',
      align: 'center',
      dataIndex: 'modifiedTime',
      customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  import moment from 'moment'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'
  import AddRecord from '@/pages/customer-manage/construction-stage/modules/AddRecord'
  import Rectification from './Rectification'
  import RectifyTable from '@/pages/customer-manage/construction-stage/modules/RectifyTable'
  export default {
    name: 'PatrolRecord',
    components: {
      QuestionType,
      RectifyTable,
      Rectification,
      AddRecord,
      ListPage
    },
    props: {
      actionChildAuth:{
        type: Array,
        default: ()=> []
      }
    },
    data () {
      return {
        visible: false,
        loading: false,
        treeLoading: false,
        // 高级搜索 展开/关闭
        advanced: false,
        requestUrl: this.$api.customInfo.customerInspectionRecordInfo.getListPage,
        // 查询参数
        queryParam: {
          type:'1082-10'
        },
        // 表头
        columns: columnX,
        actionAuth: [],
        customerId:'',
        value: 0,
        PatrolList:[],
        status:''
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
      show (record) {
        this.customerId = record.id
        this.queryParam.customerId = record.id
        this.visible = true
        this.getCodeList()
        this.$refs.listPage && this.handleOk()
      },
      getCodeList(){
        this.$getCodeList('1082', res => {
          this.PatrolList = res
        })
      },
      changeTabs(e){
        this.status = e ? '1082-20' : '1082-10'
        this.columns = e ? columnY : columnX
        this.$nextTick(()=>{
          this.handleOk()
        })
      },
      openImgs(path){
        if(path){
          this.previewImage = path
          this.previewVisible = true
        }
      },
      handleAdd(type){
        if (type === '1082-10'){
          this.$refs.AddRecord.add(this.customerId)
        }else if (type === '1082-20'){
          this.$refs.QuestionType.add(this.customerId)
        }
      },
      searchParams () {
        if (this.queryParam.data) {
          this.queryParam.startTime = moment(this.queryParam.data[0]).format('YYYY-MM-DD')
          this.queryParam.endTime = moment(this.queryParam.data[1]).format('YYYY-MM-DD')
        }
        if(this.value === 0){
          this.queryParam = {
            type:'1082-10',
            customerId:  this.queryParam.customerId
          }
        }else{
          this.queryParam = {
            type:'1082-20',
            customerId:  this.queryParam.customerId
          }
        }
        delete this.queryParam.data
        return this.queryParam
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.customInfo.customerInspectionRecordInfo.delete,
          params: {id : record.id} ,
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.DELETE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleOk () {
        this.$refs.listPage.refresh(true)
      },
      handleCancel(){
        this.visible= false
        this.loading= false
        this.value = 0
        this.columns = columnX
        this.queryParam.type = '1082-10'
      },
      resetSearchForm () {
        this.queryParam = {
          date: null
        }
      },
      clearId () {
        this.targetId = null
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
  .imgs {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px dashed #c9c9c9;
    object-fit: contain;
  }
</style>
