<template>
  <!-- 单据列表 -->
  <a-modal
    title="单据列表"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-table
        rowKey="id"
        ref="Table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-if="record.status === '1097-20'" @click="$refs.DocumentDetail.edit(record,'detail',customerId)">单据详情</a>
            <a v-else @click="$refs.DocumentDetail.edit(record,'edit',customerId)">编辑单据</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a @click="$refs.ActionModal.show(record)">查看状态</a>
            <br/>
          </template>
        </span>
      </a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <!--单据明细-->
    <document-detail ref="DocumentDetail" @ok="handleOk"></document-detail>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import DocumentDetail from './DocumentDetail'

  export default {
    components:{ DocumentDetail },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '单据号',
            align: 'center',
            dataIndex:'materialDeclarationNo',
          },
          {
            title: '单据状态',
            align: 'center',
            dataIndex:'statusName',
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            width: 200,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataList: [],
        customerId: '',
      }
    },
    methods: {
      show(record,type) {
        this.customerId = record.id
        this.visible = true
        this.getDetail(record.id,type)
      },
      // 获取详情
      getDetail(customerId,type) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.materialDeclare.auxiliaryMaterialsInfo.getDeclarationList,
          params: {
            customerId,type
          }
        }).then((res) =>{
          this.dataList = res.rows
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {},
      handleOk(){
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
        this.isError = false
        this.id = ''
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>