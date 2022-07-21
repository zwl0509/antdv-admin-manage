<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
    >
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="标题">
            <a-input v-model="queryParam.title" autocomplete="off" placeholder="请输入标题" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="类型">
            <a-select placeholder="请选择类型" v-model="queryParam.type" allowClear>
              <a-select-option v-for="(item, index) in smstypeList" :key="index" :value="item.value">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否启用">
            <a-select placeholder="请选择是否启用" v-model="queryParam.isEnabled">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$searchFold">
        <a-col :md="6" :sm="24">
          <a-form-item label="创建日期">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('SMS.Create')">新建</a-button>
      </template>
      <span slot="content" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="isEnabled" slot-scope="bool, record">
        <a-icon :type="record.isEnabled?'check':'close'"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('SMS.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('SMS.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('SMS.Delete')">
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
  import { STable, Ellipsis } from '@/components'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import ListPage from '@/components/ListPage'
  import labels from '@/utils/labels'

  export default {
    name: 'SystemSmsTemplate',
    components: {
      STable,
      Ellipsis,
      ActionModal,
      ListPage
    },
    data () {
      return {
        loading: false,
        // 查询参数
        queryParam: {},
        requestUrl: this.$api.system.shortMessage.getListPage,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '分类',
            dataIndex: 'typeName'
          },
          {
            title: '编码',
            dataIndex: 'code'
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
            title: '平台Id',
            dataIndex: 'platformId'
          },
          // {
          //   title: '是否可用',
          //   dataIndex: 'isDeleted',
          //   scopedSlots: { customRender: 'isDeleted' }
          // },
          {
            title: '是否启用',
            dataIndex: 'isEnabled',
            scopedSlots: { customRender: 'isEnabled' }
          },
          {
            title: '创建人',
            dataIndex: 'createdBy'
          },
          {
            title: '创建时间',
            dataIndex: 'createdTime',
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
            width: '120px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        smstypeList: [],
        actionAuth: []
      }
    },
    created () {
      this.initPageData()
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
      initPageData () {
        // 按钮级权限获取
        this.$store.dispatch('GetActionAuth').then(res => {
          const arr = []
          res.forEach(item => {
            arr.push(item.key)
          })
          this.actionAuth = arr
        })

        this.$getCodeList('1024', res => {
          this.smstypeList = res
        })
      },
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.system.shortMessage.delete,
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
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
          date: null // moment(new Date())
        }
      }
    }
  }
</script>
