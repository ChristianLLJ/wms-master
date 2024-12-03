<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <el-form :inline="true" size="mini" label-width="120px">
        <div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="仓库从">
                <el-input placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库到">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户从">
                <el-input placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户到">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="库区从">
                <el-input placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="库区到">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="库位从">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="库位到">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品从">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品到">
                <el-input placeholder="请输入" />

              </el-form-item>
            </el-col>
            <el-col :span="6" />
            <el-col :span="6" />
          </el-row>

        </div>
      </el-form>
      <el-button style="float:right; margin-bottom: 5px" icon="el-icon-search" type="primary" round size="small">模糊查询</el-button>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  }
}
</script>
