<template>
    <div class="admin-seo">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'SEO Settings - ' + appName"
        />
        <!-- Set HeadFul End -->
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="changeSEOSettings()"
        >
            <v-row>
                <v-col cols="12">
                    <v-input class="font-weight-bold">SEO Settings</v-input>
                </v-col>
                <v-col
                    cols="12" xs="12" sm="6" md="6" lg="6" xl="6"
                >
                    <v-text-field
                        v-model="author"
                        :rules="[rules.required]"
                        label="Author"
                        required
                        solo
                    ></v-text-field>
                </v-col>
                <v-col
                    cols="12" xs="12" sm="6" md="6" lg="6" xl="6"
                >
                    <v-combobox
                        v-model="keywords"
                        hide-selected
                        label="Keywords"
                        append-icon=""
                        multiple
                        small-chips
                        solo
                    ></v-combobox>
                </v-col>
                <v-col
                    cols="12"
                >
                    <v-textarea
                        v-model="description"
                        :rules="[rules.required]"
                        solo
                        label="Description"
                    ></v-textarea>
                </v-col>
            </v-row>
            <!-- Change Button -->
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
            SEO settings updated successfully 
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
    name: 'SEO',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify button loading 
            snackbar: false, // vuetify snackbar
            timeout: 2000, // snackbar timeout
            appName: '', // set aplication name
            author: '', // aplication author
            description: '', // aplication description
            keywords: [], // aplication keywords
            rules: { // validtion rules
                required: value => !!value || 'This field must required',
            }
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

        // get seo settings from datebase
        db.collection('settings').doc('seo').get()
        .then(doc => {
            if(doc.exists) { // check empty
                // assign data
                this.author = doc.data().author,
                this.description = doc.data().description,
                this.keywords = doc.data().keywords
            }else {
                // if no items found then set defualt seo settings empty
                db.collection('settings').doc('seo').set({
                    author: "",
                    description: "",
                    keywords: []
                })
            }
        })
    },
    methods: {
        // update SEO settings
        changeSEOSettings() {
            if(this.$refs.form.validate()) {
                this.loading = true // vuetify loading
                // update seo
                db.collection('settings').doc('seo').update({
                    author: this.author,
                    description: this.description,
                    keywords: this.keywords
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
.admin-seo {
    width: 100%;
    padding-left: 30px;
}  
</style>