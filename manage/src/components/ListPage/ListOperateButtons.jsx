export default {
  props: {
    actionAuth: {
      type: Array,
      default: () => []
    },
    showRefresh: {
      type: Boolean,
      default: true
    },
    showActionBtn: {
      type: Boolean,
      default: false
    }
  },
  render () {
    return (
      <div class={this.showActionBtn ? 'table-operator flex-top' : 'table-operator'}>
        <div style={{width: this.showActionBtn? 'calc(100% - 110px)':''}}>
          {this.showRefresh?(<a-button type="primary" class="refresh-btn" icon="reload" onClick={() => this.$emit('refresh')}>刷新</a-button>): null}
          {this.$slots.default}
        </div>
          {this.showActionBtn?(<div style="width: 110px;"><a-button type="primary" icon="menu" onClick={() => this.$emit('columnsModal')}>自定义列</a-button></div>): null}
      </div>
    )
  }
}
