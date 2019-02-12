import parse from 'date-fns/parse';

class TransactionService {
    _collection;
    _firebaseService;

    constructor(firebaseService) {
        this._firebaseService = firebaseService;
        this._collection = this._firebaseService.collection('transactions');
    }

    findTransaction(id) {
        return this._collection.get(id);
    }

    findTransactions({limit}) {
        return this._collection.limit(limit).get();
    }

    findTransactionsByCursor(cursor, limit) {
        return this._collection.startAfter(cursor)
            .limit(limit)
            .get();
    }

    addTransaction(t) {
        /*return this._collection.doc(t.id)
            .set(Object.assign({}, t));*/
        return this._collection.add(Object.assign({}, t));
    }

    updateTransaction(t, field) {
        const doc = {[field]: t[field]};
        return this._collection.doc(t.doc()).update(doc);
    }

    deleteTransaction(t) {
        return this._collection.doc(t.doc()).delete();
    }

    deleteTransactions(transactions) {
        let ids = [];
        let query = this._collection.limit(transactions.length);
        transactions.forEach(tx => {
            ids.push(tx.id);
            query.where('id', '==', tx.id);
        });

        const batch = this._firebaseService.db().batch();

        return query.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });

                return batch.commit();
            });
    }

    searchTransactions(field, query, total) {
        let op = '>=';

        if (field === 'date')
            query = parse(query);
        else if (field === 'amount')
            query = Number(query);
        else if (field === 'id')
            op = '==';

        return this._collection.where(field, op, query)
            .limit(total)
            .get();
    }
}

export {TransactionService};