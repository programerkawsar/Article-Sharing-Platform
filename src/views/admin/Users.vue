<template>
    <div class="admin-users-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'User Settings - ' + appName"
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
          <!-- User avatar -->
          <template v-slot:item.avatar="{ item }">
            <router-link :to="'/profile/' + item.username">
              <v-avatar class="m-2">
                <v-row align="center" justify="center">
                  <!-- Image -->
                  <v-img
                    :src="item.avatar"
                    :lazy-src="item.avatar"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    max-width="50"
                    max-height="50"
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
                </v-row>
              </v-avatar>
            </router-link>
          </template>
          <!-- user profile link -->
          <template v-slot:item.name="{ item }">
            <router-link :to="'/profile/' + item.username">
                {{ item.name }}
            </router-link>
          </template>
          <!-- user rule -->
          <template v-slot:item.role="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-avatar v-on="on" :color="item.role == 1 ? 'primary' : 'blue-grey lighten-2'" size="26px">
                  <v-icon dark>mdi-{{ item.role == 1 ? 'star' : 'account' }}</v-icon>
                </v-avatar>
              </template>
              <span>{{ item.role == 1 ? 'Admin' : 'User' }}</span>
            </v-tooltip>
          </template>
          <!-- user status -->
          <template v-slot:item.status="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-avatar v-on="on" :color="item.status == 1 ? 'success' : 'error'" size="26px">
                  <v-icon dark>mdi-{{ item.status == 1 ? 'account-check' : 'account-lock' }}</v-icon>
                </v-avatar>
              </template>
              <span>{{ item.status == 1 ? 'Active' : 'Disabled' }}</span>
            </v-tooltip>
          </template>
            <!-- table header -->
            <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>All Users</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <!-- add user dialog -->
                <v-dialog v-model="dialog" max-width="500px">
                   <!-- add user button -->
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'"
                      dark
                      class="mb-2"
                      @click="clearData()"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Add One
                    </v-btn>
                </template>
                 <!-- add user form -->
                <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="addUser()"
                >
                  <v-card>
                      <v-card-title>
                      <span class="headline">Add User</span>
                      </v-card-title>
                      <v-card-text>
                      <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field 
                                  v-model="editedItem.name" 
                                  :rules="rules.nameRules"
                                  label="Name"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="Email"
                                  v-model="editedItem.email" 
                                  :rules="rules.emailRules"
                                  :error-messages="errorMessages"
                                  @keypress="errorMessage = ''"
                                ></v-text-field>
                            </v-col>                          
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field 
                                  label="Password"
                                  v-model="editedItem.password" 
                                  :rules="rules.passwordRules"
                                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"                               
                                  :type="show1 ? 'text' : 'password'"
                                  hint="At least 8 characters"
                                >
                                </v-text-field>
                            </v-col>                          
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                  label="Role"
                                  v-model="editedItem.role"
                                  :rules="rules.roleRules"
                                  :items="selectRole"
                                  item-text="text"
                                  item-value="value"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
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
                      <!-- dialog buttons -->
                      <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'red darken-1'" text @click="dialog = false">Cancel</v-btn>
                      <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text type="submit" :disabled="!valid || loading" :loading="loading">Add User</v-btn>
                      </v-card-actions>
                  </v-card>
                </v-form>
                <!-- add user form end -->
                </v-dialog>
                 <!-- add user dialog end -->
                 <!-- update user dialog -->
                <v-dialog v-model="dialog2" max-width="500px">
                  <!-- update user dialog form -->
                  <v-form
                    ref="form"
                    v-model="valid2"
                    @submit.prevent="updateUser(editedItem.id)"
                  >
                  <v-card>
                      <v-card-title>
                        <span class="headline">Edit User</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                            <v-row>                                                        
                              <v-col cols="12" sm="6" md="6">
                                  <v-select
                                    label="Role"
                                    v-model="editedItem.role"
                                    :rules="rules.roleRules"
                                    :items="selectRole"
                                    item-text="text"
                                    item-value="value"
                                  ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
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
                        <!-- dialog buttons -->
                        <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'red darken-1'" text @click="dialog2 = false">Cancel</v-btn>
                        <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text :disabled="!valid2 || loading2" :loading="loading2" type="submit">Update User</v-btn>
                      </v-card-actions>
                  </v-card>
                  </v-form>
                  <!-- update user dialog form end -->
                </v-dialog>
                <!-- update user dialog end -->
            </v-toolbar>
            </template>
            <!-- edit user button -->
            <template v-slot:item.actions="{ item }">
              <v-btn small v-if="item.id != $store.state.user.data.uid" :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" @click="editItem(item)">Edit</v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
    </div>
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
// moment for convert date
import moment from 'moment/src/moment'
// numeral for convert number
const numeral = require('numeral')

