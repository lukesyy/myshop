<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意:只允许为三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row :gutter="20">
        <el-col class="catobj">
          <span>选择商品分类:</span>
          <!-- 分类级联 -->
          <el-cascader
            :options="cateList"
            v-model="cascaKey"
            :show-all-levels="false"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="添加参数"
          ><el-button type="primary" round :disabled="isBtn">{{
            activeName
          }}</el-button></el-tab-pane
        >
        <el-tab-pane label="静态属性" name="添加属性"
          ><el-button type="primary" round :disabled="isBtn">{{
            activeName
          }}</el-button></el-tab-pane
        >
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { categoriesList, cateDataList } from "../../util/request";
export default {
  data() {
    return {
      activeName: "添加参数", //标签页的名称
      cascaKey: [],

      //添加时的级联选择器的配置
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      cateList: [],
    };
  },
  mounted() {
    categoriesList().then((res) => {
      this.cateList = res.data.data;
    });
  },
  computed: {
    isBtn() {
      if (this.cascaKey.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    //级联选择变化触发事件
    handleChange() {
      if (this.cascaKey.length < 3) {
        this.cascaKey = [];
        return;
      }
    },
    //标签页点击
    handleClick() {
      if (this.cascaKey.length < 3) return;
      let id = this.cascaKey[2];
      let sel = "";
      if (this.activeName == "添加参数") {
        sel = "only";
      } else if (this.activeName == "添加属性") {
        sel = "many";
      }
      cateDataList(id, {sel}).then((res) => {
        console.log(res);
      });
    },
    //获取参数列表
    getDataList() {},
  },
};
</script>

<style  scoped>
.catobj {
  margin: 15px 0px;
}
</style>