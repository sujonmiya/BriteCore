import firebase from 'firebase/app';
import 'firebase/firestore';

// console.log(process.env);

const config = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_DATABASE_URL,
    projectId: process.env.VUE_APP_PROJECT_ID,
};

class FirestoreService {
    _db;

    constructor() {
        // console.log(config);
        firebase.initializeApp(config);

        const db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        this._db = db;
    }

    db() {
        return this._db;
    }

    collection(col) {
        return this._db.collection(col);
    }
}

export {FirestoreService};