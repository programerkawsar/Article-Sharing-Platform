<template>
    <!-- bootstarp media -->
    <b-media tag="li" class="add-comment-box">
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
        <v-form @submit.prevent="addComment()">
            <v-textarea
                auto-grow
                solo-inverted
                v-model="comment"
                label="Write your comment"
                rows="3"
                row-height="30"
            ></v-textarea>
            <div class="clearfix">
                <!-- submit button -->
                <div class="float-right">
                    <v-btn depressed color="black white--text" type="submit" class="add-comment-btn" :loading="loading" small>Add Comment</v-btn>
                </div>
            </div>
        </v-form>
        <!-- vuetify form end -->
        <!-- vuetify snackbar -->
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            Comment added successfully
            <v-btn
                color="error"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </b-media>
    <!-- bootstarp media end -->
</template>

<script>
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'AddComment',
    props: ['articleId', 'ownerId'], // get data form vuejs props
    data() {
        return {
            loading: false, // vuetify loading
            comment: '', // store comment
            userAvatar: '',  // store user avatar
            snackbar: false, // vuetify snackbar
            timeout: 2000 // snackbar timeout
        }
    },
    created() {
        // get user avatar
        db.collection("users").doc(this.$store.state.user.data.uid).get() // get uid from vuex store
        .then((querySnapshot) => {
            this.userAvatar = querySnapshot.data().avatar
        }).catch(err => console.log(err)) 
    },
    methods: {
        // add comment
        addComment() {
            if(this.comment) {
                this.loading = true // vuetify loading
                db.collection('comments').add({
                    userId: this.$store.state.user.data.uid, // get uid from vuex store
                    articleId: this.articleId,
                    time: Date.now(), // javascript now() function for get current time
                    text: this.comment,
                    repliesNum: ''
                }).then((snapshot) => {
                    this.snackbar = true // vuetify snackbar
                    this.loading = false // vuetify loading
                    this.comment = ''

                    if(this.ownerId != this.$store.state.user.data.uid) { // check current user id and passing id do not match
                        db.collection('notifications').add({
                            ownerId: this.ownerId,
                            userId: this.$store.state.user.data.uid, // get uid from vuex store
                            articleId: this.articleId,
                            categoryId: "", 
                            time: Date.now(), // javascript now() function for get current time
                            text: 'commented on your article',
                            unseenAll: true
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    this.loading = false // vuetify loading
                })
            }
        }
    }
}
</script>

<style scoped>
/* comment box style */
.add-comment-btn {margin-top: -30px;}
.add-comment-box .theme--light .v-input--is-focused input, .theme--light .v-input--is-focused textarea {
    color: white !important;
}
.add-comment-box .theme--light .v-input input, .theme--light .v-input textarea {
    color: black;
}
.add-comment-box .theme--dark .v-input--is-focused input, .theme--dark .v-input--is-focused textarea {
    color: black !important;
}
.add-comment-box .theme--dark.v-input input, .theme--dark.v-input textarea {
    color: white;
}

/* Small to large handset */
@media (max-width: 600px) { 
    .add-comment-box .align-self-start {display: none !important;}
}
</style>