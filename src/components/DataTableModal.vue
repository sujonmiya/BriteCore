<template>
    <div :class="['layout--data__table--modal', {'is--open': open}]">
        <dialog ref="modal"
                :open="open">
            <div class="layout--data__table--modal__title layout--row">
                <h3>{{title}}</h3>
            </div>

            <div v-if="message && message !== ''"
                 class="layout--data__table--modal__msg layout--row">
                <p>{{message}}</p>
            </div>
            <div v-else
                 class="layout--data__table--modal__body layout--row">
                <slot></slot>
            </div>

            <div class="layout--row">
                <button class="layout--button button--transparent button--outline button--ok"
                        style="margin-right: 8px"
                        @click.prevent="onOk">
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" style="margin-right: 4px">
                            done
                        </i>
                        OK
                    </div>
                </button>
                <button class="layout--button button--transparent button--outline button--cancel"
                        @click.prevent="onCancel"
                        >
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" style="margin-right: 4px">
                            clear
                        </i>
                        CANCEL
                    </div>
                </button>
            </div>
        </dialog>
    </div>
</template>

<script>
    import dialogPolyfill from 'dialog-polyfill';

    export default {
        name: "DataTableModal",

        data() {
            return {};
        },

        props: {
            title: {
                type: String,
                required: true
            },

            message: String,

            open: Boolean,
            closeable: Boolean
        },

        methods: {
            onOk() {
                this.$emit('ok');
                this.$refs.modal.close();
            },

            onCancel() {
                this.$emit('cancel');
                this.$refs.modal.close();
            }
        },

        mounted() {
            //this.$refs.modal.showModal();
            const modal = this.$refs.modal;
            // console.log(modal);
            dialogPolyfill.registerDialog(modal);
        },

        created() {
        }
    }
</script>

<style lang="scss" scoped>
    dialog::backdrop { /* native */
        background-color: rgba(255, 255, 255, .95);
        /*background-color: transparent;*/
    }

    dialog + .backdrop { /* polyfill */
        background-color: rgba(255, 255, 255, .95);
        /*background-color: transparent;*/
    }

    dialog {
        /*position: fixed;
        top: 50%;
        transition: .25s ease-in-out transform;
        transform: translate(0, 0) scale(0, 0);

        &.is--open {
            transform: translate(0, -50%) scale(1, 1);
        }*/
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

            &.button--outline {
                padding: 4px 15px;
                transition: .25s ease-in border-color;
                /*border: 2px solid rgba(0,0,0, .35);*/

                &:hover {
                    border-color: rgba(0,0,0, .5);
                }
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

            &.button--ok {
                /*background-color: cornflowerblue;*/
                /*color: white;*/

                &:hover {
                    color: blue;
                }
            }

            &.button--cancel {
                background-color: rgba(0, 0, 0, .05);
            }
        }
    }

    .layout--data__table--modal {
        transition: .25s ease-in-out transform;
        transform: scale(0, 0);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        /*background-color: rgba(255,255,255,.95);*/

        &.is--open {
            transform: scale(1, 1);
        }

        dialog {
            border: none;
            width: 300px;
            padding: 16px;
            box-shadow: 0 0 25px rgba(0, 0, 0, .1);
            position: fixed;
            top: 50%;
            transform: translate(0, -50%);
        }
    }
</style>