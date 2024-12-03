<template>
  <div class="loginbody">
    <div class="logindata">
      <div class="logintext">
        <div class="imgContent">
          <img src="@/assets/baokai.png" alt="出错啦！">
        </div>
        <h2>i-wms</h2>
      </div>
      <div class="formdata">
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              clearable
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              clearable
              show-password
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="id">
            <el-select v-model="loginForm.id" style="width:398px" placeholder="请选择工作组" clearable @focus="func">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="butt">
        <el-button
          type="primary"
          @click.native.prevent="submit"
        >登录</el-button>
        <el-button class="shou" @click="open">注册</el-button>
      </div>
    </div>
    <div class="comdataContain">
      <div class="totalContain">
        <div class="imgContent">
          <!-- <img src="@/assets/baokai.png" alt="出错啦！"> -->
        </div>
        <div class="companyContain">
          <div>
            <h3>宝开（上海）智能物流科技有限公司</h3>
            <h4>Baokai (Shanghai) Intelligent Logistics Technology Co., Ltd</h4>
          </div>
        </div>
        <div class="messageContain">
          <div class="phoneContain">
            <h5>电话：021-64092886</h5>
            <h5>地址：上海市闵行区元江路525号20号楼</h5>
          </div>
        </div>
        <div class="iconContain">
          <img src="@/assets/codepicture.jpg" alt="出错啦！">
        </div>
      </div>
      <!-- <company-data /> -->
    </div>
    <el-dialog title="注册" :visible.sync="dialogFormVisible" :append-to-body="true" class="showAll_dialog2">
      <el-form ref="rform" :rules="rules" :model="rform" size="mini">
        <el-form-item label="所属公司" :label-width="formLabelWidth" prop="companyName">
          <el-select v-model="rform.companyName" size="mini" @focus="funccompany">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.companyName" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" prop="departmentName">
          <el-select v-model="rform.departmentName" size="mini" @focus="funcdepartment">
            <el-option v-for="item in departmentOptions" :key="item.id" :label="item.departmentName" :value="item.departmentName" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作组" :label-width="formLabelWidth" prop="curWorkGroup">
          <el-select v-model="rform.curWorkGroup" placeholder="请选择工作组" clearable @focus="funcworkgroup">
            <el-option
              v-for="item in workoptions"
              :key="item.id"
              :label="item.groupName"
              :value="item.groupName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="staffName">
          <el-input v-model="rform.staffName" style="width:200px" autocomplete="off" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="rform.username" style="width:200px" autocomplete="off" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="rform.password" style="width:200px" autocomplete="off" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth" prop="staffId">
          <el-input v-model="rform.staffId" autocomplete="off" placeholder="请输入工号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="register">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { workGroupInfo, addStaff, selectWorkGroup, singleTest, getUserId, loginWorkGroup } from '@/api/user'
// import { setToken } from '@/request/auth'
// import CompanyData from './components/CompanyData'

import { searchcompany, searchdepartment } from '@/utils/search'

