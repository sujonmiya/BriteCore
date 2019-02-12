import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import keys from 'lodash/keys';

import state from '@/store/state';
import DataTableHeader from '@/components/DataTableHeader.vue';
import {Transaction} from "@/models/transaction";

const localVue = createLocalVue();
localVue.use(Vuex);

// const $store = new Vuex.Store({state});

describe('DataTableHeader.vue', () => {
  let store;
  let fields = [];

  beforeEach(() => {
    store = new Vuex.Store({
      state
    });

    keys(new Transaction).forEach(key => {
        fields.push(key);
    });
  });

  it('renders props.fields when passed', () => {
    const wrapper = shallowMount(DataTableHeader, {
          propsData: { fields },
          store,
          localVue
        });

    const columns = wrapper.findAll({ref: 'field'});
    expect(columns.length).to.equal(fields.length);
  });

  it('emits @filter when checkbox changes', () => {
    const wrapper = shallowMount(DataTableHeader, {
      propsData: { fields },
      store,
      localVue
    });

    const input = wrapper.find('input[type="checkbox"]');
    wrapper.vm.selected = true;
    input.trigger('change');

    expect(wrapper.emitted()).to.have.property('select');
  });

  it('emits @sort when sort button is clicked', () => {
    const wrapper = shallowMount(DataTableHeader, {
      propsData: { fields },
      store,
      localVue
    });

    const button = wrapper.find('button');
    button.trigger('click');

    expect(wrapper.emitted()).to.have.property('sort');
  });

  it('emits @sort with sortBy field and direction in payload on sort button click', () => {
    const wrapper = shallowMount(DataTableHeader, {
      propsData: { fields },
      store,
      localVue
    });

    const button = wrapper.find('button');
    button.trigger('click');

    expect(wrapper.emitted()).to.have.property('sort');
    expect(wrapper.emitted().sort[0][0]).to.have.all.keys('field', 'direction');
  });

  it('emits @sort with field direction = true in payload on asc sort button click', () => {
    const wrapper = shallowMount(DataTableHeader, {
      propsData: { fields },
      store,
      localVue
    });

    const button = wrapper.find({ref: 'asc'});
    button.trigger('click');

    expect(wrapper.emitted()).to.have.property('sort');
    expect(wrapper.emitted().sort[0][0].direction).to.be.true;
  });

  it('emits @sort with field direction = false in payload on desc sort button click', () => {
    const wrapper = shallowMount(DataTableHeader, {
      propsData: { fields },
      store,
      localVue
    });

    const button = wrapper.find({ref: 'desc'});
    button.trigger('click');

    expect(wrapper.emitted()).to.have.property('sort');
    console.log(wrapper.emitted().sort);
    expect(wrapper.emitted().sort[0][0].direction).to.be.false;
  });

  it('emits @menu when menu button is clicked', () => {
    const wrapper = shallowMount(DataTableHeader, {
      propsData: { fields },
      store,
      localVue
    });

    const menu = wrapper.find({ref: 'menu'});
    menu.trigger('click');

    expect(wrapper.emitted()).to.have.property('menu');
  });
});
