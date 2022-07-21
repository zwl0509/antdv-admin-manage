<template>
  <a-modal 
    :visible="visible"
    :width="1200"
    title="已选材料" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false">
    <a-table
      rowKey="id"
      class="checked-table"
      :columns="columns"
      :data-source="dataList"
      :pagination="false"
      :scroll="{x: 2500, y: 520 }">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <template slot="areas" slot-scope="text, record">
        <a-select
          mode="multiple"
          style="width: 180px"
          placeholder="请选择所属区域"
          allowClear
          showArrow
          disabled
          v-if="status === 'edit'"
          v-model="record.area"
          @change="update">
          <a-select-option v-for="(item, index) in areaList" :key="index" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-select
          mode="multiple"
          style="width: 180px"
          placeholder="请选择所属区域"
          allowClear
          showArrow
          v-else
          v-model="record.areas"
          @change="update">
          <a-select-option v-for="(item, index) in areaList" :key="index" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="type" slot-scope="text, record">
        <a-select
          style="width: 180px"
          placeholder="请选择材料类型"
          allowClear
          showArrow
          :disabled="status === 'edit'"
          v-model="record.type"
          @change="update">
          <a-select-option v-for="(item, index) in materialList" :key="index" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="color" slot-scope="text, record">
        <a-select
          style="width: 120px"
          placeholder="请选择颜色"
          allowClear
          showArrow
          v-model="record.color"
          :disabled="status === 'edit'"
          @change="update">
          <a-select-option v-for="(item, index) in colorList" :key="index" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </template>
      <template slot="pavingLocation" slot-scope="text, record">
        <a-input v-model="record.pavingLocation" placeholder="请输入铺装位置" @change="update" :max-length="30"/>
      </template>
      <template slot="isMeasure" slot-scope="text, record">
        <a-switch checked-children="是" un-checked-children="否" v-model="record.isMeasure" />
      </template>
      <template slot="forecast" slot-scope="text, record">
        <a-input v-model="record.forecast" placeholder="请输入预估量" @change="update" :max-length="9"/>
      </template>
      <template slot="remark" slot-scope="text, record">
        <a-textarea auto-size v-model="record.remark" placeholder="请输入备注" @change="update" :max-length="30"/>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record, index">
        <a-popconfirm title="是否要删除此行？" @confirm="handleDelete(index)">
          <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
  const columnX = [
    {
      title: '序号',
      width: 60,
      align:'center',
      scopedSlots: { customRender: 'serial' },
    },
    {
      title: '操作',
      align:'center',
      width: 60,
      scopedSlots: { customRender: 'action'}
    },
    {
      title: '材料名称',
      dataIndex:'materialName',
      align:'center',
      width: 200,
      scopedSlots: { customRender: 'ellipsis' },
    },
    {
      title: '所属区域*',
      align:'center',
      width: 200,
      scopedSlots: { customRender: 'areas' },
    },
    {
      title: '铺装位置',
      align:'center',
      width: 140,
      scopedSlots: { customRender: 'pavingLocation' },
    },
    {
      title: '颜色*',
      align:'center',
      width: 140,
      scopedSlots: { customRender: 'color' },
    },
    {
      title: '材料类型',
      align:'center',
      width: 200,
      scopedSlots: { customRender: 'type' },
    },
    {
      title: '是否测量',
      align:'center',
      width: 140,
      scopedSlots: { customRender: 'isMeasure' },
    },
    {
      title: '预估量',
      align:'center',
      width: 120,
      scopedSlots: { customRender: 'forecast' },
    },
    {
      title: '备注',
      align:'center',
      width: 200,
      dataIndex: 'remark',
      scopedSlots: { customRender: 'remark' }
    },
    {
      title: '材料价格',
      dataIndex:'salePrice',
      align:'center',
    },
    {
      title: '材料规格',
      dataIndex:'spec',
      align:'center',
    },
    {
      title: '材料单位',
      dataIndex:'unit',
      align:'center',
    },
    {
      title: '品牌',
      dataIndex:'brand',
      align:'center',
    },
    {
      title: '型号',
      dataIndex:'materialType',
      align:'center',
    },
    {
      title: '类别系列',
      dataIndex:'typeSerial',
      align:'center',
    },
  ]
  import labels from '@/utils/labels'
  import { deepClone } from '@/utils/util'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import { defaultErrorMessage } from '@/utils/common'

  export default {
    name: 'CheckedMaterial',
    components: {
      Ellipsis,
    },
    data () {
      return {
        visible: false,
        columns: columnX,
        dataList: [],
        areaList: [],
        colorList: [],
        materialList:[],
        customerId:'',
        materialId:'',
        addType:'',
        id:'',
        record:[],
        status:'',
      }
    },
    methods: {
      show (customerId,list,type) {
        this.addType = type
        this.customerId = customerId
        this.finalPrice = list[0].salePrice
        this.materialId = list[0].id
        this.visible = true
        this.dataList = deepClone(list)
        this.getCode()
      },
      edit (list,type,record,status) {
        this.addType = type
        this.finalPrice = list[0].salePrice
        this.materialId = list[0].id
        this.customerId = record.customerId
        this.id = record.id
        this.visible = true
        this.status = status
        this.dataList = [record]

        this.getCode()
      },
      getCode() {
        const params = { 
          typeList: ['1086','1089']
        }
        this.$getCodesList(params, res => {
          this.areaList = res['1086'] || [] // 性别
          this.materialList = res['1089'] || [] // 性别
        })
      },
      update() {
        this.$forceUpdate()
        // setTimeout(()=> {
        //   this.$forceUpdate()
        // },1000)
      },
      handleDelete(index) {
        this.dataList.splice(index,1)
      },
      handleSubmit () {
        if (this.status){
          this.dataList.forEach(el => {
            el.customerId = this.customerId
            el.addType = this.addType
            el.materialId = this.materialId
            el.finalPrice = this.finalPrice
            el.id = this.id
          } )
          this.save(this.dataList)
        }else {
          let flag = true
          for (let i = 0; i < this.dataList.length; i++) {
            if(!this.dataList[i].areas?.length) {
              this.$notification.warning({
                message: '提示',
                description: `第${i + 1}项，请选择所属区域！！！`
              })
              flag = false
              break
            }
          }
          this.dataList.forEach(el => {
            el.customerId = this.customerId
            el.addType = this.addType
            el.materialId = this.materialId
            el.finalPrice = this.finalPrice
            el.id = ''
          } )
          if(flag) this.save(this.dataList)
        }
      },
      save(data){
        this.$post({
          url: this.$api.customInfo.chooseMaterialInfo.edit,
          data
        }).then(res => {
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res?.message || ''
          })
        })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleCancel () {
        this.visible = false
        this.dataList = []
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .checked-table {
    .ant-table-thead > tr > th {
      padding: 8px;
    }
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
</style>