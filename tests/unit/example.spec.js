import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { cloneDeep } from 'lodash';
import Vuex from 'vuex';

import HelloWorld from '@/components/HelloWorld.vue';
// import store from '@/store/store';

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store(cloneDeep({error: ''}));

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
      store: $store,
      localVue
    });
    expect(wrapper.text()).to.include(msg)
  })
});
