<template>
    <div class="single-article">
        <!-- For Loop -->
        <v-container v-for="article in article" :key="article.id">
            <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
            <vue-headful
                :title="article.title"
                :description="article.description"
                :keywords="article.tags"
                :image="article.image"
                lang="en"
                :url="page.url"
            />
            <!-- Set HeadFul End -->
            <!-- Start Row -->
            <v-row no-gutters>
                <!-- Mobile Cover Image Section -->
                <v-col cols="12" md="6" class="mobile-cover">
                    <!-- Image -->
                    <v-img
                        :src="article.image"
                        :lazy-src="article.image"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        height="360"
                    >
                        <!-- Loader -->
                        <template v-slot:placeholder>
                            <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                        <!-- Loader End -->
                        <div class="clearfix">
                            <div class="float-left" v-if="$store.state.user.loggedIn">
                                <!-- Edit Btn -->
                                <v-btn small class="ma-2 mr-0" v-if="article.currentUserId == $store.state.user.data.uid" color="black white--text" :to="'/edit-article/' + article.categorySlug + '/' + article.slug">Edit</v-btn>
                                <!-- Edit Btn End -->
                                <!-- Dialog For Delete Article -->
                                <v-dialog v-model="dialog2" persistent max-width="290" v-if="article.currentUserId == $store.state.user.data.uid">
                                    <template v-slot:activator="{ on }">                           
                                        <v-btn class="ma-2" v-on="on" v-if="article.currentUserId == $store.state.user.data.uid" small color="red white--text" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                                            Delete
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title class="headline">Are you sure to delete the article?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red darken-1" text @click="dialog2 = false">Disagree</v-btn>
                                            <!-- passing data -->
                                            <v-btn color="green darken-1" text @click="deleteArticle(article.id, article.image, article.description)" :loading="loading2">Agree</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <!-- End Dialog -->
                            </div>
                            <!-- Current Viewer -->
                            <v-chip
                                class="ma-2 font-weight-bold float-right"
                                text-color="white"
                                color="black"
                                label
                            >
                                <v-icon left>mdi-eye</v-icon> {{ article.currentViewer }}
                            </v-chip>
                            <!-- End Current Viewer -->
                        </div>
                    </v-img>
                    <!-- Image End -->
                </v-col>
                <!-- Mobile Cover Image Section End -->
                <!-- Article Info -->
                <v-col cols="12" md="6">
                    <div class="box">
                        <div class="middle">
                            <!-- Category Link -->
                            <router-link :to="'/category/' + article.categorySlug" class="text-uppercase">{{ article.categoryId }}</router-link>
                            <h3 class="mt-3 mb-3">{{ article.title }}</h3>
                            <div class="clearfix">
                                <div class="float-left mr-3">
                                    <!-- User Link -->
                                    <router-link :to="'/profile/' + article.username">
                                        <!-- Avatar -->
                                        <v-avatar width="60" height="60">
                                            <v-img
                                                :src="article.userAvatar"
                                                :lazy-src="article.userAvatar"
                                                alt="John"
                                                class="grey lighten-2"
                                                aspect-ratio="1"
                                            >
                                                <!-- Loader -->
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
                                        </v-avatar>
                                    </router-link>
                                </div>
                                <div class="float-left mt-3">
                                    <!-- Name -->
                                    <h5 class="mb-0"><router-link :to="'/profile/' + article.username" :class="$vuetify.theme.dark ? 'white--text' : ''">{{ article.userId }}</router-link></h5>
                                    <!-- Date -->
                                    <p class="text-muted" :class="$vuetify.theme.dark ? 'white--text' : ''">{{ article.date }} <span class="ml-3">{{ article.views }} Views</span></p>
                                </div>
                            </div>
                            <v-item-group class="reactions">
                                <!-- Save/Unsave Section -->
                                <v-item v-if="$store.state.user.loggedIn" class="mr-2">
                                    <v-btn v-if="!article.save" icon @click="dialog = true" :loading="loading">
                                        <v-icon>mdi-bookmark</v-icon>
                                    </v-btn>
                                    <!-- passing data -->
                                    <v-btn v-else icon @click="saveArticle(article.id)" :loading="loading">
                                        <v-icon>mdi-bookmark-outline</v-icon>
                                    </v-btn>
                                </v-item>
                                <v-item v-else class="mr-2">
                                    <v-btn icon @click="alartSheet = true">
                                        <v-icon>mdi-bookmark-outline</v-icon>
                                    </v-btn>
                                </v-item>
                                <!-- Save/Unsave Section End -->
                                <!-- Social Share Buttons -->
                                <v-item class="mr-2">
                                    <ShareNetwork
                                        network="facebook"
                                        :url="page.url"
                                        :title="article.title"
                                        :description="article.description"
                                        :quote="article.title"
                                        :hashtags="article.tags"
                                    >
                                        <v-btn icon>
                                            <v-icon>mdi-facebook</v-icon>
                                        </v-btn>
                                    </ShareNetwork>
                                </v-item>
                                <v-item class="mr-2">
                                    <ShareNetwork
                                        network="twitter"
                                        :url="page.url"
                                        :title="article.title"
                                        :hashtags="article.tags"
                                    >
                                        <v-btn icon>
                                            <v-icon>mdi-twitter</v-icon>
                                        </v-btn>
                                    </ShareNetwork>                                  
                                </v-item>
                                <v-item class="mr-2">
                                    <ShareNetwork
                                        network="pinterest"
                                        :url="page.url"
                                        :title="article.title"
                                        :hashtags="article.tags"
                                        :media="article.image"
                                    >
                                        <v-btn icon>
                                            <v-icon>mdi-pinterest</v-icon>
                                        </v-btn>
                                    </ShareNetwork> 
                                </v-item>
                                <v-item>
                                    <ShareNetwork
                                        network="linkedin"
                                        :url="page.url"
                                        :title="article.title"
                                    >
                                        <v-btn icon>
                                            <v-icon>mdi-linkedin</v-icon>
                                        </v-btn>
                                    </ShareNetwork> 
                                </v-item>
                                <!-- End Social Share Buttons -->
                            </v-item-group>
                        </div>
                    </div>
                </v-col>
                <!-- Article Info End -->
                <!-- Mobile Desktop Image -->
                <v-col cols="12" md="6" class="desktop-cover">
                    <!-- Image -->
                    <v-img
                        :src="article.image"
                        :lazy-src="article.image"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        height="360"
                    >
                        <!-- Loader -->
                        <template v-slot:placeholder>
                            <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                        <div class="clearfix">
                            <!-- Delete Article Dialog -->
                            <div class="float-left" v-if="$store.state.user.loggedIn">
                                <v-btn small class="ma-2 mr-0" v-if="article.currentUserId == $store.state.user.data.uid" color="black white--text" :to="'/edit-article/' + article.categorySlug + '/' + article.slug">Edit</v-btn>
                                <v-dialog v-model="dialog2" persistent max-width="290" v-if="article.currentUserId == $store.state.user.data.uid">
                                    <template v-slot:activator="{ on }">                           
                                        <v-btn class="ma-2" v-on="on" v-if="article.currentUserId == $store.state.user.data.uid" small color="red white--text" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                                            Delete
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title class="headline">Are you sure to delete the article?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red darken-1" text @click="dialog2 = false">Disagree</v-btn>
                                            <!-- passing data -->
                                            <v-btn color="green darken-1" text @click="deleteArticle(article.id, article.image, article.description)" :loading="loading2">Agree</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                            <!-- End Delete Article Dialog -->
                            <!-- Current Viewer -->
                            <v-chip
                                class="ma-2 font-weight-bold float-right"
                                text-color="white"
                                color="black"
                                label
                            >
                                <v-icon left>mdi-eye</v-icon> {{ article.currentViewer }}
                            </v-chip>
                            <!-- End Current Viewer -->
                        </div>
                    </v-img>
                </v-col>
                <!-- Mobile Desktop Image End -->
            </v-row>
            <!-- End Row -->
            <v-divider></v-divider>
            <!-- Article Description -->
            <div class="descriptions">
                <div class="main-data" v-html="article.description"></div>
                <v-divider></v-divider>
                <!-- Comment Section -->
                <comments id="comments" :articleId="article.id" :ownerId="article.currentUserId"></comments>
                <!-- Comment Section End -->
            </div>
            <!-- Article Description End -->
            <!-- Start Row -->
            <v-row>
                <!-- for loop start -->
                <v-col
                    v-for="(article, i) in articles"
                    :key="'N' + i"
                    cols="12"
                    xs="12"
                    sm="6"
                    md="4"
                    lg="4"
                    xl="3"
                    class="pt-0"
                >
                <!-- Article Component -->
                <article-item
                    :url="'/article/' + article.categorySlug + '/' + article.slug"
                    :editUrl="'/edit-article/' + article.categorySlug + '/' + article.slug"
                    :articleId="article.id"
                    :save="article.save"
                    :image="article.image"
                    :category="article.categoryId"
                    :categorySlug="article.categorySlug"
                    :date="article.date"
                    :title="article.title"
                    :userId="article.userId"
                ></article-item>
                </v-col>
                <!-- for loop end -->
            </v-row>
            <!-- End Row -->
            <!-- Unsaved Article Dialog -->
            <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Are you sure to unsaved the article?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" text @click="dialog = false">Disagree</v-btn>
                        <!-- Passing data -->
                        <v-btn color="green darken-1" text @click="unSaveArticle(article.id)">Agree</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- End Unsaved Article Dialog -->
        </v-container>
        <!-- For Loop End -->
        <!-- Save Snackbar -->
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
        <!-- End Save Snackbar -->
        <!-- Alart Sheet -->
        <div class="text-center">
            <v-bottom-sheet v-model="alartSheet" persistent>
                <v-sheet class="text-center" height="200px">
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
        <!-- End Alart Sheet -->
    </div>
