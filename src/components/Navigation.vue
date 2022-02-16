<template>
    <v-app-bar elevation="0" class="navigation--show" :class="{ 'navigation' : !search.bar, 'navigation--hidden': !showNavbar }">
        <!-- search bar left button -->
        <v-btn icon v-show="this.$route.name == 'Home'" @click="search.bar = !search.bar; searchBarToggleIcon()">
            <v-icon>mdi-{{ search.icon }}</v-icon>
        </v-btn>
        <!-- search bar right button -->
        <v-btn icon v-if="this.$route.name != 'Home'" :to="{ path: $routerHistory.hasPrevious() ? $routerHistory.previous().path : '/' }">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <!-- search component -->
        <search v-if="search.bar && this.$route.name == 'Home'" ></search>
        <!-- navigation logo -->
        <v-row justify="center" class="logo-row" v-if="!search.bar">
            <!-- home page link -->
            <router-link class="logo-link" to="/">
                <!-- logo -->
                <v-img :src="$vuetify.theme.dark ? logo.whiteSrc : logo.src" :alt="logo.alt" aspect-ratio="1.7" class="logo"></v-img>
            </router-link>
        </v-row>
        <!-- notification component -->
        <notifications v-if="!search.bar && showNavbar && user.loggedIn"></notifications>
        <!-- saved articles button -->
        <v-btn icon v-if="!search.bar && user.loggedIn" :to="{ name: 'Saved' }">
            <v-icon>mdi-bookmark-outline</v-icon>
        </v-btn>
        <!-- all categories button -->
        <v-btn icon v-if="!search.bar" :to="{ name: 'Categories' }">
            <v-icon>mdi-view-grid-outline</v-icon>
        </v-btn>
        <!-- dark/light mode button -->
        <v-btn icon v-if="!search.bar" @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-icon>{{ $vuetify.theme.dark ? 'mdi-lightbulb-on': 'mdi-lightbulb-on-outline' }}</v-icon>
        </v-btn>
        <!-- vuetify menu -->
        <v-menu offset-y :nudge-width="190" v-if="!search.bar && showNavbar">
            <!-- menu button -->
            <template v-slot:activator="{ on }">
                <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
            </template>
            <v-card>
                <v-list>
                    <v-list-item-group>
                        <!-- admin panel button -->
                        <v-list-item :to="{ name: 'Admin' }" v-if="user.loggedIn && user.data.role == 1">
                            <v-list-item-icon>
                                <v-icon>mdi-view-dashboard-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Admin</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="m-0" v-if="user.loggedIn && user.data.role == 1"></v-divider>
                        <!-- account button -->
                        <v-list-item v-if="user.loggedIn" :to="{ name: 'Profile', params: { username: user.loggedIn ? user.data.username : '' } }">
                            <v-list-item-icon>
                                <v-icon>mdi-account-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Account</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <!-- login button -->
                        <v-list-item v-else :to="{ name: 'Login' }">
                            <v-list-item-icon>
                                <v-icon>mdi-account-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Account</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="m-0"></v-divider>
                        <!--  dashboard button -->
                        <v-list-item :to="{ name: 'Dashboard' }" v-if="user.loggedIn">
                            <v-list-item-icon>
                                <v-icon>mdi-speedometer</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Dashboard</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="m-0" v-if="user.loggedIn"></v-divider>
                        <!--  contribute button -->
                        <v-list-item :to="{ name: 'Contribute' }">
                            <v-list-item-icon>
                                <v-icon>mdi-card-text-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Contribute</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="m-0" v-if="user.loggedIn"></v-divider>
                        <!--  request button -->
                        <v-list-item :to="{ name: 'Request' }" v-if="user.loggedIn">
                            <v-list-item-icon>
                                <v-icon>mdi-briefcase-plus-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Request</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="m-0" v-if="user.loggedIn"></v-divider>
                        <!--  settings button -->
                        <v-list-item :to="{ name: 'Settings' }" v-if="user.loggedIn">
                            <v-list-item-icon>
                                <v-icon>mdi-account-cog-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Settings</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="m-0" v-if="user.loggedIn"></v-divider>
                        <!--  logout button -->
                        <v-list-item v-if="user.loggedIn" @click="logout()">
                            <v-list-item-icon>
                                <v-icon>mdi-logout-variant</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-menu>
        <!-- vuetify menu end -->
    </v-app-bar>
