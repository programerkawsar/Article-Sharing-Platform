<template>
    <div class="admin-categories-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Category Settings - ' + appName"
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
          <!-- category name -->
          <template v-slot:item.name="{ item }">
              <router-link :to="'/category/' + item.slug">
                  {{ item.name }}
              </router-link>
          </template>
            <!-- table header -->
            <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>All Categories</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <!-- vuetify dialog -->
                <v-dialog v-model="dialog2" max-width="500px">
                <!-- add category button -->
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'"
                      dark
                      @click="clearData()"
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Add One
                    </v-btn>
                </template>
                <!-- vuetify add category form -->
                <v-form
                    ref="form"
                    v-model="valid2"
                    @submit.prevent="addCategory()"
                >
                  <v-card>
                      <v-card-title>
                      <span class="headline">Add Category</span>
                      </v-card-title>
                      <v-card-text>
                      <v-container>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field 
                                  v-model="editedItem.name" 
                                  :rules="rules.nameRules"
                                  :error-messages="errorMessage"
                                  @keyup.stop.prevent="checkCategory()"
                                  label="Name"
                                ></v-text-field>
                            </v-col>
                          </v-row>
                      </v-container>
                      </v-card-text>
                      <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'red darken-1'" text @click="dialog2 = false">Cancel</v-btn>
                      <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text type="submit" :disabled="!valid2 || loading2" :loading="loading2">Add Category</v-btn>
                      </v-card-actions>
                  </v-card>
                </v-form>
                <!-- vuetify add category form end -->
                </v-dialog>
                <!-- vuetify dialog end -->
                <!-- vuetify update category dialog -->
                <v-dialog v-model="dialog" max-width="500px">
                  <!-- vuetify update category form -->
                  <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="updateCategory(editedItem.id)"
                  >
                  <v-card>
                      <v-card-title>
                        <span class="headline">Edit Category</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                            <v-row>                                                        
                              <v-col cols="12" sm="12" md="12" class="pb-0">
                                  <v-text-field 
                                    v-model="editedItem.name" 
                                    :rules="rules.nameRules"
                                    label="Name"
                                  ></v-text-field>
                              </v-col>
                              <v-col cols="12" class="pt-0">
                                <p class="red--text m-0"><strong>Note:</strong> When you edit the category name then every article on this category used will be changed !</p>
                              </v-col>
                            </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'red darken-1'" text @click="dialog = false">Cancel</v-btn>
                        <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text :disabled="!valid || loading" :loading="loading" type="submit">Update Category</v-btn>
                      </v-card-actions>
                  </v-card>
                  </v-form>
                  <!-- vuetify update category form end -->
                </v-dialog>
                 <!-- vuetify update category dialog end -->
            </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" class="mr-2" @click="editItem(item)">Edit</v-btn>
              <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'error'" @click="dialog3 = true, selecteCategoryId(item.id)">Delete</v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
        <!-- vuetify delete category dialog -->
        <v-dialog v-model="dialog3" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Are you sure to unsaved the category?</v-card-title>
            <v-card-text><strong>Note:</strong> When you delete the category then every article used this category will don't assess and some problem showing</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'error darken-1'" text @click="dialog3 = false">Disagree</v-btn>
              <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'green darken-1'" text @click="deleteCategory()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>
<script>
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'
// slugify for convert name to sulg
import slugify from 'slugify'

export default {
    name: 'AdminCategories',
    data() {
        return {
            valid: true, // vuetify add category form valid 
            valid2: true, // vuetify update category form valid 
            dialog: false, // vuetify add category dialog
            dialog2: false, // vuetify update category dialog
            dialog3: false, // vuetify delete category dialog
            loading: false, // vuetify loading button
            loading2: false, // vuetify loading button
            dataLoading: false, // vuetify data table loading
            appName: '', // set aplication name
            search: '', // vuetify data table search
            // vuetify data table headers
            headers: [
                { text: 'Serial', value: 'serial', sortable: false },
                {
                  text: 'Name',
                  value: 'name',
                  width: "70%"
                },
                { text: 'Articles', value: 'totalArticles', width: "10%", sortable: false },
                { text: 'Actions', value: 'actions', width: "20%", sortable: false },
            ],
            desserts: [], // vuetify data table data
            categoryId: '', // store category id
            editedIndex: -1, // vuetify data table editedIndex
            editedItem: { //editedItem property
                id: '',
                name: '',
            },
            defaultItem: { // editedItem default property
                id: '',
                name: '',
            },
            rules: { // validtion rules
              nameRules: [
                  v => !!v || 'Name is required',
              ]
            },
            errorMessage: '', // error message
        }
    },
    computed: {
        // set error message
        errorMessages() {
            return this.errorMessage ? this.errorMessage : undefined
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
        db.collection('categories').onSnapshot(snapshot => {
          this.dataLoading = false // data table loading
            snapshot.docChanges().forEach(change => {
                i++ // data table increment value
                let category = change.doc.data()
                category.serial = i // set data table increment value
                category.id = change.doc.id

                // get total articles
                db.collection("articles").where('categoryId', '==', category.id).get()
                .then(function(querySnapshot) {
                    category.totalArticles = querySnapshot.size
                }).catch(err => console.log(err))

                if(change.type === 'added') {
                    this.desserts.push(category) // push data
                }

                // when updated data then modified real time by editedIndex
                if(change.type === "modified") {
                    category.serial = this.editedIndex+1
                    this.desserts.splice(this.editedIndex, 1, category)
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
      // assign user data empty by editedIndex
      clearData() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      // add a new user form admin panel
      addCategory() {
        var data = this.editedItem // assign data
        // convert to slug
        var slug = slugify(data.name, {
            replacement: '-',
            remove: /[$&+,:;=?@#|'"<>.^*()%!~]/g,
            lower: true
        })
        this.loading2 = true // vuetify loading
        if(this.$refs.form.validate()) { // check error
          // added category
          db.collection('categories').add({
            name: data.name,
            slug: slug,
            totalArticles: 0
          }).then(() => {
            this.loading2 = false // vuetify loading
            this.dialog2 = false // vuetify dialog
          })
        }
      },
      // category name unique or not
      checkCategory() {
          db.collection('categories').where('name', '==', this.editedItem.name).get()
          .then(snapshot => {
              if(!snapshot.empty) {
                  this.errorMessage = "The category already exists choose another one" // set error message
              }else {
                  this.errorMessage = ""
              }
          })
      },
      // assign user data to dialog
      editItem(item) {
        item.status = item.published
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      // update category by id
      updateCategory(id) {
        this.loading = true // vuetify loading
        var data = this.editedItem // assign data
        // convert to slug
        var slug = slugify(data.name, {
            replacement: '-',
            remove: /[$&+,:;=?@#|'"<>.^*()%!~]/g,
            lower: true
        })
        if(this.$refs.form.validate()) { // check no error
          // update category
          db.collection("categories").doc(id).update({
              name: data.name,
              slug: slug,
          }).then(() => {
              this.loading = false // vuetify loading
              this.dialog = false // vuetify dialog
          }).catch(err => {
            console.log(err)
            this.loading = false // vuetify loading
          })
        }
      },
      // set category id
      selecteCategoryId(id) {
        this.categoryId = id
      },
      // delete category
      deleteCategory() {
        db.collection('categories').doc(this.categoryId).delete()
        .then(() => {
            this.dialog3 = false // vuetify dialog
        }).catch(err => {
            console.log(err)
        })
      }
    }
}
</script>

<style scoped>
/*  data table styles */
.admin-categories-list {
  width: 100%;
  padding-left: 30px;
}
</style>