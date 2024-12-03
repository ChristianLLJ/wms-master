<template>
  <div class="content">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="content_rece" @dblclick="clickborder()">
          <div v-if="!show" class="rece_icon icon-in">
            <svg-icon icon-class="任务完成" />
          </div>
          <div v-if="!show" class="rece_title">
            今日入库收货
            <div class="rece_num">
              <span>{{ receNum }}</span>
            </div>
          </div>
          <div v-if="show" class="table_rece">
            <el-table
              v-loading="tableLoading"
              :data="tabledatas"
              border
              height="495px"
              style="border-radius:2%"
              :row-class-name="tableRowClassDetailName"
              element-loading-text="正在加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              size="mini"
              :header-cell-style="{color: '#fff'}"
              :row-style="{height:'20px'}"
              :cell-style="{padding:'0px'}"
            >
              <el-table-column v-if="false" label="id" prop="id" />
              <el-table-column type="index" label="序号" />
              <el-table-column label="采购订单号" :show-overflow-tooltip="true" prop="purchaseCode" />
              <el-table-column label="入库计划跟踪号" :show-overflow-tooltip="true" prop="inboundTraceCode" />
              <!-- <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" /> -->
              <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
              <!-- <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" /> -->
              <el-table-column label="收货数量(个)" :show-overflow-tooltip="true" prop="receivedNum" />
              <el-table-column label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="content_unre" @dblclick="unclickborder()">
          <div v-if="!unshow" class="unre_icon icon-out">
            <svg-icon icon-class="任务-未完成" />
          </div>
          <div v-if="!unshow" class="unrece_title">
            今日未收货
            <div class="unre_num">
              <span>{{ unreceNum }}</span>
            </div>
          </div>
          <div v-if="unshow" class="table_unrece">
            <el-table
              v-loading="tableunLoading"
              :data="tableundatas"
              height="495px"
              style="border-radius:2%"
              :row-class-name="tableRowClassDetailName2"
              border
              element-loading-text="正在加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              size="mini"
              :header-cell-style="{color: '#fff'}"
              :row-style="{height:'20px'}"
              :cell-style="{padding:'0px'}"
            >
              <el-table-column v-if="false" label="id" prop="id" />
              <el-table-column type="index" label="序号" />
              <el-table-column label="采购订单号" :show-overflow-tooltip="true" prop="purchaseCode" />
              <el-table-column label="入库计划跟踪号" :show-overflow-tooltip="true" prop="inboundTraceCode" />
              <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
              <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <div id="main" style="width: 100%;height:400px;" />
  </div>
</template>

<script>
import { selectInboundPlanDetail, selectInboundPlanDetailNum } from '@/api/user'
// import echarts from 'echarts'
export default {
  data() {
    return {
      show: false,
      unshow: false,
      receNum: null,
      tableLoading: false,
      tableunLoading: false,
      tabledatas: [],
      tablelist: {},
      tableundatas: [],
      tableunlist: {},
      //   sums: {},
      unreceNum: null
    }
  },
  created() {
    this.getreListDetails()
    this.getunreListDetails()
  },
  // mounted() {
  //   // 基于准备好的dom，初始化echarts实例
  //   var myChart = echarts.init(document.getElementById('main'), 'dark')

  //   // 指定图表的配置项和数据
  //   var option = {
  //     title: {
  //       text: '收货商品'
  //     },
  //     tooltip: {},
  //     legend: {
  //       data: ['数量']
  //     },
  //     xAxis: {
  //       data: ['喇叭裤', '拖鞋', '牛仔裤', '高跟鞋', '袜子', '冲锋衣']
  //     },
  //     yAxis: {},
  //     series: [
  //       {
  //         name: '数量',
  //         type: 'bar',
  //         data: [1000, 800, 700, 600, 400, 200]
  //       }
  //     ]
  //   }

  //   // 使用刚指定的配置项和数据显示图表。
  //   myChart.setOption(option)
  // },
  methods: {
    getreListDetails() {
      this.tableLoading = true
      selectInboundPlanDetail({
        pojo: {
          isReceived: 1
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        // this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanDetailNum({
        pojo: {
          isReceived: 1

        }}).then(response => {
        this.receNum = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    clickborder() {
      setTimeout(() => {
        this.show = !this.show
      }, 500)
    },
    unclickborder() {
      setTimeout(() => {
        this.unshow = !this.unshow
      }, 500)
    },
    getunreListDetails() {
      this.tableunLoading = true
      selectInboundPlanDetail({
        pojo: {
          isReceived: 0
        }}).then(response => {
        this.tableunlist = response.data
        this.tableundatas = this.tableunlist.list
        // this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableunLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanDetailNum({
        pojo: {
          isReceived: 0

        }}).then(response => {
        this.unreceNum = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    tableRowClassDetailName() {
      return 'dd-row'
    },
    tableRowClassDetailName2() {
      return 'd-row'
    }
  }
}
</script>
<style scoped>
.el-table /deep/  td{
  background-color: transparent !important;
}
.el-table /deep/ th, tr{
  background-color: #0d263456;
}

</style>
<style>
.el-table .dd-row{
  background: #34bfa3;
}
.el-table .d-row{
  background: #f4516c;
}

</style>
<style lang="scss" scoped>
#main {
  margin-top: 10px;
}
.content {
  margin: 18px;

    .content_rece {
    width: 100%;
    height: 500px;
    position: relative;
    border: 2px solid #fff;
    background-color: #176d9e37;
    border-radius: 2%;
    box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
    &:hover {
      .rece_icon {
        color: #fff;
      }

      .icon-in {
        background: #34bfa3;
      }
    }
.rece_icon {
  margin: 150px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
  float:left;
  font-size: 100px;
}
    .rece_title {
      float:right;
     margin: 180px 14px 0 0;
    color:#34bfa3;
    font-size:32px;
    }
    .rece_num {
      margin-top: 40px;
    }
    .rece_num >span {
      display: inline-block;
      margin-left: 70px;
    color: #34bfa3;
    font-size: 40px
    }
    .table_rece {
      width: 100%;
    }

}
.content_unre {
      width: 100%;
    height: 500px;
    position: relative;
    border: 2px solid #fff;
    background-color: #0d263456;
    border-radius: 2%;
    box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
&:hover {
      .unre_icon {
        color: #fff;
      }

      .icon-out {
        background: #f4516c;
      }
    }
.unre_icon {
  margin: 150px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
  float:left;
  font-size: 100px;
}
    .unrece_title {
    color:#f4516c;
      float:right;
         margin: 180px 14px 0 0;

    font-size:32px;
    }
    .unre_num >span {
    color: #f4516c;;
    font-size: 40px;
    display: inline-block;
      margin-left: 70px;
    }
    .unre_num {
          margin-top: 40px;

    }
}
}
</style>
