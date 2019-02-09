import {User} from './user';

export interface Refund {
  id: number;
  admin_id: number;
  total_price: number;
  comment: string;
  admin?: User;
  revoked: boolean;
}
