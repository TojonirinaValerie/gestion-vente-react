import { ApiResponseType } from "../types/ApiResponse";
import { CommandeAttribut, DataCreateCommande } from "../types/Commande";
import axiosInstance from "./axios";
import apiEndpoint from "./endpoint";

export const getCommandeByClient = (userId: string, date: Date) => {
  return axiosInstance.post<ApiResponseType<CommandeAttribut[]>>(
    `${apiEndpoint.commande.index}/${userId}`,
    {
      date
    }
  );
};

export const createCommande = (data: DataCreateCommande) => {
  return axiosInstance.post<ApiResponseType<CommandeAttribut>>(apiEndpoint.commande.index, data);
};

export const deleteCommande = (commandeId: string) => {
  return axiosInstance.delete<ApiResponseType<undefined>>(
    `${apiEndpoint.commande.index}/${commandeId}`
  );
};

export const updateCommande = (commande: CommandeAttribut) => {
  return axiosInstance.put<ApiResponseType<number[]>>(
    `${apiEndpoint.commande.index}/${commande.id}`,
    commande
  );
};
