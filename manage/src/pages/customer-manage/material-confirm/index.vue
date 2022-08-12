<template>
  <div>
    <!-- 材料确认 -->
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      request-type="POST"
      :columns="columns"
      :request-url="requestUrl"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="查询时间">
            <a-select placeholder="请选择查询时间" allowClear v-model="queryParam.timeSlot">
              <a-select-option v-for="(item, index) in timeSlotType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-tabs v-model="tabsIndex" @change="changeTabs">
          <a-tab-pane v-for="(item, index) in list" :key="index" :tab="item.name" :value="item.value"></a-tab-pane>
        </a-tabs>
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.ActionModal.show(record)">材料到场</a>
      </span>
    </list-page>
    <action-modal ref="ActionModal" @ok="handleOk"/>
  </div>
</template>

<script>
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import { Ellipsis } from '@/components'
export default {
  name: 'TableList',
  components: {
    ActionModal,
    ListPage,
    Ellipsis
  },
  data () {
    return {
      loading: false,
      actionAuth: [],
      tabsIndex: 0,
      requestUrl: this.$api.customInfo.acceptanceInfo.getListPage,
      // 查询参数
      queryParam: {
        status: ['1080-10','1080-50']
      },
      // 表头
      columns: [
        {
          title: '序号',
          width: 80,
          dataIndex: 'serial',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: {
            customRender: 'customerName'
          }
        },
        {
          title: '客户电话',
          dataIndex: 'mobileNumber'
        },
        {
          title: '客户状态',
          dataIndex: 'statusName'
        },
        {
          title: '任务名称',
          dataIndex: 'taskName'
        },          
        {
          title: '任务时间',
          dataIndex: 'taskTime'
        },
        {
          title: '装修地址',
          dataIndex: 'finalAddress',
          width: 200,
          scopedSlots: {
            customRender: 'ellipsis'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      list:[
        { value: 0, name: '未完工' },
        { value: 1, name: '已完工' },
      ],      
      timeSlotType: [
        { value: 0, name: '上周' },
        { value: 1, name: '本周' },
        { value: 2, name: '下周' },
      ]
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
    searchParams(){
      return this.queryParam
    },
    changeTabs(e) {
      if(e) {
        this.queryParam.status = ['1080-20']
      }else {
        this.queryParam.status = ['1080-10','1080-50']
      }
      this.handleOk()
    },
    handleOk () {
      this.$refs.listPage.refresh()
    },
    resetSearchForm () {
      this.queryParam = {}
    },
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
</style>
