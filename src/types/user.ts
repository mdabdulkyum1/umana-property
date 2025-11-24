
export interface IUser {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  role: string;
  leader?: boolean;
  hasPayment: boolean;
  createdAt: string;
}
