<template>
    <div class="contribute">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Contribute - ' + appName"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- Header -->
        <div :class="$vuetify.theme.dark ? 'grey darken-4' : 'blue lighten-5'">
            <v-container>
                <header>
                    <div class="middle">
                        <v-row no-gutters>
                            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <div class="left-content pr-5">
                                    <div class="middle pr-4">
                                        <h3>{{ title }}</h3>
                                        <p>{{ slogan }}</p>
                                        <v-btn color="black white--text" large :to="{ name: 'AddArticle' }">Start Contributing</v-btn>
                                    </div>
                                </div>
                            </v-col>
                            <v-col  cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <img :src="require('@/assets/contribute-cover.svg')" alt="Contribute Cover">
                            </v-col>
                        </v-row>
                    </div>
                </header>
            </v-container>
        </div>
        <!-- Header end -->
        <!-- Section -->
        <v-container>
            <section>
                <h3 class="text-center mb-5">{{ headLine }}</h3>
                <v-row>
                    <!-- for loop -->
                    <v-col v-for="(item, i) in items" :key="'N' + i" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
                        <v-card>
                            <v-card-text class="item text-center">
                                <v-icon :color="$vuetify.theme.dark ? 'white' : ''">mdi-{{ item.icon }}</v-icon>
                                <h4 :class="$vuetify.theme.dark ? 'white--text' : ''">{{ item.title }}</h4>
                                <p class="text-muted" :class="$vuetify.theme.dark ? 'white--text' : ''">{{ item.slogan }}</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </section>
        </v-container>
        <!-- Section End -->
        <!-- Content Creators Section -->
        <content-creators></content-creators>
    </div>
</template>

<script>
// Import lazy load component for ContentCreators
const ContentCreators = () => import('@/components/ContentCreators')
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Contribute',
    data() {
        return {
            url: window.location.href, // get current url
            favIconUrl: '', // set fav icon URL
            appName: '', // set aplication name
            description: '', // set description
            keywords: [], // set keywords
            title: '', // header title
            headLine: '', // header head line
            slogan: '', 
            items: [] // top users array  
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.favIconUrl = doc.data().favIcon
            this.appName = doc.data().appName
        })

        // get seo settings from datebase
        db.collection('settings').doc('seo').get()
        .then(doc => {
            this.description = doc.data().description,
            this.keywords = doc.data().keywords
        })

        // get contribute page settings from datebase
        db.collection('settings').doc('contribute-page-settings')
        .onSnapshot(doc => {
            this.title = doc.data().title
            this.headLine = doc.data().headLine
            this.slogan = doc.data().slogan
        })

        // get contribute page items
        db.collection('contributePageItems')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type === 'added') {
                    this.items.push(change.doc.data()) // push item
                }
            })
        })
    },
    components: {
        ContentCreators // register component
    }
}
</script>

<style scoped>
/* Contribute header style */
.contribute header {
    width: 100%;
    height: 100vh;
    display: table;
}
/* Contribute header left content */
.contribute header .left-content {
    width: 100%;
    height: 100%;
    display: table;
}
.contribute header .middle {
    width: 100%;
    height: 100%;
    display: table-cell;
    vertical-align: middle;
}
.contribute header h3 {font-weight: bold;}
.contribute header img {width: 100%; height: 100%;}
/* Contribute section style */
.contribute section {padding-top: 30px; padding-bottom: 30px;}
.contribute section a {text-decoration: none;}
.contribute section h3 {font-weight: bold;}
/* Contribute item style */
.contribute .item i {    
    font-size: 60px;
    color: #000;
}
.contribute .item h4 {
    font-size: 20px;
    color: #000;}
.contribute .item p {font-size: 16px;}

/* Small to large handset */
@media (max-width: 600px) { 
    .contribute header .left-content {text-align: center; margin-bottom: 35px; padding: 0 !important;}
    .contribute header .left-content .middle {padding: 5px !important;}
    .contribute header h3 {font-size: 22px;}
    .contribute header p {font-size: smaller;}
    .contribute section h3 {font-size: 22px;}
    .contribute .item h4 {font-size: 18px;}
    .contribute .item p {font-size: smaller;}
}

/* Small to medium tablet */
@media (min-width: 600px) {
    .contribute header .left-content {width: 500px; margin: 0 auto; text-align: center; margin-bottom: 40px; padding: 0 !important;}
    .contribute header .left-content .middle {padding: 5px !important;}
}

/* Large tablet to laptop */
@media (min-width: 960px) {
    .contribute header .left-content {
        width: 100%;
        margin: 0;
        text-align: left;
        padding-right: 8px !important;
    }
    .contribute .item h4 {font-size: 18px;}
    .contribute .item p {font-size: smaller;}
}

/* Desktop */
@media (min-width: 1264px) {
    .contribute header .left-content {padding-right: 45px !important;}
    .contribute .item h4 {font-size: 20px;}
    .contribute .item p {font-size: 16px;}
}
</style>