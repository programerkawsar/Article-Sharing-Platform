<template>
    <div class="admin-sliders-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Request Settings - ' + appName"
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
            <!-- Article image -->
            <template v-slot:item.image="{ item }">
                    <router-link v-if="item.image" :to="'/article/' + 'request' + '/' + item.articleSlug">
                        <!-- Image -->
                        <v-img
                            :src="item.image"
                            :lazy-src="item.image"
                            aspect-ratio="1"
                            class="grey lighten-2 m-2"
                            max-width="70"
                            max-height="70"
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
            <template v-slot:item.articleId="{ item }">
                <router-link v-if="item.articleSlug" :to="'/article/' + 'request' + '/' + item.articleSlug">
                    {{ item.articleId }}
                </router-link>
                <p v-else class="red--text font-weight-bold">
                    Article has been deleted
                </p>
            </template>
            <!-- user profile link -->
            <template v-slot:item.userId="{ item }">
                <router-link :to="'/profile/' + item.username">
                    {{ item.userId }}
                </router-link>
            </template>
            <!-- table header -->
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>All Requests</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                        :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'"
                        dark
                        class="mb-2"
                        :to="{ name: 'Request' }"
                    >
                        Add One
                    </v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <!-- Data table buttons -->
                <v-btn small v-if="item.image" :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" class="mt-2" @click="approveArticle(item)"><v-icon>mdi-check</v-icon></v-btn>
                <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'error'" class="mb-2 mt-2" @click="dialog = true, selectRequest(item)"><v-icon>mdi-close</v-icon></v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
        <!-- dialog for delete -->
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Are you sure to delete the request?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'error darken-1'" text @click="dialog = false">Disagree</v-btn>
                <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text @click="articleDecline()">Agree</v-btn>
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
    name: 'AdminRequests',
    data() {
        return {
            loading: false, // vuetify button loading 
            dialog: false, // vuetify dialog
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
                  value: 'articleId',
                  width: "20%",
                },
                { text: 'Writer', width: "10%", value: 'userId', sortable: false },
                { text: 'Requesting Text', width: "35%", value: 'text', sortable: false },
                { text: 'Date', width: "15%", value: 'date' },
                { text: 'Actions', width: "10%", value: 'actions', sortable: false },
            ],
            desserts: [] // vuetify data table data
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
            db.collection('requests').orderBy('time', 'desc').onSnapshot(snapshot => {
                this.dataLoading = false // data table loading
                snapshot.docChanges().forEach(change => {
                    i++ // data table increment value
                    let request = change.doc.data()
                    request.serial = i // set data table increment value
                    request.id = change.doc.id
                    request.date = moment(change.doc.data().date).format('ll') // convert date
                    request.currentArticleId = request.articleId // set articleId 

                    this.getArticleByRequest(request) // call a function and passing data

                    this.getRequestUserData(request) // call a function and passing data

                    if(change.type === 'added') {
                        this.desserts.push(request) // push data
                    }

                    // when updated data then modified real time by editedIndex
                    if(change.type === 'removed') {
                        this.desserts = this.desserts.filter(item => {
                            return item.id != change.doc.id
                        })
                    }
                })
            })
        },
        // get requested article
        getArticleByRequest(request) { // get passing data from function
                db.collection('articles').doc(request.articleId).get()
                .then(function(querySnapshot) {
                    if(querySnapshot.exists) { // check exists or not
                        // convert number
                        request.articleId = querySnapshot.data().title.length > 30 ? querySnapshot.data().title.substring(0, 30) + '...' : querySnapshot.data().title
                        request.image = querySnapshot.data().image
                        request.articleSlug = querySnapshot.data().slug
                    }
                })
        },
        // get requested user data
        getRequestUserData(request) { // get passing data from function
                db.collection('users').doc(request.userId).get()
                .then(function(querySnapshot) {
                    request.userId = querySnapshot.data().name
                    request.ownerId = querySnapshot.id
                    request.username = querySnapshot.data().username
                })
        },
        // article approve to added slider
        approveArticle(item) { // get passing data from function
            // update slider status
            db.collection('articles').doc(item.currentArticleId).update({
                slider: 1
            }).then(() => {
                db.collection('requests').doc(item.id).delete()
                .then(() => {
                    // set notification
                    db.collection('notifications').add({
                        ownerId: item.ownerId,
                        userId: this.$store.state.user.data.uid, // get uid form vuex
                        articleId: item.currentArticleId,
                        categoryId: "",
                        time: Date.now(),
                        text: 'your request has been accepted',
                        unseenAll: true
                    })
                })
            })
        },
        // get current request data and pass
        selectRequest(item) {
            this.articleDecline(item.id, item.ownerId, item.currentArticleId) // call a function and passinf data
        },
        // decline request to added slider
        articleDecline(requestId, ownerId, currentArticleId) { // get passing data from function
            this.dialog = false
            db.collection('requests').doc(requestId).delete()
            .then(() => {
                    // set notification
                    db.collection('notifications').add({
                        ownerId: ownerId,
                        userId: this.$store.state.user.data.uid, // get uid form vuex
                        articleId: currentArticleId,
                        categoryId: "",
                        time: Date.now(),
                        text: 'sorry! your request has been declined',
                        unseenAll: true
                    })
                })
        }
    }
}
</script>

<style scoped>
/*  data table styles */
.admin-sliders-list {
  width: 100%;
  padding-left: 30px;
}
</style>