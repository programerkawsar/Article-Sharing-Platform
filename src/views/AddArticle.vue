<template>
    <div class="add-article">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Add Article - ' + appName"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <v-container>
            <v-stepper v-model="step" vertical class="border-0">
                <!-- Welcome step -->
                <v-stepper-step :complete="step > 1" step="1"  :color="$vuetify.theme.dark ? 'white black--text' : 'black white--text'">
                    Welcome
                </v-stepper-step>

                <!-- Welcome text -->
                <v-stepper-content step="1">
                    <v-card class="mb-3" elevation="0" v-html="welcomeText"></v-card>
                    <v-btn :class="$vuetify.theme.dark ? 'white black--text' : 'black white--text'" @click="step = 2">Continue</v-btn>
                    <v-btn text disabled>Cancel</v-btn>
                </v-stepper-content>

                <!-- Guidelines step -->
                <v-stepper-step :complete="step > 2" step="2"  :color="$vuetify.theme.dark ? 'white black--text' : 'black white--text'">Guidelines</v-stepper-step>
                
                <!-- Guidelines text -->
                <v-stepper-content step="2">
                    <v-card class="mb-3" elevation="0" v-html="guidelines"></v-card>
                    <v-btn :class="$vuetify.theme.dark ? 'white black--text' : 'black white--text'" @click="step = 3">Continue</v-btn>
                    <v-btn text @click="step = 1">Cancel</v-btn>
                </v-stepper-content>

                <!-- Add article step -->
                <v-stepper-step :complete="step > 3" step="3" :color="$vuetify.theme.dark ? 'white black--text' : 'black white--text'">Submit Article</v-stepper-step>

                <!-- Add article form -->
                <v-stepper-content step="3">
                    <v-card class="mb-3" elevation="0">
                        <!-- vee-validate validation -->
                        <ValidationObserver v-slot="{ handleSubmit }">
                            <!-- vuetify form -->
                            <v-form
                                ref="form"
                                v-model="valid"
                                @submit.prevent="handleSubmit(addArticle)"
                            >
                                <v-row>
                                    <v-col cols="12">                                       
                                        <v-text-field
                                            v-model="title"
                                            :rules="titleRules"
                                            hint="Enter your article title it's must be fresh don't use any special characters"
                                            :error-messages="errorMessage"
                                            @keyup.stop.prevent="checkTitle()"  
                                            color="black"
                                            label="Title"
                                            solo-inverted
                                            counter
                                            required
                                            :disabled="inputDisabled"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="mb-3 mark-down-editor">
                                        <ValidationProvider rules="required" v-slot="{ errors }">
                                            <!-- Mavon markdown editor -->
                                            <mavon-editor 
                                                v-model="description" 
                                                ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" 
                                                :placeholder="'Write description'" 
                                                :language="'en'" 
                                                :ishljs="true"
                                                :toolbars="markdownOption"
                                            >
                                            </mavon-editor>
                                            <!-- error message -->
                                            <p v-if="descriptionError" class="error--text" style="margin-top: 5px;font-size: 13px;margin-bottom: 0;">{{ errors[0] }}</p>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col cols="6">
                                        <!-- Select category -->
                                        <v-select
                                            v-model="categoryId"
                                            :items="categories"
                                            :rules="categoryRules"
                                            item-text="name"
                                            item-value="id"
                                            label="Select Category"
                                            solo-inverted
                                            single-line
                                            :disabled="inputDisabled"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <ValidationProvider rules="required" v-slot="{ errors }">
                                            <!-- Combobox for tags -->
                                            <v-combobox
                                                v-model="tags"
                                                solo-inverted
                                                hide-selected
                                                hint="Maximum of 5 tags"
                                                label="Add some tags"
                                                multiple
                                                persistent-hint
                                                append-icon=""
                                                :error-messages="errors"
                                                small-chips
                                                :disabled="inputDisabled"
                                            ></v-combobox>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col cols="12" class="mb-4">
                                        <ValidationProvider rules="required" v-slot="{ errors }">
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
                                                :helpText="'Choose cover image'"
                                                :errorText="{
                                                    type: 'Invalid file type. Only images',
                                                    size: 'Files should not exceed 2MB in size',
                                                }"
                                                v-model="fileRecord"
                                                :disabled="inputDisabled"
                                            ></VueFileAgent>
                                            <p class="error--text" style="margin-top:5px;font-size: 13px;margin-bottom: 0;">{{ errors[0] }}</p>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                                <!-- Continue button -->
                                <v-btn 
                                    type="submit" 
                                    :disabled="!valid || loading || description == '' || tags == '' || fileRecord == ''"
                                    :loading="loading"
                                    :class="$vuetify.theme.dark ? 'white black--text' : 'black white--text'" 
                                >
                                    Continue
                                </v-btn>
                                <v-btn text @click="step = 2" :disabled="inputDisabled">Cancel</v-btn>
                            </v-form>
                        </ValidationObserver>
                    </v-card>
                </v-stepper-content>

                <!-- Thank You step -->
                <v-stepper-step step="4" :color="$vuetify.theme.dark ? 'white black--text' : 'black white--text'">Thank You</v-stepper-step>

                <!-- Finished -->
                <v-stepper-content step="4">
                    <v-card class="mb-3" elevation="0" v-html="thankYouText"></v-card>
                    <v-btn :class="$vuetify.theme.dark ? 'white black--text' : 'black white--text'" :to="{ name: 'Profile', params: { username: user.loggedIn ? user.data.username : '' } }">Finished</v-btn>
                    <v-btn text disabled>Cancel</v-btn>
                </v-stepper-content>
            </v-stepper>
        </v-container>
         <!-- Container End -->
    </div>
