<template>
    <div class="admin-articles-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Article Settings - ' + appName"
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
          <!-- Article cover image -->
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
          <!-- Article cover image end -->
          <!-- Article link -->
          <template v-slot:item.title="{ item }">
              <router-link :to="'/article/' + item.categorySlug + '/' + item.slug">
                  {{ item.title }}
              </router-link>
          </template>
           <!-- Article status -->
          <template v-slot:item.published="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-avatar v-on="on" :color="item.published == 1 ? 'success' : 'warning'" size="26px">
                  <v-icon dark>mdi-{{ item.published == 1 ? 'check-circle' : 'alert-circle' }}</v-icon>
                </v-avatar>
              </template>
              <span>{{ item.published == 1 ? 'Active' : 'Pending' }}</span>
            </v-tooltip>
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
                <!-- Add button -->
                <v-btn
                   :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'"
                    dark
                    class="mb-2"
                    :to="{ name: 'AddArticle' }"
                >
                    Add One
                </v-btn>
                <!-- Update article dialog -->
                <v-dialog v-model="dialog" max-width="500px">
                  <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="updateArticle(editedItem.id, editedItem.ownerId)"
                  >
                  <v-card>
                      <v-card-title>
                        <span class="headline">Edit Article</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                            <v-row>                                                        
                              <v-col cols="12" sm="12" md="12">
                                  <v-select
                                    label="Status"
                                    v-model="editedItem.status"
                                    :rules="rules.statusRules"
                                    :items="selectStatus"
                                    item-text="text"
                                    item-value="value"
                                  ></v-select>
                              </v-col>
                            </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'red darken-1'" text @click="dialog = false">Cancel</v-btn>
                        <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text :disabled="!valid || loading" :loading="loading" type="submit">Update Article</v-btn>
                      </v-card-actions>
                  </v-card>
                  </v-form>
                </v-dialog>
                <!-- Update article dialog end -->
            </v-toolbar>
            </template>
            <!-- table header end -->
            <template v-slot:item.actions="{ item }">
              <!-- table item buttons -->
              <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" class="mb-2" @click="editItem(item)">Edit</v-btn>
              <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'error'" @click=" selecteArticleId(item.id, item.ownerId, item.image, item.description)">Delete</v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
         <!-- delete article dialog -->
        <v-dialog v-model="dialog2" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Are you sure to delete the article?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'error darken-1'" text @click="dialog2 = false">Disagree</v-btn>
              <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'green darken-1'" text @click="deleteItem()" :loading="loading2">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>
<script>
// import firebase app
import firebase from 'firebase/app'
// import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'
// numeral for convert number
const numeral = require('numeral')

