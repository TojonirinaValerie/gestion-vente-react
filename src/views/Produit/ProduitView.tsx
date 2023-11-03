import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { ProduitAttribut, ProduitDataCreate } from "../../types/Produit";
import { createProduit, deleteProduit, getAllProduit, updateProduit } from "../../api/produit";
import { errorToast, successToast } from "../../utils/toast";
import { ToastContainer } from "react-toastify";
import { LoadingOverlay, Modal, Pagination } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toLocalString } from "../../utils/formatNumber";
import moment from "moment";
import { PaginationType } from "../../types/Pagination";
import { useDisclosure } from "@mantine/hooks";
import { Emoji } from "emoji-picker-react";

const ProduitScreen = () => {
  // ------------------------------------Variables------------------------------------------
  const [listProduit, setListProduit] = useState<ProduitAttribut[]>([]);
  const [loadingProduit, setLoadingProduit] = useState<boolean>(false);

  const [value, setValue] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>();

  const [listWithFilter, setListWithFilter] = useState<ProduitAttribut[]>([]);
  const [showListProduit, setShowListProduit] = useState<ProduitAttribut[]>([]);

  const [limit, setLimit] = useState<number>(40);

  const [opened, { open, close }] = useDisclosure(false);

  const [produit, setproduit] = useState<ProduitDataCreate>({
    designation: "",
    prixAchat: "",
    prixVente: ""
  });
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);

  const [editProduit, setEditProduit] = useState<ProduitAttribut>();

  const [produitToDelete, setProduitToDelete] = useState<ProduitAttribut>();
  // --------------------------------------------------------------------------------------

  const getAllProduitApiCall = async () => {
    setLoadingProduit(true);
    try {
      const response = await getAllProduit();
      const result = response.data.data;
      setListProduit(response.data.data);
    } catch (error: any) {
      errorToast(error.reponse?.data.message || undefined);
    } finally {
      setLoadingProduit(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    console.log("mandalo ato");

    if (value === "") {
      setListWithFilter(listProduit);
    } else {
      const newlist = listProduit.filter(item => item.designation.includes(value));
      setListWithFilter(newlist);
    }
  }, [value, listProduit]);

  useEffect(() => {
    console.log(listWithFilter);

    const pagination: PaginationType = {
      totalRow: listWithFilter.length,
      limit,
      page: 1,
      totalPage: Math.ceil(listWithFilter.length / limit)
    };
    setPagination(pagination);
  }, [listWithFilter]);

  useEffect(() => {
    getAllProduitApiCall();
  }, []);

  const handlePageChange = (page: number) => {
    if (pagination) {
      setPagination({
        ...pagination,
        page
      });
    }
  };

  const paginateListProduit = (itemsPerPage: number, currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = listWithFilter.slice(startIndex, startIndex + itemsPerPage);
    return pageItems;
  };

  useEffect(() => {
    if (pagination) {
      setShowListProduit(paginateListProduit(pagination.limit, pagination.page));
    }
  }, [pagination]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    const price = e.target.value;

    if (/^\d*$/.test(price)) {
      setproduit({ ...produit, [target]: price });
    }
  };

  const calculPriceWithPercent = (prixInitial: number, percent: number) => {
    return prixInitial + prixInitial * (percent / 100);
  };

  const handleCreateProduit = async () => {
    setIsLoadingCreate(true);
    try {
      const response = await createProduit(produit);
      successToast(response.data.message);
      close();
    } catch (error: any) {
      errorToast(error.response?.data.message);
    } finally {
      setIsLoadingCreate(false);
      getAllProduitApiCall();
    }
  };

  const handleEditProduit = (produit: ProduitAttribut) => {
    setproduit({
      designation: produit.designation,
      prixAchat: produit.prixAchat.toString(),
      prixVente: produit.prixVente.toString()
    });
    setEditProduit(produit);
    open();
  };

  const handleCloseModal = () => {
    setproduit({
      designation: "",
      prixAchat: "",
      prixVente: ""
    });
    setEditProduit(undefined);
    close();
  };

  const handleUpdateProduit = async () => {
    if (editProduit) {
      setIsLoadingCreate(true);
      try {
        const response = await updateProduit(editProduit?.id, produit);
        successToast(response.data.message);
        close();
      } catch (error: any) {
        errorToast(error.response?.data.message);
      } finally {
        setIsLoadingCreate(false);
        getAllProduitApiCall();
      }
    }
  };

  const handleDestroyProdui = async () => {
    if (produitToDelete) {
      setIsLoadingCreate(true);
      try {
        const response = await deleteProduit(produitToDelete.id);
        successToast(response.data.message);
        modalConfirmDeleteControl[1].close();
      } catch (error: any) {
        errorToast(error.response?.data.message);
      } finally {
        setIsLoadingCreate(false);
        getAllProduitApiCall();
      }
    }
  };

  const handleClickDelete = (produit: ProduitAttribut) => {
    setProduitToDelete(produit);
    modalConfirmDeleteControl[1].open();
  };

  const handleCloseConfirmModal = () => {
    setProduitToDelete(undefined);
    modalConfirmDeleteControl[1].close();
  };

  const modalConfirmDeleteControl = useDisclosure(false);
  return (
    <div className="flex flex-col w-full min-h-screen">
      <ToastContainer />
      <LoadingOverlay
        visible={loadingProduit || isLoadingCreate}
        zIndex={1000}
        overlayBlur={2}
        overlayColor="#222222"
        overlayOpacity={0.2}
      />
      <Modal
        opened={modalConfirmDeleteControl[0]}
        onClose={modalConfirmDeleteControl[1].close}
        closeOnClickOutside={false}
        withCloseButton={false}
        centered
      >
        <div className="w-full flex flex-col items-center">
          <h1 className="text-[1.5rem] font-bold">Confirmation</h1>
          <p className="text-lg text-center my-4 mb-6">
            Voulez-vous vraiment supprimer le produit "{produitToDelete?.designation}" ?
          </p>
          <div className="w-full flex flex-row">
            <button
              className="flex-1 cursor-pointer bg-grey1 text-primary w-full py-2 text-md rounded-[4px] transition-all mr-1
              disabled:cursor-default hover:bg-grey2"
              onClick={handleCloseConfirmModal}
            >
              Annuler
            </button>
            <button
              className="flex-1 cursor-pointer bg-error text-white w-full py-2 text-md rounded-[4px] transition-all ml-1
              disabled:cursor-default hover:bg-secondary"
              onClick={handleDestroyProdui}
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        withCloseButton={false}
        title={
          <h1 className="text-[1.5rem] font-bold">
            {editProduit ? "Modification" : "Nouveau produit"}
          </h1>
        }
        centered
      >
        <div className="w-full flex flex-col">
          <p className="text-lg">Entrer les détails du produits</p>
          <div className="mt-2 w-full flex flex-col mb-3">
            <div className="flex flex-row items-center mt-2">
              <span className="w-[100px] min-w-[100px] text-md mr-2">Désignation :</span>
              <input
                type="text"
                placeholder="(ex: Mon produit GM)"
                value={produit.designation}
                className="bg-background text-sm m-0 px-2 py-2 border-[1px] border-grey1 box-border leading-none w-full rounded-[3px]
                      focus:ring-0 placeholder:text-grey2"
                onChange={e => setproduit({ ...produit, designation: e.target.value })}
              />
            </div>
            <div className="flex flex-row items-center mt-2">
              <span className="w-[100px] min-w-[100px] text-md mr-2">Prix d'achat : </span>
              <input
                type="text"
                placeholder="(en Ariary)"
                value={produit.prixAchat}
                className="bg-background text-sm m-0 px-2 py-2 border-[1px] border-grey1 box-border leading-none w-full rounded-[3px]
                      focus:ring-0 placeholder:text-grey2"
                onChange={e => handlePriceChange(e, "prixAchat")}
              />
            </div>
            <div className="flex flex-row items-center mt-2">
              <span className="w-[100px] min-w-[100px] text-md mr-2">Prix de vente : </span>
              <input
                type="text"
                placeholder="(en Ariary)"
                value={produit.prixVente}
                className="bg-background text-sm m-0 px-2 py-2 border-[1px] border-grey1 box-border leading-none w-full rounded-[3px]
                      focus:ring-0 placeholder:text-grey2"
                onChange={e => handlePriceChange(e, "prixVente")}
              />
            </div>
            {produit.prixAchat !== "" && (
              <p className="mt-6 mb-2 text-accent">
                Prix avec 10% de benefice ={" "}
                {toLocalString(Math.round(calculPriceWithPercent(Number(produit.prixAchat), 10)))}{" "}
                Ar
              </p>
            )}
          </div>
          <div className="flex flex-row">
            <button
              className="flex-1 cursor-pointer bg-grey1 text-primary w-full py-2 text-md rounded-[4px] transition-all mr-1
              disabled:cursor-default hover:bg-grey2"
              onClick={handleCloseModal}
            >
              Annuler
            </button>
            <button
              className="flex-1 cursor-pointer bg-primary text-white w-full py-2 text-md rounded-[4px] transition-all ml-1
              disabled:cursor-default hover:bg-accent"
              onClick={editProduit ? handleUpdateProduit : handleCreateProduit}
            >
              {editProduit ? "Modifier" : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col w-full h-full ">
        <Navbar />
        <div className="w-full h-full bg-background ">
          <div className="flex flex-col w-full px-4 py-4">
            <div className="flex flex-row">
              <div className="flex flex-col justify-center flex-1 mx-4 p-6 py-2 items-strech bg-white rounded-[10px] border-[1px] border-grey1">
                <div className="flex flex-col py-2">
                  <div className="flex flex-row justify-between">
                    <h2 className="text-lg font-[600]">
                      Nombre total des produits : {listProduit.length}
                    </h2>
                    <div>
                      <button
                        className="cursor-pointer bg-accent text-white py-2 px-4 text-md rounded-[4px] transition-all
                            hover:bg-accent-dark disabled:bg-primary-50 disabled:cursor-default"
                        onClick={() => open()}
                      >
                        Ajouter un nouveau produit
                      </button>
                    </div>
                  </div>
                  <span className="text-md mr-2 my-1">Rechercher un produit :</span>
                  <input
                    type="text"
                    placeholder="Recherche"
                    value={value}
                    onChange={handleSearch}
                    className="bg-background text-sm m-0 px-2 py-2 my-1 border-[1px] border-grey1 box-border leading-none w-full rounded-[3px]
                      focus:ring-0 placeholder:text-grey2"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row justify-between items-end mx-4 my-2">
              <div>
                <h2 className="text-lg font-[600]">Liste des produits : {listWithFilter.length}</h2>
              </div>
              <div className="mr-8 flex flex-row items-center border ng-white p-2 px-6 rounded-[4px] bg-white border-grey1 cursor-pointer">
                <FontAwesomeIcon icon={faSliders} className="text-lg" />
                <span className="text-lg ml-3">Filtre</span>
              </div>
            </div>
            {pagination && (
              <div className="w-full mx-4 ">
                <Pagination
                  value={pagination.page}
                  onChange={handlePageChange}
                  total={pagination.totalPage}
                  siblings={2}
                  boundaries={2}
                />
              </div>
            )}
            <div className="flex flex-col justify-center flex-1 mx-4 p-6 py-6 my-2 items-strech bg-white rounded-[10px] border-[1px] border-grey1">
              {showListProduit.length === 0 && (
                <div className="flex flex-row justify-center items-center w-full my-2 mx-2">
                  <Emoji unified="1f622" />
                  <p className="text-lg font-bold mx-1">Aucun resultat</p>
                  <Emoji unified="1f622" />
                </div>
              )}
              {showListProduit.length !== 0 && (
                <table className="home-table">
                  <thead>
                    <th className="desigantion-col py-2">Produits</th>
                    <th className="prix-achat-col">Prix d'achat</th>
                    <th className="prix-u-col">Prix de vente</th>
                    <th className="date-add-col ">Date d'ajout</th>
                    <th className="date-edit-col ">Dernier modification</th>
                    <th className="action-col"></th>
                  </thead>
                  <tbody>
                    {showListProduit.map((produit: ProduitAttribut, index) => {
                      return (
                        <tr key={produit.id}>
                          <td className={`desigantion-col ${index % 2 !== 0 && "impair"}`}>
                            {produit.designation}
                          </td>
                          <td className={`prix-achat-col  ${index % 2 !== 0 && "impair"}`}>
                            {toLocalString(Math.round(produit.prixAchat))} Ar
                          </td>
                          <td className={`prix-u-col ${index % 2 !== 0 && "impair"}`}>
                            {toLocalString(Math.round(produit.prixVente))} Ar
                          </td>
                          <td className={`date-add-col ${index % 2 !== 0 && "impair"}`}>
                            {produit.createdAt &&
                              moment(new Date(produit.createdAt)).format("DD/MM/YYYY à HH:mm")}
                          </td>
                          <td className={`date-edit-col ${index % 2 !== 0 && "impair"}`}>
                            {produit.updatedAt &&
                              moment(new Date(produit.updatedAt)).format("DD/MM/YYYY à HH:mm")}
                          </td>
                          <td className={`action-col ${index % 2 !== 0 && "impair"}`}>
                            <FontAwesomeIcon
                              icon={faPencil}
                              className="text-primary mx-2 cursor-pointer"
                              onClick={() => handleEditProduit(produit)}
                            />
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="text-secondary text-lg mx-2 cursor-pointer"
                              onClick={() => handleClickDelete(produit)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduitScreen;
