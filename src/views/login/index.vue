<script setup>
import {ref} from 'vue'
import {loginApi,registerApi} from '@/api/login'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'

let loginForm = ref({username: '', password: ''})
const registerForm = ref({
  username: '',
  password: '',
  email: '',
})
const gender = ref();
// genderList 是一个选项数组
const genderList = ref([
  { name: "男", value: "1" },
  { name: "女", value: "2" },
  { name: "沃尔玛购物袋", value: "3" }
])
let router = useRouter()

// 登录
const login = async () => {
  try {
    // 成功时，拦截器会直接返回 response.data
    const result = await loginApi(loginForm.value)
    console.log('登录接口返回：', result)

    // 这里一定有 accessToken，直接认为登录成功
    ElMessage.success('登录成功')
    const loginUser = {
      token: result.accessToken,
      username: result.username,
    }
    localStorage.setItem('loginUser', JSON.stringify(loginUser))
    router.push('/index')  // 跳转
  } catch (errData) {
    // 走到这里说明 HTTP 返回了非 2xx，errData 就是后端返回的 data
    console.log('登录失败返回：', errData)
    // 假设后端返回 { message: "xxx" } 或 { msg: "xxx" }
    ElMessage.error(errData.message || errData.msg || '登录失败')
  }
}

//取消
const cancel = () => {
  loginForm.value = {
    username: '',
    password: ''
  }
}

const dialogRegisterVisible = ref(false);

const register = async () => {
  try {
    // 成功时，这里拿到的就是后端接口返回的 data 对象
    const result = await registerApi(registerForm.value)
    console.log('注册接口返回：', result)

    // 既然能执行到这里，就说明 HTTP 走的是 2xx，注册成功
    ElMessage.success('注册成功')
    dialogRegisterVisible.value = false

    const loginUser = {
      token: result.accessToken,
      username: result.username,
    }
    localStorage.setItem('loginUser', JSON.stringify(loginUser))

    router.push('/index')
  } catch (errData) {
    // 走到这里说明 HTTP 返回了非 2xx，errData 就是后端返回的 data
    console.log('注册失败返回：', errData)
    // 假设后端返回 { message: "Error: Username is already taken!" }
    ElMessage.error(errData.message || '注册失败')
  }
}



</script>

<template>
  <!--登录页面 -->
  <div id="container">
    <div class="login-form">
      <el-form label-width="80px">
        <p class="title">security与jwt学习demo</p>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="button" type="primary" @click="login">登 录</el-button>
          <el-button class="button" type="info" @click="cancel">重 置</el-button>
          <el-button class="button" type="primary" @click="dialogRegisterVisible = true">
            注 册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

  <!--注册页面对话框  -->
  <el-dialog v-model="dialogRegisterVisible" title="赶紧给我注册啊文子哥" width="500">
    <el-form :model="registerForm">
      <el-form-item label="用户名">
        <el-input v-model="registerForm.username" placeholder="请输入文子哥"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="registerForm.password" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="gender" placeholder="请选择你的性别">
          <el-option v-for="g in genderList"  :label="g.name" :value="g.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogRegisterVisible  = false">Cancel</el-button>
        <el-button type="primary" @click="register">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
#container {
  padding: 10%;
  height: 410px;
  background-image: url('../../assets/bg1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.login-form {
  max-width: 400px;
  padding: 30px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: white;
}

.title {
  font-size: 30px;
  font-family: '楷体';
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
}

.button {
  margin-top: 30px;
  width: 120px;
}
</style>