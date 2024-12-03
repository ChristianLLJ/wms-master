<template>
  <div>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :header-cell-style="{background:'#000',color: '#fff'}"
      height="600px"
      border
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="客户" sortable="custom" align="center" :show-overflow-tooltip="true" prop="customName" />
      <el-table-column label="客户代码" sortable="custom" align="center" :show-overflow-tooltip="true" prop="customCode" />
      <el-table-column label="包装单位" sortable="custom" align="center" :show-overflow-tooltip="true" prop="containerName" />
      <el-table-column label="可用数量" sortable="custom" align="center" :show-overflow-tooltip="true" prop="availableCnt" />
      <el-table-column label="冻结数量" sortable="custom" align="center" :show-overflow-tooltip="true" prop="freezeCnt" />
      <el-table-column label="体积(L)" sortable="custom" align="center" :show-overflow-tooltip="true" prop="volume" />
      <el-table-column label="毛重(kg)" sortable="custom" align="center" :show-overflow-tooltip="true" prop="weight" />
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
import { selectByCustomName } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: false,
      screen: '',
      sortField: {},
      tableData: [],
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    getList() {
      this.listLoading = true
      selectByCustomName(
        { searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        screen: this.screen }
      ).then(res => {
        this.tableData = res.data.results
        this.total = res.data.num
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>

      <style lang="scss" scoped>

      </style>

