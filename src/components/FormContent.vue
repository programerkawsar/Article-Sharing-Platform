<template>
    <div class="form-content">
        <div class="middle">
            <!-- vuetify form -->
            <slot></slot>
            <!-- login with social media -->
            <div class="social-media text-center" v-if="this.$route.name != 'Reset' && this.$route.name != 'ContactUs'">
                <!-- facebook login -->
                <v-btn 
                    depressed 
                    small 
                    color="blue darken-3 white--text" 
                    class="mr-2"
                    :disabled="fbLoading"
                    :loading="fbLoading"
                    @click="facebookAuthentication()"
                >
                    <v-icon class="mr-1" small>mdi-facebook</v-icon> Facebook
                </v-btn>
                 <!-- google login -->
                <v-btn 
                    depressed 
                    small 
                    color="red darken-2 white--text" 
                    class="mr-2"
                    :disabled="gLoading"
                    :loading="gLoading"
                    @click="googleAuthentication()"
                >
                    <v-icon class="mr-1" small>mdi-google</v-icon> Google
                </v-btn>
                 <!-- twitter login -->
                <v-btn 
                    depressed 
                    small 
                    color="blue lighten-1 white--text"
                    :disabled="ttLoading"
                    :loading="ttLoading"
                    @click="twitterAuthentication()"
                >
                    <v-icon class="mr-1" small>mdi-twitter</v-icon> Twitter
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
// import firebase app
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'FormContent',
    data() {
        return {
            fbLoading: false, // facebook login button loading
            gLoading: false, // google login button loading
            ttLoading: false // twitter login button loading
        }
    },
    methods: {
        // facebook authentication
        facebookAuthentication() {
            this.fbLoading = true // vuetify loading
            var provider = new firebase.auth.FacebookAuthProvider()
            provider.setCustomParameters({
                'display': 'popup' // display with popup
            })
            firebase.auth().signInWithPopup(provider).then((result) => { // get user data
                this.saveUser(result, this.fbLoading) // call a function and passing data
            }).catch((error) => {
                this.fbLoading = false // vuetify loading
                var errorMessage = error.message // set error message
            })
        },

        // google authentication
        googleAuthentication() {
            this.gLoading = true // vuetify loading
            var provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider).then((result) => { // get user data
                this.saveUser(result, this.gLoading) // call a function and passing data
            }).catch((error) => {
                this.gLoading = false // vuetify loading
                var errorMessage = error.message // set error message
            })
        },

        // twitter authentication
        twitterAuthentication() {
            this.ttLoading = true // vuetify loading
            var provider = new firebase.auth.TwitterAuthProvider()
            firebase.auth().signInWithPopup(provider).then((result) => { // get user data
                this.saveUser(result, this.ttLoading) // call a function and passing data
            }).catch((error) => {
                this.ttLoading = false // vuetify loading
                var errorMessage = error.message // set error message
            })
        },

        // save user data to firebase firestore database
        saveUser(result, loading) { // get data form passing function
            var token = result.credential.accessToken // get user login token 
            db.collection('users').doc(result.user.uid).set({ // set data by user id
                name: result.user.displayName,
                email: result.user.email,
                username: result.user.uid,
                date: Date.now(),
                role: 2,
                status: 1,
                bio: '',
                totalArticles: 0,
                avatar: photoURL,
                facebookUrl: '',
                twitterUrl: '',
                instagramUrl: '',
                pinterestUrl: '',
                githubUrl: ''
            }).then(() => {
                loading = false // vuetify loading
                // set a notification for admin
                db.collection('notifications').add({
                    admin: true,
                    userId: result.user.uid,
                    time: Date.now(),
                    text: 'register a new user',
                    unseenAll: true
                })
            })
        }
    }
}
</script>

<style>
/* form style */
.form-content {display: table; height: 100%; margin: 0 auto;}
.middle {
    width: 350px;
    display: table-cell; 
    vertical-align: middle;
}
</style>