<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增库位</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-delete" @click="delectAll">批量删除</el-button> -->
            <!-- <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button> -->
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="search">
          <el-select v-model="warehouseName" size="mini" clearable placeholder="请选择所属仓库" @focus="func">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
          <el-select v-model="areaName" size="mini" clearable placeholder="请选择所属库区" @focus="sfuncArea">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
          <!-- <el-select v-model="groupName" size="mini" placeholder="请选择库位组" @focus="funcLoc">
            <el-option v-for="item in locOptions" :key="item.id" :label="item.groupName" :value="item.groupName" />
          </el-select> -->
          <el-select v-model="containerCode" clearable size="mini" placeholder="请选择所属货架" @focus="sfuncHand">
            <el-option v-for="item in handOptions" :key="item.id" :label="item.code" :value="item.code" />
          </el-select>
          <el-select
            v-model="locationName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入库位名称"
            :remote-method="funcLL"
            size="mini"
          >
            <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
          </el-select>
          <!-- <el-select v-model="locationType" clearable size="mini" placeholder="请选择库位类型">
            <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select> -->
          <el-button-group>
            <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clear">清空</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <div style="float:right;margin: 2px">
      <choose @changeState="changeState" @changeWarnState="changeWarnState" />
    </div>
    <el-dialog title="库位修改" :visible.sync="dialogVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="uform" size="mini">
        <el-form-item v-if="false" prop="id">
          <el-input v-model="uform.id" />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id" prop="warehouseId">
          <el-input v-model="uform.warehouseId" size="mini" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属仓库" :label-width="formLabelWidth" prop="warehouseName">
              <el-select v-model="uform.warehouseName" size="mini" @focus="func" @change="changeWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="areaName" :label-width="formLabelWidth" label="所属库区">
              <el-select v-model="uform.areaName" placeholder="请选择库区" @focus="funcArea" @change="changeAreaOptions">
                <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="false" label="库区代码" prop="areaId">
          <el-input v-model="uform.areaId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item label="所属库位组" :label-width="formLabelWidth">
              <el-select v-model="uform.locationGroupName" style="width: 200px" size="mini" @focus="funcLoc">
                <el-option v-for="item in locOptions" :key="item.id" :label="item.groupName" :value="item.groupName" />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属货架" :label-width="formLabelWidth" prop="containerCode">
              <el-select v-model="uform.containerCode" size="mini" @focus="funcHand">
                <el-option v-for="item in handOptions" :key="item.id" :label="item.code" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位名称" :label-width="formLabelWidth" prop="locationName">
              <el-input v-model="uform.locationName" autocomplete="off" placeholder="请输入库位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位类型" :label-width="formLabelWidth" prop="locationType">
              <el-select v-model="uform.locationType" size="mini">
                <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在排" :label-width="formLabelWidth" prop="rows">
              <el-input v-model="uform.rows" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在行" :label-width="formLabelWidth" prop="columns">
              <el-input v-model="uform.columns" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在层" :label-width="formLabelWidth" prop="layer">
              <el-input v-model="uform.layer" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="库位长度(cm)" :label-width="formLabelWidth" prop="length">
              <el-input v-model="uform.length" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位宽度(cm)" :label-width="formLabelWidth" prop="wideth">
              <el-input v-model="uform.wideth" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位高度(cm)" :label-width="formLabelWidth" prop="high">
              <el-input v-model="uform.high" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量生成库位" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini">
        <el-form-item v-if="false" label="仓库id" prop="warehouseId">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属仓库" :label-width="formLabelWidth" prop="warehouseName">
              <el-select v-model="form.warehouseName" size="mini" @focus="func" @change="changeWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="areaName" :label-width="formLabelWidth" label="所属库区">
              <el-select v-model="form.areaName" placeholder="请选择库区" @focus="funcArea" @change="changeAreaOptions">
                <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="false" :label-width="formLabelWidth" label="库区代码" prop="areaId">
          <el-input v-model="form.areaId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item label="所属库位组" :label-width="formLabelWidth">
              <el-select v-model="form.locationGroupName" style="width: 200px" size="mini" @focus="funcLoc">
                <el-option v-for="item in locOptions" :key="item.id" :label="item.groupName" :value="item.groupName" />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属货架" :label-width="formLabelWidth" prop="containerCode">
              <el-select v-model="form.containerCode" size="mini" @focus="funcHand">
                <el-option v-for="item in handOptions" :key="item.id" :label="item.code" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位名称" :label-width="formLabelWidth" prop="locationName">
              <el-input v-model="form.locationName" autocomplete="off" placeholder="请输入库位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位类型" :label-width="formLabelWidth" prop="locationType">
              <el-select v-model="form.locationType" size="mini">
                <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="排数" :label-width="formLabelWidth" prop="rows">
              <el-input v-model="form.rows" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行数" :label-width="formLabelWidth" prop="columns">
              <el-input v-model="form.columns" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层数" :label-width="formLabelWidth" prop="layer">
              <el-input v-model="form.layer" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单个库位长度(cm)" :label-width="formLabelWidth" prop="length">
              <el-input v-model="form.length" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单个库位宽度(cm)" :label-width="formLabelWidth" prop="wideth">
              <el-input v-model="form.wideth" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单个库位高度(cm)" :label-width="formLabelWidth" prop="high">
              <el-input v-model="form.high" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
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
      <!-- :span-method="objectSpanMethod" -->

      <!-- <el-table-column type="selection" align="center" /> -->
      <!-- <el-table-column type="expand" align="center">
        <template slot-scope="scope">
          <div style="background-color: #262626">
            <el-form>
              <el-form-item label="库位所属仓库：" prop="warehouseName">
                <span>{{ scope.row.warehouseName }}</span>
              </el-form-item>
              <el-form-item label="库位所属库区：" prop="areaName">
                <span>{{ scope.row.areaName }}</span>
              </el-form-item>
              <el-form-item label="库位所属库位组：" prop="locationGroupName">
                <span>{{ scope.row.locationGroupName }}</span>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column label="库位名称" align="center" width="200px" :show-overflow-tooltip="true" prop="locationName" />
      <el-table-column label="库位代码" align="center" width="150px" :show-overflow-tooltip="true" prop="locationCode" />
      <el-table-column label="排号" align="center" prop="rows" />
      <el-table-column label="行号" align="center" prop="columns" />
      <el-table-column label="层号" align="center" prop="layer" />
      <el-table-column label="是否已使用" align="center" width="150px" :show-overflow-tooltip="true" prop="isLocked">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isLocked === true" size="mini" type="success">已使用</el-tag>
            <el-tag v-if="scope.row.isLocked === false" size="mini" type="warning">未使用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库位类型" align="center" width="200px" prop="locationType" :formatter="stateFormat" :show-overflow-tooltip="true" />
      <el-table-column label="所属仓库" align="center" width="120px" :show-overflow-tooltip="true" prop="warehouseName" />
      <el-table-column label="所属库区" align="center" width="120px" :show-overflow-tooltip="true" prop="areaName" />
      <el-table-column v-if="false" label="所属库位组" align="center" width="200px" :show-overflow-tooltip="true" prop="locationGroupName" />
      <el-table-column label="所属货架" align="center" width="120px" :show-overflow-tooltip="true" prop="containerCode" />
      <el-table-column label="长(cm)" align="center" prop="length" />
      <el-table-column label="宽(cm)" align="center" prop="wideth" />
      <el-table-column label="高(cm)" align="center" prop="high" />
      <el-table-column v-if="false" label="数量容量(个)" align="center" prop="numCapacity" />
      <el-table-column v-if="false" label="重量容量(kg)" align="center" prop="weightCapacity" />
      <el-table-column v-if="false" label="体积容量(L)" align="center" prop="volumeCapacity" />
      <el-table-column
        fixed="right"
        width="200px"
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// addLocation
import { selectLocation, screenTable, selectLocationNum, selectLocationGroup, selectArea, delLocation, updLocationl, importLocation } from '@/api/user'
import { searchsystemid, searchallwarehouse } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import { kkdeboundce } from '@/utils/kkdebounce'
import choose from './components/choose.vue'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, choose },
  data() {
    return {
      expands: [],
      id: null,
      spanArr: [],
      locationOptions: [],
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '160px',
      show: false,
      spanArr1: [],
      containerCode: null,
      spanArr2: [],
      spanArr3: [],
      areaOptions: [],
      warehouseOptions: [],
      locOptions: [],
      handOptions: [],
      warehouseName: null,
      locationName: null,
      groupName: null,
      locationType: null,
      isLocked: null,
      areaName: null,
      laststateTime: 0,
      lastTime: 0,
      lastAreaTime: 0,
      lastLocTime: 0,
      lastHandTime: 0,
      options: [],
      states: [],
      loclist: [],
      tableHeight: 50,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        areaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        locationGroupName: [{ required: true, message: '请选择库位组', trigger: 'change' }],
        locationType: [{ required: true, message: '请选择库位类型', trigger: 'change' }],
        containerCode: [{ required: true, message: '请选择货架', trigger: 'change' }],
        rows: [{ required: true, message: '请填写所在排', trigger: 'blur' }],
        locationName: [{ required: true, message: '请填写库位名称', trigger: 'blur' }],
        columns: [{ required: true, message: '请填写所在行', trigger: 'blur' }],
        layer: [{ required: true, message: '请填写所在层', trigger: 'blur' }],
        length: [{ required: true, message: '请填写单个库位长度', trigger: 'blur' }],
        wideth: [{ required: true, message: '请填写单个库位宽度', trigger: 'blur' }],
        high: [{ required: true, message: '请填写单个库位高度', trigger: 'blur' }]
      },
      listLoading: true,
      total: 0,
      form: {
        warehouseName: null,
        warehouseId: null,
        areaName: null,
        areaId: null,
        containerCode: null,
        locationName: null,
        locationGroupName: null,
        locationType: null,
        rows: null,
        columns: null,
        layer: null,
        length: null,
        wideth: null,
        high: null
      },
      uform: {
        id: null,
        warehouseName: null,
        warehouseId: null,
        areaName: null,
        locationName: null,
        areaId: null,
        containerCode: null,
        locationGroupName: null,
        locationType: null,
        rows: null,
        columns: null,
        layer: null,
        length: null,
        wideth: null,
        high: null
      },
      tableData: []
    }
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
  created() {
    this.getList()
    this.stateFormat()
  },
  methods: {
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    funcLL(query) {
      selectLocation({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, locationName: item.locationName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.locationOptions = this.loclist.filter(item => {
              return item.locationName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.locationOptions = []
        }
      }, 100)
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
      }
      // this.scanWare(row)
    },
    // scanWare(row) {

    // },
    funcArea() {
      if (!this.form.warehouseName) {
        this.$message.error('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseName: this.form.warehouseName
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
    },
    changeState(val) {
      this.isLocked = val
      this.getList()
    },
    changeWarnState(val) {
      this.isLocked = val
      this.getList()
    },
    sfuncArea() {
      if (!this.warehouseName) {
        this.$message.error('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseName: this.warehouseName
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
    },
    sfuncHand() {
      if (!this.areaName) {
        this.$message.error('请先选择库区！')
      } else {
        screenTable({ pojo: {
          areaName: this.areaName
        }, workGroupId: sessionStorage.workGroupId }).then(res => {
          this.handOptions = res.data
        }
        )
      }
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.form.areaName)
      this.form.areaName = item.areaName
      this.form.areaId = item.id
    },
    funcLoc() {
      if (!this.form.areaName) {
        this.$message.error('请先选择库区！')
      } else {
        selectLocationGroup({ pojo: {
          areaName: this.form.areaName
        }}).then(res => {
          this.locOptions = res.data
        }
        )
      }
    },
    funcHand() {
      if (!this.form.areaName) {
        this.$message.error('请先选择库区！')
      } else {
        screenTable({ pojo: {
          areaName: this.form.areaName
        }, workGroupId: sessionStorage.workGroupId }).then(res => {
          this.handOptions = res.data
        }
        )
      }
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchallwarehouse(window.sessionStorage.workGroupId).then(res => {
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
    stateFormat(row) {
      if (this.tableData.length === 0) {
        searchsystemid('LOCATION_TYPE').then(res => {
          this.options = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.laststateTime === 0) {
          searchsystemid('LOCATION_TYPE').then(res => {
            this.options = res.data
          })
          this.laststateTime = now
        } else {
          if ((now - this.laststateTime) > 5000) {
            this.laststateTime = now
          }
        }
        return changeAll(row.locationType, this.options)
      }
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else if (rowIndex % 2 === 0) {
        return 'o-row'
      } else {
      // return 'b-row'
      }
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLocation({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    add() {
      this.dialogFormVisible = true
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 2) {
        if (this.spanArr1[rowIndex]) {
          return {
            rowspan: this.spanArr1[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 3) {
        if (this.spanArr2[rowIndex]) {
          return {
            rowspan: this.spanArr2[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 4) {
        if (this.spanArr3[rowIndex]) {
          return {
            rowspan: this.spanArr3[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    flitterData: function() {
      let contactDot = 0
      let contactDot1 = 0
      let contactDot2 = 0
      let contactDot3 = 0
      const spanArr = []
      const spanArr1 = []
      const spanArr2 = []
      const spanArr3 = []
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          spanArr1.push(1)
          spanArr2.push(1)
          spanArr3.push(1)
        } else {
          if (item.warehouseName === this.tableData[index - 1].warehouseName) {
            spanArr[contactDot] += 1
            spanArr.push(0)
          } else {
            contactDot = index
            spanArr.push(1)
          }
          if (item.areaName === this.tableData[index - 1].areaName) {
            spanArr1[contactDot1] += 1
            spanArr1.push(0)
          } else {
            contactDot1 = index
            spanArr1.push(1)
          }
          if (item.locationGroupName === this.tableData[index - 1].locationGroupName) {
            spanArr2[contactDot2] += 1
            spanArr2.push(0)
          } else {
            contactDot2 = index
            spanArr2.push(1)
          }
          if (item.containerCode === this.tableData[index - 1].containerCode) {
            spanArr3[contactDot3] += 1
            spanArr3.push(0)
          } else {
            contactDot3 = index
            spanArr3.push(1)
          }
        }
      })
      this.spanArr = spanArr
      this.spanArr1 = spanArr1
      this.spanArr2 = spanArr2
      this.spanArr3 = spanArr3
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            importLocation({
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              areaName: this.form.areaName,
              areaId: this.form.areaId,
              containerCode: this.form.containerCode,
              locationName: this.form.locationName,
              locationGroupName: this.form.locationGroupName,
              locationType: this.form.locationType,
              rows: this.form.rows,
              columns: this.form.columns,
              layer: this.form.layer,
              length: this.form.length,
              wideth: this.form.wideth,
              high: this.form.high
            }).then(res => {
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
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updLocationl({
              id: this.uform.id,
              warehouseName: this.uform.warehouseName,
              warehouseId: this.uform.warehouseId,
              areaName: this.uform.areaName,
              areaId: this.uform.areaId,
              containerCode: this.uform.containerCode,
              locationName: this.uform.locationName,
              locationGroupName: this.uform.locationGroupName,
              locationType: this.uform.locationType,
              rows: this.uform.rows,
              columns: this.uform.columns,
              layer: this.uform.layer,
              length: this.uform.length,
              wideth: this.uform.wideth,
              high: this.uform.high
            }).then(res => {
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
    },
    edit(row) {
      this.dialogVisible = true
      this.uform = Object.assign({}, row)
    },
    getList() {
      this.listLoading = true
      selectLocation({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        isLocked: this.isLocked,
        containerCode: this.containerCode,
        areaName: this.areaName,
        locationName: this.locationName,
        warehouseName: this.warehouseName,
        locationGroupName: this.groupName,
        locationType: this.locationType
      }}).then(response => {
        this.tableData = response.data
        // this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectLocationNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        isLocked: this.isLocked,
        containerCode: this.containerCode,
        areaName: this.areaName,
        locationName: this.locationName,
        warehouseName: this.warehouseName,
        locationGroupName: this.groupName,
        locationType: this.locationType
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    clear: kkdeboundce(function() {
      this.containerCode = null
      this.warehouseName = null
      this.locationName = null
      this.groupName = null
      this.locationType = null
      this.areaName = null
    })
  }
}
</script>
<style>
    .el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #0e295d;
}
.el-table .b-row{
  background: #262626;
}
</style>
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
  </style>
        <style lang="scss" scoped>
// 修改对话框高度
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      border: #fff 1px solid;
       box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
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
