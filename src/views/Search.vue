<template>
    <div class="articles-by-category">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Search - ' + this.$route.params.inputText"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- Search header text -->
        <div class="head-text text-center m-4 mb-0">
            <p class="mb-2 text-muted" style="font-size:18px">Search results for:</p>
            <h3 class="font-weight-bold mb-1">{{ this.$route.params.inputText }}</h3>
        </div>
        <!-- Search header text end -->
        <!-- Switch for user search on/off -->
        <v-container class="pl-5">
            <v-switch v-model="switch1" inset :label="`User Search ${switch1 ? 'On' : 'Off'}`" :loading="loading"></v-switch>
        </v-container>
        <!-- Container Start -->
        <v-container v-if="!switch1">
            <v-row>
                <!-- For loop -->
                <v-col
                    v-for="article in articleSearch"
                    :key="article.id"
                    cols="12"
                    xs="12"
                    sm="6"
                    md="4"
                    lg="4"
                    xl="3"
                    class="pt-0"
                >
                <!-- Article item component -->
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
                    :description="article.description"
                    :userId="article.userId"
                ></article-item>
                </v-col>
            </v-row>
        </v-container>
        <!-- Container end -->
        <!-- Container Start -->
        <v-container v-if="articleSearch == '' ? switch1 = true : switch1 = false">
            <v-row>
                <!-- For loop -->
                <v-col
                    v-for="(user, i) in userSearch"
                    :key="i"
                    cols="12"
                    xs="12"
                    sm="6"
                    md="3"
                    lg="3"
                    xl="4"
                >
                    <!-- Useing lazy load -->
                    <v-lazy
                        v-model="lazyLoad"
                        :options="{
                            threshold: .5
                        }"
                        transition="fade-transition"
                    >
                    <!-- Card -->
                    <v-card class="mx-auto" :to="'/profile/' + user.username">
                            <!-- User avatar -->
                            <v-img
                                class="grey lighten-2 white--text align-end"
                                height="250px"
                                :src="user.avatar"
                                :lazy-src="user.avatar"
                                aspect-ratio="1"
                            >
                                <!-- Loading -->
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
                       
                        <v-card-actions>
                            <div class="mx-auto">
                                <!-- User social media URL -->
                                <a :href="'https://www.facebook.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-facebook</v-icon></v-btn></a>
                                <a :href="'https://www.instagram.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-instagram</v-icon></v-btn></a>
                                <a :href="'https://www.twitter.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-twitter</v-icon></v-btn></a>
                                <a :href="'https://www.pinterest.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"><v-icon small>mdi-pinterest</v-icon></v-btn></a>
                            </div>
                        </v-card-actions>
                    </v-card>
                    <!-- Card End -->
                    </v-lazy>
                    <!-- End lazyload -->
                </v-col>
            </v-row>
        </v-container>
        <!-- Container end -->
        <!-- When no article found then show this component -->
        <no-article v-if="articleSearch == '' && userSearch == ''"></no-article>
    </div>
</template>

<script>
// Import lazy load component for ArticleItem, NoArticle
const ArticleItem = () => import('@/components/fragments/Article')
const NoArticle = () => import('@/components/fragments/NoArticle')
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'

export default {
    name: 'Search',
    data() {
      return {
        switch1: false, // switch for user search on/off
        loading: false, // vuetify loading
        url: window.location.href, // get current url
        favIconUrl: '', // set fav icon URL
        description: '', // set description
        keywords: [], // set keywords
        articles: [], // all articles array
        users: [] // all users array
      }
    },
    computed: {
        // filtering article
        articleSearch() {
            if(this.$route.params.inputText){ // check route params exist or not
               return this.articles.filter(article => {
                   // article search by titlle and article tags
                    return article.title.toLowerCase().includes(this.$route.params.inputText.toLowerCase()) ||
                    article.tags.some(tag => tag.toLowerCase().includes(this.$route.params.inputText.toLowerCase()))
                })
            }
        },
        // filtering user
        userSearch() {
            if(this.$route.params.inputText){ // check route params exist or not
                return this.users.filter(user => {
                    // article search by name and username
                    return user.name.toLowerCase().includes(this.$route.params.inputText.toLowerCase()) ||
                    user.username.toLowerCase().includes(this.$route.params.inputText.toLowerCase())
                })
            }
        }
    },
    watch: {
      // watching vuetify switch on/off
      switch1() {
        this.users = []
        this.searchUsers() // call a function
      }
    },
    created() {
      // get general settings from datebase
      db.collection('settings').doc('general-settings')
      .onSnapshot(doc => {
          this.favIconUrl = doc.data().favIcon
      })

      // get seo settings from datebase
      db.collection('settings').doc('seo').get()
      .then(doc => {
          this.description = doc.data().description,
          this.keywords = doc.data().keywords
      })

      // get all articles from datebase
      db.collection('articles')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if(change.type === 'added') {
                let article = change.doc.data()
                article.id = change.doc.id // set article id
                article.date = moment(change.doc.data().date).format('ll') // convert date
                this.articles.push(article) // push all articles

                this.getArticlesCategory(article) // call a function

                if(this.$store.state.user.loggedIn) { // check user logged in
                    // check article save or not
                    db.collection('saves').where('articleId', '==', article.id).where('userId', '==', this.$store.state.user.data.uid)
                    .onSnapshot(snapshot => {
                        article.save = snapshot.empty // set true/false
                    })
                }
            }

            if(change.type === 'removed') {
                // filter deleted articles
                this.articles = this.articles.filter(article => {
                    return article.id != change.doc.id
                })
            }
        })
      })
      this.searchUsers() // call a function
    },
    methods: {
        // get article category
        getArticlesCategory(article) {
            db.collection("categories").doc(article.categoryId).get()
            .then(function(querySnapshot) {
                article.categoryId = querySnapshot.data().name
                article.categorySlug = querySnapshot.data().slug
            })
        },
        // get all users
        searchUsers() {
            if(this.switch1) {
                this.loading = true
                db.collection('users').get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        this.loading = false
                        let user = doc.data()
                        this.users.push(user)
                    })
                })
            }
        }
    },
    components: {
        // register component
        ArticleItem,
        NoArticle
    }
}
</script>