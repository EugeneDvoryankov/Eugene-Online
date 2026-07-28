import { v4 as uuidv4 } from 'uuid';
import { Order, Status } from '../model/order.interface';

class OrderService {
  private orders: Order[] = [];

  // Returns a  copy of the current list of orders
  async getOrders(options?: { userId?: string }): Promise<Order[]> {
    const requestedOrders = this.orders.filter((order) => {
      if (options && options.userId) {
        return order.userId === options.userId;
      }

      // If userId is not provided return all orders
      return true;
    });

    return JSON.parse(JSON.stringify(requestedOrders));
  }

  // Returns a specific order by its id
  async getOrder(orderId: string): Promise<Order | null> {
    const order = this.orders.find((savedOrder) => savedOrder.orderId === orderId);
    if (order === undefined) {
      return null;
    }
    return JSON.parse(JSON.stringify(order));
  }

  // Removes a specific order by its id,
  // return true if the order was found and deleted, false otherwise
  async removeOrder(orderId: string): Promise<boolean> {
    const deleted = !!this.orders.find((order) => order.orderId === orderId);
    this.orders = this.orders.filter((order) => order.orderId !== orderId);
    return deleted;
  }

  // Creates a new order from user
  // Return a copy with newly created copy

  async addOrder(userId: string, productId: string): Promise<Order> {
    const order = {
      orderId: uuidv4(),
      userId,
      productId,
      status: Status.Accepted,
      date: new Date(),
      isPaid: false,
    };

    this.orders.push(order);
    return JSON.parse(JSON.stringify(order));
  }

  // Updates order status
  // If order not completed, then updateOrderState can be called again until the order is done
  // If the order is already done, then calling updateOrderState will have no effect
  async updateOrderStatus(orderId: string): Promise<Order | null> {
    const order = this.orders.find((o) => o.orderId === orderId);
    if (!order) {
      return null;
    }
    if (order.status === Status.Done) {
      return { ...order, date: new Date(order.date) };
    }
    if (order.status < Status.Done) {
      order.status += 1;
    }
    return { ...order, date: new Date(order.date) };
  }

  // Manually set order status (for testing purposes)
  async setOrderStatus(orderId: string, newStatus: Status): Promise<Order | null> {
    const order = this.orders.find((o) => o.orderId === orderId);
    if (!order) {
      return null;
    }
    order.status = newStatus;
    return { ...order };
  }

  // Used for testing purposes to reset the in-memory database between tests
  removeOrders() {
    this.orders = [];
  }
}

const orderService = new OrderService();
export default orderService;
