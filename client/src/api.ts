import { basicToken } from './services/auth';
import type { Booking, Product, User, Order, Blog } from './types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getUsers: () => Promise<User[]> = async () => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/users`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const data: User[] = await res.json();
  return data;
};

export const getMyUser: () => Promise<User> = async () => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const data: User = await res.json();
  return data;
};

export const createUser: (email: string, password: string, companyName: string) => Promise<User> = async (email, password, companyName) => {
  const res: Response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, companyName }),
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const data: User = await res.json();
  return data;
};

export const updateUser: (id: string, data: { phoneNumber?: string, password?: string }) => Promise<User> = async (id, data) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify(data),
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const updatedUser: User = await res.json();
  return updatedUser;
};

export const loginUser: (email: string, password: string) => Promise<User> = async (email, password) => {
  const res: Response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const data: User = await res.json();
  return data;
};

export type BookedSlot = Pick<Booking, 'year' | 'month' | 'day' | 'time'>;

export const getBookings: (options?: { from?: string; to?: string; }) => Promise<BookedSlot[]> = async (options) => {
  const queryParams = new URLSearchParams();
  if (options && options.from) {
    queryParams.set('from', options.from);
  }
  if (options && options.to) {
    queryParams.set('to', options.to);
  }
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const res: Response = await fetch(`${BASE_URL}/bookings${queryString}`);
  if (res.ok === false) {
    throw new Error('Could not fetch bookings');
  }

  const data: BookedSlot[] = await res.json();
  return data;
};

export const getAdminBookings = async (): Promise<Booking[]> => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res = await fetch(`${BASE_URL}/bookings/admin`, {
    headers: { Authorization: basicToken.value },
  });
  if (!res.ok) {
    throw new Error('Could not fetch bookings');
  }

  return res.json();
};

export const getMyBookings: () => Promise<Booking[]> = async () => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/bookings/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });
  if (res.ok === false) {
    throw new Error('Could not fetch my bookings');
  }

  const data: Booking[] = await res.json();
  return data;
};

export const createBooking: (data: { year: number, month: number, date: number, time: number }) => Promise<Booking> = async (data) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify({ type: 'consultation', year: data.year, month: data.month, day: data.date, time: data.time }),
  });
  if (res.ok === false) {
    throw new Error('Could not create booking');
  }

  const responseData: Booking = await res.json();
  return responseData;
};

export const deleteBooking: (bookingId: string) => Promise<void> = async (bookingId) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });
  if (res.ok === false) {
    throw new Error('Could not delete booking');
  }

  return;
};

// Retrieves all available products from backend
export const getProducts: () => Promise<Product[]> = async () => {
  const res: Response = await fetch(`${BASE_URL}/products`);

  if (res.ok === false) {
    throw new Error('Could not fetch products');
  }

  const data: Product[] = await res.json();
  return data;
};

export const getOrders: () => Promise<Order[]> = async () => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error('Could not fetch orders');
  }

  return (await res.json()) as Order[];
};

export const getMyOrders: () => Promise<Order[]> = async () => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error('Could not fetch orders');
  }

  return (await res.json()) as Order[];
};

export const getOrder: (orderId: string) => Promise<Order> = async (orderId) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error('Could not fetch order');
  }

  return (await res.json()) as Order;
};

export const createOrder: (productId: string) => Promise<Order> = async (productId) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify({ productId }),
  });

  if (res.ok === false) {
    throw new Error('Could not create order');
  }
  
  const responseData: Order = await res.json();
  return responseData;
};

export const updateProfile: (payload: { phone?: string; password?: string }) => Promise<void> = async (payload) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok === false) {
    throw new Error('Could not update profile');
  }
};

export const createProduct: (data: { name: string, description: string, price: number }) => Promise<Product> = async (data) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify(data),
  });
  if (res.ok === false) {
    throw new Error('Could not create product');
  }

  const responseData: Product = await res.json();
  return responseData;
};

export const updateProduct: (id: string, data: { name?: string, description?: string, price?: number }) => Promise<Product> = async (id, data) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify(data),
  });
  if (res.ok === false) {
    throw new Error('Could not update product');
  }

  const responseData: Product = await res.json();
  return responseData;
};

export const deleteProduct: (id: string) => Promise<void> = async (id) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });
  if (res.ok === false) {
    throw new Error('Could not delete product');
  }

  return;
};

export const getBlogs: () => Promise<Blog[]> = async () => {
  const res: Response = await fetch(`${BASE_URL}/blogs`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const data: Blog[] = await res.json();
  return data;
};

export const createBlog: (data: Omit<Blog, 'id' | 'uploadAt'>) => Promise<Blog> = async (data) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify(data),
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  const blog: Blog = await res.json();
  return blog;
};

export const deleteBlog: (id: string) => Promise<void> = async (id) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error(JSON.stringify(res.body));
  }

  return;
};

export const updateOrder: (orderId: string, data: { status?: number, isPaid?: boolean }) => Promise<Order> = async (orderId, data) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
    body: JSON.stringify(data),
  });

  if (res.ok === false) {
    throw new Error('Could not update order');
  }

  const updatedOrder: Order = await res.json();
  return updatedOrder;
};

export const deleteOrder: (orderId: string) => Promise<void> = async (orderId) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });
  if (res.ok === false) {
    throw new Error('Could not delete order');
  }

  return;
};

export const payOrder: (orderId: string) => Promise<Order> = async (orderId) => {
  if (!basicToken.value) {
    throw new Error('User is not authenticated');
  }

  const res: Response = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicToken.value,
    },
  });

  if (res.ok === false) {
    throw new Error('Could not pay order');
  }

  return (await res.json()) as Order;
};