export default {
    name: 'AdminArticles',
    data() {
        return {
            valid: true, // vuetify form valid 
            dialog: false, // edit article dialog
            dialog2: false, // delete article dialog
            loading: false, // vuetify button loading
            loading2: false, // vuetify button loading
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
                { text: 'Category', width: "12%", value: 'categoryId', sortable: false },
                { text: 'Writer',  width: "15%", value: 'userId', sortable: false },
                { text: 'Views', value: 'views', sortable: false },
                { text: 'Comments', value: 'comments', sortable: false },
                { text: 'Status', value: 'published', sortable: false },
                { text: 'Date', width: "10%", value: 'date' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            desserts: [], // vuetify data table data
            articleId: '', // store article id
            ownerId: '', // store article owner id
            currentImage: '', // store article
            currentDescription: '', // store article current image
            selectStatus: [ // user status property
              {
                text: 'Active',
                value: 1,
              },
              {
                text: 'Pending',
                value: 2,
              }
            ],
            editedIndex: -1, // vuetify data table editedIndex
            editedItem: { // vuetify data table editedItem property
                id: '',
                ownerId: '',
                currentDescription: '',
                status: 0,
            },
            rules: { // validtion rules
              statusRules: [
                  v => !!v || 'Status is required',
              ]
            }
        }
    },
    created () {
      // get general settings from datebase
      db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

      this.initialize() // call a function for load data
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
                article.serial = i
                article.comments = 0 // set data table increment value
                article.id = change.doc.id
                // convert article title length
                article.title = change.doc.data().title.length > 30 ? change.doc.data().title.substring(0, 30) + '...' : change.doc.data().title
                article.date = moment(change.doc.data().date).format('ll') // convert date
                // convert number
                article.views = change.doc.data().views > 999 ? numeral(change.doc.data().views).format('0.0a') : change.doc.data().views

                this.getArticlesCategory(article) // call a function and passing data

                this.getArticleUserData(article) // call a function and passing data

                this.getArticleComments(article) // call a function and passing data

                if(change.type === 'added') {
                    this.desserts.push(article) // push article
                }

                // when updated data then modified real time by editedIndex
                if(change.type === "modified") {
                    article.serial = this.editedIndex+1
                    this.desserts.splice(this.editedIndex, 1, article)
                }

                // when deleted data then removed real time
                if(change.type === 'removed') {
                    this.desserts = this.desserts.filter(item => {
                        return item.id != change.doc.id
                    })
                }
            })
        })
      },
      // get article category by id
      getArticlesCategory(article) {
        db.collection("categories").doc(article.categoryId).get()
        .then(function(querySnapshot) {
            article.categoryId = querySnapshot.data().name
            article.categorySlug = querySnapshot.data().slug
        }).catch(err => console.log(err))
      },
      // get article user data by id
      getArticleUserData(article) {
        db.collection("users").doc(article.userId).get()
        .then(function(querySnapshot) {
            article.userId = querySnapshot.data().name
            article.ownerId = querySnapshot.id
        }).catch(err => console.log(err))
      },
      // get article totat comments
      getArticleComments(article) {
        db.collection("comments").where('articleId', '==', article.id).get()
        .then(function(querySnapshot) {
            // convert number
            let total = querySnapshot.size > 999 ? numeral(querySnapshot.size).format('0.0a') : querySnapshot.size
            article.comments = total
        }).catch(err => console.log(err))
      },
      // assign user data to dialog
      editItem(item) {
        item.status = item.published // set published status
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      // update article
      updateArticle(id, ownerId) { // get passing data from function
        this.loading = true // vuetify loading
        if(this.$refs.form.validate()) { // check form error
          // update article status
          db.collection("articles").doc(id).update({
              published: this.editedItem.status
          }).then(() => {
              this.loading = false // vuetify loading
              this.dialog = false // vuetify dialog
              if(this.editedItem.status == 1) {
                // set a  notification
                db.collection('notifications').add({
                    ownerId: ownerId,
                    userId: this.$store.state.user.data.uid, // get uid form vuex store
                    articleId: id,
                    categoryId: "",
                    time: Date.now(),
                    text: 'well done your article has been published',
                    unseenAll: true
                })
              }
          }).catch(err => {
            console.log(err)
            this.loading = false // vuetify dialog
          })
        }
      },
      // select article data for delete article
      selecteArticleId(articleId, ownerId, currentImage, currentDescription) { // get passing data from function
        this.dialog2 = true
        this.articleId = articleId
        this.ownerId = ownerId
        this.currentImage = currentImage
        this.currentDescription = currentDescription
      },
      // Delete article
      // when user delete an article 
      // then delete everything to related this article for example: images, comments, replies
      // and also delete saves from who save the article
      deleteItem() {
        this.loading2 = true // vuetify dialog
        let urls = this.currentDescription.match(/\bhttps?:\/\/\S+/gi) // find all urls from article description using regex
        
        // Delete all article images
         db.collection('articles').doc(this.articleId).delete() 
            .then(() => {
                var httpsReference = firebase.storage().refFromURL(this.currentImage) // cover image reference
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
                    this.deleteComments() // call a function and passing data
                    this.deleteSaves() // call a function and passing data
                }).catch((error) => {
                    console.log(error)
                })
            }).catch(err => {
                console.log(err)
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
              this.sendNotification() // call a function for set notification
            }
        }).catch(err => {
            console.log(err)
        })
      },
      // Delete all replies
      deleteReplies(docId) { // get passing data from function
        db.collection('replies').where('commentId', '==', docId).get()
        .then((snapshot) => {
            if(!snapshot.empty) { // empty check
                snapshot.forEach(doc => {
                    // deleteing all replies
                    db.collection('replies').doc(doc.id).delete()
                    .then(() => {
                        this.sendNotification() // call a function for set notification
                    })
                })
            }else {
              this.sendNotification() // call a function for set notification
            }
        }).catch(err => console.log(err))
      },
      // set notification
      sendNotification() {
        this.loading2 = false // vuetify loading
        this.dialog2 = false // vuetify dialog
        db.collection('notifications').add({
            ownerId: this.ownerId,
            userId: this.$store.state.user.data.uid, // get uid form vuex store
            articleId: "",
            categoryId: "",
            time: Date.now(),
            text: 'your article has been denied',
            unseenAll: true
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