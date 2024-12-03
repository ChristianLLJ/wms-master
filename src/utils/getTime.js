export function getNowTime(obj) {
  var now = new Date()
  var year = now.getFullYear() // 得到年份
  var month = now.getMonth() // 得到月份
  var date = now.getDate() // 得到日期
  month = month + 1
  month = month.toString().padStart(2, '0')
  date = date.toString().padStart(2, '0')
  obj = `${year}-${month}-${date}`
  return obj
}
