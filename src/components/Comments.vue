<template>
    <div class="comments">
        <ul class="list-unstyled p-0">
            <!-- add comment component -->
            <add-comment v-if="$store.state.user.loggedIn" :articleId="articleId" :ownerId="ownerId"></add-comment>
            <!-- all comments component -->
            <comment :articleId="articleId"></comment>
        </ul>
    </div>
</template>

<script>
// Import lazy load component for Comment, AddComment
const Comment = () => import('@/components/fragments/Comment')
const AddComment = () => import('@/components/fragments/AddComment')

export default {
    name: 'Comments',
    props: ['articleId', 'ownerId'], // get data form vuejs props
    components: {
        // register components
        Comment,
        AddComment
    }
}
</script>

<style scoped>
/* comments styles */
.comments h5 {font-size: 18px;}
.comments p {font-size: 15px;}
</style>