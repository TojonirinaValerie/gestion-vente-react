import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faBars,
  faChartSimple,
  faCheese,
  faDatabase,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NavigationRoutes from "../../NavigationRoutes";

interface MenuItemProps {
  url: string;
  icon: IconDefinition;
  label: string;
  isActive: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ url, icon, label, isActive }) => {
  return (
    <p className=" p-3 hover:bg-greyLight">
      <Link
        to={url}
        className={`flex flex-row text-md hover:text-accent
        hover:scale-[1.1] hover:translate-x-3 transition-all
        ${isActive && " text-accent "}
        `}
      >
        <span className="mr-3">
          <FontAwesomeIcon icon={icon} className="" />
        </span>
        <span className="font-[600]">{label}</span>
      </Link>
    </p>
  );
};

const Navbar = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const tab = pathname.substring(1).split("/");
    setActive(`/${tab[0]}`);
  }, [pathname]);
  return (
    <div className="flex flex-row justify-between items-center px-6 py-2 bg-primary border">
      <p className=" flex flex-row items-center">
        {/* <img src={LogoImage} alt="" className="w-[40px]" /> */}
        <span className="text-xl text-white font-bold">Tsenantsika</span>
      </p>
      <div className="flex flex-row">
        <div className="flex flex-row relative mr-3">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute text-primary h-[18px] top-2 left-2"
          />
          <input
            type="text"
            placeholder="Recherche"
            className="bg-white m-0 px-2 pl-10 py-1 box-border text-md w-full border-none w-[300px] rounded-[4px]
            focus:ring-0 placeholder:text-grey2"
          />
        </div>
        <div className="mx-4">
          <Menu width={200} shadow="md" position="bottom-end">
            <Menu.Target>
              <FontAwesomeIcon icon={faBars} className="text-white h-[30px] cursor-pointer" />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={() => (
                  <MenuItem
                    label="Commande"
                    icon={faDatabase}
                    url={NavigationRoutes.COMMNADE}
                    isActive={active === NavigationRoutes.COMMNADE}
                  />
                )}
              />
              <Menu.Item
                component={() => (
                  <MenuItem
                    label="Produit"
                    icon={faCheese}
                    url={NavigationRoutes.PRODUIT}
                    isActive={active === NavigationRoutes.PRODUIT}
                  />
                )}
              />
              <Menu.Item
                component={() => (
                  <MenuItem
                    label="Statistique"
                    icon={faChartSimple}
                    url={NavigationRoutes.STATISTIQUE}
                    isActive={active === NavigationRoutes.STATISTIQUE}
                  />
                )}
              />
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
