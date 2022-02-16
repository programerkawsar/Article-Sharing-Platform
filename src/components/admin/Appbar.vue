<template>
    <div>
        <!-- sidebar component -->
        <sidebar :drawer="drawer"></sidebar>
        <!-- admin top bar -->
        <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            :color="$vuetify.theme.dark ? 'grey darken-3' : 'blue darken-3'"
            dark
        >
            <!-- sidebar open/close button -->
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <!-- navigation title -->
            <v-toolbar-title
                style="width: 300px"
                class="ml-0 pl-4"
            >
                <span class="hidden-sm-and-down">Admin Panel</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- go to base url button -->
            <v-btn icon to="/">
                <v-icon>mdi-web</v-icon>
            </v-btn>
            <!-- dark/light button -->
            <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
                <v-icon>{{ $vuetify.theme.dark ? 'mdi-lightbulb-on': 'mdi-lightbulb-on-outline' }}</v-icon>
            </v-btn>
            <!-- notifications component -->
            <notifications></notifications>
            <!-- dropdown menu -->
            <v-menu offset-y :nudge-width="190">
                <!-- menu open button -->
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        large
                        v-on="on"
                    >
                        <!-- user avatar -->
                        <v-avatar
                            size="32px"
                            item
                        >
                            <!-- image -->
                            <v-img
                                :src="avatar"
                                :alt="name"
                            ></v-img>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-card>
                    <!-- menu list -->
                    <v-list>
                        <v-list-item-group>  
                            <!-- item lists -->                                                   
                            <v-list-item to="/settings">
                                <v-list-item-icon>
                                    <v-icon>mdi-account-cog-outline</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Settings</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>  
                            <v-divider class="m-0"></v-divider>                            
                            <v-list-item @click="logout()">
                                <v-list-item-icon>
                                    <v-icon>mdi-logout-variant</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Logout</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>   
                        </v-list-item-group>
                    </v-list>
                    <!-- menu list -->
                </v-card>
            </v-menu>
            <!-- dropdown menu -->
        </v-app-bar>
        <!-- admin top bar end -->
    </div>
</template>

<script>
// Import lazy load component for Sidebar, Notifications
const Sidebar = () => import('@/components/admin/Sidebar')
const Notifications = () => import('@/components/admin/fragments/Notifications')
// import firebase app
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Appbar',
    data() {
        return {
            drawer: false, // sidebar by default hide
            avatar: '', // store user avatar
            name: '' // store user name
        }
    },
    created() {
        // get user data
        db.collection('users').doc(this.$store.state.user.data.uid).get() // get uid form vuex store
        .then(snapshot => {
            this.avatar = snapshot.data().avatar
            this.name = snapshot.data().name
        })
    },
    methods: {
        // user logout
        logout() {
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login' }) // redirect to login page
            })
        }
    },
    components: {
        // register components
        Sidebar,
        Notifications
    }
}
</script>