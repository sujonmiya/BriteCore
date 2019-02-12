import {expect} from 'chai';
import {createLocalVue, shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';

import DataTableFooter from '@/components/DataTableFooter.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

// const $store = new Vuex.Store({state});

describe('DataTableFooter.vue', () => {
    let props;

    beforeEach(() => {
        props = {total: 50, limit: 10};
    });

    it('renders props when passed', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const curPage = wrapper.find({ref: 'curPage'});
        const totalPage = wrapper.find({ref: 'totalPage'});
        const total = wrapper.find({ref: 'total'});
        expect(curPage.text()).to.have.string(wrapper.vm.currentPage);
        expect(totalPage.text()).to.have.string(wrapper.vm.totalPage);
        expect(total.text()).to.have.string(props.total);
    });

    it('renders prev button disabled when currentPage is 1', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        wrapper.vm.currentPage = 1;
        const prev = wrapper.find({ref: 'prev'});
        const attrs = prev.attributes('disabled');

        expect(attrs).to.equal('disabled');
    });

    it('emits @prev when prev button is clicked', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const prev = wrapper.find({ref: 'prev'});
        wrapper.vm.currentPage = 2;
        prev.trigger('click');

        expect(wrapper.emitted()).to.have.property('prev');
    });

    it('emits @next when next button is clicked', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const next = wrapper.find({ref: 'next'});
        next.trigger('click');

        expect(wrapper.emitted()).to.have.property('next');
    });

    it('current page should increase by 1 when next button is clicked', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const page = wrapper.vm.currentPage;
        const next = wrapper.find({ref: 'next'});
        next.trigger('click');
        expect(wrapper.vm.currentPage).to.equal(page + 1);
    });

    it('current page should decrease by 1 when prev button is clicked', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const next = wrapper.find({ref: 'next'});
        next.trigger('click');
        const prev = wrapper.find({ref: 'prev'});
        prev.trigger('click');
        expect(wrapper.vm.currentPage).to.equal(1);
    });

    it('emits @change when entries per page select change', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const select = wrapper.find('select');
        select.trigger('change');
        expect(wrapper.emitted()).to.have.property('change');
    });

    it('@change should contain entries per page in payload', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const select = wrapper.find('select');
        select.trigger('change');
        expect(wrapper.emitted().change[0][0]).to.equal(props.limit);
    });

    it('total page should change when entries per page changes', () => {
        const wrapper = shallowMount(DataTableFooter, {
            propsData: props,
            localVue
        });

        const select = wrapper.find('select');
        select.element.value = 5;
        select.trigger('change');
        const totalPage = wrapper.find({ref: 'totalPage'});
        expect(totalPage.text()).to.have.string(wrapper.vm.totalPage);
    });
});
