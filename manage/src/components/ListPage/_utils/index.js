export const defaultTableColumns = {
  serial: {
    dataIndex: 'serial',
    title: '序号',
    width: 100,
    scopedSlots: { customRender: 'serial' }
  },
  serialSingle: {
    dataIndex: 'serialSingle',
    title: '序号',
    width: 70,
    scopedSlots: { customRender: 'serialSingle' }
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
