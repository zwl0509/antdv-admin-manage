// 公海池
import Mock from 'mockjs2'
import { builder, getQueryParameters} from '../util'

const totalCount = 14
const customerList = ( options )=>{
  const Random = Mock.Random
  const parameters = getQueryParameters(options)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1
  for (let i = 1; i < next; i++) {
    result.push({
      id: Mock.mock('@id'),
      customerCode: 'AX00100200'+ i,
      gender: '男',
      name: Random.cname(),
      name1: Random.cname(),
      name2: Random.cname(),
      name3: Random.cname(),
      name4: Random.cname(),
      name5: Random.cname(),
      name6: Random.cname(),
      customerType: Mock.mock('@integer(1, 4)'),
      marketingType: Mock.mock('@integer(1, 3)'),
      expecteRenovationTime: Mock.mock('@datetime'),
      expecteManufacturingCost: '2000',
      expecteEstimateMoomTime: Mock.mock('@datetime'),
      updatedAt: Mock.mock('@datetime'),
      modifiedBy: Random.cname(),
      customerName: Random.cname(),
      resourceProvider: Random.cname(),
      salesman: Random.cname(),
      peceiptPerson: Random.cname(),
      modifiedTime: Mock.mock('@datetime'),
      status: Mock.mock('@integer(0, 2)'),
      practicalArea: 140,
      builtArea: 120,
      successRate: '50%',
      type: Random.boolean(),
      checked: Random.boolean(),
      disabled: Random.boolean(),
      types: Random.boolean(),
      firstVisitTime: Mock.mock('@datetime'),
      isFlyingOrder: Mock.mock('@integer(0, 1)'),
      isDropInCustomer: Mock.mock('@integer(0, 1)'),
      isElevator: Mock.mock('@integer(0, 1)'),
      isResourceCustomer: Mock.mock('@integer(0, 1)'),
      isFutureHouse: Mock.mock('@integer(0, 1)'),
      city: Random.city(),
      county: Random.county(),
      address: Random.city() + Random.county() ,
      idCard: Random.id(),
      mobilePhone: '15600004442',
      mobilePhone1: '13600004442',
      mobilePhone2: '18600004442',
      mobilePhone3: '17600004442',
      mobilePhone4: '15600004442',
      number: Mock.mock('@integer(1, 99)'),
      number1: Mock.mock('@integer(1, 99)'),
      number2: Mock.mock('@integer(1, 99)'),
      number3: Mock.mock('@integer(1, 99)'),
      number4: Mock.mock('@integer(1, 99)'),
      number5: Mock.mock('@integer(1, 99)'),
      number6: Mock.mock('@integer(1, 99)'),
      number7: Mock.mock('@integer(1, 99)'),
      number10: Mock.mock('@integer(1000000,10000000)'),
      
      persons1: '妻子',
      text: '测试数据',
      text1: '测试数据',
      text2: '测试数据',
      text3: '测试数据',
      text4: '状况可以',
      text5: '商贸业',
      type1: '测试类型',
      type2: '测试类型',
      type3: '测试类型',
      type4: '测试类型',
      type5: '测试类型',
      type6: '测试类型',
      type7: '测试类型',
      type8: '测试类型',
      type9: '测试类型',
      type10: '21-30岁',
      type11: '1000-2000',
      code: 'ADC-20330022',
      code1: 'ADC-20330022',
      code2: 'ADC-20330022',
      code3: 'ADC-20330022',
      dataTime1: Mock.mock('@datetime'),
      dataTime2: Mock.mock('@datetime'),
      dataTime3: Mock.mock('@datetime'),
      dataTime4: Mock.mock('@datetime'),
      dataTime5: Mock.mock('@datetime'),
      dataTime6: Mock.mock('@datetime'),
      address1: '繁华中心A',
      address2: '繁华中心S',
      address3: '繁华中心D',
      address4: '繁华中心F',
      address5: '繁华中心AB',
      email: Random.email()
    })
  }
  return builder({
    total: totalPage,
    rows: result
  },'',200)
}

Mock.mock(/\/customer\/list/, 'get', customerList)

