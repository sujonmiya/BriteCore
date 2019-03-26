import moment from "moment";

import {FirestoreService} from '../service/firestore.service';
import {TransactionService} from '../service/transaction.service';
import {Transaction} from "../models/transaction";

const fs = new FirestoreService();
const ts = new TransactionService(fs);

const actions = {

    addError({commit}, err) {
        commit('addError', err);
    },

    isLoading({commit}, loading) {
        commit('isLoading', loading);
    },

    addTransaction({commit}, transaction) {
        ts.addTransaction(transaction)
            .then(tx => {
                commit('addTransaction', tx);
            })
            .catch(err => {
                commit('addError', err);
            });
    },

    searchTransactions({commit}, {field, query, total}) {
        return ts.searchTransactions(field, query, total)
            .then(snapshot => {
                commit('clearTransactions');

                if (snapshot.empty)
                    return [];

                const prev = snapshot.docs[0];
                const next = snapshot.docs[snapshot.docs.length-1];
                commit('setPrev', prev);
                commit('setNext', next);

                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    data.doc = doc.id;
                    return data;
                }).map(data => {
                    return new Transaction(data.doc,
                        data.id,
                        data.customer,
                        data.description,
                        data.date.toDate(),
                        data.amount);
                });
            });
    },

    fetchTransactions({commit}, limit) {

        return ts.findTransactions(limit)
            .then(snapshot => {
                commit('clearTransactions');

                if (snapshot.empty)
                    return [];

                const prev = snapshot.docs[0];
                const next = snapshot.docs[snapshot.docs.length-1];
                commit('setPrev', prev);
                commit('setNext', next);

                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    data.doc = doc.id;
                    return data;
                }).map(data => {
                    return new Transaction(data.doc,
                        data.id,
                        data.customer,
                        data.description,
                        data.date.toDate(),
                        data.amount);
                });
            });
    },

    fetchTransactionsByCursor({state, commit}, {limit, cursor}) {

        return ts.findTransactionsByCursor(cursor === 'next' ? state.next : state.prev, limit)
            .then(snapshot => {
                if (snapshot.empty)
                    return snapshot.docs;

                const prev = snapshot.docs[0];
                const next = snapshot.docs[snapshot.docs.length-1];
                commit('setPrev', prev);
                commit('setNext', next);

                return snapshot.docs.map(doc => {
                    return doc.data();
                }).map(data => {
                    return new Transaction(data.doc,
                        data.id,
                        data.customer,
                        data.description,
                        data.date.toDate(),
                        data.amount);
                });
            });
    },

    updateTransaction({commit}, {tx, field}) {
        return ts.updateTransaction(tx, field);
    },

    deleteTransaction({commit}, tx) {
        return ts.deleteTransaction(tx);
    },

    deleteTransactions({commit}, txs) {
        return ts.deleteTransactions(txs);
    },
};

export default actions;