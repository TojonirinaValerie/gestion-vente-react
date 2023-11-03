export interface ProduitAttribut {
  id: string;
  designation: string;
  prixAchat: number;
  prixVente: number;
  quantiteReste: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface ProduitDataCreate {
  designation: string;
  prixAchat: string;
  prixVente: string;
}
