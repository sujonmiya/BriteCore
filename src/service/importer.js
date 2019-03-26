const path = require('path');
const fs = require('fs');

const csv = require('csvtojson');
const moment = require('moment');
const admin = require('firebase-admin');
const yargs = require('yargs');

const argv = yargs.option('path', {
        alias: 'p',
        describe: 'Path to firebase service account json file'
    })
    .demandOption('path')
    .check(argv => {
        const filepath = argv.path;
        if (!fs.existsSync(filepath))
            throw(new Error('invalid filepath'));

        const ext = path.extname(filepath);
        // console.log('ext', ext);

        if (ext !== '.json')
            throw(new Error('invalid file type'));

        return true;
    })
    .argv;

const serviceAccount = require(argv.path);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);
const transactions = db.collection('transactions');

const csvFilePath = path.resolve(__dirname, './Payments Data - Worksheet.csv');

csv().fromFile(csvFilePath)
    .subscribe(doc => {
        return new Promise((resolve, reject) => {
            const date = moment(doc.Date).toDate();
            const transaction = {
                id: doc.ID,
                customer: doc.Name,
                description: doc.Description,
                date: date,
                amount: Number(doc.Amount)};
            console.log('Transaction `%s` imported successfully', transaction.id);

            transactions.add(transaction)
                .then(doc => {
                    //console.log('doc', doc);
                    resolve();
                })
                .catch(err => {
                    console.error('err', err);
                    reject();
                })
        })
    }, err => {
        console.error(err);
    });