<template>
  <div>
    <!-- vuetify container -->
    <v-container v-if="articles != ''">
      <v-row>
        <!-- for loop -->
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
      <!-- Load more button -->
      <div class="text-center m-4" v-if="articles.length != 0 && articles.length != totalArticles">
          <v-btn color="black white--text" elevation="0" :loading="loading" @click="loadArticles()"><v-icon class="mr-1">mdi-reload</v-icon> Load More</v-btn>
      </div>
    </v-container>
    <!-- vuetify container end -->
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
    name: 'Reverse',
    data() {
      return {
        loading: false, // vuetify loading
        articles: [], // all articles array
        totalArticles: 0, // total items
        lastTime: 0 // last time for load more article
      }
    },
    created() {
      // Get all articles 
      db.collection('articles').orderBy('date', 'asc')
      .where("published", "==", 1) // article must be published
      .limit(9)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            this.pushArticle(change) // push all data to data property array
          }

          if(change.type === 'removed') {
            this.articles = this.articles.filter(article => { // filtering for real time data delete
              return article.id != change.doc.id
            })
          }
        })

        let last = snapshot.docs[snapshot.docs.length - 1]; // get last item
        if(last) {
            this.lastTime = last.data().date // set last time
        }

        // count how many articles here
        let allCount = db.collection('articles').where("published", "==", 1)
        allCount.onSnapshot((snapshot) => {
            this.totalArticles = snapshot.size
        })
      })
    },
    methods: {
      // load article
      loadArticles() {
          this.loading = true // vuetify loading
          let next = db.collection('articles')
          .orderBy('date', 'asc')
          .startAfter(this.lastTime) // assign lastTime
          .limit(9)

          next.onSnapshot((snapshot) => {
              snapshot.docChanges().forEach(change => {
                if(change.type === 'added') {
                  this.loading = false // vuetify loading
                  this.pushArticle(change) // push all data to data property array
                }

                if(change.type === 'removed') {
                  // remove all deleted article real time
                  this.articles = this.articles.filter(article => {
                    return article.id != change.doc.id
                  })
                }
              })

              let last = snapshot.docs[snapshot.docs.length - 1]; // get last item
              if(last) {
                this.lastTime = last.data().date // set last time
              }
          })
      },
      // push article
      pushArticle(change) { // get data form passing function
        let article = change.doc.data() // assign data
        article.id = change.doc.id
        article.date = moment(change.doc.data().date).format('ll') // convert date
        this.articles.push(article) // push all data to data property array

        // get category name & slug
        db.collection("categories").doc(article.categoryId).get()
        .then(function(querySnapshot) {
          article.categoryId = querySnapshot.data().name
          article.categorySlug = querySnapshot.data().slug
        })

        if(this.$store.state.user.loggedIn) { // check user login or not
          // check article save or not
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