</template>

<script>
// mapGetters for get data form vuex store
import { mapGetters } from "vuex"
// import firebase database
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import firebase storage
import 'firebase/storage'
// import lazy load component for Notifications, Search
const Notifications = () => import('@/components/fragments/Notifications')
const Search = () => import('@/components/fragments/Search')

export default {
    name: 'Navigation',
    data() {
        return {
            // website logo
            logo: {
                src: '',
                whiteSrc: '',
                alt: 'Logo'
            },
            // search bar
            search: {
                bar: false,
                icon: 'magnify'
            },
            showNavbar: true, // show navigation bar
            lastScrollPosition: 0, // last scroll position
        }
    },
    computed: {
        ...mapGetters({
            user: "user" // assign data from vuex store
        })
    },
    watch: {
        // on route change search bar hide
        $route(to, from) {
            this.search.bar = false
            this.search.icon = 'magnify'
        }
    },
    created() {
        // get logo form firebase storage
        let pathReference = firebase.storage().ref('logo.svg')
        pathReference.getDownloadURL().then((url) => {
            this.logo.src = url
        })

        // get white logo form firebase storage
        let pathReference2 = firebase.storage().ref('white-logo.svg')
        pathReference2.getDownloadURL().then((url) => {
            this.logo.whiteSrc = url
        })
    },
    methods: {
        // set search bar close/magnify icon on toggle
        searchBarToggleIcon() {
            this.search.bar ? this.search.icon = 'close' : this.search.icon = 'magnify'
        },
        // this is for top navigation when scroll down to hide and scroll up to show navigation
        onScroll() {
            const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
                if (currentScrollPosition < 0) {
                    return
            }
            // Stop executing this function if the difference between
            // current scroll position and last scroll position is less than some offset
            if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
                return
            }
            this.showNavbar = currentScrollPosition < this.lastScrollPosition
            this.lastScrollPosition = currentScrollPosition
        },
        // user logout
        logout() {
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login' }) // redirect to login
            })
        }
    },
    mounted () {
        // call a function on scroll
        window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy () {
        // call a function on scroll
        window.removeEventListener('scroll', this.onScroll)
    },
    components: {
        // register components
        Notifications,
        Search
    }
}
</script>

<style>
/* all anchor tags */
a {text-decoration: none !important;}
/* customize vuetify styles */
.navigation .v-toolbar__content, .v-toolbar__extension {padding: 4px 142px}
/* navigation logo */
.navigation .logo-link {width: 100%}
.navigation .logo .v-image__image {background-size: 150px}
/* navigation show/hide */
.navigation--show {
    position: fixed;
    top: 0;
    transform: translate3d(0, 0, 0);
    transition: 0.1s all ease-out;
    overflow: hidden;
    z-index: 999;
}
.navigation--hidden {
    transform: translate3d(0, -100%, 0) !important;
}

/* Small to large handset */
@media (max-width: 600px) {
    .navigation .v-toolbar__content, .v-toolbar__extension {padding: 4px 10px}
    .navigation .v-toolbar__content {justify-content: center}
    .navigation .logo-row {display: none}
}

/* Small to medium tablet */
@media (min-width: 600px) {
    .navigation .v-toolbar__content, .v-toolbar__extension {padding: 4px 35px}
}

/* Large tablet to laptop */
@media (min-width: 960px) {
    .navigation .v-toolbar__content, .v-toolbar__extension {padding: 4px 55px}
}

/* Desktop */
@media (min-width: 1264px) {
    .navigation .v-toolbar__content, .v-toolbar__extension {padding: 4px 145px}
}
</style>

<style scoped>
/* Dark & Light theme input, textarea color */
.settings .theme--light .v-input--is-focused input, .theme--light .v-input--is-focused textarea {
    color: white !important;
}
.settings .theme--light .v-input input, .theme--light .v-input textarea {
    color: black;
}
.settings .theme--dark .v-input--is-focused input, .theme--dark .v-input--is-focused textarea {
    color: black !important;
}
.settings .theme--dark.v-input input, .theme--dark.v-input textarea {
    color: white;
}
</style>