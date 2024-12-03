<template>
  <div class="funcContain">
    <div class="text-item" @click="changeRouter(1)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="公司" />
        </div>
        <div class="linkContain">
          公司
        </div>
      </div>
    </div>
    <div class="text-item" @click="changeRouter(2)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="员工" />
        </div>
        <div class="linkContain">
          员工
        </div>
      </div>
    </div>
    <div class="text-item" @click="changeRouter(3)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="工作组" />
        </div>
        <div class="linkContain">
          工作组
        </div>
      </div>
    </div>
  </div></template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    changeRouter(val) {
      console.log(val)
      switch (val) {
        case 1:
          this.$router.push({ path: '/companydata' })
          break
        case 2:
          this.$router.push({ path: '/staffauth' })
          break
        case 3:
          this.$router.push({ path: '/workgroupauth' })
          break
      }
    }
  }

}
</script>

      <style lang="scss" scoped>
      .funcContain{
        width: 200px;
        height: 300px;
        background-color: rgba(15, 79, 95, 0.747);
        display: flex;
        border-radius: 5px;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        .text-item {
          display: flex;
          justify-content: center;
          align-items: center;
          .card-panel {
            height: 100px;
        width: 100px;
        .iconContain {
           display: flex;
           justify-content: center;
          align-items: center;
          }
          .linkContain {
            display: flex;
            cursor: pointer;
           justify-content: center;
          align-items: center;
            margin-top:2px;
            color: #fff;
          }
      }
        }
        .text-item :hover {
          background-color: rgb(20, 98, 122);
        }
      }
      .svg-icon {
       width: 4em;
       cursor: pointer;
       height: 4em;
       fill: currentColor;
       overflow: hidden;
     }
      </style>

