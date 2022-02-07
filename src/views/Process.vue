<template>
  <div style="padding: 10px">

    <!--    功能区域-->
    <div style="margin: 10px 0">
      <el-button @click="goList" color="#800000" style="color: white">选择/重选图像</el-button>
      <el-button @click="downloadPic" color="#800000" style="color: white; padding-left: 30px">下载图像</el-button>
      <img id="img1" src="" crossorigin="anonymous" style="width: 60px; height: 40px;position: absolute;object-fit: cover; margin-left: 50px">
      <div style="margin-top: 10px; height: 20px">
        <!--   提示上传图片     -->
        <el-alert v-if="this.$route.params.id==null" title="请先选择图像！" type="warning" show-icon
                  style="width: 15%;"></el-alert>
      </div>
    </div>

    <!--  canvas图像展示区域    -->
    <div style="width: 99%; margin-top: 40px">
      <canvas id="canvas2" width="550" height="550"></canvas>
    </div>

    <!--  滤镜单选框   -->
    <div style="margin-top: 50px">
      <el-radio-group v-model="radioList" @change="change">
        <el-radio-button label="原图" v-model="checkedNames"></el-radio-button>
        <el-radio-button label="黑白" v-model="checkedNames"></el-radio-button>
        <el-radio-button label="反色" v-model="checkedNames"></el-radio-button>
        <el-radio-button label="灰度" v-model="checkedNames"></el-radio-button>
        <el-radio-button label="模糊" v-model="checkedNames"></el-radio-button>
        <el-radio-button label="浮雕" v-model="checkedNames"></el-radio-button>
      </el-radio-group>
    </div>

    <!--图像几何变化    -->
    <el-button @click="huanYuan" color="#800000" style="color: white; margin-top: 20px">还原</el-button>
    <el-button @click="da" color="#800000" style="color: white; margin-top: 20px">放大</el-button>
    <el-button @click="xuanZhuan" color="#800000" style="color: white; margin-top: 20px">顺时针旋转90°</el-button>
    <el-button @click="suoFang" color="#800000" style="color: white; margin-top: 20px">任意角度旋转加缩放</el-button>
    <el-button @click="huiHua" color="#800000" style="color: white; margin-top: 20px">开启绘画</el-button>
  </div>
</template>

<script>
import request from "@/utils/request";
import { fabric } from 'fabric'

