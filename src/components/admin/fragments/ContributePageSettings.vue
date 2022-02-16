<template>
    <div>
        <!-- vuetify form -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="changeContributePageSettings()"
        >
            <v-row>
                <v-col cols="12">
                    <v-input class="font-weight-bold">Contribute Page Settings</v-input>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                >
                    <v-text-field
                        v-model="title"
                        :rules="[rules.required]"
                        label="Title"
                        required
                        solo
                    ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                >
                    <v-text-field
                        v-model="headLine"
                        :rules="[rules.required]"
                        label="Contribute Item Headline"
                        required
                        solo
                    ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                    <v-textarea
                        v-model="slogan"
                        :rules="[rules.required]"
                        solo
                        label="Slogan"
                    ></v-textarea>
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
            Contribute Page settings updated successfully 
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
    name: 'ContributePageSettings',
    data() {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            snackbar: false, // vuetify snackbar
            timeout: 2000, // snackbar timeout
            title: '', // title model
            headLine: '', // head line model
            slogan: '', // slogan model
            rules: { // validation rule
                required: value => !!value || 'This field must required',
            }
        }
    },
    created() {
        // get contribute page settings from database
        db.collection('settings').doc('contribute-page-settings').get()
        .then(doc => {
            if(doc.exists) { // check exists or not
                // set data to data property
                this.title = doc.data().title,
                this.headLine = doc.data().headLine,
                this.slogan = doc.data().slogan
            }else {
                // if data not exists then set data empty automatically
                db.collection('settings').doc('contribute-page-settings').set({
                    title: "Be A Part Of South Asia’s Biggest Content Revolution",
                    headLine: "Here’s why you should contribute to Roar Media",
                    slogan: "If you’ve got a unique story to tell, here’s your chance to be a part of South Asia’s biggest content platform."
                })
            }
        })
    },
    methods: {
        // update contribute page settings
        changeContributePageSettings() {
            if(this.$refs.form.validate()) { // check form no error
                this.loading = true // vuetify loading
                db.collection('settings').doc('contribute-page-settings').update({
                    title: this.title,
                    headLine: this.headLine,
                    slogan: this.slogan
                }).then(() => {
                    this.snackbar = true // vuetify snackbar
                    this.loading = false // vuetify loading
                })
            }
        }
    }
}
</script>