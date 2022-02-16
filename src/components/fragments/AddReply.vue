<template>
    <!-- bootstarp media -->
    <b-media tag="li" class="add-reply-box">
        <template v-slot:aside>
            <!-- user avatar -->
            <v-avatar>
                <!-- image -->
                <v-img
                    :src="userAvatar"
                    :lazy-src="userAvatar"
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
        </template>
        <!-- vuetify form -->
        <v-form @submit.prevent="addReply()">
            <v-textarea
                auto-grow
                solo-inverted
                v-model="comment"
                label="Write your reply"
                rows="3"
                row-height="30"
            ></v-textarea>
            <div class="clearfix">
                <!-- submit button -->
                <div class="float-right">
                    <v-btn depressed color="black white--text" type="submit" class="add-comment-btn" :loading="loading" small>Add Reply</v-btn>
                </div>
            </div>
        </v-form>
        <!-- vuetify form end -->
    </b-media>
    <!-- bootstarp media end -->
</template>

<script>
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'AddReply',
    props: ['commentId', 'articleId', 'ownerId'], // get data form vuejs props
    data() {
        return {
            loading: false, // vuetify loading
            comment: '', // store comment
            userAvatar: '', // store avatar
            allUserId: [] // store all user id for notification
        }
    },
    created() {
        // get user avatar
       db.collection("users").doc(this.$store.state.user.data.uid).get()
       .then((querySnapshot) => {
           this.userAvatar = querySnapshot.data().avatar // set avatar
       }).catch(err => console.log(err)) 
    },
    methods: {
        // add reply
        addReply() {
            if(this.comment) { // empty check
                this.loading = true // vuetify loading
                db.collection('replies').add({
                    userId: this.$store.state.user.data.uid, // get uid form vuex store
                    commentId: this.commentId,
                    time: Date.now(), // javascript now() function for get current time
                    text: this.comment
                }).then(() => {
                    this.loading = false // vuetify loading
                    this.comment = ''

                    // add a notification
                    db.collection('notifications').add({
                        commentId: this.commentId
                    })

                    // get all replies
                    db.collection('replies').where('commentId', '==', this.commentId).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            this.allUserId.push(doc.data().userId) // put all replyed user id one by one
                        })

                        if(this.allUserId) { // empty check
                            if(snapshot.size == 1) {
                                this.sendNotification(this.ownerId) // call a function and passing data
                            }

                            var uniq = [...new Set(this.allUserId)] // check user unique because a user can reply many times so I am filtering
                            for (var i = 0; i < uniq.length; i++) { // for loop set user one by one
                                if(uniq[i] != this.$store.state.user.data.uid){  // check user id and current user id do not match
                                    this.sendNotification(uniq[i]) // call a function and passing data
                                }
                            }
                        }
                    })
                }).catch(err => {
                    console.log(err)
                    this.loading = false // vuetify loading
                })
            }
        },
        // send notification
        sendNotification(ownerId) { // get data from passing function
            if(ownerId != this.$store.state.user.data.uid) { // check current user id and passing id do not match
                db.collection('notifications').add({
                    ownerId: ownerId,
                    userId: this.$store.state.user.data.uid, // get uid from vuex store
                    articleId: this.articleId,
                    categoryId: "",
                    time: Date.now(), // javascript now() function for get current time
                    text: 'replied on your comment',
                    unseenAll: true
                })
            }
        }
    }
}
</script>

<style scoped>
/* comment box style */
.add-comment-btn {margin-top: -30px;}
.add-reply-box .theme--light .v-input--is-focused input, .theme--light .v-input--is-focused textarea {
    color: white !important;
}
.add-reply-box .theme--light .v-input input, .theme--light .v-input textarea {
    color: black;
}
.add-reply-box .theme--dark .v-input--is-focused input, .theme--dark .v-input--is-focused textarea {
    color: black !important;
}
.add-reply-box .theme--dark.v-input input, .theme--dark.v-input textarea {
    color: white;
}

/* Small to large handset */
@media (max-width: 600px) { 
    .add-reply-box .align-self-start {display: none !important;}
}
</style>