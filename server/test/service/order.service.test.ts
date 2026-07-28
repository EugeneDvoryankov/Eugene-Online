import {
  expect,
  test,
  describe,
  beforeEach,
} from 'vitest';
import orderService from '../../src/service/order.service';
// import { Order } from '../../src/model/order.interface';

describe('The order service', () => {
  beforeEach(() => {
    orderService.removeOrders();
  });

  test('If 3 orders are added then the 3 order should exist', async () => {
    const dummyUserId1 = '1';
    const dummyProductId1 = '101';
    const dummyUserId2 = '2';
    const dummyProductId2 = '102';
    const dummyUserId3 = '3';
    const dummyProductId3 = '103';

    const o1 = await orderService.addOrder(dummyUserId1, dummyProductId1);
    const o2 = await orderService.addOrder(dummyUserId2, dummyProductId2);
    const o3 = await orderService.addOrder(dummyUserId3, dummyProductId3);

    const orders = await orderService.getOrders();

    expect(orders).toHaveLength(3);
    expect(orders[0].userId).toBe(dummyUserId1);
    expect(orders[0].productId).toBe(dummyProductId1);
    expect(orders[0].orderId).toBe(o1.orderId);
    expect(orders[1].userId).toBe(dummyUserId2);
    expect(orders[1].productId).toBe(dummyProductId2);
    expect(orders[1].orderId).toBe(o2.orderId);
    expect(orders[2].userId).toBe(dummyUserId3);
    expect(orders[2].productId).toBe(dummyProductId3);
    expect(orders[2].orderId).toBe(o3.orderId);
  });

  test('If 3 orders are added and one order is removed two remaining should exist', async () => {
    const dummyUserId1 = '1';
    const dummyProductId1 = '101';
    const dummyUserId2 = '2';
    const dummyProductId2 = '102';
    const dummyUserId3 = '3';
    const dummyProductId3 = '103';

    const o1 = await orderService.addOrder(dummyUserId1, dummyProductId1);
    const o2 = await orderService.addOrder(dummyUserId2, dummyProductId2);
    const o3 = await orderService.addOrder(dummyUserId3, dummyProductId3);

    await orderService.removeOrder(o2.orderId);

    const ordersAfterRemoval = await orderService.getOrders();

    expect(ordersAfterRemoval).toHaveLength(2);
    expect(ordersAfterRemoval[0].orderId).toBe(o1.orderId);
    expect(ordersAfterRemoval[1].orderId).toBe(o3.orderId);
    expect(ordersAfterRemoval.find((order) => order.orderId === o2.orderId)).toBeUndefined();
  });
});
