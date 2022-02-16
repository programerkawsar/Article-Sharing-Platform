<template>
    <div class="admin-messages-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Message Settings - ' + appName"
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
            <!-- table header -->
            <template v-slot:top>
              <v-toolbar flat>
                  <v-toolbar-title>All Messages</v-toolbar-title>
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
                    to="/contact-us"
                  >
                    Add One
                  </v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <!-- Data table buttons -->
              <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" class="mt-2" @click="sendEmail(item.email)"><v-icon>mdi-email</v-icon></v-btn>
              <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'error'" class="mb-2 mt-2" @click="dialog3 = true, selecteMessageId(item.id)"><v-icon>mdi-close</v-icon></v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
        <!-- delete message dialog -->
        <v-dialog v-model="dialog3" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Are you sure to delete the message?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'error darken-1'" text @click="dialog3 = false">Disagree</v-btn>
              <v-btn :color="$vuetify.theme.dark ? 'grey darken-3' : 'green darken-1'" text @click="deleteMessage()">Agree</v-btn>
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

export default {
    name: 'AdminMessages',
    data() {
        return {
            dialog3: false, // vuetify delete dialog
            dataLoading: false, // vuetify data table loading
            appName: '', // set aplication name
            search: '', // vuetify data table search
            // vuetify data table headers
            headers: [
                { text: 'Serial', value: 'serial', sortable: false },
                { text: 'Name', value: 'name', width: "12%", sortable: false },
                { text: 'Email', value: 'email', width: "18%", sortable: false },
                {
                  text: 'Message',
                  value: 'message',
                  width: "45%",
                  sortable: false
                },
                { text: 'Date', value: 'time', width: "15%" },
                { text: 'Actions', value: 'actions', width: "10%", sortable: false },
            ],
            desserts: [], // vuetify data table data
            messageId: '' // store message id
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
        db.collection('messages').orderBy('time', 'desc').onSnapshot(snapshot => {
            this.dataLoading = false // data table loading
            snapshot.docChanges().forEach(change => {
                i++ // data table increment value
                let message = change.doc.data()
                message.serial = i // set data table increment value
                message.id = change.doc.id
                message.time = moment(change.doc.data().time).format('ll') // convert date

                if(change.type === 'added') {
                    this.desserts.push(message) // push data
                }

                // when updated data then modified real time by editedIndex
                if(change.type === "modified") {
                    message.serial = this.editedIndex+1
                    this.desserts.splice(this.editedIndex, 1, message)
                }
                
                // when data deleted then removed real time
                if(change.type === 'removed') {
                    this.desserts = this.desserts.filter(item => {
                        return item.id != change.doc.id
                    })
                }
            })
        })
      },
      // send email
      sendEmail(email) {
          window.open('mailto:' + email)
      },
      // set message id
      selecteMessageId(id) {
           this.messageId = id
      },
      // delete message
      deleteMessage() {
        db.collection('messages').doc(this.messageId).delete()
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
.admin-messages-list {
  width: 100%;
  padding-left: 30px;
}
</style>