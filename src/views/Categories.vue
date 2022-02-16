<template>
  <div class="categories">
    <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
    <vue-headful
        :title="'Categories - ' + appName"
        :description="description"
        :keywords="keywords"
        :image="favIconUrl"
        :url="url"
    />
    <!-- Set HeadFul End -->
     <!-- Header text -->
    <div class="head-text text-center m-4 mb-0">
      <h3 class="font-weight-bold mb-1">All Categories</h3>
      <p class="m-0 text-muted font-weight-bold">{{ totalItems }} category here</p>
    </div>
    <!-- Header text end -->
    <!-- Container Start -->
    <v-container v-if="categories != ''">
      <v-row>
        <!-- For loop -->
        <v-col
          v-for="(category, i) in categories"
          :key="'N' + i"
          cols="12"
          xs="12"
          sm="6"
          md="4"
          lg="4"
          xl="3"
        >
            <v-card class="p-2 m-2" :color="$vuetify.theme.dark ? 'grey darken-4' : '#f5f5f5'" height="230px" :to="{ name: 'ArticlesByCategory', params : { slug: category.slug } }">
              <v-card-text class="category-text" align="center">
                  <div class="middle">
                    <h3>{{ category.name }}</h3>
                    <p>{{ category.totalArticles }} Articles</p>
                  </div>
              </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- Container End -->
    <!-- When no article found then show this component -->
    <no-article v-else></no-article>
  </div>
</template>

<script>
// Import lazy load component for NoArticle
const NoArticle = () => import('@/components/fragments/NoArticle')
// import firebase database
import db from '@/firebase/init'

export default {
  name: 'Categories',
  data() {
    return {
      url: window.location.href, // get current url
      favIconUrl: '', // set fav icon URL
      appName: '', // set aplication name
      description: '', // set description
      keywords: [], // set keywords
      totalItems: 0, // total items
      categories: [] // all categories array
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

    // get all categories
    db.collection('categories')
    .onSnapshot(snapshot => {
      this.totalItems = snapshot.size // total categories
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          let category = change.doc.data()
          category.id = change.doc.id
          this.categories.push(category)

          db.collection('articles').where('categoryId', '==', category.id)
          .onSnapshot(snapshot => {
            category.totalArticles = snapshot.size // count how many articles on this category
          })
        }
      })
    })
  },
  components: {
    NoArticle // register component
  }
}
</script>

<style scoped>
/* category text style */
.category-text {
  display: table;
  width: 100%;
  height: 100%;
}
.category-text .middle {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.category-text h3 {
  margin: 0;
  font-weight: 400;
  color: #000;
  font-size: 24px;
}
.theme--light .category-text h3 {
  color: #000;
}
.theme--dark .category-text h3 {
  color: #fff;
}
.categories .v-image {border-radius: 10px !important;}
</style>
