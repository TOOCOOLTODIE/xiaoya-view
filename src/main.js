// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { getRequest } from "./utils/api";
import { postRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import store from "./store";
import XLSX from "xlsx";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(XLSX);

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

router.beforeEach((to, from, next) => {
  if (to.name == "Login") {
    next();
    return;
  }
  var name = store.state.user.name;
  if (name == "未登录") {
    if (to.meta.requireAuth || to.name == null) {
      next({ path: "/", query: { redirect: to.path } });
    } else {
      next();
    }
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store: store,
  components: { App },
  template: "<App/>"
});
