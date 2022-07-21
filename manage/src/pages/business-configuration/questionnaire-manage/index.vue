<template>
  <div>
    <!-- 问卷管理 -->
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="POST"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="问卷调查名称">
            <a-input v-model="queryParam.surveyName" autocomplete="off" placeholder="请输入问卷调查名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="调查类型">
            <a-select placeholder="请选择调查类型" v-model="queryParam.surveyType" allowClear>
              <a-select-option v-for="(item, index) in surveyTypeList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否启用">
            <a-select placeholder="请选择是否启用" v-model="queryParam.isUse" allowClear>
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button v-if="actionAuth.includes('QuestionnaireManage.Create')" type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
      </template>
      <template slot="isUse" slot-scope="text, record">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="!!record.isUse" 
          @change="handleIsOpen(record.id)"/>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('QuestionnaireManage.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <!-- <a-divider type="vertical"/> -->
        </template>
        <!-- <template v-if="actionAuth.includes('QuestionnaireManage.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template> -->
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"/>
  </div>
</template>

<script>
import moment from 'moment'
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import { defaultTableColumns } from '@/components/ListPage/_utils'

export default {
  name: 'TableList',
  components: {
    ActionModal,
    ListPage
  },
  data () {
    return {
      loading: false,
      requestUrl: this.$api.allocation.surveyInfo.getListPage,
      // 查询参数
      queryParam: {},
      searchParams: () => {
        return this.queryParam
      },
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title: '问卷调查名称',
          dataIndex: 'surveyName'
        },
        {
          title: '调查类型',
          dataIndex: 'surveyTypeName'
        },
        {
          title: '是否启用',
          dataIndex: 'isUse',
          scopedSlots: { customRender: 'isUse' }
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
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      actionAuth: [],
      surveyTypeList: [],
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
    this.$getCodeList('1078', res => {
      this.surveyTypeList = res // 问卷调查类型
    })
  },
  methods: {
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleSub (record) {
      this.loading = true
      this.$delete({
        url: this.$api.allocation.surveyInfo.delete,
        params: { id: record.id },
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
    handleIsOpen(id) {
      this.$put({
        url: this.$api.allocation.surveyInfo.updateIsUse,
        params: { id },
        needResponse: true
      }).then(res => {
          this.$notification.success({
            message: labels.OPERATE_SUCCESS,
            description: res.message || ''
          })
          this.handleOk()
        })
        .catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
        .finally(() => { this.isCheck = this.loading = false  })
    },
    handleOk () {
      this.$refs.listPage.refresh()
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    clearId () {
      this.targetId = null
    }
  }
}
</script>
