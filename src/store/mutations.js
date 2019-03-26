import findIndex from 'lodash/findIndex';

const mutations = {

    addError(state, err) {
        state.error = err;
    },

    isLoading(state, loading) {
        state.isLoading = loading;
    },

    addTransactions(state, transactions) {
        transactions.forEach(tx => {
            state.transactions.push(tx);
        });
    },

    addTransaction(state, transaction) {
        state.transactions.push(transaction);
    },

    setTransactions(state, transactions) {
        state.transactions = transactions;
    },

    clearTransactions(state) {
        state.transactions = [];
    },

    updateTransaction(state, {tx, field}) {
        const idx = findIndex(state.transactions, transaction => {
            return tx.id === transaction.id;
        });

        if (idx !== -1)
            state.transactions[idx][field] = tx[field];
    },

    deleteTransaction(state, transaction) {
        const idx = findIndex(state.transactions, tx => {
            return tx.id === transaction.id;
        });

        if (idx !== -1)
            state.transactions.splice(idx, 1);
    },

    deleteTransactions(state, transactions) {
        transactions.forEach(txn => {
            const idx = findIndex(state.transactions, tx => {
                return tx.id === txn.id;
            });

            if (idx !== -1)
                state.transactions.splice(idx, 1);
        })
    },

    setPrev(state, doc) {
        state.prev = doc;
    },

    setNext(state, doc) {
        state.next = doc;
    }
};

export default mutations;