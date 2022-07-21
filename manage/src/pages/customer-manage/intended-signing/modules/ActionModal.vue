<template>
  <!-- 客户资料 -->
  <a-modal
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="客户基本信息" forceRender>
          <base-info ref="BaseInfo" :type="modal_type"></base-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="客户其他信息" forceRender>
          <other-info ref="OtherInfo" :type="modal_type"></other-info>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="客户扩展信息" forceRender>
          <extend-info ref="ExtendInfo" :type="modal_type"></extend-info>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="项目成员" forceRender>
          <a-table
            rowKey="id"
            ref="Table"
            :columns="columns"
            :pagination="false"
            :dataSource="dataList">
            <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          </a-table>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import BaseInfo from '../../high-sea-pool-customer/modules/BaseInfo'
  import OtherInfo from '../../high-sea-pool-customer/modules/OtherInfo'
  import ExtendInfo from '../../high-sea-pool-customer/modules/ExtendInfo'
  import DeepenInfo from '../../high-sea-pool-customer/modules/DeepenInfo'
  import MoreInfo from '../../high-sea-pool-customer/modules/MoreInfo'

  export default {
    components:{
      BaseInfo,
      OtherInfo,
      ExtendInfo,
      DeepenInfo,
      MoreInfo
    },
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'intendedDetail' :
            return '客户资料'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: 'add',
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        baseInfo: null,
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '岗位名称',
            align: 'center',
            dataIndex:'text1',
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex:'text2',
          },
          {
            title: '部门',
            align: 'center',
            dataIndex:'text3',
          },
          {
            title: '手机号',
            align: 'center',
            dataIndex:'text4',
          },
        ],
        dataList: []
      }
    },
    methods: {
      add() {
        this.modal_type = 'add'
        this.visible = true
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.$refs.ExtendInfo.getCodeList(this.codeType)
          this.$refs.OtherInfo.getCodeList(this.codeType)
        })
      },
      edit(record , type) {
        this.modal_type = type
        this.visible = true
        this.getDetail(record.id)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.$refs.ExtendInfo.getCodeList(this.codeType)
          this.$refs.OtherInfo.getCodeList(this.codeType)
        })
      },
      // 获取详情
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.resourceCustomer.getDetail,
          params: { 
            id,
            menuId: this.$route.meta.id
          }
        }).then((res) =>{
          const data = { ...res }
          this.id = data.id
          this.$refs.BaseInfo.setData(data.customerBaseInfo)
          this.$refs.ExtendInfo.setData(data.customerSubsidiaryInfo)
          this.$refs.OtherInfo.setData(data.customerExtendInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const values = {
          customerBaseInfo: null,
          customerExtendInfo: null,
          customerSubsidiaryInfo: null,
          customerDeepInfo: null,
          customerOthersInfo: null,
        }
        this.$refs.BaseInfo.getData().then((res)=>{
          res.type = '1033-20'
          values.customerBaseInfo = res
          return this.$refs.OtherInfo.getData()
        }).then(res => {
          values.customerExtendInfo = res
          return this.$refs.ExtendInfo.getData()
        }).then(res => {
          values.customerSubsidiaryInfo = res
          return this.$refs.DeepenInfo.getData()
        }).then(res => {
          values.customerDeepInfo = res
          return this.$refs.MoreInfo.getData()
        }).then(res => {
          values.customerOthersInfo = res
          return  this.save(values)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      save(data) {
        data.id = this.id
        this.confirmLoading = true
        this.$post({
          url: this.$api.customInfo.resourceCustomer.edit,
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
      handleCancel() {
        this.$refs.BaseInfo.clearInput()
        this.$refs.ExtendInfo.clearInput()
        this.$refs.OtherInfo.clearInput()
        this.visible = false
        this.activeKey = ['1']
        this.isError = false
        this.id = ''
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>