</template>

<script>
// Import lazy load component for Navigation, AppFooter
const ArticleItem = () => import('@/components/fragments/Article')
const Comments = () => import('@/components/Comments')
// Import firebase app
import firebase from 'firebase/app'
// Import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'
// numeral for convert number
const numeral = require('numeral')
// markdown-it for render description
const md = require('markdown-it')()
            .use(require('markdown-it-sub'))
            .use(require('markdown-it-sup'))
            .use(require('markdown-it-deflist'))
            .use(require('markdown-it-container'), 'hljs-center')
            .use(require('markdown-it-container'), 'hljs-left')
            .use(require('markdown-it-container'), 'hljs-right')
            .use(require('markdown-it-abbr'))
            .use(require('markdown-it-footnote'))
            .use(require('markdown-it-ins'))
            .use(require('markdown-it-mark'));

export default {
    name: 'SingleArticle',
    data() {
        return {
            article: [], // single article array
            articles: [], // related articles array
            page: {
                url: window.location.origin + this.$route.path // get current URL
            },
            role: 2, // user role
            loading: false, // vuetify loading spinner for save/unsave
            loading2: false, // vuetify loading spinner for delete
            snackbar: false, // vuetify snackbar
            alartSheet: false, // vuetify sheet
            timeout: 2000, // set time out
            dialog: false, // vuetify dialog for confirm delete
            dialog2: false // vuetify dialog for confirm unsave
        }
    },
    watch: {
        // The reason for writing this code.
        // when user check or clicked related articles then load a new article 
        // current article set empty then load a new article when route change
        '$route.params.slug'() {
            this.article = []
            this.articles = []
            this.loadArticle() // call a function
        }
    },
    mounted() {
        // The reason for writing this code. 
        // the correct display of the current viewer will be increment -1 when the browser tab is closed
        // and when the browser tab is opened then urrent viewer will be increment +1

        // set a default params when params not exist
        let slug = this.$route.params.slug ? this.$route.params.slug : 'no-slug'
        // when the browser tab is closed then urrent viewer will be increment -1
        window.onblur = () => {
            localStorage.setItem("article-accessed", "") // set localStorage empty
            db.collection('articles')
            .where('slug', '==', slug).get()
            .then(snapshot => {
                if(!snapshot.empty) { // empty check
                    snapshot.forEach(doc => {
                        // set current viewer
                        let viewsCounterRef = db.collection('articles').doc(doc.id)
                        viewsCounterRef.update({ currentViewer: firebase.firestore.FieldValue.increment(-1) })
                    })
                }
            })
        }

        // when the browser tab is opened then urrent viewer will be increment +1
        window.onfocus = () => {
            localStorage.setItem("article-accessed", slug) // set slug to localStorage for check user access the route before
            db.collection('articles')
            .where('slug', '==', slug).get()
            .then(snapshot => {
                if(!snapshot.empty) { // empty check
                    snapshot.forEach(doc => {
                        // set current viewer
                        let viewsCounterRef = db.collection('articles').doc(doc.id)
                        viewsCounterRef.update({ currentViewer: firebase.firestore.FieldValue.increment(1) })
                    })
                }
            })
        }
    },
    created() {  
        this.loadArticle() // call a function
        this.getRelatedArticles() // call a function
    },
    methods: {
        // Delete article
        // when user delete an article 
        // then delete everything to related this article for example: images, comments, replies
        // and also delete saves from who save the article
        deleteArticle(articleId, image, description) { // get passing data from function
            this.loading2 = true // vuetify loading spinner for delete
            db.collection('articles').doc(articleId).delete()
            .then(() => {
                this.deleteDescriptionImages(image, description, articleId) // call a function and passing data
            }).catch(err => {
                console.log(err)
            })
        },
        // Delete all article images
        deleteDescriptionImages(image, description, articleId) { // get passing data from function
            let urls = description.match(/\bhttps?:\/\/\S+/gi) // find all urls from article description using regex
            var httpsReference = firebase.storage().refFromURL(image) // cover image reference
            var desertRef = firebase.storage().ref().child(httpsReference.fullPath)
            desertRef.delete().then(() => {
                // when cover image deleted then check description urls
                if(urls) {
                    // delete one by one by for loop
                    for(var i = 0; i < urls.length; i++) {
                        var httpsReference = firebase.storage().refFromURL(urls[i]) // get image reference
                        var desertRef = firebase.storage().ref().child(httpsReference.fullPath) // image delete by full path
                        desertRef.delete().then(() => {})
                        .catch((error) => {console.log(error)})
                    }
                }
                this.deleteComments(articleId) // call a function
                this.deleteSaves(articleId) // call a function
            }).catch((error) => {
                console.log(error)
            })
        },
        // Delete all saves article
        deleteSaves(articleId) { 
            db.collection('saves').where('articleId', '==', articleId).get()
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
        deleteComments(articleId) { // get passing data from function
            db.collection('comments').where('articleId', '==', articleId).get()
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
                    // if no comments here then redirect to home
                    this.$router.push({ name: 'Home' })
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
                            // when deleted successfully then redirect to home
                            this.$router.push({ name: 'Home' })
                        })
                    })
                }else {
                    // if no replies here then redirect to home
                    this.$router.push({ name: 'Home' })
                }
            }).catch(err => console.log(err))
        }, 
        // Load a single article by route params
        loadArticle() {
            db.collection('articles')
            .where('slug', '==', this.$route.params.slug).get()
            .then(snapshot => {
                if(!snapshot.empty) {
                    snapshot.forEach(doc => {
                        if(this.$store.state.user.loggedIn) { // check user logged in 
                            db.collection("users").doc(this.$store.state.user.data.uid).get() // get user data by user uid. this uid set in vuex store
                            .then((queryData) => {
                                this.role = queryData.data().role // get and set user role
                                // check article publish, user role and check article userId equal to current login user id
                                // this functionality use for article access single article permission
                                // article access permission for admin, article writer and article published granted
                                if(doc.data().published == 1 || this.role == 1 || doc.data().userId == this.$store.state.user.data.uid) {
                                    this.pushArticle(doc) // call function and passing data
                                }else {
                                    // However, it returns false from this condition then redirect to home
                                    this.$router.push({ name: 'Home' })
                                }
                            })
                        }else {
                            // check article publish or not
                            if(doc.data().published == 1) {
                                this.pushArticle(doc) // call function and passing data
                            }else {
                                this.$router.push({ name: 'Home' }) // article not published then redirect
                            }
                        }
                    })    
                }else {
                    // If article not found by route params then redirect to home
                    this.$router.push({ name: 'Home' })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // Push article
        pushArticle(doc) { // get passing data from function
            // check if article publish when article published then increment views
            if(doc.data().published == 1) {
                let viewsCounterRef = db.collection('articles').doc(doc.id)
                viewsCounterRef.update({ views: firebase.firestore.FieldValue.increment(1) })
            }

            let article = doc.data() // assigning data
            article.id = doc.id // set aticle id
            article.date = moment(doc.data().date).format('ll') // convert date
            article.description = md.render(doc.data().description) // render description for markdown editor value
            article.tags = doc.data().tags.join(", ") // convert array to string and separated by commas

            this.getArticlesCategory(article) // call function and passing data
            this.getArticleUserData(article) // call function and passing data

            // set real time update to count views and currentViewer
            db.collection("articles").doc(doc.id)
            .onSnapshot((doc) => {
                if(doc.exists) {
                    // convert number to k,m,b
                    let views = doc.data().views > 999 ? numeral(doc.data().views).format('0.0a') : doc.data().views
                    article.views = views // set real time update for views
                    article.currentViewer = doc.data().currentViewer // set real time update for currentViewer
                }
            })

            this.article.push(article) // push the article

            if(this.$store.state.user.loggedIn) { // check user logged in
                this.loading = true // vuetify loading spinner for save/unsave
                this.checkArticleSaveOrNot(article) // call a function 
            }
        },
        // Get article writer user data by userId
        getArticleUserData(article) { // get passing data from function
            db.collection("users").doc(article.userId).get()
            .then(function(querySnapshot) {
                article.currentUserId = article.userId // set user id
                article.userId = querySnapshot.data().name // replace usreId to name
                article.username = querySnapshot.data().username // set username
                article.userAvatar = querySnapshot.data().avatar // set avatar link
            }).catch(err => console.log(err))
        },
        // Save article
        saveArticle(articleId) { // get passing data from function
            this.loading = true // vuetify loading spinner for save/unsave
            db.collection('saves').add({
                userId: this.$store.state.user.data.uid, // get uid from vuex store
                articleId: articleId,
                time: Date.now() // javascript now() function for get current time
            }).then((snapshot) => {
                this.loading = false // vuetify loading spinner for save/unsave
                this.snackbar = true // vuetify snackbar for save message
            }).catch(err => {
                console.log(err)
            })
        },
        // Unsave article 
        unSaveArticle(articleId) { // get passing data from function
            this.loading = true // vuetify loading spinner for save/unsave
            db.collection('saves').where('articleId', '==', articleId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // delete save article
                    db.collection('saves').doc(doc.id).delete()
                    .then(() => {
                        this.loading = false // vuetify loading spinner for save/unsave
                        this.dialog = false // vuetify ldialog for confirm delete
                    }).catch(err => {
                        console.log(err)
                    })
                })
            }).catch(err => console.log(err))
        },
        // Get all related articles 
        getRelatedArticles() {
            db.collection('articles')
            .where("published", "==", 1) // article must be published
            .orderBy('date', 'asc').limit(6)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added') {
                        let article = change.doc.data() // assigning data
                        article.id = change.doc.id // set article id
                        article.date = moment(change.doc.data().date).format('ll') // convert date

                        this.getArticlesCategory(article) // call function and pass article data

                        if(this.$store.state.user.loggedIn) { // check if user logged in
                            this.checkArticleSaveOrNot(article) // call function and pass article data
                        }

                        this.articles.push(article) // push all data to data property array
                    }

                    if(change.type === 'removed') {
                        this.articles = this.articles.filter(article => { // filtering for real time data delete
                            return article.id != change.doc.id
                        })
                    }
                })
            })
        },
        // Articles category by category id
        getArticlesCategory(article) { // passing form functions
            db.collection("categories").doc(article.categoryId).get()
            .then(function(querySnapshot) {
                article.categoryId = querySnapshot.data().name // set category name and replace article categoryId to category name
                article.categorySlug = querySnapshot.data().slug // set category slug
            }).catch(err => console.log(err))
        },
        // Check article save or not because save button or unsave button are separated
        checkArticleSaveOrNot(article) {
            db.collection('saves').where('articleId', '==', article.id).where('userId', '==', this.$store.state.user.data.uid)
            .onSnapshot(snapshot => {
                this.loading = false // vuetify loading spinner for save/unsave
                article.save = snapshot.empty // set true/false
            })
        }
    },
    // When route enter to set current viewer increment +1
    beforeRouteEnter(to, from, next) {
        next() // and go to request page
        if(localStorage.getItem("article-accessed") != to.params.slug) { // check user already accessed the article
            db.collection('articles')
            .where('slug', '==', to.params.slug).get()
            .then(snapshot => {
                if(!snapshot.empty) { // if not empty
                    snapshot.forEach(doc => {
                        let viewsCounterRef = db.collection('articles').doc(doc.id)
                        viewsCounterRef.update({ currentViewer: firebase.firestore.FieldValue.increment(1) }) // firebase increment
                        localStorage.setItem("article-accessed", to.params.slug) // if user accessed this route then set to localStorage this article slug because it's help to identify current viewer
                    })
                }
            })
        }
    },
    // When route leave to set current viewer increment -1
    beforeRouteLeave(to, from, next) {
        next()
        // set localStorage empty
        localStorage.setItem("article-accessed", "")
        db.collection('articles')
        .where('slug', '==', from.params.slug).get() // get router params
        .then(snapshot => {
            if(!snapshot.empty) { // if not empty
                snapshot.forEach(doc => {
                    // set value -1 to databese
                    let viewsCounterRef = db.collection('articles').doc(doc.id)
                    viewsCounterRef.update({ currentViewer: firebase.firestore.FieldValue.increment(-1) }) // firebase increment
                })
            }
        })
    },
    components: {
        ArticleItem, // Article item component
        Comments // Comments component
    }
}
</script>