export default {
    name: 'AdminUsers',
    data() {
        return {
            valid: true, // vuetify add user form valid 
            valid2: true, // vuetify update user form valid 
            dialog: false, // vuetify dialog for add user form
            dialog2: false, // vuetify dialog for update user form
            loading: false, // vuetify add user form button loading 
            loading2: false, // vuetify update user form button loading 
            dataLoading: false, // vuetify data table loading
            show1: false, // password show
            appName: '', // set aplication name
            search: '', // vuetify data table search
            // vuetify data table headers
            headers: [
                { text: 'Serial', value: 'serial', sortable: false },
                { text: 'Avatar', width: "10%", value: 'avatar', sortable: false },
                {
                  text: 'Name',
                  sortable: false,
                  value: 'name',
                  width: "20%"
                },
                { text: 'Email', width: "20%", value: 'email', sortable: false },
                { text: 'Username', width: "20%", value: 'username', sortable: false },
                { text: 'Articles', width: '10%', value: 'totalArticles', sortable: false },
                { text: 'Role', value: 'role', sortable: false },
                { text: 'Status', value: 'status', sortable: false },
                { text: 'Date', width: "20%", value: 'date' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            desserts: [], // vuetify data table data
            selectStatus: [ // user status property
              {
                text: 'Active',
                value: 1,
              },
              {
                text: 'Disabled',
                value: 2,
              }
            ],
            selectRole: [ // user rule property
              {
                text: 'Admin',
                value: 1,
              },
              {
                text: 'User',
                value: 2,
              }
            ],
            editedIndex: -1, // vuetify data table editedIndex
            editedItem: { // vuetify data table editedItem property
                id: '',
                name: '',
                email: '',
                password: '',
                role: 0,
                status: 0,
            },
            defaultItem: { // vuetify data table defaultItem property
                id: '',
                name: '',
                email: '',
                password: '',
                role: 0,
                status: 0,
            },
            userId: '', // store user id
            rules: { // validtion rules
              nameRules: [
                  v => !!v || 'Name is required',
                  v => v.length >= 6 || 'Min 6 characters',
              ],
              emailRules: [
                  v => !!v || 'E-mail is required',
                  v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
              ],
              passwordRules: [
                  v => !!v || 'Password is required',
                  v => v.length >= 8 || 'Min 8 characters',
              ],
              statusRules: [
                  v => !!v || 'Status is required',
              ],
              roleRules: [
                  v => !!v || 'Role is required',
              ]
            },
            errorMessage: '' // for error message
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
        db.collection('users').orderBy('date', 'desc').onSnapshot(snapshot => {
            this.dataLoading = false // data table loading
            snapshot.docChanges().forEach(change => {
              i++ // data table increment value
              let user = change.doc.data()
              user.serial = i // set data table increment value
              user.id = change.doc.id
              user.date = moment(change.doc.data().date).format('ll') // convert date

              // get how many articles
              db.collection('articles').where('userId', '==', user.id).get()
              .then(snapshot => {
                // convert number
                let total = snapshot.size > 999 ? numeral(snapshot.size).format('0.0a') : snapshot.size
                user.totalArticles = total // assign data
              })

              if(change.type === 'added') {
                this.desserts.push(user) // push data
              }

              // when updated data then modified real time by editedIndex
              if(change.type === "modified") {
                user.serial = this.editedIndex+1
                this.desserts.splice(this.editedIndex, 1, user)
              }
            })
        })
      },
      // assign user data to dialog
      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog2 = true
      },
      // assign user data empty by editedIndex
      clearData() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      // add a new user form admin panel
      addUser() {
          var data = this.editedItem // assign data
          this.loading = true // vuetify loading
          if(this.$refs.form.validate()) { // check no error
            let storageRef = firebase.storage().ref('default-avatar.jpg') // get default avatar from storage
            storageRef.getDownloadURL().then(url => { // get image url
                firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
                .then(cred => {
                    // set user info to firestore database
                    db.collection('users').doc(cred.user.uid).set({
                        name: data.name,
                        email: data.email,
                        username: cred.user.uid,
                        date: Date.now(), // javascript now() function for current time 
                        admin: data.role,
                        status: data.status,
                        totalArticles: 0,
                        bio: '',
                        avatar: url, // set image url
                        facebookUrl: '',
                        twitterUrl: '',
                        instagramUrl: '',
                        pinterestUrl: '',
                        githubUrl: ''
                    })
                })
                .then(() => {
                    this.loading = false // vuetify loading
                    this.dialog = false // vuetify dialog
                })
                .catch(err => {
                    this.errorMessage = err.message // set error message
                    this.loading = false // vuetify loading
                })
            })
          }
        },
        // update user data
        updateUser(id) { // get passing data from function
          this.loading2 = true // vuetify loading
          if(this.$refs.form.validate()) { // check no error
            // update data
            db.collection("users").doc(id).update({
                role: this.editedItem.role,
                status: this.editedItem.status,
            }).then(() => {
                this.loading2 = false // vuetify loading
                this.dialog2 = false // vuetify dialog
            }).catch(err => {
              console.log(err)
              this.loading2 = false // vuetify loading
            })
          }
        }
    },
}
</script>

<style scoped>
/*  data table styles */
.admin-users-list {
  width: 100%;
  padding-left: 30px;
}
.admin-users-list .v-avatar i {
  font-size: 16px;
}
.table-dark tr {
  background-color: #1E1E1E;
}
</style>