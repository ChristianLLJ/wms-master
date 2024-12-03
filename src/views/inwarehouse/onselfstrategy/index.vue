<template>
  <div class="mainApp">
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="上架策略名称">
            <el-input v-model="strategyName" size="small" style="width: 160px;" placeholder="请输入上架策略" clearable />
          </el-form-item>
          <el-form-item label="仓库">
            <el-select v-model="warehouseName" size="small" placeholder="请选择仓库" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户">
            <el-input v-model="customName" size="small" style="width: 400px;" placeholder="请输入客户" clearable />

          </el-form-item>
          <el-form-item>
            <el-button type="primary" round icon="el-icon-search" size="small" @click="search">搜索</el-button>

          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="add">新增上架策略</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>

    <el-card :body-style="{padding:'0px'}" shadow="always">
      <el-table
        ref="tableData"
        v-loading="listLoading"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tableData"
        :height="tableHeight"
        :row-key="getRowKeys"
        border
        :expand-row-keys="expands"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        :header-cell-style="{background:'#000',color: '#fff'}"
        size="mini"
        style="width: 100%, font-size: 10px"
        :header-cell-class-name="handleHeadAddClass"
        @expand-change="expandChange"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand">
          <div class="detailsTable">
            <template>
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
                style="width: 100%, font-size: 10px"
                @selection-change="handleSelectionChange"
              >
                <!-- <el-table-column type="selection" /> -->
                <el-table-column v-if="false" label="id" prop="id" />
                <el-table-column type="index" label="序号" />
                <el-table-column label="上架规则代码" :show-overflow-tooltip="true" prop="ruleDetailCode" />
                <el-table-column v-if="false" label="库位限制系统代码id" :show-overflow-tooltip="true" prop="locationLimitSystemId" />
                <el-table-column v-if="false" label="空间限制系统代码id" :show-overflow-tooltip="true" prop="spaceLimitSystemId" />
                <el-table-column label="优先级" :show-overflow-tooltip="true" prop="priority" />
                <el-table-column label="上架规则名称" :show-overflow-tooltip="true" prop="ruleDetailName" />
              </el-table>
              <div class="pagContainer">
                <el-pagination
                  :current-page="currentPage"
                  :page-sizes="[5, 10]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </template>
          </div>
        </el-table-column>
        <!-- <el-table-column type="selection" /> -->
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          v-if="false"
          prop="id"
        />
        <el-table-column label="上架策略代码" sortable="custom" prop="strategyCode" :show-overflow-tooltip="true" />
        <el-table-column label="上架策略名称" sortable="custom" prop="strategyName" :show-overflow-tooltip="true" />
        <el-table-column label="客户代码" sortable="custom" prop="customCode" :show-overflow-tooltip="true" />
        <el-table-column label="客户名称" sortable="custom" prop="customName" :show-overflow-tooltip="true" />
        <el-table-column label="仓库代码" sortable="custom" prop="warehouseCode" :show-overflow-tooltip="true" />
        <el-table-column label="仓库名称" sortable="custom" prop="warehouseName" :show-overflow-tooltip="true" />
        <el-table-column v-if="false" label="是否启用" prop="isUsable" :show-overflow-tooltip="true" :formatter="formatter" />
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectOnshelfStrategy, selectOnshelfStrategyNum, selectWarehouse, selectOnshelfStrategyDetailNum, selectOnshelfStrategyDetail } from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      total: 0,
      expands: [],
      form: {},
      multipleSelection: [],
      show: true,
      tabledatas: [],
      strategyName: null,
      warehouseOptions: [],
      tableLoading: true,
      listLoading: true,
      warehouseName: null,
      customName: null,
      custom: null,
      tableHeight: 50,
      lastTime: 0,
      sortField: {},
      screen: '',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      tableData: []
    }
  },
  created() {
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
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    formatter(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    handleSortChange({ order, prop }) {
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      this.screen = ''
      // this.screenNull = ''
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null
      } else {
        this.sortField[prop] = order
      }
      let direction = ''
      for (const i in this.sortField) {
        if (this.sortField[i] === 'ascending') {
          direction = 'asc'
        } else if (this.sortField[i] === 'descending') {
          direction = 'desc'
        } else {
          direction = 'null'
        }
        if (direction === 'null') {
          continue
        } else if (this.screen === '') {
          this.screen += i + ' ' + direction
        } else {
          this.screen += ',' + i + ' ' + direction
        }
      }
      // this.screen = this.screenNull
      this.getList() // 调用后端查询接口
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
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
    add() {
      this.$router.push('/strategylist')
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectOnshelfStrategyDetail({ searchDTO,
        pojo: {
          onshelfStrategyId: this.id
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfStrategyDetailNum({ searchDTO,
        pojo: {
          onshelfStrategyId: this.id
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    clear() {
      this.combineCode = null
      this.warehouseName = null
      this.customName = null
      this.getList()
    },
    search() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      selectOnshelfStrategy({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        strategyName: this.strategyName,
        warehouseName: this.warehouseName,
        customName: this.customName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfStrategyNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        strategyName: this.strategyName,
        warehouseName: this.warehouseName,
        customName: this.customName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
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
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    refresh() {
      this.reload()
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
      }
    }
  }
}
</script>

<style scoped>
  .btngroups {
    margin: 5px;
  }
    .search {
    margin: 5px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>

