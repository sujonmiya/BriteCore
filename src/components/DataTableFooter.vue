<template>
    <div class="layout--row row--flex row--flex__centerh layout--data-table__footer">
        <div class="layout--data-table__footer--status">
            Showing <span ref="curPage">{{currentPage}}</span> to <span ref="totalPage">{{totalPage}}</span> of <strong ref="total">{{total}}</strong> {{schema|lowercase|pluralize}}
        </div>

        <div style="flex: 1"></div>

        <div style="margin-right: 16px"
             class="layout--row row--flex row--flex__centerh layout--data-table__footer--total">
            <p style="margin-right: 8px">{{schema|pluralize}} per page</p>
            <select @change="onRowsPerPageChange"
                    v-model.number="perPage">
                <option>5</option>
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
            </select>
        </div>

        <div class="layout--row row--flex row--flex__centerh layout--data-table__footer--pagination">
            <button style="margin-right: 16px"
                    ref="prev"
                    class="layout--button button--transparent"
                    :disabled="!hasPrevious"
                    @click="onPrevious">
                <div class="layout--row row--flex row--flex__centerh">
                    <i class="material-icons">
                        navigate_before
                    </i>
                    Previous
                </div>
            </button>
            <button class="layout--button button--transparent"
                    ref="next"
                    @click="onNext">
                <div class="layout--row row--flex row--flex__centerh">
                    Next
                    <i class="material-icons">
                        navigate_next
                    </i>
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import pluralize from 'pluralize';
    import lowerCase from 'lodash/lowerCase';

    export default {
        name: "DataTableFooter",

        props: {
            total: {
                type: Number,
                required: true
            },

            limit: {
                type: Number,
                default: 10
            },

            schema: {
                type: String,
                required: true
            },
        },

        filters: {
            pluralize(value) {
                if (!value) return '';
                return pluralize(value);
            },

            lowercase(value) {
                if (!value) return '';
                return lowerCase(value);
            }
        },

        data() {
            return {
                perPage: 0,
                currentPage: 1
            };
        },

        computed: {
            /*currentPage() {
                return 1;
            },*/

            totalPage() {
                if (this.total < this.perPage)
                    return 1;

                return Math.floor(this.total/this.perPage);
            },

            hasPrevious() {
                return this.currentPage > 1;
            },
        },

        methods: {

            onRowsPerPageChange() {
                // this.currentPage = 1;
                //
                this.$emit('change', this.perPage);
            },

            onPrevious() {
                if (this.currentPage > 1)
                    this.currentPage--;

                this.$emit('prev', this.perPage);
            },

            onNext() {
                this.currentPage++;
                this.$emit('next', this.perPage);
            }
        },

        created() {
            // console.log(this.limit);
            // console.log(this.perPage);

            this.perPage = this.limit;
            // console.log(this.perPage);
        }
    }
</script>

<style lang="scss" scoped>
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

            &__start {
                justify-content: flex-start;
            }

            &__end {
                justify-content: flex-end;
            }
        }
    }

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

    .layout--data-table {


        &__footer {
            display: flex;
            align-items: center;

            &--total {
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
            }

            &--pagination {

            }
        }
    }
</style>