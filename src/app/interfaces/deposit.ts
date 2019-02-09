import {User} from './user';

export interface Deposit {
  id: number;
  admin_id: number;
  amount: number;
  comment: string;
  admin?: User;
  revoked: boolean;
}
