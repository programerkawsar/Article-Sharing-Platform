<template>
    <div>
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="changeSettings()"
        >
            <v-row>
                <v-col cols="12">
                    <v-input class="font-weight-bold">General Settings</v-input>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4">
                    <v-tooltip bottom>
                        <!-- image view -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-img :src="logoUrl" alt="Logo" v-bind="attrs" v-on="on" width="100"></v-img>
                        </template>
                        <span>Logo</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4">
                    <v-tooltip bottom>
                        <!-- image view -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-img :src="whiteLogoUrl" v-bind="attrs" v-on="on" alt="White Logo" width="100"></v-img>
                        </template>
                        <span>White Logo</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4">
                    <v-tooltip bottom>
                        <!-- image view -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-img :src="favIconUrl" alt="Fav Icon" v-bind="attrs" v-on="on" width="100"></v-img>
                        </template>
                        <span>Icon</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4" class="mb-4">
                    <!-- VueFileAgent plugin -->
                    <VueFileAgent
                        ref="vueFileAgent"
                        :theme="'list'"
                        :multiple="false"
                        :deletable="true"
                        :meta="true"
                        :accept="'image/*'"
                        :maxSize="'2MB'"
                        :maxFiles="1"
                        :helpText="'Change Logo Image'"
                        :errorText="{
                            type: 'Invalid file type. Only images',
                            size: 'Files should not exceed 2MB in size',
                        }"
                        v-model="fileRecordLogo"
                    ></VueFileAgent>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4" class="mb-4">
                    <!-- VueFileAgent plugin -->
                    <VueFileAgent
                        ref="vueFileAgent"
                        :theme="'list'"
                        :multiple="false"
                        :deletable="true"
                        :meta="true"
                        :accept="'image/*'"
                        :maxSize="'2MB'"
                        :maxFiles="1"
                        :helpText="'Change White Logo'"
                        :errorText="{
                            type: 'Invalid file type. Only images',
                            size: 'Files should not exceed 2MB in size',
                        }"
                        v-model="fileRecordWhiteLogo"
                    ></VueFileAgent>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4" class="mb-4">
                    <!-- VueFileAgent plugin -->
                    <VueFileAgent
                        ref="vueFileAgent"
                        :theme="'list'"
                        :multiple="false"
                        :deletable="true"
                        :meta="true"
                        :accept="'image/*'"
                        :maxSize="'2MB'"
                        :maxFiles="1"
                        :helpText="'Change Fav Icon'"
                        :errorText="{
                            type: 'Invalid file type. Only images',
                            size: 'Files should not exceed 2MB in size',
                        }"
                        v-model="fileRecordIcon"
                    ></VueFileAgent>
                </v-col>
                <v-col
                    cols="12" xs="12" sm="6" md="6" lg="6" xl="6"
                >
                    <v-text-field
                        v-model="appName"
                        :rules="[rules.required]"
                        label="App name"
                        required
                        solo
                    ></v-text-field>
                </v-col>

                <v-col
                    cols="12" xs="12" sm="6" md="6" lg="6" xl="6"
                >
                    <v-text-field
                        v-model="appTitle"
                        :rules="[rules.required]"
                        label="App title"
                        required
                        solo
                    ></v-text-field>
                </v-col>
            </v-row>
            <div class="clearfix">
                <!-- submit button -->
                <div class="float-right">
                    <v-btn 
                        color="primary" 
                        type="submit"
                        :disabled="!valid || loading"
                        :loading="loading"
                    >
                        Change
                    </v-btn>
                </div>
            </div>
        </v-form>
        <!-- vuetify form end -->
        <!-- vuetify snackbar -->
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            General settings updated successfully 
            <template>
                <v-btn
                    color="error"
                    text
                    @click="snackbar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
// import firebase database
import db from '@/firebase/init'
// import firebase app
import firebase from 'firebase/app'
// import firebase storage
import 'firebase/storage'

