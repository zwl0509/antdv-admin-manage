<template>
  <a-table
    rowKey="id"
    ref="Table"
    :columns="columns"
    :pagination="false"
    :dataSource="dataList">
    <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
  </a-table>
</template>

<script>
  export default {
    name: 'ProjectMenber',
    data () {
      return {
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 80,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '岗位名称',
            align: 'center',
            dataIndex:'positionName',
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex:'employeeName',
          },
          {
            title: '部门',
            align: 'center',
            dataIndex:'organizationName',
          },
          {
            title: '手机号',
            align: 'center',
            dataIndex:'mobileNumber',
          },
        ],
        dataList: []
      }
    },
    methods: {
      getData(data) {
        this.dataList = data
      },
      setData(data) {
        this.dataList = data
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>