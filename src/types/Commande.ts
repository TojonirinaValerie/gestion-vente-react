import { ProduitAttribut } from "./Produit";
import { UserAttributes } from "./User";

export interface CommandeAttribut {
  id: string;
  date: Date;
  UserId?: string;
  ProduitId?: string;
  quantite: number;
  updatedAt?: Date;
  createdAt?: Date;
  Produit?: ProduitAttribut;
  User?: UserAttributes;
}

export interface DataCreateCommande {
  UserId: string;
  ProduitId: string;
  quantite: number;
}