<template>
  <div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" class="clearfix">
        <span class="title">系统代码信息填写</span>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
        <el-form-item v-if="false">
          <el-input v-model="form.id" size="mini" style="width: 100px;" clearable />
        </el-form-item>
        <el-form-item label="系统代码名称" prop="codeName">
          <el-input v-model="form.codeName" size="mini" style="width: 200px;" placeholder="如“入库计划单状态”" clearable />
        </el-form-item>
        <el-form-item label="系统代码编码" prop="code">
          <el-input v-model="form.code" size="mini" style="width: 250px;" placeholder="如“INBOUND_ADVICE_STATE”" clearable />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" maxlength="100" show-word-limit style="width: 300px" :rows="5" size="mini" clearable />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input v-model="form.edescription" type="textarea" maxlength="100" show-word-limit style="width: 300px" :rows="5" size="mini" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card1">
      <div slot="header" class="clearfix">
        <span>系统代码明细项信息填写</span>
        <el-button style="float: right;" icon="el-icon-circle-plus-outline" size="small" type="primary" @click="add">新增</el-button>
      </div>
      <el-form ref="formData" :model="formData" :rules="formData.rules">

        <el-table
          ref="tabledatas"
          :data="formData.tabledatas"
          border
          :row-class-name="tableRowClassDetailName"
          :header-cell-style="{background:'#091f2c',color: '#fff'}"
          size="mini"
          :height="tableHeight"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          style="width: 100%, font-size: 10px"
        >
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.codeDetailName'" :rules="formData.rules.codeDetailName">
                <el-input v-model="scope.row.codeDetailName" size="mini" placeholder="如“已创建”" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="编码" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.code'" :rules="formData.rules.code">
                <el-input v-model="scope.row.code" size="mini" placeholder="如“CREATED”" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="尺寸条码" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.barcode" size="mini" placeholder="请输入内容" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="描述" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.description" size="mini" placeholder="非必填" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="英文描述" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.edescription" size="mini" placeholder="非必填" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delect(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-button v-if="!show" type="primary" style="float: right;margin: 2px;" @click="submit">保存</el-button>
      <el-button v-if="show" type="primary" style="float: right;margin: 2px;" @click="update">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { addSysCodeAndDetail, screenSysCode, screenSysCodeDetail, upgradeSysCodeAndDetail } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      tableHeight: 50,
      rules: {
        code: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        codeName: [{ required: true, message: '请填写名称', trigger: 'blur' }]
      },
      formData: {
        rules: {
          codeDetailName: {
            required: true,
            message: '请填写名称',
            tirgger: ['blur']
          },
          code: {
            required: true,
            message: '请填写编码',
            tirgger: ['blur']
          }
        },
        tabledatas: [
        ]
      },
      List: [],
      tableData: [],
      show: false,
      form: {
        id: '',
        codeName: '',
        code: '',
        description: '',
        edescription: ''
      }
    }
  },
  created() {
    if (sessionStorage.systemChildId && sessionStorage.systemId !== null) {
      this.show = true
      this.getList()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 87

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 87
      }
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
    delect(index) {
      this.formData.tabledatas.splice(index, 1)
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    chooseData() {
      this.tableData = []
      screenSysCodeDetail({
        searchDTO: {
          page: 1,
          num: 100
        },
        pojo: {
          systemId: sessionStorage.getItem('systemChildId')
        }}).then(res => {
        this.tableData = res.data.list
        for (let i = 0; i < this.formData.tabledatas.length; i++) {
          if (JSON.stringify(this.tableData[i]) !== JSON.stringify(this.formData.tabledatas[i])) {
            this.List.push(this.formData.tabledatas[i])
          }
        }
      })
    },
    getList() {
      screenSysCode({
        searchDTO: {
          page: 1,
          num: 100
        },
        pojo: {
          code: sessionStorage.getItem('systemId')
        }}).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      screenSysCodeDetail({
        searchDTO: {
          page: 1,
          num: 100
        },
        pojo: {
          systemId: sessionStorage.getItem('systemChildId')
        }}).then(response => {
        this.formData.tabledatas = response.data
      })
    },
    update() {
      // this.chooseData()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              this.$confirm('是否确定更新所填信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                upgradeSysCodeAndDetail({ sysCodeDetailList: this.formData.tabledatas, sysCode: {
                  id: this.form.id,
                  code: this.form.code,
                  codeName: this.form.codeName,
                  description: this.form.description,
                  edescription: this.form.edescription
                }}).then(res => {
                  if (res.code === 200) {
                    this.$message.success('保存成功')
                    this.reload()
                    this.$router.push('/systemdata')
                    sessionStorage.removeItem('systemChildId')
                    sessionStorage.removeItem('systemId')
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
          })
        }
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              this.$confirm('确定保存信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                addSysCodeAndDetail({ sysCodeDetailList: this.formData.tabledatas, sysCode: {
                  code: this.form.code,
                  codeName: this.form.codeName,
                  description: this.form.description,
                  edescription: this.form.edescription
                }}).then(res => {
                  if (res.code === 200) {
                    this.$message.success('保存成功')
                    this.reload()
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
          })
        }
      })
    },
    add() {
      const list = {
        codeName: '',
        name: '',
        barcode: '',
        description: '',
        edescription: ''
      }
      this.formData.tabledatas.push(list)
    }
  }
}
</script>
<style>
  .el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
</style>
  <style scoped>
  .el-card /deep/ .el-card__header {
    color:#fff;
  padding: 5px;
  }
   .el-form /deep/.el-form-item__label{
    color:#fff
  }
  </style>
   <style lang="scss" scoped>
// 修改对话框高度
    .show_card1 {
      background-color:#081b26c3;
    }

</style>
