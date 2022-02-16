<template>
    <div class="add-article-page">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Add Article Page Settings - ' + appName"
        />
        <!-- Set HeadFul End -->
        <!-- container start -->
        <v-container>
            <!-- vuetify form -->
            <v-form @submit.prevent="changeSettings()">
                <v-row>
                    <v-col cols="12">
                        <v-input class="font-weight-bold">Add Article Page Settings</v-input>
                    </v-col>
                    <v-col cols="12" class="mark-down-editor">
                         <!-- mavon-editor plugin -->
                        <mavon-editor
                            v-model="welcomeText"
                            :placeholder="'Write welcome text'" 
                            :language="'en'" 
                            :ishljs="true"
                            :toolbars="markdownOption"
                        >
                        </mavon-editor>
                    </v-col>
                    <v-col cols="12" class="mark-down-editor">
                         <!-- mavon-editor plugin -->
                        <mavon-editor
                            v-model="guidelines"
                            :placeholder="'Write guidelines'" 
                            :language="'en'" 
                            :ishljs="true"
                            :toolbars="markdownOption"
                        >
                        </mavon-editor>
                    </v-col>
                    <v-col cols="12" class="mark-down-editor">
                        <!-- mavon-editor plugin -->
                        <mavon-editor
                            v-model="thankYouText"
                            :placeholder="'Write thank you text'" 
                            :language="'en'" 
                            :ishljs="true"
                            :toolbars="markdownOption"
                        >
                        </mavon-editor>
                    </v-col>
                </v-row>
                <!-- vuetify change button -->
                <div class="clearfix">
                    <div class="text-center">
                        <v-btn 
                            color="primary" 
                            type="submit"
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
        </v-container>
        <!-- container end -->
    </div>
</template>

<script>
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'AddArticlePage',
    data() {
        return {
            loading: false, // vuetify loading button
            appName: '', // set aplication name
            welcomeText: '', // set welcome text
            guidelines: '', // set guidelines
            thankYouText: '', // set thank you text
            snackbar: false, // vuetify snackbar
            timeout: 2000, // snackbar time out
            // markdown editor options
            markdownOption: {
                bold: true,
                italic: true,
                header: true,
                underline: false,
                strikethrough: false,
                mark: false,
                superscript: false,
                subscript: false,
                quote: true,
                ol: true,
                ul: true,
                link: false,
                imagelink: false,
                code: false, 
                table: false, 
                fullscreen: true, 
                readmodel: true, 
                htmlcode: false, 
                help: false, 
                undo: false, 
                redo: false, 
                trash: false, 
                save: false, 
                navigation: false, 
                alignleft: true, 
                aligncenter: true, 
                alignright: true, 
                subfield: false, 
                preview: true, 
            }
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

        // get add article page data from datebase
        db.collection('settings').doc('add-article-page')
        .onSnapshot(doc => {
            if(doc.exists) { // check data exists or not
                this.welcomeText = doc.data().welcomeText
                this.guidelines = doc.data().guidelines
                this.thankYouText = doc.data().thankYouText
            }else {
                // when data not exists then set data empty to databse
                db.collection('settings').doc('add-article-page').set({
                    welcomeText: "write welcomeText",
                    guidelines: "write guidelines",
                    thankYouText: "your thankYouText"
                })
            }
        })
    },
    methods: {
        // update data
        changeSettings() {
            if(this.welcomeText && this.guidelines && this.thankYouText) {
                this.loading = true // vuetify loading
                // update data
                db.collection('settings').doc('add-article-page').update({
                    welcomeText: this.welcomeText,
                    guidelines: this.guidelines,
                    thankYouText: this.thankYouText
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
/*  data table styles */
.add-article-page {
    width: 100%;
    padding-left: 30px;
} 
.add-article-page .mark-down-editor {z-index: 1 !important; margin-bottom: 30px;}
</style>