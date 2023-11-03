import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPencil, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import { LoadingOverlay, Modal, Select, SelectItem } from "@mantine/core";
import Navbar from "../../components/Navbar/Navbar";
import "./style.scss";
import { useEffect, useState } from "react";
import { ProduitAttribut } from "../../types/Produit";
import { getAllProduit } from "../../api/produit";
import { Id, ToastContainer } from "react-toastify";
import { errorToast } from "../../utils/toast";
import { UserAttributes } from "../../types/User";
import { getAllUser } from "../../api/user";
import moment from "moment";
import {
  createCommande,
  deleteCommande,
  getCommandeByClient,
  updateCommande
} from "../../api/commande";
import { CommandeAttribut, DataCreateCommande } from "../../types/Commande";
import { arrondir, toLocalString } from "../../utils/formatNumber";
import { useDisclosure } from "@mantine/hooks";

const HomeScreen = () => {
  // ------------------------------------Variables------------------------------------------
  const [listProduit, setListProduit] = useState<ProduitAttribut[]>([]);
  const [dataProduit, setDataProduit] = useState<SelectItem[]>([]);
  const [loadingProduit, setLoadingProduit] = useState<boolean>(false);

  const [listUser, setListUser] = useState<UserAttributes[]>([]);
  const [dataUser, setDataUser] = useState<SelectItem[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);

  const [clientSelectedId, setClientSelectdId] = useState<string | null>(null);

  const [listCommande, setListCommande] = useState<CommandeAttribut[]>([]);
  const [loadingCommande, setloadingCommande] = useState<boolean>(false);

  const [idProduitOnCommande, setIdProduitOnCommande] = useState<string | null>(null);
  const [produitOnCommande, setProduitOnCommande] = useState<ProduitAttribut | undefined>(
    undefined
  );
  const [quantiteOnCommande, setQuantiteOnCommande] = useState<string>("");

  const [isLoadingDeleteCommande, setIsLoadingDeleteCommande] = useState(false);

  const [isOnEdit, setIsOnEdit] = useState<CommandeAttribut | null>(null);

  const [opened, { open, close }] = useDisclosure(false);
  // --------------------------------------------------------------------------------------

  // *********************************** Call Api *****************************************
  const getAllProduitApiCall = async () => {
    setLoadingProduit(true);
    try {
      const response = await getAllProduit();
      const result = response.data.data;
      const data: SelectItem[] = [];
      result.forEach((produit: ProduitAttribut) => {
        data.push({
          value: produit.id,
          label: `${produit.designation} (${produit.prixVente} Ar)`
        });
      });
      setDataProduit(data);
      setListProduit(response.data.data);
    } catch (error: any) {
      errorToast(error.reponse?.data.message || undefined);
    } finally {
      setLoadingProduit(false);
    }
  };

  const getAllUserApiCall = async () => {
    setLoadingUser(true);
    try {
      const response = await getAllUser();
      const result = response.data.data;

      let listUser: SelectItem[] = [];
      result.forEach((user: UserAttributes) => {
        listUser.push({
          value: user.id,
          label: user.pseudo
        });
      });
      setDataUser(listUser);
      setListUser(result);
    } catch (error: any) {
      errorToast(error.reponse?.data.message || undefined);
    } finally {
      setLoadingUser(false);
    }
  };

  const commandeByUserApiCall = async () => {
    if (clientSelectedId !== null) {
      setloadingCommande(true);
      try {
        const response = await getCommandeByClient(clientSelectedId, new Date());
        setListCommande(response.data.data);
      } catch (error: any) {
        errorToast(error.reponse?.data.message || undefined);
      } finally {
        setloadingCommande(false);
      }
    } else {
      setListCommande([]);
    }
  };

  const deleteCommandeApiCall = async (commandeId: string) => {
    setIsLoadingDeleteCommande(true);
    try {
      const response = await deleteCommande(commandeId);
      commandeByUserApiCall();
    } catch (error: any) {
      errorToast(error.reponse?.data.message || undefined);
    } finally {
      setIsLoadingDeleteCommande(false);
    }
  };
  // ***************************************************************************************

  // !----------------------------------- handle event -------------------------------------
  const handleSelectClient = (value: string | null) => {
    if (clientSelectedId !== value) {
      setClientSelectdId(value);
    }
  };

  const handleQuantiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Utilisez une expression régulière pour valider le contenu
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setQuantiteOnCommande(value);
    }
  };

  const handleAddCommande = async () => {
    try {
      const data: DataCreateCommande = {
        UserId: clientSelectedId || "",
        ProduitId: idProduitOnCommande || "",
        quantite: Number(quantiteOnCommande)
      };

      let newListComm: CommandeAttribut[] = [
        {
          id: "",
          date: new Date(),
          UserId: clientSelectedId || "",
          ProduitId: idProduitOnCommande || "",
          Produit: produitOnCommande || {
            id: "",
            prixAchat: 0,
            prixVente: 0,
            designation: "",
            quantiteReste: 0
          },
          quantite: Number(quantiteOnCommande)
        },
        ...listCommande
      ];
      setListCommande(newListComm);
      setIdProduitOnCommande(null);
      setQuantiteOnCommande("");
      const response = await createCommande(data);
      if (response.data.success) {
        commandeByUserApiCall();
      } else {
        errorToast(response.data.message);
      }
    } catch (error) {
      errorToast();
    }
  };

  const handleDeleteCommande = (commandeId: string) => {
    deleteCommandeApiCall(commandeId);
  };

  const handleEditCommande = (commande: CommandeAttribut) => {
    setIsOnEdit(commande);
    commande.UserId && setClientSelectdId(commande.UserId);
    commande.ProduitId && setIdProduitOnCommande(commande.ProduitId);
    setQuantiteOnCommande(commande.quantite.toString());
  };

  const handleCancelEdit = () => {
    setIsOnEdit(null);
    setIdProduitOnCommande(null);
    setQuantiteOnCommande("");
  };

  const handlSendEdit = async () => {
    if (isOnEdit) {
      setloadingCommande(true);
      try {
        const data: CommandeAttribut = {
          ...isOnEdit,
          UserId: clientSelectedId || "",
          ProduitId: idProduitOnCommande || "",
          quantite: Number(quantiteOnCommande)
        };
        const response = await updateCommande(data);

        if (response.data.success) {
          commandeByUserApiCall();
          setIdProduitOnCommande(null);
          setQuantiteOnCommande("");
        } else {
          errorToast(response.data.message);
        }
      } catch (error) {
        open();
      } finally {
        setloadingCommande(false);
        setIsOnEdit(null);
      }
    }
  };
  // !--------------------------------------------------------------------------------------

  const isDisableButtonAdd = () => {
    if (
      quantiteOnCommande.length === 0 ||
      idProduitOnCommande === null ||
      clientSelectedId === null
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    commandeByUserApiCall();
  }, [clientSelectedId]);

  useEffect(() => {
    const produitSelected = listProduit.find(item => item.id === idProduitOnCommande);
    setProduitOnCommande(produitSelected);
  }, [idProduitOnCommande]);

  useEffect(() => {
    getAllProduitApiCall();
    getAllUserApiCall();
  }, []);

  return (
    <>
      <ToastContainer />
      <LoadingOverlay
        visible={loadingProduit || loadingUser || loadingCommande || isLoadingDeleteCommande}
        zIndex={1000}
        overlayBlur={2}
        overlayColor="#222222"
        overlayOpacity={0.2}
      />
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        title={<h1 className="text-[1.5rem] font-bold">Erreur</h1>}
        centered
      >
        <div className="w-full flex flex-col items-center">
          <p className="text-lg"> Modification échoué</p>
          <div className="mt-2 w-1/2">
            <button
              className="cursor-pointer bg-error text-white w-full py-2 text-md rounded-[4px] transition-all
              hover:bg-accent disabled:bg-primary-50 disabled:cursor-default"
              onClick={() => close()}
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col w-full min-h-screen">
        <div className="flex flex-col w-full h-full ">
          <Navbar />
          <div className="w-full h-full bg-background ">
            <div className="flex flex-col w-full px-4 py-4">
              <div className="flex flex-row">
                <div className="flex flex-col flex-1 mx-4 p-6 py-4 items-strech bg-white rounded-[10px] border-[1px] border-grey1">
                  <p className="text-lg font-[600]">Selectionner le client</p>
                  <Select
                    data={dataUser}
                    clearable
                    value={clientSelectedId}
                    onChange={user => handleSelectClient(user)}
                    disabled={isOnEdit !== null ? true : false}
                    placeholder="Selectionner un client"
                    classNames={{
                      input:
                        "text-sm bg-background rounded-[4px] placeholder:text-grey2  border-[1px] border-grey1 focus:ring-0"
                    }}
                    className="box-border w-full border-none focus:ring-0 mt-2
                        placeholder:text-grey2"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 mx-4 p-6 py-2 items-strech bg-white rounded-[10px] border-[1px] border-grey1">
                  <div className="flex flex-row items-center w-full">
                    <span className="w-[80px] min-w-[80px] text-md mr-2">Produit :</span>
                    <Select
                      data={dataProduit}
                      placeholder="Selectionner un produit"
                      searchable
                      clearable
                      nothingFound="Aucun produit trouvé"
                      value={idProduitOnCommande}
                      onChange={value => setIdProduitOnCommande(value)}
                      classNames={{
                        input:
                          "text-sm bg-background rounded-[4px] placeholder:text-grey2 border-[1px] border-grey1 focus:ring-0"
                      }}
                      className="box-border w-full border-none focus:ring-0 mt-2
                          placeholder:text-grey2"
                    />
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <span className="w-[80px] min-w-[80px] text-md mr-2">Quantité :</span>
                    <input
                      type="text"
                      placeholder="Quantité"
                      value={quantiteOnCommande}
                      className="bg-background text-sm m-0 px-2 py-2 border-[1px] border-grey1 box-border leading-none w-full rounded-[3px]
                      focus:ring-0 placeholder:text-grey2"
                      onChange={handleQuantiteChange}
                    />
                  </div>
                  {!isOnEdit ? (
                    <div className="flex flex-row justify-end my-2">
                      <div className="w-[80px] min-w-[80px]"></div>
                      <button
                        className="cursor-pointer bg-primary text-white w-full ml-2 py-2 text-md rounded-[4px] transition-all
                          hover:bg-accent disabled:bg-primary-50 disabled:cursor-default"
                        disabled={isDisableButtonAdd()}
                        onClick={handleAddCommande}
                      >
                        Ajouter
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-end my-2">
                      <div className="w-[80px] min-w-[80px]"></div>
                      <div className="flex flex-row items-center w-full">
                        <button
                          className="cursor-pointer flex-1 bg-primary text-white ml-2 py-2 text-md rounded-[4px] transition-all
                            hover:bg-accent disabled:bg-primary-50 disabled:cursor-default"
                          disabled={isDisableButtonAdd()}
                          onClick={handlSendEdit}
                        >
                          Modifier
                        </button>
                        <button
                          className="cursor-pointer flex-1 bg-secondary text-white ml-2 py-2 text-md rounded-[4px] transition-all
                            hover:bg-accent disabled:bg-primary-50 disabled:cursor-default"
                          onClick={handleCancelEdit}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-row justify-between items-end mx-4 my-2">
                <div>
                  <h2 className="text-lg font-[600]">Liste des commandes</h2>
                  <p className="">
                    <span className="text-base mr-2">
                      Date: {moment(new Date()).format("DD/MM/YYYY")}
                    </span>
                    <FontAwesomeIcon icon={faCalendarDays} className="text-accent" />
                  </p>
                </div>
                <div className="mr-8 flex flex-row items-center border ng-white p-2 px-6 rounded-[4px] bg-white border-grey1 cursor-pointer">
                  <FontAwesomeIcon icon={faSliders} className="text-lg" />
                  <span className="text-lg ml-3">Filtre</span>
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1 mx-4 p-6 py-6 my-2 items-strech bg-white rounded-[10px] border-[1px] border-grey1">
                <table className="home-table">
                  <thead>
                    <th className="desigantion-col py-2">Produits</th>
                    <th className="qauntity-col">Quantités</th>
                    <th className="prix-u-col">Prix Unitaire</th>
                    <th className="prix-total-col">Prix Totale</th>
                    <th className="prix-achat-col">Prix d'achat</th>
                    <th className="prix-achat-total-col ">Prix d'achat totale</th>
                    <th className="action-col"></th>
                  </thead>
                  <tbody>
                    {listCommande.map((commande: CommandeAttribut, index) => {
                      return (
                        <tr key={commande.id}>
                          <td className={`desigantion-col ${index % 2 !== 0 && "impair"}`}>
                            {commande.Produit?.designation}
                          </td>
                          <td className={`qauntity-col  ${index % 2 !== 0 && "impair"}`}>
                            {commande.quantite}
                          </td>
                          <td className={`prix-u-col ${index % 2 !== 0 && "impair"}`}>
                            {commande.Produit &&
                              toLocalString(Math.round(commande.Produit?.prixVente))}{" "}
                            Ar
                          </td>
                          <td className={`prix-total-col ${index % 2 !== 0 && "impair"}`}>
                            {commande.Produit &&
                              toLocalString(
                                Math.round(commande.Produit.prixVente * commande.quantite)
                              )}{" "}
                            Ar
                          </td>
                          <td className={`prix-achat-col ${index % 2 !== 0 && "impair"}`}>
                            {commande.Produit &&
                              toLocalString(Math.round(commande.Produit?.prixAchat))}{" "}
                            Ar
                          </td>
                          <td className={`prix-achat-total-col ${index % 2 !== 0 && "impair"}`}>
                            {commande.Produit &&
                              toLocalString(
                                Math.round(commande.Produit.prixAchat * commande.quantite)
                              )}{" "}
                            Ar
                          </td>
                          <td className={`action-col ${index % 2 !== 0 && "impair"}`}>
                            <FontAwesomeIcon
                              icon={faPencil}
                              className="text-primary mx-2 cursor-pointer"
                              onClick={() => handleEditCommande(commande)}
                            />
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="text-secondary text-lg mx-2 cursor-pointer"
                              onClick={() => handleDeleteCommande(commande.id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
