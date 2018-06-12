import Vuex from 'vuex';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';

import { __createMocks as createStoreMocks } from '../store';

import AppModal from './AppModal.vue';

// Tell Jest to use the mock
// implementation of the store.
jest.mock(`../store`);

const localVue = createLocalVue();

localVue.use(Vuex);

describe(`AppModal`, () => {
  let storeMocks;
  let wrapper;

  beforeEach(() => {
    // Create a fresh store and wrapper
    // instance for every test case.
    storeMocks = createStoreMocks();
    wrapper = shallowMount(AppModal, {
      store: storeMocks.store,
      localVue,
    });
  });

  test(`It should render an overlay and the content when active.`, () => {
    storeMocks.state.modalVisible = true;

    expect(wrapper.contains(`.c-appModal__overlay`)).toBe(true);
    expect(wrapper.contains(`.c-appModal__content`)).toBe(true);
  });

  test(`It should not render an overlay and the content when inactive.`, () => {
    storeMocks.state.modalVisible = false;

    expect(wrapper.contains(`.c-appModal__overlay`)).toBe(false);
    expect(wrapper.contains(`.c-appModal__content`)).toBe(false);
  });

  test(`It should close the modal when the user clicks on the background.`, () => {
    storeMocks.state.modalVisible = true;

    wrapper.find(`.c-appModal__content`).trigger(`click`);

    expect(storeMocks.mutations.hideModal).toBeCalled();
  });

  test(`It should close the modal when the user presses the escape key.`, () => {
    storeMocks.state.modalVisible = true;

    document.dispatchEvent(new KeyboardEvent(`keydown`, { key: `Escape` }));

    expect(storeMocks.mutations.hideModal).toBeCalled();
  });

  test(`It should render the given component.`, async () => {
    storeMocks.state.modalVisible = true;

    wrapper = mount(AppModal, {
      store: storeMocks.store,
      localVue,
    });
    wrapper.setComputed({
      modalComponent: `ModalLogin`,
    });

    // For some reason the dynamic import is triggered
    // twice in tests (but not in production) to compensate
    // for that, we have to wait twice for the next tick
    // (I guess this is a bug in vue-test-utils).
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.contains(`.c-modalLogin`)).toBe(true);
  });
});
