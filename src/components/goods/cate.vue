<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addshow"> 添加分类</el-button>
      <!-- 分类列表 -->
      <tree-table
        class="tree"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 状态 -->
        <template slot="isok" scope="scope">
          <i
            v-if="scope.row.cat_deleted"
            class="el-icon-success"
            style="color: lightgreen; font-size: 20px"
          ></i>
          <i
            style="color: red; font-size: 20px"
            v-else
            class="el-icon-error"
          ></i>
        </template>
        <!-- 级别 -->
        <template slot="score" scope="scope">
          <el-tag v-if="scope.row.cat_level == 0"> 一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success">
            二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level == 2" type="warning">
            三级</el-tag
          >
        </template>

        <!-- 操作 -->
        <template slot="set" scope="scope">
          <el-row>
            <!-- //编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="bj(scope.row.cat_id)"
            >
              编辑
            </el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-edit"
              size="mini"
              @click="remove(scope.row.cat_id)"
            >
              删除
            </el-button>
          </el-row>
        </template>
      </tree-table>

       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { categoriesList } from "../../util/request";

export default {
  data() {
    return {
      //树形表格的columns
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",

          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "score",
        },
        {
          label: "操作",
          type: "template",
          template: "set",
        },
      ],
      //获取分类列表的数据
      params: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //获取到的分类列表
      cateList: [],
      //总条数
      total: 0,
    };
  },
  methods: {
      getcateList(){
 categoriesList(this.params).then((res) => {
      if (res.data.meta.status != 200) {
        this.$message.error("获取分类列表失败!");
        return;
      }
      this.cateList = res.data.data.result;
      this.$message.success(res.data.meta.msg);
      this.total = res.data.data.total;
      console.log(this.cateList);
     
    });
      },
    addshow() {},
    // 监听 每页多少条
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;

      this.getcateList();
    },
    //监听页码值改变
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage;
      this.getcateList();
    },

  },
  mounted() {
   this.getcateList()
  },
};
</script>

<style  scoped>
.tree {
  margin-top: 10px;
}
</style>