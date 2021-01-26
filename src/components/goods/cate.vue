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
        <template slot="isok" slot-scope="scope">
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
        <template slot="score" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0"> 一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success">
            二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level == 2" type="warning">
            三级</el-tag
          >
        </template>

        <!-- 操作 -->
        <template slot="set" slot-scope="scope">
          <el-row>
            <!-- //编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="bj(scope.row)"
            >
              编辑
            </el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-edit"
              size="mini"
              @click="remove(scope.row)"
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

     <!-- 添加用户对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
      @close="addClose"
    >
      <el-form :model="addCateMsg" :rules="addFormRules" ref="addFromRef">
        <el-form-item
          label="分类名称:"
          :label-width="formLabelWidth"
          prop="cat_name"
        >
          <el-input v-model="addCateMsg.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类:"
          :label-width="formLabelWidth"
        >
          <el-cascader
    v-model="cascaKey"
    :options="parentList"
    :props="cascaderProps"
    @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
       <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAddCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="setrolesVisible"
      @close="setClose"
    >
      <el-form :model="setCateList" :rules="addFormRules" ref="setFromRef">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
        prop="cat_name"
        >
          <el-input v-model="setCateList.cat_name" autocomplete="off"  ></el-input>
        </el-form-item>
     </el-form>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="setrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendSetCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categoriesList,DeleteCate,addCateOne,setCate } from "../../util/request";

export default {
  data() {
  
    return {
      //添加时的级联选择器的配置
      cascaderProps: { expandTrigger:"hover" ,value:"cat_id",label:"cat_name",children:"children",checkStrictly: true},
      //添加时的父级信息
      cascaKey:[],
      formLabelWidth: "120px",
      //添加对话框的显示隐藏
      dialogFormVisible:false,
      //编辑对话框的显示隐藏
      setrolesVisible:false,
      //添加对话框的验证规则
      addFormRules:{
        cat_name:[ {
            required: true,
            message: "请输入分类名称!",
            trigger: "blur",
          }]
      },
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
      //添加时获取到的父级列表
      parentList:[],
      //编辑时发送的数据
      setCateList:{},
      //总条数
      total: 0,
      addCateMsg:{
        cat_pid:0,
        cat_name:"",
        cat_level:0,
      }
    };
  },
  methods: {
    //级联选择器事件
    handleChange(){
      console.log(this.cascaKey);
      if(this.cascaKey.length!=0){
        this.addCateMsg.cat_pid = this.cascaKey[this.cascaKey.length-1]
        this.addCateMsg.cat_level = this.cascaKey.length
      }else{
         this.addCateMsg.cat_pid = 0
      }
      
    },
    //获取分类列表
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
     //监听添加用户对话框的关闭事件
    addClose() {
      //关闭对话框后把内容清空
      this.$refs.addFromRef.resetFields();
    },
     //监听修改对话框的关闭事件
    setClose() {
      //关闭对话框后把内容清空
      this.$refs.setFromRef.clearValidate();
      console.log(this.$refs);
    },
    //删除
remove(row){
   this.$confirm(`确定删除角色 ${row.cat_name} 的信息吗?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row.cat_id);
          DeleteCate(row.cat_id).then(res=>{

        this.$message.error(res.data.meta.msg);
           this.params.pagenum= (this.cateList.length)%(this.params.pagesize) == 1?this.params.pagenum-1:this.params.pagenum
       this.getcateList()
      
  })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
 
},
//打开编辑
bj(row){
this.setrolesVisible = true
 this.setCateList =   row
},
//提交编辑
sendSetCate(){
   let {cat_id,cat_name} = this.setCateList
 setCate(cat_id,{cat_name}).then(res=>{
    console.log(res);
    if(res.data.meta.status==200){
 this.$message.success(res.data.meta.msg)
 this.getcateList()
this.setrolesVisible = false
 
    }else{
       this.$message.error("修改失败")
    }
  })
},
//打开添加
 addshow() {
      this.dialogFormVisible = true
 let  params = {
        type: 2,
        pagenum: "",
        pagesize: "",
      }

     categoriesList(params).then((res) => {
      if (res.data.meta.status != 200) {
        this.$message.error("获取分类列表失败!");
        return;
      }
      this.parentList = res.data.data;
      this.$message.success(res.data.meta.msg);
      
     console.log(this.parentList);
    });
    this.cascaKey=[]
    },
//发送添加
sendAddCate(){
  
  
  addCateOne(this.addCateMsg).then(res=>{

     if (res.data.meta.status != 201) {
        this.$message.error("添加分类失败!");
        return;
      }
      this.$message.success(res.data.meta.msg);
this.getcateList()
this.dialogFormVisible = false
  })
}
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