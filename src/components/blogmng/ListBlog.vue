<template>
  <div>
    <h1>我对世界说过的</h1>
    <el-container>
      <el-header style="margin-left: 30px;width: 100%;alignment: center">
        <div class="demo-input-suffix">
          <!--搜索框-->
          <el-input
            class="inline-input;"
            v-model="keyWords"
            @change="keywordschange"
            placeholder="请输入标题/标签后按回车"
            prefix-icon="el-icon-search"
            style="width: 74%;"
            @keyup.enter.native="searchblogs"
          >
          </el-input>
        </div>
      </el-header>
      <el-main>
        <!--博客列表-->
        <template>
          <el-table
            :data="blogs"
            style="width:74%;margin-left:160px;margin-bottom:20px;alignment: center"
            stripe
            border
            size="mini"
            v-loading="tableLoading"
          >
            <el-table-column label="标题" width="165%">
              <template slot-scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="标签" width="160%">
              <template slot-scope="scope">
                <span>{{ scope.row.tags }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="127%">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发表时间" width="127%">
              <template slot-scope="scope">
                <span>{{ scope.row.publicTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180%">
              <template slot-scope="scope">
                <el-link
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                  >编辑</el-link
                >
                <el-link @click="handleView(scope.$index, scope.row)"
                  >查看<i class="el-icon-view el-icon--right"></i
                ></el-link>
                <el-link @click="handledelete(scope.$index, scope.row)"
                  >刪除<i class="el-icon-delete el-icon--right"></i
                ></el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            width="60%"
            title="简单点，说话的方式简单点"
            :visible.sync="dialogTableVisible"
          >
            <el-form :data="blog">
              <div style="margin-top: 0px;">
                <el-form-item prop="title">
                  <el-input
                    placeholder="先说个主题吧"
                    clearable
                    v-model="blog.title"
                  ></el-input>
                </el-form-item>
              </div>
              <div style="padding-top:2px;text-align:left;">
                <el-form-item prop="tags">
                  <i class="el-icon-price-tag"></i>
                  <el-tag
                    type="info"
                    size="medium"
                    color="white"
                    v-for="(tag, i) in blog.tags"
                    :key="'tag' + i"
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    closable
                  >
                    {{ tag }}
                  </el-tag>

                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    size="small"
                    ref="saveTagInput"
                    @key.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    size="small"
                    v-bind:disabled="disableInput"
                    class="button-new-tag"
                    @click="showInput"
                  >
                    添加主题
                  </el-button>
                </el-form-item>
              </div>
              <tinymce-editor
                :setting="editorSetting"
                :value="value"
                ref="editor"
                :disabled="disabled"
              >
              </tinymce-editor>

              <el-button type="warning" @click="handleUpdateBlog"
                >提交</el-button
              >
              <el-button type="info" @click="dealClose"
                >关闭</el-button
              >
            </el-form>
          </el-dialog>
        </template>
        <el-pagination
          background
          :page-size="size"
          :current-page="currentPage"
          @current-change="currentChange"
          layout="prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TinymceEditor from "./Editor";
import HeadEditor from "./HeadEditor";
export default {
  name: "ListBlog",
  components: {
    TinymceEditor,
    HeadEditor
  },
  /*  props: {
      //传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: ''
      },
    },*/
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      disableInput: false,
      disabled: false,
      dialogTableVisible: false,
      input: "",
      blogs: [],
      blog: {
        id: "",
        title: "",
        content: this.value,
        tags: [],
        userId: ""
      },
      totalCount: -1,
      currentPage: 1,
      size: 5,
      keyWords: "",
      tableLoading: false,
      value: "",
      title: "",
      editorSetting: {
        height: 80
      }
    };
  },
  mounted: function() {
    this.loadBlogs();
  },
  watch: {
    "blog.tags": {
      handler: function(newValue, oldValue) {
        if (this.blog.tags.length == 6) {
          this.disableInput = true;
          this.$message({
            message: "最多6个标签哦",
            type: "info"
          });
        } else if (this.blog.tags.length < 6) {
          this.disableInput = false;
        }
      }
    }
  },
  methods: {
    handleUpdateBlog() {
      if (this.blog.title == "") {
        this.$message({ message: "你要先说个主题啥的吧", type: "warning" });
        return;
      }
      if (this.blog.content == "") {
        this.$message({ message: "你要先说个内容啥的吧", type: "warning" });
        return;
      }
      var _this = this;
      this.blog.userId = this.$store.state.user.id;
      this.blog.content = this.$refs.editor.myValue;
      this.postRequest("/api/blog/updateBlog", this.blog).then(resp => {
        var status = resp.status;
        if (status == 200) {
          this.dialogTableVisible = false;
          this.loadBlogs();
        } else {
          this.$message({ message: "更新失败！", type: "warning" });
        }
      });
    },
    dealClose(){
      alert("closeed");
      this.dialogTableVisible = false;
    },
    handleClose(tag) {
      //关闭标签时，便签中的元素分离掉。
      this.blog.tags.splice(this.blog.tags.indexOf(tag), 1);
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.blog.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleEdit(index, row) {
      var _this = this;
      this.value = row.content;
      _this.blog.title = row.title;
      _this.blog.id = row.id;
      if (row.tags && row.tags.length > 0) {
        this.blog.tags = row.tags.split(",");
      }
      this.dialogTableVisible = true;
    },
    handleView(index, row) {
      var id = row.id;
      this.$router.push({ path: "Detail/" + id });
    },
    loadBlogs() {
      var _this = this;
      this.getRequest(
        "/api/blog/listBlog?page=" +
          this.currentPage +
          "&size=" +
          this.size +
          "&keywords=" +
          this.keyWords +
          "&userId=" +
          _this.$store.state.user.id
      ).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.totalCount = data.totalCount;
          _this.blogs = data.blogs;
        }
      });
    },
    handledelete(index,row){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/api/blog/deleteOne?id=" + row.id).then(resp =>{
          if(resp.status == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //刷新博客列表
            this.loadBlogs();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadBlogs();
    },
    searchblogs() {
      this.currentPage = 1;
      this.size = 5;
      this.loadBlogs();
    },
    keywordschange(val) {
      if (val == "") {
        this.loadBlogs();
      }
    }
  }
};
</script>

<style scoped></style>
