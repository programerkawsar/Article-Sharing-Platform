<template>
  <div class="home">
    <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
    <vue-headful
        :title="appName + ' - ' + appTitle"
        :description="description"
        :keywords="keywords"
        :image="favIconUrl"
        :url="url"
    />
    <!-- Set HeadFul End -->
     <!-- Page Slider -->
    <slider></slider>
     <!-- Vuetify tab -->
    <v-tabs
      class="mt-4"
      :color="$vuetify.theme.dark ? 'white' : 'black'"
      :background-color="$vuetify.theme.dark ? 'black' : 'white'"
      centered
    >
      <!-- Vuetify tab name -->
      <v-tab>
        <v-icon class="mr-1">mdi-history</v-icon> Recently
      </v-tab>
      <v-tab>
        <v-icon class="mr-1">mdi-account-group-outline</v-icon> Popular
      </v-tab>
      <v-tab>
        <v-icon class="mr-1">mdi-refresh</v-icon> Reverse
      </v-tab>

      <!-- Vuetify tab content -->
      <v-tab-item>
        <recently-items class="mt-4"></recently-items>
      </v-tab-item>
      <v-tab-item>
        <popular-items class="mt-4"></popular-items>
      </v-tab-item>
      <v-tab-item>
        <reverse-items class="mt-4"></reverse-items>
      </v-tab-item>
    </v-tabs>
    <!-- Vuetify tab end -->
  </div>
</template>

<script>
// Import lazy load component for Slider, RecentlyItems, PopularItems, ReverseItems
const Slider = () => import('@/components/Slider')
const RecentlyItems = () => import('@/components/Recently')
const PopularItems = () => import('@/components/Popular')
const ReverseItems = () => import('@/components/Reverse')
// mapGetters for get data from vuex store 
import { mapGetters } from "vuex"
// import firebase database
import db from '@/firebase/init'

export default {
  name: 'Home',
  data() {
    return {
      url: window.location.href, // get current url
      favIconUrl: '', // set fav icon URL
      appName: '', // set aplication name
      appTitle: '', // set title
      description: '', // set description
      keywords: [], // set keywords
    }
  },
  created() {
    // get general settings from datebase
    db.collection('settings').doc('general-settings')
    .onSnapshot(doc => {
        this.favIconUrl = doc.data().favIcon
        this.appName = doc.data().appName
        this.appTitle = doc.data().appTitle
    })

    // get seo settings from datebase
    db.collection('settings').doc('seo').get()
    .then(doc => {
        this.description = doc.data().description,
        this.keywords = doc.data().keywords
    })
  },
  components: {
    // register components
    Slider,
    RecentlyItems,
    PopularItems,
    ReverseItems
  }
}
</script>

<style scoped>
/* customize vuetify style */
.center-btn .v-btn--active i {color: #fff !important;}

/* Small to large handset */
@media only screen and (max-width: 600px) {
  /* customize vuetify style */
  .home .v-tab {font-size: 12px; padding: 0 10px;}
  .home .v-tabs-bar.v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows):not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display: contents;
  }
  .home .v-slide-group__content {
    display: contents;
  }
}
</style>
