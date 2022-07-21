<template>
  <a-modal
    title="工人信息查看"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <list-page
      ref="listPage"
      size="small"
      :columns="columns"
      :data="loadData"
      :request-url="requestUrl"
      request-type="GET"
      :showSearch="false"
      bordered
      :query-params="searchParams"
    >
      <template slot="$operate">
        <a-button type="primary" icon="cloud-download" @click="exportData">导出数据</a-button>
      </template>
      <template slot="switch" slot-scope="text">
        <a-switch
          checked-children="是"
          un-checked-children="否"
          :checked="!!text" />
      </template>
    </list-page>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import ListPage from '@/components/ListPage'
  import { dateFormatString } from '@/utils/common'
  const data = [
    {
      serial:'',
      workerType:'木工',
      shiftWorker:'赵毅',
      shiftVerification:'代班验证1',
      shiftPhotos:'查看相片',
      worker:'张扬',
      verification:'验证1',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'木工',
      shiftWorker:'张洋',
      shiftVerification:'代班验证2',
      shiftPhotos:'查看相片',
      worker:'翟一新',
      verification:'验证2',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'木工',
      shiftWorker:'袁毅',
      shiftVerification:'代班验证3',
      shiftPhotos:'查看相片',
      worker:'王强',
      verification:'验证3',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'砌筑工',
      shiftWorker:'李莎',
      shiftVerification:'代班验证1',
      shiftPhotos:'查看相片',
      worker:'李友',
      verification:'验证1',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'砌筑工',
      shiftWorker:'袁强',
      shiftVerification:'代班验证2',
      shiftPhotos:'查看相片',
      worker:'赵六',
      verification:'验证2',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'水电工',
      shiftWorker:'孙伟',
      shiftVerification:'代班验证1',
      shiftPhotos:'查看相片',
      worker:'江海',
      verification:'验证1',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'土建工',
      shiftWorker:'孙怡',
      shiftVerification:'代班验证1',
      shiftPhotos:'查看相片',
      worker:'苏毅',
      verification:'验证1',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'土建工',
      shiftWorker:'林子',
      shiftVerification:'代班验证2',
      shiftPhotos:'查看相片',
      worker:'曾游',
      verification:'验证2',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'土建工',
      shiftWorker:'韩风',
      shiftVerification:'代班验证3',
      shiftPhotos:'查看相片',
      worker:'梁海涛',
      verification:'验证3',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'瓦工',
      shiftWorker:'钱江',
      shiftVerification:'代班验证1',
      shiftPhotos:'查看相片',
      worker:'王婷',
      verification:'验证1',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'油漆工',
      shiftWorker:'李彤',
      shiftVerification:'代班验证1',
      shiftPhotos:'查看相片',
      worker:'李伟',
      verification:'验证1',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'油漆工',
      shiftWorker:'李超',
      shiftVerification:'代班验证2',
      shiftPhotos:'查看相片',
      worker:'景超',
      verification:'验证2',
      photos:'查看相片',
    },
    {
      serial:'',
      workerType:'杂工',
      shiftWorker:'丽丽',
      shiftVerification:'代班验证3',
      shiftPhotos:'查看相片',
      worker:'王一',
      verification:'验证3',
      photos:'查看相片',
    },
  ]
  export default {
    name: 'WorkerInfo',
    components: {
      ListPage,
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        requestUrl: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        queryParam: {},
        id: '',
        columns: [
          // {
          //   title: '序号',
          //   align: 'center',
          //   width: 60,
          //   scopedSlots: { customRender: 'serial' }
          // },
          {
            title: '工种',
            align: 'center',
            dataIndex:'workerType',
            customRender: (value, row, index) => {
              const obj = {
                children: value,
                attrs: {},
              }
              if (index === 0) {
                obj.attrs.rowSpan = 3
              }
              if (index === 1) {
                obj.attrs.rowSpan = 0
              }
              if (index === 2) {
                obj.attrs.rowSpan = 0
              }
              if (index === 3) {
                obj.attrs.rowSpan = 2
              }
              if (index === 4) {
                obj.attrs.rowSpan = 0
              }
              if (index === 5) {
                obj.attrs.rowSpan = 1
              }
              if (index === 6) {
                obj.attrs.rowSpan = 3
              }
              if (index === 7) {
                obj.attrs.rowSpan = 0
              }
              if (index === 8) {
                obj.attrs.rowSpan = 0
              }return obj
            },
          },
          {
            title: '代班工人',
            align: 'center',
            dataIndex:'shiftWorker',
          },
          {
            title: '代班验证',
            align: 'center',
            dataIndex:'shiftVerification',
          },
          {
            title: '代班相片',
            align: 'center',
            dataIndex:'shiftPhotos',
          },
          {
            title: '工人',
            align: 'center',
            dataIndex:'worker',
          },
          {
            title: '工人验证',
            align: 'center',
            dataIndex:'verification',
          },
          {
            title: '工人相片',
            align: 'center',
            dataIndex:'photos',
          },
        ],
        data,
        dataList: [],
      }
    },
    methods: {
      searchParams() {
        return this.queryParam
      },
      loadData (parameter) {
        return new Promise(resolve => {
          resolve({
            rows: data,
            total: data.length
          })
        })
      },
      show() {
        this.visible = true
      },
      handleSubmit() {
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
      },
      exportData() {

      },
      // 刷新
      refresh() {

      }
    }

  }
</script>

<style lang="scss" scoped>
  ::v-deep .table-style {
    .ant-card-body {
      padding: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body {
      margin: 0;
    }
  }
  ::v-deep .ant-table-small .ant-table-thead th{
    background-color: #eaeaea !important;
  }
  ::v-deep .ant-table-small{
    border: none
  }
  ::v-deep .ant-table-tbody > tr.select-row td{
    background-color: $primaryColor;
    color: white;
  }
  ::v-deep .ant-table-tbody > tr.select-row:hover td,
  ::v-deep .select-row.ant-table-row-hover td{
    background-color: $primaryColor;
    color: white;
  }
  .top-select-show{
    margin-left: -8px;
  }
  ::v-deep .table-select{
    .ant-card:nth-child(2){
      margin-top: 0 !important;
      .ant-card-body{
        padding-top: 0;
      }
    }
  }
</style>