import startCase from 'lodash/startCase';
import keys from 'lodash/keys';

class Transaction {
    id;
    customer;
    description;
    date;
    amount;

    constructor(doc, id, customer, description, date, amount) {
        let _doc = doc;
        // this._doc = doc;
        this.id = id;
        this.customer = customer;
        this.description = description;
        this.date = date;
        this.amount = amount;

        this.doc = () => {
            return _doc;
        }
    }

    static fields() {
        return keys(this).filter(field => {
                console.log(`field: ${field}`);

                return field !== 'doc';
            })
            .map(field => {
                return startCase(field);
            });
    }
}

export { Transaction };