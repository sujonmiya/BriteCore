import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import keys from 'lodash/keys';

import state from '@/store/state';
import DataTableSearch from '@/components/DataTableSearch.vue';
import {Transaction} from "@/models/transaction";

const localVue = createLocalVue();
localVue.use(Vuex);

// const $store = new Vuex.Store({state});

describe('DataTableSearch.vue', () => {
  let store;
  let filters = [];

  beforeEach(() => {
    store = new Vuex.Store({
      state
    });

    keys(new Transaction).forEach(key => {
        filters.push(key);
    });
  });

  it('renders props.filters when passed', () => {
    const wrapper = shallowMount(DataTableSearch, {
          propsData: { filters },
          store,
          localVue
        });

    const select = wrapper.find('select');
    const options = select.findAll('option');
    //--Select--
    expect(options.length-1).to.equal(filters.length);
  });

  it('emits @filter when input changes', () => {
    const wrapper = shallowMount(DataTableSearch, {
      propsData: { filters },
      store,
      localVue
    });

    const input = wrapper.find('input');
    wrapper.vm.query = "asdf";
    input.trigger('input');

    expect(wrapper.emitted()).to.have.property('filter');
  });

  it('emits @change when select changes', () => {
    const wrapper = shallowMount(DataTableSearch, {
      propsData: { filters },
      store,
      localVue
    });

    const select = wrapper.find('select');
    wrapper.vm.filter = "asdf";
    select.trigger('change');

    expect(wrapper.emitted()).to.have.property('change');
  });

  it('emits @search when form is submitted', () => {
    const wrapper = shallowMount(DataTableSearch, {
      propsData: { filters },
      store,
      localVue
    });

    const form = wrapper.find('form');
    wrapper.setData({filter: "Id", query: "asdf"});
    form.trigger('submit');

    expect(wrapper.emitted()).to.have.property('search');
  });

  it('emits @search with payload when form is submitted', () => {
    const wrapper = shallowMount(DataTableSearch, {
      propsData: { filters },
      store,
      localVue
    });

    const form = wrapper.find('form');
    const payload = {filter: "Id", query: "asdf"};
    wrapper.setData(payload);
    form.trigger('submit');

    expect(wrapper.emitted()).to.have.property('search');
    expect(wrapper.emitted().search[0][0]).to.have.all.keys('filter', 'query');
  });

  it('search button should be disabled', () => {
    const wrapper = shallowMount(DataTableSearch, {
      propsData: { filters },
      store,
      localVue
    });

    const button = wrapper.find('button');
    const attrs = button.attributes('disabled');

    expect(attrs).to.equal('disabled');
  });

  it('search button should be enabled when filter is set', () => {
    const wrapper = shallowMount(DataTableSearch, {
      propsData: { filters },
      store,
      localVue
    });

    wrapper.vm.filter = 'Id';
    const button = wrapper.find('button');
    const attrs = button.attributes('disabled');
    expect(attrs).to.be.undefined;
  });
});
