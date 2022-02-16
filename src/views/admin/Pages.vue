<template>
    <div class="admin-pages-list">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Page Settings - ' + appName"
        />
        <!-- Set HeadFul End -->
        <!-- Search input -->
        <v-text-field
          class="mt-2"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          solo
        ></v-text-field>
        <!-- Data table start -->
        <v-data-table
            :headers="headers"
            :items="desserts"
            :search="search"
            class="elevation-1"
            :class="$vuetify.theme.dark ? 'table-dark' : ''"
            :loading="dataLoading" 
            loading-text="Loading... Please wait"
        >
            <!-- page link -->
            <template v-slot:item.name="{ item }">
                <router-link :to="'/page/' + item.slug">
                    {{ item.name }}
                </router-link>
            </template>
            <template v-slot:top>
            <!-- table header -->
            <v-toolbar flat>
                <v-toolbar-title>All Pages</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog2" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <!-- add page button --> 
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >
                        Add One
                        </v-btn>
                    </template>
                    <!-- vuetify form -->
                    <v-form @submit.prevent="handleSubmit()">
                        <v-card :elevation="0">
                            <v-toolbar dark :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'">
                                <v-btn icon dark @click="dialog2 = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Add Page</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                    <v-btn dark text type="submit" :loading="loading2">Save</v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <v-container>
                                <v-form>
                                    <v-row>
                                        <v-col cols="12">                                       
                                            <v-text-field
                                                v-model="editedItem.name"
                                                :rules="rules.nameRules"
                                                :error-messages="errorMessage"
                                                @keyup.stop.prevent="checkPage()"
                                                color="black"
                                                label="Page Name"
                                                solo-inverted
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="mark-down-editor">
                                            <!-- mavon-editor plugin -->
                                            <mavon-editor
                                                style="height: 520px"
                                                v-model="editedItem.description"
                                                ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" 
                                                :placeholder="'Write description'" 
                                                :language="'en'" 
                                                :ishljs="true"
                                                :toolbars="markdownOption"
                                            >
                                            </mavon-editor>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-form>
                    <!-- vuetify form end -->
                </v-dialog>
            </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <!-- data table buttons -->
                <v-btn small :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'" class="mr-2" @click="editItem(item)">Edit</v-btn>
                <v-btn v-if="item.delete" small :color="$vuetify.theme.dark ? 'grey darken-3' : 'error'" @click="dialog3 = true, selecteCategoryId(item.id)">Delete</v-btn>
            </template>
        </v-data-table>
        <!-- Data table end -->
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <!-- vuetify form -->
                <v-form @submit.prevent="updatePage(editedItem.id)">
                    <v-card :elevation="0">
                        <v-toolbar dark :color="$vuetify.theme.dark ? 'grey darken-3' : 'primary'">
                            <v-btn icon dark @click="clearDetails()">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Update Page</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn dark text type="submit" :loading="loading">Save</v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-container>
                            <v-form>
                                <v-row>
                                    <v-col cols="12" v-if="editedItem.delete">                                       
                                        <v-text-field
                                            v-model="editedItem.name"
                                            :rules="rules.nameRules"
                                            color="black"
                                            label="Page Name"
                                            solo-inverted
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="mark-down-editor">
                                        <!-- mark down editor plugin -->
                                        <mavon-editor
                                            style="height: 520px"
                                            v-model="editedItem.description"
                                            ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" 
                                            :placeholder="'Write description'" 
                                            :language="'en'" 
                                            :ishljs="true"
                                            :toolbars="markdownOption"
                                        >
                                        </mavon-editor>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-container>
                    </v-card>
                </v-form>
                <!-- vuetify form end -->
        </v-dialog>
        <!-- delete page dialog -->
        <v-dialog v-model="dialog3" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Are you sure to unsaved the page?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'error darken-1'" text @click="dialog3 = false">Disagree</v-btn>
              <v-btn :color="$vuetify.theme.dark ? 'white darken-3' : 'green darken-1'" text @click="deletePage()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>
<script>
// import firebase app
import firebase from 'firebase/app'
// import firebase storage
import 'firebase/storage'
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'
// slugify for convert title to slug
import slugify from 'slugify'

