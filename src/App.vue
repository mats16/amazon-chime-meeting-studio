<template>
  <div id="app">
    <h2>Amazon Chime Meeting Studio (β)</h2>
    <div v-if="signedIn">
      <div id="nav">
        <el-menu mode="horizontal" router>
            <el-menu-item index="home" :route="{ name:'Home' }">Home</el-menu-item>
            <!--<el-menu-item index="about" :route="{ name:'About' }">About</el-menu-item>-->
            <el-menu-item index="settings" :route="{ name:'Settings' }">Settings</el-menu-item>
        </el-menu>
      </div>
      <router-view/>
    </div>
    <div v-else>
      <amplify-authenticator v-bind:authConfig="authConfig"/>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue'

export default {
  name: 'App',
  data() {
    return {
      signedIn: false,
      username: '',
      authConfig: {
        usernameAttributes: "email",
        signUpConfig: {
          hiddenDefaults: ["phone_number"]
        }
      }
    }
  },
  created () {
    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => {
        this.signedIn = true
        this.username = cognitoUser.username
      })
      .catch(() => {
        this.signedIn = false
      });
    AmplifyEventBus.$on('authState', async  info => {
      if (info === 'signedIn') {
        Auth.currentAuthenticatedUser()
          .then((cognitoUser) => {
            this.signedIn = true
            this.username = cognitoUser.username
          });
      } else {
        this.signedIn = false
      }
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
  
#nav {
  padding: 30px;
}
  
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
  
.amplify-sign-out {
  float: right;
}

.auth_container {
  text-align: center;
  margin: 30px;
}

.authenticator {
  text-align: center;
  margin: 30px;
}
</style>
