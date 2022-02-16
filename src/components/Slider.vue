<template>
  <div class="slider">
    <!-- slider prev button -->
    <v-btn class="slider-prev" @click.prevent="slidePrev()" :elevation="5" fab>
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <!-- slider next button -->
    <v-btn class="slider-next" @click.prevent="slideNext()" :elevation="5" fab>
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
    <!-- hooper slider -->
    <hooper
      pagination="no" 
      ref="carousel"
      :infiniteScroll="true" 
      :itemsToShow="2.35" 
      :centerMode="true" 
      :keysControl="true"
      :touchDrag="true" 
      :mouseDrag="true" 
      :autoPlay="false"
      :hoverPause="true"
      v-if="items != ''"
    >
      <!-- hooper slider item -->
      <slide v-for="(item, index) in items" :key="item.id">
          <!-- vuetify card -->
          <v-card class="slider-item" :to="'/article/' + item.categorySlug + '/' + item.slug" elevation="0">
            <!-- image -->
            <v-img
              class="slider-img grey lighten-2 white--text align-end"
              gradient="to bottom, rgba(0, 0, 0, .1), rgba(0, 0, 0, .5)"
              :src="item.image"
              :lazy-src="item.image"
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
              <!-- slider content -->
              <div class="slider-content">
                <!-- category name -->
                <router-link :to="'/article/' + item.categorySlug + '/' + item.slug" class="text-uppercase">{{ item.category }}</router-link>
                <!-- article title -->
                <h3 class="mt-2">{{ item.title }}</h3>
                <!-- article save/unsave -->
                <v-item-group v-if="$store.state.user.loggedIn" class="text-uppercase p-0">
                  <v-btn color="white" v-if="!item.save" :class="{'remove--v-btn--active-style' : 'v-btn--active'}" icon @click="selectArticle(item.id, index), dialog = true" :loading="isClicked[index]" to="/">
                    <v-icon>mdi-bookmark</v-icon>
                  </v-btn>
                  <v-btn color="white" v-else :class="{'remove--v-btn--active-style' : 'v-btn--active'}" icon @click="saveArticle(item.id, index)" :loading="isClicked[index]" to="/">
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </v-btn>
                  <!-- article date -->
                  <v-item>{{ item.date }}</v-item>
                </v-item-group>
                <v-item-group v-else class="text-uppercase p-0">
                  <v-btn color="white" :class="{'remove--v-btn--active-style' : 'v-btn--active'}" icon @click="alartSheet = true" to="/">
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </v-btn>
                  <!-- article date -->
                  <v-item>{{ item.date }}</v-item>
                </v-item-group>
              </div>
            </v-img>
          </v-card>
          <!-- vuetify card end -->
      </slide>
      <!-- hooper slider item end -->
    </hooper>
    <!-- hooper slider end -->
    <!-- When no slider found then show this component -->
    <hooper
      pagination="no" 
      ref="carousel"
      :infiniteScroll="true" 
      :itemsToShow="2.35" 
      :centerMode="true" 
      :keysControl="true"
      :touchDrag="true" 
      :mouseDrag="true" 
      :autoPlay="false"
      :hoverPause="true"
      v-else
    >
      <!-- hooper slider item -->
      <slide v-for="(item, index) in 3" :key="index">
          <v-card class="no-slider-item grey lighten-2">
            <div class="middle">
              <h3 class="text-uppercase">No slider</h3>
            </div>
          </v-card>
      </slide>
      <!-- hooper slider item end -->
    </hooper>
    <!-- end hooper -->
    <!-- vuetify sheet -->
    <div class="text-center">
      <v-bottom-sheet v-model="alartSheet" persistent>
        <v-sheet class="text-center" height="200px">
          <v-btn
            class="mt-6"
            text
            color="error"
            @click="alartSheet = !alartSheet"
          >close</v-btn>
          <div class="py-3">
            <p class="mb-0 font-weight-bold">You're not logged in you account</p>
            <small class="text-muted">This functionality only for registered user. if you are a registered user then login your account <br> for use this functionality or if you are not a registered user then register now</small>
          </div>
          <v-btn small color="primary" :elevation="0" class="mr-2" :to="{ name: 'Login' }">Login</v-btn>
          <v-btn small color="secondary" :elevation="0" :to="{ name: 'Register' }">Register</v-btn>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- vuetify sheet end -->
    <!-- vuetify snackbar -->
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
    >
        Article has been saved
        <v-btn
            color="error"
            text
            @click="snackbar = false"
        >
            Close
        </v-btn>
    </v-snackbar>
    <!-- vuetify unsaved dialog -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
          <v-card-title class="headline">Are you sure to unsaved the article?</v-card-title>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialog = false, isClicked = []">Disagree</v-btn>
              <v-btn color="green darken-1" text @click="unSaveArticle()">Agree</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import Hooper slider
import { Hooper, Slide } from 'hooper'
// import Hooper slider style
import 'hooper/dist/hooper.css'
// import firebase database
import db from '@/firebase/init'
// moment for convert date
import moment from 'moment/src/moment'

