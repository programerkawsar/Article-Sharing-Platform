<template>
  <div class="saved">
    <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
    <vue-headful
        :title="'Saved - ' + appName"
        :description="description"
        :keywords="keywords"
        :image="favIconUrl"
        :url="url"
    />
     <!-- Set HeadFul End -->
     <!-- Header text -->
    <div class="head-text text-center m-4 mb-0">
      <h3 class="font-weight-bold mb-1">Saved Articles</h3>
      <p class="m-0 text-muted font-weight-bold">{{ totalItems }} items saved</p>
    </div>
    <!-- Header text end -->
    <!-- Container Start -->
    <v-container v-if="articles != ''">
      <v-row>
        <!-- For loop -->
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
      <!-- Load article button -->
      <div class="text-center m-4"  v-if="articles.length != 0 && articles.length != totalItems">
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
  name: 'Saved',
  data() {
    return {
      loading: false, // vuetify loading
      url: window.location.href, // get current url
      favIconUrl: '', // set fav icon URL
      appName: '', // set aplication name
      description: '', // set description
      keywords: [], // set keywords
      totalItems: 0, // total items
      articles: [], // all articles array
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

    // get all articles by userId
    db.collection('saves').where('userId', '==', this.$store.state.user.data.uid).orderBy('time', 'desc').limit(9) // get uid form vuex
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          // get articles
          db.collection('articles').doc(change.doc.data().articleId).get()
          .then(doc => {
              if(doc.exists) {
                let article = doc.data()
                article.id = doc.id
                article.date = moment(doc.data().date).format('ll') // convert date
                this.articles.push(article) // push article

                this.getArticlesCategory(article) // call a function

                if(this.$store.state.user.loggedIn) { // check user logged in
                  this.checkArticleSaveOrNot(article) // call a function
                }
              }
            }).catch(err => console.log(err))
        }

        if (change.type === 'removed') {
            // remove all deleted article real time
            this.articles = this.articles.filter(article => {
                return article.id != change.doc.data().articleId
            })
        }
      })

      let last = snapshot.docs[snapshot.docs.length - 1] // get last item
      if(last) {
          this.lastTime = last.data().time // set last time
      }
    })

    // count how many saved articles here
    let allCount = db.collection('saves').where('userId', '==', this.$store.state.user.data.uid)
    allCount.onSnapshot((snapshot) => {
        this.totalItems = snapshot.size
    })
  },
  methods: {
      // load article
      loadArticles() {
          this.loading = true // vuetify loading
          let next = db.collection('saves')
          .where('userId', '==', this.$store.state.user.data.uid) // get uid form vuex
          .orderBy('time', 'desc')
          .startAfter(this.lastTime) // assign lastTime
          .limit(9)

          next.onSnapshot((snapshot) => {
              snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                  // get articles
                  db.collection('articles').doc(change.doc.data().articleId).get()
                  .then(doc => {
                      this.loading = false
                      let article = doc.data()
                      article.id = doc.id
                      article.date = moment(doc.data().date).format('ll') // convert date
                      this.articles.push(article) // push article

                      this.getArticlesCategory(article) // call a function

                      if(this.$store.state.user.loggedIn) { // check user logged in
                        this.checkArticleSaveOrNot(article) // call a function
                      }
                    }).catch(err => console.log(err))
                }

                if (change.type === 'removed') {
                    // remove all deleted article real time
                    this.articles = this.articles.filter(article => {
                        return article.id != change.doc.data().articleId
                    })
                }
              })

              let last = snapshot.docs[snapshot.docs.length - 1] // get last item
              if(last) {
                  this.lastTime = last.data().time // set last time
              }
          })
      },
      // get article category
      getArticlesCategory(article) { // get passing data from function
          db.collection("categories").doc(article.categoryId).get()
          .then(function(querySnapshot) {
              // assigning data
              article.categoryId = querySnapshot.data().name
              article.categorySlug = querySnapshot.data().slug
          }).catch(err => console.log(err))
      },
      // check article save or not
      checkArticleSaveOrNot(article) {
          db.collection('saves').where('articleId', '==', article.id).where('userId', '==', this.$store.state.user.data.uid)
          .onSnapshot(snapshot => {
              article.save = snapshot.empty // set true/false
          })
      }
  },
  components: {
    // register components
    ArticleItem,
    NoArticle
  }
}
</script>

