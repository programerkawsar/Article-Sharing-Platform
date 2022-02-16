<template>
    <div class="admin-dashboard">
            <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
            <vue-headful
                :title="'Admin - ' + appName"
            />
            <!-- Set HeadFul End -->
            <!-- Total section -->
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
                        <h3>{{ totalUsers }}</h3>
                        <p class="text-muted text-uppercase">Total Users</p>
                    </v-card>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="3" xl="3">
                    <v-card class="text-center p-5">
                        <h3>{{ totalRequests }}</h3>
                        <p class="text-muted text-uppercase">Slider Requests</p>
                    </v-card>
                </v-col>
            </v-row>
            <!-- Total section end -->
            <!-- chart data -->
            <v-card class="chart mt-3 mb-3">
                <ve-line :data="articlesChartData"></ve-line>
            </v-card>
            <br>
            <v-card class="chart mt-3 mb-3">
                <ve-line :data="usersChartData"></ve-line>
            </v-card>
            <!-- chart data end -->
    </div>
</template>

<script>
// Import Chart
import VeLine from 'v-charts/lib/line.common'
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'

export default {
    name: 'AdminHome',
    data() {
        return {
            totalArticles: 0, // total articles
            pendingArticles: 0, // total pending articles
            totalUsers: 0, // total slider request
            totalRequests: 0,
            appName: '', // set aplication name
            articlesChartData: { // chart data
                columns: ['date', 'views'],
                rows: []
            },
            usersChartData: { // chart data
                columns: ['date', 'totalArticles'],
                rows: []
            }
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

        // get total articles and articles data
        db.collection('articles').onSnapshot(snapshot => {
            this.totalArticles = snapshot.size
            snapshot.docChanges().forEach(change => {
                let article = change.doc.data()
                article.date = moment(change.doc.data().date).format('ll') // convert date
                this.articlesChartData.rows.push(article) // push data
            })
        })

        // get total pending articles
        db.collection('articles').where('published', '==', 2).onSnapshot(snapshot => {
            this.pendingArticles = snapshot.size
        })

        // get total users and user data
        db.collection('users').onSnapshot(snapshot => {
            this.totalUsers = snapshot.size
            snapshot.docChanges().forEach(change => {
                let user = change.doc.data()
                user.date = moment(change.doc.data().date).format('ll') // convert date
                this.usersChartData.rows.push(user) // push data

                // get total users
                db.collection('articles').where('userId', '==', change.doc.id).get()
                .then(snapshot => {
                    user.totalArticles = snapshot.size
                })
            })
        })

        // get total slider request
        db.collection('requests').onSnapshot(snapshot => {
            this.totalRequests = snapshot.size
        })
    },
    components: {
      VeLine // register component
    }
}
</script>

<style scoped>
/*  data table styles */
.admin-dashboard {
    width: 100%;
    padding-left: 30px;
}
</style>