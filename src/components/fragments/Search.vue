<template>
    <!-- search form -->
    <v-form class="nav-search" @submit.prevent="search()">
        <!-- search input -->
        <v-text-field
            v-model="searchInput"
            label="Search articles or authors"
            flat
            solo
            hide-details
            color="error"
            append-icon="mdi-arrow-right"
            @click:append="search()"
            autofocus
        ></v-text-field>
    </v-form>
    <!-- search form end -->
</template>

<script>
export default {
    name: 'Search',
    data() {
        return {
            searchInput: null // search input model
        }
    },
    methods: {
        search() {
            if(this.searchInput) { // check if data
                // redirect search route with params
                this.$router.push({ name: 'Search', params: { inputText: this.searchInput } }) 
            }
        },
    }
}
</script>

<style scoped>
/* nav search style */
.nav-search {width: 100%;}
</style>