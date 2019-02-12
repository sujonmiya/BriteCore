<template>
    <div class="layout--row row--flex row--flex__centerh layout--data-table__header">
        <div class="layout--row row--flex row--flex__center layout--data-table__header--column layout--data-table__header--column__tool">
            <input type="checkbox"
                   @change="onSelectAll"
                   v-model="selected">
        </div>

        <div class="layout--data-table__header--column"
             ref="field"
             v-for="(field, idx) in fields"
            :key="idx">
            <div class="layout--row row--flex row--flex__centerh layout--data-table__header--column__tools">
                <div><strong>{{field | startcase}}</strong></div>

                <div class="layout--data-table__header--sort--by">
                    <button :class="['layout--button', 'button--transparent', {isSorted: 'button--active'}]"
                            ref="asc"
                            @click.prevent="onSort(field, true)"
                            title="ASC">
                        <i class="material-icons">
                            arrow_drop_up
                        </i>
                    </button>
                    <button :class="['layout--button', 'button--transparent', {isSorted: 'button--active'}]"
                            ref="desc"
                            @click.prevent="onSort(field, false)"
                            title="DESC">
                        <i class="material-icons">
                            arrow_drop_down
                        </i>
                    </button>
                </div>
            </div>

        </div>
        <div class="layout--data-table__header--column layout--data-table__header--column__tool">
            <button class="layout--button button--transparent"
                    ref="menu"
                    @click="onSettings">
                <i class="material-icons">
                    more_vert
                </i>
            </button>
        </div>
    </div>
</template>

<script>
    import startCase from 'lodash/startCase';

    export default {
        name: "DataTableHeader",

        props: {
            fields: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                selected: false,
                isSorted: false,
                isSettings: false
            };
        },

        filters: {
            startcase(value) {
                if (!value) return '';
                return startCase(value);
            }
        },

        computed: {

        },

        methods: {
            onSelectAll() {
                console.log('selected', this.selected);
                this.$emit('select', this.selected);
            },

            onSort(field, direction) {
                this.$emit('sort', {field, direction});
            },

            onSettings() {
                this.isSettings = !this.isSettings;
                this.$emit('menu', this.isSettings);
            }
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
        }
    }

    .layout--data-table {
        &__header {
            display: flex;
            border-bottom: 2px solid bisque;
            //margin-bottom: 16px;

            &--sort--by {
                display: flex;
                margin-left: 8px;

                button {
                    .material-icons {
                        transform: scale(1.25, 1.25);
                    }
                }
            }

            &--column {
                flex: 1;
                padding: 4px;
                font-size: 14px;

                &__tools {
                    /*display: flex;*/
                    //align-items: center;
                }

                &__tool {
                    flex: .1;
                }
            }
        }
    }
</style>