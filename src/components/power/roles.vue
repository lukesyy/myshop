<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加 -->

      <el-button type="primary" @click="addshow" >
        添加角色</el-button
      >

      <!-- 用户列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
          
            
            <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['tagone', 'bdbottom',index===0 ? 'bdtop':'']">
              <el-col :span="6">
                <!--  一级权限  -->
                <el-tag class="tagone " closable
                 @close="removOne(scope.row,item)">{{ item.authName }}</el-tag><i class="el-icon-caret-right"></i></el-col
              >
              <el-col :span="18">
                <!--  二级权限  -->
                <el-row v-for="(i,dex) in item.children" :key="i.id"  :class="[dex!=0 ? 'bdtop':'']">
                  <el-col :span="8"> <el-tag closable type="success"
                   @close="removOne(scope.row,i)"> {{ i.authName }}</el-tag><i class="el-icon-caret-right"></i></el-col>

                  <el-col :span="16">
                    <!--  三级权限  -->
                  
                     
                        <el-tag  v-for="ii in i.children" :key="ii.id" closable type="warning"
                        @close="removOne(scope.row,ii)"> {{ ii.authName }}</el-tag>
                       
                    
               
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>

        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>

        <el-table-column label="操作" width="330px">
          <template slot-scope="scope">
            <!-- //修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="Edit(scope.row.id)"
              size="mini"
              >编辑</el-button
            >

            <!-- //删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="Delete(scope.row)"
              size="mini"
              >删除</el-button
            >

            <!-- //分配权限按钮 -->

              <el-button
                type="warning"
                icon="el-icon-s-tools"
                @click="setrightslist(scope.row)"
                size="mini"
              >
                分配权限</el-button
              >
          
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogFormVisible"
      @close="addClose"
    >
      <el-form :model="addForm"  ref="addFromRef">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
      
        >
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
         
        >
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
       
      </el-form>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="setrolesVisible"
      @close="setClose"
    >
      <el-form :model="setForm" ref="setFromRef">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
        
        >
          <el-input v-model="setForm.roleName" autocomplete="off"  disabled></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
         
        >
          <el-input v-model="setForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="setrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="setroles">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setrightsVisible"
       @close="rightsClose"
    >
     <el-tree
    default-expand-all
  :data="setrightsList"
  show-checkbox
  node-key="id"
  ref='tree'
  :default-checked-keys='assetsRightsList'
  :props="defaultProps">
</el-tree>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="setrightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="postrights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rolesList,
  setType,
  addRoleList,
  DeleteRoles,
  getRoleOne,
  setroles,
  DeleteRights,
  rightsList,
  setRights
} from "../../util/request";
export default {
  data() {
    return {
      rolesList: [], //请求回来的列表数据
      total: 0, //总页数
      dialogFormVisible: false, //控制添加弹框的显示与隐藏
      setrolesVisible: false, //控制修改弹框的显示与隐藏
      setrightsVisible:false,//分配角色弹框
      //进行添加用户的数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
    
      //修改用户的提交数据
      setForm: {},
      //获取到的所有权限列表数据
      setrightsList:[],
      //默认权限勾选列表
      assetsRightsList:[],
     
      //分配权限时传的id
      id:0,
      //权限树状图的配置
       defaultProps: {
          children: 'children',
          label: 'authName'
        },
      formLabelWidth: "120px",
    };
  },
  methods: {
    //获取默认权限勾选列表
    getRightsKeys(node,arr){
if(!node.children){

  return arr.push(node.id)

}
node.children.forEach(item=>this.getRightsKeys(item,arr))
    },
    //分配用户权限
    setrightslist(row){
      this.id = row.id
     
rightsList('tree').then(res=>{
 if (res.data.meta.status != 200) {
          this.$message.error("获取权限列表失败!");
          return;
        }
         this.setrightsList = res.data.data;
         this.$message.success(res.data.meta.msg);


            //  调用函数 获取已经勾选了的权限
       this.getRightsKeys(row,this.assetsRightsList)
  
    
         this.setrightsVisible = true

     
})
    },
    //权限分配提交
   
    postrights(){
      //提取 树形结构中的选中与办选中节点的key
  const key = [
    ...this.$refs.tree.getCheckedKeys(),
    ...this.$refs.tree.getHalfCheckedKeys()
  ]

//使用,分割数组
 const arr = key.join(',')

 setRights(this.id,arr).then(res=>{
 if (res.data.meta.status != 200) {
          this.$message.error("权限分配失败!");
          return;
        }
        
      this.$message.success('权限分配成功');
          //成功后重新获取列表
          this.getRoleslist();
          this.setrightsVisible = false;
 })
    },
    //修改用户的弹框
    Edit(id) {
      getRoleOne(id).then((res) => {
        if (res.data.meta.status != 200) {
          this.$message.error("查询用户信息失败!");
          return;
        }
         this.setForm = res.data.data;
      });
      this.setrolesVisible = true; //控制修改弹框的显示与隐藏
    },
    //提交修改
    setroles() {
      this.$refs.setFromRef.validate((valid) => {
        //valid是一个 布尔值
        if (!valid) {
          this.$message.error("请合法填入信息");
          return;
        }
        let { roleName,roleDesc,  roleId } = this.setForm;
        setroles(roleId,roleDesc , roleName).then((res) => {
          if (res.data.meta.status != 200) {
            this.$message.error("修改失败");
            return;
          }

          this.$message.success('修改成功');
          //成功后重新获取列表
          this.getRoleslist();
          this.setrolesVisible = false;
        });
      });
    },
    //删除用户
    Delete(row) {
      this.$confirm(`确定删除角色 ${row.roleName} 的信息吗?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteRoles(row.id).then((res) => {
            if (res.data.meta.status != 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success(res.data.meta.msg);
            this.getRoleslist();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    //tag标签点击删除对应的权限
    removOne(role,right){
     
this.$confirm(`确定移除此权限吗?`, "提示", {
        confirmButtonText: "移除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteRights(role.id,right.id).then((res) => {
            if (res.data.meta.status != 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success('移除成功');
            role.children = res.data.data
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消移除",
          });
        });
    },
//点击添加按钮时 制空表单
addshow(){
  this.dialogFormVisible= true
 
},

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
    //监听添加用户对话框的关闭事件
    addClose() {
      //关闭对话框后把内容清空
      this.addForm={
        roleName: "",
        roleDesc: "",
      }
    },
    //监听修改对话框的关闭事件
    setClose() {
      //关闭对话框后把内容清空
      this.$refs.setFromRef.clearValidate();
      console.log(this.$refs);
    },
    //监听分配权限的关闭事件
    rightsClose(){
this.assetsRightsList = []
    },
    //发送获取用户列表的请求
    getRoleslist() {
      rolesList().then((res) => {
        this.rolesList = res.data.data;
      });
    },
    //添加用户提交
    addUser() {
      //验证整个表单
      this.$refs.addFromRef.validate((valid) => {
        //valid是一个 布尔值
        if (valid) {
          addRoleList(this.addForm).then((res) => {
            if (res.data.meta.status == 201) {
              this.$message.success(res.data.meta.msg);
              //成功后重新获取列表
              this.getRoleslist();
          
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
    this.getRoleslist();
  },
};
</script>

<style  scoped>
.el-row{
  display: flex;
  align-items: center;
}
.el-tag{
  margin:7px ;
}
.bdtop{border-top: 1px solid #eee;}
.bdbottom{border-bottom: 1px solid #eeeeee;}

</style>