</template>

<script>
// mapGetters for get data form vuex store
import { mapGetters } from "vuex"
// vee-validate plugin
import { required } from 'vee-validate/dist/rules'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
// slugify plugin
import slugify from 'slugify'
// import firebase app
import firebase from 'firebase/app'
// import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'
// markdown-it for render description
const md = require('markdown-it')()
            .use(require('markdown-it-deflist'))
            .use(require('markdown-it-container'), 'hljs-center')
            .use(require('markdown-it-container'), 'hljs-left')
            .use(require('markdown-it-container'), 'hljs-right');

// vee-validate plugin validation
extend('required', {
    ...required,
    message: 'This field cannot be empty',
})

export default {
    name: 'AddArticle',
    data () {
        return {
            step: 1, // set default step
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            url: window.location.href, // get current URL
            favIconUrl: '', // set fav icon URL
            appName: '', // set aplication name
            welcomeText: '', // set welcome text
            guidelines: '', // set guidelines
            thankYouText: '', // set thank you text
            title: '', // title data property
            slug: '', // slug data property
            titleRules: [ // validation rule
                v => !!v || 'Title is required',
                v => (v && v.length > 30) || 'Title must be more than 30 characters',
                v => (v && v.length <= 75) || 'Title must be less than 75 characters',
            ],
            description: '', // description data property
            tags: [], // tags data property
            categoryId: '', // store category id 
            categoryRules: [ // validation rule
                v => !!v || 'Category is required',
            ],
            categories: [], // store categories to this array
            // mavoneditor all options 
            markdownOption: {
                bold: true,
                italic: true,
                header: true,
                underline: true,
                strikethrough: true,
                mark: true,
                superscript: true,
                subscript: true,
                quote: true,
                ol: true,
                ul: true,
                link: true,
                imagelink: true,
                code: true, 
                table: true, 
                fullscreen: true, 
                readmodel: true, 
                htmlcode: false, 
                help: false, 
                undo: true, 
                redo: true, 
                trash: true, 
                save: false, 
                navigation: false, 
                alignleft: true, 
                aligncenter: true, 
                alignright: true, 
                subfield: true, 
                preview: true, 
            },
            descriptionError: false, // description empty error
            descriptionImages: {}, // description images
            fileRecord: [], // cover image
            inputDisabled: false, // disabled inputs
            errorMessage: '', // error message
        }
    },
    watch: {
        // tags must be 5 item
      tags(val) {
        if (val.length > 5) {
          this.$nextTick(() => this.tags.pop())
        }
      }
    },
    created() {
        // get general settings from datebase
      db.collection('settings').doc('general-settings')
      .onSnapshot(doc => {
          this.favIconUrl = doc.data().favIcon
          this.appName = doc.data().appName
      })

        // get add article page data from datebase
      db.collection('settings').doc('add-article-page')
      .onSnapshot(doc => {
          this.welcomeText =  md.render(doc.data().welcomeText)
          this.guidelines = md.render(doc.data().guidelines)
          this.thankYouText = md.render(doc.data().thankYouText)
      })

        // get all categories
      db.collection('categories')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if(change.type === 'added') {
                let category = change.doc.data()
                category.id = change.doc.id
                this.categories.push(category) // push category
            }

            // filtering deleteing category
            if(change.type === 'removed') {
                this.categories = this.categories.filter(category => {
                    return category.id != change.doc.id
                })
            }
        })
      })
    },
    computed: {
        // set error message
        errorMessages() {
            return this.errorMessage ? this.errorMessage : undefined
        },
         ...mapGetters({
            user: "user" // set user data form vuex store
        })
    },
    methods: {
        // upload images from mark down editor
        $imgAdd(pos, $file){
            let imageName = Date.now() + $file.name
            let storageRef = firebase.storage().ref('articles/' + imageName)
            storageRef.put($file).then(res => {
                res.ref.getDownloadURL().then((url) => {
                    this.$refs.md.$img2Url(pos, url)            
                })
            }).catch(err => console.log(err))
        },
        // mark down editor image delete
        $imgDel(pos){
            var httpsReference = firebase.storage().refFromURL(pos[0])
            var desertRef = firebase.storage().ref().child(httpsReference.fullPath)
            desertRef.delete().then(() => {})
            delete this.descriptionImages[pos]
        },
        // add article
        addArticle() {
            if(this.$refs.form.validate() && this.fileRecord[0].error == false) { // check no error
                this.loading = true // vuetify loading
                this.inputDisabled = true // disabled inputs
                document.getElementsByClassName("auto-textarea-input")[0].disabled = true // mark down editor textarea disabled

                // using slugify plugin for convert title to slug
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$&+,:;=?@#|'"<>.^*()%!~]/g,
                    lower: true
                })

                let file = this.fileRecord[0].file // get file
                let fileName = Date.now() + this.fileRecord[0].file.name // get file name
                let storageRef = firebase.storage().ref('articles/' + fileName)
                
                // put image to firebase storage and add also firebase firestore database 
                storageRef.put(file).then(res => {
                    res.ref.getDownloadURL().then((imageUrl) => { // get image url
                        db.collection('articles').add({
                            userId: this.$store.state.user.data.uid, // get user uid from vuex
                            categoryId: this.categoryId,
                            published: 2, // publish show by defualt false
                            save: true,
                            slider: 2, // slider show by defualt false
                            requestShow: true,
                            date: Date.now(), // javascript now() for get current time
                            title: this.title,
                            slug: this.slug,
                            description: this.description,
                            tags: this.tags,
                            image: imageUrl, // set image url
                            views: 0, // views by defualt 0
                            currentViewer: 0 // currentViewer by defualt 0
                        }).then((snapshot) => {
                            this.step = 4 // go to step 4
                            this.loading = false // vuetify loading 
                            // added a notification for admin
                            db.collection('notifications').add({
                                admin: true,
                                userId: this.$store.state.user.data.uid, // get user uid from vuex
                                time: Date.now(),
                                text: 'added a new article',
                                unseenAll: true
                            })
                        }).catch(err => {
                            console.log(err)
                            this.loading = false
                        })
                    })
                }).catch(err => console.log(err))
            }
        },
        // check title unique or not
        checkTitle() {
            db.collection('articles').where('title', '==', this.title).get()
            .then(snapshot => {
                if(!snapshot.empty) {
                    this.errorMessage = "The title already exists choose another one" // set error message
                }else {
                    this.errorMessage = ""
                }
            })
        }
    },
    components: {
        // register components
        ValidationProvider,
        ValidationObserver
    }
}
</script>

<style scoped>
/* Customize mark down editor style */
.mark-down-editor {height: 500px; z-index: 5;}
.mark-down-editor .shadow {
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
    border: 2px solid #e5e5e5 !important;
    border-bottom: 0 !important;
    height: 100%;
}
.vue-file-agent.has-multiple .file-preview, .vue-file-agent.is-single .is-deletable .file-preview {
    z-index: 1;
}
</style>