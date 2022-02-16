<template>
    <div class="profile">
        <!-- User profile info -->
        <div class="box">
            <div class="middle text-center">
                <!-- Container Start -->
                <!-- For loop -->
                <v-container v-for="user in profileInfo" :key="user.id">
                    <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
                    <vue-headful
                        :title="user.name"
                        :description="user.bio"
                        :image="user.avatar"
                        :url="url"
                    />
                    <!-- Set HeadFul End -->
                    <!-- Total articles -->
                    <v-badge
                        :color="$vuetify.theme.dark ? 'white black--text' : 'error white--text'"
                        offset-x="12"
                        offset-y="12"
                    >
                        <template v-slot:badge>
                            <p style="font-size: 14px" class="font-weight-bold pl-1 pr-1">{{ totalArticles }} Articles</p>
                        </template>
                        <!-- User avatar -->
                        <v-avatar width="130" height="130" class="mb-3">
                            <v-img
                                :src="user.avatar"
                                :lazy-src="user.avatar"
                                alt="John"
                                aspect-ratio="1"
                                class="grey lighten-2"
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
                        </v-avatar>
                    </v-badge>
                    <!-- User name -->
                    <h3>{{ user.name }}</h3>
                    <!-- User bio -->
                    <p :class="$vuetify.theme.dark ? 'white--text' : 'text-muted'">{{ user.bio ? user.bio : "The user don't have any bio on this time" }}</p>
                    <!-- User social media URL -->
                    <div class="social-media">
                        <a :href="'https://www.facebook.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-facebook</v-icon></v-btn></a>
                        <a :href="'https://www.instagram.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-instagram</v-icon></v-btn></a>
                        <a :href="'https://www.twitter.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'" class="mr-2"><v-icon small>mdi-twitter</v-icon></v-btn></a>
                        <a :href="'https://www.pinterest.com/' + user.facebookUrl" target="_blank"><v-btn icon :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"><v-icon small>mdi-pinterest</v-icon></v-btn></a>
                    </div>
                </v-container>
                <!-- Container End -->
            </div>
        </div>
        <!-- User profile info end -->
        <!-- Container Start -->
        <v-container v-if="articles != ''">
            <v-row>
                <v-col
                    v-for="(article, i) in articles"
                    :key="'N' + i"
                    cols="12"
                    xs="12"
                    sm="6"
                    md="4"
                    lg="4"
                    xl="3"
                    class="pt-0"
                >
                    <!-- Article item component -->
                    <article-item
                        :url="'/article/' + article.categorySlug + '/' + article.slug"
                        :editUrl="'/edit-article/' + article.categorySlug + '/' + article.slug"
                        :articleId="article.id"
                        :save="article.save"
                        :image="article.image"
                        :category="article.categoryId"
                        :date="article.date"
                        :title="article.title"
                        :description="article.description"
                        :userId="article.userId"
                    >
                        <!-- Article pending -->
                        <v-chip
                            color="orange"
                            text-color="white"
                            small
                            v-if="article.published != 1"
                        >
                            <v-icon small class="mr-1">mdi-alarm-check</v-icon> Pending
                        </v-chip>
                    </article-item>
                </v-col>
            </v-row>
            <!-- Load article button -->
            <div class="text-center m-4" v-if="articles.length != 0 && articles.length != totalArticles">
                <v-btn color="black white--text" elevation="0" :loading="loading" @click="loadArticles()"><v-icon class="mr-1">mdi-reload</v-icon> Load More</v-btn>
            </div>
        </v-container>
        <!-- Container End -->
        <!-- When no article found then show this component -->
        <no-article v-else></no-article>
    </div>
</template>

<script>
// Import lazy load component for ArticleItem, NoArticle
const ArticleItem = () => import('@/components/fragments/Article')
const NoArticle = () => import('@/components/fragments/NoArticle')
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'

