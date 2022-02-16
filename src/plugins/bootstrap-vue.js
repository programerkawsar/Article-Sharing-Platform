import Vue from 'vue'
// import vue bootstrap library
// use pacific component form vue bootstrap library
import { BMedia, BJumbotron, VBToggle, BCollapse } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// register components
Vue.component('b-media', BMedia)
Vue.component('b-jumbotron', BJumbotron)
Vue.directive('b-toggle', VBToggle)
Vue.component('b-collapse', BCollapse)
