import firebase from 'firebase/app';
import 'firebase/firestore';

import store from './store';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCHxjWTir1uy0s53HAHMZ-T1784djh7x0g",
    authDomain: "britecore-a6095.firebaseapp.com",
    // databaseURL: "https://britecore-a6095.firebaseio.com",
    projectId: "britecore-a6095",
    // storageBucket: "",
    // messagingSenderId: "201654261120"
};

firebase.initializeApp(config);

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

const todos = db.collection('todos');

// Getting Real time feeds
todos.onSnapshot(snapshot => {
    console.log('onSnapshot');

    snapshot.docChanges().forEach(change => {
        console.log(change);
        const todo = { id: change.doc.id, ...change.doc.data() };

        if (change.type === "added") {
            // console.log(todo);
            console.log("New todo: ", todo.name);
            // console.log(todo);
            store.commit('addTodo', todo);
        }

        if (change.type === "modified") {
            console.log("Modified todo: ", todo.name);
            todo.idx = change.oldIndex;
            store.commit('updateTodo', todo);
        }

        if (change.type === "removed") {
            console.log("Removed todo: ", todo.name);
            store.commit('removeTodo', todo);
        }
    });
});

export  { db };

export default {
    fetchTodos: () => {
        return todos.get()
    },

    addTodo: name => {
        return todos.add({ name })
    },

    updateTodo: todo => {
        return todos.doc(todo.id).set({ name: todo.name });
    },

    removeTodo: id => {
        console.log('removing:', id);
        return todos.doc(id).delete()
    }
}