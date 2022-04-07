<template>
  <div class="blogDetailMain">
    <h1>{{title}}</h1>
    <div class="contentMain" v-html="content"></div>
  </div>
</template>

<script>
  export default {
    name: "BlogDetail",
    data() {
      return {
        content:{},
        title:''
      }
    },
    mounted(){
      this.init()
    },
    methods: {
      init(){
        this.getRequest("blog/getBlogInfoById?id="+this.$route.params.id).then(resp=>{
          var obj = resp.data;
          if(obj.status == 200){
            var blog = obj.obj;
            this.content = blog.content;
            this.title = blog.title
          }
        });
      }
    }
  }
</script>

<style scoped>
  .blogDetailMain .contentMain img{
    max-width: 100%;
  }

</style>
