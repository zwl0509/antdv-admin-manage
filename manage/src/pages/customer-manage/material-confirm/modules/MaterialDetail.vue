<template>
  <!-- 材料明细 -->
  <a-modal
    title="材料明细"
    :width="800"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-table
        rowKey="BillDetailId"
        ref="Table"
        class="small-table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList"
        :scroll="{ x: 2000 }">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="ellipsis" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>
      </a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'MaterialDetail',
    components: { Ellipsis },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'MaterialName',
            scopedSlots: { customRender: 'ellipsis' }

          },
          {
            title: '规格',
            align: 'center',
            dataIndex: 'Spec',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '数量',
            align: 'center',
            dataIndex: 'SaleNum',
          },
          {
            title: '型号',
            align: 'center',
            dataIndex: 'MaterialType',
          },
          {
            title: '颜色',
            align: 'center',
            dataIndex: 'Color',
          },
          {
            title: '材质',
            align: 'center',
            dataIndex: 'Texture',
          },
          {
            title: '品牌',
            align: 'center',
            dataIndex: 'Brand',
          },
          {
            title: '类别系列',
            align: 'center',
            dataIndex: 'TypeSeial',
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'Remark',
          },
        ],
        dataList: []
      }
    },
    methods: {
      show(record) {
        this.visible = true
        this.getDetail(record.BillMasterID)
      },
      // 获取材料明细
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.materialConfirmInfo.getBillMasterDetail,
          params: { billMasterId: id }
        }).then((res) =>{
          const list = [ ...res ]
          this.dataList = list
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
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