<template>
  <a-modal
    :title="type == '10' ? '批量期房客户' : '批量保留客户' "
    :width="900"
    :centered="true"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-table rowKey="id" class="small-table" :dataSource="dataList" :columns="columns" :pagination="false" :scroll="{ y: 450 }">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="infoShow" slot-scope="text,record"> {{ record.infoShow ? record.customerName : record.customerNameHide }}</span>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
    </a-table>
    <!-- 批量 => 期房 保留 -->
    <future-house-apply ref="FutureHouseApply" @ok="handleOk"></future-house-apply>
  </a-modal>
</template>

<script>
  import { Ellipsis } from '@/components'
  import FutureHouseApply from '@/pages/customer-manage/primitive-common-sea-pool/modules/FutureHouseApply'

  export default {
    name: 'BatchAction',
    components: { Ellipsis, FutureHouseApply},
    data () {
      return {
        visible: false,
        type: '',
        dataList: [],
        columns: [
          {
            dataIndex: 'serial',
            title: '序号',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            scopedSlots: { customRender: 'infoShow' }
          },    
          {
            title: '性别',
            align: 'center',
            dataIndex: 'genderName'
          },
          {
            title: '小区',
            align: 'center',
            dataIndex: 'areaNamePath',
            width: 200,
            scopedSlots: { customRender: 'ellipsis'}
          },
          {
            title: '户型',
            align: 'center',
            dataIndex: 'roomTypeName'
          },
          {
            title: '了解公司途径',
            align: 'center',
            dataIndex: 'knowCoWayName'
          },
        ]
      }
    },
    methods: {
      show(type, list){
        this.type = type
        const data = []
        if(type == '10') {
          list.forEach(item=> {
          if(!item.future && !item.onFuture) {
              data.push(item)
            }
          })
        }else {
          list.forEach(item=> {
            if(!item.onRefluxed) {
              data.push(item)
            }
          })
        }
        this.dataList = data
        this.visible = true
      },
      handleSubmit(){
        const ids = []
        if(this.type == '10') {
          this.dataList.forEach(item=> { ids.push(item.id) })
          this.$refs.FutureHouseApply.show(ids,'1056-20',2)
        }else {
          this.dataList.forEach(item=> { ids.push(item.bindId) })
          this.$refs.FutureHouseApply.show(ids,'1056-10',1)
        }
      },
      handleOk() {
        this.handleCancel()
        this.$emit('ok')
      },
      handleCancel(){
        this.type = ''
        this.dataList = []
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>