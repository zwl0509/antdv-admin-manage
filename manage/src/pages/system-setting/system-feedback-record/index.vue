<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="POST"
      :query-params="searchParams">
      <template slot="$search">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item label="反馈人名称">
              <a-input v-model="queryParam.employeeName" autocomplete="off" placeholder="请输入反馈人名称" :max-length="30"/>
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <template slot="attaches" slot-scope="text,record" >
        <div v-if="record.attachInfoList && record.attachInfoList.length">
          <img style="margin:0 5px;" v-for="(item,index) in record.attachInfoList" :key="index" :src="item.path" @click="openImg(item.path)" width="40" height="40" alt/>
        </div>
        <span v-else> - </span>
      </template>
    </list-page>
    <a-modal :visible="previewVisible" :footer="null" @cancel="cancelPreviewImage">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import ListPage from '@/components/ListPage'
import { defaultTableColumns } from '@/components/ListPage/_utils'
import labels from '@/utils/labels'

export default {
  name: 'TableList',
  components: {
    ListPage
  },
  data () {
    return {
      loading: false,
      previewVisible: false,
      previewImage: '',
      requestUrl: this.$api.system.feedback.getListPage,
      // 查询参数
      queryParam: {},
      searchParams: () => {
        return this.queryParam
      },
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title:'反馈图片',
          dataIndex: 'attachInfoList',
          width: 200,
          scopedSlots: { customRender: 'attaches' },
        },
        {
          title: '反馈人',
          dataIndex: 'employeeName'
        },
        {
          title: '反馈内容',
          dataIndex: 'feedbackContent'
        },
        {
          title: '编辑人',
          dataIndex: 'modifiedBy'
        },
        {
          title: '编辑时间',
          dataIndex: 'modifiedTime',
          customRender: txt => txt && moment(txt).format(dateFormatString) || ''
        }
      ],
      actionAuth: []
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
    handleOk () {
      this.$refs.listPage.refresh()
    },
    resetSearchForm () {
      this.queryParam = { }
    },
    openImg(item){
      this.previewImage = item
      this.previewVisible = true
    },
    cancelPreviewImage() {
      this.previewImage = ''
      this.previewVisible = false
    }
  }
}
</script>
