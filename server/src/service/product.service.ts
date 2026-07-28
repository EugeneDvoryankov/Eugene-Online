import { Product } from '../model/product.interface';

class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Website pack',
      description: 'A Complete website tailored to your buisness needs.',
      price: 1500,
      category: 'webdev',
    },
    {
      id: '2',
      name: 'Marketing pack',
      description: 'Strategic digital marketing to reach your target audience effectively.',
      price: 800,
      category: 'consultation',
    },
    {
      id: '3',
      name: 'Branding pack',
      description: 'Complete visual identity including logo design and color palettes.',
      price: 1200,
      category: 'design',
    },
    {
      id: '4',
      name: 'Application pack',
      description: 'Custom web applications built with modern framework for scalability',
      price: 2500,
      category: 'appdev',
    },
    {
      id: '5',
      name: 'Full pack',
      description: 'The ultimate solution inluding Website, Marketing, and Branding services.',
      price: 4000,
      category: 'webdev',
    },
  ];

  // Returns all products
  async getProducts(): Promise<Product[]> {
    return JSON.parse(JSON.stringify(this.products));
  }

  // Returns a specific product by its id
  async getProductByID(prodcutId: string): Promise <Product | null> {
    const product = this.products.find((p) => p.id === prodcutId);
    if (!product) {
      return null;
    }
    return JSON.parse(JSON.stringify(product));
  }
}

const productService = new ProductService();
export default productService;
