const json = {
  //客户类型
  type1: [
    { value: 0, name: '高端客户' },
    { value: 1, name: '老客户' },
  ],
  // 营销类型
  type2: [
    { value: 0, name: '电销' },
    { value: 1, name: '渠道' },
  ],
  // 房型
  type3: [
    { value: 0, name: '独栋别墅' },
    { value: 1, name: '三居室' },
  ],
  // 户型
  type4: [
    { value: 0, name: '三室两厅' },
    { value: 1, name: '四室两厅' },
  ],
  // 装修风格
  type5: [
    { value: 0, name: '中式风格' },
    { value: 1, name: '北欧映像' },
  ],
  // 信息渠道
  type6: [
    { value: 0, name: '非常了解' },
    { value: 1, name: '不了解' },
  ],
  // 职业
  type7: [
    { value: 0, name: '董事长' },
    { value: 1, name: '个体户' },
  ],
  // 客户了解信息
  type8: [
    { value: 0, name: '公司简介' },
    { value: 1, name: '公司优惠政策' },
  ],
  // 客户重点关注
  type9: [
    { value: 0, name: '风格' },
    { value: 1, name: '质量' },
  ],
  // 行业
  type10: [
    { value: 0, name: '餐饮' },
    { value: 1, name: '自媒体' },
  ],
  // 信息来源
  type11: [
    { value: 0, name: '自然上门' },
    { value: 1, name: '电话营销' },
    { value: 2, name: '微信营销' },
    { value: 3, name: '400电话' },
  ],
  // 了解公司途径
  type12: [
    { value: 0, name: '电视广告' },
    { value: 1, name: '工地营销' },
  ],
  // 年龄区间
  type13: [
    { value: 0, name: '20岁以下' },
    { value: 1, name: '30岁以下' },
  ],
  // 消息类型
  type20: [
    { value: 0, name: '营销类' },
    { value: 1, name: '材料类' },
    { value: 2, name: '施工类' },
  ],
  // 记录类型
  type21: [
    { value: 0, name: '电话记录' },
    { value: 1, name: '上门记录' },
    { value: 2, name: '客户记录' },
    { value: 3, name: '提醒记录' },
  ],
  // 常用语
  type22: [
    { value: 0, name: '吃了吗' },
    { value: 1, name: '上门了吗' },
  ],
  // 逃单状态
  type23: [
    { value: 0, name: '已装修' },
    { value: 1, name: '签约其他品牌' },
  ],
  // 回单标志
  type24: [
    { value: 0, name: '非回单' },
    { value: 1, name: '设计师回单' },
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
