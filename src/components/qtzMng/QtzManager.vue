<template>
  <div style="margin-top:5px;font-family: 黑体">
    <!-- layout布局 -->
    <!-- 第一行 -->
    <el-row>
      <div>
        <h1>定时任务管理</h1>
      </div>
    </el-row>
    <!-- 第一列 -->
    <el-row :gutter="1" style="padding-top:60px;margin-left:30px">
      <el-col>
        <el-table :data="qtzData" style="" :row-class-name="tableRowClassName">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="任务名">{{
                  props.row.jobName
                }}</el-form-item>
                <el-form-item label="任务组">{{
                  props.row.jobGroupName
                }}</el-form-item>
                <el-form-item label="任务类名">{{
                  props.row.jobClassName
                }}</el-form-item>
                <el-form-item label="触发器名">{{
                  props.row.triggerName
                }}</el-form-item>
                <el-form-item label="触发器组">{{
                  props.row.triggerGroupName
                }}</el-form-item>
                <el-form-item label="时区">{{
                  props.row.timeZone
                }}</el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="任务状态"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="jobName"
            label="任务名称"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="cornExpression"
            label="表达式"
            width="120"
          ></el-table-column>
          <el-table-column align="left" width="350">
            <template slot="header" slot-scope="scope">
              <el-input
                @key.enter.native="search"
                v-model="input"
                size="mini"
                placeholder="请输入关键字搜索"
              ></el-input>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handlePause(scope.$index, scope.row)"
                >Pause</el-button
              >
              <el-button
                size="mini"
                @click="handleResume(scope.$index, scope.row)"
                >Resume</el-button
              >
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >Edit</el-button
              >

              <el-button
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="dialogVisible = true"
                icon="el-icon-plus"
                >新增任务</el-button
              >

              <el-dialog
                title="新增任务"
                :visible.sync="dialogVisible"
                width="60%"
                @closed="closed"
              >
                <el-form
                  :model="form"
                  label-width="50%"
                  style="margin-right:230px;padding-left:70px"
                >
                  <el-form-item label="任务名称" :label-width="formLabelWidth">
                    <el-input v-model="form.jobClassName"></el-input>
                  </el-form-item>
                  <el-form-item label="任务分组" :label-width="formLabelWidth">
                    <el-input v-model="form.jobGroupName"></el-input>
                  </el-form-item>
                  <el-form-item label="表达式" :label-width="formLabelWidth">
                    <el-input v-model="form.cronExpression"></el-input>
                  </el-form-item>

                  <el-form-item style="margin-top:50px;padding-left:20px">
                    <el-button @click="handleAdd()">新增</el-button>
                    <el-button @click="handleCancle()">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :page-size="5"
          :page-sizes="[5, 10, 20, 50, 100]"
          :current-page="currentPage"
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<script>
export default {
  data() {
    return {
      form: {
        jobClassName: "",
        jobGroupName: "",
        cronExpression: ""
      },
      formLabelWidth: "180px",
      dialogVisible: false,
      size: 10,
      total: 0,
      currentPage: 1,
      input: "",
      qtzData: [],
      userId: this.$store.state.user.id
    };
  },
  mounted: function() {
    this.loadQtzData();
    this.test();
  },

  methods: {
    test() {
      var paramObj = {
        page: "1",
        size: "10",
        keyword: "task",
        userId: "luo"
      };
      this.postRequest("/api/job/test", paramObj).then(resp => {
        console.log("request success!");
      });
    },
    closed() {
      this.loadQtzData();
    },
    loadQtzData() {
      this.getRequest(
        "/api/job/queryjob?pageNum=" +
          this.currentPage +
          "&pageSize=" +
          this.size
      ).then(resp => {
        if (resp && resp.status === 200) {
          var data = resp.data;
          if (data) {
            this.qtzData = data.JobAndTrigger.list;
          }
        } else {
          alert("异常");
        }
      });
    },
    search() {
      console.log("search begin");
    },
    handleSizeChange(sizeChange) {
      this.size = sizeChange;
    },
    handleCurrentChange(currentChange) {
      this.currentPage = currentChange;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handlePause() {},
    handleResume() {},
    handleEdit() {},
    handleDelete() {},
    handleAdd() {
      var addParam = {
        jobClassName: this.form.jobClassName,
        jobGroupName: this.form.jobGroupName,
        cronExpression: this.form.cronExpression
      };
      this.postRequest("/api/job/addJob", addParam).then(resp => {
        console.log("success!");
      });
    },
    handleCancle() {
      this.form.jobClassName = "";
      this.form.jobGroupName = "";
      this.form.cronExpression = "";
      this.dialogVisible = false;
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
