export const defaultTableColumns = {
  serial: {
    dataIndex: 'serial',
    align: 'center',
    title: '序号',
    width: 60,
    scopedSlots: { customRender: 'serial' }
  },
  action: {
    dataIndex: 'action',
    title: '操作',
    width: 180,
    scopedSlots: { customRender: 'action' }
  }
}
export default {
  defaultTableColumns
}
