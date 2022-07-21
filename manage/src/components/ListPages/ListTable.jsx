import T from 'ant-design-vue/es/table/Table'
// import get from 'lodash.get'
import labels from '@/utils/labels'
import get from 'lodash.get'
import moment from 'moment'

export default {
  data () {
    return {
      needTotalList: [],
      selectedRows: [],
      selectedRowKeys: [],
      localLocale: null,
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination || {}),
      localColumns: []
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * 创建时是否加载数据，默认：true
     */
    createdLoadData: {
      type: Boolean,
      default: true
    },
    /**
     * 数据加载后处理，可返回值类型：Object, Promise
     */
    loadAfterRender: {
      type: Function,
      default: null
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },

    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showSearchHeader: {
      type: Boolean,
      default: true
    }
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    // pageURI: {
    //   type: Boolean,
    //   default: false
    // }
  }),
  watch: {
    // 'localPagination.current' (val) {
    //   this.pageURI && this.$router.push({
    //     ...this.$route,
    //     name: this.$route.name,
    //     params: Object.assign({}, this.$route.params, {
    //       pageNo: val
    //     })
    //   })
    // },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize (val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    },
    columns (val){
      if(val) {
        this.localColumns = val
      }
    },
  },
  created () {
    const { pageNo } = this.$route.params
    const localPageNum = this.pageURI && (pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger,
      showTotal: (total)=>{
        return (<div style="text-align:center;line-height: 32px;">
          共{total}条
        </div>)
      }
    }) || false
    if (this.columns && this.columns.length) {
      this.localColumns = [...this.columns]
      this.localColumns.map(m => {
        !m.align && (m.align = 'center')
      })
    }
    this.needTotalList = this.initTotalList(this.columns)
    this.createdLoadData && this.loadData()
  },
  methods: {
    reset() {
      this.localDataSource = []
      this.localPagination.total = 0
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, pageSize: this.pageSize
      }))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true
      this.localLocale = null
      const parameter = Object.assign({
          currentPage: (pagination && pagination.current) ||
            this.showPagination && this.localPagination.current || this.pageNum,
          pageSize: (pagination && pagination.pageSize) ||
            this.showPagination && this.localPagination.pageSize || this.pageSize
        },
        (sorter && sorter.field && {
          sortField: sorter.field
        }) || {},
        (sorter && sorter.order && {
          sortOrder: sorter.order
        }) || {}
        // , {
        //   ...filters
        // }
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.rows
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          if (this.loadAfterRender && typeof this.loadAfterRender === 'function') {
            const afterData = this.loadAfterRender(r)
            if (afterData instanceof Promise) {
              afterData.then(res => {
                this.localDataSource = res.rows
              })
            }
            if (afterData.rows) {
              this.localDataSource = afterData.rows
            }
          } else {
            this.localDataSource = r.rows // 返回结果中的数组数据
          }
          this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
            current: (pagination && pagination.current) ||
              this.showPagination && this.localPagination.current || this.pageNum, // 返回结果中的当前分页数
            total: r.total, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          }) || false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.rows && r.rows.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if ((['auto', true].includes(this.showPagination) && r.totalCount <= (r.pageNo * this.localPagination.pageSize))) {
              this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            this.localPagination = false
          }
          this.localDataSource = this.delEmptyChildren(this.localDataSource)
          if (!this.localDataSource.length) {
            this.localLocale = this.tablenodata('暂无数据 No Data')
          } else {
            this.localLocale = null
          }
          this.localLoading = false
        }).catch(err => {
          this.localLocale = {
            emptyText: err && err.message || labels.RESPONSE_RESULT_EXCEPTION
          }
          this.localDataSource = [] // 返回结果中的数组数据
          this.localPagination.total = 0
          this.localPagination.current = 1
          this.localLoading = false
        })
      }
    },
    tablenodata(msg) {
      return {
        emptyText: () => (
          <a-empty description={msg} />
        )
      }
    },
    delEmptyChildren(node) {
      node.forEach(item => {
        if (item.children) {
          if (!item.children.length) {
            delete item.children
          } else {
            this.delEmptyChildren(item.children)
          }
        }
      })
      return node
    },
    initTotalList (columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },

    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    renderAlert () {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {item.title}总计 <a
          style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
        </span>)
      })

      // 绘制 清空 按钮
      const clearItem = (typeof this.alert.clear === 'boolean' && this.alert.clear) ? (
        this.renderClear(this.clearSelected)
      ) : (this.alert !== null && typeof this.alert.clear === 'function') ? (
        this.renderClear(this.alert.clear)
      ) : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{this.selectedRows.length}</a></span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },
    // 表头搜索
    initHeaderSearch() {
      if (this.showSearchHeader) {
        !this.$scopedSlots && (this.$scopedSlots = {})
        this.localColumns.forEach((m,i)=>{
          if (m.scopedSlots && m.scopedSlots.showSearch) {
            m.scopedSlots.filterDropdown = 'filterDropdown'
            m.scopedSlots.filterIcon = 'filterIcon'
            if (m.scopedSlots.showSearch.type === 'input'){
              m.onFilterDropdownVisibleChange = visible => {
                if (visible) {
                  setTimeout(() => {
                    this.$refs.headerSearch.focus()
                  }, 0)
                }
              }
            }
          }
          return m
        })
        const searchStyle = 'width: 100%; margin-bottom: 8px; display: block;'
        const type_list = {
          'input': (data, showSearch)=>{
            return (<a-input
              ref="headerSearch"
              placeholder={`搜索${showSearch.title}`}
              value={data.selectedKeys[0]}
              style={searchStyle}
              onChange={e => data.setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(data.selectedKeys, data.confirm, showSearch.key || data.column.dataIndex, scopedSlots.showSearch.type)}
            />)
          },
          'select': (data, showSearch)=>{
            return (<a-select
              ref="headerSearch"
              placeholder={`选择${showSearch.title}`}
              value={data.selectedKeys[0]}
              style={searchStyle}
              onChange={e => data.setSelectedKeys(e || e === 0 ? [e] : [])}
              onPressEnter={() => this.handleSearch(data.selectedKeys, data.confirm, showSearch.key || data.column.dataIndex, scopedSlots.showSearch.type)}
            >
              {showSearch.selectList.map((m, i)=>{
                return (<a-select-option value={ m[showSearch.value] || m.value }>{ m[showSearch.name] || m.name }</a-select-option>)
              })}
            </a-select>)
          },
          'date': (data, showSearch)=>{
            return (<a-range-picker
              ref="headerSearch"
              placeholder={showSearch.title}
              value={[data.selectedKeys[0]?moment(data.selectedKeys[0],moment.ISO_8601): null, data.selectedKeys[1]?moment(data.selectedKeys[1],moment.ISO_8601): null]}
              style={searchStyle}
              onChange={e => {
                data.setSelectedKeys(e? [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')] : [])
              }}
            >
            </a-range-picker>)
          },
          'other': (data, showSearch)=>{
            return (<div style={searchStyle}>{this.$slots[showSearch.customRender]}</div>)
          }
        }
        this.$scopedSlots.filterDropdown = (data) => {
          let scopedSlots = null
          for (const item of this.columns) {
            if (item.dataIndex === data.column.dataIndex) {
              scopedSlots = item.scopedSlots
              break
            }
          }
          return (
            <div style="line-height: 14px;padding: 8px;overflow: hidden">
              {type_list[scopedSlots.showSearch.type](data, scopedSlots.showSearch)}
              <a-button icon="reload" size="small" style="width: 90px;float:right;" onClick={() => this.handleReset(data.clearFilters, scopedSlots.showSearch.key || data.column.dataIndex, scopedSlots.showSearch.type)}>重置</a-button>
              <a-button
                type="primary"
                icon="search"
                size="small"
                style="width: 90px; margin-right: 8px;float:right;"
                onClick={() => this.handleSearch(data.selectedKeys, data.confirm, scopedSlots.showSearch.key || data.column.dataIndex, scopedSlots.showSearch.type, scopedSlots.showSearch.dateFormat)}
              >查询</a-button>
            </div>)}
        this.$scopedSlots.filterIcon = (filtered)=>(
          <a-icon type="search" style={{ color: filtered ? '#108ee9' : undefined, fontSize: '16px' }} />)
      }
    },
    // 表头搜索
    handleSearch(selectedKeys, confirm, dataIndex, type, dateFormat) {
      confirm()
      this.$emit('handleHeaderSearch', selectedKeys, dataIndex, type, dateFormat)
    },
    // 表头重置搜索
    handleReset(clearFilters, dataIndex, type) {
      clearFilters()
      this.$emit('handleHeaderReset', dataIndex, type)
    }
  },

  render () {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    if (!this.$scopedSlots || !this.$scopedSlots.serial) {
      !this.$scopedSlots && (this.$scopedSlots = {})
      this.$scopedSlots.serial = (txt, record, index) => (<span>{(this.localPagination.pageSize * (this.localPagination.current - 1)) + (index + 1)}</span>)
    }
    const table = (
      <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData}
         onExpand={(expanded, record) => {
           this.$emit('expand', expanded, record)
         }}>
        {Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>))}
      </a-table>
    )

    this.initHeaderSearch()

    return (
      <div class="page-table-wrapper">
        {showAlert ? this.renderAlert() : null}
        {table}
      </div>
    )
  }
}
