<template>
    <div class="admin-articles-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Slider Settings - ' + appName"
        />
        <!-- Set HeadFul End -->
        <!-- Search input -->
        <v-text-field
          class="mt-2"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          solo
        ></v-text-field>
        <!-- Data table start -->
        <v-data-table
            :headers="headers"
            :items="desserts"
            :search="search"
            class="elevation-1"
            :class="$vuetify.theme.dark ? 'table-dark' : ''"
            :loading="dataLoading" 
            loading-text="Loading... Please wait"
        >
            <!-- Slider image -->
            <template v-slot:item.image="{ item }">
              <router-link :to="'/article/' + item.categorySlug + '/' + item.slug">
                    <!-- Image -->
                    <v-img
                        :src="item.image"
                        :lazy-src="item.image"
                        aspect-ratio="1"
                        class="grey lighten-2 m-2"
                        max-width="80"
                        max-height="80"
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
                </router-link>
            </template>
            <!-- article link -->
            <template v-slot:item.title="{ item }">
                <router-link :to="'/article/' + item.categorySlug + '/' + item.slug">
                    {{ item.title }}
                </router-link>
            </template>
            <!-- table header -->
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>All Articles</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <!-- add button -->
                    <v-btn
                        :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'"
                        dark
                        class="mb-2"
                        :to="{ name: 'AddArticle' }"
                    >
                        Add One
                    </v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <!-- data table buttons -->
                <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" v-if="item.slider != 1" class="mt-2" @click="approveArticle(item)"><v-icon>mdi-check</v-icon></v-btn>
                <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'error'" v-else class="mb-2 mt-2" @click="approveDecline(item)"><v-icon>mdi-close</v-icon></v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
    </div>
</template>
<script>
// import firebase app
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'
// numeral for convert number
const numeral = require('numeral')

export default {
    name: 'AdminSliders',
    data() {
        return {
            loading: false, // vuetify loading 
            dataLoading: false, // vuetify data table loading 
            appName: '', // set aplication name
            search: '', // vuetify data table search
            // vuetify data table headers
            headers: [
                { text: 'Serial', value: 'serial', sortable: false },
                { text: 'Image', width: "10%", value: 'image', sortable: false },
                {
                  text: 'Title',
                  sortable: false,
                  value: 'title',
                  width: "20%",
                },
                { text: 'Category', width: "15%", value: 'categoryId', sortable: false },
                { text: 'Writer',  width: "15%", value: 'userId', sortable: false },
                { text: 'Views', value: 'views', sortable: false },
                { text: 'Comments',  width: '10%', value: 'comments', sortable: false },
                { text: 'Date', width: "15%", value: 'date' },
                { text: 'Actions', width: '5%', value: 'actions', sortable: false },
            ],
            desserts: [], // vuetify data table data
            editedIndex: -1, // vuetify data table editedIndex
            editedItem: { // user editedItem property
                id: ''
            }
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })
        
        this.initialize() // call a function
    },
    methods: {
        // initialize data to data table
        initialize() {
            var i = 0 // data table increment value
            this.dataLoading = true // data table loading
            db.collection('articles').orderBy('date', 'desc').onSnapshot(snapshot => {
                this.dataLoading = false // data table loading
                snapshot.docChanges().forEach(change => {
                    i++ // data table increment value
                    let article = change.doc.data()
                    article.serial = i // set data table increment value
                    article.comments = 0 // set comments value defualt 0
                    article.id = change.doc.id
                    // title length set
                    article.title = change.doc.data().title.length > 30 ? change.doc.data().title.substring(0, 30) + '...' : change.doc.data().title
                    article.date = moment(change.doc.data().date).format('ll') // convert date
                    // convert number
                    article.views = change.doc.data().views > 999 ? numeral(change.doc.data().views).format('0.0a') : change.doc.data().views

                    this.getArticlesCategory(article) // call a function and passing data

                    // get user name
                    db.collection("users").doc(article.userId).get()
                    .then(function(querySnapshot) {
                        article.userId = querySnapshot.data().name // replace user Id to name
                    }).catch(err => console.log(err))

                    this.getTotalCommentsByArticle(article) // call a function and passing data

                    if(change.type === 'added') {
                        this.desserts.push(article) // push article
                    }

                    // when updated data then modified real time by editedIndex
                    if(change.type === "modified") {
                        article.serial = this.editedIndex+1
                        this.desserts.splice(this.editedIndex, 1, article)
                    }
                })
            })
      },
      // get category name & slug
      getArticlesCategory(article) {
            db.collection("categories").doc(article.categoryId).get()
            .then(function(querySnapshot) {
                article.categoryId = querySnapshot.data().name
                article.categorySlug = querySnapshot.data().slug
            }).catch(err => console.log(err))
      },
      // get total comments on article
      getTotalCommentsByArticle(article) { // get passing data from function
            db.collection("comments").where('articleId', '==', article.id).get()
            .then(function(querySnapshot) {
                // convert number
                let total = querySnapshot.size > 999 ? numeral(querySnapshot.size).format('0.0a') : querySnapshot.size
                article.comments = total // addign data
            }).catch(err => console.log(err))
      },
      // approve article
      approveArticle(item) {
          this.loading = true // vuetify loading
          // assign data
          this.editedIndex = this.desserts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          // update slider status
          db.collection('articles').doc(item.id).update({
              slider: 1
          }).then(() => {
              this.loading = false
          })
      },
      // decline article
      approveDecline(item) {
          this.loading = true // vuetify loading
          // assign data
          this.editedIndex = this.desserts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          // update slider status
          db.collection('articles').doc(item.id).update({
              slider: 2
          }).then(() => {
              this.loading = false
          })
      }
    }
}
</script>

<style scoped>
/*  data table styles */
.admin-articles-list {
  width: 100%;
  padding-left: 30px;
}
.admin-articles-list .v-avatar i {
  font-size: 16px;
}
</style>