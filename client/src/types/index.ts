export interface User {
    id: string;
    email: string;
    password: string;
    companyName: string;
    phoneNumber: string;
    admin: boolean;
}

export interface Booking {
    id: string;
    year: number;
    month: number;
    day: number;
    time: number;
    userId: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'consultation' | 'webdev' | 'appdev' | 'design';
}

export enum Status {
  Accepted = 0,
  Development = 1,
  Testing = 2,
  Done = 3,
}

export interface BackendOrder {
  orderId: string;
  userId: string;
  productId: string;
  status: Status;
  date: Date;
}
export type OrderStatus = 0 | 1 | 2 | 3;

export type ReceiptRow = { label: string; amount: number };
export type Receipt = { rows: ReceiptRow[]; total: number };

export type Order = {
  orderId: string;
  status: OrderStatus;
  userId: string;
  productId: string;
  price: number;
  date: string;
  receipt?: Receipt;
  isPaid?: boolean;
};

export interface Blog {
  id: string;
  title: string;
  content: string;
  uploadAt: number;
}
