<template>
  <a-modal
    :visible="visible"
    :width="800"
    title="编辑施工计划表"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <a-table
        rowKey="id"
        class="small-table"
        ref="Table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList"
        :rowSelection="{ fixed: false, columnWidth: 40, type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps}"
        :scroll="{ y : 550 }">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
        <span slot="ellipsis" slot-scope="text">
          <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
        </span>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'PlanTable',
    components: { Ellipsis },
    data () {
      return {
        visible: false,
        loading: false,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            align: 'center',
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '任务名称',
            align: 'center',
            width: 150,
            dataIndex: 'taskName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '工期',
            align: 'center',
            width: 60,
            dataIndex: 'duration'
          },
          {
            title: '前置任务',
            align: 'center',
            width: 150,
            dataIndex: 'startTaskName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '并行任务',
            align: 'center',
            width: 150,
            dataIndex: 'endTaskName',
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '是否关键节点',
            dataIndex: 'isRequired',
            align: 'center',
            scopedSlots: {customRender: 'switch'}
          },
        ],
        dataList: [],
        selectedRowKeys: [],
        selectedRows: [],
        startDate: null,
        templateId: '',
      }
    },
    methods: {
      edit (data,ids) {
        this.visible = true
        this.startDate = data.startDate
        this.templateId = data.templateId
        this.getTemplateDetail(data.templateId, ids)
      },
      // 查看编辑施工计划表
      detailEdit(list) {
        this.visible = true
        this.templateId = list[0].constructionTemplateId
        this.startDate = list[0].estimateStartTime
        const ids = []
        const disableIds = []
        list?.forEach(item => {
          ids.push(item.basicConstructionTaskId)
          if(item.actualStartTime) {
            disableIds.push(item.basicConstructionTaskId)
          }
        })
        this.getTemplateDetail(this.templateId, ids, disableIds)
      },
      /**
       * @param id 模版ID
       * @param ids 已选中的ID
       * @param disableIds 不可选的ID
       */
      getTemplateDetail(id, ids ,disableIds) {
        this.$get({
          url: this.$api.construction.basicConstructionTemplateInfo.getDetail,
          params: {id}
        }).then(res => {
          const data = { ...res } 
          this.dataList = data.constructionTaskDetailVOS || []
          const selectIds = []
          this.dataList.forEach(item=> {
            if(item.isRequired) {
              selectIds.push(item.id)
            }
          })
          this.selectedRowKeys = [...new Set(selectIds.concat(ids))]
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.loading = false })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys =  [...new Set(selectedRowKeys)]
        this.selectedRows = selectedRows
      },
      getCheckboxProps(record){
        return {
          props: {
            disabled: record.isRequired,
            defaultChecked: record.isRequired
          }
        }
      },
      handleSubmit () {
        const newList = []
        this.dataList.forEach(item=> {
          this.selectedRowKeys.forEach(info=> {
            if(item.id == info ) {
              newList.push(item)
            }
          })
        })
        this.save(newList)
      },
      // 保存选中的施工任务，并生成gantt数据
      save(data) {
        this.loading = true
        this.$post({
          url: this.$api.construction.customerConstructionTaskInfo.createGanttList,
          data: {
            startDate: this.startDate,
            detailVOS: data,
            templateId: this.templateId
          }
        }).then((res)=> {
          // 编辑施工计划，传递保存参数 params
          const params = {
            templateId: this.templateId
          }
          this.$emit('getTaskInfo', res, params)
          this.handleCancel()
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.loading = false })
      },
      handleCancel () {
        this.visible = false
        this.loading = false
        this.templateId = ''
        this.startDate = null
        this.dataList = []
        this.selectedRowKeys = []
        this.selectedRows = []
      }
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