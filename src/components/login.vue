<template>
  <div class="login">
    <div class="content">
      <div class="img">
        <img src="../assets/timg.jpg" alt="" />
      </div>
      <!-- //登录表单 -->
      <el-form :model="form" class="login_form" :rules="loginRoler">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="iconfont icon-yonghu"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item>
          <el-input
            v-model="form.password"
            prefix-icon="iconfont icon-suo"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="buts">
          <el-button type="primary" round @click="loginon">登录</el-button>
          <el-button type="info" round @click="resteForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postlogin } from "../util/request";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loginRoler: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resteForm() {
      this.form = {
        username: "",
        password: "",
      };
    },
    loginon() {
      postlogin(this.form).then((res) => {
        
        if(res.data.meta.status==200){
         this.$message.success(res.data.meta.msg)
           sessionStorage.setItem('token',res.data.data.token)
           this.$router.push('/index')
        }else{
         this.$message.error(res.data.meta.msg);
        
         
        }
      });
    },
  },
};
</script>


<style  scoped>
.login {
  height: 100vh;
  background-color: #2b4b6b;
  position: relative;
}
.content {
  width: 450px;
  height: 300px;
  background-color: cornsilk;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}
.img {
  width: 130px;
  height: 130px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #dddddd;
  position: absolute;
  top: -25%;
  left: 50%;
  transform: translate(-50%);
  background-color: cornsilk;
}
.img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: cornsilk;
}
.buts {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0px;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
}
</style>
