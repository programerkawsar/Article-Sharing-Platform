<template>
    <div class="page-view">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="pageName + ' - ' + appName"
            :description="description"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <v-container>
            <!-- Page description -->
           <div v-html="description"></div>
        </v-container>
    </div>
</template>

<script>
// import firebase database
import db from '@/firebase/init'
// markdown-it for render description
const md = require('markdown-it')()
            .use(require('markdown-it-sub'))
            .use(require('markdown-it-sup'))
            .use(require('markdown-it-deflist'))
            .use(require('markdown-it-container'), 'hljs-center')
            .use(require('markdown-it-container'), 'hljs-left')
            .use(require('markdown-it-container'), 'hljs-right')
            .use(require('markdown-it-abbr'))
            .use(require('markdown-it-footnote'))
            .use(require('markdown-it-ins'))
            .use(require('markdown-it-mark'));

export default {
    name: 'Page',
    data() {
        return {
            appName: '', // set aplication name
            favIconUrl: '', // set fav icon URL
            url: window.location.href, // get current url
            pageName: '', // page name
            description: '' // page description
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.favIconUrl = doc.data().favIcon
            this.appName = doc.data().appName
        })

        // get page data
        db.collection('pages').where('slug', '==', this.$route.params.slug)
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type === 'added') {
                    this.pageName = change.doc.data().name // set page name to data property
                    this.description = md.render(change.doc.data().description) // set page description to data property
                }
            })
        })
    }
}
</script>

<style scoped>
/* Page margin */
.page-view {margin: 0 200px;}

/* Small to large handset */
@media (max-width: 600px) { 
    .page-view {margin: 0;}
}

/* Small to medium tablet */
@media (min-width: 600px) {
    .page-view {margin: 0;}
}

/* Large tablet to laptop */
@media (min-width: 960px) {
    .page-view {margin: 0 100px;}
}

/* Desktop */
@media (min-width: 1264px) {
    .page-view {margin: 0 200px;}
}
</style>