export default {
    name: 'Profile',
    data() {
        return {
            loading: false, // vuetify loading
            url: window.location.href, // get current url
            userId: '', // store userId
            profileInfo: [], // user info
            articles: [], // all articles array
            totalArticles: 0, // total items
            lastTime: 0 // last time for load more article
        }
    },
    created() {
        // get all articles by username
        db.collection('users').where('username', '==', this.$route.params.username).get()
        .then(snapshot => {
            if(!snapshot.empty) { // check empty
                snapshot.forEach(doc => {
                    let user = doc.data() // assign data
                    user.id = doc.id
                    this.userId = doc.id // assign userId
                    this.profileInfo.push(user) // push user info

                    // get all articles by userId
                    db.collection('articles').where('userId', '==', user.id).orderBy('date', 'desc').limit(9)
                    .onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(change => {
                            if(change.type === 'added') {
                                this.pushArticle(change) // call a function
                            }

                            // filtering articles for deleted articles
                            if(change.type === 'removed') {
                                this.articles = this.articles.filter(article => {
                                    return article.id != change.doc.id
                                })
                            }
                        })
                        
                        let last = snapshot.docs[snapshot.docs.length - 1] // get last item
                        if(last) {
                            this.lastTime = last.data().date // set last time
                        }
                    })
                })
            }else {
                // If no user found then redirect to home 
                this.$router.push({ name: 'Home' })
            }

            // count how many saved articles here
            let allCount = db.collection('articles').where('userId', '==', this.userId)
            allCount.onSnapshot((snapshot) => {
                this.totalArticles = snapshot.size
            })
        }).catch(err => console.log(err))
    },
    methods: {
        // load article
        loadArticles() {
            this.loading = true
            let next = db.collection('articles')
            .where('userId', '==', this.userId)
            .orderBy('date', 'desc')
            .startAfter(this.lastTime)
            .limit(9)

            next.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added') {
                        this.loading = false
                        this.pushArticle(change) // call a function
                    }
                    
                    // filtering articles for deleted articles
                    if(change.type === 'removed') {
                        this.articles = this.articles.filter(article => {
                            return article.id != change.doc.id
                        })
                    }
                })

                let last = snapshot.docs[snapshot.docs.length - 1] // get last item
                if(last) {
                    this.lastTime = last.data().date // set last time
                }
            })
        },
        // push article
        pushArticle(change) {
            let article = change.doc.data() // assign data
            article.id = change.doc.id
            article.date = moment(change.doc.data().date).format('ll') // convert date
            this.articles.push(article) // push article

            // get article category
            db.collection("categories").doc(article.categoryId).get()
            .then(function(querySnapshot) {
                // assign data
                article.categoryId = querySnapshot.data().name
                article.categorySlug = querySnapshot.data().slug
            })

            if(this.$store.state.user.loggedIn) { // check user logged in
                // check article save or not
                db.collection('saves').where('articleId', '==', article.id).where('userId', '==', this.$store.state.user.data.uid)
                .onSnapshot(snapshot => {
                    article.save = snapshot.empty
                })
            }
        }
    },
    components: {
        // register components
        ArticleItem,
        NoArticle
    }
}
</script>

<style scoped>
/* Profile info  */
.profile .box {
    display: table;
    height: 500px; 
    margin: 0 auto;
}
.profile .box .middle {
    width: 600px;
    display: table-cell; 
    vertical-align: middle;
}
.profile .social-media i {
    font-size: 20px !important;
}

/* Small to large handset */
@media (max-width: 600px) {
    .profile .box {height: 400px;}
    .profile .box .middle {width: 100%; padding: 15px;}
    .profile .box .middle .v-avatar {width: 90px !important; height: 90px !important;}
    .profile .box .middle h3 {font-size: 22px;}
    .profile .box .middle p {font-size: smaller;}
}

/* Small to medium tablet */
@media (min-width: 600px) {
    .profile .box .middle p {padding: 0 5px};
}

/* Large tablet to laptop */
@media (min-width: 960px) {
    .profile .box .middle p {padding: 0;}
}
</style>