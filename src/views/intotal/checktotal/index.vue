<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="盘点单头">
        <e-desc-item label="盘点单号:">
          {{ form.inventoryCode }}
        </e-desc-item>
        <e-desc-item label="盘点人:">
          {{ form.inventoryPersonName }}
        </e-desc-item>
        <e-desc-item label="盘点日期:">
          {{ form.applyTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="盘点结果:">
          {{ form.inventoryDes }}
        </e-desc-item>
        <e-desc-item label="盘点结论:">
          {{ form.remark }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <el-form :inline="true" :model="rform" size="mini">
        <el-form-item label="商品名称">
          <el-input v-model="rform.commodityName" />
        </el-form-item>
        <el-form-item label="商品sku" :label-width="formLabelWidth">
          <el-input v-model="rform.skuName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDeatils()">查询</el-button>
          <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clearDetails()">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="detailsTable">
      <el-table
        ref="tablelist"
        v-loading="tableLoading"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tabledatas"
        :height="tableHeight"
        show-summary
        :summary-method="getSummaries"
        border
        size="mini"
        row-key="id"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column label="盘点单表细">
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
          <!-- <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" /> -->
          <el-table-column label="库位名称" align="center" :show-overflow-tooltip="true" prop="locationName" />
          <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customName" />
          <el-table-column label="商品名称" align="center" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="包装名称" align="center" :show-overflow-tooltip="true" prop="containerName" />
          <el-table-column label="账面库存数量" align="center" :show-overflow-tooltip="true" prop="systemNum" />
          <el-table-column label="实际盘点数量" align="center" :show-overflow-tooltip="true" prop="inventoryNum" />
          <el-table-column label="盘点结果" align="center" :show-overflow-tooltip="true" prop="remarks" />
          <!-- <el-table-column
            prop="action"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-delete" type="primary" @click="deleteDetails(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column> -->
        </el-table-column>
      </el-table>
    </div>
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
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'

import { searchStockInventorySelective, searchStockInventoryDetailSelective, searchStockInventoryDetailNum, selectWarehouse, screenGoods } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem
  },
  data() {
    return {
      // 总数
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      options: [],
      toptions: [],
      comOptions: [],
      comStates: [],
      comLoclist: [],
      weight: 0,
      volume: 0,
      money: 0,
      conOptions: [],
      checked: true,
      conStates: [],
      conLoclist: [],
      orderType: null,
      orderState: null,
      uform: {
        warehouseCode: null,
        warehouseName: null,
        inboundType: null,
        warehouseId: null,
        remark: null
      },
      advanced: false,
      tableLoading: true,
      listLoading: true,
      loading: true,
      id: null,
      lastTime: 0,
      laststateTime: 0,
      lasttypeTime: 0,
      lastptypeTime: 0,
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
      listQuery: {
        page: 1,
        limit: 50
      },
      form: {
        inventoryCode: null,
        inventoryPersonName: null,
        applyTime: null,
        inventoryDes: null,
        remark: null
      },
      rform: {
        commodityName: null,
        skuName: null
      },
      tabledatas: []
    }
  },
  created() {
    if (sessionStorage.checkChildId && sessionStorage.checkOrderId !== null) {
      this.getList()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tablelist.$el.offsetTop - 75
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tablelist.$el.offsetTop - 75
      }
    })
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['tablelist'].doLayout()
      // table是在表格中ref=tablelist
      // doLayout	对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    })
  },
  methods: {
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else {
          for (var key in this.sums) {
            if (key === column.property) {
              sums[index] = this.sums[key]
            }
          }
        }
      })
      return sums
    },
    goback() {
      this.$router.go(-1)
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        selectWarehouse({
          pojo: {
          }}).then(res => {
          this.warehouseOptions = res.data
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    funccom(query) {
      screenGoods({
        searchDTO: {
          page: 1,
          num: 1000
        },
        pojo: {
        }
      })
        .then(res => {
          this.comStates = res.data
          this.comLoclist = this.comStates.map(item => {
            return { id: item.id, goodsName: item.goodsName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.comOptions = this.comLoclist.filter(item => {
              return item.goodsName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.comOptions = []
        }
      }, 100)
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
      this.clearDetails()
    },
    clearDetails() {
      this.rform = {
        commodityName: null,
        skuName: null
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      searchStockInventoryDetailSelective({ searchDTO,
        pojo: {
          inventoryId: sessionStorage.getItem('checkChildId'),
          commodityName: this.rform.commodityName,
          skuName: this.rform.skuName
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        this.tableLoading = false
      })
      searchStockInventoryDetailNum({ searchDTO,
        pojo: {
          inventoryId: sessionStorage.getItem('checkChildId'),
          commodityName: this.rform.commodityName,
          skuName: this.rform.skuName
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
    },
    refresh() {
      this.reload()
    },
    getList() {
      searchStockInventorySelective({
        searchDTO: {
          page: 1,
          num: 1
        },
        pojo: {
          id: sessionStorage.getItem('checkOrderId')
        }}).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      this.getListDetails(this.pagesize, this.currentPage)
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
