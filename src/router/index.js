import Vue from 'vue'
// import vue router
import VueRouter from 'vue-router'
// import firebase app
import firebase from 'firebase/app'
// import firebase auth
import 'firebase/auth'
// import VueRouterBackButton plugin for back button
import VueRouterBackButton from 'vue-router-back-button'

// import auth components
const Login = () => import('@/views/auth/Login')
const Register = () => import('@/views/auth/Register')
const Recover = () => import('@/views/auth/Recover')

// import page components
const Home = () => import('@/views/Home')
const Search = () => import('@/views/Search')
const Profile = () => import('@/views/Profile')
const Dashboard = () => import('@/views/Dashboard')
const Contribute = () => import('@/views/Contribute')
const Request = () => import('@/views/Request')
const Settings = () => import('@/views/Settings')
const Categories = () => import('@/views/Categories')
const ArticlesByCategory = () => import('@/views/ArticlesByCategory')
const Saved = () => import('@/views/Saved')
const SingleArticle = () => import('@/views/SingleArticle')
const AddArticle = () => import('@/views/AddArticle')
const EditArticle = () => import('@/views/EditArticle')
const ContactUs = () => import('@/views/ContactUs')
const Page = () => import('@/views/Page')

// import admin page components
const Admin = () => import('@/views/admin/App')
const AdminHome = () => import('@/views/admin/Home')
const AdminUsers = () => import('@/views/admin/Users')
const AdminArticles = () => import('@/views/admin/Articles')
const AdminCategories = () => import('@/views/admin/Categories')
const AdminRequests = () => import('@/views/admin/Requests')
const AdminSliders = () => import('@/views/admin/Sliders')
const AdminPages = () => import('@/views/admin/Pages')
const AdminMessages = () => import('@/views/admin/Messages')
const WebsiteInfo = () => import('@/views/admin/WebsiteInfo')
const AddArticlePage = () => import('@/views/admin/AddArticlePage')
const SocialMedia = () => import('@/views/admin/SocialMedia')
const SEO = () => import('@/views/admin/SEO')

Vue.use(VueRouter) // use VueRouter

// setup routes
const routes = [
  // pages routes
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      // this is for progress bar
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      notRequiresAuth: true, // when user not logged in then access this page other ways page automatic redirect
      // this is for progress bar
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      notRequiresAuth: true, // when user not logged in then access this page other ways page automatic redirect
      // this is for progress bar
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/recover',
    name: 'Recover',
    component: Recover,
    meta: {
      notRequiresAuth: true, // when user not logged in then access this page other ways page automatic redirect
      // this is for progress bar
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/search/:inputText',
    name: 'Search',
    component: Search,
    meta: {
      // this is for progress bar
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: Profile,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true, // user must be logged in for access this page
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/contribute',
    name: 'Contribute',
    component: Contribute,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/request',
    name: 'Request',
    component: Request,
    meta: {
      requiresAuth: true, // user must be logged in for access this page
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true, // user must be logged in for access this page
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/category/:slug',
    name: 'ArticlesByCategory',
    component: ArticlesByCategory,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/saved',
    name: 'Saved',
    component: Saved,
    meta: {
      requiresAuth: true, // user must be logged in for access this page
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/article/:category/:slug',
    name: 'SingleArticle',
    component: SingleArticle,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/add-article',
    name: 'AddArticle',
    component: AddArticle,
    meta: {
      requiresAuth: true,
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/edit-article/:category/:slug',
    name: 'EditArticle',
    component: EditArticle,
    meta: {
      requiresAuth: true, // user must be logged in for access this page
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: ContactUs,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  {
    path: '/page/:slug',
    name: 'Page',
    component: Page,
    meta: {
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    }
  },
  // admin pages routes
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    redirect: 'admin/home',
    meta: {
      requiresAuth: true, // user must be logged in and user rule user must be admin then access all pages for admin
      progress: {
        func: [
          {call: 'color', modifier: 'temp', argument: '#000'},
          {call: 'fail', modifier: 'temp', argument: '#e91e63'},
          {call: 'location', modifier: 'temp', argument: 'top'},
          {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
        ]
      }
    },
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: AdminHome
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: AdminArticles
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories
      },
      {
        path: 'requests',
        name: 'AdminRequests',
        component: AdminRequests
      },
      {
        path: 'sliders',
        name: 'AdminSliders',
        component: AdminSliders
      },
      {
        path: 'pages',
        name: 'AdminPages',
        component: AdminPages
      },
      {
        path: 'messages',
        name: 'AdminMessages',
        component: AdminMessages
      },
      {
        path: 'website-info',
        name: 'WebsiteInfo',
        component: WebsiteInfo
      },
      {
        path: 'add-article-page',
        name: 'AddArticlePage',
        component: AddArticlePage
      },
      {
        path: 'social-media',
        name: 'SocialMedia',
        component: SocialMedia
      },
      {
        path: 'seo',
        name: 'SEO',
        component: SEO
      }
    ]
  },
  { path: "*", component: Home } // when user try to access unknown route then showing home page
]

const router = new VueRouter({
  mode: 'history', // history mode set
  base: process.env.BASE_URL, // set base URL
  routes,
  scrollBehavior (to, from, savedPosition) { // when load a new page then scroll top in the page
      return { x: 0, y: 0 }
  }
})

// check every routes
router.beforeEach((to, from, next) => {
  // check user authentication
  if(to.matched.some(record => record.meta.requiresAuth)) { // this is use for mainly authentication proceeded pages
    firebase.auth().onAuthStateChanged(function(user){
      if(!user) {
        // when user not authenticated the push to login page
        next({ name: 'Login' })
      }else {
        // if user authenticated then access next page
        next()
      }
    })
  }else if(to.matched.some(record => record.meta.notRequiresAuth)) { // this is use for mainly auth pages
    firebase.auth().onAuthStateChanged(function(user){
      if(user) {
        // when user authenticated the push to home page
        next({ name: 'Home' })
      }else {
        // if user not authenticated then access next page
        next()
      }
    })
  }else {
    next()
  }
})

Vue.use(VueRouterBackButton, { router }) // use VueRouterBackButton plugin to router

export default router
