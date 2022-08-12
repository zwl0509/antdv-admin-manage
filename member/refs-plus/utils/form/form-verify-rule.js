import test from '../../uview-ui/libs/function/test'
// 税号正则校验
const faxNoReg =
  /^(([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10})|([1-9]\d{14}))$/
// 用户注册
export const memberRegister = {
  rule: {
    memberPhone: {
      required: true,
      reg: /^1[23456789]\d{9}$/,
    },
    realName: {
      required: true,
      maxlength: 50,
    },
    gender: {
      required: true,
    },
    loginPassword: {
      required: true,
      maxlength: 200,
    },
    verificationCode: {
      required: true,
      maxlength: 6,
    },
  },
  message: {
    memberPhone: {
      required: '请输入手机号码',
      reg: '手机号码格式错误',
    },
    realName: {
      required: '请输入姓名',
      maxlength: '姓名字符长度超出',
    },
    gender: {
      required: '请选择性别',
    },
    loginPassword: {
      required: '请输入密码',
      maxlength: '密码字符长度超出',
    },
    verificationCode: {
      required: '请输入验证码',
      maxlength: '验证码字符长度超出',
    },
  },
}
export const memberRegister2 = {
  memberPhone: [
    { required: true, message: '请输入手机号码' },
    { reg: test.mobile, message: '手机号码格式错误' },
  ],
  realName: [
    { required: true, message: '请输入姓名' },
    { max: 50, message: '姓名字符长度超出' },
  ],
  gender: [{ required: true, message: '请选择性别' }],
  loginPassword: [
    { required: true, message: '请输入密码' },
    { max: 15, message: '密码字符长度超出,最大15位' },
    { min: 6, message: '密码长度最少6位' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码' },
    { max: 6, message: '验证码字符长度超出' },
  ],
}

// 客户管理新增
export const customerEdit = {
  customerName: [
    { required: true, message: '请输入企业名称' },
    { max: 50, message: '企业名称字符数量超出' },
  ],
  customerCode: [
    { required: true, message: '请输入客户编号' },
    { max: 50, message: '客户编号字符数量超出' },
  ],
  customerStage: [{ required: true, message: '请选择客户阶段' }],
  customerContactInfoEditDTOList: {
    contactName: [
      { required: true, message: '请输入联系人' },
      { max: 50, message: '联系人字符数量超出' },
    ],
    contactPhone: [
      {
        reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
        message: '联系人号码格式错误',
      },
    ],
    contactFax: [{ reg: test.fax, message: '请输入正确的传真' }],
    email: [{ reg: test.email, message: '请输入正确的邮箱号' }],
  },
  address: [{ max: 200, message: '收货地址字符数量超出' }],
  salesman: [
    { required: true, message: '请输入销售员' },
    { max: 50, message: '销售员字符数量超出' },
  ],
  salesmanPhone: [{ reg: /^(1[23456789]\d{9})$/, message: '手机号格式错误' }],
  discountRate: [
    {
      reg: /^((\d{1,2}(\.\d{1,2})?)|(\.\d{1,2}))$/,
      message: '请输入正确的优惠比例',
    },
  ],
  customerLegalPerson: [{ max: 50, message: '法人代表字符数量超出' }],
  customerDelegate: [{ max: 50, message: '委托代表字符数量超出' }],
  billingInfoEditDTO: {
    companyName: [{ max: 50, message: '开票抬头字符数量超出' }],
    dutyParagraph: [
      { reg: faxNoReg, message: '开票税号格式不正确' },
      { max: 50, message: '开票税号字符数量超出' },
    ],
    bankOfDeposit: [{ max: 150, message: '开户银行字符数量超出' }],
    accountNumber: [
      { reg: test.bankCard, message: '开票账号格式不正确' },
      { max: 100, message: '开票账号字符数量超出' },
    ],
    contactNumber: [
      { reg: test.telOrMobile, message: '开票电话格式不正确' },
      { max: 50, message: '开票电话字符数量超出' },
    ],
    billingAddress: [{ max: 200, message: '开票地址字符数量超出' }],
    expressAddress: [{ max: 200, message: '快递地址字符数量超出' }],
  },
  remark: [{ max: 200, message: '备注字符数量超出' }],
}
// 供应商管理新增
export const supplierEdit = {
  customerName: [
    { required: true, message: '请输入供应商名称' },
    { max: 50, message: '供应商名称字符数量超出' },
  ],
  customerCode: [
    { required: true, message: '请输入供应商编号' },
    { max: 50, message: '供应商编号字符数量超出' },
  ],
  customerStage: [{ required: true, message: '请选择供应商阶段' }],
  customerContactInfoEditDTOList: {
    contactName: [
      { required: true, message: '请输入联系人' },
      { max: 50, message: '联系人字符数量超出' },
    ],
    contactPhone: [
      {
        reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
        message: '联系人号码格式错误',
      },
    ],
    contactFax: [{ reg: test.fax, message: '请输入正确的传真' }],
    email: [{ reg: test.email, message: '请输入正确的邮箱号' }],
  },
  address: [{ max: 200, message: '收货地址字符数量超出' }],
  salesman: [
    { required: true, message: '请输入业务员' },
    { max: 50, message: '业务员字符数量超出' },
  ],
  salesmanPhone: [{ reg: /^(1[23456789]\d{9})$/, message: '手机号格式错误' }],
  discountRate: [
    {
      reg: /^((\d{1,2}(\.\d{1,2})?)|(\.\d{1,2}))$/,
      message: '请输入正确的优惠比例',
    },
  ],
  // createdBy: [{required: true, message: '请输入创建人'},{max: 50, message: '创建人字符数量超出'}],
  customerLegalPerson: [{ max: 50, message: '法人代表字符数量超出' }],
  customerDelegate: [{ max: 50, message: '委托代表字符数量超出' }],
  billingInfoEditDTO: {
    companyName: [{ max: 50, message: '开票抬头字符数量超出' }],
    dutyParagraph: [
      { reg: faxNoReg, message: '开票税号格式不正确' },
      { max: 50, message: '开票税号字符数量超出' },
    ],
    bankOfDeposit: [{ max: 150, message: '开户银行字符数量超出' }],
    accountNumber: [
      { reg: test.bankCard, message: '开票账号格式不正确' },
      { max: 100, message: '开票账号字符数量超出' },
    ],
    contactNumber: [
      { reg: test.telOrMobile, message: '开票电话格式不正确' },
      { max: 50, message: '开票电话字符数量超出' },
    ],
    billingAddress: [{ max: 200, message: '开票地址字符数量超出' }],
    expressAddress: [{ max: 200, message: '快递地址字符数量超出' }],
  },
  remark: [{ max: 200, message: '备注字符数量超出' }],
}
// 销售产品编辑
export const saleProdEdit = {
  classifyId: [{ required: true, message: '请选择产品类别' }],
  identifier: [
    { required: true, message: '请输入产品编号' },
    { max: 50, message: '产品编号字符数量超出' },
  ],
  productName: [
    { required: true, message: '请输入产品名称' },
    { max: 50, message: '产品名称字符数量超出' },
  ],
  units: [{ required: true, message: '请选择单位' }],
  // unitPrice: [{required: true, message: '请输入产品单价'},{max: 11, message: '产品单价字符数量超出'}],
  memberPrice: [{ max: 11, message: '产品会员价字符数量超出' }],
  originPlace: [
    { required: true, message: '请输入产地' },
    { max: 50, message: '产地字符数量超出' },
  ],
  brand: [{ max: 36, message: '牌号字符数量超出' }],
  warehouseNum: [{ max: 11, message: '入库数量字符数量超出' }],
  stockNum: [{ max: 11, message: '库存数量字符数量超出' }],
  summaryInfo: [{ max: 200, message: '摘要字符数量超出' }],
  organizationIntroduce: [{ max: 500, message: '公司简介字符数量超出' }],
  // productProcessingEditDTOS: {
  //   processingName: [{required: true, message: '请输入配套费名称'},{max: 50, message: '配套费名称字符数量超出'}],
  //   processingPrice: [{required: true, message: '请输入配套费单价'},{max: 50, message: '配套费单价字符数量超出'}],
  //   priceUnit: [{required: true, message: '请选择配套费单价单位'}]
  // },
  specificationsEditDTOList: {
    // specificationsName: [{required: true, message: '请输入规格名称'},{max: 50, message: '规格名称字符数量超出'}]
  },
}

// 报价单
export const quotationEdit = {
  // customerCode: [{required: true, message: '请输入客户编号'},{max: 50, message: '客户编号字符数量超出'}],
  // orderNumber: [{required: true, message: '请输入订单号'},{max: 36, message: '订单号字符数量超出'}],
  projectName: [{ max: 50, message: '需方项目字符数量超出' }],
  customerId: [{ required: true, message: '请选择客户' }],
  contactName: [
    { required: true, message: '请输入需方联系人' },
    { max: 50, message: '需方联系人字符数量超出' },
  ],
  mobilePhone: [
    { required: true, message: '请输入需方手机号' },
    { max: 11, message: '需方手机号字符数量超出' },
    { reg: test.mobile, message: '需方手机号码格式错误' },
  ],
  contactPhone: [
    { max: 50, message: '需方电话号码字符数量超出' },
    {
      reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
      message: '需方电话号码格式错误',
    },
  ],
  fax: [{ max: 50, message: '需方传真字符数量超出' }],
  orderInProductEditDTOList: {
    amount: [{ max: 11, message: '产品数量超出范围' }],
  },
  productQuotationEditDTO: {
    supplierName: [
      { required: true, message: '请输入供方联系人' },
      { max: 50, message: '供方联系人字符数量超出' },
    ],
    supplierPhone: [
      { required: true, message: '请输入供方手机号' },
      { max: 11, message: '供方手机号字符数量超出' },
      { reg: test.mobile, message: '供方手机号码格式错误' },
    ],
    supplierLandlineNumber: [
      { max: 50, message: '供方电话号码字符数量超出' },
      {
        reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
        message: '供方电话号码格式错误',
      },
    ],
    supplierFax: [{ max: 50, message: '供方传真字符数量超出' }],
    quoter: [
      { required: true, message: '请输入报价员' },
      { max: 50, message: '报价员字符数量超出' },
    ],
    quotationDate: [{ required: true, message: '请选择报价日期' }],
    deliveryDate: [{ required: true, message: '请选择交货日期' }],
    freightPrice: [
      { max: 11, message: '运费字符数量超出' },
      { reg: test.amount, message: '运费金额格式错误' },
    ],
    consigneeName: [
      { required: true, message: '请输入收件人' },
      { max: 50, message: '收件人字符数量超出' },
    ],
    consigneePhone: [
      { required: true, message: '请输入收件人手机号' },
      { max: 11, message: '收件人手机号字符数量超出' },
    ],
    // consigneeProvinces: [{required: true, message: '请选择省市区'},{ max: 50, message: '省市区字符数量超出' }],
    consigneeAddress: [
      { required: true, message: '请输入收件详细地址' },
      { max: 500, message: '收件详细地址字符数量超出' },
    ],
    remark: [{ max: 500, message: '报价备注字符数量超出' }],
  },
  remark: [{ max: 500, message: '订单备注字符数量超出' }],
}
// 询价单
export const inquiryProdEdit = {
  customerId: [{ required: true, message: '请选择供应商' }],
  // contactName: [{required: true, message: '请输入供方联系人'},{max: 50, message: '供方联系人字符数量超出'}],
  // mobilePhone: [{max: 11, message: '供方手机号字符数量超出'}, { reg: test.mobile, message: '供方手机号码格式错误'}],
  // contactPhone: [{max: 50, message: '供方电话号码字符数量超出'}, { reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/, message: '供方电话号码格式错误'}],
  // fax: [{max: 50, message: '供方传真字符数量超出'}],
  // orderInProductEditDTOList: {
  //   amount: [{max: 11, message: '产品数量超出范围'}]
  // },
  // projectName: [{max: 50, message: '需方项目字符数量超出'}],
  // productQuotationEditDTO: {
  //   supplierName: [{required: true, message: '请输入需方联系人'}, {max: 50, message: '需方联系人字符数量超出'}],
  //   supplierPhone: [{max: 11, message: '需方手机号字符数量超出'}, {reg: test.mobile, message: '需方手机号码格式错误'}],
  //   supplierLandlineNumber: [{max: 50, message: '需方电话号码字符数量超出'}, {reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/, message: '需方电话号码格式错误'}],
  //   supplierFax: [{max: 50, message: '需方传真字符数量超出'}],
  //   quoter: [{required: true, message: '请输入询价员'}, {max: 50, message: '询价员字符数量超出'}],
  //   quotationDate: [{required: true, message: '请选择询价日期'}],
  //   deliveryDate: [{required: true, message: '请选择询价日期'}],
  //   freightPrice: [{max: 11, message: '运费字符数量超出'}, {reg: test.amount, message: '运费金额格式错误'}],
  //   consigneeName: [{required: true, message: '请输入收货人'}, {max: 50, message: '收货人字符数量超出'}],
  //   consigneePhone: [{required: true, message: '请输入收货人手机号'}, {max: 11, message: '收货人手机号字符数量超出'}],
  //   consigneeProvinces: [{required: true, message: '请选择省市区'},{ max: 50, message: '省市区字符数量超出' }],
  //   consigneeAddress: [{required: true, message: '请输入收货详细地址'}, {max: 500, message: '收货详细地址字符数量超出'}],
  //   remark: [ {max: 500, message: '询价备注字符数量超出'}]
  // },
  // remark: [ {max: 500, message: '备注字符数量超出'}]
  productQuotationEditDTO: {
    supplierName: [
      { required: true, message: '请输入供方联系人' },
      { max: 50, message: '供方联系人字符数量超出' },
    ],
    supplierPhone: [
      { required: true, message: '请输入供方手机号' },
      { max: 11, message: '供方手机号字符数量超出' },
      { reg: test.mobile, message: '供方手机号码格式错误' },
    ],
    supplierLandlineNumber: [
      { max: 50, message: '供方电话号码字符数量超出' },
      {
        reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
        message: '供方电话号码格式错误',
      },
    ],
    supplierFax: [{ max: 50, message: '供方传真字符数量超出' }],
    // quoter: [{required: true, message: '请输入报价员'}, {max: 50, message: '报价员字符数量超出'}],
    // quotationDate: [{required: true, message: '请选择报价日期'}],
    deliveryDate: [{ required: true, message: '请选择交货日期' }],
    freightPrice: [
      { max: 11, message: '运费字符数量超出' },
      { reg: test.amount, message: '运费金额格式错误' },
    ],
    consigneeName: [
      { required: true, message: '请输入收件人' },
      { max: 50, message: '收件人字符数量超出' },
    ],
    consigneePhone: [
      { required: true, message: '请输入收件人手机号' },
      { max: 11, message: '收件人手机号字符数量超出' },
    ],
    // consigneeProvinces: [{required: true, message: '请选择省市区'},{ max: 50, message: '省市区字符数量超出' }],
    consigneeAddress: [
      { required: true, message: '请输入收件详细地址' },
      { max: 500, message: '收件详细地址字符数量超出' },
    ],
    remark: [{ max: 500, message: '询价备注字符数量超出' }],
  },
  projectName: [{ max: 50, message: '需方项目字符数量超出' }],
  contactName: [
    { required: true, message: '请输入需方联系人' },
    { max: 50, message: '需方联系人字符数量超出' },
  ],
  mobilePhone: [
    { required: true, message: '请输入需方手机号' },
    { max: 11, message: '需方手机号字符数量超出' },
    { reg: test.mobile, message: '需方手机号码格式错误' },
  ],
  contactPhone: [
    { max: 50, message: '需方电话号码字符数量超出' },
    {
      reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
      message: '需方电话号码格式错误',
    },
  ],
  fax: [{ max: 50, message: '需方传真字符数量超出' }],
  orderInProductEditDTOList: {
    amount: [{ max: 11, message: '产品数量超出范围' }],
  },
  remark: [{ max: 500, message: '订单备注字符数量超出' }],
}

// 合同
export const contractEdit = {
  // contractNo: [{required: true, message: '请输入'},{max: 50, message: '字符数量超出'}],
  // supplierCode: [{required: true, message: '请输入'},{max: 50, message: '字符数量超出'}],
  supplierContactName: [
    { required: true, message: '请输入供方联系人' },
    { max: 50, message: '供方联系人字符数量超出' },
  ],
  supplierPhone: [
    { required: true, message: '请输入供方联系人' },
    { max: 11, message: '供方手机号字符数量超出' },
    { reg: test.mobile, message: '供方手机号码格式错误' },
  ],
  supplierTelephone: [
    { reg: test.telOrMobile, message: '供方电话号码格式错误' },
    { max: 50, message: '供方电话号码字符数量超出' },
  ],
  supplierFix: [
    { reg: test.fax, message: '供方传真格式错误' },
    { max: 50, message: '供方传真字符数量超出' },
  ],
  quoter: [
    { required: true, message: '报价员请输入' },
    { max: 50, message: '报价员字符数量超出' },
  ],
  signingPlace: [{ max: 100, message: '签订地点字符数量超出' }],
  // demandProject: [{required: true, message: '需方项目请输入'},{max: 50, message: '需方项目字符数量超出'}],
  customerId: [{ required: true, message: '请选择需方' }],
  demandName: [
    { required: true, message: '请输入需方联系人' },
    { max: 50, message: '需方联系人字符数量超出' },
  ],
  demandPhone: [
    { required: true, message: '请输入需方手机号' },
    { reg: test.mobile, message: '需方手机号码格式错误' },
    { max: 11, message: '需方手机号字符数量超出' },
  ],
  demandTelephone: [
    { reg: test.telOrMobile, message: '需方电话号码格式错误' },
    { max: 50, message: '需方电话号码字符数量超出' },
  ],
  demandFax: [{ max: 50, message: '需方传真字符数量超出' }],
  contractTreaty: [{ required: true, message: '请输入合同条款' }],
  supplierCompanyName: [{ max: 100, message: '供方单位名称字符数量超出' }],
  supplierCompanyAddress: [{ max: 500, message: '供方单位地址字符数量超出' }],
  supplierLegalPerson: [
    { required: true, message: '请输入供方法人' },
    { max: 50, message: '供方法人字符数量超出' },
  ],
  supplierDelegationPerson: [
    { required: true, message: '请输入供方委托人' },
    { max: 50, message: '供方委托人字符数量超出' },
  ],
  supplierOpeningBank: [
    { required: true, message: '请输入供方开户行' },
    { max: 100, message: '供方开户行字符数量超出' },
  ],
  supplierAccount: [
    { required: true, message: '请输入供方账号' },
    { reg: test.bankCard, message: '请输入正确的供方帐号' },
    { max: 50, message: '供方账号字符数量超出' },
  ],
  supplierDutyParagraph: [
    { required: true, message: '请输入供方税号' },
    { reg: faxNoReg, message: '请输入正确格式的供方税号' },
    { max: 100, message: '供方税号字符数量超出' },
  ],
  demandCompanyName: [
    { required: true, message: '请输入需方单位名称' },
    { max: 100, message: '需方单位名称字符数量超出' },
  ],
  demandCompanyAddress: [
    { required: true, message: '请输入单位地址' },
    { max: 500, message: '需方单位地址字符数量超出' },
  ],
  demandLegalPerson: [
    { required: true, message: '请输入需方法人' },
    { max: 50, message: '需方法人字符数量超出' },
  ],
  demandDelegationPerson: [
    { required: true, message: '请输入需方委托人' },
    { max: 50, message: '需方委托人字符数量超出' },
  ],
  demandOpeningBank: [
    { required: true, message: '请输入需方开户行' },
    { max: 100, message: '需方开户行字符数量超出' },
  ],
  demandAccount: [
    { required: true, message: '请输入需方账号' },
    { reg: test.bankCard, message: '请输入正确的需方帐号' },
    { max: 100, message: '需方账号字符数量超出' },
  ],
  demandDutyParagraph: [
    { required: true, message: '请输入需方税号' },
    { reg: faxNoReg, message: '请输入正确格式的需方税号' },
    { max: 100, message: '需方税号字符数量超出' },
  ],
  remittanceCycleDays: [
    { required: true, message: '请输入付款账期天数' },
    { max: 11, message: '付款账期天数字符数量超出' },
  ],
}

// 记账凭证收
export const bookkeepingVoucher = {
  customerName: [{ required: true, message: '请选择客户' }],
  contractNo: [{ required: true, message: '请选择合同' }],
  payDate: [{ required: true, message: '请收款日期' }],
  summary: [{ max: 100, message: '字符数量超出' }],
  billNo: [
    { required: true, message: '请输入单据号' },
    { max: 30, message: '单据号长度超出' },
  ],
  subject: [
    { required: true, message: '请输入总账科目' },
    { max: 50, message: '字符数量超出' },
  ],
  billAmount: [
    { required: true, message: '请输入单据金额' },
    // {reg: /^[1-10](\d{1,8}\.\d{2}|\d{1,9}\.\d|\d{1,10})$/, message: '请输入正确的单据金额'},
  ],
  payAmount: [
    { required: true, message: '请输入本次收款金额' },
    // {reg: /^[1-10](\d{1,8}\.\d{2}|\d{1,9}\.\d|\d{1,10})$/, message: '请输入正确的本次收款金额'},
  ],
  totalAmount: [
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的应收金额'},
  ],
  amountReceived: [
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的历史已收金额'},
  ],
  bookkeeper: [
    { required: true, message: '请输入记账人' },
    { max: 20, message: '记账人字数超出' },
  ],
  advanceCharge: [
    { required: true, message: '请输入预收款金额' },
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的预收款金额'},
  ],
  payWay: [{ required: true, message: '请选择收款方式' }],
  refundAmount: [
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的退款金额'},
  ],
  remark: [{ max: 100, message: '备注字数超出' }],
}
// 记账凭证付
export const paymentBookkeepingVoucher = {
  customerName: [{ required: true, message: '请选择供应商' }],
  contractNo: [{ required: true, message: '请选择合同' }],
  payDate: [{ required: true, message: '请收款日期' }],
  summary: [{ max: 100, message: '字符数量超出' }],
  billNo: [
    { required: true, message: '请输入单据号' },
    { max: 30, message: '单据号长度超出' },
  ],
  subject: [
    { required: true, message: '请输入总账科目' },
    { max: 50, message: '总账科目字符数量超出' },
  ],
  billAmount: [
    { required: true, message: '请输入单据金额' },
    // {reg: /^[1-10](\d{1,8}\.\d{2}|\d{1,9}\.\d|\d{1,10})$/, message: '请输入正确的单据金额'},
  ],
  payAmount: [
    { required: true, message: '请输入本次收款金额' },
    // {reg: /^[1-10](\d{1,8}\.\d{2}|\d{1,9}\.\d|\d{1,10})$/, message: '请输入正确的本次收款金额'},
  ],
  totalAmount: [
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的应收金额'},
  ],
  amountReceived: [
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的历史已收金额'},
  ],
  bookkeeper: [
    { required: true, message: '请输入记账人' },
    { max: 20, message: '记账人字数超出' },
  ],
  advanceCharge: [
    { required: true, message: '请输入预收款金额' },
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的预收款金额'},
  ],
  payWay: [{ required: true, message: '请选择收款方式' }],
  refundAmount: [
    { required: true, message: '请输入退款金额' },
    // {reg: /^[1-10](\d{1,7}\.\d{2}|\d{1,8}\.\d|\d{1,9})$/, message: '请输入正确的退款金额'},
  ],
  remark: [{ max: 100, message: '备注字数超出' }],
}

// 开票申请
export const applyForInvoice = {
  // title: [
  //   { required: true, message: '请输入标题' },
  //   { max: 50, message: '标题字符长度超出' },
  // ],
  petitionerName: [
    { required: true, message: '请输入申请人' },
    { max: 50, message: '申请人长度超出' },
  ],
  petitionerOrg: [
    { required: true, message: '请输入所在部门' },
    { max: 50, message: '所在部门长度超出' },
  ],
  customerId: [{ required: true, message: '请选择客户' }],
  contractCode: [{ required: true, message: '请选择合同' }],
  invoiceAmount: [{ required: true, message: '请输入开票金额' }],
  amountCaps: [{ required: true, message: '请输入开票金额大写' }],
  invoiceType: [{ required: true, message: '请选择发票类型' }],
  organizationName: [
    { required: true, message: '请输入公司名称' },
    { max: 100, message: '公司名称长度超出' },
  ],
  taxNo: [
    { required: true, message: '请输入税号' },
    { reg: faxNoReg, message: '请输入正确格式的税号' },
  ],
  invoiceAddress: [
    { required: true, message: '请输入开票地址' },
    { max: 150, message: '开票地址长度超出' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话' },
    { reg: test.telOrMobile, message: '开票信息联系电话格式不正确' },
  ],
  depositBank: [{ required: true, message: '请选择开户银行' }],
  depositAccount: [
    { required: true, message: '请输入开户账号' },
    { reg: test.bankCard, message: '开户账号格式不正确' },
  ],
  remark: [{ max: 150, message: '备注长度超出' }],
  // express: [{required: true, message: '请选择是否快递'}],
  recipient: [{ max: 30, message: '收件人姓名长度超出' }],
  recipientPhone: [
    {
      reg: /^((\d{3,4}-\d{7,8}(-\d{3,4})?)|(1[23456789]\d{9}))$/,
      message: '快递信息联系电话格式不正确',
    },
  ],
  receivingAddress: [{ max: 150, message: '快递地址长度超出' }],
  invoiceNumber: [{ max: 50, message: '开票编号长度超出' }],
  drawer: [{ max: 50, message: '开票人长度超出' }],
}

// 发票入库单 - 同付款申请
export const invoiceStock = {
  customerName: [{ required: true, message: '请选择供应商' }],
  contractNo: [{ required: true, message: '请选择合同' }],
  applicationDate: [{ required: true, message: '请选择入库日期' }],
  applicationUser: [
    { required: true, message: '请输入申请人' },
    { max: 40, message: '申请人字符长度超出' },
  ],
  abstractInfo: [{ max: 100, message: '摘要长度超出' }],
  invoiceAmount: [{ required: true, message: '请输入开票金额' }],
  amountCaps: [{ required: true, message: '请输入开票金额大写' }],
  invoiceType: [{ required: true, message: '请选择发票类型' }],
  companyName: [{ required: true, message: '请输入公司名称' }],
  faxNo: [
    { required: true, message: '请输入税号' },
    { reg: faxNoReg, message: '请输入正确格式的税号' },
  ],
  invoiceAddress: [
    { required: true, message: '请输入开票地址' },
    { max: 150, message: '开票地址长度超出' },
  ],
  invoiceContactPhone: [
    { required: true, message: '请输入联系电话' },
    { reg: test.telOrMobile, message: '请输入正确格式的联系电话' },
  ],
  invoiceBankName: [{ required: true, message: '请选择开户银行' }],
  invoiceBankNo: [
    { required: true, message: '请输入开户账号' },
    { reg: test.bankCard, message: '开户账号格式不正确' },
  ],
  invoiceRemark: [{ max: 150, message: '发票备注长度超出' }],
}

//
export const paymentApply = {
  customerName: [{ required: true, message: '请选择供应商' }],
  contractNo: [{ required: true, message: '请选择合同' }],
  applicationDate: [{ required: true, message: '请选择入库日期' }],
  applicationUser: [
    { required: true, message: '请输入申请人' },
    { max: 40, message: '申请人字符长度超出' },
  ],
  abstractInfo: [{ max: 100, message: '摘要长度超出' }],
  invoiceAmount: [{ required: true, message: '请输入开票金额' }],
  amountCaps: [{ required: true, message: '请输入开票金额大写' }],
  invoiceType: [{ required: true, message: '请选择发票类型' }],
  companyName: [{ required: true, message: '请输入公司名称' }],
  faxNo: [
    { required: true, message: '请输入税号' },
    { reg: faxNoReg, message: '请输入正确格式的税号' },
  ],
  invoiceAddress: [
    { required: true, message: '请输入开票地址' },
    { max: 150, message: '开票地址长度超出' },
  ],
  invoiceContactPhone: [
    { required: true, message: '请输入联系电话' },
    { reg: test.telOrMobile, message: '请输入正确格式的联系电话' },
  ],
  invoiceBankName: [{ required: true, message: '请选择开户银行' }],
  invoiceRemark: [{ max: 150, message: '发票备注长度超出' }],
}

// 银行卡
export const bankCard = {
  cardholder: [
    { required: true, message: '请输入银行卡持有人' },
    { max: 30, message: '银行卡持有人长度超出' },
  ],
  // bankType: [{required: true, message: '请选择所属银行'}],
  cardType: [{ required: true, message: '请选择银行卡类型' }],
  cardNo: [
    { required: true, message: '请输入银行卡卡号' },
    { reg: test.bankCard, message: '请输入正确的银行卡卡号' },
  ],
  rmbBalance: [
    { required: true, message: '请输入银行卡人民币余额' },
    { reg: test.amount, message: '请输入正确的银行卡人民币余额(保留两位小数)' },
  ],
  dollarBalance: [
    { required: true, message: '请输入银行卡美元余额' },
    { reg: test.amount, message: '请输入正确的银行卡美元余额(保留两位小数)' },
  ],
}

// 企业信息编辑
export const enterprisesInfoEdit = {
  name: [{ required: true, message: '请输入企业名称' }],
  code: [
    { required: true, message: '请输入企业编号' },
    { reg: test.letter, message: '请输入正确的企业编号' },
  ],
  uniformCreditCode: [
    { required: true, message: '请输入信用代码' },
    { reg: test.unifiedCode, message: '请输入正确社会统一信用代码' },
  ],
  organizationClass: [{ required: true, message: '请选择企业性质' }],
  businessScope: [{ required: true, message: '请选择行业分类' }],
  organizationSize: [{ required: true, message: '请选择企业规模' }],
  customerPhone: [
    { required: true, message: '请输入正确认证手机' },
    { reg: test.mobile, message: '请输入正确认证手机' },
  ],
  organizationFax: [{ reg: test.fax, message: '请输入正确企业传真' }],
  address: [{ required: true, message: '请输入所在地址' }],
  legalPerson: [{ required: true, message: '请输入法人代表' }],
  delegate: [{ required: true, message: '请输入委托代表' }],
}

export default {}
