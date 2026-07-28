import express, { Request, Response } from 'express';
import productService from '../service/product.db.service';
import { Product } from '../model/product.interface';
import authenticate from '../middlewares/authenticate';

const productRouter = express.Router();

// Get All Products
productRouter.get(
  '/',
  async (
    req: Request,
    res: Response <Product[] | string>,
  ) => {
    try {
      const prodcuts = await productService.getProducts();
      return res.status(200).json(prodcuts);
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

// Get A Product By Its ID
productRouter.get(
  '/:id',
  async (
    req: Request <{ id: string }>,
    res: Response <Product | string>,
  ) => {
    try {
      const product = await productService.getProductByID(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      return res.status(200).json(product);
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

// Create A New Product
productRouter.post(
  '/',
  authenticate({ admin: true }),
  async (
    req: Request,
    res: Response<Product | string>,
  ) => {
    try {
      const { category } = req.body;

      const allowedCategories = ['consultation', 'webdev', 'appdev', 'design'];

      if (!category || !allowedCategories.includes(category)) {
        return res.status(400).send('Invalid or missing category');
      }

      const newProduct = await productService.createProduct(req.body);
      return res.status(201).json(newProduct);
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(400).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

// Update A Product
productRouter.patch(
  '/:id',
  authenticate({ admin: true }),
  async (
    req: Request<{ id: string }>,
    res: Response<Product | string>,
  ) => {
    try {
      if (req.body.category) {
        const allowedCategories = ['consultation', 'webdev', 'appdev', 'design'];

        if (!allowedCategories.includes(req.body.category)) {
          return res.status(400).send('Invalid category');
        }
      }

      const updateProduct = await productService.updateProduct(req.params.id, req.body);

      if (!updateProduct) {
        return res.status(404).send('Product not found');
      }

      return res.status(200).json(updateProduct);
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(400).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

productRouter.delete(
  '/:id',
  authenticate({ admin: true }),
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const isDeleted = await productService.deleteProduct(req.params.id);

      if (!isDeleted) {
        return res.status(404).send('Product not found or already deleted.');
      }
      return res.status(200).send('Product successfully deleted.');
    } catch (e: any) {
      if (e instanceof Error) {
        return res.status(400).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

export default productRouter;
