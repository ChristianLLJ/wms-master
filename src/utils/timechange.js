export function msToDate(msec) {
  const datetime = new Date(msec)
  const year = datetime.getFullYear()
  const month = datetime.getMonth()
  const date = datetime.getDate()
  const hour = datetime.getHours()
  const minute = datetime.getMinutes()
  const second = datetime.getSeconds()

  const result1 = year +
                 '-' +
                 ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
                 '-' +
                 ((date + 1) < 10 ? '0' + date : date) +
                 ' ' +
                 ((hour + 1) < 10 ? '0' + hour : hour) +
                 ':' +
                 ((minute + 1) < 10 ? '0' + minute : minute) +
                 ':' +
                 ((second + 1) < 10 ? '0' + second : second)

  const result2 = year +
                 '-' +
                 ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
                 '-' +
                 ((date + 1) < 10 ? '0' + date : date)

  const result = {
    hasTime: result1,
    withoutTime: result2
  }

  return result
}

