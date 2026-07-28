export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  companyName: string;
  password: string;
  admin: boolean;
}

export interface CreateUserInput {
  email: string;
  phoneNumber?: string;
  password: string;
  companyName: string;
}
