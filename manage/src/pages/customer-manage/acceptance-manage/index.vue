<template>
  <div>
    <!-- 验收管理 -->
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
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('AcceptanceManage.AcceptanceTask')">
          <a @click="$refs.AcceptanceTask.show(record.id)">验收任务</a>
        </template>
      </span>
    </list-page>
    <!-- 验收任务 -->
    <acceptance-task ref="AcceptanceTask" @ok="handleOk" :actionChildAuth="actionChildAuth"></acceptance-task>
  </div>
</template>

<script>
  import ListPage from '@/components/ListPage'
  import { Ellipsis } from '@/components'
  import AcceptanceTask from './modules/AcceptanceTask.vue'
  export default {
    name: 'TableList',
    components: {
      Ellipsis,
      ListPage,
      AcceptanceTask,
    },
    data () {
      return {
        loading: false,
        // 查询参数
        queryParam: {
          status: ['1080-10','1080-50']
        },
        actionAuth: [],
        actionChildAuth: [],
        requestUrl: this.$api.customInfo.acceptanceInfo.getListPage,
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
        tabsIndex: 0,
        list:[
          { value: 0, name: '未完成' },
          { value: 1, name: '已完成' },
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
        const childrenAnth = []
        res.forEach(item => {
          arr.push(item.key)
          childrenAnth.push(item.key.split('.')[1])
        })
        this.actionChildAuth = childrenAnth
        this.actionAuth = arr
      })
    },

    methods: {
      searchParams () {
        return { ...this.queryParam }
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
    },
  }
</script>
<style lang="scss" scoped>
</style>