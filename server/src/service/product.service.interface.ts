import { Product } from '../model/product.interface';

interface IProductService {
  getProducts(): Promise<Product[]>;

  getProductByID(productId: string): Promise<Product | null>;

  createProduct(productData: Omit<Product, 'id'>): Promise<Product>;

  updateProduct(
    productId: string,
    updateData: Partial<Omit<Product, 'id'>>
  ): Promise<Product | null>;

  deleteProduct(productId: string): Promise<boolean>;
}

export default IProductService;
