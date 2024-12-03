
export function tableChangeState(obj) {
  if (obj === 0) {
    return '创建中'
  } else if (obj === 1) {
    return '已创建'
  } else if (obj === 2) {
    return '已收货'
  } else if (obj === 3) {
    return '已完成'
  } else if (obj === 4) {
    return '已取消'
  }
}
export function waveChangeState(obj) {
  if (obj === 1) {
    return '已创建'
  } else if (obj === 2) {
    return '已生成分拣任务'
  } else if (obj === 3) {
    return '已发送WCS分拣任务'
  } else if (obj === 4) {
    return '已收到WCS分拣确认'
  } else if (obj === 5) {
    return '拣货中'
  } else if (obj === 6) {
    return '已拣货'
  } else if (obj === 7) {
    return '装箱中'
  } else if (obj === 8) {
    return '已装箱'
  } else if (obj === 9) {
    return '发运中'
  } else if (obj === 10) {
    return '已发运'
  } else if (obj === 11) {
    return '已完成'
  } else if (obj === 12) {
    return '已取消'
  }
}
export function receiptplanState(obj) {
  if (obj === 1) {
    return '创建'
  } else if (obj === 2) {
    return '部分收货'
  } else if (obj === 3) {
    return '全部收货'
  } else if (obj === 4) {
    return '正在收货'
  } else if (obj === 5) {
    return '正在码盘'
  } else if (obj === 6) {
    return '已码盘'
  } else if (obj === 7) {
    return '正在上架'
  } else if (obj === 8) {
    return '已上架'
  } else if (obj === 9) {
    return '入库完成'
  } else if (obj === 10) {
    return '入库取消'
  }
}
export function despatchUnit(obj) {
  if (obj === 1 || obj === '1') {
    return '件'
  }
}
export function changeAll(i, option) {
  for (var j = 0; j < option.length; j++) {
    if (i === option[j].typeNumber) {
      return option[j].codeDetailName
    }
  }
}
