import ProductModel from '../db/Product.db';
import { Product } from '../model/product.interface';
import IProductService from './product.service.interface';

/* eslint-disable class-methods-use-this */
class ProductService implements IProductService {
  async getProducts(): Promise<Product[]> {
    const products = await ProductModel.findAll();
    return products.map((product) => product.toJSON());
  }

  async getProductByID(productId: string): Promise<Product | null> {
    const product = await ProductModel.findOne({
      where: { id: productId },
    });
    if (!product) {
      return null;
    }
    return product.toJSON();
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    if (productData.price < 0) {
      throw new Error('Price cannot be negative.');
    }
    const newProduct = await ProductModel.create(productData);
    return newProduct.toJSON();
  }

  async updateProduct(
    productId: string,
    updateData: Partial<Omit<Product, 'id'>>,
  ): Promise<Product | null> {
    const product = await ProductModel.findOne({
      where: { id: productId },
    });
    if (!product) {
      return null;
    }
    if (updateData.price !== undefined && updateData.price < 0) {
      throw new Error('Price cannot be negative.');
    }
    const updateProduct = await product.update(updateData);
    return updateProduct.toJSON();
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deletedRows = await ProductModel.destroy({ where: { id } });
    return deletedRows > 0;
  }
}
/* eslint-enable class-methods-use-this */

const productService: IProductService = new ProductService();
export default productService;
