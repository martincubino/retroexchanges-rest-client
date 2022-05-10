import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/reset.css';

import { ProgressPlugin, AlertPlugin, ModalPlugin, OverlayPlugin , BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(OverlayPlugin)

Vue.use(ModalPlugin)

Vue.use(AlertPlugin)

Vue.use(ProgressPlugin)

Vue.config.productionTip = false

require('@/plugins/fontawesome');

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
