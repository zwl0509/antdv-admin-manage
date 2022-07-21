<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      requestType="GET"
      :request-url="requestUrl"
      :query-params="searchParams">
      <template slot="$search">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="分类">
              <a-select placeholder="请选择分类" v-model="queryParam.type" allowClear>
                <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.title" autocomplete="off" placeholder="请输入标题" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="编辑时间">
              <a-range-picker v-model="queryParam.date" style="width: 100%"/>
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('QALibrary.Create')">新建</a-button>
      </template>
      <span slot="content" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record,'detail')">详情</a>
          <a-divider v-if="actionAuth.includes('QALibrary.Modify')||actionAuth.includes('QALibrary.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('QALibrary.Modify')">
          <a @click="handleEdit(record,'edit')">编辑</a>
          <a-divider v-if="actionAuth.includes('QALibrary.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('QALibrary.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import ActionModal from './modules/ActionModal'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  // import { appQAL_list, appQAL_delete } from '@/api/system/app-QALibrary'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'

  export default {
    name: 'TableList',
    components: {
      STable,
      ActionModal,
      Ellipsis,
      ListPage
    },
    data () {
      return {
        loading: false,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '分类',
            dataIndex: 'typeName'
          },
          {
            title: '标题',
            dataIndex: 'title'
          },
          {
            title: '内容',
            dataIndex: 'content',
            scopedSlots: { customRender: 'content' }
          },
          {
            title: '编辑时间',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '180px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        requestUrl: this.$api.system.appQALibrary.getListPage,

        // 加载数据方法 必须为 Promise 对象

        selectedRowKeys: [],
        selectedRows: [],


        platformList: [],
        actionAuth: [],
        typeList: [],
        isFirstEnter: true
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
      this.$getCodeList('1039', res => {
        this.typeList = res
      })
    },
    methods: {
      searchParams () {
        if (this.queryParam.date) {
          this.queryParam.startTime = moment(this.queryParam.date[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.endTime = moment(this.queryParam.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        delete this.queryParam.date
        return this.queryParam
      },
      handleEdit (record, type) {
        this.$refs.createModal.edit(record, type)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.system.appQALibrary.delete,
          params: { id: record.id },
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
        this.$refs.listPage.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: null // moment(new Date())
        }
      }
    }
  }
</script>
