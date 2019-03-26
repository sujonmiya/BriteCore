<template>
    <div id="app">
        <HelloWorld msg="Welcome to BriteCore" />

        <DataTable title="Data table"
                   :list="transactions"
                   :entries-per-page="rowsPerPage"
                   :editables="editables"
                   :columns="columns"
                   :excludes="['doc']"
                   schema="Transaction"
                   @limit="onEntriesPerPageChange"
                   @search="onSearch"
                   @next="onNext"
                   @prev="onPrevious"
                   @update="onUpdate"
                   @delete="onDelete"
                   :total="total"
                   :loading="isLoading"
        />


    </div>
</template>

<script>
    import {mapState} from 'vuex';

    import keys from 'lodash/keys';
    import isArray from 'lodash/isArray';
    import HelloWorld from './HelloWorld.vue';
    import DataTable from "./DataTable";
    import {Transaction} from "../models/transaction";

    export default {
        name: 'app',
        components: {
            DataTable,
            HelloWorld
        },

        data() {
            return {
                rowsPerPage: 20,
                total: 20,
                isLoading: false
            };
        },

        computed: {
            ...mapState(['transactions']),
            editables() {
                return [{field: 'description', type: 'textarea'}];
            },

            columns() {
                return keys(new Transaction);
            }
        },

        methods: {
            onSearch({field, query, total}) {
                this.isLoading = true;

                this.$store.dispatch('searchTransactions', {field, query, total})
                    .then(transactions => {
                        this.isLoading = false;
                        transactions.forEach(tx => {
                            this.$store.commit('addTransaction', tx)
                        });

                        this.total = transactions.length;
                    })
                    .catch(err => {
                        console.log('found err', err);
                        this.isLoading = false;
                        this.$store.dispatch('addError', err.message);
                    });
            },

            onEntriesPerPageChange(limit) {
                this.rowsPerPage = limit;
            },

            onUpdate({model, field, value}) {
                this.isLoading = true;
                this.$store.dispatch('updateTransaction', {tx: model, field})
                    .then(result => {
                        this.isLoading = false;
                        this.$store.commit('updateTransaction', {tx: model, field});
                    })
                    .catch(err => {
                        console.log({err});
                        this.isLoading = false;
                        this.$store.dispatch('addError', err.message);
                    });
            },

            onDelete(row) {
                this.isLoading = true;
                if (isArray(row)) {
                    const transactions = [].concat(row);

                    if (transactions.length === 1) {
                        const tx = transactions[0];
                        this.$store.dispatch('deleteTransaction', tx)
                            .then(result => {
                                this.isLoading = false;
                                this.$store.commit('deleteTransaction', tx);
                            })
                            .catch(err => {
                                console.log({err});
                                this.isLoading = false;
                                this.$store.dispatch('addError', err.message);
                            });
                    }

                    if (transactions.length > 1) {
                        this.$store.dispatch('deleteTransactions', transactions)
                            .then(result => {
                                this.isLoading = false;
                                this.$store.commit('deleteTransactions', transactions);
                            })
                            .catch(err => {
                                console.log({err});
                                this.isLoading = false;
                                this.$store.dispatch('addError', err.message);
                            });
                    }
                }
                else {
                    const tx = transactions;
                    this.$store.dispatch('deleteTransaction', tx)
                        .then(result => {
                            this.isLoading = false;
                            this.$store.commit('deleteTransaction', tx);
                        })
                        .catch(err => {
                            console.log({err});
                            this.isLoading = false;
                            this.$store.dispatch('addError', err.message);
                        });
                }
            },

            onPrevious(limit) {
                this.isLoading = true;
                const payload = {limit: limit, cursor: 'prev'};
                this.$store.dispatch('fetchTransactionsByCursor', payload)
                    .then(transactions => {
                        this.isLoading = false;
                        transactions.forEach(tx => {
                            this.$store.commit('addTransaction', tx)
                        });

                        this.total = transactions.length;
                    })
                    .catch(err => {
                        this.isLoading = false;
                        console.log({err});
                        this.$store.dispatch('addError', err.message);
                    });
            },

            onNext(limit) {
                this.isLoading = true;
                const payload = {limit: limit, cursor: 'next'};
                this.$store.dispatch('fetchTransactionsByCursor', payload)
                    .then(transactions => {
                        this.isLoading = false;
                        transactions.forEach(tx => {
                            this.$store.commit('addTransaction', tx)
                        });

                        this.total += transactions.length;
                    })
                    .catch(err => {
                        this.isLoading = false;
                        console.log({err});
                        this.$store.dispatch('addError', err.message);
                    });
            }
        },

        mounted() {
            this.isLoading = true;
            this.$store.dispatch('fetchTransactions', {limit: this.rowsPerPage})
                .then(transactions => {
                    this.isLoading = false;
                    transactions.forEach(tx => {
                        this.$store.commit('addTransaction', tx)
                    });

                    this.total = transactions.length;
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log({err});
                    this.$store.dispatch('addError', err.message);
                });
        }
    }
</script>

<style lang="scss">
</style>
