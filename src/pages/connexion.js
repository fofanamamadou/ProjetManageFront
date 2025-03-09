import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

function Copyright() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      Copyright © Votre Site {new Date().getFullYear()}
    </div>
  );
}

export default function Connexion() {
  const navigate = useNavigate();
  const [affichage, modifier] = useState({ email: "", mot_de_passe: "" });
  const [chargement, setChargement] = useState(false);
  const token = btoa(affichage.email.trim() + ":" + affichage.mot_de_passe.trim());
  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Basic " + token
  };

  const seconnecter = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!affichage.email) return message.error("Saisissez votre adresse email.");
    else if (!emailRegex.test(affichage.email)) return message.error("Format d'email invalide.");
    else if (!affichage.mot_de_passe) return message.error("Saisissez votre mot de passe.");
    else {
      setChargement(true);
      axios.get("http://localhost:8080/auth/login", {headers}).then(
        
        (success) => {
          console.log(success);
          message.success("Connexion réussie !");
          localStorage.setItem("token", token);
          localStorage.setItem("utilisateur", JSON.stringify(success.data));
          navigate("/");
          window.location.reload();
          setChargement(false);
        },
        (error) => {
          console.log("error: " + error);
          setChargement(false);
          if (error.response && error.response.status === 401) {
            message.error("Identifiants incorrects.");
          } else {
            message.error("Une erreur est survenue. Veuillez réessayer.");
          }

        }
    
    )
  }
}


  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center", padding: 20, boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: 8 }}>
      <h1>Connexion</h1>
      <form onSubmit={seconnecter}>
        <Input
          prefix={<MailOutlined />}
          placeholder="Adresse email"
          value={affichage.email}
          onChange={(e) => modifier({ ...affichage, email: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mot de passe"
          value={affichage.mot_de_passe}
          onChange={(e) => modifier({ ...affichage, mot_de_passe: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={chargement}
        >
          Connexion
        </Button>
      </form>
      <p style={{ marginTop: "16px" }}>
        Pas encore inscrit ?{" "}
        <a
          onClick={() => navigate("/inscription")}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          Creer un compte.
        </a>
        </p>
      <Copyright />
    </div>
  );
}
