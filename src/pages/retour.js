import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, DatePicker, Divider, Form, InputNumber, Row, Select, Space, Table,message,Spin,Input, Modal} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const { Option } = Select;

export default function Reception()  {
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

      const handleReception = () => {
        setLoading(true);
      
        let numerosuivi = null;
      
        if (modeCommande) {
          numerosuivi = selectedCommande?.numerosuivi;
        } else if (modeArticle) {
          // Vérifier si tous les articles ont le même numéro de suivi
          const uniqueNumeros = [...new Set(articles.map(article => article.numerosuivi))];
      
          if (uniqueNumeros.length === 1) {
            numerosuivi = uniqueNumeros[0]; // 🔥 Utiliser le numéro de suivi de la commande liée
          } else {
            messageApi.error("Les articles sélectionnés proviennent de commandes différentes !");
            setLoading(false);
            return;
          }
        }
      
        if (!numerosuivi) {
          messageApi.error("Impossible de récupérer le numéro de suivi !");
          setLoading(false);
          return;
        }
      
        const receptionData = {
          numerosuivi,
          articles: articles.map((article) => ({
            id: article.id,
            quantite_recue: article.quantite_recue
          }))
        };
      
        console.log("Données envoyées pour réception :", JSON.stringify(receptionData, null, 2));
      
        axios.post("http://localhost:8080/anonyme/commande/reception", receptionData, { headers })
          .then((success) => {
            messageApi.success("Réception enregistrée avec succès");
            setSelectedCommande(null);
            setSelectedFournisseur(null);
            setArticles([]);
            setLoading(false);
            setIsModalVisible(false);
            listReception();
          })
          .catch((error) => {
            console.error("Erreur lors de la réception :", error);
            messageApi.error("Échec de l'enregistrement de la réception");
            setLoading(false);
          });
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
                code_barre: ligne.articles.code_barre,
                site: commande.sites.nom,
                quantite: ligne.quantite_commandee,
                quantite_recue:ligne.quantite_commandee,
                prix: ligne.prix_achat
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
    
      axios.get(`http://localhost:8080/anonyme/articles/fournisseur/${fournisseurId}/expedies`, { headers })
        .then((success) => {
          console.log("Données reçues du fournisseur :", success.data);
    
          const articlesFiltres = success.data.map((ligne) => ({
            id: ligne.articles.id,
            description: ligne.articles.description,
            code_barre: ligne.articles.code_barre,
            site: ligne.articles.site,
            quantite: ligne.quantite_commandee,
            quantite_recue: 0,
            prix: ligne.prix_achat,
            numerosuivi: ligne.numerosuivi  //  Maintenant récupéré depuis le backend
          }));
    
          setArticlesDisponibles(articlesFiltres);
        })
        .catch((error) => {
          console.log("Erreur lors du chargement des articles du fournisseur", error);
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
    
  
    const columns = [
      {
        title: "Article",
        dataIndex: "id",
        key: "id",
        render: (_, record, index) => {
          if (modeCommande) {
            //  Affichage sous forme de texte lorsque modeCommande est activé
            return `${record.code_barre || "N/A"} - ${record.description || "Article inconnu"}`;
          } else {
            //  Affichage sous forme de Select pour modeFournisseur
            return (
              <Select
                placeholder="Sélectionner un article"
                value={record.id}
                onChange={(value) => {
                  const article = articlesDisponibles.find((art) => art.id === value);
                  const newArticles = [...articles];
                  newArticles[index] = {
                    ...article,
                    quantite_recue: 0
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
      { title: "Commandé", dataIndex: "quantite", key: "quantite" },
      {
        title: "Qté reçue",
        dataIndex: "quantite_recue",
        key: "quantite_recue",
        render: (_, record, index) => {
          if (modeCommande) {
            //  Affichage sous forme de texte lorsque modeCommande est activé
            return `${record.quantite || 0}`;
          } else {
            //  Affichage sous forme de Select pour modeFournisseur
            return (
          <InputNumber
            min={0}
            max={record.quantite}
            value={record.quantite_recue}
            onChange={(value) => {
              if (value > record.quantite) {
                message.warning("La quantité reçue ne peut pas dépasser la quantité commandée !");
                return;
              }
              const newArticles = [...articles];
              newArticles[index].quantite_recue = value;
              setArticles(newArticles);
            }}
          />
            )
          }
      },
      },      
      { title: "Coût unitaire", dataIndex: "prix", key: "prix" },     
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

    const columnsReceptions = [
      {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
      },
      {
          title: 'Adresse expedition',
          dataIndex: 'adresse_expedition',
          key: 'adresse_expedition',
      },
      {
          title: 'Adresse de facturation',
          dataIndex: 'adresse_facturation',
          key: 'adresse_facturation',
      },
      {
          title: 'Numero de suivi',
          dataIndex: 'numerosuivi',
          key: 'numerosuivi',
      }
      ];
  
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ color: '#1890ff' }}>Gestion des receptions</h1>
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
            title={"Receptionner une commande"}
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
                    onClick={handleReception}
                    disabled={articles.length === 0}
                >
                    {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Receptionner"}
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
        <h3>Liste des Receptions</h3>
        <Spin spinning={loadingTable}>
            <Table dataSource={reception} columns={columnsReceptions} rowKey="id" />
        </Spin> 
      </div>
    );
  };
