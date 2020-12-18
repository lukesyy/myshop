<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 用户列表 -->
      <el-table :data="rightsData" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path" ></el-table-column>
        <el-table-column label="权限等级" prop="level"> 

          <template slot-scope="scope">
           <el-tag v-if="scope.row.level==0">一级</el-tag>
           <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
           <el-tag type="warning" v-else>三级</el-tag>
          </template>
  
 </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { rightsList } from "../../util/request";
export default {
  data() {
    return {
      rightsData: [],
    };
  },
  methods: {
    getRightsList() {
      rightsList("list").then((res) => {
        this.rightsData = res.data.data;
      });
    },
  },

  mounted() {
    this.getRightsList();
  },
};
</script>

<style  scoped>
</style>