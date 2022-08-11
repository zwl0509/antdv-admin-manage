export default {
  name: 'MsPagination',
  created() {
    if (this.pagination) {
      this.localPagination = {
        ...this.pagination
      }
    }
  },
  methods: {
    renderPagination () {
      const vmH = this.$createElement,
        { localPagination, tableChange, $set } = this
      const props = {
        props: {
          defaultPageSize: 20,
          defaultCurrent: 1,
          size: 'small',
          showLessItems: true,
          showSizeChanger: true,
          pageSizeOptions: ['20', '30', '40', '50', '0'],
          showTotal: (total)=>{
            return (<div style="text-align:center;line-height: 24px;">
              共{total}条数据
            </div>)
          },
          total: 0,
          ...localPagination
        },
        on: {
          change: (currentPage) => {
            localPagination.current = currentPage
            tableChange(localPagination)
          },
          showSizeChange: (current, pageSize)=>{
            if (pageSize === localPagination.total){
              $set(localPagination, 'pageSize', pageSize)
            }else{
              $set(localPagination, 'pageSize', pageSize)
            }
            tableChange(localPagination)
          }
        },
      }, scopedSlots = {}
      if (localPagination) scopedSlots.buildOptionText = (props) => (<span>{ props.value.toString() === '0' ? '全部': props.value + '条/页' }</span>)
      return vmH('a-pagination', { scopedSlots, ...props })
    }
  }
}