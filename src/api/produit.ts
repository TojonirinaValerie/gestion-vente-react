import { ApiResponseType } from "../types/ApiResponse";
import { ProduitAttribut, ProduitDataCreate } from "../types/Produit";
import axiosInstance from "./axios";
import apiEndpoint from "./endpoint";

export const getAllProduit = () => {
  return axiosInstance.get<ApiResponseType<ProduitAttribut[]>>(apiEndpoint.produit.index);
};

export const createProduit = (data: ProduitDataCreate) => {
  return axiosInstance.post<ApiResponseType<ProduitAttribut>>(apiEndpoint.produit.index, {
    designation: data.designation,
    prixAchat: Number(data.prixAchat),
    prixVente: Number(data.prixVente)
  });
};

export const updateProduit = (id: string, data: ProduitDataCreate) => {
  return axiosInstance.put<ApiResponseType<ProduitAttribut>>(`${apiEndpoint.produit.index}/${id}`, {
    designation: data.designation,
    prixAchat: Number(data.prixAchat),
    prixVente: Number(data.prixVente)
  });
};

export const deleteProduit = (id: string) => {
  return axiosInstance.delete<ApiResponseType<undefined>>(`${apiEndpoint.produit.index}/${id}`);
};
