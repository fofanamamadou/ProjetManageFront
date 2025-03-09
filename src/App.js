// src/App.js
import 'antd/dist/reset.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Deconnexion } from './pages/deconnexion';
import Header from './pages/header';
import SidebarComponent from "./pages/sidebarComponent";
import Categorie from './pages/categorie';
import Article from './pages/article';
import Connexion from './pages/connexion';
import Site from './pages/site';
import Inscription from './pages/inscription';
import Gestionuser from './pages/gestionuser';
import Fournisseur from './pages/fournisseur';
import Client from './pages/client';
import Representant from './pages/representant';
import Commande from './pages/commande';
import Vente from './pages/vente';
import Unite from './pages/uniteMesure';
import Transporteur from './pages/transporteur';
import Role from './pages/role';
import Transfert from './pages/transfert';
import Retour from './pages/retour';
import HistoriqueReception from './pages/historiqueReception';
import Reception from './pages/reception';
import CommandeStockBas from './pages/commandeStockBas';


export default function App() {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    let utilisateur = localStorage.getItem("utilisateur");

    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

    useEffect(() => {
        if (window.location.pathname !== "/connexion" && utilisateur === null) {
          navigate('/connexion');
        }
      }, []);

      return (
        <>
          {utilisateur !== null && <Header />}
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {utilisateur !== null && (
              <SidebarComponent collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
            )}
            <div
              style={{
                flex: 1,
                padding: '20px',
                paddingTop: '80px', // Espace sous le Header pour le contenu
                paddingLeft: isSidebarCollapsed ? "80px" : "250px", // Ajustement selon la largeur du Sidebar
                transition: "padding-left 0.2s ease-in-out", // Animation fluide
              }}
            >
              <Routes>
                <Route path="/commande" element={<Commande />} />
                <Route path="/commandeStockBas" element={<CommandeStockBas />} />
                <Route path="/reception" element={<Reception />} />
                <Route path="/deconnexion" element={<Deconnexion />} />
                <Route path="/site" element={<Site />} />
                <Route path="/client" element={<Client />} />
                <Route path="/vente" element={<Vente />} />
                <Route path="/gestionuser" element={<Gestionuser />} />
                <Route path="/categorie" element={<Categorie />} />
                <Route path="/fournisseur" element={<Fournisseur />} />
                <Route path="/article" element={<Article />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/representant" element={<Representant />} />
                <Route path="/uniteMesure" element={<Unite />} />
                <Route path="/transporteur" element={<Transporteur />} />
                <Route path="/role" element={<Role />} />
                <Route path="/transfert" element={<Transfert />} />
                <Route path="/retour" element={<Retour />} />
                <Route path="/historiqueReception" element={<HistoriqueReception />} />
              </Routes>
            </div>
          </div>
        </>
      );
      
}