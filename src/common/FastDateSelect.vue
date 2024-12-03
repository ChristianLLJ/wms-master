<template>
  <div class="fast-date-select">
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(moment(), moment())"
    >
      <i class="el-icon-time" />
      今日
    </el-tag> -->
    <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getWeek())"
    >
      <i class="el-icon-timer" />
      本周
    </el-tag>
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getWeek(-1))"
    >
      <i class="el-icon-timer" />
      上周
    </el-tag> -->
    <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getMonth())"
    >
      <i class="el-icon-watch" />
      本月
    </el-tag>
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getMonth(moment().month() - 1))"
    >
      <i class="el-icon-watch" />
      上月
    </el-tag> -->
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getQuarter())"
    >
      <i class="el-icon-alarm-clock" />
      本季度
    </el-tag>
    <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getQuarter(moment().quarter() - 1))"
    >
      <i class="el-icon-alarm-clock" />
      上季度
    </el-tag> -->
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getYear(moment().year()))"
    >
      <i class="el-icon-date" />
      本年
    </el-tag> -->
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getYear(moment().year() - 1))"
    >
      <i class="el-icon-date" />
      上一年
    </el-tag> -->
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getRecent(7))"
    >
      <i class="el-icon-timer" />
      本周
    </el-tag> -->
    <!-- <el-tag
      disable-transitions
      type="success"
      @click="setDate(...getRecent(30))"
    >
      <i class="el-icon-watch" />
      最近30天
    </el-tag> -->
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'FastDateSelect',
  data() {
    return {
      moment: moment
    }
  },
  methods: {
    setDate(start, end) {
      this.$emit('select', [start, end])
    },
    // 获取本周, offset：周偏移
    getWeek(offset = 0) {
      const start = moment().subtract(moment().weekday() - 1 - offset * 7, 'days')
      const end = moment().subtract(moment().weekday() - offset * 7, 'days').add(7, 'days')
      return [start, end]
    },
    // 获取本月,
    getMonth(month = moment().month()) {
      const start = moment().month(month).date(1)
      const end = moment(start).add(1, 'month').date(1).subtract(1, 'days')
      return [start, end]
    },
    // 获取季度
    getQuarter(quarter = moment().quarter()) {
      const start = moment().month((quarter - 1) * 3).date(1)
      const end = moment(start).add(3, 'month').subtract(1, 'days')
      return [start, end]
    },
    // 获取年
    // getYear(year = moment().year()) {
    //   const start = moment().year(year).month(0).date(1)
    //   const end = moment().year(year).month(11).date(31)
    //   return [start, end]
    // },
    // 获取最近日期
    getRecent(offset = 0) {
      const start = moment()
      const end = moment().subtract(offset, 'days')
      return [end, start]
    }
  }
}
</script>

  <style scoped>

  </style>

