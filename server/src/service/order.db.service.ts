import { Order, Status } from '../model/order.interface';
import IOrderService from './order.service.interface';
import OrderModel from '../db/Order.db';

/* eslint-disable class-methods-use-this */
class OrderService implements IOrderService {
  async getOrder(orderId: string): Promise<Order | null> {
    const order = await OrderModel.findByPk(orderId);
    return order;
  }

  async getOrders(options?: { userId?: string }): Promise<Order[]> {
    const where = options && options.userId ? { userId: options.userId } : {};
    const orders = await OrderModel.findAll({ where });
    return orders;
  }

  async addOrder(userId: string, productId: string): Promise<Order> {
    return OrderModel.create({ userId, productId });
  }

  async removeOrder(orderId: string): Promise<boolean> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) return false;
    await order.destroy();

    return true;
  }

  async updateOrder(
    orderId: string,
    data: { status?: number; isPaid?: boolean },
  ): Promise<Order | null> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) return null;

    await order.update(data);

    const updatedOrder = await OrderModel.findByPk(orderId);
    return updatedOrder;
  }

  async setOrderStatus(orderId: string, newStatus: Status): Promise<Order | null> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) return null;

    order.status = newStatus;
    await order.save();

    return order;
  }

  async payOrder(orderId: string): Promise<Order | null> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) return null;

    if ((order as any).isPaid === true) return order;

    (order as any).isPaid = true;
    await order.save();

    return order;
  }
}

const orderService = new OrderService();
export default orderService;
