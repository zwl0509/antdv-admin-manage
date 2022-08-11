import T from 'ant-design-vue/es/table/Table'
import MsAlert from './MsTableAlert'
import MsPagination from '@/components/MSTable/MsPagination'
import MsTableHeaderSearch from '@/components/MSTable/MsTableHeaderSearch'

export default {
  name: 'TableMixins',
  props: {
    ...Object.assign({}, T.props),
    pagination: {
      type: Object,
      default: () => {
        return {
          current: 1,
          pageSize: 20,
        }
      }
    }
  },
  mixins: [
    MsTableHeaderSearch,
    MsPagination,
    MsAlert
  ],
  watch: {
    columns: {
      handler (v) {
        v && (this.localColumns = v)
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      selectedRows: [],
      selectedRowKeys: [],
      localLocale: null,
      localLoading: false,
      localDataSource: [],
      localColumns: [],
      localPagination: null
    }
  },
  created() {
    if (this.createdLoad) this.refresh()
  },
  methods: {

    // 表格区域
    renderTable (slots) {
      const props = {
        size: this.size || 'middle'
      }
      const { alert } = this
      const localKeys = Object.keys(this.$data)
      const showAlert = (typeof alert === 'object' && alert !== null && alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || alert

      Object.keys(T.props).forEach(k => {
        const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
        if (localKeys.includes(localKey)) {
          props[k] = this[localKey]
          return props[k]
        }
        if (k === 'rowSelection') {
          if (showAlert && this.rowSelection) {
            // 如果需要使用alert，则重新绑定 rowSelection 事件
            props.rowSelection = {
              ...this.rowSelection,
              selectedRows: this.selectedRows,
              selectedRowKeys: this.selectedRowKeys,
              onSelect: (record, selected) =>{
                const selectedRowKeys = JSON.parse(JSON.stringify(this.selectedRowKeys))
                const selectedRows = JSON.parse(JSON.stringify(this.selectedRows))
                if (selected) {
                  selectedRowKeys.push(record[this.rowKey])
                  selectedRows.push(record)
                } else {
                  selectedRowKeys.forEach((item, index)=>{
                    if (item === record[this.rowKey]) {
                      selectedRowKeys.splice(index, 1)
                    }
                  })
                  selectedRows.forEach((item, index)=>{
                    if (item[this.rowKey] === record[this.rowKey]) {
                      selectedRows.splice(index, 1)
                    }
                  })
                }
                this.updateSelect(selectedRowKeys, selectedRows)
                typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
              },
              onSelectAll:(selected, selectedRows, changeRows)=> {
                const localSelectedRowKeys = JSON.parse(JSON.stringify(this.selectedRowKeys))
                const localSelectedRows = JSON.parse(JSON.stringify(this.selectedRows))
                changeRows.forEach(item=>{
                  if(selected){
                    localSelectedRowKeys.push(item[this.rowKey])
                    localSelectedRows.push(item)
                  }else {
                    localSelectedRowKeys.forEach((key_item, key_index)=>{
                      if (key_item === item[this.rowKey]) {
                        localSelectedRowKeys.splice(key_index, 1)
                      }
                    })
                    localSelectedRows.forEach((row_item, row_index)=>{
                      if (row_item[this.rowKey] === item[this.rowKey]) {
                        localSelectedRows.splice(row_index, 1)
                      }
                    })
                  }
                })
                this.updateSelect(localSelectedRowKeys, localSelectedRows)
                typeof this[k].onChange !== 'undefined' && this[k].onChange(localSelectedRowKeys, localSelectedRows)
              },
              onChange: (selectedRowKeys, selectedRows) => {
                // this.updateSelect(selectedRowKeys, selectedRows)
                typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
              }
            }
            return props.rowSelection
          } else if (!this.rowSelection) {
            // 如果没打算开启 rowSelection 则清空默认的选择项
            props.rowSelection = null
            return props.rowSelection
          }
        }
        this[k] && (props[k] = this[k])
        return props[k]
      })
      props.pagination = false

      if (!this.outSearch) this.initHeaderSearch()

      if (!this.$scopedSlots.serial || !this.$scopedSlots) {
        if (!this.$scopedSlots) this.$scopedSlots = {}
        this.$scopedSlots.serial = (t, r, index) => (<span>{(this.localPagination.pageSize * (this.localPagination.current - 1)) + (index + 1)}</span>)
        this.$scopedSlots.serialSingle = (t, r, index) => { return (<span>{ index + 1 }</span>)}
      }

      const table = (
        <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.tableChange}
                 onExpand={(expanded, record) => {
                   this.$emit('expand', expanded, record)
                 }}>
          {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
        </a-table>
      )

      return (<div className="page-table-wrapper">
        { showAlert ? this.renderAlert() : null }
        { table }
        {this.localPagination ? this.renderPagination() : null}
      </div>)
    }
  }
}