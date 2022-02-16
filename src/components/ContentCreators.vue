<template>
    <div :class="$vuetify.theme.dark ? 'grey darken-4' : 'blue-grey lighten-5'">
        <!-- vuetify container -->
        <v-container v-if="users != ''">
            <section>
                <!-- section title -->
                <h3 class="text-center mb-5">Meet Some Of Our Awesome <br> Content Creators</h3>
                <v-row>
                    <!-- for loop -->
                    <v-col
                        v-for="(user, i) in orderedUsers.slice(0, 8)"
                        :key="i"
                        cols="12"
                        xs="12"
                        sm="6"
                        md="3"
                        lg="3"
                        xl="4"
                    >
                        <!-- lazy loading -->
                        <v-lazy
                            v-model="lazyLoad"
                            :options="{
                                threshold: .5
                            }"
                            transition="fade-transition"
                        >   
                            <!-- profile link -->
                            <v-card class="mx-auto" :to="'/profile/' + user.username">
                                <!-- user avatar -->
                                <v-img
                                    class="grey lighten-2 white--text align-end"
                                    :src="user.avatar"
                                    :lazy-src="user.avatar"
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

                                <!-- user social media links -->
                                <v-card-actions>
                                    <div class="mx-auto">
                                        <a :href="'https://www.facebook.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-facebook</v-icon></v-btn></a>
                                        <a :href="'https://www.instagram.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-instagram</v-icon></v-btn></a>
                                        <a :href="'https://www.twitter.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-twitter</v-icon></v-btn></a>
                                        <a :href="'https://www.pinterest.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"><v-icon small>mdi-pinterest</v-icon></v-btn></a>
                                    </div>
                                </v-card-actions>
                            </v-card>
                        </v-lazy>
                         <!-- lazy loading end -->
                    </v-col>
                </v-row>
            </section>
        </v-container>
        <!-- vuetify container end -->
    </div>
</template>

<script>
// import firebase database
import db from '@/firebase/init'
// import lodash plugin for orderBy
import orderBy from 'lodash/orderBy'

export default {
    name: 'ContentCreators',
    data() {
        return {
            lazyLoad: false, // vuetify lazyLoading component
            users: [] // all users array
        }
    },
    computed: {
        // The one who has published the most articles will be the first to show it
        orderedUsers() {
           return orderBy(this.users, 'totalArticles', 'desc') // useing lodash plugin
        }
    },
    created() {
        // get all user form database
        db.collection('users').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                db.collection('articles').where('userId', '==', doc.id).get()
                .then(snapshot => {
                    let user = doc.data()
                    user.totalArticles = snapshot.size
                    this.users.push(user)
                })               
            })
        })
    }
}
</script>