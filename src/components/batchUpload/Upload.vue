<template>
  <div>
    <h1>新增模板</h1>
    <div style="margin-top:40px;margin-right:700px">
      <el-button
        type="primary"
        size="mini"
        @click="dialogVisible = true"
        icon="el-icon-plus"
        >新增模板</el-button
      >
      <el-dialog
        title="新增模板"
        :visible.sync="dialogVisible"
        width="40%"
        @opened="opened"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="40%"
          style="margin-right:230px"
        >
          <el-form-item label="分类(必填)：">
            <el-select
              placeholder="请选择"
              v-model="value"
              @change="change(value)"
              style="width:330px;"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名(必填)：">
            <el-input style="width:340px;" v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="模板(必填)：">
            <el-upload
              drag
              ref="upload"
              action="batch/import"
              :limit="1"
              multiple
              accept=".xlsx,.xls"
              :on-exceed="handleExceed"
              :show-file-list="true"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
              :data="{ name: name, sortId: value }"
            >
              <i class="el-icon-upload" style="width:30px"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip" style="width:330px;">
                上传文件扩展名为.xls或者.xlsx文件，且大小不超过20MB！
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item style="width:390px;margin-top:60px">
            <el-button @click="onSubmit">立即新增</el-button>
            <el-button @click="handleCancle">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div style="margin-top:30px">
      <el-table :data="data" style="margin-left: 130px;width:86%" border stripe>
        <el-table-column label="模板名" width="100px">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>模板名：{{ scope.row.name }}</p>
              <p>分类： {{ scope.row.sortName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100px">
          <template slot-scope="scope">
            <i class="el-icon-wind-power"></i>
            <span>{{ scope.row.sortName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-date"></i>
            <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-finished"></i>
            <span style="margin-left:10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="316">
          <template slot-scope="scope">
            <el-button
              @click="handleDownload(scope.$index, scope.row)"
              icon="el-icon-download"
              type="warning"
              round
              size="mini"
              style="margin-left:10px"
            >
              下载
            </el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              type="primary"
              icon="el-icon-edit-outline"
              round
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              @click="handleDel(scope.$index, scope.row)"
              type="danger"
              icon="el-icon-delete"
              round
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      data: [],
      fileList: [],
      value: "",
      dialogVisible: false,
      form: {
        name: "",
        sort: ""
      },
      name: "",
      sortId: ""
    };
  },
  methods: {
    change(id) {},
    handleEdit(index, row) {
      console.log("edit-row", row);
    },
    handleDel(index, row) {
      console.log("del-row", row);
    },
    onSubmit(files, fileList) {
      let _this = this;
      console.log("file.length", files.length);
      console.log("fileList.length", this.fileList.length);
      if (this.name === "" || this.value === "" || files.length === 0) {
        _this.$message.error("请补全上传信息！！！");
        return;
      }
      this.sortId = this.value;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
      this.dialogVisible = false;
    },
    opened() {
      this.fileList = [];
      this.value = "";
      this.sortId = "";
      this.name = "";
      this.$refs.upload.clearFiles();
      this.getRequest("batch/getSorts").then(rept => {
        this.options = rept.data;
      });
    },
    beforeAvatarUpload(file) {
      console.log("file.type:", file.type);
      const isXlsx = file.name.split(".")[1] === "xlsx";
      const isXls = file.name.split(".")[1] === "xls";
      const isLt1M = file.size / 1024 / 1024 < 20;
      if (!(isXlsx || isXls)) {
        this.$message.error(
          "只能上传扩展名为.xls或者.xlsx的文件，请检查后重新上传!"
        );
      }
      if (!isLt1M) {
        this.$message.error("只能上传文件小于20MB的文件，请检查后重新上传!");
      }
      return isLt1M && (isXlsx || isXls);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleCancle() {
      this.value = "";
      this.form.sortId = "";
      this.form.name = "";
      this.fileList = [];
      this.$refs.upload.clearFiles();
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.getRequest("batch/getModels").then(rept => {
      this.data = rept.data;
    });
  },
  watch: {
    value(val, oldVar) {
      console.log(val, oldVar);
      this.value = val;
    },
    fileList(val, oldVar) {
      this.fileList = val;
    }
  }
};
</script>

<style scoped></style>
