import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ja';

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import '@aws-amplify/ui-vue';
import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  graphql_headers: async () => {
    try {
      const token = (await AmplifyModules.Auth.currentSession()).idToken.jwtToken;
      return { Authorization: token }
    }
    catch (e) {
        console.error(e);
        return {};
    }
  }
});
Vue.use(AmplifyPlugin, AmplifyModules);

Vue.config.productionTip = false
Vue.use(ElementUI, { locale });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
