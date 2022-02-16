<template>
    <v-app>
      <!-- VueProgressBar plugin component -->
      <vue-progress-bar></vue-progress-bar>
      <!-- Navigation component -->
      <navigation v-if="!adminBar"></navigation>
      <v-content style="margin-top: 64px;">
        <!-- routerView component for show all page inside this v-content tag -->
        <router-view></router-view>
      </v-content>
      <v-divider class="m-0" v-if="$vuetify.theme.dark"></v-divider>
      <!-- AppFooter component -->
      <app-footer v-if="!adminBar"></app-footer>
    </v-app>
</template>

<script>
// Import lazy load component for Navigation, AppFooter
const Navigation = () => import('@/components/Navigation')
const AppFooter = () => import('@/components/Footer')
// Import firebase app
import firebase from 'firebase/app'
// Import firebase auth
import 'firebase/auth'
// Import firestore database
import db from '@/firebase/init'

export default {
  name: 'App',
  // This props for vuetify dark mode
  props: {
    attrs: {
      type: Object,
      default: () => ({}),
    },
  },
  data: vm => ({
    // Initialize vuetify dark mode data
    initialDark: vm.$vuetify
      ? vm.$vuetify.theme.dark
      : false,
      // Admin bar data property
      adminBar: false
  }),
  watch: { 
    // Check for admin panel
    '$route': function(val) {
      if(val.matched[0].name == "Admin") { // When route matched
        this.adminBar = true // Then Admin top bar show
      }else {
        this.adminBar = false // If not matched admin top bar hide
      }
    }
  },
  beforeDestroy() {
    // Initialize vuetify dark mode
    if (!this.$vuetify) return
    this.$vuetify.theme.dark = this.initialDark
  },
  mounted() {
    // [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish()
  },
  created() {
    // When user logged in
    if(this.$store.state.user.loggedIn) {
      // Check user active or not
      db.collection('users').doc(this.$store.state.user.data.uid).onSnapshot(doc => {
        if(doc.data().status != 1) {
            // When user has been disabled then signOut this user accoutn automaticly
            firebase.auth().signOut() 
        }
      })
    }

    // [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start()
    // Hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      // Does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // Parse meta tags
        this.$Progress.parseMeta(meta)
      }
      // Start the progress bar
      this.$Progress.start()
      // Continue to next page
      next()
    })
    // Hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      // Finish the progress bar
      this.$Progress.finish()
    })
  },
  components: {
    Navigation, // Navigation component
    AppFooter // Footer component
  }
}
</script>

<style>
/* VueProgressBar plugin background color */
.__cov-progress {background-color: #000 !important}
</style>
