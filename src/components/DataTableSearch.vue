<template>
    <form @submit.prevent="onSearch" class="layout--data-table__search">
        <div class="layout--row row--flex row--flex__centerh">
            <div class="layout--row row--flex row--flex__centerh"
                 style="margin-right: 16px">
                <i class="material-icons" style="margin-right: 8px">
                    filter_list
                </i>

                <label for="layout--data-table__filter">Filter</label>
            </div>

            <select id="layout--data-table__filter"
                    v-model="filter"
                    @change="onFilterChange"
                    style="margin-right: 16px">
                <option disabled value="">--Select--</option>
                <option :value="field|camelcase"
                        v-for="field in filters">{{field | startcase}}</option>
            </select>

            <div class="layout--row row--flex row--flex__centerh layout--data-table__search--query">
                <input type="text"
                       placeholder="search..."
                       @input="onFilter"
                       v-model="query">
                <button class="layout--button button--transparent"
                        :disabled="!hasFilter"
                        @click.prevent="onSearch">
                    <i class="material-icons">
                        search
                    </i>
                </button>
            </div>
        </div>
    </form>
</template>

<script>
    import startCase from 'lodash/startCase';
    import camelCase from 'lodash/camelCase';

    export default {
        name: "DataTableSearch",

        props: {
            filters: {
                type: Array,
                required: true
            }
        },

        filters: {
            startcase(value) {
                if (!value) return '';
                return startCase(value);
            },

            camelcase(value) {
                if (!value) return '';
                return camelCase(value);
            }
        },

        data() {
            return {
                filter: '',
                query: ''
            };
        },

        computed: {
            hasFilter() {
                return this.filter !== '';
            },
        },

        methods: {
            onFilter() {
                this.$emit('filter', this.query);
            },

            onFilterChange() {
                this.$emit('change', this.filter);
            },

            onSearch() {
                if (this.query === '' ||
                    !this.hasFilter)
                    return;

                this.$emit('search', {filter: this.filter, query: this.query});
                this.query = '';
            },
        }
    }
</script>

<style lang="scss" scoped>

    button {
        &.layout--button {
            transition: color .25s ease-in;
            padding: 0;
            margin: 0;
            border: 0;

            &.button--transparent {
                background-color: transparent;
            }

            &:focus {
                outline: none;
            }

            &:hover {
                cursor: pointer;
                color: blue;
            }

            &.button--active {
                color: blue;
            }

            &:disabled {
                cursor: not-allowed;
            }
        }
    }

    .layout--row {
        &.row--flex {
            display: flex;

            &__center {
                align-items: center;
                justify-content: center;
            }

            &__centerh {
                align-items: center;
            }

            &__centerv {
                justify-content: center;
            }

            &__space--between {
                justify-content: space-between;
            }
        }
    }

    .layout--data-table {

        &__search {
            label {

            }

            select {
                border: 1px solid gainsboro;
                padding: 0;
                margin: 0;
                line-height: 34px;
                height: 34px;

                &:focus {
                    outline: none;
                }
            }

            &--query {
                border: 1px solid gainsboro;

                input[type='text'] {
                    border: none;
                    padding: 0;
                    margin: 0;
                    text-indent: 16px;
                    line-height: 32px;
                    height: 32px;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
</style>