<template>
    <!-- Form content component -->
    <form-content>
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Login - ' + appName"
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
            type="error"
            icon="mdi-close"
            v-if="errorMessage"
        >
            {{ errorMessage }}
        </v-alert>
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="loginCheck()"
        >
            <v-text-field
                v-model="email"
                :rules="emailRules"
                color="black"
                label="E-mail"
                solo-inverted
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                color="black"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                solo-inverted
                required
                @click:append="showPassword = !showPassword"
            ></v-text-field>
            <!-- Forgot password link -->                
            <div class="clearfix mb-4">                       
                <div class="float-right">
                    <router-link :to="{ name: 'Recover' }">Forgot password?</router-link>
                </div>
            </div>
            <!-- Login button -->   
            <v-btn 
                block
                color="black white--text" 
                type="submit" 
                large 
                :disabled="!valid || loading"
                :loading="loading"
            >
                Login
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
const FormContent = () => import('@/components/FormContent')
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/firebase/init'

export default {
    name: 'Login',
    data() {
        return {
            valid: true,
            loading: false,
            showPassword: false,
            url: window.location.href,
            favIconUrl: '',
            appName: '',
            description: '',
            keywords: [],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
            ],
            errorMessage: ''
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
        // check login
        loginCheck() {
            if(this.$refs.form.validate()) { // check form errors
                var _this = this // this for use every inside function 
                this.loading = true // vuetify loading
                
                // check user account active or not
                db.collection('users').where('email', '==', this.email).onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if(change.doc.data().status == 1) { // check user status
                            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function(result){ 
                                _this.loading = false // vuetify loading
                            }).catch(function(error) {
                                _this.loading = false // vuetify loading
                                _this.errorMessage = error.message // set error message
                            })
                        }else {
                            // when user status disabled then user logout automatically
                            _this.loading = false // vuetify loading
                            firebase.auth().signOut().then(() => {
                                _this.errorMessage = "Your account has been disabled !" // set error message
                            })
                        }
                    })
                })
            }
        },
    },
    components: {
        FormContent // register component
    }
}
</script>
