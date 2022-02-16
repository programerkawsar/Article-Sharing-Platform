<template>
    <div class="articles-by-category">
         <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="categoryName + ' - ' + appName"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- Header text -->
        <div class="head-text text-center m-4 mb-0">
            <h3 class="font-weight-bold mb-1">{{ categoryName }}</h3>
            <p class="m-0 text-muted font-weight-bold">{{ totalArticles }} Articles</p>
        </div>
        <!-- Header text end -->
        <!-- Container Start -->
        <v-container v-if="articles != ''">
            <v-row>
                <!-- For loop -->
                <v-col
                    v-for="article in articles"
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
            <!-- Load More button -->
            <div class="text-center m-4" v-if="articles.length != 0 && articles.length != totalArticles">
                <v-btn color="black white--text" elevation="0" :loading="loading" @click="loadArticles()"><v-icon class="mr-1">mdi-reload</v-icon> Load More</v-btn>
            </div>
        </v-container>
        <!-- Container End -->
        <!-- When no article found then show this component -->
        <no-article v-else></no-article>
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
    name: 'ArticlesByCategory',
    data() {
      return {
        loading: false, // vuetify loading
        url: window.location.href, // get current URL
        favIconUrl: '', // set fav icon URL
        appName: '', // set aplication name
        description: '', // set description
        keywords: [], // set keywords
        articles: [], // all articles array
        totalArticles: 0, // total items
        categoryName: '', // category name
        lastTime: 0 // last time for load more article
      }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.favIconUrl = doc.data().favIcon
            this.appName = doc.data().appName
        })

        // get seo settings from datebase
        db.collection('settings').doc('seo').get()
        .then(doc => {
            this.description = doc.data().description,
            this.keywords = doc.data().keywords
        })

        // get article by category
        db.collection('categories').where('slug', '==', this.$route.params.slug).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.categoryName = doc.data().name // set category name
                db.collection('articles').where('categoryId', '==', doc.id).where("published", "==", 1).orderBy('date', 'desc').limit(9) // article must be published
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            this.pushArticle(change) // call a function
                        }

                        // delteing article by real time
                        if(change.type === 'removed') {
                            this.articles = this.articles.filter(article => {
                            return article.id != change.doc.id
                            })
                        }
                    })

                    let last = snapshot.docs[snapshot.docs.length - 1] // get last item
                    if(last) {
                        this.lastTime = last.data().date // set last date
                    }

                    // count how many articles here
                    let allCount = db.collection('articles').where('categoryId', '==', doc.id).where("published", "==", 1)
                    allCount.onSnapshot((snapshot) => {
                        this.totalArticles = snapshot.size
                    })
                })
            })
        })
    },
    methods: {
      loadArticles() {
          this.loading = true // vuetify loading 

          db.collection('categories').where('slug', '==', this.$route.params.slug).get() // get route params
          .then(snapshot => {
          snapshot.forEach(doc => {
            let next = db.collection('articles')
            .where('categoryId', '==', doc.id) // article by category id 
            .where("published", "==", 1) // article mush be published
            .orderBy('date', 'desc')
            .startAfter(this.lastTime) // set last time 
            .limit(9)

                next.onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            this.loading = false // vuetify loading 
                            this.pushArticle(change) // call a function and passing data
                        }

                        // filtering article for deleteing adtile real time
                        if(change.type === 'removed') {
                            this.articles = this.articles.filter(article => {
                                return article.id != change.doc.id
                            })
                        }
                    })

                    let last = snapshot.docs[snapshot.docs.length - 1] // get last item
                    if(last) {
                        this.lastTime = last.data().date // set last time
                    }
                })
            })
        }).catch(err => console.log(err))
      }, 
      // push article
      pushArticle(change) { // get data from passing function
            let article = change.doc.data()
            article.id = change.doc.id
            article.date = moment(change.doc.data().date).format('ll') // convert date
            this.articles.push(article) // push article to array

            // get article category
            db.collection("categories").doc(article.categoryId).get()
            .then(function(querySnapshot) {
                article.categoryId = querySnapshot.data().name
                article.categorySlug = querySnapshot.data().slug
            })

            if(this.$store.state.user.loggedIn) { // check user logged in
                // get user uid form vuex store
                db.collection('saves').where('articleId', '==', article.id).where('userId', '==', this.$store.state.user.data.uid)
                .onSnapshot(snapshot => {
                    article.save = snapshot.empty // set true/false
                })
            }
      }
    },
    components: {
        // register components
        ArticleItem,
        NoArticle
    }
}
</script>