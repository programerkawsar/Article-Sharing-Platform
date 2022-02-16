<template>
    <!-- vuetify lazy load -->
    <v-lazy
        v-model="lazyLoad"
        :options="{
          threshold: .5
        }"
        transition="fade-transition"
    >
    <!-- vuetify card -->
    <v-card elevation="0" class="article mx-auto p-2" :to="url">
        <!-- article cover image -->
        <v-img
            class="grey lighten-2"
            height="230px"
            :src="image"
            :lazy-src="image"
            aspect-ratio="1"
        >
            <!-- image loading -->
            <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
            </template>
            <div class="p-2">
                <!-- this dialog working only request page -->
                <v-row v-if="$route.name == 'Request'">
                    <!-- send request dialog -->
                    <v-dialog v-model="dialog2" persistent max-width="450" v-if="userId == currentUser">
                        <template v-slot:activator="{ on }">
                            <!-- open dialog -->
                            <v-btn v-on="on" fab dark small color="black" class="ml-3" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                                <v-icon dark>mdi-cursor-default-click-outline</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <!-- vuetify form -->
                            <v-form
                                class="request-form"
                                ref="form"
                                v-model="valid"
                                @submit.prevent="sendRequest()"
                            >
                                <!-- textarea for write request -->
                                <v-card-text>
                                    <h6 class="black--text pt-5 mb-3">{{ title }}</h6>
                                    <v-textarea
                                        v-model="requestingText"
                                        :rules="requestingTextRules"
                                        color="black"
                                        filled
                                        placeholder="Write some requesting text"
                                        auto-grow
                                        counter
                                    ></v-textarea>
                                    Make a request for this article to added to slider. We will verify your request and then add it to the slider. Amna will be notified via email or notification as soon as your article is added to the slider.
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error darken-1" text @click="dialog2 = false">Cancel</v-btn>
                                    <v-btn color="green darken-1" type="submit" :disabled="!valid" :loading="loading2" text>Submit</v-btn>
                                </v-card-actions>
                            </v-form>
                            <!-- vuetify form end -->
                        </v-card>
                    </v-dialog>
                    <!-- send request dialog end -->
                </v-row>
                <!-- delete article dialog -->
                <template v-else>
                    <!-- open dialog button -->
                    <v-btn v-if="userId == currentUser" class="mr-2" fab dark small color="black" :to="editUrl">
                        <v-icon dark>mdi-account-edit-outline</v-icon>
                    </v-btn>
                    <v-dialog v-model="dialog3" persistent max-width="290" v-if="userId == currentUser">
                        <template v-slot:activator="{ on }">                           
                            <v-btn  v-on="on" v-if="userId == currentUser" fab dark small color="black" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                                <v-icon dark>mdi-delete-empty-outline</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Are you sure to delete the article?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" text @click="dialog3 = false">Disagree</v-btn>
                                <v-btn color="green darken-1" text @click="deleteArticle()" :loading="loading3">Agree</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <!-- delete article dialog end -->
            </div>
        </v-img>
        <!-- article details -->
        <v-card-actions class="text-uppercase p-0">
            <!-- category name & category link -->
            <v-card-subtitle class="pl-0 pr-0 pb-0 clearfix">
                <router-link :to="'/category/' + categorySlug" class="float-left mr-3">{{ category }}</router-link>
                <p class="float-left">{{ date }}</p>
            </v-card-subtitle>
            <v-spacer></v-spacer>
            <!-- article save/unsave -->
            <v-item-group v-if="$store.state.user.loggedIn">
                <v-btn v-if="!save" :class="{'remove--v-btn--active-style' : 'v-btn--active'}" icon @click="dialog = true" :loading="loading" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                    <v-icon>mdi-bookmark</v-icon>
                </v-btn>
                <v-btn v-else :class="{'remove--v-btn--active-style' : 'v-btn--active'}" icon @click="saveArticle()" :loading="loading" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                    <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
            </v-item-group>
            <v-item-group v-else>
              <v-btn :class="{'remove--v-btn--active-style' : 'v-btn--active'}" icon @click="alartSheet = true" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                <v-icon>mdi-bookmark-outline</v-icon>
              </v-btn>
            </v-item-group>
        </v-card-actions>
        <!-- article title -->
        <v-card-text class="p-0">
            <h3 class="main-title" :class="$vuetify.theme.dark ? 'white--text' : ''">{{ title }}</h3>
            <slot></slot>
        </v-card-text>
        <!-- article details end -->
        <!-- article unsaved dialog -->
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Are you sure to unsaved the article?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog = false">Disagree</v-btn>
                    <v-btn color="green darken-1" text @click="unSaveArticle()">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- vuetify snackbar -->
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            Article has been saved
            <v-btn
                color="error"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <div class="text-center">
            <!-- vuetify sheet -->
            <v-bottom-sheet v-model="alartSheet" persistent>
                <v-sheet class="text-center" height="200px">
                <!-- hide sheet -->
                <v-btn
                    class="mt-6"
                    text
                    color="error"
                    @click="alartSheet = !alartSheet"
                >close</v-btn>
                <div class="py-3">
                    <p class="mb-0 font-weight-bold">You're not logged in you account</p>
                    <small class="text-muted">This functionality only for registered user. if you are a registered user then login your account <br> for use this functionality or if you are not a registered user then register now</small>
                </div>
                <v-btn small color="primary" :elevation="0" class="mr-2" :to="{ name: 'Login' }">Login</v-btn>
                <v-btn small color="secondary" :elevation="0" :to="{ name: 'Register' }">Register</v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </v-card>
    <!-- vuetify card end -->
    </v-lazy>
    <!-- vuetify lazy load end -->
