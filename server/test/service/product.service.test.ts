import {
  expect,
  test,
  describe,
} from 'vitest';
import productService from '../../src/service/product.service';

describe('The product service', () => {
  test('Should return all 5 products from the static list', async () => {
    const products = await productService.getProducts();

    expect(products).toHaveLength(5);
    expect(products[0].name).toBe('Website pack');
    expect(products[4].name).toBe('Full pack');
  });

  test('Should return null if product ID does not exist', async () => {
    const nonExistentId = '999';
    const product = await productService.getProductByID(nonExistentId);

    expect(product).toBeNull();
  });

  test('Should return a deep copy of the product', async () => {
    const product = await productService.getProductByID('1');

    if (product) {
      product.name = 'Changed name';

      const originalProduct = await productService.getProductByID('1');
      expect(originalProduct?.name).toBe('Website pack');
    }
  });
});
