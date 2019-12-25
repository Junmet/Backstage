<template>
<div>
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>文章管理</el-breadcrumb-item>
  <el-breadcrumb-item>文章发布</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 标题 -->
 <el-form ref="postForm" :model="postForm" label-width="80px">
  <el-form-item label="标题:">
    <el-input v-model="postForm.title"></el-input>
  </el-form-item>
 <!-- 单选框组 -->
  <el-form-item label="类型:">
    <el-radio-group v-model="postForm.type">
    <el-radio :label="1">文章</el-radio>
    <el-radio :label="2">视频</el-radio>
  </el-radio-group>
  </el-form-item>
 <!-- 富文本框 -->
  <el-form-item label="内容:">
    <div >
        <VueEditor :config="config" v-if="postForm.type===1" ref='vueEditor'/>
    </div>
    <!-- 文件上传 -->
    <!-- action:处理文件上传的服务器接口地址 -->
  <el-upload v-if="postForm.type===2" class="upload-demo"
   :headers="setToken()"
   action="http://localhost:3000/upload"
  :on-success="handlerSuccess"
  :before-upload = "beforeUpload"
   :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-form-item>
  <!-- 多选框 -->
  <el-form-item label="栏目:">
    <!-- v-model="checkAll":全选状态，true/false -->
 <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
  <div style="margin: 15px 0;"></div>
  <!-- v-model="checkedCities"   当前被选中的复选框的实际值的集合,在这个场合就是id集合 -->
  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
    <el-checkbox v-for="item in cateList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
  </el-checkbox-group>
  </el-form-item>
  <!-- 照片墙 -->
  <!-- 没有设置请求头的时候会报用户信息验证失败  说明要设置请求头附带token -->
  <el-form-item label="封面:">
  <el-upload action="http://localhost:3000/upload" :headers="setToken()"
  :on-success="coverImg" :before-upload = "coverbeforeUpload" list-type="picture-card" :on-remove="coverremove" :limit="3" :on-exceed="handleExceed">
  <i class="el-icon-plus"></i>
</el-upload>
  </el-form-item>
  <el-form-item>
      <el-button type="primary" @click="Publishsubmit">提交发布</el-button>
  </el-form-item>
  </el-form>
</el-card>
</div>
</template>

<script>
import VueEditor from 'vue-word-editor'
import 'quill/dist/quill.snow.css'
// 获取文章列表  接口
import { getCateList } from '@/api/cate'
// 发布文章
import { publishPost } from '@/api/article'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkedCities: [],
      cateList: [],
      postForm: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
      },
      config: {
      // 上传图片的配置
        uploadImage: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          // 发送请求头
          headers: this.setToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess (res, insert) {
            insert('http://localhost:3000' + res.data.data.url)
            // console.log(res)
          }
        },
        // 上传视频的配置
        uploadVideo: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          // 发送请求头
          headers: this.setToken(),
          uploadSuccess (res, insert) {
            insert('http://localhost:3000' + res.data.data.url)
            // console.log(res)
          }
        }
      },
      fileList: []
    }
  },
  methods: {
    // 设置请求头发送token
    setToken () {
      let token = localStorage.getItem('token')
      return {
        Authorization: token
      }
    },
    // 发布文章
    async Publishsubmit () {
      if (this.postForm.type === 1) {
        // console.log(this.$refs.vueEditor.editor.root.innerHTML)
        this.postForm.content = this.$refs.vueEditor.editor.root.innerHTML
      }
      // console.log(this.postForm)
      // 选中选项的id集合
      // console.log(this.checkedCities)

      // undefined 有定义未赋值
      // 参数要求来之接口
      // 所以要将选中的id集合添加到this.categories数组中  主要是获取全部表单内容数据去发送请求
      // console.log(this.categories)

      // 获取栏目的id的集合 push到接口文档的对应数组里面
      this.postForm.categories.length = 0
      this.checkedCities.forEach((item) => {
        // console.log('id:' + item)
        this.postForm.categories.push({ id: item })
        // console.log(this.postForm.categories)
      })
      console.log(this.postForm)

      let res = await publishPost(this.postForm)
      console.log(res)
      if (res.data.message === '文章发布成功') {
        this.$message.success(res.data.message)
        // 发布成功页面跳转
        this.$router.push({ path: '/postList' })
      }
    },
    // 全选和全不选
    handleCheckAllChange (val) {
      // val值为true,说明为全选状态，为false为全不选状态
      // console.log(val)
      this.checkedCities = val ? this.cateList.map((value) => {
        return value.id
      }) : []
      // 当前的状态不再是不确定的状态：全选，全不选
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      // value就是当前所有被选中的复选框的id集合--数组，就是this.checkedCities
      // console.log(value) = console.log(this.checkedCities)

      // 获取当前被选中的复选框的数量
      let checkedCount = value.length

      // 如果数量和源数据的数量一样，说明就是全选状态
      this.checkAll = checkedCount === this.checkedCities.length

      // 如果有选择，但是又没有全选，那么就是不确定的状态
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cateList.length
    },
    // 上传文件之前的钩子  上传之前来确认是否是视频文件
    beforeUpload (file) {
      // console.log(file)
      // 如果没有出现 'video/'  就行执行if里面的代码  有就正常上传
      if (file.type.indexOf('video/') === -1) {
        this.$message.warning('上传文件的格式有问题，请上传视频')
        return false
      }
    },
    // 文件上传成功时的钩子
    handlerSuccess (response, file, fileList) {
      // console.log(response)
      // 判断是否是视频上传  是才执行下面得代码
      if (this.postForm.type === 2) {
        this.postForm.content = response.data.url
      }
    },
    // 封面上传成功的函数
    coverImg (response, file, fileList) {
      // console.log(response)
      // 因为this.postForm.cover.是一个数组  所以可以用数组的方法  把id以对象的形式push添加到数组当中
      this.postForm.cover.push({ id: response.data.id })
      // console.log(this.postForm)
      // console.log(this.postForm.cover)
    },
    // 上传文件之前的钩子  上传之前来确认是否是图片格式的文件
    coverbeforeUpload (file) {
      // console.log(file)
      if (file.type.indexOf('image/') === -1) {
        this.$message.warning('上传文件的格式有问题，请上传图片')
        return false
      }
    },
    // 限制封面上传的图片张数
    handleExceed (files, fileList) {
      // console.log(files)
      // console.log(fileList)
      this.$message.warning('上传图片不得超过3张')
    },
    coverremove (file, fileList) {
      console.log(file)
      console.log(file.response.data.id)
      let id = file.response.data.id
      for (let i = 0; i < this.postForm.cover.length; i++) {
        // 每一条数据里面都有相应的id只要id相等就把对应的 id删除
        if (this.postForm.cover[i].id === id) {
          this.postForm.cover.splice(i, 1)
          break
        }
      }
    }
  },
  async mounted () {
    let res = await getCateList()
    // console.log(res)
    // 因为有可能是登录用户那样就会出现21个栏目多一个所以要把关注的栏目截取掉.splice(2)
    this.cateList = res.data.data.splice(2)
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px
}
</style>
