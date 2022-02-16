<template>
    <!-- lazy loading -->
    <v-lazy
        v-model="lazyLoad"
        :options="{
          threshold: .5
        }"
        transition="fade-transition"
    >
        <!-- vuetify menu -->
        <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
                <!-- notification button -->
                <v-btn icon  v-on="on" @click="unseenAllNotifications()">
                    <!-- vuetify badge for notification seen/unseen -->
                    <v-badge
                        v-if="unseenAll"
                        color="pink"
                        offset-x="6"
                        offset-y="6"
                        dot
                    >
                        <!-- bell icon -->
                        <v-icon>mdi-bell-outline</v-icon>
                    </v-badge>
                    <!-- bell icon -->
                    <v-icon v-else>mdi-bell-outline</v-icon>
                </v-btn>
            </template>
            <!-- vuetify card -->
            <v-card class="mx-auto" :class="$vuetify.theme.dark ? 'v-bar-dark' : ''" max-width="344" height="450" v-bar>
               <!-- vuetify list -->
               <v-list two-line class="pt-0">
                    <v-list-item-group
                        v-model="selected"
                        v-if="items != ''"
                        multiple                        
                    >
                        <!-- for loop -->
                        <template v-for="(item, index) in items">
                            <v-list-item :class="{'remove-v-item--active-style' : 'v-item--active v-list-item--active'}" :key="'A'+ index">
                                <!-- user avatar -->
                                <v-list-item-avatar>
                                    <!-- image -->
                                    <v-img
                                        :src="item.userAvatar ? item.userAvatar : 'https://firebasestorage.googleapis.com/v0/b/online-articleshare.appspot.com/o/default-avatar.jpg?alt=media&token=6f189003-7e71-49e6-8be1-48a17ad16cf4'"
                                        :lazy-src="item.userAvatar ? item.userAvatar : 'https://firebasestorage.googleapis.com/v0/b/online-articleshare.appspot.com/o/default-avatar.jpg?alt=media&token=6f189003-7e71-49e6-8be1-48a17ad16cf4'"
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
                                </v-list-item-avatar>
                                
                                <!-- notification content -->
                                <v-list-item-content>
                                    <v-list-item-title v-text="item.userId"></v-list-item-title>
                                    <v-list-item-subtitle v-text="item.text"></v-list-item-subtitle>
                                </v-list-item-content>

                                 <!-- delete notification button and time -->
                                <v-list-item-action>
                                    <v-list-item-action-text v-text="item.time"></v-list-item-action-text>
                                    <v-btn icon color="error" :class="{'remove--v-btn--active-style' : 'v-btn--active'}" @click="deleteNotification(item.id, index), isClicked = []" :to="$route.fullPath == $route.fullPath ? $route.fullPath : ''">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>

                            <v-divider
                                v-if="index + 1 < items.length"
                                :key="index"
                                class="m-0"
                            ></v-divider>
                        </template>
                         <!-- load more button -->
                        <div class="text-center pb-3 pt-0">
                            <v-btn text small v-if="items.length != totalNotifications" :loading="loading" @click="loadNotifications()">Load More</v-btn>
                        </div>
                    </v-list-item-group>
                    <!-- When no notification found then show this component -->
                    <v-list-item v-else>
                        <v-list-item-content class="empty-notification text-center w-100">
                            <div class="middle">
                                <v-icon large class="p-5 pb-2">mdi-delete-empty-outline</v-icon>
                                <v-list-item-title>No notifications yet</v-list-item-title>
                            </div>
                        </v-list-item-content>                       
                    </v-list-item>
                </v-list>
                <!-- vuetify list end -->
            </v-card>
            <!-- vuetify card end -->
        </v-menu>
        <!-- vuetify menu end -->
    </v-lazy>
    <!-- lazy loading end -->
</template>

