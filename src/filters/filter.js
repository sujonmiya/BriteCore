import Vue from 'vue';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';

const startCaseFilter = value => {
    if (!value) return '';
    return startCase(value);
};

// Vue.filter('startcase', startCaseFilter);

const camelCaseFilter = value => {
    if (!value) return '';
    return camelCase(value);
};

// Vue.filter('camelcase', camelCaseFilter);

export {startCaseFilter, camelCaseFilter};