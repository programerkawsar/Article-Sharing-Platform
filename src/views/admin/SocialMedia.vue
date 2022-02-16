<template>
    <div class="social-media">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Social Media Settings - ' + appName"
        />
        <!-- Set HeadFul End -->
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="socialMediaupdate()"
        >
            <v-row>
                <v-col cols="12">
                    <v-input class="font-weight-bold">Social Media Links</v-input>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                        v-model="facebookURL"
                        :rules="[rules.required, rules.url]"
                        label="Facebook URL"
                        required
                        solo
                    ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                        v-model="twitterURL"
                        :rules="[rules.required, rules.url]"
                        label="Twitter URL"
                        required
                        solo
                    ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                        v-model="instagramURL"
                        :rules="[rules.required, rules.url]"
                        label="Instagram URL"
                        required
                        solo
                    ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                    <v-text-field
                        v-model="pinterestURL"
                        :rules="[rules.required, rules.url]"
                        label="Pinterest URL"
                        required
                        solo
                    ></v-text-field>
                </v-col>
            </v-row>
            <!-- Change button -->
            <div class="clearfix">
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
            Social media updated successfully 
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

export default {
    name: 'SocialMedia',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false,  // vuetify loading 
            appName: '',  // set aplication name
            facebookURL: '', // set facebookURL
            twitterURL: '', // set twitterURL
            instagramURL: '', // set instagramURL
            pinterestURL: '', // set pinterestURL
            snackbar: false, // vuetify snackbar
            timeout: 2000, // time out
            rules: { // validtion rules
                required: value => !!value || 'This field must required',
                url: value => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(value) || 'This is not a valid URL',
            }
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

        // get and set social media data from datebase
        db.collection('settings').doc('social-media')
        .onSnapshot(doc => {
            if(doc.exists) { // check data exists or not
                // when data exists then set data to data property
                this.facebookURL = doc.data().facebookURL
                this.twitterURL = doc.data().twitterURL
                this.instagramURL = doc.data().instagramURL
                this.pinterestURL = doc.data().pinterestURL
            }else {
                // when data not exists then set data empty to databse
                db.collection('settings').doc('social-media').set({
                    facebookURL: "",
                    twitterURL: "",
                    instagramURL: "",
                    pinterestURL: ""
                })
            }
        })
    },
    methods: {
        // update social media
        socialMediaupdate() {
            if(this.$refs.form.validate()) { // check form no error
                this.loading = true // vuetify loading
                // update data
                db.collection('settings').doc('social-media').update({
                    facebookURL: this.facebookURL,
                    twitterURL: this.twitterURL,
                    instagramURL: this.instagramURL,
                    pinterestURL: this.pinterestURL
                }).then(() => {
                    this.snackbar = true // vuetify snackbar
                    this.loading = false // vuetify loading
                })
            }
        }
    }
}
</script>

<style scoped>
/* Dark & Light theme input, textarea color */
.social-media .theme--light .v-input--is-focused input, .theme--light .v-input--is-focused textarea {
    color: white !important;
}
.social-media .theme--light .v-input input, .theme--light .v-input textarea {
    color: black;
}
.social-media .theme--dark .v-input--is-focused input, .theme--dark .v-input--is-focused textarea {
    color: black !important;
}
.social-media .theme--dark.v-input input, .theme--dark.v-input textarea {
    color: white;
}
</style>