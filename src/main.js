// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//导入字体图标
import '../src/assets/font/iconfont.css'
//静态资源

import '../src/assets/css/reset.css'
//引入element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//引入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