</template>

<script>
// import firebase app
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Article',
    // get data form vuejs props
    props: ['url', 'editUrl', 'articleId', 'save', 'image', 'category', 'categorySlug', 'date', 'title', 'description', 'userId'],
    data() {
        return {
            lazyLoad: false, // vuetify lazy load
            valid: true, // vuetify form valid
            loading: false, // vuetify loading for save/unsave
            loading2: false, // vuetify loading for make request
            loading3: false, // vuetify loading for delete article
            dialog: false, // vuetify dialog for unsave article
            dialog2: false, // vuetify dialog for make request
            dialog3: false, // vuetify dialog for delete article
            currentUser: false, // store current uid
            snackbar: false, // vuetify snackbar
            alartSheet: false, // vuetify sheet
            timeout: 2000, // vuetify snackbar timeout
            requestingText: "", // store requesting text
            requestingTextRules: [ // validation rules
                v => !!v || 'Requesting text is required',
                v => (v && v.length <= 100) || 'Requesting text must be less than 100 characters',
            ]
        }
    },
    created() {
        let user = firebase.auth().currentUser // get current user data
        this.currentUser = user ? user.uid : '' // set current user uid
    },
    methods: {
        // Delete article
        // when user delete an article 
        // then delete everything to related this article for example: images, comments, replies
        // and also delete saves from who save the article
        deleteArticle() {
            this.loading3 = true // vuetify loading for delete article
 
            db.collection('articles').doc(this.articleId).delete()
            .then(() => {
                this.deleteDescriptionImages() // call a function
            }).catch(err => {
                console.log(err)
            })
        },
        // Delete all article images
        deleteDescriptionImages() {
            let urls = this.description.match(/\bhttps?:\/\/\S+/gi) // find all urls from article description using regex
            var httpsReference = firebase.storage().refFromURL(this.image) // cover image reference
            var desertRef = firebase.storage().ref().child(httpsReference.fullPath)
            desertRef.delete().then(() => {
                // when cover image deleted then check description urls
                if(urls) {
                    // delete one by one by for loop
                    for(var i = 0; i < urls.length; i++) {
                        var httpsReference = firebase.storage().refFromURL(urls[i]) // get image reference
                        var desertRef = firebase.storage().ref().child(httpsReference.fullPath) // image delete by full path
                        desertRef.delete().then(() => {}).catch((error) => {
                            console.log(error)
                        })
                    }
                }
                this.deleteComments() // call a function
                this.deleteSaves() // call a function
            }).catch((error) => {
                console.log(error)
            })
        },
        // Delete all saves article
        deleteSaves() {
            db.collection('saves').where('articleId', '==', this.articleId).get()
            .then((snapshot) => {
                if(!snapshot.empty) { // empty check
                    snapshot.forEach(doc => {
                        // deleteing all saves
                        db.collection('saves').doc(doc.id).delete()
                    })
                }
            })
        },
        // Delete all comments
        deleteComments() {
            db.collection('comments').where('articleId', '==', this.articleId).get()
            .then((snapshot) => {
                if(!snapshot.empty) { // empty check
                    snapshot.forEach(doc => {
                        // deleteing all comments
                        db.collection('comments').doc(doc.id).delete()
                        .then(() => {
                            this.deleteReplies(doc.id) // when comments deleted then call a function
                        })
                    })
                }else {
                    this.loading3 = false // vuetify loading
                    this.dialog3 = false // vuetify dialog
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // Delete all replies
        deleteReplies(commentId) { // get passing data from function
            db.collection('replies').where('commentId', '==', commentId).get()
            .then((snapshot) => {
                if(!snapshot.empty) { // empty check
                    snapshot.forEach(doc => {
                        // deleteing all replies
                        db.collection('replies').doc(doc.id).delete()
                        .then(() => {
                            this.loading3 = false // vuetify loading
                            this.dialog3 = false // vuetify dialog
                        })
                    })
                }else {
                    this.loading3 = false // vuetify loading
                    this.dialog3 = false // vuetify dialog
                }
            }).catch(err => console.log(err))
        },
        // Save article
        saveArticle() {
            this.loading = true // vuetify loading
            let user = firebase.auth().currentUser // get current user
            // save article
            db.collection('saves').add({
                userId: user.uid,
                articleId: this.articleId,
                time: Date.now() // javascript now() function for get current time
            }).then((snapshot) => {
                this.loading = false // vuetify loading
                this.snackbar = true // vuetify snackbar
            }).catch(err => {
                console.log(err)
            })
        },
        // Unsave article 
        unSaveArticle() {
            this.loading = true // vuetify loading
            db.collection('saves').where('articleId', '==', this.articleId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // delete saved article
                    db.collection('saves').doc(doc.id).delete()
                    .then(() => {
                        this.loading = false // vuetify loading
                        this.dialog = false // vuetify dialog
                    }).catch(err => {
                        console.log(err)
                    })
                })
            }).catch(err => console.log(err))
        },
        // send request for added article to slider
        sendRequest() {
            this.loading2 = true // vuetify loading
            if(this.$refs.form.validate()) { // check form no error
                db.collection('requests').add({
                    userId: this.$store.state.user.data.uid, // get user uid form vuex store
                    articleId: this.articleId,
                    time: Date.now(), // javascript now() function for get current time
                    text: this.requestingText
                }).then((snapshot) => {
                    this.loading2 = false // vuetify loading
                    this.dialog2 = false // vuetify dialog
                    this.requestingText = ''

                    // you can send a request for an article once
                    db.collection('articles').doc(this.articleId).update({
                        requestShow: false
                    })

                    // set a notification for admin 
                    db.collection('notifications').add({
                        admin: true,
                        userId: this.$store.state.user.data.uid, // get user uid form vuex store
                        time: Date.now(),
                        text: 'send a new request',
                        unseenAll: true
                    })
                }).catch(err => {
                    console.log(err)
                    this.loading2 = false // vuetify loading
                    this.dialog2 = false // vuetify dialog
                })
            }
        }
    }
}
</script>

<style>
/* single article style */
.article:hover {text-decoration: none;}
.article .v-image {border-radius: 10px !important;}
.article .v-item-group {margin-right: -8px;}
.article .v-card__actions a, .article .v-card__actions p {
    font-size: small;
    margin-top: 3px;
}
.article .main-title {
    font-weight: 300;
    font-size: 20px;
    color: rgb(27, 30, 33);
    margin-top: -6px;
}
.v-btn:not(.v-btn--text):not(.v-btn--outlined).remove--v-btn--active-style:before {
    opacity: 0 !important;
}

/* Small to medium tablet */
@media (min-width: 600px) {
    .article .v-image {height: 200px !important;}
    .article .main-title {font-size: 18px;}
}

/* Large tablet to laptop */
@media (min-width: 960px) {
    .article .v-image {height: 200px !important;}
    .article .main-title {font-size: 18px;}
}

/* Desktop */
@media (min-width: 1264px) {
    .article .v-image {height: 230px !important;}
    .article .main-title {font-size: 20px;}
}
</style>