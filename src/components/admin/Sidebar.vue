<template>
    <!-- vuetify sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <!-- vuetify list -->
      <v-list dense>
        <!-- item lists -->
        <v-list-item link :to="{ name: 'AdminHome' }">
            <v-list-item-action>
              <v-icon>mdi-speedometer</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Dashboard
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminUsers' }">
            <v-list-item-action>
              <v-icon>mdi-account-group-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Users
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminArticles' }">
            <v-list-item-action>
              <v-icon>mdi-book-open-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Articles
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminCategories' }">
            <v-list-item-action>
              <v-icon>mdi-view-grid-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Categories
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminRequests' }">
            <v-list-item-action>
              <v-icon>mdi-email-send-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Requests
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminSliders' }">
            <v-list-item-action>
              <v-icon>mdi-play-box-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Slider
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminPages' }">
            <v-list-item-action>
              <v-icon>mdi-page-next-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Pages
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'AdminMessages' }">
            <v-list-item-action>
              <v-icon>mdi-inbox-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Messages
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <!-- dropdown menu -->
        <v-list-group
          prepend-icon="mdi-cog-outline"
          append-icon=""
        >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  Settings
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item link :to="{ name: 'WebsiteInfo' }">
              <v-list-item-content>
                <v-list-item-title>
                  Website Info
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{ name: 'AddArticlePage' }">
              <v-list-item-content>
                <v-list-item-title>
                  Add Article Page
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{ name: 'SocialMedia' }">
              <v-list-item-content>
                <v-list-item-title>
                  Social Media
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{ name: 'SEO' }">
              <v-list-item-content>
                <v-list-item-title>
                  SEO
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list-group>
        <!-- dropdown menu end -->
      </v-list>
      <!-- vuetify list end -->
    </v-navigation-drawer>
    <!-- vuetify sidebar end -->
</template>

<script>
  export default {
    name: 'Sidebar',
    props: ['drawer'] // get data form vuejs props
  }
</script>