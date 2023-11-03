import { Navigate, Route, Routes } from "react-router-dom";
import NavigationRoutes from "./NavigationRoutes";
import HomeScreen from "./views/Home/Home";
import ProduitScreen from "./views/Produit/ProduitView";
import StatistiqueScreen from "./views/Statistique/StatistiqueScreen";

const Router = () => {
  return (
    <>
      <Routes>
        <Route
          path={NavigationRoutes.ACCUEIL}
          element={<Navigate to={NavigationRoutes.COMMNADE} replace={true} />}
        />
        <Route path={NavigationRoutes.COMMNADE} element={<HomeScreen />} />
        <Route path={NavigationRoutes.PRODUIT} element={<ProduitScreen />} />
        <Route path={NavigationRoutes.STATISTIQUE} element={<StatistiqueScreen />} />
      </Routes>

      {/* <Preloader /> */}
    </>
  );
};

export default Router;
