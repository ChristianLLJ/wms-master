<template>
  <div>
    <span>筛选预警状态：</span>
    <el-button type="primary" size="small" plain icon="el-icon-menu" @click="changeAllState">所有类型</el-button>
    <el-button type="success" size="small" plain icon="el-icon-success" @click="changeState">正常</el-button>
    <el-button type="danger" size="small" plain icon="el-icon-warning" @click="changeWarnState">预警</el-button>
  </div>
</template>
<script>
export default {

  data() {
    return {
      normalState: 0,
      warningState: 1,
      allState: null
    }
  },
  methods: {
    changeState() {
      this.$emit('changeState', this.normalState)
    },
    changeAllState() {
      this.$emit('changeState', this.allState)
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
