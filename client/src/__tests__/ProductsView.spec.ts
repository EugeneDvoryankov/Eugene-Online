import { useRouter } from 'vue-router';
import { BButton, BCol, BContainer, BRow, useToast } from 'bootstrap-vue-next';
import * as auth from '../services/auth';
import * as api from '@/api';
import ProductsView from '../views/ProductsView.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';


// Mock Dependencies
vi.mock('@/api');
vi.mock('../services/auth', () => ({
  basicToken: { value:null }, //Default is logged out
}));
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  // The query object has no category set which means all products should be displayed
  useRoute: vi.fn().mockReturnValue({ query: {} }),
}));
vi.mock('bootstrap-vue-next', async (importedOriginal) => {
  const actual = await importedOriginal() as any;
  return {
    ...actual,
    useToast: vi.fn(),
  };
});

describe('ProductsView.vue', () => {
  let mockRouter: any;
  let mockToast: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = { push: vi.fn() };
    (useRouter as any).mockReturnValue(mockRouter);
    mockToast = { show: vi.fn() };
    (useToast as any ).mockReturnValue(mockToast);
    // reset to logged out before each test
    (auth.basicToken as any).value = null; 
  });

  it('Unit: Fetches and renders products when the component mounts', async () =>{
    const mockProducts = [
      { id: '1', name: 'Website pack', describtion: 'Test', price: 1500 },
    ];
    (api.getProducts as any).mockResolvedValue(mockProducts);

    const wrapper = mount(ProductsView, {
      global: { components: { BContainer, BRow, BCol, BButton } },
    });
    await flushPromises();

    expect(api.getProducts).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('Website pack');
    expect(wrapper.text()).toContain('1500 kr');
    expect(wrapper.text()).not.toContain('Kunde inte ladda in tjänsterna');
  });

  it('Unit (Error): Show error messages if backend crashes during fetch', async () => {
    (api.getProducts as any).mockRejectedValue(new Error('Network Error'));

    const wrapper = mount(ProductsView, {
      global: { components: { BContainer, BRow, BCol, BButton } },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Kunde inte ladda in tjänsterna');
  });

  it('Unit (Error): Warns and redirects unauthenticated user to /login on buy', async () => {
    (api.getProducts as any).mockResolvedValue([{ id: '1', name: 'Test', price: 100 }]);
    const wrapper = mount(ProductsView, {
      global: { components: { BContainer, BRow, BCol, BButton } },
    });
    await flushPromises();

    await (wrapper.vm as any).handleBuy(1);

    expect(mockToast.show).toHaveBeenCalledWith(expect.objectContaining({ variant: 'warning' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(api.createOrder).not.toHaveBeenCalled();
  });

  it('Integration: logged in user clicks buy and its redirected to payment page', async () => {
    (auth.basicToken as any).value = 'fake-token';
    (api.getProducts as any).mockResolvedValue([{ id: '1', name: 'Test', price: 100 }]);
    (api.createOrder as any ).mockResolvedValue({ orderId: 'order-01' });

    const wrapper = mount(ProductsView, {
      global: { components: { BContainer, BRow, BCol, BButton } },
    });
    await flushPromises();

    await (wrapper.vm as any).handleBuy('1');
    await flushPromises();

    expect(api.createOrder).toHaveBeenCalledWith('1');
    expect(mockRouter.push).toHaveBeenCalledWith('/orders/order-01/payment');
  });
});
