## BriteCore Engineering Application - Frontend Hiring Project

## Project details
This is a vue-cli based project that houses a reusable data table component.

## Data Table Component
DataTable is a highly reusable Vue.js component that can be used where a dynamic data table is required.

## Features
    - Client side filtering through any properties
    - Sorting (Ascending, Descending)
    - Server side search by any property 
    - Server side Pagination with client side caching
    - Inline editing
    - Multiple/Individual Row(s) deleting 
    
## Demo
https://britecore-a6095.firebaseapp.com
    
## Usage
```html
        <DataTable title="BriteCore Data table"
                   :list="transactions"
                   :columns="columns"
                   :editables="editables"
                   :excludes="excludes"
                   schema="Transaction"
                   @search="onSearch"
                   @update="onUpdate"
                   @delete="onDelete"
                   @next="onNext"
                   @prev="onPrevious"
                   :total="total"
                   :loading="isLoading"/>
```

```js
new Vue({
    data: {
        // data table data
        transactions: [],
        entriesPerPage: 20,
        // properties in each objects from the transactions array should be used as columns in data table. 
        // i.e Object.keys(transactions[0])
        columns: [],
        // exclude any columns from rendering in data table
        excludes: [], 
        // which columns should be rendered as editable fields in data table
        editables: [], 
        total: 200,
        isLoading: false
    },
    
    methods: {
        onSearch({field, query, total}) {
            //
        },
        
        onUpdate({model, field, value}) {
            // !!!
        },
        
        onDelete(model) {
            // ????
        },
        
        onNext(limit) {
            // fetch more
        },
        
        onPrevious(limit) {
            // 
        }
    },
    
    mounted () {
        // fetch transactions
    }
})
```

## Project setup

This project requires [Node.js](https://nodejs.org/) & [Yarn](https://yarnpkg.com/) to be installed on your system.

### Installs dependencies
```
yarn install
```

### Imports transaction data from CSV file
`FILE` should be the absolute path to your Firebase service account credential file

```
yarn run import --path=<FILE>
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run unit tests
```
yarn run test:unit
```

### Technologies used

- Node.js
- ES6
- Vue.js
- Vuex
- Firestore
- Firebase Hosting

### Deployment

The application is deployed to Firebase Hosting. It can be accessed at [BriteCore Data Table App](https://britecore-a6095.firebaseapp.com)

To deploy the app follow the bellow steps:

1. Install the Firebase CLI
- `npm install -g firebase-tools`

2. Setup your Firebase project
- `firebase login`

3. Setup API keys etc
- `update VUE_APP_API_KEY & VUE_APP_PROJECT_ID from Firebase in the .env file`
```.env
VUE_APP_API_KEY=<YOUR_API_KEY>
VUE_APP_AUTH_DOMAIN=<YOUR_PROJECT_ID>.firebaseapp.com
VUE_APP_DATABASE_URL=https://<YOUR_PROJECT_ID>.firebaseio.com
VUE_APP_PROJECT_ID=<YOUR_PROJECT_ID>
```

4. Deploy the app (make sure to build the app before deploying)
- `firebase deploy`

### Questions
1. How long did you spend on the test? Would you do anything differently if you had more time?
- `I spent around 5 days of development time for this project. Yes, I would actually. There are a lot of things that can be improved. Currently the data table component only handles text fields as editable columns, if i had more time i would handle different data types such as date fields in a Date picker, boolean values in a toggle switch or arrays in select box etc. I would also complete writting unit tests with full coverage.`

2. In what ways would you adapt your component so that it could be used in many different scenarios where a data table is required?
- `The data table component is already highly reusable, you can use it in almost anywhere where a data table is required. `

3. What is your favorite CSS property? Why?
- `My favourite CSS property is display when it is set to flex/grid because it gives me greater controll over the layout.`

4. What is your favorite modern Javascript feature? Why?
- `My favorite modern JavaScript feature is Destructuring Assignment because it makes possible to unpack values into distinct variables.`

5. What is your favorite third-party Vue.js library? Why?
- `None.`