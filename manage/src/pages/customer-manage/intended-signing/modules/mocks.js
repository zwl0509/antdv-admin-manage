const json = {
  //客户来源
  type1: [
    { value: 0, name: '高端客户' },
    { value: 1, name: '老客户' },
  ],
  // 户型
  type2: [
    { value: 0, name: '三室两厅' },
    { value: 1, name: '四室两厅' },
  ],
  // 业务状况
  type3: [
    { value: 0, name: '良好' },
    { value: 1, name: '优秀' },
  ],
  // 客户状态
  type4: [
    { value: 0, name: '意向状态' },
    { value: 1, name: '意向状态2' },
  ],
  // 施工状况
  type5: [
    { value: 0, name: '已施工' },
    { value: 1, name: '未施工' },
  ],
  // 财务状况
  type6: [
    { value: 0, name: '欠款' },
    { value: 1, name: '已结清' },
  ],
  type7: [
    { value: 0, name: '吃了吗' },
    { value: 1, name: '上门了吗' },
  ],
  // 记录类型
  type8: [
    { value: 0, name: '电话记录' },
    { value: 1, name: '上门记录' },
    { value: 2, name: '客户记录' },
    { value: 3, name: '提醒记录' },
  ],
  // 消息类型
  type9: [
    { value: 0, name: '营销类' },
    { value: 1, name: '材料类' },
    { value: 2, name: '施工类' },
  ],
  // 逃单分类
  type10: [
    { value: 0, name: '已装修' },
    { value: 1, name: '客户自身原因' },
    { value: 2, name: '签约其他品牌' },
    { value: 3, name: '找马路游击队' },
  ],
  addressList: [
    {
      id: 1,
      name: '苏州市',
      children: [
        {
          id: 11,
          name: '相城区',
          children: [
            {
              id: 111,
              name: '花南家园A',
            },
            {
              id: 112,
              name: '花南家园B',
            },
            {
              id: 113,
              name: '花南家园C',
            },
            {
              id: 114,
              name: '花南家园D',
            },
          ],
        },
      ],
    },
  ],
}
export default json