export default {
    name: 'GeneralSettings',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            fileRecordLogo: [], // logo image
            fileRecordWhiteLogo: [], // white logo image
            fileRecordIcon: [], // fav icon
            logoUrl: '', // store logo URL
            whiteLogoUrl: '', // store white logo URL
            favIconUrl: '', // store fav icon URL
            appName: '', // set application name
            appTitle: '', // set application title
            snackbar: false, // vuetify snackbar
            timeout: 2000, // snackbar timeout
            rules: {  // validation rule
                required: value => !!value || 'This field must required',
            },
        }
    },
    created() {
        // get general settings from database
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            if(doc.exists) { // check exists or not
                // set data to data property
                this.logoUrl = doc.data().logo
                this.whiteLogoUrl = doc.data().whiteLogo
                this.favIconUrl = doc.data().favIcon
                this.appName = doc.data().appName
                this.appTitle = doc.data().appTitle
            }else {
                // if data not exists then set default data automatically       
                firebase.storage().ref('logo.svg').getDownloadURL().then((logoURL) => {
                    firebase.storage().ref('white-logo.svg').getDownloadURL().then((whiteLogoURL) => {
                        firebase.storage().ref('favicon.png').getDownloadURL().then((faviconURL) => {
                            db.collection('settings').doc('general-settings').set({
                                appName: "your app name",
                                appTitle: "your app title",
                                favIcon: faviconURL,
                                logo: logoURL,
                                whiteLogo: whiteLogoURL
                            })
                        })
                    })
                })
            }
        })
    },
    methods: {
        // update settings
        changeSettings() {
            if(this.$refs.form.validate()) { // check form no error
                this.loading = true // vuetify loading

                this.changeLogo() // call a function
                this.changeWhiteLogo() // call a function
                this.changeFavIcon() // call a function
                
                if(!this.fileRecordLogo[0] && !this.fileRecordWhiteLogo[0] && !this.fileRecordIcon[0]) { // check file not exists
                    db.collection('settings').doc('general-settings').update({
                        appName: this.appName,
                        appTitle: this.appTitle
                    }).then(() => {
                        this.snackbar = true // vuetify snackbar
                        this.loading = false // vuetify loading
                    })
                }
            }
        },
        // change only logo
        changeLogo() {
            if(this.fileRecordLogo[0]) { // if has logo
                var httpsReference = firebase.storage().refFromURL(this.logoUrl) // get image form storage
                
                let file = this.fileRecordLogo[0].file // get file
                let fileName = httpsReference.name // get file name
                let storageRef = firebase.storage().ref(fileName)
                storageRef.put(file).then(res => {
                    res.ref.getDownloadURL().then((imageUrl) => { // get image url
                        this.updateGeneralSettings(imageUrl, this.fileRecordLogo) // call a function and passing data
                    })
                })
            }
        },
        // change only white logo
        changeWhiteLogo() {
            if(this.fileRecordWhiteLogo[0]) { // if has white logo
                var httpsReference = firebase.storage().refFromURL(this.whiteLogoUrl) // get image form storage
                        
                let file = this.fileRecordWhiteLogo[0].file // get file
                let fileName = httpsReference.name // get file name
                let storageRef = firebase.storage().ref(fileName)
                storageRef.put(file).then(res => {
                    res.ref.getDownloadURL().then((imageUrl) => { // get image url
                        this.updateGeneralSettings(imageUrl, this.fileRecordWhiteLogo) // call a function and passing data
                    })
                })
            } 
        },
        // change only fav icon
        changeFavIcon() {
            if(this.fileRecordIcon[0]) { // if has white logo
                var httpsReference = firebase.storage().refFromURL(this.favIconUrl) // get image form storage
                
                let file = this.fileRecordIcon[0].file // get file
                let fileName = httpsReference.name // get file name
                let storageRef = firebase.storage().ref(fileName)
                storageRef.put(file).then(res => {
                    res.ref.getDownloadURL().then((imageUrl) => { // get image url
                        this.updateGeneralSettings(imageUrl, this.fileRecordIcon) // call a function and passing data
                    })
                })
            } 
        },
        // update general settings
        updateGeneralSettings(imageUrl, data) { // get data from passing function
            db.collection('settings').doc('general-settings').update({
                favIcon: imageUrl,
                appName: this.appName,
                appTitle: this.appTitle
            }).then(() => {
                this.snackbar = true // vuetify snackbar
                this.loading = false // vuetify loading
                data = [] // set data empty
            })
        }
    }
}
</script>

<style scoped>
/* vueFileAgent plugin style */
.vue-file-agent.has-multiple .file-preview, .vue-file-agent.is-single .is-deletable .file-preview {
    z-index: 1;
}
</style>