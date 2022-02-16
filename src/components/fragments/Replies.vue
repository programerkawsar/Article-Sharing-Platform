<template>
    <div>
        <!-- bootstrap media component -->
        <b-media v-for="(reply, index) in replies" :key="'N' + index">
            <template v-slot:aside>
                <!-- user profile link -->
                <router-link :to="'/profile/' + reply.username">
                    <!-- user avatar -->
                    <v-avatar>
                        <!-- image -->
                        <v-img
                            :src="reply.userAvatar"
                            :lazy-src="reply.userAvatar"
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
            <!-- user name & profile link -->
            <h5 class="mt-0 mb-1"><router-link :to="'/profile/' + reply.username">{{ reply.userId }}</router-link></h5>
            <!-- reply text -->
            <p class="mb-0">{{ reply.text }}</p>
            <div class="clearfix mt-2">
                <!-- reply time -->
                <div class="float-left">
                    <p class="m-0 text-muted text-uppercase" style="font-size: 14px">{{ reply.time }}</p>
                </div>
                <!-- reply delete button -->
                <div class="float-right">             
                    <v-btn text small color="red darken-1" @click="selectComment(reply.id), dialog = true" v-if="reply.repliedUserId == currentUser">Delete</v-btn>                                              
                </div>
            </div>
            <v-divider
                v-if="index + 1 < replies.length"
                :key="index"
                class="m-0 mt-2 mb-2"
            ></v-divider>
        </b-media>
        <!-- bootstrap media component end -->
        <!-- vuetify dialog for delete -->
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Are you sure to delete the comment?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog = false">Disagree</v-btn>
                    <v-btn color="green darken-1" text @click="deleteReply()" :loading="loading">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// moment for convert date
import moment from 'moment/src/moment'
// Import firebase app
import firebase from 'firebase/app'
// Import firebase auth
import 'firebase/auth'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Replies',
    props: ['commentIndex', 'commentId', 'totalComments'], // get data form vuejs props
    data() {
        return {
            loading: false, // vuetify loading
            replies: [], // all replies array
            currentUser: false, // current user id
            deleteComment: '', // store comment id for delete
            dialog: false // vuetify dialog
        }
    },
    watch: {
        // when new comment added by teal time then refresh all replies
        totalComments(first, last) {
            if(first > last && last != 0) {
                this.replies = [] // empty all replies
                this.allReplies() // then load again all replies in a new way
            }
        }
    },
    created() {
        let user = firebase.auth().currentUser // get current user data
        this.currentUser = user ? user.uid : '' // set current user uid
        this.allReplies() // load all replies
    },
    methods: {
        // set reply id for delete
        selectComment(id) {
            this.deleteComment = id
        },
        // delete replies by id
        deleteReply() {
            this.loading = true // vuetify loading
            
            db.collection('replies').doc(this.deleteComment).delete()
            .then((snapshot) => {
                this.snackbar = true // vuetify snackbar
                this.dialog = false // vuetify dialog
                this.loading = false // vuetify loading
            }).catch(err => {
                console.log(err)
            })
        },
        // get all replies form database
        allReplies() {
            db.collection('replies').where('commentId', '==', this.commentId).orderBy('time', 'asc')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        let reply = change.doc.data() // assagin data
                        reply.id = change.doc.id
                        reply.repliedUserId = change.doc.data().userId
                        reply.time = moment(change.doc.data().time).endOf('hour').fromNow() // format data
                        if(reply.commentId == this.commentId) {
                            // push reply when match reply id and comment id
                            this.replies.push(reply) 
                        }

                        //get user data
                        db.collection("users").doc(reply.userId).get()
                        .then((querySnapshot) => {
                            reply.currentUserId = reply.userId
                            reply.userId = querySnapshot.data().name
                            reply.username = querySnapshot.data().username
                            reply.userAvatar = querySnapshot.data().avatar
                        }).catch(err => console.log(err))
                    }

                    // when deleted data then removed real time from the list
                    if (change.type === 'removed') {
                        this.replies = this.replies.filter(reply => {
                            return reply.id != change.doc.id
                        })
                    }
                })
            })
        }
    }
}
</script>

<style scoped>
/* bootstarp media style */
.media-body {
    width: 100%;
}  
</style>