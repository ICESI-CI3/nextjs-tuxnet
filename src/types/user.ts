export type Role = "admin" | "client" | "stylist" | string;

export interface User {
  id: string;
  firstname: string;
  email: string;
  password?: string;
  roles: Role[] | string;   // puede ser string o array, según el backend
  isActive: boolean;
}
