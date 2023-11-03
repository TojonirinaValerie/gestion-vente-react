export interface UserAttributes {
  id: string;
  pseudo: string;
  password: string;
  role: "ADMIN" | "CLIENTS";
  updatedAt?: Date;
  createdAt?: Date;
}
