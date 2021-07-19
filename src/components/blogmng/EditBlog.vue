<template>
  <el-form :model="blog">
    <el-container>
      <el-header>
        <div style="margin-top: 5px;">
          <el-form-item prop="title">
            <el-input
              clearable
              placeholder="先说个主题吧"
              v-model="blog.title"
            ></el-input>
          </el-form-item>
        </div>
        <div style="padding-top:5px;text-align:left;">
          <span><i class="el-icon-price-tag"></i></span>
          <el-tag
            :disable-transitions="false"
            :key="'tag' + i"
            @close="handleClose(tag)"
            closable
            color="white"
            size="medium"
            type="info"
            v-for="(tag, i) in dynamicTags"
          >
            {{ tag }}
          </el-tag>
          <el-input
            @blur="handleInputConfirm"
            @key.enter.native="handleInputConfirm"
            class="input-new-tag"
            ref="saveTagInput"
            size="small"
            v-if="inputVisible"
            v-model="tagValue"
          >
          </el-input>
          <el-button
            @click="showInput"
            class="button-new-tag"
            size="small"
            v-bind:disabled="disableInput"
            v-else
          >添加主题
          </el-button
          >
        </div>
      </el-header>
      <el-main style="margin-top: 60px;">
        <el-form-item prop="content">
          <editor
            :disabled="disabled"
            :init="init"
            @onClick="onClick"
            v-model="blog.content"
          >
          </editor>
        </el-form-item>
      </el-main>
      <el-footer>
        <el-form-item>
          <el-button @click="saveOn" type="primary">保存并继续添加</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-footer>
    </el-container>
  </el-form>
</template>

<script>
  import tinymce from "tinymce/tinymce";
  import Editor from "@tinymce/tinymce-vue";
  import "tinymce/themes/silver/theme";
  import "tinymce/icons/default/icons";
  import "tinymce/plugins/image";
  import "tinymce/plugins/media";
  import "tinymce/plugins/table";
  import "tinymce/plugins/lists";
  import "tinymce/plugins/contextmenu";
  import "tinymce/plugins/wordcount";
  import "tinymce/plugins/colorpicker";
  import "tinymce/plugins/textcolor";

  export default {
    components: {
      Editor
    },
    props: {
      //传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: ""
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: "lists image media table textcolor wordcount contextmenu"
      },
      toolbar: {
        type: [String, Array],
        default:
          "undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat"
      }
    },
    data() {
      return {
        //初始化配置
        init: {
          language_url: "./static/tinymce/zh_CN.js",
          language: "zh_CN",
          skin_url: "./static/tinymce/skins/ui/oxide", // skin路径
          height: 300,
          plugins: "autoresize",
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            const img = "data:image/jpeg;base64," + blobInfo.base64();
            success(img);
          }
        },
        dynamicTags: [],
        inputVisible: false,
        tagValue: "",
        disableInput: false,
        blog: {
          title: "",
          content: this.value
        }
      };
    },
    mounted() {
      tinymce.init({});
    },
    methods: {
      //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      //需要什么事件可以自己增加
      onClick(e) {
        this.$emit("onClick", e, tinymce);
      },
      //可以添加一些自己的自定义事件，如清空内容
      clear() {
      },
      handleClose(tag) {
        //关闭标签时，便签中的元素分离掉。
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleInputConfirm() {
        if (this.tagValue) {
          this.dynamicTags.push(this.tagValue);
        }
        Array.prototype.uniqueTag = function(){
          var res = [];
          var json = {};
          for(var i = 0; i < this.length; i++){
            if(!json[this[i]]){
              res.push(this[i]);
              json[this[i]] = 1;
            }else {
              return false;
            }
          }
          return true;
        }
        var arr = this.dynamicTags;
        if(!arr.uniqueTag()){
          alert("重复主题");
          this.dynamicTags.splice(this.dynamicTags.length-1)
        }
        this.inputVisible = false;
        this.tagValue = "";
      },
      saveOn() {
        if (this.blog.title == "") {
          this.$message({message: "你要先说个主题啥的吧", type: "warning"});
          return;
        }
        if (this.blog.content == "") {
          this.$message({message: "你要先说个内容啥的吧", type: "warning"});
          return;
        }
        var _this = this;
        this.blog.userId = this.$store.state.user.id;
        this.blog.tags = this.dynamicTags;
        console.log("this.blog",this.blog)
        this.postRequest("/api/blog/insertBlog", this.blog).then(resp => {
          var status = resp.status;
          if (status == 200) {
            this.$message({message: "更新成功！", type: "info"});
            this.blog.tags = [];
            this.blog.title = "";
            this.blog.content = "";
          } else {
            this.$message({message: "更新失败！", type: "warning"});
          }
        });
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      cancel() {
        this.$message({message: "取消", type: "info"});
      }
    },
    watch: {
      value(newValue) {
        this.blog.content = newValue;
      },
      myValue(newValue) {
        this.$emit("input", newValue);
      },
      dynamicTags: {
        handler: function (newValue, oldValue) {
          if (this.dynamicTags.length == 6) {
            this.disableInput = true;
            this.$message({
              message: "最多6个标签哦",
              type: "info"
            });
          } else if (this.dynamicTags.length < 6) {
            this.disableInput = false;
          }
        }
      }
    }
  };
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
