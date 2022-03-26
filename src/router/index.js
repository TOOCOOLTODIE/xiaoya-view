import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BlogHome from '@/components/blogmng/Home'
import EditBlog from '@/components/blogmng/EditBlog'
import BlogDetail from '@/components/blogmng/BlogDetail'
import ListBlog from '@/components/blogmng/ListBlog'
import Upload from '@/components/batchUpload/Upload'
import QtzManager from "@/components/qtzMng/QtzManager";

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/blogmng/home',
      name:'博客首页',
      component:BlogHome,
      children:[

        {
          path:'/editBlog',
          name:'EditBlog',
          component:EditBlog
        },
        {
          path:'/listBlog',
          name:'ListBlog',
          component:ListBlog
        }
        ,
        {
          path:'/blogDetail/:id',
          name:'blogDetail',
          component:BlogDetail
        },
        {
            path:'/upload',
            name:'upload',
            component:Upload
        },
        {
          path:'/qtzMng',
          name:'qtzMng',
          component:QtzManager
        }
      ]
    }
  ]
})
