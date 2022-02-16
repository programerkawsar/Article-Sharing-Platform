<template>
    <div>
        <!-- bootstrap media -->
        <b-media tag="li" v-for="(comment, index) in comments" :key="'N' + index">
            <template v-slot:aside>
                <!-- user profile link -->
                <router-link :to="'/profile/' + comment.username">
                    <!-- user avatar -->
                    <v-avatar>
                        <!-- image -->
                        <v-img
                            :src="comment.userAvatar"
                            :lazy-src="comment.userAvatar"
                            alt="John"
                            class="grey lighten-2"
                            aspect-ratio="1"
                        >
                            <!-- loading -->
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
                    </v-avatar>
                </router-link>
            </template>
            <!-- user name and profile link -->
            <h5 class="mt-0 mb-1"><router-link :to="'/profile/' + comment.username">{{ comment.userId }}</router-link></h5>
            <!-- comment text -->
            <p class="mb-0">{{ comment.text }}</p>
            <div class="clearfix mt-2">
                <!-- comment time -->
                <div class="float-left">
                    <p class="m-0 text-muted text-uppercase" style="font-size: 14px">{{ comment.time }}</p>
                </div>
                <!-- replay & delete this comment button -->
                <div class="float-right">                   
                    <v-btn text small color="red darken-1" @click="selectComment(comment.id), dialog = true" v-if="comment.commentedUserId == currentUser">Delete</v-btn>                        
                    <v-btn text small v-b-toggle="'collapse-' + comment.id">Reply ({{ comment.repliesNum }})</v-btn>                 
                </div>
            </div>
            <!-- bootstarp collapse -->
            <b-collapse :id="'collapse-' + comment.id" class="mt-4">
                <!-- show all replies -->
                <replies :commentId="comment.id" :totalComments="totalComments"></replies>
                <!-- add reply input -->
                <add-reply v-if="$store.state.user.loggedIn" :commentId="comment.id" :articleId="articleId" :ownerId="comment.currentUserId" class="mt-2"></add-reply>
            </b-collapse>
            <v-divider
                v-if="index + 1 < comments.length"
                :key="index"
                class="m-0 mt-2 mb-2"
            ></v-divider>
        </b-media>
        <!-- bootstrap media end -->
        <!-- load more button -->
        <div class="text-center m-4">
            <v-btn color="black white--text" elevation="0" v-if="comments.length != 0 && comments.length != totalComments" :loading="loading" @click="loadComments()"><v-icon class="mr-1">mdi-reload</v-icon> Load More</v-btn>
        </div>
        <!--vuetify snackbar -->
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            Comment deleted successfully
            <v-btn
                color="error"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <!--vuetify dialog for delete comment -->
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Are you sure to delete the comment?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog = false">Disagree</v-btn>
                    <v-btn color="green darken-1" text @click="deleteComment()" :loading="loading">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// import lazy load component for AddReply, AddComment, Replies
const AddReply = () => import('@/components/fragments/AddReply')
const AddComment = () => import('@/components/fragments/AddComment')
const Replies = () => import('@/components/fragments/Replies')
// moment for convert date
import moment from 'moment/src/moment'
// import firebase app
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Comment',
    props: ['articleId'], // get data form vuejs props
    data() {
        return {
            loading: false, // vuetify loading
            comments: [], // all comments array
            totalComments: 0, // total comments
            currentUser: false, // current user uid
            snackbar: false, // vuetify snackbar
            timeout: 2000, // snackbar time out
            deleteId: '', // store delete id
            dialog: false, // vuetify dialog
            lastTime: 0 // last time for load more comments
        }
    },
    created() {
        let user = firebase.auth().currentUser // get current user data
        this.currentUser = user ? user.uid : '' // set current user uid
        this.allComments() // load all comments
    },
    methods: {
        // set comment id for delete
        selectComment(id) {
            this.deleteId = id
        },
        // delete comment by id
        deleteComment() {
            this.loading = true // vuetify loading
            db.collection('comments').doc(this.deleteId).delete()
            .then(() => {
                this.snackbar = true // vuetify snackbar
                this.dialog = false // vuetify dialog
                this.loading = false // vuetify loading
            }).catch(err => {
                console.log(err)
            })
            
            // delete all replies on this comment
            db.collection('replies').where('commentId', '==', this.deleteId).get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    db.collection('replies').doc(doc.id).delete()
                })
            }).catch(err => console.log(err))
        },
        // get all comments form database
        allComments(limit) {
            this.loading = true // vuetify loading
            let first = db.collection('comments')
            .where('articleId', '==', this.articleId)
            .orderBy('time', 'desc')
            .limit(4)

            first.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        this.pushComments(change) // push comment one by one 
                    }

                    // when deleted data then removed real time from the list
                    if (change.type === 'removed') {
                        this.comments = this.comments.filter(comment => {
                            return comment.id != change.doc.id
                        })
                    }
                })
                let last = snapshot.docs[snapshot.docs.length - 1]; // get last item
                if(last) {
                    this.lastTime = last.data().time // set last item time
                }
            })
            
            // count how many comments here
            let allCount = db.collection('comments')
            .where('articleId', '==', this.articleId)
            allCount.onSnapshot((snapshot) => {
                this.totalComments = snapshot.size
            })
        },
        loadComments() {
            this.loading = true // vuetify loading
            let next = db.collection('comments')
            .where('articleId', '==', this.articleId)
            .orderBy('time', 'desc')
            .startAfter(this.lastTime) // set last time
            .limit(4)

            next.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        this.pushComments(change, 0) // push notifications and passing data
                    }

                    // when comment deleted then removed real time from list
                    if (change.type === 'removed') {
                        this.comments = this.comments.filter(comment => {
                            return comment.id != change.doc.id
                        })
                    }
                })
                let last = snapshot.docs[snapshot.docs.length - 1]; // get last item
                this.lastTime = last.data().time // set last item time
            })
        },
        // push comments
        pushComments(change, num) { // get data from passing function
            this.loading = false // vuetify loading
            let comment = change.doc.data() // assign data
            comment.id = change.doc.id
            comment.commentedUserId = change.doc.data().userId // set commented user id
            comment.time = moment(change.doc.data().time).endOf('hour').fromNow() // format time
            if(change.newIndex == 0 && num != 0) { // check notification realtime added or not        
                this.comments.unshift(comment) // when notification added realtime then set to top the notification
            }else {
                this.comments.push(comment) // push all notifications
            }
            
            this.getUserDataByCommentId(comment) // call a function and passing data

            // count how many replies here
            db.collection('replies').where('commentId', '==', comment.id)
            .onSnapshot(snapshot => {
                comment.repliesNum = snapshot.size
            })
        },
        // get user data
        getUserDataByCommentId(comment) {
            db.collection("users").doc(comment.userId).get()
            .then((querySnapshot) => {
                comment.currentUserId = comment.userId
                comment.userId = querySnapshot.data().name
                comment.username = querySnapshot.data().username
                comment.userAvatar = querySnapshot.data().avatar
            }).catch(err => console.log(err))
        }
    },
    components: {
        // register components
        AddComment,
        AddReply,
        Replies
    }
}
</script>

<style scoped>
/* bootstarp media style */
.media-body {
    width: 100%;
}  
</style>