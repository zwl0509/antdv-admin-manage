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
        class="page"
        ref="listPage"
        @resetParams="resetSearchForm"
        :columns="columns"
        :request-url="requestUrl"
        request-type="GET"
        :query-params="searchParams"
        :scroll="{y : 340}">
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="巡检名称">
              <a-input v-model="queryParam.title" autocomplete="off" placeholder="请输入巡检名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="巡检类型">
              <a-select placeholder="请选择巡检类型" v-model="queryParam.isRequired">
                <a-select-option v-for="(item, index) in List" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
        <template slot="$operate">
          <a-button
            type="primary"
            icon="edit"
            style="margin-bottom: 8px;"
            @click="handleAdd()">新建</a-button>
        </template>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
        <template slot="picture" slot-scope="text">
          <img :src="text" width="40" height="40" alt />
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$refs.AddRecord.edit(record,'edit',customerId)">编辑</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </list-page>
      <add-record ref="AddRecord" @ok="handleOk"></add-record>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'
  import AddRecord from '@/pages/customer-manage/construction-stage/modules/AddRecord'
  export default {
    name: 'PatrolRecord',
    components: {
      AddRecord,
      ListPage
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
        queryParam: {},
        // 表头
        columns: [
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
            width: '130px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
        customerId:'',
        List:[
          {name: '日常巡检'},
          {name: '标准巡检'},
        ],
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
      // this.getOrgTreeData()
    },
    methods: {
      show (record) {
        this.customerId = record.id
        this.visible = true
        this.$refs.listPage && this.handleOk()
      },
      handleAdd(){
        this.$refs.AddRecord.add(this.customerId)
      },
      searchParams () {
        if (this.queryParam.data) {
          this.queryParam.startTime = moment(this.queryParam.data[0]).format('YYYY-MM-DD')
          this.queryParam.endTime = moment(this.queryParam.data[1]).format('YYYY-MM-DD')
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
  ::v-deep .ant-table-thead > tr > th {
    padding: 10px;
  }

  ::v-deep .ant-table-tbody > tr > td {
    padding: 10px;
  }

  ::v-deep .page .ant-card-body {
    padding: 0;
  }
</style>
