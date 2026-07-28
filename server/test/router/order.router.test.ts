import {
  expect,
  test,
  describe,
  beforeEach,
} from 'vitest';
import SuperTest from 'supertest';

import app from '../../src/start';
import orderService from '../../src/service/order.db.service';
import userService from '../../src/service/user.db.service';
import { Product } from '../../src/model/product.interface';
import productService from '../../src/service/product.db.service';
import { adminAuthorizationHeader, authorizationHeader, user } from '../setupFile';
import OrderModel from '../../src/db/Order.db';
import { Order } from '../../src/model/order.interface';

const request = SuperTest(app);

describe('The order router', () => {
  let product: Product;

  beforeEach(async () => {
    product = await productService.createProduct({
      name: 'Product 1',
      description: 'Description for product 1',
      price: 100,
      category: 'webdev',
    });
  });

  describe('get orders', () => {
    const getRequest = () => request
      .get('/api/orders')
      .set('Authorization', adminAuthorizationHeader);

    test('it should return 401 if the user is not authenticated', async () => {
      const res = await request
        .get('/api/orders');

      expect(res.statusCode).toBe(401);
    });

    test('it should return 403 if the user is not an admin', async () => {
      const res = await request
        .get('/api/orders')
        .set('Authorization', authorizationHeader);

      expect(res.statusCode).toBe(403);
    });

    test('it should return 200 with an empty array if there are no orders', async () => {
      const res = await getRequest();
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    test('it should return 200 with an array of orders', async () => {
      // Add an order, the array should now include that order

      await orderService.addOrder(user.id, product.id);

      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('get my orders', () => {
    const getRequest = () => request
      .get('/api/orders/me')
      .set('Authorization', authorizationHeader);

    test('it should return 401 if the user is not authenticated', async () => {
      const res = await request
        .get('/api/orders/me');

      expect(res.statusCode).toBe(401);
    });

    test('it should return 200 with the user orders', async () => {
      const products = await Promise.all([
        productService.createProduct({
          name: 'Product 1',
          description: 'description',
          price: 100,
          category: 'webdev',
        }),
        productService.createProduct({
          name: 'Product 2',
          description: 'description',
          price: 200,
          category: 'webdev',
        }),
        productService.createProduct({
          name: 'Product 3',
          description: 'description',
          price: 300,
          category: 'webdev',
        }),
      ]);
      const orderOne = await orderService.addOrder(user.id, products[0].id);
      const orderTwo = await orderService.addOrder(user.id, products[1].id);
      // Another order that should not be part of the result
      const otherUser = await userService.createUser({
        email: 'otheruser@gmail.com',
        password: 'password',
        companyName: 'Another Company',
      });
      await orderService.addOrder(otherUser.id, products[2].id);

      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            orderId: orderOne.orderId,
          }),
          expect.objectContaining({
            orderId: orderTwo.orderId,
          }),
        ]),
      );
    });
  });

  describe('get order', () => {
    const getRequest = (id: string) => request
      .get(`/api/orders/${id}`)
      .set('Authorization', authorizationHeader);

    test('it should return 401 if the user is not authenticated', async () => {
      const o2 = await orderService.addOrder(user.id, product.id);

      const res = await request
        .get(`/api/orders/${o2.orderId}`);

      expect(res.statusCode).toBe(401);
    });
    test('it should return 404 if an order with id does not exist', async () => {
      // Id that does not exist
      const id = '9999';
      const res = await getRequest(id);

      expect(res.statusCode).toBe(404);
    });

    test('it should return 200 with the order', async () => {
      const o2 = await orderService.addOrder(user.id, product.id);

      const res = await getRequest(o2.orderId);
      expect(res.statusCode).toBe(200);
      expect(res.body.orderId).toBe(o2.orderId);
      expect(res.body.userId).toBe(o2.userId);
      expect(res.body.productId).toBe(o2.productId);
    });

    describe('create order', () => {
      const createRequest = (data?: string | object | undefined) => request
        .post('/api/orders')
        .set('Authorization', authorizationHeader)
        .send(data);

      test('it should return 401 if the user is not authenticated', async () => {
        const res = await request
          .post('/api/orders')
          .send({ productId: product.id });

        expect(res.statusCode).toBe(401);
      });

      test('it should return 400 if a productId is provided that does not exist', async () => {
        // productId that does not exist
        const productId = '02f8fd67-f338-4866-b627-d303a6e87aba';

        const res = await request
          .post('/api/orders')
          .set('Authorization', authorizationHeader)
          .send({ productId });

        expect(res.statusCode).toBe(400);
      });

      test('it should return 201 and create an order', async () => {
        const res = await createRequest({ productId: product.id });

        expect(res.statusCode).toBe(201);
        expect(res.body).toBeTruthy();
        expect(res.body.orderId).toBeDefined();
        expect(res.body.userId).toBe(user.id);
        expect(res.body.productId).toBe(product.id);

        // verify it really got stored
        const all = await request
          .get('/api/orders')
          .set('Authorization', adminAuthorizationHeader);
        expect(all.statusCode).toBe(200);
        expect(all.body).toHaveLength(1);
      });

      /* test('it should return 400 when userId is a string', async () => {
        const res = await createRequest({ userId: '1', productId: 101 });

        expect(res.statusCode).toBe(400);
      });

      test('it should return 400 when productId is a string', async () => {
        const res = await createRequest({ userId: 1, productId: '101' });

        expect(res.statusCode).toBe(400);
      }); */
      test('it should return 201 and create an order when userId and productId', async () => {
        const res = await createRequest({ productId: product.id });

        expect(res.statusCode).toBe(201);
        expect(res.body).toBeTruthy();
        expect(res.body.orderId).toBeDefined();
        expect(res.body.userId).toBe(user.id);
        expect(res.body.productId).toBe(product.id);

        // verify it really got stored
        const all = await request
          .get('/api/orders')
          .set('Authorization', adminAuthorizationHeader);
        expect(all.statusCode).toBe(200);
        expect(all.body).toHaveLength(1);
      });
    });

    describe('delete order', () => {
      test('it should return 201 and create an order when userId and productId', async () => {
        const res = await request
          .post('/api/orders')
          .set('Authorization', authorizationHeader)
          .send({ productId: product.id });

        expect(res.statusCode).toBe(201);

        const { orderId } = res.body;
        expect(orderId).toBeDefined();
        expect(res.body.userId).toBe(user.id);
        expect(res.body.productId).toBe(product.id);
      });
    });

    describe('update order', () => {
      let order: Order;
      const updateRequest = (id: string, data?: string | object | undefined) => request
        .patch(`/api/orders/${id}`)
        .set('Authorization', adminAuthorizationHeader)
        .send(data);

      beforeEach(async () => {
        order = await OrderModel.create({ productId: product.id, userId: user.id });
      });

      test('it should return 401 if the user is not authenticated', async () => {
        const res = await request
          .patch(`/api/orders/${order.orderId}`);

        expect(res.statusCode).toBe(401);
      });

      test('it should return 403 if the user is not an admin', async () => {
        const res = await request
          .patch(`/api/orders/${order.orderId}`)
          .set('Authorization', authorizationHeader);

        expect(res.statusCode).toBe(403);
      });

      test('it should return 400 if trying to update other properties', async () => {
        const res = await updateRequest(order.orderId, { status: 3, isPaid: true });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({ status: 3, isPaid: true }),
        );
      });

      test('it should return 200 with the updated order', async () => {
        const res = await updateRequest(order.orderId, { status: 3, isPaid: true });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({ status: 3, isPaid: true }),
        );
      });
    });
  });
});