export default {
  name: "Process",

  data() {
    return {
      radioList: [],//滤镜复选框
      checkedNames: [],
      tempWidth: '550', //缩放时临时变量

    }
  },
  created() {//初始化操作
    this.load();//重新加载
  },
  methods: {
    load() {//页面一开始就加载
      let id = this.$route.params.id//获取到之前的id
      if (id != null) {
        //根据id查询图片并加载给canvas
        request.post("/process/getById/" + id).then(res => {//获取对应图片
          console.log(res.data)
          let canvas2 = document.getElementById("canvas2");
          let ctx2 = canvas2.getContext("2d");
          ctx2.save();//当前状态保存

          let img = document.getElementById("img1")
          img.src = res.data.src

          img.onload = function () {//等图片加载后再操作
            // ctx1.drawImage(img, 0, 0, canvas1.width, canvas2.height);
            ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);// 重新获取原始图像数据点信息
          }
        })
      }
    },
    goList() {//去到List页面
      this.$router.push({name: 'List'})
    },
    downloadPic() {//下载图片
      let canvas2 = document.getElementById("canvas2");
      let dataURL = canvas2.toDataURL();
      let a = document.createElement('a')
      a.download = name || 'picture'
      // 设置图片地址
      a.href = dataURL;
      a.click();
    },
    change() {//单选框改变时调用各种滤镜算法
      this.cancel()//上来先复原
      console.log(this.radioList)
      if (this.radioList == "原图") {
        this.cancel()
      }
      if (this.radioList == "黑白") {
        this.heiBai()
      }
      if (this.radioList == "反色") {
        this.fanSe()
      }
      if (this.radioList == "灰度") {
        this.huiDu()
      }
      if (this.radioList == "模糊") {
        this.muoHu()
      }
      if (this.radioList == "浮雕") {
        this.fuDiao()
      }
    },
    cancel() {//取消滤镜效果
      let canvas2 = document.getElementById("canvas2");
      let ctx2 = canvas2.getContext("2d");
      let img = document.getElementById("img1")
      ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
    },
    heiBai() {//黑白滤镜
      let canvas2 = document.getElementById("canvas2")
      let ctx2 = canvas2.getContext("2d")
      let tempImgData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
      let data = tempImgData.data
      //图片的颜色只有黑色和白色，可以计算rgb的平均值arg，arg>=100，r=g=b=255，否则均为0
      for (let i = 0, len = data.length; i < len; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg >= 100 ? 255 : 0;
      }
      ctx2.putImageData(tempImgData, 0, 0)
    },
    fanSe() {//反色滤镜
      let canvas2 = document.getElementById("canvas2")
      let ctx2 = canvas2.getContext("2d")
      let tempImgData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
      let data = tempImgData.data
      //把rgb全部反转 用255减就行了
      for (let i = 0, len = data.length; i < len; i += 4) {
        data[i] = 255 - data[i]
        data[i + 1] = 255 - data[i + 1]
        data[i + 2] = 255 - data[i + 2]
      }
      ctx2.putImageData(tempImgData, 0, 0)
    },
    huiDu() {//灰度滤镜
      let canvas2 = document.getElementById("canvas2")
      let ctx2 = canvas2.getContext("2d")
      let tempImgData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
      let data = tempImgData.data
      //采用基于人眼感觉的加权平均数来实现
      //Gray = (Red * 0.3 + Green * 0.59 + Blue * 0.11)
      for (let i = 0, len = data.length; i < len; i += 4) {
        let grey = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        data[i] = grey
        data[i + 1] = grey
        data[i + 2] = grey
      }
      ctx2.putImageData(tempImgData, 0, 0)
    },
    muoHu() {//模糊滤镜
      let canvas2 = document.getElementById("canvas2")
      let ctx2 = canvas2.getContext("2d")
      let tempImgData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
      let pixes = tempImgData.data
      //通过让图片的每个像素与四周的像素按照某种权重进行分布求值
      let width = tempImgData.width;
      let height = tempImgData.height;
      let gaussMatrix = [], gaussSum = 0, x, y, r, g, b, a, i, j, k, len;
      let radius = 30;
      let sigma = 5;
      a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
      b = -1 / (2 * sigma * sigma);
      //生成高斯矩阵
      for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;

      }
      //归一化, 保证高斯矩阵的值在[0,1]之间
      for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
      }
      //x 方向一维高斯运算
      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          r = g = b = a = 0;
          gaussSum = 0;
          for (j = -radius; j <= radius; j++) {
            k = x + j;
            if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
              //r,g,b,a 四个一组
              i = (y * width + k) * 4;
              r += pixes[i] * gaussMatrix[j + radius];
              g += pixes[i + 1] * gaussMatrix[j + radius];
              b += pixes[i + 2] * gaussMatrix[j + radius];
              // a += pixes[i + 3] * gaussMatrix[j];
              gaussSum += gaussMatrix[j + radius];
            }
          }
          i = (y * width + x) * 4;
          // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
          // console.log(gaussSum)
          pixes[i] = r / gaussSum;
          pixes[i + 1] = g / gaussSum;
          pixes[i + 2] = b / gaussSum;
          // pixes[i + 3] = a ;
        }
      }
      //y 方向一维高斯运算
      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          r = g = b = a = 0;
          gaussSum = 0;
          for (j = -radius; j <= radius; j++) {
            k = y + j;
            if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
              i = (k * width + x) * 4;
              r += pixes[i] * gaussMatrix[j + radius];
              g += pixes[i + 1] * gaussMatrix[j + radius];
              b += pixes[i + 2] * gaussMatrix[j + radius];
              // a += pixes[i + 3] * gaussMatrix[j];
              gaussSum += gaussMatrix[j + radius];
            }
          }
          i = (y * width + x) * 4;
          pixes[i] = r / gaussSum;
          pixes[i + 1] = g / gaussSum;
          pixes[i + 2] = b / gaussSum;
        }
      }

      ctx2.putImageData(tempImgData, 0, 0)
    },
    fuDiao() {//浮雕滤镜
      let canvas2 = document.getElementById("canvas2")
      let ctx2 = canvas2.getContext("2d")
      let tempImgData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
      let data = tempImgData.data
      //Color=Xa-Xb+C (C常量，Xa后一个像素的RGB，Xb前一个像素的RGB)
      //其中color代表的是最后的色值，Xa和Xb代表的是当前像素前后两点的RGB（中的某一个值），C代表的是一个常量【根据你的具体需要来定】
      //原理就是将某个像素与周边的差值较大的检测出来，然后替换成为255，一般我们将这个常量C设置成为128【255的一半】
      // 其中常量的数值越大，浮雕的颜色越浅，反之加深
      for (let x = 0; x < tempImgData.width; x++) {
        for (let y = 0; y < tempImgData.height; y++) {
          // array的像素的索引
          let idx = (x + y * tempImgData.width) * 4;
          let r = data[idx + 0];
          let g = data[idx + 1];
          let b = data[idx + 2];
          let idx2 = (x + (y + 1) * tempImgData.width) * 4;
          let r2 = data[idx2 + 0];
          let g2 = data[idx2 + 1];
          let b2 = data[idx2 + 2];

          let fr = r2 - r + 128;
          let fg = g2 - g + 128;
          let fb = b2 - b + 128;
          let gray = .299 * fr + .587 * fg + .114 * fb;
          data[idx + 0] = gray; // Red channel
          data[idx + 1] = gray; // Green channel
          data[idx + 2] = gray; // Blue channel
          data[idx + 3] = 255; // Alpha channel
        }
      }
      ctx2.putImageData(tempImgData, 0, 0)
    },
    huanYuan() {//还原

      console.log("还原")
      let canvas2 = document.getElementById("canvas2")
      let context = canvas2.getContext("2d")
      context.restore()

      let id = this.$route.params.id//获取到之前的id
      if (id != null) {
        //根据id查询图片并加载给canvas
        request.post("/process/getById/" + id).then(res => {//获取对应图片

          let img = document.getElementById("img1")
          img.src = res.data.src

          img.onload = function () {//等图片加载后再操作
            context.drawImage(img, 0, 0, canvas2.width, canvas2.height);
          }
        })
      }
      context.save()
    },
    da() {//放大
      console.log("放大")
      let img = document.getElementById("img1")
      let canvas2 = document.getElementById("canvas2")
      let context = canvas2.getContext("2d")
      let tempImgData = context.getImageData(0, 0, canvas2.width, canvas2.height)
      let width = canvas2.width
      let height = canvas2.height

      //先平移
      context.transform(1, 0, 0, 1, -width / 2, -height / 2);
      //水平方向放大2倍，垂直方向放大2倍
      context.transform(2, 0, 0, 2, 0, 0);

      let id = this.$route.params.id//获取到之前的id
      if (id != null) {
        //根据id查询图片并加载给canvas
        request.post("/process/getById/" + id).then(res => {//获取对应图片

          let img = document.getElementById("img1")
          img.src = res.data.src

          img.onload = function () {//等图片加载后再操作
            context.drawImage(img, 0, 0, canvas2.width, canvas2.height);
          }
        })
      }

    },
    xuanZhuan() {//顺时针旋转
      console.log("顺时针旋转")
      //let img = document.getElementById("img1")
      let canvas2 = document.getElementById("canvas2")
      let context = canvas2.getContext("2d")
      let tempImgData = context.getImageData(0, 0, canvas2.width, canvas2.height)
      let width = canvas2.width
      let height = canvas2.height

      context.translate(width / 2, height / 2)
      context.rotate(Math.PI / 180 * 90)
      context.translate(-width / 2, -height / 2)

      let id = this.$route.params.id//获取到之前的id
      if (id != null) {
        //根据id查询图片并加载给canvas
        request.post("/process/getById/" + id).then(res => {//获取对应图片

          let img = document.getElementById("img1")
          img.src = res.data.src

          img.onload = function () {//等图片加载后再操作
            context.drawImage(img, 0, 0, canvas2.width, canvas2.height);
          }
        })
      }

    },
    suoFang(){
      console.log("任意角度旋转")
      let canvas=document.getElementById("canvas2")
      canvas.style.marginLeft="500px"//左移500px

      canvas = new fabric.Canvas("canvas2"); //声明画布
      let img = document.getElementById("img1");
      let image = new fabric.Image(img, {
        left: 30,
        top: 60,
      });
      canvas.add(image);

    },
    huiHua(){
      console.log("绘画")
      let canvas=document.getElementById("canvas2")
      canvas.style.marginLeft="500px"//左移500px

      canvas = new fabric.Canvas("canvas2"); //声明画布
      let img = document.getElementById("img1");
      let image = new fabric.Image(img, {
        left: 30,
        top: 60,
      });
      canvas.add(image);
      canvas.isDrawingMode = true

    }
  }
}
</script>


<style scoped>

#canvas2 {
  box-shadow: 5px 5px 5px #aaa;
  cursor: text;
  margin-left: 500px;
}
</style>
