import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, DatePicker, Divider, Form, InputNumber, Row, Select, Space, Table,message,Spin,Input, Modal} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const { Option } = Select;

export default function Retour()  {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [modeArticle, setModeArticle] = useState(false);
    const [modeCommande, setModeCommande] = useState(false);
    const [selectedFournisseur, setSelectedFournisseur] = useState(null);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [loadingTable, setLoadingTable] = useState(false);
    const [articles, setArticles] = useState([]);
    const [reception, setReception] = useState([]);
    const [retour, setRetour] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [articlesDisponibles, setArticlesDisponibles] = useState([]);


    const headers = {
      "Content-Type": "application/json",
      'Authorization': "Basic " + localStorage.getItem("token")
    };

    const handleApiError = () => {
      messageApi.error("Erreur survenu.");
  }

    useEffect(() => {
      listCommande();
      listFournisseur();
      listReception();
      listRetour();
      document.title = "Reception";
  }, []);




    const showAddModal = () => {
      form.resetFields(); // Réinitialiser le formulaire
      setIsModalVisible(true);
    };

    const listCommande = () => {
      setLoadingTable(true);
      axios.get("http://localhost:8080/anonyme/commande/expediee",{headers}).then(
          (success) => {
            console.log("Données envoyées : ", JSON.stringify(success.data, null, 2));
              setCommandes(success.data);
              setLoadingTable(false);
          },
          (error) => {
              console.log(error);
              handleApiError();
              setLoadingTable(false);
          }
      );
  };
    const listFournisseur = () => {
      setLoadingTable(true);
      axios.get("http://localhost:8080/anonyme/fournisseur",{headers}).then(
          (success) => {
            console.log("Données envoyées : ", JSON.stringify(success.data, null, 2));
              setFournisseurs(success.data);
              setLoadingTable(false);
          },
          (error) => {
              console.log(error);
              handleApiError();
              setLoadingTable(false);
          }
      );
  };

    const listReception = () => {
      setLoadingTable(true);
      axios.get("http://localhost:8080/anonyme/commande/recue",{headers}).then(
          (success) => {
              console.log("Données envoyées : ", JSON.stringify(success.data, null, 2));
              setReception(success.data);
              setLoadingTable(false);
          },
          (error) => {
              console.log(error);
              setLoadingTable(false);
          }
      );
  };
    const listRetour = () => {
      setLoadingTable(true);
      axios.get("http://localhost:8080/anonyme/retour",{headers}).then(
          (success) => {
              console.log("Données envoyées : ", JSON.stringify(success.data, null, 2));
              setRetour(success.data);
              setLoadingTable(false);
          },
          (error) => {
              console.log(error);
              setLoadingTable(false);
          }
      );
  };

      const handleRetour = () => {
        setLoading(true);

        if (modeCommande) {
          if (!selectedCommande) {
            messageApi.error("Veuillez sélectionner une commande !");
            setLoading(false);
            return;
          }
        }

      
        
      
        //  Vérifier s'il y a au moins un article retourné
        const articlesRetours = articles.filter((art) => art.quantite_retournee > 0);
        if (articlesRetours.length === 0) {
          messageApi.error("Veuillez sélectionner au moins un article à retourner !");
          setLoading(false);
          return;
        }
      
        //  Vérifier que le fournisseur existe
        if (!selectedCommande.fournisseurs || !selectedCommande.fournisseurs.id) {
          messageApi.error("Fournisseur invalide !");
          setLoading(false);
          return;
        }
      
        const retourData = {
          date_retour: new Date().toISOString().split("T")[0], // Date du jour
          commande_id: selectedCommande.id,
          fournisseur_id: selectedCommande.fournisseurs.id,
          articles: articlesRetours,
        };
      
        console.log("Données envoyées pour retour :", retourData);
      
        axios.post("http://localhost:8080/anonyme/retour", retourData, { headers })
          .then(() => {
            messageApi.success("Retour enregistré avec succès !");
            setSelectedCommande(null);
            setArticles([]);
            setIsModalVisible(false);
            listRetour();
          })
          .catch((error) => {
            console.error("Erreur lors du retour :", error);
            messageApi.error("Échec de l'enregistrement du retour");
          })
          .finally(() => setLoading(false));
      };
      
    
    
      //  Gestion des modes avec réinitialisation des selects
      const handleToggleMode = (mode) => {
        if (mode === "article") {
            setModeArticle(!modeArticle);
            setModeCommande(false);
            setSelectedCommande(null);
            setSelectedFournisseur(null); 
            setArticles([]);
        } else if (mode === "commande") {
            setModeCommande(!modeCommande);
            setModeArticle(false);
            setSelectedCommande(null);
            setSelectedFournisseur(null); 
            setArticles([]);
        }
    };
   
  
    const handleSelectCommande = (commandeId) => {
      axios.get(`http://localhost:8080/anonyme/commande/${commandeId}`, { headers }).then(
        (success) => {
          const commande = success.data;
          setSelectedCommande(commande);
          setArticles(
            commande.ligneCommandes
              .filter((ligne) => ligne.statut === "En attente") //  Filtrer uniquement les articles des commandes en attente
              .map((ligne) => ({
                id: ligne.articles.id,
                description: ligne.articles.description,
                quantite_commandee: ligne.quantite_commandee,
                quantite_recue: ligne.quantite_recue,
                quantite_retournee: 0, // Initialisation
                raison_retour: "",
                etat: "Neuf",
              }))
          );
        },
        (error) => {
          console.log("Erreur lors du chargement de la commande", error);
        }
      );
    };
    
    

    const handleSelectFournisseur = (fournisseurId) => {
      setSelectedFournisseur(fournisseurId);
      setArticlesDisponibles([]); // Réinitialise avant de charger les nouveaux articles
    
      axios.get(`http://localhost:8080/anonyme/articles/fournisseur/${fournisseurId}/retours`, { headers })
        .then((success) => {
          console.log("Données reçues du fournisseur :", success.data);
    
          if (success.data.length === 0) {
            message.warning("Aucun article disponible pour un retour.");
          }
    
          const articlesFiltres = success.data.map((ligne) => ({
            id: ligne.articles.id,
            description: ligne.articles.description,
            code_barre: ligne.articles.code_barre,
            site: ligne.articles.site,
            quantite_commandee: ligne.quantite_commandee, // Ajout de cette info pour clarté
            quantite_recue: ligne.quantite_recue, // Maintenant bien renseigné
            prix: ligne.prix_achat,
            numerosuivi: ligne.numerosuivi, 
            quantite_retournee: 0, // Initialise à 0
            raison_retour: "", // Initialise vide
            etat: "Neuf" // Par défaut
          }));
    
          setArticlesDisponibles(articlesFiltres);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des articles du fournisseur :", error);
          message.error("Impossible de charger les articles disponibles pour un retour.");
        });
    };
    
    
    
    
    
    
    
  
    const handleAddArticle = () => {
      setArticles([
        ...articles,
        { 
          id: null, 
          description: "", 
          site: "", 
          quantite: 1, 
          quantite_recue: 0, 
          prix: 0
        }
      ]);
    };
    
    
  
    const handleRemoveArticle = (index) => {
      const newArticles = [...articles];
      newArticles.splice(index, 1);
      setArticles(newArticles);
    };
    
   //Column du tableau dans le modal
   const columns = [
    {
      title: "Article",
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => {
        if (modeCommande) {
          return `${record.code_barre || "N/A"} - ${record.description || "Article inconnu"}}`;
        } else {
          return (
            <Select
              placeholder="Sélectionner un article"
              value={record.id}
              onChange={(value) => {
                const article = articlesDisponibles.find((art) => art.id === value);
                const newArticles = [...articles];
                newArticles[index] = {
                  ...article,
                  quantite_retournee: 0, // Réinitialisation de la quantité retournée
                  raison_retour: "",
                  etat: "Neuf"
                };
                setArticles(newArticles);
              }}
              style={{ width: "100%" }}
            >
              {articlesDisponibles.map((article) => (
                <Option key={article.id} value={article.id}>
                  {article.code_barre} - {article.description}
                </Option>
              ))}
            </Select>
          );
        }
      }
    },
    { title: "Site", dataIndex: "site", key: "site" },
    { title: "Numero de Suivi", dataIndex: "numerosuivi", key: "numerosuivi" },
    { title: "Commandé", dataIndex: "quantite_commandee", key: "quantite_commandee" },
    { title: "Reçu", dataIndex: "quantite_recue", key: "quantite_recue" },
  
    {
      title: "Qté retournée",
      dataIndex: "quantite_retournee",
      key: "quantite_retournee",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          max={record.quantite_commandee - record.quantite_recue} // On s'assure que ça ne dépasse pas la quantité restante
          value={record.quantite_retournee}
          onChange={(value) => {
            if (value > (record.quantite_commandee - record.quantite_recue)) {
              message.warning("La quantité retournée ne peut pas dépasser la quantité restante !");
              return;
            }
            if (value < 0) {
              message.warning("La quantité retournée ne peut pas être négative !");
              return;
            }
            const newArticles = [...articles];
            newArticles[index].quantite_retournee = value;
            setArticles(newArticles);
          }}
        />
      ),
    },
  
    {
      title: "Raison du retour",
      dataIndex: "raison_retour",
      key: "raison_retour",
      render: (_, record, index) => (
        <Input
          placeholder="Défectueux, erreur..."
          value={record.raison_retour}
          onChange={(e) => {
            const newArticles = [...articles];
            newArticles[index].raison_retour = e.target.value;
            setArticles(newArticles);
          }}
        />
      ),
    },
  
    {
      title: "État",
      dataIndex: "etat",
      key: "etat",
      render: (_, record, index) => (
        <Select
          value={record.etat}
          onChange={(value) => {
            const newArticles = [...articles];
            newArticles[index].etat = value;
            setArticles(newArticles);
          }}
        >
          <Option value="Neuf">Neuf</Option>
          <Option value="Endommagé">Endommagé</Option>
        </Select>
      ),
    },
  
    {
      title: "Actions",
      key: "actions",
      render: (_, __, index) => (
        <Button danger onClick={() => handleRemoveArticle(index)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];
  
    

    //Column des retours
    const columnsRetours = [
      {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
      },
      {
          title: 'Note',
          dataIndex: 'note',
          key: 'note',
      },
      {
          title: 'Statut',
          dataIndex: 'statut',
          key: 'statut',
      },
      {
          title: 'Date',
          dataIndex: 'date_retour',
          key: 'date_retour',
      },
      //A verifier
      { title: "Fournisseur", dataIndex: "fournisseur_nom", key: "fournisseur_nom" },
      { title: "Commande associée", dataIndex: "commande_id", key: "commande_id" },
      { title: "Note", dataIndex: "note", key: "note" },
      { title: "Statut", dataIndex: "statut", key: "statut" },
      { title: "Date", dataIndex: "date_retour", key: "date_retour" },
      ];
  
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ color: '#1890ff' }}>Gestion des retours</h1>
        {contextHolder}
         <div style={{ marginBottom: '20px' }}>
             <Space>
                 {/* Ajouter */}
                 <Button
                     type="primary"
                     icon={<PlusOutlined />}
                     onClick={showAddModal} // Ouvre le modal pour ajouter
                 />
             </Space>
         </div>
         <Modal
            title={"Effectuer un retour"}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={1150}
            footer={[
                <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                    Annuler
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleRetour}
                    disabled={articles.length === 0}
                >
                    {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Retourner"}
                </Button>,
            ]}
          >
            <Form form={form} layout="horizontal">
              <Row gutter={16}>
                <Col span={8}>
                  <Checkbox
                    checked={modeArticle}
                    onChange={() => handleToggleMode("article")}
                  >
                    Articles spécifiques
                  </Checkbox>
                  <Form.Item label="Fournisseur">
                    <Select
                      placeholder="Sélectionner un fournisseur"
                      disabled={!modeArticle}
                      value={modeArticle ? selectedFournisseur : undefined} // 🛠 Reset auto
                      onChange={handleSelectFournisseur}
                    >
                      {fournisseurs.map((four) => (
                            <Select.Option key={four.id} value={four.id}>
                                {four.nom}
                            </Select.Option>
                            ))}
                    </Select>
                  </Form.Item>
                </Col>
        
                <Col span={8}>
                  <Checkbox
                    checked={modeCommande}
                    onChange={() => handleToggleMode("commande")}
                  >
                    Commande fournisseur
                  </Checkbox>
                  <Form.Item label="Commande">
                    <Select
                      placeholder="Sélectionner une commande"
                      disabled={!modeCommande}
                      value={modeCommande ? selectedCommande?.id : undefined}
                      onChange={handleSelectCommande}
                    >
                      {commandes.map((commande) => (
                            <Select.Option key={commande.id} value={commande.id}>
                                {commande.numerosuivi}
                            </Select.Option>
                            ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
        
              <Divider>Articles</Divider>
        
              <Table
                dataSource={articles}
                columns={columns}
                rowKey={(record, index) => index}
                pagination={false}
              />
        
              {modeArticle && (
                <Button
                  type="dashed"
                  onClick={handleAddArticle}
                  style={{ width: "100%", marginTop: 16 }}
                >
                  <PlusOutlined /> Ajouter un article
                </Button>
              )}
        
              <Divider />
        
              
            </Form>
          </Modal>
        <h3>Liste des Retours</h3>
        <Spin spinning={loadingTable}>
            <Table dataSource={retour} columns={columnsRetours} rowKey="id" />
        </Spin> 
      </div>
    );
  };
