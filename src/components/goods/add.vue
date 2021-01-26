<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/index/goods' }"
        >商品列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 文字提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tap栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tabs :tab-position="tabPosition" v-model="active" :before-leave="beforeTab">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <el-row :gutter="20">
                <el-col class="catobj">
                  <span>选择商品分类:</span>
                  <!-- 分类级联 -->
                  <el-cascader
                    :options="cateList"
                    v-model="addForm.goods_cat"
                    :props="cascaderProps"
                    @change="handleChange"
                  ></el-cascader>
                </el-col>
              </el-row> 
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name"  v-for="item in manyList" :key="item.id">
             <!-- 多选框 -->
 <el-checkbox-group v-model="manyCheckList" >
    <el-checkbox  v-for="(val,ind) in item.attr_vals" :key="ind" :label="val" border></el-checkbox>
  
  </el-checkbox-group>
            </el-form-item>
        
  </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">  <el-form-item :label="item.attr_name"  v-for="item in onlyList" :key="item.id">
             <!-- 多选框 -->
 <el-checkbox-group v-model="onlyCheckList" >
    <el-checkbox  v-for="(val,ind) in item.attr_vals" :key="ind" :label="val" border></el-checkbox>
  
  </el-checkbox-group>
            </el-form-item></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
          <el-upload
  class="upload-demo"
  :action="uploadUrl"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :headers = "headerobj"
  list-type="picture"
  :on-success="handleSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
             <quill-editor  v-model="addForm.goods_introduce">
  </quill-editor>
  <el-button class="mt15" type="primary" @click="sendAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
  title="图片预览"
  :visible.sync="centerDialogVisible"
  width="40%"
  center>
  <el-image
      
      :src="imgSrc"
      fit="fill"></el-image>

</el-dialog>
  </div>
</template>

<script>
import { categoriesList ,cateDataList,addGoods} from "../../util/request";
export default {
  data() {
    return {
    
     
      //图片预览的地址
      imgSrc:"",
      //图片预览对话框的开关
      centerDialogVisible:false,
      //图片上传请求头
      headerobj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //上传图片的地址
      uploadUrl:"https://www.liulongbin.top:8888/api/private/v1/upload",
      active: "0", //步骤条进度
      tabPosition: "left", //tap栏样式
      addForm: {
        //添加数据
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], //选中的分类
        pics:[],//图片临时路径
        attrs:[],
        goods_introduce:""  //商品详情介绍
      },
     manyCheckList:[],//选中动态参数
      onlyCheckList:[],//选中静态参数
      manyList:[],//动态参数列表
     onlyList:[],//静态参数列表
      addFormRules: {
        //表单验证规则
        goods_name: [
          {
            required: true,
            message: "请输入商品名称!",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格!",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量!",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品重量!",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类!",
            trigger: "blur",
          },
        ],
      },
      cateList: [], //分类列表

      //分类级联选择器的配置
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
    };
  },
  mounted() {
    //获取分类列表
    categoriesList().then((res) => {
      this.cateList = res.data.data;
    });
  },
  methods: {
    //发送 添加请求
    sendAdd(){
   
this.$refs.ruleFormRef.validate(valid=>{
  if(!valid){
  return  this.$message.error("表单填写格式有误")
  }
  console.log(typeof(this.addForm.goods_cat));
  if(typeof(this.addForm.goods_cat)=='object'){
  this.addForm.goods_cat =  this.addForm.goods_cat.join(",")
  }
 //合并数组
var attrs = this.manyCheckList.concat(this.onlyCheckList)
   var  arr = this.manyList.concat(  this.onlyList);
//筛选
   arr.map((item)=>{
     if( item.attr_vals.length>0){

        item.attr_vals.map(val=>{
           let  obj = {attr_id:item.attr_id,attr_value:val}
        this.addForm.attrs.push(obj)
        })
  
     }
    
   })
   let  newobj = []
   this.addForm.attrs.map(item=>{
attrs.map(val=>{
if(item.attr_value==val){
 newobj.push(item)
}
})
   })
      this.addForm.attrs=newobj
  
addGoods(this.addForm).then(res=>{
  console.log(res.data);
  if (res.data.meta.status != 201) {
            this.$message.error("添加失败");
            return;
          }
})  

          this.$message.success(res.data.meta.msg);
          this.$router.push("/index/goods")
})
    },
    //图片上传成功后的回调
   handleSuccess(response, file, fileList){

      let pic= response.data.tmp_path
      this.addForm.pics.push({pic})
      
    },
    //处理图片预览
    handlePreview(file){
      this.imgSrc = file.response.data.url
console.log(file);
this.centerDialogVisible = true
    },
    //处理移除图片
    handleRemove(file){
let  filePath = file.response.data.tmp_path
console.log(filePath);
 let  i = this.addForm.pics.findIndex(x =>{
 return  x.pic == filePath
})
this.addForm.pics.splice(i,1)
    },
    
    //级联选择器变化时触发
    handleChange() {
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = [];
        return;
      }else{
        let sel = "many"
        cateDataList(this.addForm.goods_cat[2],{sel}).then(res=>{
           if (res.data.meta.status != 200) {
          return this.$message.error("获取失败");
        } res.data.data.map((item,index) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        
        });
          this.manyList = res.data.data
      
        });
       sel = "only"
        cateDataList(this.addForm.goods_cat[2],{sel}).then(res=>{
           if (res.data.meta.status != 200) {
          return this.$message.error("获取失败");
        } res.data.data.map((item,index) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        
        });
          this.onlyList = res.data.data
      
        })
}
    },
  
    //切换tab前触发
    beforeTab(activeName, oldActiveName){

if(this.addForm.goods_cat.length < 3||this.addForm.goods_name=="" ){
this.$message.error("请补全必填项!")
return false
}
    }
  },
  
};
</script>

<style  scoped>
.el-alert {
  margin: 10px 0 20px 0;
}
.el-checkbox{
  margin:  0 10px 0 0 ;
}
.mt15{
  margin-top: 15px;
}
</style>