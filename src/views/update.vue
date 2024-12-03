<template>
  <div class="table_contain">
    <el-card style="border-radius: 20px; margin: 0 10px;" shadow="always">
      <div class="search">
        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label="填写人">
            <el-input v-model="form.createPerson" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="填写时间">
            <el-date-picker
              v-model="value"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              size="small"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-search" round size="small" @click="search()">查询</el-button>
            <el-button size="small" icon="el-icon-plus" type="primary" round @click="writeUpdate">填写更新日志</el-button>
            <el-button size="small" type="warning" round icon="el-icon-back" @click="goback">返回上一页</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table">
      <el-table
        ref="table"
        :data="tableData"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#000',color: '#fff'}"
        border
        style="width: 100%"
      >
        <el-table-column label="更新日志" align="center">
          <el-table-column width="180" label="日期" sortable="custom" align="center" :show-overflow-tooltip="true" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
          </el-table-column>
          <el-table-column
            prop="createPerson"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="content"
            label="描述"
          />
          <el-table-column
            width="180px"
            prop="action"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="rform">
        <el-form-item label="更新日志：" label-width="120px" prop="content" :rules="{ required: true, message: '请填写', trigger: ['blur'] }">
          <el-input
            v-model="rform.content"
            type="textarea"
            autosize
            placeholder="请填写"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { deletescanUpdate, addscanUpdate, screenscanUpdate, screenscanUpdateNum } from '@/api/user'
import { getNowTime } from '@/utils/getTime'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      tableData: [],
      rform: {
        content: ''
      },
      dialogFormVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 50
      },
      tableHeight: 50,
      value: [],
      form: {
        createPerson: null
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 40
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 40
      }
    })
  },
  methods: {
    getList() {
      screenscanUpdate({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        createPerson: this.form.createPerson
      },
      startTime: this.value[0] ? this.value[0] : '',
      endTime: this.value[1] ? this.value[1] : '' }).then(response => {
        this.tableData = response.data
      })
      screenscanUpdateNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        createPerson: this.form.createPerson
      },
      startTime: this.value[0] ? this.value[0] : '',
      endTime: this.value[1] ? this.value[1] : ''
      }).then(response => {
        this.total = response.data
      })
    },
    goback() {
      this.$router.go(-1)
    },
    writeUpdate() {
      this.dialogFormVisible = true
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addscanUpdate({
            content: this.rform.content,
            createPerson: sessionStorage.getItem('getUserName'),
            createTime: getNowTime(this.rform.createTime)
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('提交成功')
              this.dialogFormVisible = false
              this.$refs.form.resetFields()
              this.reload()
            }
          })
        }
      })
    },
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletescanUpdate({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000)
  }
}

</script>
<style lang="scss" scoped>
.table_contain {
.table {
    padding: 10px 10px 0 10px;
}
}
</style>

