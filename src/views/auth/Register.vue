<template>
    <!-- Form content component -->
    <form-content>
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Register - ' + appName"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="registerCheck()"
        >
            <v-text-field
                v-model="name"
                :rules="nameRules"
                hint="Enter your full name"
                color="black"
                label="Name"
                solo-inverted
                counter
                required
            ></v-text-field>
            <v-text-field
                v-model="email"
                :rules="emailRules"
                color="black"
                label="E-mail"
                hint="Enter a valid email"
                :error-messages="errorMessages"
                @keypress="errorMessage = ''"
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
                hint="At least 8 characters"
                solo-inverted
                required
                counter
                @click:append="showPassword = !showPassword"
            ></v-text-field>
            <!-- important links -->                
            <div class="mb-4">                       
                <p class="m-0">By signing in, I agree to ArticleShare <router-link to="/page/terms-of-service">Terms of Service</router-link> and <router-link to="/page/privacy-policy">Privacy Policy</router-link></p>
            </div>
            <!-- Register button -->
            <v-btn 
                block
                color="black white--text" 
                type="submit" 
                large 
                :disabled="!valid || loading"
                :loading="loading"
            >
                Register
            </v-btn>
        </v-form>
        <!-- vuetify form end -->
        <!-- login link -->
        <div class="m-3">
            <p class="text-center m-0">Already have an account? <router-link :to="{ name: 'Login' }">Login Now</router-link></p>
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
// import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Register',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            showPassword: false, // show password
            url: window.location.href, // get current URL
            favIconUrl: '', // set fav icon URL
            appName: '', // set aplication name
            description: '', // set aplication description
            keywords: [], // set aplication keywords
            name: '', // title name property
            nameRules: [ // validation rule
                v => !!v || 'Name is required',
                v => v.length >= 6 || 'Min 6 characters',
            ],
            email: '', // email name property
            emailRules: [ // validation rule
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            password: '', // password name property
            passwordRules: [ // validation rule
                v => !!v || 'Password is required',
                v => v.length >= 8 || 'Min 8 characters',
            ],
            errorMessage: '' // for error message
        }
    },
    computed: {
        // set error message
        errorMessages() {
            return this.errorMessage ? this.errorMessage : undefined
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
        // check register
        registerCheck() {
            this.loading = true // vuetify loading
            if(this.$refs.form.validate()) { // check form errors
                let storageRef = firebase.storage().ref('default-avatar.jpg') // get default avatar image form storage
                storageRef.getDownloadURL().then(url => { // get image user
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(cred => {
                        // set user information field
                        db.collection('users').doc(cred.user.uid).set({
                            name: this.name,
                            email: this.email,
                            username: cred.user.uid,
                            date: Date.now(),
                            role: 2,
                            status: 1,
                            bio: '',
                            totalArticles: 0,
                            avatar: url,
                            facebookUrl: '',
                            twitterUrl: '',
                            instagramUrl: '',
                            pinterestUrl: '',
                            githubUrl: ''
                        })
                        .then(() => {
                            this.loading = false // vuetify loading
                            // added a notification for admin
                            db.collection('notifications').add({
                                admin: true,
                                userId: cred.user.uid,
                                time: Date.now(), // javascript now() for current time & date
                                text: 'register a new user',
                                unseenAll: true // unseen by default true
                            })
                        })
                    })
                    .catch(err => {
                        this.errorMessage = err.message // set error message
                        this.loading = false // vuetify loading
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
