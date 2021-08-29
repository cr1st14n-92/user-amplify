import Vue from 'vue'
import App from './App.vue'
import Amplify from 'aws-amplify';
import vuetify from './plugins/vuetify'
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
