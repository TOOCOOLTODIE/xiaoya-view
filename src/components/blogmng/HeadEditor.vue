<template>
  <el-form :model="blog">
    <el-container>
      <el-header>
        <div style="margin-top: 30px;">
          <el-form-item prop="title">
            <el-input placeholder="先说个主题吧" clearable v-model="blog.title"></el-input>
          </el-form-item>
        </div>
        <div style="padding-top:2px;text-align:left;">
          <el-form-item prop="tags">
            <i class="el-icon-price-tag"></i>
            <el-tag
              type="info"
              size="medium"
              color="white"
              v-for="(tag,i) in blog.tags"
              :key="'tag'+i"
              :disable-transitions="false"
              @close="handleClose(tag)" closable>
              {{tag}}
            </el-tag>

            <el-input class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      size="small"
                      ref="saveTagInput"
                      @key.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm">

            </el-input>
            <el-button v-else size="small" v-bind:disabled="disableInput" class="button-new-tag" @click="showInput">
              添加主题
            </el-button>
          </el-form-item>
        </div>
      </el-header>
    </el-container>
  </el-form>
</template>

<script>
    export default {
        name: "HeadEditor",
      data() {
        return {
          inputVisible: false,
          inputValue: '',
          disableInput: false,
          blog: {
            title: '',
            content: this.value,
            tags: [],
            userId: ''
          }
        }
      },
      methods: {
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
          this.inputValue = '';
        },
        showInput() {
          this.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        }
      }
    }
</script>

<style scoped>

</style>
