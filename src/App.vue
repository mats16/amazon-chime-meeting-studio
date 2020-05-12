<template>
  <div id="app">
    <h1>Amazon Chime Broadcast Console</h1>
    <amplify-authenticator username-alias="email">
      <amplify-sign-up slot="sign-up" username-alias="email" :form-fields.prop="formFields"></amplify-sign-up>
      <div class="amplify-sign-out">
        <amplify-sign-out></amplify-sign-out>
      </div>
      <div id="nav">
        <el-menu mode="horizontal" router>
            <el-menu-item index="home" :route="{ name:'Home' }">Home</el-menu-item>
            <el-menu-item index="about" :route="{ name:'About' }">About</el-menu-item>
        </el-menu>
      </div>
      <router-view/>
    </amplify-authenticator>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      formFields: [
        {
          type: 'email',
          label: 'Email Address',
          placeholder: 'Email',
          required: true,
        },
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Password',
          required: true,
        },
      ]
    }
  }
}
</script>

<!--
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
-->
<style src="./assets/style.css" />
