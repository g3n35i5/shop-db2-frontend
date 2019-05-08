export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  active?: boolean;
  countable?: boolean;
  revocable?: boolean;
  imagename: string;
  tags: number[];
  creation_date: Date;
}
