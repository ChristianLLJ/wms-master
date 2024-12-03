import { searchWorkGroupWarehouse, screenCustom, selectWarehouse, screenGoodsSku, screenContainer, screenGoods, selectArea, selectDepartment, selectDetailByCode, selectCompany } from '@/api/user'
export function searchwarehouse(obj) {
  return searchWorkGroupWarehouse({
    id: obj,
    page: 1,
    num: 1
  })
}
export function searchcustomer() {
  return screenCustom({
    searchDTO: {
      page: 1,
      num: 10000
    },
    pojo: {
      code: '1'
    }
  })
}
export function searchreceiver() {
  return screenCustom({
    searchDTO: {
      page: 1,
      num: 10000
    },
    pojo: {
      code: '2'
    }
  })
}
export function searchsupplier() {
  return screenCustom({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
      code: '3'
    }
  })
}
export function searchsku(obj, obj2, obj3) {
  return screenGoodsSku({
    searchDTO: {
      page: 1,
      num: 10000
    },
    pojo: {
      goodsId: obj,
      skuName: obj2,
      goodsName: obj3
    }
  })
}
export function searchcom() {
  return screenGoods({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
    }
  })
}
export function searchcompany() {
  return selectCompany({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
    }
  })
}
export function searchdepartment() {
  return selectDepartment({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
    }
  })
}
export function searchcon() {
  return screenContainer({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
    }
  })
}
export function searcharea() {
  return selectArea({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
    }
  })
}
export function searchallwarehouse() {
  return selectWarehouse({
    searchDTO: {
      page: 1,
      num: 1000
    },
    pojo: {
    }
  })
}
export function searchsystemid(obj) {
  return selectDetailByCode({
    code: obj
  })
}

