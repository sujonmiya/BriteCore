import { expect } from 'chai';
import mutations from '@/store/mutations';
import state from '@/store/state';
import {Transaction} from "@/models/transaction";

describe('mutations', () => {
    /*let $state;

    beforeEach(() => {
        $state = state;
    });*/

    console.log('state', state);

    const tx = new Transaction('','3471DA17-401F-9633-BF81-4CADA6FD5C79','Kyra Lester','Curabitur dictum. Phasellus in','2017-07-23T04:24:49-07:00',345.54);

    it('state should have transactions, prev, next, isLoading & error properties', () => {
        const $state = state;
        expect($state).to.have.property('transactions').that.is.an('array').and.empty;
        expect($state).to.have.property('prev').that.is.null;
        expect($state).to.have.property('next').that.is.null;
        expect($state).to.have.property('isLoading').that.is.a('boolean').and.false;
        expect($state).to.have.property('error').that.is.a('string').and.empty;
    });
    it('addError adds err to state', () => {
        const $state = state;
        const err = 'some err';
        mutations.addError(state, err);

        expect($state.error).to.equal(err);
    });

    it('isLoading sets loading to state', () => {
        const $state = state;
        const loading = true;
        mutations.isLoading($state, loading);
        expect($state.isLoading).to.equal(loading);
    });

    it('addTransaction adds tx to state', () => {
        const $state = state;
        mutations.addTransaction($state, tx);
        expect($state.transactions).to.include(tx);
    });

    it('updateTransaction updates a tx in state', () => {
        const $state = state;

        let _tx = tx;
        mutations.addTransaction($state, _tx);
        expect($state.transactions).to.include(_tx);
        _tx._customer = 'Jhon Doe';
        mutations.updateTransaction($state, _tx);
        expect($state.transactions).to.include(_tx);
    });

    it('clearTransactions empties transactions from state', () => {
        const $state = state;

        mutations.addTransaction($state, tx);
        expect($state.transactions).to.include(tx);
        mutations.clearTransactions($state);
        expect($state.transactions).to.be.an('array').that.is.empty;
    });

    it('deleteTransaction deletes transaction from state', () => {
        const $state = state;

        mutations.addTransaction($state, tx);
        expect($state.transactions).to.include(tx);
        mutations.deleteTransaction($state, tx);
        expect($state.transactions).to.not.include(tx);
    });
});