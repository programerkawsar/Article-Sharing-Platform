<template>
    <!-- Form content component -->
    <form-content>
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Recover - ' + appName"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- vuetify alert for firebase error -->
        <v-alert
            text
            prominent
            :type="alert.type"
            :icon="alert.icon"
            v-if="errorMessage"
        >
            {{ errorMessage }}
        </v-alert>
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="recoverCheck()"
        >
            <v-text-field
                v-model="email"
                :rules="emailRules"
                color="black"
                label="E-mail"
                solo-inverted
                required
            ></v-text-field>  
            <!-- Recover button -->         
            <v-btn 
                block
                color="black white--text" 
                type="submit" 
                large 
                :disabled="!valid || loading"
                :loading="loading"
            >
                Recover
            </v-btn>
        </v-form>
        <!-- vuetify form end -->
        <!-- register link -->
        <div class="m-3">
            <p class="text-center m-0">Don't have an account? <router-link :to="{ name: 'Register' }">Create One</router-link></p>
        </div>
    </form-content>
    <!-- Form content component end -->
</template>

<script>
// Import lazy load component for FormContent
const FormContent = () => import('@/components/FormContent')
// import firebase app
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Recover',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            url: window.location.href, // get current URL
            favIconUrl: '', // set fav icon URL
            appName: '', // set aplication name
            description: '', // set aplication description
            keywords: [], // set aplication keywords
            email: '', // email name property
            emailRules: [ // validation rule
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            alert: { // vuetify alert
                type: 'error',
                icon: 'mdi-close'
            },
            errorMessage: '' // error message
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.favIconUrl = doc.data().favIcon
            this.appName = doc.data().appName
        })

        // get seo settings data from datebase
        db.collection('settings').doc('seo').get()
        .then(doc => {
            this.description = doc.data().description,
            this.keywords = doc.data().keywords
        })
    },
    methods: {
        // check recover
        recoverCheck() {
            if(this.$refs.form.validate()) { // check no error
                var _this = this // this for use every inside function 
                this.loading = true // vuetify loading
                const auth = firebase.auth()
                auth.sendPasswordResetEmail(this.email).then(function() {
                    _this.loading = false // vuetify loading
                    _this.alert.type = 'success' // vuetify alert type
                    _this.alert.icon = 'mdi-check' // vuetify alert icon
                    // set error message
                    _this.errorMessage = 'Password reset link successfully sent on your email please check your inbox'
                }).catch(function(error) {
                    _this.loading = false // vuetify loading
                    _this.alert.type = 'error' // vuetify alert type
                    _this.alert.icon = 'mdi-close' // vuetify alert icon
                    _this.errorMessage = error.message // set error message
                })
            }
        },
    },
    components: {
        FormContent // register component
    }
}
</script>