<style>
/* Mobile cover image */
.single-article .mobile-cover {display: none;}
/* Left content box middle */
.single-article .box {
    display: table;
    width: 100%;
    height: 100%;
}
.single-article .box .middle {
    display: table-cell;
    vertical-align: middle;
}
/* Left content box text */
.single-article .box h3 {
    font-size: 30px;
    font-weight: 400;
}
.single-article .box h5 {font-size: 16px; font-weight: bold;}
.single-article .box h5 a {color: #000;}
.single-article .box p {font-size: smaller;}
/* Left content box reactions */
.single-article .reactions {margin-left: -10px;}
/* Left content box descriptions */
.single-article .descriptions {
    margin: 0 200px; 
}

/* Descriptions text and image */
.single-article .descriptions .main-data {text-align: justify;}
.single-article .descriptions .main-data img {width: 100%;}

/* Markdown editor style */
.hljs-center {text-align: center;}
.hljs-left {text-align: left;}
.hljs-right {text-align: right;}
blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: .25em solid #dfe2e5;
}
table {
    display: block;
    width: 100%;
    overflow: auto;
}
table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
}
table td, table th {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
}

/* Dark & Light theme input, textarea color */
.theme--light .v-input--is-focused input, .theme--light .v-input--is-focused textarea {
    color: white !important;
}
.theme--light .v-input input, .theme--light .v-input textarea {
    color: black;
}
.theme--dark .v-input--is-focused input, .theme--dark .v-input--is-focused textarea {
    color: black !important;
}
.theme--dark.v-input input, .theme--dark.v-input textarea {
    color: white;
}

