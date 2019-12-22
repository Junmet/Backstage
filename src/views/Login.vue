<template>
  <div class="login">
    <div class="container">
        <img src="../assets/avatar.jpg" alt="" class="avatar">
        <!-- @keyup.enter.native事件绑定回车事件，出现点击回车后，浏览器会刷新页面的问题； -->
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm" @keyup.enter.native="login">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable prefix-icon="icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入6~16位的密码" clearable prefix-icon="icon-key" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
        </el-form-item>
          <el-switch style="display: block" v-model="value4" active-color="#13ce66" inactive-color="#ff4949"
            active-text="按月付费登录"
            inactive-text="按年付费登录">
          </el-switch>
      </el-form>

    </div>
  </div>
</template>

<script>
import { userLogin } from '@/api/user'
export default {
  data () {
    return {
      loginForm: {
        username: '10086',
        password: '123123123'
      },
      value4: true,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6~16位密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          console.log('数据格式正确，发送请求，登录')
          let res = await userLogin(this.loginForm)
          console.log(res)
          if (res.data.message === '登录成功') {
            this.$message.success(res.data.message)
            // 本地存储token 使用导航守卫判断
            localStorage.setItem('token', res.data.data.token)
            // 跳转首页
            this.$router.push({ path: '/' })
          } else if (res.data.message === '用户不存在') {
            this.$message.warning(res.data.message)
          }
        } else {
          // console.log('你输入的数据格式不正确')
          this.$message.error('你输入的数据格式不正确')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
.el-switch{
  text-align: center
}
</style>
