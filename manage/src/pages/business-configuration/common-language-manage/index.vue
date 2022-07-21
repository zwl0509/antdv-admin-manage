<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      requestType="POST"
      :request-url="requestUrl"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="所属模块">
            <a-select placeholder="请选择所属模块" v-model="queryParam.code" allowClear>
              <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="12" :xl="12" :xxl="8">
          <a-form-item label="内容">
            <a-input
              v-model="queryParam.words"
              autocomplete="off"
              style="width: 100%"
              placeholder="请输入内容"
              :max-length="30"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" v-if="actionAuth.includes('CommonLanguage.Create')" @click="$refs.createModal.add('1046-10')">个人新增</a-button>
        <a-button type="primary" v-if="actionAuth.includes('CommonLanguage.Create')" icon="plus" @click="$refs.createModal.add('1046-20')">系统新增</a-button>
      </template>
      <span slot="code" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ codeChange(text) }}</ellipsis>
      </span>
      <span slot="content" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('CommonLanguage.Modify')">
          <a @click="handleEdit(record,'edit')">编辑</a>
          <a-divider v-if="actionAuth.includes('CommonLanguage.Modify')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('CommonLanguage.Delete')">
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
      queryParam: {
      },
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title: '分类',
          dataIndex: 'relationTypeName'
        },
        {
          title: '所属模块',
          dataIndex: 'codeName'
        },
        {
          title: '内容',
          dataIndex: 'words',
          scopedSlots: { customRender: 'words' }
        },
        {
          title: '编辑时间',
          dataIndex: 'modifiedTime',
          customRender: txt => txt && moment(txt).format(dateFormatString) || ''
        },
        {
          title: '编辑人',
          dataIndex: 'modifiedBy'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      requestUrl: this.$api.system.commonWords.getList,

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
    this.$getCodeList('1045', res => {
      this.typeList = res
    })
  },
  methods: {
    searchParams () {
      return { ...this.queryParam }
    },
    handleEdit (record, type) {
      this.$refs.createModal.edit(record, type)
    },
    handleSub (record) {
      this.loading = true
      this.$post({
        url: this.$api.system.commonWords.deleted,
        data:   [record.id] ,
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

      }
    }
  }
}
</script>
