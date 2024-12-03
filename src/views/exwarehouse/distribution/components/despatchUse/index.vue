<template>
  <div>
    <el-table
      ref="tableData"
      :height="tableHeight"
      :data="tableData"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :row-class-name="tableRowClassName"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
      @expand-change="expandChange"
    >
      <el-table-column type="expand" align="center">
        <template>
          <el-table
            :data="tabledatas"
            :row-class-name="tableRowClassDetailName"
            border
            size="mini"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 10px"
          >
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column label="sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
            <el-table-column label="中文描述" align="center" :show-overflow-tooltip="true" prop="chineseDescribe" />
            <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit" />
            <el-table-column label="订货数" align="center" :show-overflow-tooltip="true" prop="orderCnt" />
            <el-table-column label="预配数" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
            <el-table-column label="分配数" align="center" :show-overflow-tooltip="true" prop="distributionCnt" />
            <el-table-column label="拣货数" align="center" :show-overflow-tooltip="true" prop="takeCnt" />
            <el-table-column label="发货数" align="center" :show-overflow-tooltip="true" prop="deliverCnt" />
            <el-table-column label="体积/L" align="center" :show-overflow-tooltip="true" prop="volume" />
            <el-table-column label="重量/kg" align="center" :show-overflow-tooltip="true" prop="weight" />
            <el-table-column label="净重/kg" align="center" :show-overflow-tooltip="true" prop="netWeight" />
            <el-table-column label="金额/元" align="center" :show-overflow-tooltip="true" prop="money" />
          </el-table>
          <div class="pagContainer">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[5,10]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" align="center" prop="id" />
      <el-table-column label="单证号码" width="115px" align="center" :show-overflow-tooltip="true" prop="despatchId" />
      <el-table-column v-if="false" label="订单类型" align="center" :show-overflow-tooltip="true" prop="type" />
      <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
      <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
      <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
        <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
        <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
        <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouse" />
      <el-table-column label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" />
      <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
        <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { screenDespatchDetailSum, screenDespatchDetail } from '@/api/user'

export default {
  name: 'DespatchUse',
  props: {
    tableData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      getRowKeys(row) {
        return row.id
      },
      expands: [],
      tableHeight: 50,
      tabledatas: [],
      total: 0,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5 // 每页显示的条数
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 117

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 117
      }
    })
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getListDetails(val, 1)
      this.currentPage = 1
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      screenDespatchDetail({ searchDTO,
        pojo: {
          pid: this.id
        }}).then(response => {
        this.tabledatas = response.data
      })
      screenDespatchDetailSum({ searchDTO,
        pojo: {
          pid: this.id
        }}).then(response => {
        this.totalCount = response.data
      })
    },
    // 显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListDetails(this.pagesize, val)
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    }
  }
}
</script>
  <style scoped>
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
<style>
.el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #bbca4a;
}
.el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
</style>
