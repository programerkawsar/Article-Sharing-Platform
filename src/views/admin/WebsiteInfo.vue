<template>
    <div class="website-info">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Website Info Settings - ' + appName"
        />
        <!-- Set HeadFul End -->
        <!-- Container Start -->
        <v-container>
            <!-- general settings component -->
            <general-settings></general-settings>
            <!-- contribute page settings component -->
            <contribute-page-settings></contribute-page-settings>
            <!-- vuetify form -->
            <v-form>
                    <v-row>
                        <v-col cols="12">
                            <v-input class="font-weight-bold">Contribute Page Items</v-input>
                        </v-col>
                        <!-- for loop -->
                        <v-col v-for="(item, index) in items" :key="index" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
                            <v-card>
                                <div class="clearfix">
                                    <div class="float-right">
                                        <v-btn icon color="primary" class="m-2" @click="editItem(item)">
                                            <v-icon>mdi-pen</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                                <v-card-text class="item text-center">
                                    <v-icon :color="$vuetify.theme.dark ? 'white' : ''">mdi-{{ item.icon }}</v-icon>
                                    <h4 :class="$vuetify.theme.dark ? 'white--text' : ''">{{ item.title }}</h4>
                                    <p class="text-muted" :class="$vuetify.theme.dark ? 'white--text' : ''">{{ item.slogan }}</p>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
            </v-form>
            <!-- vuetify form end -->
        </v-container>
        <!-- Container End -->
        <!-- vuetify dialog for edit item -->
        <v-dialog v-model="dialog" persistent max-width="420">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Item</span>
                </v-card-title>
                <!-- vuetify form -->
                <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="updateItem()"
                >
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <small class="text-muted">You will find many icons on <a href="https://materialdesignicons.com/" target="_blank">This Link</a></small>
                                <v-text-field
                                    v-model="editedItem.icon"
                                    :rules="[rules.required]"
                                    label="Icon"
                                    required
                                    solo
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="editedItem.title"
                                    :rules="[rules.required]"
                                    label="Title"
                                    required
                                    solo
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="editedItem.slogan"
                                    :rules="[rules.required]"
                                    label="Title"
                                    required
                                    solo
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" text @click="dialog = false">Disagree</v-btn>
                        <v-btn 
                            color="green darken-1" 
                            text 
                            type="submit"
                            :disabled="!valid || loading"
                            :loading="loading"
                        >Agree</v-btn>
                    </v-card-actions>
                </v-form>
                <!-- vuetify form end -->
            </v-card>
        </v-dialog>
        <!-- vuetify dialog end -->
    </div>
</template>

<script>
// Import lazy load component for GeneralSettings, ContributePageSettings
const GeneralSettings = () => import('@/components/admin/fragments/GeneralSettings')
const ContributePageSettings = () => import('@/components/admin/fragments/ContributePageSettings')
// import firebase database
import db from '@/firebase/init'

export default {
    name: 'WebsiteInfo',
    data() {
        return {
            valid: true, // vuetify form valid 
            dialog: false, // vuetify dialog
            loading: false, // vuetify loading
            appName: '', // set fav icon URL
            items: [], // all items array
            editedIndex: -1, // vuetify data table editedIndex
            editedItem: { // vuetify data table editedItem property
                id: '',
                icon: '',
                title: '',
                slogan: ''
            },
            rules: { // validtion rule
                required: value => !!value || 'This field must required',
            },
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

        // get and set all contribute page items
        db.collection('contributePageItems')
        .onSnapshot(snapshot => {
            if(!snapshot.empty) { // check empty
                snapshot.docChanges().forEach(change => {
                    let item = change.doc.data() // assign data
                    item.id = change.doc.id

                    if(change.type === 'added') {
                        this.items.push(item) // call a function and passing data
                    }

                    // when item update then modified it by current data table edited index
                    if(change.type === "modified") {
                        this.items.splice(this.editedIndex, 1, item)
                    }
                })
            }else {
                // if no items found then set defualt contribute page items
                db.collection('contributePageItems').add({
                    icon: "crown",
                    title: "Get recognized",
                    slogan: "Get credit for the kind of stories that only you can tell."
                }).then(() => {
                    db.collection('contributePageItems').add({
                        icon: "account-tie",
                        title: "Be a thought leader",
                        slogan: "Establish yourself as an authority in your field."
                    }).then(() => {
                        db.collection('contributePageItems').add({
                            icon: "forum",
                            title: "Spark conversation",
                            slogan: "Get people talking about things that matter."
                        }).then(() => {
                            db.collection('contributePageItems').add({
                                icon: "account-group",
                                title: "Build a following",
                                slogan: "Build a dedicated audience for your content."
                            }) 
                        })
                    })
                })
            }
        })
    },
    methods: {
        // assign contribute page item data to dialog
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        // update contribute page item
        updateItem() {
            this.loading = true // vuetify loading
            db.collection('contributePageItems').doc(this.editedItem.id).update({
                icon: this.editedItem.icon,
                title: this.editedItem.title,
                slogan: this.editedItem.slogan
            }).then(() => {
                this.dialog = false // vuetify dialog
                this.loading = false // vuetify loading
            })
        }
    },
    components: {
        // register component
        GeneralSettings,
        ContributePageSettings
    }
}
</script>

<style scoped>
/* website info setting style */
.website-info {
    width: 100%;
    padding-left: 30px;
} 
.website-info .item i {    
    font-size: 50px;
    color: #000;
}
.website-info .item h4 {font-size: 20px;}
.website-info .item p {font-size: 16px;}
</style>