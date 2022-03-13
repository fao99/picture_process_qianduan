<template>
  <div class="demo-image" id="div1">
    <div  class="block" v-for="fit in fits" :key="fit">
      <el-image
          style="width: 200px; height: 200px; "
          :src="url"
          :fit="fit"></el-image>
<!--      <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #ccc; display: flex">-->
<!--        <div id="div1">翱翱美图秀</div>-->
<!--      </div>-->
    </div>
  </div>

</template>

<script>


export default {
  name: "Header",
  components: {},
  data() {
    return {
      fits: ['contain'],
      url: 'https://guli-fao.oss-cn-shanghai.aliyuncs.com/1.jpg'
    }
  },
  created() {
  }
}
</script>

<style scoped>

  #div1{
    /*width: 200px;*/
    text-align: center;
    margin: 0 auto;
    font-size: 30px;
    font-weight: bold;
    color: #00FF00;
    border-bottom: 3px solid #00FF00;

  }
</style>
