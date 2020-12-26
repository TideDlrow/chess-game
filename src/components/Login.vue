<template>
  <div id="login">
    <div class="container">
      <div class="login-wrapper">
        <div class="header">{{ isLogin ? 'Login' : 'Register' }}</div>
        <div class="form-wrapper">
          <input v-model="username" type="text" name="username" placeholder="username" class="input-item">
          <input v-model="password" type="password" name="password" placeholder="password" class="input-item">
          <div class="btn" @click="clickLogin">{{ isLogin ? 'Login' : 'Register' }}</div>
        </div>
        <div class="msg" v-show="isLogin">
          Don`t have account? <a href="#" @click="clickRegister">Sign up</a>
        </div>
        <div class="msg" v-show="!isLogin">
          Existing account? <a href="#" @click="clickRegister">Sign in</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/network/request-api'
import { setToken } from '@/util/content'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      //登录注册都用同一个页面，用该属性来区分是登录还是注册
      isLogin: true,
    }
  },
  methods: {
    clickLogin () {
      const {
        username,
        password,
        isLogin
      } = this
      const _this = this
      if (username && password) {
        if (isLogin) {
          //如果是登录界面，则用登录接口
          login(username, password).then(data => {
            const {
              success,
              message
            } = data
            _this.handleLogin(success, message)
          })
        } else {
          //注册界面则用注册接口
          register(username, password).then(data => {
            const {
              success,
              message
            } = data
            _this.handleLogin(success, message)
          })
        }
      } else {
        this.$message.error('username or password can\'t be empty')
      }
    },
    clickRegister () {
      this.isLogin = !this.isLogin
    },
    handleLogin (success, message) {
      if (success) {
        //
        setToken(message)
      } else {
        this.$message.error(message)
      }
    }
  }
}
</script>

<style scoped>
#login {
  height: 100%;
  width: 100%;
}

* {
  padding: 0;
  margin: 0;
  font-family: 'Open Sans Light';
  letter-spacing: .05em;
}

.container {
  height: 100%;
  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
}

.login-wrapper {
  background-color: #fff;
  width: 250px;
  height: 500px;
  border-radius: 15px;
  padding: 0 50px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login-wrapper .header {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
}

.login-wrapper .form-wrapper .input-item {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  border: 0;
  padding: 10px;
  border-bottom: 1px solid rgb(128, 125, 125);
  font-size: 15px;
  outline: none;
}

.login-wrapper .form-wrapper .input-item::placeholder {
  text-transform: uppercase;
}

.login-wrapper .form-wrapper .btn {
  text-align: center;
  padding: 10px;
  width: 100%;
  margin-top: 40px;
  background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
  color: #fff;
}

.login-wrapper .msg {
  text-align: center;
  line-height: 80px;
}

.login-wrapper .msg a {
  text-decoration-line: none;
  color: #a6c1ee;
}

.btn:hover {
  cursor: pointer;
}
</style>
