<template>
  <a-modal 
    title="自定义列"
    :visible="visible"
    :width="800"
    :centered="true" 
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <draggable v-model="new_columns" draggable=".item" animation="300" filter=".forbid" :move="onMove">
      <div slot="header" class="all-or-reset">
        <a-checkbox :indeterminate="indeterminate" v-model="checkAll" @change="onCheckAllChange">
          <span>全部</span> /
        </a-checkbox>
        <a @click="resetColumns" style="font-size: 18px">重置</a>
        <a-divider style="margin: 10px 0;" />
      </div>
      <div v-for="(item , index) in new_columns" :key="index" :class="index == 0 || new_columns.length == index + 1 ? 'item forbid' : 'item' ">
        <div>
          <a-checkbox v-model="item.checked" :disabled="index == 0 || new_columns.length == index + 1" @change="onChange" style="margin-right: 10px;"/>
          <span>{{ item.title }}</span>
        </div>
        <div>宽度：<a-input v-model="item.width" style="width: 70px" :disabled="index == 0 || new_columns.length == index + 1"></a-input> px</div>
      </div>
    </draggable>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import draggable from 'vuedraggable'
  import { deepClone } from '@/utils/util'

  export default {
    name: 'TableItem',
    components: {
      draggable,
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        new_columns: [],
        init_columns: [],
        indeterminate: false,
        checkAll: false,
        checkedList:[],
        columns_name: ''
      }
    },
    methods: {
      show (columnX, init_columns, columns_name) {
        this.visible = true
        this.init_columns = init_columns // 原始表头
        this.getColumnX(deepClone(columnX),columns_name)
      },
      // 获取自定义列
      getColumnX (columnX,type) {
        this.$get({
          url: this.$api.columnXManage.getColumnX,
          params: { type }
        }).then((res)=>{
          const list = res?.columnX || []
          const selectList = list?.filter(item=>item.checked)
          if(selectList.length == list.length ) {
            this.checkAll = true
          }else {
            this.indeterminate = true
          }
          this.new_columns = list.length ? list : columnX
          this.columns_name = type
        }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
          .finally(() => {this.confirmLoading = false })
      },
      onCheckAllChange(e) {
        if(this.checkAll) {
          this.new_columns.forEach(el=>{
            this.indeterminate = false
            el.checked = true
          })
        }else {
          this.new_columns.forEach((el,index)=>{
            if(index == 0 || this.new_columns.length == index + 1){
              this.indeterminate = true
              el.checked = true
            }else {
              el.checked = false
            }
          })
        }
      },
      onChange(e) {
        console.log(e)
        const selectList = this.new_columns?.filter(item=>item.checked)
        if(selectList.length == this.new_columns.length) {
          this.indeterminate = false
          this.checkAll = true
        }else {
          this.indeterminate = true
          this.checkAll = false
        }
      },
      onMove (e) {
        if(e.relatedContext.index == 0) return false
        if(e.relatedContext.index + 1 == this.new_columns.length ) return false
        return true
      },
      handleSubmit() {
        this.new_columns.forEach(item=>{
          if(item.width) {
            item.width = Number(item.width)
          }else {
            delete item.width
          }
        })
        const data = {
          type: this.columns_name,
          columnX: this.new_columns
        }
        this.save(data)
      },
      // 重置列
      resetColumns() {
        const list = deepClone(this.init_columns)
        list.forEach(ele=>{
          ele.checked = true
        })
        this.checkAll = true
        this.indeterminate = false
        this.new_columns = list
      },
      save(data) {
        this.confirmLoading = true
        this.$post({
          url: this.$api.columnXManage.editColumnx,
          data,
          needResponse: true
        }).then((res)=> {
          this.$emit('getNewColumns',this.new_columns)
          this.handleCancel()
          this.$notification.success({
            message:labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err,labels.SAVE_FAIL))
          .finally(() => {this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.new_columns = []
      }
    }
  }
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  height: 50px;
  font-size: 16px;
  background-color: #fAfAfA;
  margin-bottom: 5px;
  border: solid 1px #eee;
  border-radius: 6px;
  cursor: pointer;
} 
.header-action {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
}
.forbid {
  cursor: not-allowed;
  background: #EFEFEF;
}
/*选中样式*/
.chosen {
  border: solid 1px #3089dc !important;
}
::v-deep .all-or-reset {
  .ant-checkbox-wrapper {
    font-size: 18px;
  }
  a {
    color: #b80201;
  }
}

</style>