/* Small to large handset */
@media (max-width: 600px) { 
    .single-article .mobile-cover {display: block;}
    .single-article .desktop-cover {display: none;}
    .single-article .mobile-cover .v-image {height: 260px !important;}
    .single-article .box {padding-top: 20px;}
    .single-article .box a {font-size: 15px;}
    .single-article .box h3 {font-size: 24px;}
    .single-article .descriptions {margin: 0;}
}

/* Small to medium tablet */
@media (min-width: 600px) {
    .single-article .mobile-cover {display: block;}
    .single-article .desktop-cover {display: none;}
    .single-article .mobile-cover .v-image {height: 380px !important;}
    .single-article .box {padding-top: 20px;}
    .single-article .descriptions {margin: 0;}
}

/* Large tablet to laptop */
@media (min-width: 960px) {
    .single-article .desktop-cover {display: block;}
    .single-article .mobile-cover {display: none;}
    .single-article .desktop-cover .v-image {height: 340px !important;}
    .single-article .box {padding-top: 0;}
    .single-article .box h3 {font-size: 24px;}
    .single-article .descriptions {margin: 0 100px;}
}

/* Desktop */
@media (min-width: 1264px) {
    .single-article .desktop-cover {display: block;}
    .single-article .mobile-cover {display: none;}
    .single-article .desktop-cover .v-image {height: 360px !important;}
    .single-article .box {padding-top: 0;}
    .single-article .box h3 {font-size: 30px;}
    .single-article .descriptions {margin: 0 200px;}
}
</style>