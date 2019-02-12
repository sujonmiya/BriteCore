import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import state from '@/store/state';

import HelloWorld from '@/components/HelloWorld.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({state});

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
