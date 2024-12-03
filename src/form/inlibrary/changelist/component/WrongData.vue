<template>
  <div>
    <el-table
      ref="tablelist"
      v-loading="tableLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableList"
      height="600px"
      border
      size="mini"
      row-key="id"
      :header-cell-style="{background:'#091f2c',color: '#fff'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
      <el-table-column label="库区名称" align="center" :show-overflow-tooltip="true" prop="areaName" />
      <el-table-column label="库位名称" align="center" :show-overflow-tooltip="true" prop="locationName" />
      <el-table-column label="商品名称" align="center" :show-overflow-tooltip="true" prop="commodityName" />
      <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <el-table-column label="包装名称" align="center" :show-overflow-tooltip="true" prop="containerName" />
      <el-table-column label="账面库存数量" align="center" :show-overflow-tooltip="true" prop="systemNum" />
      <el-table-column label="实际盘点数量" align="center" :show-overflow-tooltip="true" prop="inventoryNum" />
    </el-table>
    <div class="pagContainer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[50,100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { searchStockInventoryDetailSelective, searchStockInventoryDetailNum } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      // 总数
      multipleSelection: [],
      orderState: null,
      tableLoading: true,
      listLoading: true,
      loading: true,
      id: null,
      ptypeOptions: [],
      skuOptions: [],
      lastStaTime: 0,
      expandState: 0,
      sums: {},
      tablelist: {},
      tableHeight: 50,
      warehouseOptions: [],
      stateOptions: [],
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 50, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      tableList: []
    }
  },
  created() {
    this.getListDetails(this.pagesize, this.currentPage)
  },
  methods: {
    selectionChangeHandle(val) {
      this.$emit('clickList', val)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      searchStockInventoryDetailSelective({ searchDTO,
        pojo: {
          status: 1
        }}).then(response => {
        this.tablelist = response.data
        this.$emit('tableList', this.tablelist.list)
        this.tableList = this.tablelist.list
        this.tableLoading = false
      })
      searchStockInventoryDetailNum({ searchDTO,
        pojo: {
          status: 1
        }}).then(response => {
        this.totalCount = response.data
        this.tableLoading = false
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getListDetails(val, 1)
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListDetails(this.pagesize, val)
    }
  }
}
</script>
      <style scoped>
      .el-card /deep/ .el-card__header {
      padding: 5px;
      color:#fff;
      text-align: center;
      }
       .el-form /deep/.el-form-item__label{
        color:#fff
      }

      .search {
        margin: 1px;
        float: right
      }
      .btngroups {
        margin: 1px;
      }

      .pagContainer{
        background-color: rgb(9, 41, 71);
      }
      </style>
    <style lang="scss" scoped>
    // 修改对话框高度
    .show_card2 {
          background-color:#262626;
          border-radius: 10px;
        padding-top: 10px;
        }
        .show_card {
        background-color:#262626;
      }
      .detailsTable {
       ::v-deep .el-table tbody tr:hover>td {
      background-color:#162a48!important
    }
      }
    </style>

