export interface User {
  id: number;
  firstname: string;
  lastname: string;
  credit: number;
  rank_id: number;
  is_admin: boolean;
  creation_date: Date;
  verification_date: Date;
}
