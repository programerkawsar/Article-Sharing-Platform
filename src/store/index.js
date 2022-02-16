import Vue from 'vue'
// import vuex
import Vuex from 'vuex'
// Import firestore database
import db from '@/firebase/init'

Vue.use(Vuex) // use vuex

// setup vuex store
export default new Vuex.Store({
  state: {
    // store data
    user: {
      loggedIn: false,
      data: null,
    }
  },
  getters: {
    // get user data form state
    user(state){
      return state.user
    }
  },
  mutations: {
    // set user data
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value // set logged in true/false
    },
    SET_USER(state, data) {
      state.user.data = data // set data
        if(state.user.data) {
          // set user rule and username form database
          db.collection("users").doc(state.user.data.uid) // get uid form state
          .onSnapshot(function(querySnapshot) {
            state.user.data.username = querySnapshot.data().username
            state.user.data.role = querySnapshot.data().role
          })
      }
    }
  },
  actions: {
    // fetch user data and commit
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null)
      if (user) { // check user
        // commit user
        commit("SET_USER", {
          uid: user.uid,
          username: user.username,
          email: user.email,
          role: user.role
        });
      } else {
        commit("SET_USER", null)
      }
    }
  }
})
