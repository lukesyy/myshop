<template>
  <div>
    <el-button type="danger" @click="tuichu">退出</el-button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
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
            sessionStorage.clear()
            this.$router.push('/')
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消退出",
            });
          });
      }
    },
  },
};
</script>

<style  scoped>
</style>