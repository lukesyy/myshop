// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//导入字体图标
import '../src/assets/font/iconfont.css'
//静态资源

import '../src/assets/css/reset.css'
//注册 全局 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
 
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
Vue.use(VueQuillEditor)
//引入element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//引入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
//时间过滤器
Vue.filter("dataFormat",function (time)  {
  let dt = new Date(time*1000) 
  
  let y = dt.getFullYear();

  let   m = dt.getMonth() + 1;
  let d = dt.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + dt.toTimeString().substr(0, 8);
  
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
