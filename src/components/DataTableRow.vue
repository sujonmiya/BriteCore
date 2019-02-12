<template>
    <div :class="['layout--data-table__body--row', {'is--selected': isSelected}]">
        <div class="layout--data-table__body--row__column layout--data-table__body--row__column__tool">
            <input type="checkbox"
                   @change="onSelect"
                   v-model="isSelected">
        </div>
        <div class="layout--row row--flex row--flex__start layout--data-table__body--row__column"
             v-for="(field, idx ) in fields"
            :key="idx">
            <div v-if="isEditable(field)">
                <Editable :field="field"
                        @edit="onEdit(field, $event)"
                          type="textarea"
                          :value="model[field]" />
            </div>
            <div v-else>
                {{value(field)}}
            </div>
        </div>
        <div class="layout--data-table__body--row__column layout--data-table__body--row__column__tool">
            <button class="layout--button button--transparent"
                    @click="onDelete">
                <div class="layout--row row--flex row--flex__centerh">
                    <i class="material-icons">
                        delete_outline
                    </i>
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import format from 'date-fns/format';
    import is_date from 'date-fns/is_date';
    import camelCase from 'lodash/camelCase';

    import Editable from "./Editable.vue";

    export default {
        name: "DataTableRow",

        components: {Editable},

        props: {
            model: {
                type: Object,
                required: true
            },

            id: {
                type: String,
                required: true
            },

            fields: {
                type: Array,
                required: true
            },

            editables: Array,

            excludes: Array,

            selected: {
                type: Boolean,
                default: false
            }
        },

        filters: {
            date(value) {
                if (!value) return '';
                return format(value, 'dddd, mmmm dS, yyyy, h:MM:ss TT');//December 17, 1995 03:24:00
            }
        },

        data() {
            return {
                isSelected: false,
                isSorted: false
            };
        },

        computed: {
        },

        methods: {
            value(field) {
                return is_date(this.model[field]) ? format(this.model[field], 'MMMM Do YYYY, h:mm:ss A') : this.model[field];
            },

            isDate(value) {
                return is_date(value);
            },

            onSelect() {
                if (this.isSelected)
                    this.$emit('select', this.model);
                else
                    this.$emit('deselect', this.model);
            },

            onEdit(field, $event) {
                // console.log('selected', this.selected);
                this.$emit('update', {model: this.model, field: camelCase(field), value: $event});
            },

            onDelete() {
                this.$emit('delete', this.model);
            },

            isEditable(field) {
                // console.log('field', field);
                // console.log('editables', this.editables);

                const found = this.editables.filter(e => {
                    return e.field === field;
                });

                return found.length > 0;
            },
        },

        created() {
            this.isSelected = this.selected;
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

        &__body {

            &--row {
                display: flex;
                //justify-content: center;
                align-items: center;
                transition: background-color .25s ease-in;
                border-bottom: 1px solid antiquewhite;

                &:nth-child(odd) {
                    background-color: rgba(245, 245, 220, 0.35);
                }

                &:last-child {
                    border-bottom-width: 2px;
                    border-bottom-color: bisque;
                }

                &:hover {
                    background-color: beige;
                }

                &.is--selected {
                    background-color: beige;
                }

                &__column {
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
    }
</style>