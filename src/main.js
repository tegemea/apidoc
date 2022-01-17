import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import VueSweetalert2 from 'vue-sweetalert2';
import VueRouter from 'vue-router';
import Axios from 'axios'
import Vuelidate from 'vuelidate';
import jQuery from 'jquery'
import Lodash from 'lodash'


import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false

Vue.prototype.$axios = Axios;
Vue.prototype.$jquery = jQuery;
Vue.prototype.$_ = Lodash;

// basic global variables
Vue.prototype.$baseServerURL = 'http://192.168.1.6'
Vue.prototype.$apiURL = `http://192.168.1.6/api_doc`

// import components for use in routes
import Dashboard from '@/components/Dashboard'
import Applications from '@/components/Applications'
import Modules from '@/components/Modules'
import Terminals from '@/components/Terminals'
import TerminalParameters from '@/components/TerminalParameters'
import HttpCodes from '@/components/HttpCodes'
import TerminalExamples from '@/components/TerminalExamples'
import Tables from '@/components/Tables'
import TableFields from '@/components/TableFields'

const routes = [
  { path:'/', redirect: '/dashboard' },
  { path:'/dashboard', component: Dashboard },
  { path:'/applications', component: Applications },
  { path:'/modules', component: Modules },
  { path:'/terminals', component: Terminals },
  { path:'/terminal-parameters', component: TerminalParameters },
  { path:'/http-codes', component: HttpCodes },
  { path:'/terminal-examples', component: TerminalExamples },
  { path:'/tables', component: Tables },
  { path:'/table-fields', component: TableFields },
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
