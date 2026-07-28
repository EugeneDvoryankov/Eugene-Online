import { Order, Status } from '../model/order.interface';

interface IOrderService {
  getOrder(orderId: string): Promise<Order | null>;
  getOrders(options?: { userId?: string }): Promise<Order[]>;
  addOrder(userId: string, productId: string): Promise<Order>;
  removeOrder(orderId: string): Promise<boolean>;
  updateOrder(orderId: string, data: { status?: number; isPaid?: boolean }): Promise<Order | null>;
  setOrderStatus(orderId: string, newStatus: Status): Promise<Order | null>;
  payOrder(orderId: string): Promise<Order | null>;
}

export default IOrderService;
