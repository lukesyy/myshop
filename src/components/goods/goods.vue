<template>
    <div>
  <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getList"
            @keyup.enter="getList"
            v-model="params.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"> </el-col>
        <el-button type="primary" @click="goAddPage">
          添加商品</el-button
        >
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"  width="950px"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"  width="110px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="110px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
<template slot-scope="scope">
        {{scope.row.add_time | dataFormat}}

    </template>

        </el-table-column>


        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <!-- //修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="Edit(scope.row.id)"
              size="mini"
            ></el-button>

            <!-- //删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="Delete(scope.row)"
              size="mini"
            ></el-button>
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

    

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="setUserVisible"
      @close="setUserClose"
    >
      <el-form :model="setForm" :rules="addFormRules" ref="setFromRef">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input
            v-model="setForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="setForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="setForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="setUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="getSetUser">确 定</el-button>
      </div>
    </el-dialog>

    </div>
</template>

<script>
import {
  getGoodsList,
  setType,
  addGoods,
  DeleteGoods,
  getUserOne,
  setUser,
  setUserRole,
  rolesList,
} from "../../util/request";
export default {
  data() {
    return {
      //获取用户列表的数据
      params: {
        query: "",
        pagenum: 1, //当前页数
        pagesize: 2, //每页显示多少行
      },
      goodsList: [], //请求回来的列表数据
      total: 0, //总页数
      dialogFormVisible: false, //控制添加弹框的显示与隐藏
      setUserVisible: false, //控制修改弹框的显示与隐藏
      setRoleVisible: false, //控制分配角色弹框的显示与隐藏
      //角色的列表
      getRoleList: [],
      //角色的ID
      Rid: null,
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
      //修改用户的提交数据
      setForm: {},
      //分配角色的提交数据
      setRoleList: {},
      formLabelWidth: "120px",
    };
  },
  methods: {
    //修改用户的弹框
    Edit(id) {
      getUserOne(id).then((res) => {
        if (res.data.meta.status != 200) {
          this.$message.error("查询用户信息失败!");
          return;
        }
        this.setForm = res.data.data;
      });
      this.setUserVisible = true; //控制修改弹框的显示与隐藏
    },
    //提交修改
    getSetUser() {
      this.$refs.setFromRef.validate((valid) => {
        //valid是一个 布尔值
        if (!valid) {
          this.$message.error("请合法填入信息");
          return;
        }
        let { id, email, mobile } = this.setForm;
        setUser(id, email, mobile).then((res) => {
          if (res.data.meta.status != 200) {
            this.$message.error("添加失败");
            return;
          }

          this.$message.success(res.data.meta.msg);
          //成功后重新获取列表
          this.getList();
          this.setUserVisible = false;
        });
      });
    },
    //删除商品
    Delete(row) {
      this.$confirm(`确定删除商品 ${row.goods_name} 吗?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteGoods(row.goods_id).then((res) => {
            if (res.data.meta.status != 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success(res.data.meta.msg);
                  this.params.pagenum= (this.goodsList.length)%(this.params.pagesize) == 1?this.params.pagenum-1:this.params.pagenum
     
            this.getList();
  
       
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    // 监听 每页多少条
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;

      this.getList();
    },
    //监听页码值改变
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage;
      this.getList();
    },
  
    //监听添加用户对话框的关闭事件
    addClose() {
      //关闭对话框后把内容清空
      this.$refs.addFromRef.resetFields();
    },
    //监听修改对话框的关闭事件
    setUserClose() {
      //关闭对话框后把内容清空
      this.$refs.setFromRef.resetFields();
    },
    //监听分配角色对话框关闭事件
    setRoleClose() {
      //关闭对话框后把内容清空
      this.Rid = null;
    },
    //发送获取用户列表的请求
   getList() {
      getGoodsList(this.params).then((res) => {
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
        console.log( this.goodsList);
      });
    },
    //跳转到商品添加的页面
    goAddPage(){
this.$router.push("/index/add")
    },
    //添加用户提交 
    addGood() {
      //验证整个表单
      this.$refs.addFromRef.validate((valid) => {
        //valid是一个 布尔值
        if (valid) {
          addGoods(this.addForm).then((res) => {
            if (res.data.meta.status == 201) {
              this.$message.success(res.data.meta.msg);
              //成功后重新获取列表
              this.getList();
            } else {
              this.$message.error("添加失败");
            }
          });
          //关闭对话框
          this.dialogFormVisible = false;
        } else {
          this.$message.error("请合法填入信息");
        }
      });
    },
 

  },
  mounted() {
    this.getList();
  },
};
</script>

<style  scoped>
</style>