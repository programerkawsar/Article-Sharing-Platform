import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
// Import bootstrap plugin
import './plugins/bootstrap-vue'
// Import App component for render
import App from './App.vue'
// Import vue router plugin
import router from './router'
// Import Vuex plugin
import store from './store'
// Import vuetify plugin
import vuetify from './plugins/vuetify'
// Import Vuebar plugin
import Vuebar from 'vuebar'
// Import firebase app
import firebase from 'firebase/app'
// Import firebase auth
import 'firebase/auth'
// Import vueHeadful plugin
import vueHeadful from 'vue-headful'
// Import VueProgressBar plugin
import VueProgressBar from 'vue-progressbar'
// Import VueScrollTo plugin
import VueScrollTo from 'vue-scrollto'
// Import mavonEditor plugin
import mavonEditor from 'mavon-editor'
// Import mavonEditor style css
import 'mavon-editor/dist/css/index.css'
// Import VueFileAgent plugin
import VueFileAgent from 'vue-file-agent'
// Import VueFileAgent style css
import 'vue-file-agent/dist/vue-file-agent.css'
// Import VueSocialSharing plugin
import VueSocialSharing from 'vue-social-sharing'

// Use Vuebar plugin for notification box scroll bar
Vue.use(Vuebar)
Vue.config.productionTip = false
// Use vueHeadful component for set page title and metatags dynamically
Vue.component('vue-headful', vueHeadful)
// Use VueProgressBar plugin for page loading progress
Vue.use(VueProgressBar)
// Use VueScrollTo plugin for comment section
Vue.use(VueScrollTo)
// Use mavonEditor plugin for markdown editor
Vue.use(mavonEditor)
// Use VueFileAgent plugin for upload images
Vue.use(VueFileAgent)
// Use VueSocialSharing plugin for social share button
Vue.use(VueSocialSharing)
// Set NODE_ENV production mode
Vue.config.performance = process.env.NODE_ENV !== "production"

// App letting by default null
let app = null

// Checking user logged in or not
firebase.auth().onAuthStateChanged(user => {
  // If user logged in then store user data on vuex store
  store.dispatch("fetchUser", user)
  if(!app) {
    new Vue({
      router, // Vue router
      store, // Vuex store
      vuetify, // Vuetify material design framework
      render: h => h(App)
    }).$mount('#app')
  }
})
