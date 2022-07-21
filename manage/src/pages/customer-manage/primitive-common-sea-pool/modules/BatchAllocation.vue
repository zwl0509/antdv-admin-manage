<template>
  <a-modal
    :visible="visible"
    :width="1200"
    :title="modal_title"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        :showOperateButton="false"
        request-type="POST"
        :columns="columns"
        :request-url="requestUrl"
        :query-params="searchParams"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :scroll="{ y: 380 }"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
        <!-- <div slot="title" class="top-select-show">
          <span >已选用户：</span>
        </div> -->
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="编号">
              <a-input
                v-model="queryParam.employeeCode"
                autocomplete="off"
                placeholder="请输入编号"
                :max-length="30"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParam.employeeName"
                autocomplete="off"
                placeholder="请输入姓名"
                :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="部门">
              <a-input
                v-model="queryParam.organizationName"
                autocomplete="off"
                placeholder="请输入部门"
                :max-length="30"/>
            </a-form-item>
          </a-col>
        </template>
        <div>已选</div>
      </list-page>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'ReplacePersonnel',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 1 :
            return '批量分配'
          case 2 :
            return '分配'
          case 3 :
            return '批量指派'
          case 4 :
            return '指派人员'
          default:
            return ''
        }
      }
    },
    components: {
      ListPage
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        modal_type: 0,
        // 查询参数
        queryParam: {},
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
            dataIndex:'employeeName',
            scopedSlots: { customRender: 'employeeName' },
          },
          {
            title: '部门',
            dataIndex:'organizationName',
            scopedSlots: { customRender: 'organizationName' },
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
        customerIds: '',
        status: ''
      }
    },
    methods: {
      show (ids,status,type) {
        this.visible = true
        this.status = status
        this.customerIds = ids
        this.modal_type = type
        this.$refs.listPage && this.refresh()
      },
      searchParams () {
        return { ...this.queryParam }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      customRow (r) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [r.id]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': false }
        }
      },
      resetSearchForm () {
        this.queryParam = {}
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      handleSubmit () {
        this.confirmLoading = true
        const data = {
          customerIds: this.customerIds,
          assignor: this.selectedRowKeys[0],
          bindType: '1055-30',
          // type: this.status,
          status:'1054-20'
        }
        const url = this.modal_type == 1 || this.modal_type == 2 ? this.$api.customInfo.customerCommon.chooseCustomer : this.$api.customInfo.customerCommon.promote
        this.$post({
          url,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
        this.resetSearchForm()
        // this.refresh()
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .ant-table-thead > tr > th {
    padding: 10px;
  }
  ::v-deep .ant-table-tbody > tr > td {
    padding: 5px;
  }
</style>