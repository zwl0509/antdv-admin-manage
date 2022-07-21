<template>
  <a-modal
    class="construction-tasks"
    :visible="visible"
    :width="1200"
    title="施工任务表"
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
        request-type="POST"
        :query-params="searchParams">
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="资源名称">
              <a-input v-model="queryParam.resourceName" autocomplete="off" placeholder="请输入资源名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="任务名称">
              <a-input v-model="queryParam.taskName" autocomplete="off" placeholder="请输入任务名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="是否关键节点">
              <a-select placeholder="是否关键节点" v-model="queryParam.isRequired">
                <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
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
            @click="$refs.AddTask.add()">新建</a-button>
        </template>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
        <span slot="ellipsis" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$refs.AddTask.edit(record,'edit')">编辑</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </list-page>
    </a-spin>
    <add-task ref="AddTask" @ok="handleOk"></add-task>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import AddTask from './AddTask'
  import { Ellipsis } from '@/components'
  import ListPage from '@/components/ListPage'
  import { defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  export default {
    name: 'ConstructionTasks',
    components: { AddTask, ListPage, Ellipsis},
    data () {
      return {
        visible: false,
        loading: false,
        treeLoading: false,
        // 高级搜索 展开/关闭
        advanced: false,
        requestUrl: this.$api.construction.basicConstructionTaskInfo.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '任务名称',
            dataIndex: 'taskName',
            width: 180,
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '资源名称',
            dataIndex: 'resourceName',
            width: 180,
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '工期(人/天)',
            dataIndex: 'duration'
          },
          {
            title: '是否关键节点',
            dataIndex: 'isRequired',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '前置任务',
            dataIndex: 'startTaskName'
          },
          {
            title: '后置任务',
            dataIndex: 'endTaskName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 130,
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
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
      show () {
        this.visible = true
        this.$refs.listPage && this.handleOk()
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
        this.$put({
          url: this.$api.construction.basicConstructionTaskInfo.delete,
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
  .construction-tasks {
    ::v-deep .ant-modal-body {
      max-height: 720px;
    }

    ::v-deep .ant-table-thead > tr > th {
      padding: 10px;
    }

    ::v-deep .ant-table-tbody > tr > td {
      padding: 10px;
    }

    ::v-deep .page .ant-card-body {
      padding: 0;
    }
  }
  
</style>