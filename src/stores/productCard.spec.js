import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'

describe('ProductCard Component', () => {
  const product = {
    id: 1,
    name: 'Test Book',
    description: 'This is a test book description that is long enough to be truncated.',
    price: 125000,
    stock: 10,
    category: 'novel',
    image: 'test.jpg'
  };

  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: { product }
    })

    expect(wrapper.find('.product-title').text()).toBe(product.name)
    expect(wrapper.find('.product-category').text()).toBe('Novel')
    expect(wrapper.find('.product-description').text()).toContain('...') // Cek apakah deskripsi dipotong
    expect(wrapper.find('.current-price').text()).toBe(`Rp${product.price.toLocaleString()}`)
    expect(wrapper.find('.in-stock').text()).toContain(`Stok: ${product.stock}`)
    expect(wrapper.find('.add-to-cart-btn').text()).toBe('Tambah ke Keranjang')
  });

  it('displays out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...product, stock: 0 };
    const wrapper = mount(ProductCard, {
      props: { product: outOfStockProduct }
    });

    expect(wrapper.find('.out-of-stock-text').text()).toContain('Stok Habis')
    expect(wrapper.find('.add-to-cart-btn').attributes('disabled')).toBeDefined()
  });

  it('emits addToCart event when button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: { product }
    });

    await wrapper.find('.add-to-cart-btn').trigger('click');
    expect(wrapper.emitted('addToCart')).toBeTruthy();
    expect(wrapper.emitted('addToCart')[0]).toEqual([product]);
  });

  it('does not emit addToCart when out of stock', async () => {
    const outOfStockProduct = { ...product, stock: 0 };
    const wrapper = mount(ProductCard, {
      props: { product: outOfStockProduct }
    });

    // Tombol sudah disabled, jadi trigger tidak akan emit event
    await wrapper.find('.add-to-cart-btn').trigger('click');
    expect(wrapper.emitted('addToCart')).toBeFalsy();
  });

  it('displays discount correctly', () => {
    const discountedProduct = { ...product, discount: 20 }; // price 125000 -> 100000
    const wrapper = mount(ProductCard, {
      props: { product: discountedProduct }
    });

    expect(wrapper.find('.product-badge').text()).toBe('-20%');
    expect(wrapper.find('.current-price').text()).toBe('Rp100,000');
    expect(wrapper.find('.original-price').text()).toBe(`Rp${discountedProduct.price.toLocaleString()}`);
  });
});