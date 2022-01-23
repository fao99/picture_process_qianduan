<template>
  <div style="padding: 10px">
    <!--    功能区域-->
    <div style="margin: 10px 0">
      <el-button @click="add" color="#800000" style="color: white">上传图像</el-button>
    </div>


    <!--    搜索区域-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入图片id" style="width: 30%" clearable/>
      <el-button @click="load" color="#800000" style="margin-left: 5px;color: white">查询</el-button>
    </div>

    <!--    表格区域-->
    <!--    表格内容-->
    <el-table :data="tableData" stripe style="width: 99%">
      <el-table-column prop="id" label="ID"  sortable />
      <el-table-column prop="pic" label="图像" >
        <template #default="scope">
          <el-image
              style="width: 200px; height: 200px"
              :src="scope.row.src"
              :preview-src-list="[scope.row.src]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间"/>

      <!--    表格操作-->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button  @click="goProcess(scope.row.id)">处理图像</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="handleDelete(scope.row.id)" icon-color="#800000" confirmButtonType="danger">
            <template #reference>
              <el-button color="#800000" style="color: white">删除图像</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <!--    分页-->
    <div class="demo-pagination-block" style="margin-top: 30px; padding-left: 500px">
      <el-pagination
          background
          v-model:currentPage="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!--    上传隐藏框-->
    <el-dialog v-model="dialogVisible" title="上传图像" width="30%">

      <el-form :model="form" label-width="120px">
      <el-upload
          class="avatar-uploader"
          action="/pic/picture/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
      </el-upload>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="addPicture" color="#800000" style="color: white">确定</el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import plus from "@element-plus/icons-vue/dist/es/plus.mjs";
import request from "@/utils/request";

export default {
  name: 'Book',
  components: {plus},
  data(){
    return{
      tableData: [],//表格数据
      dialogVisible: false,//默认隐藏上传表单
      imageUrl: '', //前端图片地址
      form: {},//隐藏框表单里的内容
      pageSize: 6,//每页放6章照片
      total: 20,//总页数
      currentPage: 1,//当前页数
      search: '',//查询
    }
  },
  created() {//初始化操作
    this.load();//重新加载
  },
  methods: {
    load(){//页面一开始的加载
      //分页查询加根据id查询
      request.get("/picture",{//相关参数
        params: {
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search
        }
      }).then(res => {//获取全部图片
        console.log(res.data)
        this.tableData=res.data.records
        this.total=res.data.total
      })
    },
    add(){//上传图像函数
      //将弹框打开
      this.dialogVisible=true
      //清空表单域
      this.form={}
    },
    beforeAvatarUpload(file){//图像上传前预处理
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!isJPG) {
        this.$message.error('必须是图片哦!')
      }
      if (!isLt2M) {
        this.$message.error('图片不能大于20MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {//图像上传成功的话
      this.imageUrl = res.data//获取图像下载地址
      this.form.src=this.imageUrl//将图像地址给表单
    },
    addPicture(){//上传图像给后端
      console.log(this.imageUrl)
      request.post("/picture",this.form).then(res => { //axios
        console.log(res)
        if (res.code=='0'){
          this.$message({
            type: "success",
            message: "新增成功"
          })
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        this.dialogVisible=false //关闭弹窗
        this.load()//刷新表格数据
      })
    },
    handleCurrentChange(){//改变当前页面触发
      this.load()
    },

    handleDelete(id){//删除图像
      console.log(id)
      request.delete("/picture/"+id).then(res => {
        if (res.code=='0'){
          this.$message({
            type: "success",
            message: "删除成功"
          })
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        this.load()
      })
    },
    goProcess(id){//跳转到处理图像页面
      this.$router.push({name:'Process',params: {id:id}})
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 525px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 50px;
  color: #800000;
  width: 300px;
  height: 300px;
  text-align: center;
  margin: 0 auto;
}
.avatar-uploader-icon svg {
  margin: 150px auto;
}
.avatar {
  width: 525px;
  height: 320px;
  display: block;
}
</style>