export default {
    name: 'AdminCategories',
    data() {
        return {
            dialog: false, // add dialog
            dialog2: false, // edit dialog
            dialog3: false, // delete dialog
            loading: false, // add page loading button
            loading2: false, // delete page loading button
            dataLoading: false, // vuetify data table loading
            appName: '', // set aplication name
            search: '', // vuetify data table search
            // vuetify data table headers
            headers: [
                { text: 'Serial', value: 'serial', sortable: false },
                {
                  text: 'Name',
                  value: 'name',
                  width: "60%"
                },
                { text: 'Date', value: 'date', width: "20%", sortable: false },
                { text: 'Actions', value: 'actions', width: "20%", sortable: false },
            ],
            desserts: [], // vuetify data table data
            pageId: '', // store page id
            editedIndex: -1, // vuetify data table editedIndex
            editedItem: { // vuetify data table editedItem property
                id: '',
                name: '',
                description: '',
                delete: null
            },
            rules: { // validtion rules
              nameRules: [
                  v => !!v || 'Name is required',
                  v => (v && v.length <= 20) || 'Name must be less than 20 characters',
              ]
            },
            // markdown editor options
            markdownOption: {
                bold: true,
                italic: true,
                header: true,
                underline: true,
                strikethrough: true,
                mark: true,
                superscript: true,
                subscript: true,
                quote: true,
                ol: true,
                ul: true,
                link: true,
                imagelink: true,
                code: true, 
                table: true, 
                fullscreen: true, 
                readmodel: true, 
                htmlcode: false, 
                help: false, 
                undo: true, 
                redo: true, 
                trash: true, 
                save: false, 
                navigation: false, 
                alignleft: true, 
                aligncenter: true, 
                alignright: true, 
                subfield: true, 
                preview: true, 
            },
            errorMessage: '', // for error meassge
        }
    },
    computed: {
        // set error meassge
        errorMessages() {
            return this.errorMessage ? this.errorMessage : undefined
        }
    },
    created () {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.appName = doc.data().appName
        })

        this.addDefaultPages() // add default pages when database empty then automatically genagater some page
        this.initialize() // call a function for load data
    },
    methods: {
        // upload mark down editor images
        $imgAdd(pos, $file){
                let imageName = Date.now() + $file.name
                let storageRef = firebase.storage().ref('pages/' + imageName)
                storageRef.put($file).then(res => {
                    res.ref.getDownloadURL().then((url) => {
                        this.$refs.md.$img2Url(pos, url)            
                    })
                }).catch(err => console.log(err))
        },
        // delete mark down editor images
        $imgDel(pos){
                var httpsReference = firebase.storage().refFromURL(pos[0])
                var desertRef = firebase.storage().ref().child(httpsReference.fullPath)
                desertRef.delete().then(() => {})
                delete this.descriptionImages[pos]
        },
        // add default pages when database empty then automatically genagater some page
        addDefaultPages() {
            db.collection('pages').where('slug', '==', 'privacy-policy').get()
            .then((doc) => {
                    if(doc.empty) {
                        db.collection('pages').add({
                            name: "Privacy Policy",
                            slug: "privacy-policy",
                            description: "",
                            delete: false,
                            date: Date.now()
                        })
                    }
            })
            db.collection('pages').where('slug', '==', 'about-us').get()
            .then((doc) => {
                    if(doc.empty) {
                        db.collection('pages').add({
                            name: "About Us",
                            slug: "about-us",
                            description: "",
                            delete: false,
                            date: Date.now()
                        })
                    }
            })
            db.collection('pages').where('slug', '==', 'terms-of-service').get()
            .then((doc) => {
                    if(doc.empty) {
                        db.collection('pages').add({
                            name: "Terms of Service",
                            slug: "terms-of-service",
                            description: "",
                            delete: false,
                            date: Date.now()
                        })
                    }
            })
        },
        // initialize data to data table
        initialize() {
            var i = 0 // data table increment value
            this.dataLoading = true // data table loading
            db.collection('pages').orderBy('date', 'desc').onSnapshot(snapshot => {
                this.dataLoading = false // data table loading
                snapshot.docChanges().forEach(change => {
                    i++ // data table increment value
                    let page = change.doc.data()
                    page.serial = i // set data table increment value
                    page.id = change.doc.id
                    page.date = moment(change.doc.data().date).format('ll') // convert date

                    if(change.type === 'added') {
                        this.desserts.push(page) // push article
                    }

                    // when updated data then modified real time by editedIndex
                    if(change.type === "modified") {
                        page.serial = this.editedIndex+1
                        this.desserts.splice(this.editedIndex, 1, page)
                    }

                    // when data deleted then removed real time
                    if(change.type === 'removed') {
                        this.desserts = this.desserts.filter(item => {
                            return item.id != change.doc.id
                        })
                    }
                })
            })
        },
        // add page
        handleSubmit() {
            var data = this.editedItem // assign data
            // convert name to slug
            var slug = slugify(data.name, {
                replacement: '-',
                remove: /[$&+,:;=?@#|'"<>.^*()%!~]/g,
                lower: true
            })
            if(this.editedItem.name && this.editedItem.description) { // check empty
                this.loading2 = true // vuetify loading
                db.collection('pages').add({
                    name: data.name,
                    slug: slug,
                    description: data.description,
                    date: Date.now(), // javascript now() for current time
                    delete: true
                }).then(() => {
                    this.loading2 = false // vuetify loading
                    this.dialog2 = false // vuetify dialog
                    this.editedItem.name = ""
                    this.editedItem.description = ""
                })
            }
        },
        // check page name unique or not
        checkPage() {
            db.collection('pages').where('name', '==', this.editedItem.name).get()
            .then(snapshot => {
                if(!snapshot.empty) {
                    this.errorMessage = "The page already exists choose another one"
                }else {
                    this.errorMessage = ""
                }
            })
        },
        // assign user data to dialog
        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        // update page data
        updatePage(id) {
            var data = this.editedItem  // assign data
            // convert name to slug
            var slug = slugify(data.name, {
                replacement: '-',
                remove: /[$&+,:;=?@#|'"<>.^*()%!~]/g,
                lower: true
            })
            if(this.editedItem.name && this.editedItem.description) {
                this.loading = true // vuetify loading
                // update page
                db.collection("pages").doc(id).update({
                    name: data.name,
                    slug: slug,
                    description: data.description,
                    date: Date.now()
                }).then(() => {
                    this.loading = false // vuetify loading
                    this.dialog = false // vuetify dialog
                }).catch(err => {
                    console.log(err)
                    this.loading = false // vuetify loading
                })
            }
        },
        // clear details add page dialog
        clearDetails() {
            this.dialog = false
            this.editedItem.id = ""
            this.editedItem.name = ""
            this.editedItem.description = ""
        },
        // set page id for delete
        selecteCategoryId(id) {
            this.pageId = id
        },
        // delete page by id
        deletePage() {
            db.collection('pages').doc(this.pageId).delete()
            .then(() => {
                this.dialog3 = false // vuetify dialog
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style scoped>
/*  data table styles */
.admin-pages-list {
  width: 100%;
  padding-left: 30px;
}
.admin-pages-list .mark-down-editor {z-index: 1 !important;}
</style>