import moment from 'moment'

export default {
  methods: {
    // 表头搜索
    handleSearch(selectedKeys, confirm, dataIndex, type) {
      if (selectedKeys.length){
        if (this.data){
          this.$emit('headerSearch', selectedKeys, dataIndex)
        }else {
          if (typeof dataIndex == 'object' && type === 'date'){
            this.searchFormData[dataIndex[0]] = moment(selectedKeys?selectedKeys[0]: new Date()).format('YYYY-MM-DD') + ' 00:00:00'
            this.searchFormData[dataIndex[1]] = moment(selectedKeys?selectedKeys[1]: new Date()).format('YYYY-MM-DD') + ' 23:59:59'
          }else{
            if (typeof dataIndex !== 'object')
              this.searchFormData[dataIndex] = selectedKeys[0]
          }
          // table筛选条件更改已触发table的onChange事件，无需再次触发请求接口
          // this.refresh()
        }
      }
      confirm()
    },
    // 表头重置搜索
    handleReset(clearFilters, dataIndex, type) {
      if (this.data){
        this.$emit('headerReset', dataIndex)
      }else{
        if (typeof dataIndex == 'object' && type === 'date'){
          delete this.searchFormData[dataIndex[0]]
          delete this.searchFormData[dataIndex[1]]
        }else if (Array.isArray(dataIndex) && type === 'other') {
          dataIndex.forEach(key => {
            delete this.searchFormData[key]
          })
        }else {
          delete this.searchFormData[dataIndex]
        }
        // table筛选条件更改已触发table的onChange事件，无需再次触发请求接口
        // this.refresh()
      }
      clearFilters()
    },
    initHeaderSearch() {
      if (!this.outSearch) {
        !this.$scopedSlots && (this.$scopedSlots = {})
        this.localColumns.forEach((m)=>{
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
              placeholder={`${showSearch.title}`}
              value={data.selectedKeys[0]}
              style={searchStyle}
              prefix={showSearch.inputPrefix || null}
              type={showSearch.inputType || 'text'}
              onChange={e => data.setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(data.selectedKeys, data.confirm, showSearch.key || data.column.dataIndex, showSearch.type)}
            />)
          },
          'select': (data, showSearch)=>{
            return (<a-select
              ref="headerSearch"
              placeholder={`${showSearch.title}`}
              value={data.selectedKeys[0]}
              style={searchStyle}
              onChange={e => data.setSelectedKeys(e || e === 0 ? [e] : [])}
              onPressEnter={() => this.handleSearch(data.selectedKeys, data.confirm, showSearch.key || data.column.dataIndex, showSearch.type)}
            >
              {showSearch.selectList.map((m, i)=>{
                return (<a-select-option value={ m[showSearch.value] || m.value } key={i}>{ m[showSearch.name] || m.name }</a-select-option>)
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
              {typeof scopedSlots.showSearch.customRender === 'function' ?
                scopedSlots.showSearch.customRender(data)
                : type_list[scopedSlots.showSearch.type](data, scopedSlots.showSearch)}
              <a-button icon="reload" size="small" style="width: 90px;float:right;" onClick={() => this.handleReset(data.clearFilters, scopedSlots.showSearch.key || data.column.dataIndex, scopedSlots.showSearch.type)}>重置</a-button>
              <a-button
                type="primary"
                icon="search"
                size="small"
                style="width: 90px; margin-right: 8px;float:right;"
                onClick={() => this.handleSearch(data.selectedKeys, data.confirm, scopedSlots.showSearch.key || data.column.dataIndex, scopedSlots.showSearch.type)}
              >搜索</a-button>
            </div>)
        }
        this.$scopedSlots.filterIcon = (filtered, column) => {
          return (<div style={ { textAlign: column.align || 'left', padding: '0 10px' } }><a-icon type="search" style={{ color: filtered ? '#108ee9' : undefined, fontSize: '16px' }} /></div>)
        }
      }
    },
  }
}