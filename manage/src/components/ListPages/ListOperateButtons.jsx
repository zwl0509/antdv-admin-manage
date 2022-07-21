export default {
  props: {
    actionAuth: {
      type: Array,
      default: () => []
    },
    showRefresh: {
      type: Boolean,
      default: true
    }
  },
  render () {
    return (
      <div class="table-operator">
        {this.showRefresh ? (<a-button type="primary" class="refresh-btn" icon="reload" onClick={() => this.$emit('refresh')}>刷新</a-button>) : null}
        {this.$slots.default}
      </div>
    )
  }
}
