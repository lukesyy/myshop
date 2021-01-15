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
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="添加参数"
          ><el-button type="primary" round :disabled="isBtn" @click="addShow('many')">{{
            activeName
          }}</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="moveList" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数列 -->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作" width="330px">
          <template slot-scope="scope">
            <!-- //修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="Edit(scope.row,'many')"
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
          
          </template>
        </el-table-column>
          </el-table>
          </el-tab-pane
        >
        <el-tab-pane label="静态属性" name="添加属性"
          ><el-button type="primary" round :disabled="isBtn" @click="addShow('only')">{{
            activeName
          }}</el-button>
            <!-- 静态参数表格 -->
          <el-table :data="moveList" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数列 -->
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <!-- 操作列 -->
            <el-table-column label="操作" width="330px">
          <template slot-scope="scope">
            <!-- //修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="Edit(scope.row,'only')"
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
          
          </template>
        </el-table-column>
          </el-table>
          </el-tab-pane
        >
      </el-tabs>
    </el-card>
<!-- ===================================================================== -->



<!-- ============================================================================= -->

     <!-- 添加动态或静态参数对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addrolesVisible"
      @close="addClose"
    >
      <el-form :model="addCateList" :rules="addFormRules" ref="addFromRef">
        <el-form-item
          :label="labelText"
          :label-width="'200'"
        prop="cat_name"
        >
          <el-input v-model="addCateList.cat_name" autocomplete="off"  ></el-input>
        </el-form-item>
     </el-form>
      <!-- 对话窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAddCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- ============================================================================= -->
    
     <!-- 修改参数对话框 -->
    <el-dialog
      :title="setTitleText"
      :visible.sync="setrolesVisible"
      @close="setClose"
    >
      <el-form :model="setCateList" :rules="addFormRules" ref="setFromRef">
        <el-form-item
          :label="setLabelText"
          :label-width="'200'"
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
import { categoriesList, cateDataList,cateGories,setCategories,DeleteCategories } from "../../util/request";
export default {
  data() {
    return {
      cateid:0,//选中的分类id
      attrId:0,   //属性 ID
      labelText:"动态参数",//添加
      titleText:"添加动态参数",//添加
      setLabelText:"动态参数",//修改
      setTitleText:"修改动态参数",//修改
      addCateList:{},//添加静态或动态属性的参数列表
      setCateList:{},//修改
      activeName: "添加参数", //标签页的名称
      cascaKey: [],
setrolesVisible:false,
addrolesVisible:false,
      //添加时的级联选择器的配置
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        
      },
      cateList: [],
      // 动态参数列表
      addList:[],
       //添加对话框的验证规则
      addFormRules:{
        cat_name:[ {
            required: true,
            message: "请输入分类名称!",
            trigger: "blur",
          }]
      },
      //动态或者静态的列表
      moveList:[]
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
    //发送添加请求
    sendAddCate(){
  let attr_name = this.addCateList.cat_name
  let attr_sel = this.setLabelText=="动态参数"?"many":"only"
 
 cateGories(this.cateid,{attr_name,attr_sel}).then(res=>{
        if(res.data.meta.status==201){
          this.$message.success(res.data.meta.msg)
          this.addrolesVisible = false
          this.getList()
        }
      })
    },
     //发送修改
    sendSetCate(){
let attr_name = this.setCateList.cat_name
let attr_sel = this.setLabelText=="动态参数"?"many":"only"
      setCategories(this.cateid,this.attrId,{attr_name,attr_sel}).then(res=>{
       if(res.data.meta.status == 200){
          this.$message.success(res.data.meta.msg)
          this.getList()
this.setrolesVisible = false
       }
      })

    },
   //打开修改对话框
    Edit(row,is){
      if(is == "only"){
  this.setTitleText = "修改静态属性"
this.setLabelText = "静态属性"
}else{
   this.setTitleText = "修改动态参数"
this.setLabelText = "动态参数"
}
      this.attrId = row.attr_id
this.setrolesVisible = true

    },
    //发送删除
    Delete(row){


DeleteCategories(this.cateid,row.attr_id).then(res=>{
  if(res.data.meta.status == 200){
          this.$message.success(res.data.meta.msg)
          this.getList()

       }
})
    },
    //监听添加用户对话框的关闭事件
    addClose() {
      //关闭对话框后把内容清空
      this.$refs.addFromRef.resetFields();
    },
    //监听修改用户对话框的关闭事件
    setClose() {
      //关闭对话框后把内容清空
      this.$refs.setFromRef.resetFields();
    },
    //打开动态或静态属性对话框
    addShow(is){
this.addrolesVisible = true
if(is == "only"){
  this.titleText = "添加静态属性"
this.labelText = "静态属性"
}else{
   this.titleText = "添加动态参数"
this.labelText = "动态参数"
}
    },
    //级联选择变化触发事件
    handleChange() {
      if (this.cascaKey.length < 3) {
        this.cascaKey = [];
        return;
      }
      this.getList()
    },
    //标签页点击
    handleClick() {
     this.getList()
    },
    //获取动态和静态的参数列表
    getList(){
 if (this.cascaKey.length < 3) return;
      this.cateid = this.cascaKey[2];
      let sel = "";
      if (this.activeName == "添加参数") {
        sel = "many";
      } else if (this.activeName == "添加属性") {
        sel = "only";
      }
      let id =  this.cateid
      cateDataList(id, {sel}).then((res) => {
        if(res.data.meta.status != 200){
          return  this.$message.error("获取失败")
        }
        this.moveList = res.data.data
        console.log( this.moveList);
      });
    },
    //获取参数列表
    getDataList() {
     
    },
  },
};
</script>

<style  scoped>
.catobj {
  margin: 15px 0px;
}
</style>