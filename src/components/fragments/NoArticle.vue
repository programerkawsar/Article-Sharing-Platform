<template>
    <v-container>
      <!-- bootstarp jumbotron -->
      <b-jumbotron class="no-articles text-center">
        <v-row align="center" justify="center" class="mb-5">
          <div class="middle">
            <!-- empty image -->
            <img width="350" :src="require('@/assets/empty.svg')"> 
          </div>
        </v-row>
      </b-jumbotron>
    </v-container>
</template>

<script>
export default {
    name: 'NoArticle'
}
</script>

<style scoped>
/* no articles styles */
.no-articles {
  height: 600px;
}
.no-articles .row {
  width: 100%;
  height: 100%;
  display: table;
}
.no-articles .middle {
  display: table-cell;
  vertical-align: middle;
}
</style>