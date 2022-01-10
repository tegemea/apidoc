import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import VueSweetalert2 from 'vue-sweetalert2';
import VueRouter from 'vue-router';
import Axios from 'axios'
import Vuelidate from 'vuelidate';
import jQuery from 'jquery'


import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false

Vue.prototype.$axios = Axios;
Vue.prototype.$jquery = jQuery;

// import components for use in routes
import Dashboard from '@/components/Dashboard'
import Applications from '@/components/Applications'

const routes = [
  { path:'/', redirect: '/dashboard' },
  { path:'/dashboard', component: Dashboard },
  { path:'/applications', component: Applications },
]

const router = new VueRouter({
  routes
})

Vue.use(VueSweetalert2)
Vue.use(VueRouter)
Vue.use(Vuelidate)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
