<template>
  <div class="index">
    <el-container class="conta">
      <!-- 头部 -->

      <el-header>
        <div class="header_left" @click="home">
          <img src="../assets/timg.jpg" alt="" width="50px" />电商后台管理系统
        </div>
        <el-button type="danger" @click="tuichu">退出</el-button></el-header
      >
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="collap?'64px':'200px'"
          ><el-row class="tac">

            <div class="activ_button" @click="open">| | |</div>
            <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened='true'
            :collapse='collap'
            :collapse-transition = 'false'
            :router="true"
           >
              <el-submenu
                v-for="item in menuList"
                :key="item.id"
                :index="item.path"
                 
              >
                <template slot="title" >
                  <i :class="['iconfont ', iconList[item.id]]"></i>
                  <span> {{ item.authName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="i in item.children"
                    :key="i.id"
                    class="el-icon-menu"
                    :index="i.path"
                    
                  >
                    {{ i.authName }}</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-row>
        </el-aside>
        <!-- 主要内容区域 -->
        <el-main> <router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { LeftMenus } from "../util/request";
export default {
  data() {
    return {
      menuList: {},
      //列表图标
      iconList: {
        125: "icon-duoyonghu",
        103: "icon-tiji",
        101: "icon-shangpin",
        102: "icon-danju",
        145: "icon-baobiao1",
      },
      //展开收取
      collap:false
    };
  },
  methods: {
    //退出按钮
    tuichu() {
      {
        this.$confirm("确定退出吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "退出成功!",
            });
            sessionStorage.clear();
            this.$router.push("/");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消退出",
            });
          });
      }
    },
    //点击展开和收取菜单
    open(){
this.collap = !this.collap
    },
     home(){

this.$router.push('/index')
  }
  },
  mounted() {
    //获取 左侧菜单列表
    LeftMenus().then((res) => {
      this.menuList = res.data.data;
     
    });
  },
 
};
</script>

<style  scoped>
.el-header {
  background-color: #68bbf1;
  padding-left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 60px;
}

.el-aside {
  background-color: #c5d1f5;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
}
.el-main .el-menu{
  border-right: none;
}
.index,
.conta {
  height: 100vh;
}
.header_left {
  font-size: 23px;
  color: white;
  cursor: pointer;
}
.header_left img {
  vertical-align: middle;
  border-radius: 50%;
  margin: 0px 20px 5px 5px;
}
.activ_button{
  height: 30px;
  text-align: center;
  cursor: pointer;
  line-height: 30px;
  color: rgb(255, 255, 255);
  background-color: rgb(144, 168, 211);
}
</style>