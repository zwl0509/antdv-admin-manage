<template>
  <a-modal
    :visible="visible"
    :width="800"
    title="选择抄送人"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-pages
        ref="listPage"
        class="table-style"
        @resetParams="resetSearchForm"
        :request-url="requestUrl"
        :show-search="false"
        :loadAfterRender="afterLoad"
        :columns="columns"
        :rowSelection="{ fixed: true, columnWidth: 40, selectedRowKeys: selectedRowKeys, onChange: onChange, onSelect: onSelect, onSelectAll: onSelectAll}"
        :query-params="queryParam"
        :scroll="{ y: 360 }"
      >
        <template slot="$operate">
          <a-alert style="margin-bottom: 16px">
            <template slot="message">
              <span style="margin-right: 12px">已选择: <a style="font-weight: 500">{{ selectedRowKeys.length }}</a></span>
              <span style="margin-right: 12px"><a style="font-weight: 500" @click="() => {selectedRowKeys = [],selectedRows = []}">清空</a></span>
            </template>
          </a-alert>
        </template>
      </list-pages>
    </a-spin>
  </a-modal>
</template>

<script>
  import ListPages from '@/components/ListPages'
  export default {
    components: {
      ListPages
    },
    name: 'ReminderSelect',
    data () {
      return {
        visible: false,
        loading: false,
        queryParam: {
        },
        requestUrl: this.$api.employeeManage.employeeInfo.getEasyList,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '编号',
            width: 120,
            dataIndex:'employeeCode',
          },
          {
            title: '姓名',
            width: 200,
            dataIndex:'employeeName',
            scopedSlots: {
              showSearch: {
                title: '姓名',
                type: 'input'
              }
            }
          },
          {
            title: '部门',
            dataIndex:'organizationName',
            scopedSlots: {
              showSearch: {
                title: '部门',
                type: 'input'
              }
            }
          },
        ],
        dataList: [],
        customerId:'',
        selectedRowKeys:[],
        selectedRows: [],
      }
    },
    methods: {
      add (id) {
        this.visible = true
        this.customerId = id
        this.$refs.listPage && this.refresh()
      },
      edit (selectedIds,id) {
        this.visible = true
        this.customerId = id
        this.selectedRowKeys = selectedIds
        this.$refs.listPage && this.refresh()
      },
      onChange(ids, record) {
        this.selectedRowKeys = ids
      },
      onSelect (record, selected) {
        if (selected) {
          this.selectedRows.push({ ...record })
        } else {
          this.selectedRows.splice(this.selectedRows.findIndex(m => m.id === record.id), 1)
        }
      },
      onSelectAll (selected, selectedRows, changeRows) {
        if (selected) {
          changeRows.forEach(record => {
            this.selectedRows.push({ ...record })
          })
        } else {
          changeRows.forEach(record => {
            this.selectedRows.splice(this.selectedRows.findIndex(m => m.id === record.id), 1)
          })
        }
      },
      afterLoad (res) {
        this.dataList = res.rows || []
        return res
      },
      handleSubmit () {
        const data = {
          reminders: this.selectedRowKeys,
          remindersList: this.selectedRows
        }
        this.$emit('getReminders',data)
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      searchParams () {
        return { ...this.queryParam }
      },
      resetSearchForm () {
        this.queryParam = {
        }
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .ant-table-thead > tr > th {
    padding: 10px;
  }

  ::v-deep .ant-table-tbody > tr > td {
    padding: 10px;
  }
  ::v-deep .table-style {
    .ant-card-body {
      padding: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body {
      margin: 0;
    }
  }
</style>