export type AdminRole = "super_admin" | "admin" | "manager";

export interface Admin {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}
