import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./header.css";
import LOGOISPATEC from "./logoispatec.png";

export default function Header() {
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate("/connexion");
    window.location.reload();
  };

  // Menu déroulant pour le compte utilisateur
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handleLogout}>
        <span>Déconnexion</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="navbar" >
      <div className="navbar-container">
        {/* Logo et Nom de l'entreprise */}
        <div className="navbar-logo">
          <img src={LOGOISPATEC} alt="Logo" />
          <span className="navbar-company-name">ISPATEC</span>
        </div>

        {/* Menu de navigation */}
        <nav className="navbar-menu">
          <ul>
            <li>
              <Link to="/categorie">Catégories</Link>
            </li>
            <li>
              <Link to="/site">Sites</Link>
            </li>
            <li>
              <Link to="/fournisseur">Fournisseurs</Link>
            </li>
            <li>
              <Link to="/client">Clients</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
          </ul>
        </nav>

        {/* Informations de l'utilisateur */}
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <div className="navbar-user">
            <Avatar
              style={{ backgroundColor: "#87d068", marginRight: "10px" }}
              icon={<UserOutlined />}
            >
            </Avatar>
            <DownOutlined style={{ marginLeft: "5px" }} />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