export default {
  name: 'Login',
  components: {
    // CompanyData
  },
  data() {
    return {
      rform: {
        username: null,
        staffName: null,
        companyName: null,
        departmentName: null,
        curWorkGroup: null,
        staffId: null,
        password: null
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      options: [],
      workoptions: [],
      companyOptions: [],
      departmentOptions: [],
      lastTime: 0,
      lastcompanyTime: 0,
      lastdepartmentTime: 0,
      lastworkTime: 0,
      id: null,
      rules: {
        companyName: [{ required: true, message: '请选择公司', trigger: ['change', 'blur'] }],
        departmentName: [{ required: true, message: '请选择部门', trigger: ['change', 'blur'] }],
        curWorkGroup: [{ required: true, message: '请选择工作组', trigger: ['change', 'blur'] }],
        username: [{ required: true, message: '请输入用户名', trigger: ['change', 'blur'] }],
        staffId: [{ required: true, message: '请输入工号', trigger: ['change', 'blur'] }],
        staffName: [{ required: true, message: '请输入姓名', trigger: ['change', 'blur'] },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入汉字', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}/, message: '密码6-20位，字母、数字和标点符号至少包含两种', trigger: 'change' }]
      },
      loginForm: {
        username: 'one',
        password: '123'
      },
      redirect: undefined,
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请选择工作组', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    func() {
      if (this.loginForm.username === '') {
        this.$message.warning('请先输入用户名和密码！')
      } else {
        getUserId({
          username: this.loginForm.username
        }).then(res => {
          if (res.code === 200) {
            this.id = res.data
            const now = new Date().valueOf()
            if (this.lastTime === 0) {
              workGroupInfo({ id: this.id,
                page: 1,
                num: 1 }).then(res => {
                this.options = res.data.results
              }
              )
              this.lastTime = now
            } else {
              if ((now - this.lastTime) > 5000) {
                this.lastTime = now
              }
            }
          }
        })
      }
    },
    funccompany() {
      const now = new Date().valueOf()
      if (this.lastcompanyTime === 0) {
        searchcompany().then(res => {
          this.companyOptions = res.data
        }
        )
        this.lastcompanyTime = now
      } else {
        if ((now - this.lastcompanyTime) > 5000) {
          this.lastcompanyTime = now
        }
      }
    },
    funcdepartment() {
      const now = new Date().valueOf()
      if (this.lastdepartmentTime === 0) {
        searchdepartment().then(res => {
          this.departmentOptions = res.data
        }
        )
        this.lastdepartmentTime = now
      } else {
        if ((now - this.lastdepartmentTime) > 5000) {
          this.lastdepartmentTime = now
        }
      }
    },
    funcworkgroup() {
      const now = new Date().valueOf()
      if (this.lastworkTime === 0) {
        selectWorkGroup({
          pojo: {
          }}).then(res => {
          this.workoptions = res.data
        }
        )
        this.lastworkTime = now
      } else {
        if ((now - this.lastworkTime) > 5000) {
          this.lastworkTime = now
        }
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          window.sessionStorage.setItem('workGroupId', this.id)
          this.handleLogin()
        }
      })
    },
    register() {
      this.$refs.rform.validate((valid) => {
        if (valid) {
          addStaff({
            username: this.rform.username,
            staffName: this.rform.staffName,
            staffId: this.rform.staffId,
            companyName: this.rform.companyName,
            departmentName: this.rform.departmentName,
            curWorkGroup: this.rform.curWorkGroup,
            password: this.rform.password
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('注册成功')
              this.dialogFormVisible = false
              this.$refs.rform.resetFields()
            }
          })
        }
      })
    },
    open() {
      this.dialogFormVisible = true
    },
    handleSingle() {
      singleTest()
    },
    handleWork() {
      loginWorkGroup({ workGroupId: this.id })
    },
    handleLogin() {
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/' })
        this.handleSingle()
        this.handleWork()
      })
    }
  }
}
</script>

<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  background-image: url("../../assets/wmsdesign.png");
  z-index: 0;
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 80px;
}
     .el-form /deep/.el-form-item__label{
    color:#fff
  }
.logintext {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}
.logindata {
  width: 400px;
  height: 300px;
  transform: translate(-50%);
  margin-left: 25%;
}
  img {
    height: 50px
}
.butt {
  margin-top: 10px;
  text-align: center;
}

.shou {
  cursor: pointer;
  color: #606266;
}

</style>
<style lang="scss">
$light_gray:#fff;
$cursor: #fff;

.logindata {
 .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
  <style lang="scss" scoped>
  .comdataContain {
  width: 100%;
  position: absolute;
  z-index: -1;
  bottom: 0
}
.totalContain {
    // width: 100%;
    height: 120px;
    display: flex;
    justify-content: space-around;
    color: #fff;
    align-items: center;
    .imgContent {
    height: 120px;
    }
    .companyContain {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30%;
      height: 120px;
    }
    .messageContain {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20%;
      height: 120px;
    }
    .iconContain {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
        width:80px;
        height: 80px
    }
}
  }
// 修改对话框高度
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      background-color: #091f2c;

      .el-dialog__body {
        line-height: 30px;
        color: white;
        padding: 10px 15px;
        height: 80%
      }
      .el-dialog__title {
        color: white;
        caret-color: transparent;
      }
      .el-icon-close {
        color: white;
        &:hover {
          color:rgb(9,205,219)
        }
      }
    }
  }
</style>
