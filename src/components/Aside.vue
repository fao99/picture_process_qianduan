<template>
  <div>
    <el-menu style="width: 160px; min-height: calc(100vh - 50px)" default-active="user" router class="el-menu-vertical-demo">

      <el-menu-item index="list" >
        <el-icon :size="20">
          <list />
        </el-icon>
        图像列表
      </el-menu-item>

      <el-menu-item index="process">
        <el-icon :size="20">
          <picture-filled />
        </el-icon>
        图像处理
      </el-menu-item>
    </el-menu>
  </div>
</template>


<script>

import list from "@element-plus/icons-vue/dist/es/list.mjs";
import pictureFilled from "@element-plus/icons-vue/dist/es/picture-filled.mjs";


export default {
  name: "Aside",
  components: {list,pictureFilled},
  data(){
    return {

    }
  },
  created() {
  }
}
</script>

<style scoped>

.el-menu-item{
  font-size: 17px;
  font-color: maroon;
}
</style>
