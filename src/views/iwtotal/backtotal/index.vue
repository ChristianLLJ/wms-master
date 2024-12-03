<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>

    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="退货订单-单头信息">
        <e-desc-item label="退货订单编号:">
          {{ form.orderId }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="客户:">
          {{ form.customName }}
        </e-desc-item>
        <e-desc-item label="供应商:">
          {{ form.supplierName }}
        </e-desc-item>
        <e-desc-item label="添加人:">
          {{ form.addPersonName }}
        </e-desc-item>
        <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <!-- <e-desc-item label="收货时间:">
          {{ form.receiveTime| dateYMDHMSFormat }}
        </e-desc-item> -->
        <e-desc-item label="修改时间:">
          {{ form.createTime| dateYMDHMSFormat }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <el-row>
        <el-col :span="18">
          <GoodsChoose :goodsform="goodsform" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" round size="small" @click="searchDeatils()">查询</el-button>

        </el-col>
      </el-row>
    </el-card>
    <div class="detailsTable">
      <el-table
        ref="tablelist"
        v-loading="tableLoading"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tabledatas"
        show-summary
        :summary-method="getSummaries"
        :height="tableHeight"
        border
        size="mini"
        row-key="id"
        :row-class-name="tableRowClassDetailName"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column label="退货订单-表细信息">
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column type="index" label="序号" />
          <el-table-column v-if="false" label="退货订单表头Id" :show-overflow-tooltip="true" prop="orderId" />
          <el-table-column v-if="false" label="行号" :show-overflow-tooltip="true" prop="rowNum" />
          <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="商品数量" :show-overflow-tooltip="true" prop="predictNum" />
          <el-table-column label="商品包装" :show-overflow-tooltip="true" prop="containerName" />
          <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
          <el-table-column label="所需包装数(个)" :show-overflow-tooltip="true" prop="predictContainerNum" />
          <el-table-column label="实际包装数(个)" :show-overflow-tooltip="true" prop="factContainerNum" />
          <el-table-column label="实际商品数(个)" :show-overflow-tooltip="true" prop="factNum" />
          <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
          <el-table-column label="总金额(元)" :show-overflow-tooltip="true" prop="totalMoney" />
          <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
          <el-table-column label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
          <!-- <el-table-column label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
            <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
          </el-table-column> -->
          <el-table-column v-if="false" label="备注" :show-overflow-tooltip="true" prop="remark" />
          <el-table-column
            prop="action"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-delete" round type="danger" @click="deleteDetails(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
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
import GoodsChoose from '@/components/GoodsChoose'
import { selectPurchaseOrderDetail, selectWarehouse, delDetail, selectPurchaseOrderDetailNum, selectPurchaseOrder } from '@/api/user'
import { searchsystemid } from '@/utils/search'
// import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem, GoodsChoose
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
      goodsform: {
        commodityId: null,
        skuName: null,
        containerName: null,
        unit: null
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
      formLabelWidth: '77px',
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
        orderId: null,
        warehouseId: null,
        customName: null,
        supplierName: null,
        createtTime: null,
        receiveTime: null,
        addPersonName: null,
        checkPersonName: null
      },
      tabledatas: []
    }
  },
  created() {
    if (sessionStorage.childId && sessionStorage.orderId !== null) {
      this.getList()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tablelist.$el.offsetTop - 77
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tablelist.$el.offsetTop - 77
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
    funType() {
      const now = new Date().valueOf()
      if (this.lastptypeTime === 0) {
        searchsystemid('INBOUND_ADVICE_TYPE').then(res => {
          this.ptypeOptions = res.data
        }
        )
        this.lastptypeTime = now
      } else {
        if ((now - this.lastptypeTime) > 5000) {
          this.lastptypeTime = now
        }
      }
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
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDetail([{ id: row.id }]).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails(this.pagesize, this.currentPage)
          }
        })
      })
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectPurchaseOrderDetail({ searchDTO,
        pojo: {
          orderId: sessionStorage.getItem('childId'),
          commodityId: this.goodsform.commodityId,
          skuName: this.goodsform.skuName,
          containerName: this.goodsform.containerName,
          unit: this.goodsform.unit
          // factSkuNum: this.goodsform.factSkuNum
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        this.tableLoading = false
      })
      selectPurchaseOrderDetailNum({ searchDTO,
        pojo: {
          orderId: sessionStorage.getItem('childId'),
          commodityId: this.goodsform.commodityId,
          skuName: this.goodsform.skuName,
          containerName: this.goodsform.containerName,
          unit: this.goodsform.unit
          // factSkuNum: this.goodsform.factSkuNum
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
      selectPurchaseOrder({
        pojo: {
          orderId: sessionStorage.getItem('orderId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
        this.funType()
        for (var i = 0; i < this.ptypeOptions.length; i++) {
          if (this.orderType === this.ptypeOptions[i].typeNumber) {
            this.orderType = this.ptypeOptions[i].codeDetailName
          }
        }
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

