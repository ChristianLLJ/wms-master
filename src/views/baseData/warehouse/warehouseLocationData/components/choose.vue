<template>
  <div>
    <span>筛选可用库位：</span>
    <el-button type="primary" size="small" plain icon="el-icon-menu" @click="changeState">未使用</el-button>
    <el-button type="success" size="small" plain icon="el-icon-success" @click="changeWarnState">已使用</el-button>
  </div>
</template>
<script>
export default {

  data() {
    return {
      normalState: false,
      warningState: true
    }
  },
  methods: {
    changeState() {
      this.$emit('changeState', this.normalState)
    },
    changeWarnState() {
      this.$emit('changeState', this.warningState)
    }
  }
}
</script>

  <style lang="scss" scoped>
  span {
      color:rgb(18, 91, 118)
  }
  </style>

