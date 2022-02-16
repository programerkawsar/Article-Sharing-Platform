<template>
    <div class="dashboard">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Dashboard - ' + appName"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- Container Start -->
        <v-container>
            <v-row>
                <v-col cols="12" xs="12" sm="6" md="6" lg="3" xl="3">
                    <v-card class="text-center p-5">
                        <h3>{{ totalArticles }}</h3>
                        <p class="text-muted text-uppercase">Total Articles</p>
                    </v-card>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="3" xl="3">
                    <v-card class="text-center p-5">
                        <h3>{{ pendingArticles }}</h3>
                        <p class="text-muted text-uppercase">Pending Articles</p>
                    </v-card>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="3" xl="3">
                    <v-card class="text-center p-5">
                        <h3>{{ totalViewsSum }}</h3>
                        <p class="text-muted text-uppercase">Total Views</p>
                    </v-card>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="3" xl="3">
                    <v-card class="text-center p-5">
                        <h3>{{ totalComments }}</h3>
                        <p class="text-muted text-uppercase">Total Comments</p>
                    </v-card>
                </v-col>
            </v-row>
            <v-card class="chart mt-3 mb-3">
                <!-- Vue chart -->
                <ve-line :data="chartData"></ve-line>
            </v-card>
        </v-container>
        <!-- Container End -->
    </div>
</template>

<script>
// import vue chart plugin
import VeLine from 'v-charts/lib/line.common'
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'
// moment for convert number
const numeral = require('numeral')

export default {
    name: 'Dashboard',
    data() {
        return {
            url: window.location.href, // get current URL
            favIconUrl: '', // set fav icon URL
            appName: '', // set aplication name
            description: '', // set description
            keywords: [], // set keywords
            totalArticles: 0, // total items
            pendingArticles: 0, // total pending items
            totalViews: [], // all article views array
            totalViewsSum: 0, // total views sum
            totalComments: 0, // total comment
            chartData: { // chart data
                columns: ['date', 'views'],
                rows: []
            }
        }
    },
    computed: {
        // count total views
        totalViewsCount() {
            return this.totalViews.reduce(function(total, item){
                return total + item
            }, 0)
        }
    },
    watch: {
        // convert total views
        totalViewsCount(val) {
            let total = val > 999 ? numeral(val).format('0.0a') : val
            this.totalViewsSum = total
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

        // get total articles and get total article comments from datebase
        db.collection('articles').where('userId', '==', this.$store.state.user.data.uid).onSnapshot(snapshot => {
            let total = snapshot.size > 999 ? numeral(snapshot.size).format('0.0a') : snapshot.size // convert number
            this.totalArticles = total // get total article
            snapshot.docChanges().forEach(change => {
                let article = change.doc.data()
                article.date = moment(change.doc.data().date).format('ll') //convert date
                this.chartData.rows.push(article) // push to chart data
                //get total article comments
                db.collection('comments').where('articleId', '==', change.doc.id).onSnapshot(snapshot => {
                    let total = snapshot.size > 999 ? numeral(snapshot.size).format('0.0a') : snapshot.size // convert number
                    this.totalComments = total // get total comments
                })
            })
        })

        // get total pending articles
        db.collection('articles')
        .where('userId', '==', this.$store.state.user.data.uid)
        .where('published', '==', 2)
        .onSnapshot(snapshot => {
            let total = snapshot.size > 999 ? numeral(snapshot.size).format('0.0a') : snapshot.size // convert number
            this.pendingArticles = total
        })

        // get total article views
        db.collection('articles').where('userId', '==', this.$store.state.user.data.uid).onSnapshot(snapshot => { // get uid from vuex 
            snapshot.docChanges().forEach(change => {
                this.totalViews.push(change.doc.data().views)
            })
        })
    },
    components: { VeLine } // register component
}
</script>