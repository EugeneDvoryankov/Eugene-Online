import express, { Request, Response } from 'express';
import { body, checkExact } from 'express-validator';
import orderService from '../service/order.db.service';
import { Order } from '../model/order.interface';
import authenticate from '../middlewares/authenticate';
import validate from '../middlewares/validate';

const orderRouter = express.Router();

// Get all orders
orderRouter.get(
  '/',
  authenticate({ admin: true }),
  async (req: Request, res: Response<Order[] | string>) => {
    try {
      const orders = await orderService.getOrders();
      return res.status(200).send(orders);
    } catch (e: any) {
      return res.status(500).send(e.message);
    }
  },
);

// Me route must be placed before GET orders/:id
// Otherwise orders/:id will run instead
orderRouter.get(
  '/me',
  authenticate(),
  async (req: Request, res: Response<Order[] | string>) => {
    try {
      if (!req.user) {
        return res.status(401).send('User is not authenticated');
      }

      const orders = await orderService.getOrders({ userId: req.user.id });
      return res.status(200).json(orders);
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

// Get specific order by id
orderRouter.get(
  '/:orderId',
  authenticate(),
  async (req: Request<{ orderId: string }>, res: Response<Order | string>) => {
    try {
      const order = await orderService.getOrder(req.params.orderId);
      if (order === null) {
        return res.status(404).send('Order with this orderId does not exist');
      }

      return res.status(200).json(order);
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

// Post specific order by id
orderRouter.post(
  '/',
  authenticate(),
  async (
    req: Request<unknown, unknown, { userId: string; productId: string }>,
    res: Response<Order | string>,
  ) => {
    try {
      const { productId } = req.body;

      try {
        const newOrder = await orderService.addOrder(req.user!.id, productId);
        res.location(`/orders/${newOrder.orderId}`);
        return res.status(201).json(newOrder);
      } catch (error) {
        console.log(error);
        return res.status(400).send('Could not add new order');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

orderRouter.patch(
  '/:orderId',
  authenticate({ admin: true }),
  validate([
    body('status').optional().isIn([0, 1, 2, 3]),
    body('isPaid').optional().isBoolean().toBoolean(),
    checkExact(),
  ]),
  async (req: Request<{ orderId: string }>, res: Response<Order | string>) => {
    try {
      const updated = await orderService.updateOrder(req.params.orderId, req.body);

      if (!updated) {
        return res.status(404).send(`No order with id ${req.params.orderId}`);
      }

      return res.status(200).json(updated);
    } catch (e: any) {
      return res.status(500).send(e.message);
    }
  },
);

// Delete order by id
orderRouter.delete(
  '/:orderId',
  authenticate(),
  async (req: Request<{ orderId: string }>, res: Response<Order | string>) => {
    try {
      try {
        await orderService.removeOrder(req.params.orderId);
        return res.status(200).end();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return res.status(400).send('Could not delete order');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

// Mark order as paid
orderRouter.patch(
  '/:orderId/pay',
  authenticate(),
  async (req: Request<{ orderId: string }>, res: Response<Order | string>) => {
    try {
      if (!req.user) {
        return res.status(401).send('User is not authenticated');
      }

      const existing = await orderService.getOrder(req.params.orderId);
      if (existing === null) {
        return res.status(404).send('Order with this orderId does not exist');
      }

      if ((existing as any).userId && (existing as any).userId !== req.user.id) {
        return res.status(403).send('Not allowed to pay this order');
      }

      const updated = await orderService.payOrder(req.params.orderId);

      if (!updated) {
        return res.status(404).send(`No order with id ${req.params.orderId}`);
      }

      return res.status(200).json(updated);
    } catch (e: any) {
      return res.status(500).send(e.message ?? 'Could not pay order');
    }
  },
);

export default orderRouter;
