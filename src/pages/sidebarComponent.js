import React, { useState } from "react";
import { Layout, Menu, Button, Switch } from "antd";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  IdcardOutlined,
  DropboxOutlined,
  ContainerOutlined,
  ArrowRightOutlined,
  ProfileOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  UndoOutlined,
  TeamOutlined,
  TagsOutlined,
  ShoppingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

export default function SidebarComponent({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("1");
  const [theme, setTheme] = useState("light"); // Gestion du thème (sombre ou clair)

  const toggleTheme = (checked) => {
    setTheme(checked ? "light" : "dark");
  };

  const onClick = (e) => {
    if (e.key === "/deconnexion") {
      localStorage.clear();
      navigate("/connexion");
      window.location.reload();
    } else {
      setCurrent(e.key);
      navigate(e.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      theme={theme}
      style={{
        position: "fixed",
        left: 0,
        top: 60, // Décale sous le header
        bottom: 0,
        height: "calc(100vh - 60px)", // Ajuste pour éviter de dépasser l’écran
        overflow: "auto",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        borderRight: theme === "light" ? "1px solid #f0f0f0" : "none",
        zIndex: 1000, // Inférieur au header mais toujours au-dessus du contenu
      }}
    >
      {/* Bouton de toggle */}
      <Button
        type="text"
        onClick={onToggle}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        style={{
          fontSize: "18px",
          width: "100%",
          padding: "10px",
          textAlign: "left",
          backgroundColor: theme === "light" ? "#f0f2f5" : "#001529",
          borderBottom: "1px solid #f0f0f0",
          color: theme === "light" ? "#000" : "#fff",
        }}
      />

      {/* Bascule de thème */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Switch
          checked={theme === "light"}
          onChange={toggleTheme}
          checkedChildren="☀️"
          unCheckedChildren="🌙"
        />
      </div>

      {/* Menu principal */}
      <Menu
        mode="inline"
        selectedKeys={[current]}
        onClick={onClick}
        style={{
          height: "100%",
          borderRight: "none",
        }}
        theme={theme}
      >
        <Menu.SubMenu key="sub1" icon={<TagsOutlined />} title="Gestion des Catégories">
          <Menu.Item key="/categorie" icon={<AppstoreOutlined />}>
            Catégorie de Produits
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="sub2" icon={<ShoppingOutlined />} title="Gestion des Clients et des Ventes">
          <Menu.Item key="/vente" icon={<ShoppingCartOutlined />}>
            Gestion des Ventes
          </Menu.Item>
          <Menu.Item key="/client" icon={<IdcardOutlined />}>
            Gestion des Clients
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="sub3" icon={<DropboxOutlined />} title="Gestion des Articles">
          <Menu.Item key="/article" icon={<ContainerOutlined />}>
            Articles
          </Menu.Item>
          <Menu.Item key="/transfert" icon={<ArrowRightOutlined />}>
            Transfert
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="sub4" icon={<ProfileOutlined />} title="Gestion des Commandes">
          <Menu.Item key="/commande" icon={<FileTextOutlined />}>
            Commandes
          </Menu.Item>
          <Menu.Item key="/commandeStockBas" icon={<ExclamationCircleOutlined />}>
            Commander les articles à stock bas
          </Menu.Item>
          <Menu.Item key="/reception" icon={<DownloadOutlined />}>
            Réception
          </Menu.Item>
          <Menu.Item key="/historiqueReception" icon={<ClockCircleOutlined />}>
            Historique de Réception
          </Menu.Item>
          <Menu.Item key="/retour" icon={<UndoOutlined />}>
            Retour Stock
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="/gestionuser" icon={<TeamOutlined />}>
          Gestion des Utilisateurs
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
