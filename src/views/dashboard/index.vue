<template>
  <div>
    <div class="totalContain">
      <div class="dashboard-container">
        <!-- <panel-group /> -->

        <div class="totalTag">
          <p>入库业务快捷键</p>
          <in-ware-moveto />
        </div>

        <div class="totalTag">
          <p>出库业务快捷键</p>
          <out-ware-moveto />
        </div>
        <div class="totalTag">
          <p>库存管理快捷键</p>
          <in-library-moveto />
        </div>
        <div class="totalTag">
          <p>基础数据快捷键</p>
          <base-data-moveto />
        </div>
        <div class="totalTag">
          <p>预警管理快捷键</p>
          <warning-moveto />
        </div>
        <div class="totalTag">
          <p>权限管理快捷键</p>
          <authority-moveto />
        </div>
      </div>
    </div>
  </div>

</template>

<script>

// import PanelGroup from './components/PanelGroup'
import InWareMoveto from './components/InWareMoveto'
import OutWareMoveto from './components/OutWareMoveto'
import InLibraryMoveto from './components/InLibraryMoveto'
import BaseDataMoveto from './components/BaseDataMoveto'
import AuthorityMoveto from './components/AuthorityMoveto'
import WarningMoveto from './components/WarningMoveto'
export default {
  name: 'DashboardAdmin',
  components: {
    // PanelGroup,
    InWareMoveto,
    OutWareMoveto,
    InLibraryMoveto,
    BaseDataMoveto,
    WarningMoveto,
    AuthorityMoveto
  },
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

.dashboard-container {
  display: flex;
  flex-wrap: wrap;
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
// .totalContain {
//   overflow: auto;
// }
.totalTag {
  margin: 0 10px;
}
.comdataContain {
  width: 100%;
  position:absolute;
  bottom: 0;
}

</style>
