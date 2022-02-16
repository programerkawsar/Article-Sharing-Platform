<template>
    <form-content>
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Contact Us - ' + appName"
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
            @submit.prevent="sendMessage()"
        >
            <v-text-field
                v-model="name"
                :rules="nameRules"
                color="black"
                label="Name"
                solo-inverted
                required
            ></v-text-field>
            <v-text-field
                v-model="email"
                :rules="emailRules"
                color="black"
                label="E-mail"
                solo-inverted
                required
            ></v-text-field>
            <v-textarea
                v-model="message"
                :rules="messageRules"
                color="black"
                label="Write Message"
                @keypress="btnDisabled = false"
                solo-inverted
                rows="5"
            ></v-textarea>
            <!-- send button -->
            <v-btn 
                block 
                color="black white--text" 
                type="submit" 
                large 
                :disabled="!valid || loading || btnDisabled"
                :loading="loading"
            >Send Message</v-btn>
        </v-form>
        <!-- vuetify form end -->
        <!-- vuetify snackbar -->
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            Details updated successfully
            <v-btn
                color="error"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </form-content>
</template>

<script>
// Import lazy load component for FormContent
const FormContent = () => import('@/components/FormContent')
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'ContactUs',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            snackbar: false, // vuetify snackbar
            timeout: 2000, // set timeout
            url: window.location.href, // get current URL
            btnDisabled: false, // button disabled
            favIconUrl: '', // set fav icon URL
            appName: '', // set aplication name
            description: '', // set description
            keywords: [], // set keywords
            name: '', // name data proparty
            nameRules: [ // validtion rule
                v => !!v || 'Name is required',
            ],
            email: '', // email data proparty
            emailRules: [ // validtion rule
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            message: '', // message data proparty
            messageRules: [ // validtion rule
                v => !!v || 'Message is required',
            ]
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.favIconUrl = doc.data().favIcon
            this.appName = doc.data().appName
        })

        // get seo settings from datebase
        db.collection('settings').doc('seo').get()
        .then(doc => {
            this.description = doc.data().description,
            this.keywords = doc.data().keywords
        })
    },
    methods: {
        // send message
       sendMessage() {
           this.loading = true // vuetify loading
           if(this.$refs.form.validate()) {
               // added to databse
                db.collection('messages').add({
                    name: this.name,
                    email: this.email,
                    message: this.message,
                    time: Date.now(),
                }).then(() => {
                    if(this.$store.state.user.loggedIn) {
                        this.sendNotification(this.$store.state.user.data.uid) // call a function and pass uid form vuex
                    }else {
                        this.sendNotification(this.name) // call a function
                    }

                    this.btnDisabled = true // button disabled set true
                    this.snackbar = true // vuetify snackbar
                    this.loading = false // vuetify loading
                })
           }    
       },
       // send notification
       sendNotification(data) {
           // added notification
           db.collection('notifications').add({
                admin: true,
                userId: data,
                time: Date.now(),
                text: 'send a new message',
                unseenAll: true
            })
       }
    },
    components: {
        FormContent // register component
    }
}
</script>
