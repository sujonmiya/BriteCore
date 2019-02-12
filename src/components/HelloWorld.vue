<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <div v-if="hasError" class="layout--error">
            <p style="color: red">{{error}}</p>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },

        data() {
            return {
                text: ''
            }
        },

        computed: {
            ...mapState(['error']),
            hasError() {
                return this.$store.error !== '';
            }
        },

        methods: {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
