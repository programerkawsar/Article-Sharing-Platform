<template>
    <div class="add-article">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="title"
            :description="description"
            :keywords="tags"
            :image="currentCoverImage"
            :url="url"
        />
         <!-- Set HeadFul End -->
         <!-- Container Start -->
        <v-container>
            <v-card class="mb-3" elevation="0">
                <!-- Check form before submit -->
                <ValidationObserver v-slot="{ handleSubmit }">
                    <!-- Vuetify form -->
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
                                <!-- Validatetion -->
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                    <!-- mavonEditor plugin -->
                                    <mavon-editor 
                                        v-model="description" 
                                        ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" 
                                        :placeholder="'Write description'" 
                                        :language="'en'" 
                                        :ishljs="true"
                                        :toolbars="markdownOption"
                                    >
                                    </mavon-editor>
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
                            <v-col cols="12">
                                <v-row align="center" justify="center" class="ml-1 mr-1">
                                    <!-- Article current cover image -->
                                    <v-img
                                        :src="currentCoverImage"
                                        :lazy-src="currentCoverImage"
                                        aspect-ratio="1"
                                        class="grey lighten-2"
                                        max-height="300"
                                    >
                                        <template v-slot:placeholder>
                                            <v-row
                                            class="fill-height ma-0"
                                            align="center"
                                            justify="center"
                                            >
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                </v-row>
                            </v-col>
                            <v-col cols="12" class="mb-4">
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
                            </v-col>
                        </v-row>
                        <!-- Update Article button -->
                        <div class="text-center m-4">
                            <v-btn 
                                type="submit" 
                                :disabled="!valid || loading || description == '' || tags == ''"
                                :loading="loading"
                                :class="$vuetify.theme.dark ? 'white black--text' : 'black white--text'" 
                            >
                                Update Article
                            </v-btn>
                        </div>
                    </v-form>
                </ValidationObserver>
            </v-card>
            <!-- Vuetify snackbar -->
            <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
            >
                Article updated successfully
                <v-btn
                    color="error"
                    text
                    @click="snackbar = false"
                >
                    Close
                </v-btn>
            </v-snackbar>
        </v-container>
        <!-- Container End -->
    </div>
</template>

<script>
// mapGetters for get data form vuex store
import { mapGetters } from "vuex"
// import vee-validate plugin
import { required } from 'vee-validate/dist/rules'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
// import slugify plugin
import slugify from 'slugify'
// import firebase app
import firebase from 'firebase/app'
// import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'

// vee-validate plugin validation
extend('required', {
    ...required,
    message: 'This field cannot be empty',
})

export default {
    name: 'AddArticle',
    data () {
        return {
            valid: true, // vuetify form valid 
            loading: false, // vuetify loading
            url: window.location.href, // get current URL
            title: '', // title data property
            slug: '', // slug data property
            // validation rule
            titleRules: [
                v => !!v || 'Title is required',
                v => (v && v.length > 30) || 'Title must be more than 30 characters',
                v => (v && v.length <= 75) || 'Title must be less than 75 characters',
            ],
            description: '', // description data property
            tags: [], // tags data property
            categoryId: '', // store category id
            // validation rule
            categoryRules: [
                v => !!v || 'Category is required',
            ],
            categories: [],
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
            currentCoverImage: '', // cover image URL
            fileRecord: [], // cover image
            inputDisabled: false, // disabled inputs
            errorMessage: '', // error message
            snackbar: false, // vuetify snackbar
            timeout: 2000 // set timeout
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
        // get article information
      db.collection('articles').where('slug', '==', this.$route.params.slug).where('userId', '==', this.$store.state.user.data.uid).get()
        .then(snapshot => {
            if(!snapshot.empty) { // check empty
                snapshot.forEach(doc => {
                    // set data to data property
                    this.title = doc.data().title
                    this.description = doc.data().description
                    this.tags = doc.data().tags
                    this.currentCoverImage = doc.data().image

                    // get selected category
                    db.collection("categories").doc(doc.data().categoryId).get()
                    .then((querySnapshot) => {
                        let category = querySnapshot.data()
                        category.id = querySnapshot.id
                        this.categoryId = category 
                    }).catch(err => console.log(err))
                })
            }else {
                // if empty to push home route
                this.$router.push({ name: 'Home' })
            }
        })

        // get all categories
      db.collection('categories').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let category = doc.data()
          category.id = doc.id
          this.categories.push(category)
        })
      })
    },
    computed: {
        // set error message
        errorMessages() {
            return this.errorMessage ? this.errorMessage : undefined
        },
         ...mapGetters({
            user: "user" // assign data from vuex store
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
        // update article
        addArticle() {
            let fileValidation = this.fileRecord[0] ? this.fileRecord[0].error == false : this.fileRecord = [] // file validation
            if(this.$refs.form.validate() && fileValidation) { // check no error
                this.loading = true // vuetify loading
                this.inputDisabled = true // disabled inputs
                document.getElementsByClassName("auto-textarea-input")[0].disabled = true // mark down editor textarea disabled

                // using slugify plugin for convert title to slug
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$&+,:;=?@#|'"<>.^*()%!~]/g,
                    lower: true
                })

                let categoryId
                if(Object.keys(this.categoryId).length == 4) {
                    categoryId = this.categoryId.id // set categoryId
                }else {
                    categoryId = this.categoryId // set categoryId
                }

                if(this.fileRecord[0]) { // check has file
                    this.updateWithImage(categoryId) // call a function
                }else {
                    this.updateWithoutImage(categoryId) // call a function
                }
            }
        },
        // update article information and image also
        updateWithImage(categoryId) { // get data from passing function
            var httpsReference = firebase.storage().refFromURL(this.currentCoverImage)             
            let file = this.fileRecord[0].file // get file
            let fileName = httpsReference.name // get file name
            let storageRef = firebase.storage().ref('articles/' + fileName)

            // get slug from route params and get user uid form vuex
            db.collection("articles").where("slug", "==", this.$route.params.slug).where('userId', '==', this.$store.state.user.data.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    storageRef.put(file).then(res => {
                        res.ref.getDownloadURL().then((imageUrl) => { // get image URL
                            this.updateData(doc.id, categoryId, imageUrl) // call a function
                        })
                    }).catch(err => console.log(err))
                })
            })
        },
        // update article information without image 
        // if user don't want to update the article cover image 
        updateWithoutImage(categoryId) { // get data from passing function
            // get slug from route params and get user uid form vuex
            db.collection("articles").where("slug", "==", this.$route.params.slug).where('userId', '==', this.$store.state.user.data.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.updateData(doc.id, categoryId, doc.data().image) // call a function and passing data
                })
            })
        },
        // update article information
        updateData(docId, categoryId, imageUrl) { // get data from passing function
            db.collection('articles').doc(docId).update({
                categoryId: categoryId,
                update: true,
                date: Date.now(), // javascript now() for current time
                title: this.title,
                slug: this.slug,
                description: this.description,
                tags: this.tags,
                image: imageUrl,
                views: 0,  // views set value 0
                currentViewer: 0 // current viewer set value 0
            }).then(() => {
                this.loading = false // vuetify loading
                this.snackbar = true // vuetify snackbar
                // when data update successfully then redirect to profile after 2000 mili sec left
                setTimeout(() => {
                    // get username form vuex store
                    this.$router.push({ name: 'Profile', params: { username: this.$store.state.user.data.username } })
                }, 2000)
            }).catch(err => {
                console.log(err)
                this.loading = false
            })
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