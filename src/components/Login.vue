<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="">
      </div>

      <!--登录表单区域-->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btn-right">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                // 表单验证规则
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 5, max: 12, message: '长度在5-12位', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 5, max: 12, message: '长度在5-12位', trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            async login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    }
                    let {data} = await this.$http.post('/login', this.loginForm);
                    if (data.meta.status !== 200) {
                        this.$message.error("登陆失败: " + data.meta.msg);
                    } else {
                        this.$message.success("登陆成功");
                        window.sessionStorage.setItem("token", data.data.token);
                        this.$router.push("/home");
                    }
                });
            },
            reset() {
                this.$refs.loginFormRef.resetFields();
            }
        }

    }
</script>

<style scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .login-box .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .avatar-box img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .btn-right {
    display: flex;
    justify-content: flex-end;
  }

  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

</style>
