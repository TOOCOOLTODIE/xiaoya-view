import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      password: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).password,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
    },
    routes: [],
    msgList: [],
    isDotMap: new Map(),
    currentFriend: {},
    stomp: null,
    nfDot: false
  },
  mutations: {
    login(state, user){
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state){
      window.localStorage.removeItem('user');
      state.routes = [];
    },
  },
  actions: {
  }

});
