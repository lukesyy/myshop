<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
            @keyup.enter="getUserList"
            v-model="params.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"> </el-col>
        <el-button type="primary" @click="dialogFormVisible = true">
          添加用户</el-button
        >
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>

        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <!-- //修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="Edit(scope.row)"
              size="mini"
            ></el-button>

            <!-- //删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="Delete(scope.row)"
              size="mini"
            ></el-button>

            <!-- //分配角色按钮 -->

            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                @click="Delete(scope.row)"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->

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
    <!-- 添加用户对话框 -->
    <el-dialog title="更改用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="addFormRules">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { usersList, setType, addUserList } from "../../util/request";
export default {
  data() {
    return {
      //获取用户列表的数据
      params: {
        query: "",
        pagenum: 1, //当前页数
        pagesize: 2, //每页显示多少行
      },
      usersList: [], //请求回来的列表数据
      total: 0, //总页数
      dialogFormVisible: false, //添加弹框的值
      //进行添加用户的数据
      addForm: {
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      //添加用户的表单验证
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名!",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3-10位之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱!",
            trigger: "blur",
          },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] },
        ],
        password: [
          {
            required: true,
            message: "请输入密码!",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码长度在6-15位之间",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号!",
            trigger: "blur",
          },
          {
            min: 11,
            max: 11,
            message: "手机号应为11位",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    Edit(row) {},
    Delete(row) {},
    // 监听 pagesize
    handleSizeChange(newSize) {},
    //监听页码值改变
    handleCurrentChange(newPage) {},
    //监听状态改变
    userState(row) {
      setType(row.id, row.mg_state).then((res) => {
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error("设置状态失败");

          row.mg_state = !row.mg_state;
        }
      });
    },
    //发送获取用户列表的请求
    getUserList() {
      usersList(this.params).then((res) => {
        this.usersList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    //添加用户提交
    addUser() {
      addUserList(this.addForm).then((res) => {
        if (res.data.meta.status == 201) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error("添加失败");
        }
      });
      this.dialogFormVisible = false;
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style  scoped>
</style>