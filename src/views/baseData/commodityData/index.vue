<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button v-print="'#single-info'" size="mini" type="primary" icon="el-icon-printer" @click="dialogVisible = true">打印</el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-select
            v-model="goodsName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            :remote-method="funcLL"
            clearable
            size="mini"
          >
            <el-option v-for="item in goodsOptions" :key="item.id" :label="item.goodsName" :value="item.goodsName" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :height="tableHeight"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      border
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-class-name="tableRowClassName"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
      @expand-change="expandChange"
    >
      <el-table-column type="expand" align="center">
        <template>
          <div v-if="totalCount >= 10" style="background-color: #262626">
            <el-form :inline="true" class="demo-form-inline" :model="rform">
              <el-form-item label="sku名称" :label-width="formLabelWidth">
                <el-select v-model="rform.skuName" size="mini" placeholder="请选择">
                  <el-option v-for="item in tabledatas" :key="item.id" :label="item.skuName" :value="item.skuName" />
                </el-select>
              </el-form-item>
              <el-form-item label="sku条码" :label-width="formLabelWidth">
                <el-input v-model="rform.skuBarcode" size="mini" style="width: 160px;" placeholder="请输入sku条码" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDeatils()">查询</el-button>
                <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clearDetails()">清空</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            v-loading="tableLoading"
            element-loading-text="正在加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="tabledatas"
            :row-class-name="tableRowClassDetailName"
            border
            :header-cell-style="{background:'#000',color: '#fff'}"
            size="mini"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 5px"
          >
            <el-table-column label="商品sku" align="center">
              <el-table-column type="index" label="序号" align="center" />
              <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
              <el-table-column label="sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
              <el-table-column label="sku条码" align="center" :show-overflow-tooltip="true" prop="skuBarcode" />
              <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="skuSize" />
              <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="skuColor" />
              <el-table-column label="品牌" align="center" :show-overflow-tooltip="true" prop="skuBrand" />
              <el-table-column label="季节" align="center" :show-overflow-tooltip="true" prop="skuSeason" />
              <el-table-column label="国际码" align="center" :show-overflow-tooltip="true" prop="countryBarcode" />
              <el-table-column label="供货商条码" align="center" :show-overflow-tooltip="true" prop="salerBarcode" />
              <el-table-column label="扫描条码1" align="center" :show-overflow-tooltip="true" prop="scanBarcode1" />
              <el-table-column label="扫描条码2" align="center" :show-overflow-tooltip="true" prop="scanBarcode2" />
              <el-table-column label="扫描条码3" align="center" :show-overflow-tooltip="true" prop="scanBarcode3" />
              <el-table-column label="重量(kg)" align="center" :show-overflow-tooltip="true" prop="weight" />
              <el-table-column label="体积(L)" align="center" :show-overflow-tooltip="true" prop="volume" />
              <el-table-column label="采购价(元)" align="center" :show-overflow-tooltip="true" prop="money" />
              <!-- <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remark" /> -->
            </el-table-column>
          </el-table>
          <div class="pagContainer">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20]"
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
      <el-table-column label="商品名称" align="center" :show-overflow-tooltip="true" prop="goodsName" />
      <el-table-column label="商品代码" align="center" :show-overflow-tooltip="true" prop="code" />
      <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
      <el-table-column label="商品条码" align="center" :show-overflow-tooltip="true" prop="barcode" />
      <el-table-column label="商品条码(扩充)" align="center" :show-overflow-tooltip="true" prop="barcode2" />
      <el-table-column v-if="false" label="创建日期" align="center" :show-overflow-tooltip="true" prop="createTime">
        <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column v-if="false" label="更新时间" align="center" :show-overflow-tooltip="true" prop="updateTime">
        <template slot-scope="scope">{{ scope.row.updateTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column v-if="false" label="创建人" align="center" :show-overflow-tooltip="true" prop="addPersonName" />
      <el-table-column v-if="false" label="审核人" align="center" :show-overflow-tooltip="true" prop="checkPersonName" />
      <el-table-column
        prop="action"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">删除</el-button>
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
    <el-dialog
      title="打印"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div id="print" ref="print">
        <barcode id="imgcode" :value="barcodeValue">
          显示失败
        </barcode>
        <div class="title">测试</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="prints">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { kkdeboundce } from '@/utils/kkdebounce'
import Pagination from '@/components/Pagination'
import { screenGoods, screenGoodsSum, screenGoodsSkuSum, screenGoodsSku } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      expands: [],
      goodsName: null,
      goodsOptions: [],
      barcodeValue: 'PAB230509020001',
      loclist: [],
      skuOptions: [],
      states: [],
      code: null,
      barcode: null,
      advanced: false,
      listLoading: true,
      tableLoading: true,
      dialogVisible: false,
      id: null,
      total: 0,
      tableHeight: 50,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      rform: {
        skuCode: null,
        skuBarcode: null,
        skuName: null,
        skuSize: null,
        skuColor: null,
        skuBrand: null,
        skuSeason: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  created() {
    this.getList()
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 77

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 77
      }
    })
  },
  methods: {
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    funcSku() {
      screenGoodsSku({ searchDTO: {
        num: 10000000,
        page: 1
      },
      pojo: {
      }}).then(res => {
        this.skuOptions = res.data.map(item => {
          return { id: item.id, skuName: item.skuName }
        })
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    prints() {
      this.$print(this.$refs.print)
    },
    funcLL(query) {
      screenGoods({
        searchDTO: {
          num: 100000,
          page: 1
        },
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, goodsName: item.goodsName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.goodsOptions = this.loclist.filter(item => {
              return item.goodsName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.goodsOptions = []
        }
      }, 100)
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
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
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
      this.clearDetails()
      this.dialogTableVisible = false
    },
    clearDetails() {
      this.rform = {
        skuCode: null,
        skuBarcode: null,
        skuName: null,
        skuSize: null,
        skuColor: null,
        skuBrand: null,
        skuSeason: null
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      screenGoodsSku({ searchDTO,
        pojo: {
          goodsId: this.id,
          skuCode: this.rform.skuCode,
          skuBarcode: this.rform.skuBarcode,
          skuName: this.rform.skuName,
          skuSize: this.rform.skuSize,
          skuColor: this.rform.skuColor,
          skuBrand: this.rform.skuBrand,
          skuSeason: this.rform.skuSeason
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenGoodsSkuSum({ searchDTO,
        pojo: {
          goodsId: this.id,
          skuCode: this.rform.skuCode,
          skuBarcode: this.rform.skuBarcode,
          skuName: this.rform.skuName,
          skuSize: this.rform.skuSize,
          skuColor: this.rform.skuColor,
          skuBrand: this.rform.skuBrand,
          skuSeason: this.rform.skuSeason
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
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
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    // 单个删除
    delect(row) {
      // this.$confirm('是否确认删除本条数据?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   deleteContainer({ id: row.id }).then(res => {
      //     if (res.code === 0) {
      //       this.$message.success('删除成功')
      //       this.reload()
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    edit(row) {
      this.$router.push('/commoditylist')
      sessionStorage.setItem('commodityChildId', row.id)
      sessionStorage.setItem('commodityId', row.goodsName)
    },
    getList() {
      this.listLoading = true
      screenGoods({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        goodsName: this.goodsName,
        code: this.code,
        barcode: this.barcode
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenGoodsSum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        goodsName: this.goodsName,
        code: this.code,
        barcode: this.barcode
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    add() {
      this.$router.push('/commoditylist')
      sessionStorage.removeItem('commodityChildId')
      sessionStorage.removeItem('commodityId')
    }
  }
}
</script>
  <style scoped>
  .search {
    margin: 1px;
    float: right
  }
       .el-form /deep/.el-form-item__label{
    color:#fff
  }
  .btngroups {
    margin: 1px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
  <style lang="scss" scoped>
#imgcode {
  margin-top: 20px;
}
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
  }
</style>

