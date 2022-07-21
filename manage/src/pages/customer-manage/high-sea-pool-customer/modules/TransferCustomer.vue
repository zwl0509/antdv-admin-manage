<template>
  <a-modal 
    :visible="visible"
    :width="800"
    :title="modal_title" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        :showOperateButton="false"
        request-type="GET"
        :columns="columns"
        :request-url="requestUrl"
        :query-params="searchParams"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :scroll="{ y: 360 }"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange ,getCheckboxProps: getCheckboxProps}">
        <template slot="$search">
          <a-col :md="8" :sm="24">
            <a-form-item label="部门编号">
              <a-input
                v-model="queryParam.code"
                autocomplete="off"
                placeholder="请输入编号"
                :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="部门名称">
              <a-input
                v-model="queryParam.name"
                autocomplete="off"
                placeholder="请输入部门"
                :max-length="30"/>
            </a-form-item>
          </a-col>
        </template>
      </list-page>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'TransferCustomer',
    components: {
      ListPage
    },
    data () {
      return {
        modal_type: 0,
        visible: false,
        loading: false,
        // 查询参数
        queryParam: {
          isStore: 1
        },
        requestUrl: this.$api.organization.getListPage,
        // 表头
        columns:[
          {
            title: '序号',
            width: 120,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '部门编号',
            dataIndex:'code',
          },
          {
            title: '部门名称',
            dataIndex:'name',
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 0 :
            return '移交客户选择'
          case 1 :
            return '选择门店'
          default:
            return ''
        }
      }
    },
    methods: {
      show (ids, type) {
        this.visible = true
        this.ids = ids
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
              if(r.isStore) {
                this.selectedRowKeys = [r.id]
                this.selectedRows = [r]
                this.selectedRows = [r]
              }
            }
          },
          class: { 'select-row': false }
        }
      },
      getCheckboxProps:(record)=> {
        return {
          props: {
            disabled: !record.isStore,
          },
        }
      },
      handleSubmit () {
        if(this.modal_type == 0) {
          const data = {
            ids: this.ids,
            storeId: this.selectedRowKeys[0],
          }
          this.save(data)
        }else {
          const data = {
            orgId: this.selectedRows[0].id,
            orgName: this.selectedRows[0].name
          }
          this.handleCancel()
          this.$emit('getOrg',data)
        }
      },
      save(data) {
        this.loading = true
        this.$post({
          url: this.$api.customInfo.highSeaPoolCustomer.handoverCustomer,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: '移交成功',
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      resetSearchForm () {
        this.queryParam = {
          isStore: 1
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
</style>