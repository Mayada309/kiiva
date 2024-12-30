import { StaticImageData } from 'next/image';

type Option = {
  id: number;
  value: string;
};

type Sku = {
  id: number;
  product_id: number;
  code: string;
  quantity: number;
  is_in_stock: boolean;
  price: number;
  compare_price: number;
  images: StaticImageData[];
  options: Option[];
};

export type PublicProduct = {
  id: number;
  name: string;
  description: string;
  short_description: string;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  price: number;
  compare_price: number;
  images: StaticImageData[];
  skus: Sku[];
  category: string;
  sizeOptions: string[];
  color: string;
  stock: number;
  amount: number;
  selectedSize: string;
};

export type NavLink = {
  id: number;
  page: string;
  url: string;
};

export type City = {
  id: number;
  name: string;
  shippingFee: number;
};

type ParentCategory = {
  id: number;
  name: string;
  slug: string;
};
type SubCategory = {
  id: number;
  name: string;
  parent_id: number;
  is_parent: false;
};
export type Category = {
  id: number;
  name: string;
  slug: string;
  is_parent: boolean;
  children_count: number;
  products_count: number;
  parent?: ParentCategory;
  children?: SubCategory[];
};

type MetaLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type PaginationData = {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};
