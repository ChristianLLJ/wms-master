<template>
  <div class="funcContain">
    <div class="text-item" @click="changeRouter(1)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="采购订单" />
        </div>
        <div class="linkContain">
          采购订单
        </div>
      </div>
    </div>
    <div class="text-item" @click="changeRouter(2)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="退货" />
        </div>
        <div class="linkContain">
          退货订单
        </div>
      </div>
    </div>
    <div class="text-item" @click="changeRouter(3)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="收货" />
        </div>
        <div class="linkContain">
          入库计划
        </div>
      </div>
    </div>
    <div class="text-item" @click="changeRouter(4)">
      <div class="card-panel">
        <div class="iconContain">
          <svg-icon icon-class="波次管理" />
        </div>
        <div class="linkContain">
          上架策略
        </div>
      </div>
    </div>
  </div>
</template>

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
          this.$router.push({ path: '/purchaseOrder' })
          break
        case 2:
          this.$router.push({ path: '/backOrder' })
          break
        case 3:
          this.$router.push({ path: '/receiptorderplan' })
          break
        case 4:
          this.$router.push({ path: '/onselfstrategy' })
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
      margin-top:2px;
      display: flex;
      cursor: pointer;
       justify-content: center;
      align-items: center;
      color: #fff

    }
}
  }
  .text-item :hover {
    background-color: rgb(20, 98, 122);
  }
}
.svg-icon {
   width: 4em;
   height: 4em;
   cursor: pointer;
   fill: currentColor;
   overflow: hidden;
 }
</style>
