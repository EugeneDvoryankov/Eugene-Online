import {
  expect,
  test,
  describe,
  beforeEach,
  vi,
} from 'vitest';
import SuperTest from 'supertest';

import ProductModel from '../../src/db/Product.db';
import app from '../../src/start';
import { adminAuthorizationHeader, authorizationHeader } from '../setupFile';

// Mock without a factory function will instead of loading conn.ts
// it will load __mocks__/conn.ts which returns a Sequelize instance
// connected to a in-memory sqlite database
vi.mock('../../src/db/conn');

const request = SuperTest(app);

describe('The product router', () => {
  let products: ProductModel[];

  beforeEach(async () => {
    products = await ProductModel.bulkCreate([
      {
        name: 'Website pack',
        description: 'Desc',
        price: 1500,
        category: 'webdev',
      },
      {
        name: 'Marketing pack',
        description: 'Desc',
        price: 800,
        category: 'consultation',
      },
      {
        name: 'Branding pack',
        description: 'Desc',
        price: 1200,
        category: 'design',
      },
      {
        name: 'Application pack',
        description: 'Desc',
        price: 2500,
        category: 'appdev',
      },
      {
        name: 'Full pack',
        description: 'Desc',
        price: 4000,
        category: 'webdev',
      },
    ]);
  });

  /* describe('GET /products', () => {
    const getRequest = () => request.get('/products');

    // Has a side effect, sometimes it returns 5, sometimes it returns 10
    // Mock seed function
    test('it should return 200 with all products in the list', async () => {
      const res = await getRequest();

      // It returns 10 products because 5 products are also added when running seedProducts
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(10);
    });
  }); */

  describe('GET /api/products/:id', () => {
    const getRequest = (id: string) => request.get(`/api/products/${id}`);

    test('it should return 200 with the specific product if it exists', async () => {
      const productId = products[0].id;
      const res = await getRequest(productId);

      expect(res.statusCode).toBe(200);
    });

    test('it should return 404 if the product id does not exist', async () => {
      const id = '999';
      const res = await getRequest(id);

      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    const postRequest = (data: any) => request
      .post('/api/products')
      .set('Authorization', adminAuthorizationHeader)
      .send(data);

    test('it should return 401 if not authenticated at all', async () => {
      const res = await request.post('/api/products').send({ name: 'Test', price: 100 });
      expect(res.statusCode).toBe(401);
    });

    test('it should return 403 Forbidden if a regular user tries to create a product', async () => {
      const res = await request
        .post('/api/products')
        .set('Authorization', authorizationHeader)
        .send({ name: 'Test', price: 100 });

      expect(res.statusCode).toBe(403);
    });

    test('it should return 201 and create a new product if admin', async () => {
      const newProduct = {
        name: 'SEO pack',
        description: 'SEO package',
        price: 900,
        category: 'webdev',
      };

      const res = await postRequest(newProduct);
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('SEO pack');
    });

    test('it should return 400 if price is negative', async () => {
      const invalidProduct = {
        name: 'Free',
        desciption: 'Cheap',
        price: -100,
        category: 'consultation',
      };
      const res = await postRequest(invalidProduct);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/products/:id', () => {
    const patchRequest = (id: string, data: any) => request
      .patch(`/api/products/${id}`)
      .set('Authorization', adminAuthorizationHeader)
      .send(data);

    test('it should return 403 Forbidden if a regular user tries to update', async () => {
      const productId = products[0].id;
      const res = await request
        .patch(`/api/products/${productId}`)
        .set('Authorization', authorizationHeader)
        .send({ price: 999 });
      expect(res.statusCode).toBe(403);
    });

    test('it should return 200 and the updated product if admin', async () => {
      const productId = products[0].id;
      const res = await patchRequest(productId, { price: 999 });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(999);
      expect(res.body.name).toBe('Website pack');
    });

    test('it should return 404 if the product id does not exist', async () => {
      const res = await patchRequest('999', { price: 500 });
      expect(res.statusCode).toBe(404);
    });

    test('it should return 400 if trying to set a negative price', async () => {
      const productId = products[0].id;
      const res = await patchRequest(productId, { price: -20 });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/products/:id', () => {
    const deleteRequest = (id: string) => request
      .delete(`/api/products/${id}`)
      .set('Authorization', adminAuthorizationHeader);

    test('it should return 401 if not authenticated at all', async () => {
      const productId = products[0].id;
      const res = await request.delete(`/api/products/${productId}`);
      expect(res.statusCode).toBe(401);
    });

    test('it should return 403 if Forbidden if a regular user tries to delete', async () => {
      const productId = products[0].id;
      const res = await request
        .delete(`/api/products/${productId}`)
        .set('Authorization', authorizationHeader);
      expect(res.statusCode).toBe(403);
    });

    test('it should return 200 and completly remove the product if admin', async () => {
      const productId = products[0].id;
      const res = await deleteRequest(productId);
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Product successfully deleted.');
      const dbProduct = await ProductModel.findByPk(productId);
      expect(dbProduct).toBeNull();
    });

    test('it should return 404 if the product id does not exist', async () => {
      const fakeUUID = '0000000-00000-00000';
      const res = await deleteRequest(fakeUUID);
      expect(res.statusCode).toBe(404);
    });
  });
});