<script>
// moment for convert date
import moment from 'moment/src/moment'
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'Notifications',
    data() {
        return {
            lazyLoad: false, // vuetify lazy load
            loading: false, // vuetify loading
            selected: [0], // vuetify list item selected
            items: [], // all items array
            unseenAll: false, // notification seen/unseen
            isClicked: [], // multiple click to single loading
            totalNotifications: 0, // total notifications
            lastTime: 0 // last time for load more notifications
        }
    },
    created() {
        this.allNotifications() // load all notifications
    },
    methods: {
        // get all notifications
        allNotifications() {
            db.collection('notifications')
            .where('admin', '==', true)
            .orderBy('time', 'desc')
            .limit(8)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added') {
                        this.pushNotifications(change) // push notifications one by one
                    }

                    if(change.type === "modified") {
                        this.unseenAll = change.doc.data().unseenAll // seen/unseen
                    }

                    // when notification deleted then removed real time from list
                    if(change.type === 'removed') {
                        this.items = this.items.filter(item => {
                            return item.id != change.doc.id
                        })
                    }
                })

                let last = snapshot.docs[snapshot.docs.length - 1]; // get last item
                if(last) {
                    this.lastTime = last.data().time // set last time
                }
            })
            
            // count how many notification here
            db.collection('notifications')
            .where('admin', '==', true)
            .onSnapshot((snapshot) => {
                this.totalNotifications = snapshot.size
            })
        },
        // load notifications
        loadNotifications() {
            this.loading = true // vuetify loading
            db.collection('notifications')
            .where('admin', '==', true)
            .orderBy('time', 'desc')
            .startAfter(this.lastTime) // set last time
            .limit(8)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added') {
                        this.pushNotifications(change, 0) // push notifications and passing data
                    }

                    if(change.type === "modified") {
                        this.unseenAll = change.doc.data().unseenAll // seen/unseen
                    }

                    // when notification deleted then removed real time from list
                    if(change.type === 'removed') {
                        this.items = this.items.filter(item => {
                            return item.id != change.doc.id
                        })
                    }
                })

                let last = snapshot.docs[snapshot.docs.length - 1]; // get last item
                if(last) {
                    this.lastTime = last.data().time // set last time
                }
            })
        },
        // unseen all notification on a singel click
        unseenAllNotifications() {
            db.collection('notifications')
            .where('admin', '==', true).get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    // set notification unseen
                    db.collection('notifications').doc(doc.id).update({
                        unseenAll: false
                    })
                })
            })
        },
        // delete notification
        deleteNotification(id, index) { // get data from passing function
            this.$set(this.isClicked, index, !this.isClicked[index]) // set single button loading
            db.collection('notifications').doc(id).delete()
            .then(() => {
                this.isClicked = [] // empty all loadings
            })
        },
        // push notifications
        pushNotifications(change, num) { // get data from passing function
            this.loading = false // vuetify loading
            let notify = change.doc.data() // assign data
            notify.id = change.doc.id
            notify.time = moment(notify.time).endOf('hour').fromNow() // format time

            if(change.newIndex == 0 && num != 0) { // check notification realtime added or not
                this.items.unshift(notify) // when notification added realtime then set to top the notification
            }else {
                this.items.push(notify) // push all notifications
            }                

            if(notify.unseenAll == true) { // check notifications seen or not
                this.unseenAll = notify.unseenAll // seen/unseen
            }
                    
            if(notify.userId) {
                this.getUserByNotifyId(notify) // call a function and passing data
            }
        },
        // get user data
        getUserByNotifyId(notify) {
            db.collection("users").doc(notify.userId).get()
            .then((querySnapshot) => {
                if(querySnapshot.exists) {
                    notify.userId = querySnapshot.data().name
                    notify.username = querySnapshot.data().username
                    notify.userAvatar = querySnapshot.data().avatar
                }
            }).catch(err => console.log(err))
        }
    }
}
</script>

<style>
/* vuebar plugin styles */
.vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    background-color: rgba(0, 0, 0);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(0, 0, 0);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(0, 0, 0);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(0, 0, 0);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(0, 0, 0);
}

/* Dark & Light theme style */
.v-bar-dark  .vb-dragger > .vb-dragger-styler {background-color: rgba(255, 255, 255) !important;}
.v-bar-dark .vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {background-color: rgba(255, 255, 255) !important;}
.v-bar-dark .vb-dragger:hover > .vb-dragger-styler {background-color: rgba(255, 255, 255) !important;}
.v-bar-dark .vb-dragging > .vb-dragger > .vb-dragger-styler {background-color: rgba(255, 255, 255) !important;}
.v-bar-dark .vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {background-color: rgba(255, 255, 255) !important;}
</style>

<style scoped>
/* customize vuetify style */
.theme--light.remove-v-item--active-style:hover::before, .theme--light.remove-v-item--active-style::before {
    opacity: 0 !important;
}
.empty-notification .middle {
    width: 100vh;
}
</style>