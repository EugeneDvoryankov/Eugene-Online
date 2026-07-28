// Status = 'Order accepted' | 'Under development' | 'Under testing' | 'Order completed';
export enum Status {
  Accepted = 0,
  Development = 1,
  Testing = 2,
  Done = 3,
}

export interface Order {
  orderId: string;
  userId: string;
  productId: string;
  status: Status;
  date: string;
  isPaid?: boolean;
}
