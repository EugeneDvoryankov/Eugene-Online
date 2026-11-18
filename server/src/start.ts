import express from 'express';
import cors from 'cors';
import { resolve } from 'node:path';
import bookingRouter from './router/booking.router';
import orderRouter from './router/order.router';
import userRouter from './router/user.router';
import productRouter from './router/product.router';
import sequelize from './db/conn';
import seedProducts from './db/seed';
import blogRouter from './router/blog.router';
// Synchronise database with models
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  await sequelize.sync({ alter: true });
  await seedProducts();
})();

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(cors());

const apiRouter = express.Router();
apiRouter.get('/', (req, res) => res.send('HELLO WORLD!'));
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/blogs', blogRouter);
apiRouter.use((_req, res) => res.sendStatus(404));

// You should prefix API routes with /api especially when deploying
// to prevent conflicts between frontend routes and API routes
app.use('/api', apiRouter);

app.get('/{*path}', (req, res, next) => {
  if (!req.get('Accept')?.includes('text/html') || req.path.includes('.')) return next();
  return res.sendFile(resolve('public/index.html'));
});

export default app;
