<template>
  <a-row :grabbed="48">
    <a-col v-if="isShowClass" :span="8">
      <a-button type="primary" @click="addClass" style="margin:10px 0;">新增分类</a-button>
      <a-table 
        class="small-table"
        :rowKey="e => e.id || e.key"
        bordered
        :columns="classColumns"
        :pagination="false"
        :customRow="leftCustomRow"
        :dataSource="classData">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      </a-table>
    </a-col>
    <a-col :span="isShowClass? 16 : 24">
      <div style="padding-left: 10px;">
        <a-button type="primary" @click="addMaterial" style="margin:10px 0;">新增材料</a-button>
        <a-table 
          class="small-table"
          :rowKey="e => e.id || e.key"
          bordered 
          :columns="materialColumns"
          :pagination="false"
          :dataSource="materialData">
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        </a-table>
      </div>

    </a-col>
  </a-row>
</template>

<script>
  export default {
    name: 'SelectMaterials',
    props: {
      isShowClass: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      materialData(){
        return this.classData[this.right_index].materialData || []
      }
    },
    data () {
      return { 
        classColumns: [
          {
            title: '序号',
            dataIndex: 'serial',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '特项编码',
            align: 'center',
            dataIndex: 'code',
          }
        ],
        materialColumns: [
          {
            title: '序号',
            dataIndex: 'serial',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
        ],
        classData: [
          { 
            key: 1, 
            name: '主要材料',
            code: 'AB-S', 
            materialData: [
              {key: 11,name:'ABS1'},
              {key: 12,name:'ABS2'},
              {key: 13,name:'ABS3'},
              {key: 14,name:'ABS4'},
            ]
          },
          { key: 2, name: '主要材料',code: 'AB-S', materialData: [{key: 11,name:'ABSA'}] },
          { key: 3, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 4, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 5, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 6, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 7, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 8, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 9, name: '主要材料',code: 'AB-S', materialData: [] },
          { key: 10, name: '主要材料',code: 'AB-S', materialData: [] },
        ],
        right_index: 0
      }
    },
    methods: {
      addClass() {
      },
      addMaterial() {
      },
      leftCustomRow(record, index) {
        return {
        on: {
          click: (event) => {
            this.right_index = index
          }
        },
        class: { 'select-row': false}
      }
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 8px;
    }
    .ant-table-tbody > tr > td {
      padding: 5px;
    }
  }
</style>