<template>
    <v-footer
      dark
      padless
    >
        <!-- vuetify card -->
        <v-card
            flat
            tile
            class="text-center"
            color="white--text"
            style="width:100%"
        >
            <!-- footer page links -->
            <v-container>
                <ul class="footer-nav mt-2">
                    <li>
                        <router-link :to="{ name: 'ContactUs' }">ContactUs</router-link>
                    </li>
                    <!-- for loop -->
                    <li v-for="(page, i) in pages" :key="'N' + i">
                        <router-link :to="{ name: 'Page', params: { slug: page.slug } }">{{ page.name }}</router-link>
                    </li>
                </ul>
            </v-container>
            <!-- footer social media links -->
            <v-card-text class="social-media p-2 pb-4">
                <a :href="facebookURL" target="_blank">
                    <v-btn
                        class="mx-2 white--text"
                        icon
                    >
                        <v-icon size="24px">mdi-facebook</v-icon>
                    </v-btn>
                </a>
                <a :href="twitterURL" target="_blank">
                    <v-btn
                        class="mx-2 white--text"
                        icon
                    >
                        <v-icon size="24px">mdi-twitter</v-icon>
                    </v-btn>
                </a>
                <a :href="instagramURL" target="_blank">
                    <v-btn
                        class="mx-2 white--text"
                        icon
                    >
                        <v-icon size="24px">mdi-instagram</v-icon>
                    </v-btn>
                </a>
                <a :href="pinterestURL" target="_blank">
                    <v-btn
                        class="mx-2 white--text"
                        icon
                    >
                        <v-icon size="24px">mdi-pinterest</v-icon>
                    </v-btn>
                </a>
            </v-card-text>
            <!-- footer social media links end -->
            <v-divider class="m-0"></v-divider>
            <!-- copyright text -->
            <v-card-text class="white--text copyright-text">
                <!-- get current year -->
                Copyright © {{ new Date().getFullYear() }} <strong>{{ appName }}.</strong> All Rights Reserved.
            </v-card-text>
        </v-card>
        <!-- vuetify card end -->
    </v-footer>
</template>

<script>
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Footer',
    data() {
        return {
            pages: [], // all pages array
            appName: '', // store app name
            facebookURL: '', // store facebook URL
            twitterURL: '', // store twitter URL
            instagramURL: '', // store instagram URL
            pinterestURL: '', // store pinterest URL
        }
    },
    created() {
        // get all social media links from database 
        db.collection('settings').doc('social-media')
        .onSnapshot(doc => {
            this.facebookURL = doc.data().facebookURL
            this.twitterURL = doc.data().twitterURL
            this.instagramURL = doc.data().instagramURL
            this.pinterestURL = doc.data().pinterestURL
        })

        // get general settings from database 
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName 
        })

        // get all pages from database 
        db.collection('pages').orderBy('date', 'desc')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type === 'added') {
                    this.pages.push(change.doc.data()) // push to array
                }
            })
        })
    }
}
</script>

<style scoped>
/* footer styles */
.footer-nav {padding: 0; margin: 0;}   
.footer-nav li {
    display: inline-block;
    margin-right: 20px;
}   
.footer-nav li:last-child {margin-right: 0;}
.footer-nav li a {
    color: #fff;
    text-transform: uppercase;
    font-size: 15px;
}
.footer-nav .v-card__text {font-size: small;}

/* Small to large handset */
@media (max-width: 600px) { 
    .footer-nav li a {font-size: 13px;}
    .social-media i {font-size: 20px !important;}
    .copyright-text {font-size: small;}
}
</style>