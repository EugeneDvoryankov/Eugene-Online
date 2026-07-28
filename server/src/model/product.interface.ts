export type Category = 'consultation' | 'webdev' | 'appdev' | 'design';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
}
