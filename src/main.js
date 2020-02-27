import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import { API_URL } from '@/config'
import VueSocketIO from 'vue-socket.io'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = API_URL

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://localhost:3000'
}))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
