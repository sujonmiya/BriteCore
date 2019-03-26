<template>
    <div class="layout--editable">
        <div v-if="isEditing">
            <form @submit.prevent="onSubmit">
                <div v-if="type ==='text'">
                    <input @keydown.esc="onCancel"
                           type="text"
                           v-model="value_">
                </div>
                <div v-if="type ==='textarea'">
                    <textarea
                            @keyup.enter.exact="onSubmit"
                            @keydown.esc="onCancel"
                            @input="onInput"
                            rows="5">{{value}}</textarea>
                </div>
            </form>

            <div class="layout--row row--flex">
                <span style="flex: 1"></span>
                <button class="layout--button button--transparent"
                        :disabled="isDisabled"
                        style="margin-right: 8px"
                        @click.prevent="onUpdate">
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" style="margin-right: 4px">
                            done
                        </i>
                        Update
                    </div>
                </button>
                <button class="layout--button button--transparent"
                        @click.prevent="onCancel">
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" style="margin-right: 4px">
                            clear
                        </i>
                        Cancel
                    </div>
                </button>
            </div>
        </div>
        <div v-else
             class="layout--row row--flex row--flex__centerh row--flex__space--between">
            <div style="margin-right: 8px">
                {{value}}
            </div>
            <div class="layout--editable__action">
                <button class="layout--button button--transparent"
                        @click="onEdit">
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" :title="'Edit '+field|startcase">
                            edit
                        </i>
                    </div>
                </button>
            </div>
        </div>

    </div>
</template>

<script>
    import startCase from 'lodash/startCase';

    export default {
        name: "Editable",
        props: {
            type: String,
            value: String,
            field: String,
        },

        filters: {
            startcase(value) {
                if (!value) return '';
                return startCase(value);
            }
        },

        data() {
            return {
                value_: '',
                isEditing: false,
                allow: false
            };
        },

        computed: {
            isDisabled() {
                return this.value_ === this.value;
            }
        },

        methods: {
            onEdit() {
                this.isEditing = true;
            },

            onInput($ev) {
                this.value_ = $ev.target.value;
            },

            onCancel() {
                this.isEditing = false;
                this.value_ = this.value;
            },

            onUpdate() {
                this.$emit('edit', this.value_);
                this.isEditing = false;
            },

            onSubmit() {
                this.$emit('edit', this.value_);
                this.isEditing = false;
            }
        },

        mounted() {
            this.value_ = this.value;
        }
    }
</script>

<style lang="scss" scoped>
    .layout--editable {
        form {
            width: 100%;

            textarea {
                width: calc(100% - 18px);
                padding: 8px;
                margin: 0;
                font-family: inherit;

                &:focus {
                    outline: none;
                }
            }
        }

        &__action {
            display: flex;
            align-items: center;
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

    button {
        &.layout--button {
            padding: 0;
            margin: 0;
            border: 0;
            transition: color .25s ease-in;

            &.button--transparent {
                background-color: transparent;
            }

            &__primary {
                background-color: bisque;
                border: 1px solid burlywood;
                /*color: #fff;*/
                padding: 8px;
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
                cursor: not-allowed !important;
            }
        }
    }
</style>