
export interface IUser {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  role: string;
  image?: string;
  leader?: boolean;
  hasPayment: boolean;
  createdAt: string;
}
