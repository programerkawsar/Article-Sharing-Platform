<template>
  <v-app id="inspire" v-if="admin">
    <!-- Appbar component -->
    <appbar></appbar>
    <main class="admin-app">
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <!-- routerView component for show all children page inside this v-content tag -->
          <router-view></router-view>
        </v-row>
      </v-container>
    </main>
  </v-app>
</template>

<script>
// Import lazy load component for Appbar
const Appbar = () => import('@/components/admin/Appbar')
// Import firestore database
import db from '@/firebase/init'

export default {
    name: 'Admin',
    data() {
        return {
            admin: false // check admin
        }
    },
    created() {
      db.collection('users').doc(this.$store.state.user.data.uid) // get uid from vuex
      .onSnapshot(snapshot => {
          if(snapshot.data().role == 1) { // check admin or not
            this.admin = true
          }else {
            this.admin = false
            this.$router.push({ name: 'Home' }) // if user not admin then redirect home
          }
      })
    },
    components: {
        Appbar // registe comoponent
    }
}
</script>

<style>
.admin-app {margin-top: -60px;}
a {text-decoration: none !important;}
</style>