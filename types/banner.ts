export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  storagePath?: string;
  linkTo?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}
