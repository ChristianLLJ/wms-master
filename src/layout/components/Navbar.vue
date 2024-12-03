<template>
  <div class="navbar">
    <div class="setContain">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <div class="companyData">
      <div class="companyContain">
        宝开（上海）智能物流科技有限公司
      </div>
      <div class="btnContain">
        <div style="margin-right: 10px">
          <!-- <el-dropdown @command="handleCommand2">
            <span class="el-dropdown-link">
              系统操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">重置系统数据</el-dropdown-item>
              <el-dropdown-item command="b">启动OPC</el-dropdown-item>
              <el-dropdown-item command="c">初始化OPC</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button type="primary" size="small" @click="resetDataOpen">重置数据</el-button>
        </div>

        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            系统操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="aa">重置系统数据</el-dropdown-item>
            <!-- <el-dropdown-item command="bb">启动OPC</el-dropdown-item> -->
            <el-dropdown-item command="cc">初始化穿梭车</el-dropdown-item>
            <el-dropdown-item command="a">填写更新日志</el-dropdown-item>
            <el-dropdown-item command="b">查看更新日志</el-dropdown-item>
            <el-dropdown-item command="c">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog v-drag title="重置数据" :visible.sync="dialogVisibles" class="showAll_dialog">
      <div class="checkbox">
        <el-checkbox v-model="checkWave" label="2层(整箱-常用)" border size="mini" />
        <el-checkbox v-model="checkWarehouse" label="3层(分拣机)" border size="mini" />
        <el-checkbox v-model="checkOpc" label="4层(人工拣货)" border size="mini" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="sendAll()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="更新日志：" label-width="120px" prop="content" :rules="{ required: true, message: '请填写', trigger: ['blur'] }">
          <el-input
            v-model="form.content"
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
import { mapGetters } from 'vuex'
import { throttle } from '@/utils/throttle.js'
import { initSystem, addscanUpdate } from '@/api/user'
import { getNowTime } from '@/utils/getTime'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import axios from 'axios'
export default {
  components: {
    Hamburger,
    Breadcrumb
  },
  data() {
    return {
      form: {
        content: ''
      },
      dialogFormVisible: false,
      dialogVisibles: false,
      checkOpc: false,
      checkWave: false,
      checkWarehouse: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    startOpc() {
      this.$confirm('是否确认启动OPC?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          baseURL: API.url_wcs,
          // 请求的 URL
          url: 'api/startServer',
          // 请求方式
          method: 'post',
          // 发送的数据
          data: {},
          // 设置超时
          timeout: 5000
        }).then(result => {
          if (result.data.code === 200) {
            this.$message.success(result.data.data)
          } else {
            this.$message.error(result.data.data)
          }
        })
      })
    },
    resetOpc() {
      this.$confirm('是否确认初始化OPC?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          baseURL: API.url_wcs,
          // 请求的 URL
          url: 'api/initCarSets',
          // 请求方式
          method: 'post',
          // 发送的数据
          data: {},
          // 设置超时
          timeout: 5000
        }).then(result => {
          if (result.data.code === 200) {
            this.$message.success(result.data.data)
          } else {
            this.$message.error(result.data.data)
          }
        })
      })
    },
    resetData() {
      this.$confirm('是否确认重置系统数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        initSystem({}).then(res => {
          if (res.code === 200) {
            this.$message.success('重置成功')
            this.reload()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    sendAll: throttle(function() {
      let arr = []
      if (this.checkWave) {
        arr.push({ id: 2 })
      }
      if (this.checkWarehouse) {
        arr.push({ id: 3 })
      }
      if (this.checkOpc) {
        arr.push({ id: 4 })
      }
      initSystem(arr).then(res => {
        if (res.code === 200) {
          this.$message.success('重置成功！')
          this.dialogVisibles = false
          arr = []
        }
      })
    }, 5000, true),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/loginOut')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    writeUpdate() {
      this.dialogFormVisible = true
    },
    handleCommand(command) {
      if (command === 'a') {
        this.dialogFormVisible = true
      } else if (command === 'b') {
        this.scanUpdate()
      } else if (command === 'c') {
        this.logout()
      } else if (command === 'aa') {
        this.resetData()
      } else if (command === 'bb') {
        this.startOpc()
      } else if (command === 'cc') {
        this.resetOpc()
      }
    },
    resetDataOpen() {
      this.dialogVisibles = true
    },
    // handleCommand2(command) {
    //   if (command === 'a') {
    //     this.resetData()
    //   } else if (command === 'b') {
    //     this.startOpc()
    //   } else if (command === 'c') {
    //     this.resetOpc()
    //   }
    // },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addscanUpdate({
            content: this.form.content,
            createPerson: sessionStorage.getItem('getUserName'),
            createTime: getNowTime(this.form.createTime)
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
    scanUpdate() {
      this.$router.push('/scanUpdate')
    }
  }
}
</script>
<style>
.el-dialog__title {
    line-height: 24px;
    font-size: 20px;
    color: #000;
    font-weight: 600;
}
</style>
<style lang="scss" scoped>
// .resetButton {
//   margin: 0px 30px;
// }
.checkbox {
  width: 100%;
  height: 100px;
  display: flex;
  padding-left: 20px;
  flex-wrap: wrap;
  align-items: center;
label.el-checkbox.el-checkbox--mini.is-bordered:first-child {
background-color: #cb9e5a;
margin-bottom: 0;
}
}
.navbar {
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
.setContain {
  width: 40%;
  // height: 40px;
  float:left;
}
.el-dropdown-link {
  color:#fff;
  font-size: 16px;
  cursor: pointer;
}
  .hamburger-container {
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .companyData {
    line-height: 40px;
    display: flex;
    color:#fff;
    justify-content: space-between;
    .companyContain {
      font-size: 20px;
      color:#cb9e5a;
    }
    .btnContain {
      display: flex;
      margin-right: 10px;
      .image {
        margin-right: 5px;
        margin-top: 5px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        // border: 1px solid #fff;
        background-color: #eee;
        img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
      }
      }

    }
  }
}
</style>
