<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="searchTable">
        <el-row :gutter="20">
          <el-col :span="14">
            <LocationChoose :locationform="locationform" />

          </el-col>
          <el-col :span="10">
            <SkuChoose :skuform="skuform" />

          </el-col>
        </el-row>
        <el-button style="float:right; margin-bottom: 5px;" round type="primary" size="small" icon="el-icon-search" @click="search">查询</el-button>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">导出处于预警状态的单据</el-button>
      <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="outExcel">导出</el-button> -->
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <!-- <el-button type="primary" size="small">设置库存数量预警</el-button> -->
      <div style="float:right; margin-bottom: 5px;">
        <WarningChoose @changeState="changeState" @changeAllState="changeAllState" @changeWarnState="changeWarnState" />
      </div>
    </div>
    <el-dialog v-drag title="库存有效期预警设置" :visible.sync="dialogVisible" width="50%" class="showAll_dialog">
      <!-- <span>库存有效期设置（单位为天）：</span><el-input-number v-model="warningNum" :min="1" /> -->
      <span>预警提前期（单位为天）：</span><el-input-number v-model="warningNum2" :min="1" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :cell-style="{padding:'0px'}"
      :height="tableHeight"
      border
      :row-style="{height:'20px'}"
      style="width: 100%, font-size: 10px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="箱号" align="center" width="180px" :show-overflow-tooltip="true" prop="balanceCode" />
      <el-table-column label="仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
      <el-table-column label="库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
      <el-table-column label="库位" align="center" width="180px" :show-overflow-tooltip="true" prop="locationName" />
      <el-table-column label="商品" align="center" :show-overflow-tooltip="true" prop="commodityName" />
      <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <el-table-column label="库存数量" align="center" :show-overflow-tooltip="true" prop="availableCnt" />
      <!-- <el-table-column width="150px" label="入库日期" align="center" :show-overflow-tooltip="true" prop="inBoundTime">
        <template slot-scope="scope">{{ scope.row.inBoundTime| dateYMDHMSFormat }}</template>
      </el-table-column> -->
      <!-- <el-table-column label="最小sku单位" align="center" :show-overflow-tooltip="true" prop="unit" :formatter="unitFormat" /> -->
      <el-table-column label="有效期(天)" align="center" :show-overflow-tooltip="true" prop="qualityGuaranteePeriod" />
      <el-table-column width="150px" label="过期日期" align="center" :show-overflow-tooltip="true" prop="expirationTime">
        <template slot-scope="scope">{{ scope.row.expirationTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="预警提前期(天)" align="center" :show-overflow-tooltip="true" prop="validityLeadDay" />
      <!-- <el-table-column label="是否开启预警" align="center" :show-overflow-tooltip="true" prop="validityAlarmEnabled" :formatter="alarmFormat" /> -->
      <el-table-column label="预警状态" align="center" :show-overflow-tooltip="true" prop="isQualityAlarm">
        <template slot-scope="scope">
          <span v-if="scope.row.isQualityAlarm=== 0"><el-tag type="success" size="small">正常</el-tag></span>
          <span v-if="scope.row.isQualityAlarm=== 1"><el-tag type="warning" size="small">预警</el-tag></span>
        </template></el-table-column>
      <el-table-column
        width="150px"
        prop="action"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" type="warning" icon="el-icon-open" @click="openWarning(scope.row)">设置预警阈值</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'

import { searchInventoryBalanceSelective, alarmByValidDates, updateAlarm, exportValidAlarmExcel, searchInventoryBalanceNum } from '@/api/user'
import SkuChoose from '@/components/SkuChoose/index.vue'
import LocationChoose from '@/components/LocationChoose/index.vue'
import WarningChoose from '@/components/WarningChoose/index.vue'
// import { searchsystemid } from '@/utils/search'
// import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { SkuChoose, Pagination, LocationChoose, WarningChoose },
  data() {
    return {
      total: 0,
      id: null,
      tableHeight: 50,
      dialogVisible: false,
      countAlarmState: null,
      locationform: {
        warehouseName: null,
        areaName: null,
        locationName: null
      },
      skuform: {
        commodityName: null,
        skuName: null
      },
      warningNum: 10,
      warningNum2: 5,
      listLoading: false,
      unitoptions: [],
      lastunitTime: 0,
      innerHeight: 50,
      listQuery: {
        page: 1,
        limit: 50
      },
      tableData: []
    }
  },
  created() {
    alarmByValidDates()
    this.getList()
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 82

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 82
      }
    })
  },
  methods: {
    unitFormat(row) {
      if (row.unit === '1') {
        return '件'
      } else if (row.unit === '0') {
        return '袋'
      }
    },
    alarmFormat(row) {
      if (row.validityAlarmEnabled === 1) {
        return '已开启'
      } else if (row.validityAlarmEnabled === 0) {
        return '未开启'
      }
    },
    search() {
      this.getList()
    },
    outExcel() {
      exportValidAlarmExcel({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.locationform.warehouseName,
        areaName: this.locationform.areaName,
        isRetentionAlarm: this.countAlarmState,

        commodityName: this.skuform.commodityName,
        locationName: this.locationform.locationName,
        skuName: this.skuform.skuName
      }}).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `有效期预警`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    refresh() {
      this.reload()
    },
    submit() {
      this.$confirm('确定开启预警吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAlarm({
          id: this.id,
          validityAlarmEnabled: 1,
          validityLeadDay: this.warningNum2
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.reload()
          }
        })
      })
    },
    closeWarning(row) {
      this.$confirm('确定关闭预警吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAlarm({
          id: row.id,
          validityAlarmEnabled: 0,
          validityLeadDay: 0
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('关闭成功')
            this.reload()
          }
        })
      })
    },
    openWarning(row) {
      this.id = row.id
      this.dialogVisible = true
    },
    changeState(val) {
      this.countAlarmState = val
      this.getList()
    },
    changeAllState(val) {
      this.countAlarmState = val
      this.getList()
    },
    changeWarnState(val) {
      this.countAlarmState = val
      this.getList()
    },
    getList() {
      this.listLoading = true
      searchInventoryBalanceSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.locationform.warehouseName,
        areaName: this.locationform.areaName,
        isQualityAlarm: this.countAlarmState,
        commodityName: this.skuform.commodityName,
        locationName: this.locationform.locationName,
        skuName: this.skuform.skuName
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchInventoryBalanceNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.locationform.warehouseName,
        areaName: this.locationform.areaName,
        isQualityAlarm: this.countAlarmState,
        commodityName: this.skuform.commodityName,
        locationName: this.locationform.locationName,
        skuName: this.skuform.skuName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.searchTable{
  background-color: #fff;
  padding-top: 10px;
}
.btngroups {
      margin: 5px;
    }
    .showAll_dialog {
      ::v-deep.el-dialog {
        margin: 100px auto !important;
        overflow: hidden;
        background-color: #262626;
        border: #fff 1px solid;
         box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
      0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);

        .el-dialog__body {
          color: white;
        }
        .el-dialog__title {
          color: white;
          caret-color: transparent;
        }
        .el-icon-close {
          color: white;
          &:hover {
            color:rgb(9,205,219)
          }
        }
      }
    }
</style>