export default {
  name: 'Slider',
  data() {
    return {
      items: [], // slider items array
      alartSheet: false, // vuetify sheet
      snackbar: false, // vuetify snackbar
      timeout: 2000, // snackbar time out
      dialog: false, // vuetify dialog
      unSaveId: '', // store unSaveId
      isClicked: [] // multipal clicks to vuetify loading
    }
  },
  created() {
    // get article data
    db.collection('articles').where('slider', '==', 1).limit(9).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let article = doc.data() // assign data
          article.id = doc.id
          article.date = moment(doc.data().date).format('ll') // convert date

          if(article.categoryId) { // if categoryId exist
            // get category name & slug
            db.collection("categories").doc(article.categoryId).get()
            .then((querySnapshot) => {
              article.categoryId = querySnapshot.data().name
              article.categorySlug = querySnapshot.data().slug
              this.items.push(article)
            })
          }

          if(this.$store.state.user.loggedIn) { // check login or not
            // Check article save or not because save button or unsave button are separated
            db.collection('saves').where('articleId', '==', article.id).where('userId', '==', this.$store.state.user.data.uid) // uid form vuex store
            .onSnapshot(snapshot => {
              article.save = snapshot.empty // set true/false
            })
          }
        })
        
        // count total articles
        let allCount = db.collection('articles')
        allCount.onSnapshot((snapshot) => {
            this.totalArticles = snapshot.size
        })
      }).catch(err => console.log(err))
  },
  methods: {
    // slider prev button 
    slidePrev () {
      this.$refs.carousel.slidePrev();
    },
    // slider next button 
    slideNext () {
      this.$refs.carousel.slideNext();
    },
    // set unSaveId and multipal button loading
    selectArticle(id, index) {
      this.$set(this.isClicked, index, !this.isClicked[index])
      this.unSaveId = id
    },
    // save article
    saveArticle(articleId, index) { // get passing data from function
        this.$set(this.isClicked, index, !this.isClicked[index]) // set loading
        db.collection('saves').add({
            userId: this.$store.state.user.data.uid, // get uid from vuex store
            articleId: articleId,
            time: Date.now() // javascript now() function for get current time
        }).then((snapshot) => {
            this.isClicked = [] // empty all loading
            this.snackbar = true // vuetify snackbar
        }).catch(err => {
            console.log(err)
        })
    },
    // unsave article 
    unSaveArticle() {
        db.collection('saves').where('articleId', '==', this.unSaveId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                db.collection('saves').doc(doc.id).delete()
                .then(() => {
                    this.isClicked = [] // empty all loading
                    this.dialog = false // vuetify dialog
                }).catch(err => {
                    console.log(err)
                })
            })
        }).catch(err => console.log(err))
    }
  },
  components: {
    // register components
    Hooper,
    Slide
  }
}
</script>

<style scoped>
/* slider styles */
.slider {
  position: relative;
  margin: 0 10px;
}
/* slider buttons */
.slider-prev {
  position: absolute;
  left: 30px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 5;     
}
.slider-next {
  position: absolute;
  right: 30px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 5;
}   
/* slider item styles */
.hooper {
  height: 400px;
}
.slider-item {
  width: 100%;
  height: 100%;
  padding: 5px;
}
.slider-item:hover {text-decoration: none;}
/* slider item image */
.slider-img {height: 100%;}
/* slider item content */
.slider-item .slider-content {
  padding: 50px;
  padding-right: 80px;
}
.slider-item .slider-content a {
  color: #fff;
  font-weight: 300;
  font-size: 15px;
  letter-spacing: 1px;
}
.slider-item .slider-content h3 {
  font-weight: 300;
  font-size: 32px;
}
.slider-item .slider-content .v-item-group {
  margin-left: -10px;
  font-size: small;
  font-weight: 300;
}
/* no slider item style */
.no-slider-item {
  width: 100%;
  height: 100%;
  display: table;
}
.no-slider-item .middle {
  text-align: center;
  display: table-cell;
  vertical-align: middle;
}
.no-slider-item h3 {font-size: 24px;}

/* Small to large handset */
@media (max-width: 600px) {
  .slider-prev {left: 10px;}
  .slider-next {right: 10px;}
  .slider .v-btn--fab.v-size--default {
      height: 40px;
      width: 40px;
  }
  .hooper {height: 300px;}
  .hooper .is-active {width: 100% !important;}
  .slider-item .slider-content {
    padding-left: 75px;
    padding-right: 15px;
    padding-bottom: 30px;
  }
  .slider-item .slider-content h3 {font-size: 22px;}
  .slider-item .slider-content a {font-size: 14px;}
}

/* Small to medium tablet */
@media (min-width: 600px) {
  .hooper {height: 340px;}
  .slider-item .slider-content {
    padding-right: 15px;
  }
  .slider-item .slider-content h3 {font-size: 24px;}
  .slider-item .slider-content a {font-size: 15px;}
}

/* Large tablet to laptop */
@media (min-width: 960px) {
  .hooper {height: 400px;}
  .slider-item .slider-content {
    padding: 50px;
    padding-right: 80px;
  }
  .slider-item .slider-content h3 {font-size: 32px;}
}
</style>
