import React, { useEffect, useState } from "react";
import { Form, Input, Select, InputNumber, Button, Table, Tooltip, Divider, Row, Col, Dropdown, Menu, Modal, message,Space,Spin,Popconfirm, DatePicker, Checkbox } from "antd";
import { DownOutlined, FolderOpenOutlined, DeleteOutlined, EditOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import Fournisseur from "./fournisseur";
import { ClipLoader } from "react-spinners";
import Transporteur from "./transporteur";

const { Option } = Select;

export default function Commande  () {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsModalFour, setIsModalFour] = useState(false);
  const [IsModalTrans, setIsModalTrans] = useState(false);
  const [form] = Form.useForm();
  const [state, setState] = useState({ id: null,  date_emission: "",
  date_reception_prevue: "",
  statut: "Expédiée",
  adresse_facturation: "",
  adresse_expedition: "",
  notes_commande: "",
  numerosuivi: "",
  notes_internes: "",
  articles: [],
  fournisseur_id: null,
  site_id: null,
  transporteur_id: null});
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [fournisseur, setFournisseur] = useState([]);
  const [commande, setCommande] = useState([]);
  const [transporteur, setTransporteur] = useState([]);
  const [site, setSite] = useState([]);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [saveButtonLabel, setSaveButtonLabel] = useState("Enregistrer et impr."); // Texte dynamique du bouton d'enregistrement
  const [searchText, setSearchText] = useState("");
  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Basic " + localStorage.getItem("token")
  };


  useEffect(() => {
    listFournisseur();
    listTransporteur();
    listSite();
    listArticle();
    listCommande();
    document.title = "Commande";
}, [IsModalTrans,IsModalFour]);


  const showAddModal = () => {
    setIsEditing(false);
    setState({ id : null, date_emission: "",
      date_reception_prevue: "",
      statut: "Expédiée",
      adresse_facturation: "",
      adresse_expedition: "",
      notes_commande: "",
      numerosuivi: "",
      notes_internes: "",
      articles: [],
      fournisseur_id: null,
      site_id: null,
      transporteur_id: null}); // Réinitialiser l'état pour un nouvel ajout
    form.resetFields(); // Réinitialiser le formulaire
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({  date_emission: record.date_emission,
          date_reception_prevue: record.date_reception_prevue,
          statut: record.statut,
          adresse_facturation: record.adresse_facturation,
          adresse_expedition: record.adresse_expedition,
          notes_commande: record.notes_commande,
          numerosuivi: record.numerosuivi,
          notes_internes: record.notes_internes,
          articles: record.articles,
          fournisseur_id: record.fournisseur_id,
          site_id: record.site_id,
          transporteur_id: record.transporteur_id,
        }); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };

    const handleApiError = () => {
      messageApi.error("Erreur survenu.");
  }

  const enregistrement = () => {
    setLoading(true);
    axios.post("http://localhost:8080/anonyme/commande", state, { headers }).then(
        (success) => {
            listCommande();
            console.log("Données envoyées : ", JSON.stringify(state, null, 2));
            messageApi.success({ content: success.data, style: { color: 'green' } });
            setLoading(false);
            setIsModalVisible(false); // Fermer le modal
        },
        (error) => {
            console.log("Données envoyées : ", JSON.stringify(state, null, 2));
            console.log(error);
            handleApiError();
            setLoading(false);
        }
    );
  };
  
  
  const modifier = () => {
      setLoading(true);
      axios.put("http://localhost:8080/anonyme/commande/" + state.id, state, { headers }).then(
          (success) => {
              listArticle();
              messageApi.success("commande modifier avec succes");
              setLoading(false);
              setIsModalVisible(false); // Fermer le modal
          },
          (error) => {
              console.log(error);
              handleApiError();
              setLoading(false);
          }
      );
  };

  const handleReception = (commandeId) => {
    setLoading(true);
  
    // Vérification de la liste des commandes
    console.log("Liste des commandes disponibles :", commande);
  
    // Trouver la commande sélectionnée
    const selectedCommande = commande.find((com) => com.id === commandeId);
  
    if (!selectedCommande) {
      messageApi.error("Commande introuvable !");
      setLoading(false);
      return;
    }
  
    console.log("Commande sélectionnée :", selectedCommande);
  
    // Construire le payload correctement
    const payload = {
      numerosuivi: selectedCommande.numerosuivi,
      articles: selectedCommande.ligneCommandes.map((ligne) => ({
        id: ligne.articles.id,
        quantite_recue: ligne.quantite_commandee, // Réception de toute la quantité commandée
      })),
    };
  
    console.log("Données envoyées au backend :", JSON.stringify(payload, null, 2));
  
    // Envoyer la requête au backend
    axios
      .post("http://localhost:8080/anonyme/commande/reception", payload, { headers })
      .then((response) => {
        messageApi.success("Commande réceptionnée avec succès !");
        listCommande(); // Recharger la liste des commandes après réception
      })
      .catch((error) => {
        console.error("Erreur lors de la réception :", error);
        messageApi.error("Erreur lors de la réception !");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  

  const listCommande = () => {
    setLoadingTable(true);
    axios.get("http://localhost:8080/anonyme/commande/expediee",{headers}).then(
        (success) => {
          console.log("Données envoyées : ", JSON.stringify(success.data, null, 2));
            setCommande(success.data);
            setLoadingTable(false);
        },
        (error) => {
            console.log(error);
            handleApiError();
            setLoadingTable(false);
        }
    );
};

const suppression = (id) => {
  setLoading(true);
  axios.delete("http://localhost:8080/anonyme/commande/"+id,{headers}).then(
      (success) => {
          messageApi.success({ content: success.data });
          listCommande();
          setLoading(false);
      },
      (error) => {
          console.log(error);
          handleApiError();
          setLoading(false);
      }
  );
}



  const handleSearch = (e) => {
  setSearchText(e.target.value);
  };

  const filteredCommande = commande.filter(com => com.adresse_facturation.toLowerCase().includes(searchText.toLowerCase()));

  const columnsCommandes = [
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
  },
  {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        console.log("Données de la ligne :", record); // Log pour vérifier les données de la ligne
        return (
          <Space size="middle">
              {/* <Button
                style={{ color: "blue" }}
                icon={<EditOutlined />}
                onClick={() => showEditModal(record)}
              /> */}
              <Button
                style={{ color: "#4CAF50" }}
                icon={<InboxOutlined />}
                onClick={() => handleReception(record.id)}
              />

              <Popconfirm
                  title={`Confirmer la suppression de "${record.code_barre}" ?`}
                  onConfirm={() => suppression(record.id)}
                  okText="Oui"
                  cancelText="Non"
              >
                <Button
                danger
                icon={<DeleteOutlined />}
                />
              </Popconfirm>
          </Space>)
      },
  },
  ];

  const listFournisseur = () => {
    setLoadingTable(true);
    axios.get("http://localhost:8080/anonyme/fournisseur",{headers}).then(
        (success) => {
            setFournisseur(success.data);
            setLoadingTable(false);
        },
        (error) => {
            console.log(error);
            handleApiError();
            setLoadingTable(false);
        }
    );
  };

  const listTransporteur = () => {
    setLoadingTable(true);
    axios.get("http://localhost:8080/anonyme/transporteur",{headers}).then(
        (success) => {
            setTransporteur(success.data);
            setLoadingTable(false);
        },
        (error) => {
            console.log(error);
            handleApiError();
            setLoadingTable(false);
        }
    );
  };

  const listSite = () => {
    setLoadingTable(true);
    axios.get("http://localhost:8080/anonyme/site",{headers}).then(
        (success) => {
            console.log(state)
            setSite(success.data);
            setLoadingTable(false);
        },
        (error) => {
            console.log(error);
            handleApiError();
            setLoadingTable(false);
        }
    );
  };
  const listArticle = () => {
    setLoadingTable(true);
    axios.get("http://localhost:8080/anonyme/produit",{headers}).then(
        (success) => {
            setArticles(success.data);
            setLoadingTable(false);
        },
        (error) => {
            console.log(error);
            handleApiError();
            setLoadingTable(false);
        }
    );
  };

  // Menu pour les options d'enregistrement
  const saveMenu = (
    <Menu
      onClick={(e) => setSaveButtonLabel(e.key)} // Mise à jour du texte du bouton
    >
      <Menu.Item key="Enregistrer et impr.">Enregistrer et impr.</Menu.Item>
      <Menu.Item key="Enregistrer et envoyer par courriel">
        Enregistrer et envoyer par courriel
      </Menu.Item>
      <Menu.Item key="Enregistrer et faxer">Enregistrer et faxer</Menu.Item>
      <Menu.Item key="Enregistrer comme brouillon">
        Enregistrer comme brouillon
      </Menu.Item>
      <Menu.Item key="Enregistrer comme périodique">
        Enregistrer comme périodique
      </Menu.Item>
      <Menu.Item key="Enregistrer et afficher">
        Enregistrer et afficher
      </Menu.Item>
    </Menu>
  );

  // Ajouter un nouvel article au tableau
const handleAddArticle = () => {
  const newArticle = {
    id: null, // L'utilisateur sélectionnera l'article
    code_barre: null,
    description: null,
    prix_achat: 0, // Initialisé à 0
    quantity: 1, // Quantité initiale
    lineTotal: 0, // Total initial
  };

  setState((prevState) => {
    const updatedArticles = [...prevState.articles, newArticle];
    return {
      ...prevState,
      articles: updatedArticles,
    };
  });

};

  // Liste des IDs déjà sélectionnés
  const selectedIds = state.articles.map((row) => row.id).filter((id) => id !== null);

  
  
  
  
  
  

  // Supprimer un article
  const handleRemoveArticle = (index) => {
    setState((prevState) => {
      const updatedArticles = [...prevState.articles];
      updatedArticles.splice(index, 1); // Supprime l'article par index
  
      updateTotals(updatedArticles); // Recalcule les totaux après suppression
  
      return {
        ...prevState,
        articles: updatedArticles,
      };
    });
  };
  
  
  
  

  // Mise à jour des champs d'entrée
  const handleInputChange = (index, field, value) => {
    setState((prevState) => {
      const updatedArticles = [...prevState.articles];
      const updatedItem = { ...updatedArticles[index], [field]: value };
  
      // Réinitialiser la remise si aucun type sélectionné
      if (field === "remiseType" && !value) {
        updatedItem.remise = null;
      }
  
      // Assurer que les deux checkboxes ne sont pas sélectionnées en même temps
      if (field === "applyOnPrixAchat" && value) {
        updatedItem.applyOnTotal = false; // Désactive "Sur Total"
      }
      if (field === "applyOnTotal" && value) {
        updatedItem.applyOnPrixAchat = false; // Désactive "Sur Prix"
      }
  
      const prixAchat = parseFloat(updatedItem.prix_achat || 0);
      const quantity = parseFloat(updatedItem.quantity || 1);
      let lineTotal = prixAchat * quantity; // Mise à jour dynamique
  
      let remiseValue = parseFloat(updatedItem.remise || 0);
      let prixRemise = prixAchat;
      let totalRemise = lineTotal;
  
      if (updatedItem.remiseType) { // Vérifier que remiseType est bien sélectionné
        if (updatedItem.applyOnPrixAchat) {
          prixRemise = updatedItem.remiseType === "%" 
            ? prixAchat * (1 - remiseValue / 100) 
            : prixAchat - remiseValue;
          totalRemise = quantity * prixRemise; // Calculer total en fonction du prix réduit
        }
  
        if (updatedItem.applyOnTotal) {
          totalRemise = updatedItem.remiseType === "%" 
            ? lineTotal * (1 - remiseValue / 100) 
            : lineTotal - remiseValue;
        }
      }
  
      updatedItem.lineTotal = lineTotal;
      updatedItem.prixRemise = prixRemise;
      updatedItem.totalRemise = totalRemise;
  
      updatedArticles[index] = updatedItem;
      updateTotals(updatedArticles);
  
      return {
        ...prevState,
        articles: updatedArticles,
      };
    });
  };
  
  
  
  
  
  

  
  
  

  // Mettre à jour les totaux
  const updateTotals = (articles) => {
    const newSubTotal = articles.reduce(
      (sum, item) => sum + parseFloat(item.totalRemise || item.lineTotal || 0), 
      0
    );
    
    setSubTotal(newSubTotal);
    setTotal(newSubTotal); // Peut être ajusté pour inclure taxes/remises
  };
  
  
  
  
  
  

  // Colonnes du tableau
  const columns = [
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleInputChange(index, "quantity", value)}
        />
      ),
    },
    {
      title: "Article",
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => {
        // Filtrer les articles en fonction du site_id de la commande
        const filteredArticles = articles.filter(
          (article) => article.sites?.id === state.site_id || article.sites === null
        );
    
        return (
          <Select
            value={record.id}
            onChange={(value) => {
              const selectedArticle = articles.find((article) => article.id === value);
              if (selectedArticle) {
                handleInputChange(index, "id", value);
                handleInputChange(index, "code_barre", selectedArticle.code_barre);
                handleInputChange(index, "description", selectedArticle.description);
                handleInputChange(index, "unite", selectedArticle.uniteMesures.nom);
                handleInputChange(index, "prix_achat", parseFloat(selectedArticle.prix_achat || 0));
                handleInputChange(index, "lineTotal", parseFloat(selectedArticle.prix_achat || 0) * (record.quantity || 1));
              }
            }}
            placeholder="Sélectionnez un article"
            showSearch
            optionFilterProp="children"
            disabled={!!record.id}
          >
            {filteredArticles.map((article) => (
              <Option key={article.id} value={article.id}>
                {`${article.code_barre} - ${article.description}`}
              </Option>
            ))}
          </Select>
        );
      },
    },
    
    {
      title: "Prix unitaire",
      dataIndex: "prix_achat",
      key: "prix_achat",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.prix_achat}
          onChange={(value) => handleInputChange(index, "prix_achat", value)}
          formatter={(value) => `$ ${value}`}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Prix après remise",
      dataIndex: "prixRemise",
      key: "prixRemise",
      render: (_, record) => `$${parseFloat(record.prixRemise || record.prix_achat).toFixed(2)}`,
    },
    {
      title: "Total ligne",
      dataIndex: "lineTotal",
      key: "lineTotal",
      render: (_, record) => `$${parseFloat(record.lineTotal || 0).toFixed(2)}`,
    },
    {
      title: "Total après remise",
      dataIndex: "totalRemise",
      key: "totalRemise",
      render: (_, record) => `$${parseFloat(record.totalRemise || record.lineTotal).toFixed(2)}`,
    },    
    {
      title: "Remise",
      dataIndex: "remise",
      key: "remise",
      render: (_, record, index) => (
        <Space>
          <InputNumber
            min={0}
            value={record.remise}
            onChange={(value) => handleInputChange(index, "remise", value)}
            formatter={(value) => record.remiseType ? `${value}${record.remiseType}` : ""}
            parser={(value) => value.replace(/\$\s?|%\s?/g, '')}
            style={{ width: 80 }}
            disabled={!record.remiseType} // Désactive si `remiseType` n'est pas défini
          />
          <Select
            value={record.remiseType || null}
            onChange={(value) => handleInputChange(index, "remiseType", value)}
            style={{ width: 80 }}
            placeholder="Type"
            allowClear
          >
            <Option value="%">%</Option>
            <Option value="$">$</Option>
          </Select>
          <Checkbox
            checked={record.applyOnPrixAchat}
            onChange={(e) => handleInputChange(index, "applyOnPrixAchat", e.target.checked)}
          >
            Sur Prix
          </Checkbox>
          <Checkbox
            checked={record.applyOnTotal}
            onChange={(e) => handleInputChange(index, "applyOnTotal", e.target.checked)}
          >
            Sur Total
          </Checkbox>
        </Space>
      ),
    },        
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <Button danger onClick={() => handleRemoveArticle(index)}>
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Button>
      ),
    },
  ];
  


  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ color: '#1890ff' }}>Gestion des commande</h1>
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
          title={isEditing ? "Modifier la commande" : "Ajouter une commande"}
          visible={isModalVisible}
          width={1050} // Taille optimisée
          onCancel={() => setIsModalVisible(false)}
          footer={
            <div style={{ textAlign: "right", marginTop: 10 }}>
              <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Annuler
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={isEditing ? modifier : enregistrement}
                style={{ marginLeft: 10 }} // Ajout d'un espace entre les boutons
              >
                {loading ? <ClipLoader size={20} color={"#ffffff"} /> : isEditing ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          }
          style={{ maxHeight: "80vh", overflowY: "auto" }} // Ajout du scroll automatique
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item
                  label="Fournisseur de la commande"
                  name="fournisseur_id"
                  rules={[{ required: true, message: "Veuillez sélectionner un fournisseur" }]}
                >
                  <Select
                    placeholder="Sélectionnez un fournisseur"
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => setState({ ...state, fournisseur_id: value })}
                    style={{ width: "100%" }}
                  >
                    {fournisseur.map((four) => (
                      <Select.Option key={four.id} value={four.id}>
                        {four.nom}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Tooltip title="Afficher la liste des fournisseurs">
                  <Button type="default" style={{ marginTop: 32 }} block onClick={() => setIsModalFour(true)}>
                    <FolderOpenOutlined />
                  </Button>
                </Tooltip>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Expédier à (site) :"
                  name="site_id"
                  rules={[{ required: true, message: "Veuillez sélectionner un site" }]}
                >
                  <Select
                    placeholder="Sélectionnez un site"
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => setState({ ...state, site_id: value })}
                    style={{ width: "100%" }}
                  >
                    {site.map((s) => (
                      <Select.Option key={s.id} value={s.id}>
                        {s.nom}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date de réception prévue">
                  <DatePicker
                    onChange={(date) => setState({ ...state, date_reception_prevue: date?.format("YYYY-MM-DD") })}
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Date d'émission">
                  <DatePicker
                    onChange={(date) => setState({ ...state, date_emission: date?.format("YYYY-MM-DD") })}
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Adresse de facturation" name="adresse_facturation">
                  <Input.TextArea placeholder="Entrez l'adresse de facturation" onChange={(e) => setState({ ...state, adresse_facturation: e.target.value })} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Adresse d'expédition" name="adresse_expedition">
                  <Input.TextArea placeholder="Entrez l'adresse d'expédition" onChange={(e) => setState({ ...state, adresse_expedition: e.target.value })} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="N° de suivi" name="numerosuivi">
                  <Input placeholder="Numéro de suivi" onChange={(e) => setState({ ...state, numerosuivi: e.target.value })} />
                </Form.Item>
              </Col>

              <Col span={10}>
                <Form.Item
                  label="Transporteur de la commande"
                  name="transporteur_id"
                  rules={[{ required: true, message: "Veuillez sélectionner un transporteur" }]}
                >
                  <Select
                    placeholder="Sélectionnez un transporteur"
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => setState({ ...state, transporteur_id: value })}
                    style={{ width: "100%" }}
                  >
                    {transporteur.map((trans) => (
                      <Select.Option key={trans.id} value={trans.id}>
                        {trans.nom}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Tooltip title="Afficher la liste des transporteurs">
                  <Button type="default" style={{ marginTop: 32 }} block onClick={() => setIsModalTrans(true)}>
                    <FolderOpenOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>

            <Divider dashed>Articles</Divider>

            <Table
              dataSource={state.articles}
              columns={columns}
              pagination={false}
              rowKey={(record, index) => index}
            />

            <Button
              type="dashed"
              onClick={handleAddArticle}
              style={{ width: "100%", marginTop: 16 }}
              disabled={articles.length === selectedIds.length} // Désactive si tous les articles sont sélectionnés
            >
              <PlusOutlined /> Ajouter un article
            </Button>

            <Divider dashed />
            <Row justify="end" style={{ marginTop: 16, textAlign: "right" }}>
              <Col span={8}>
                <h3>Sous-total : ${subTotal.toFixed(2)}</h3>
                <h3>Total : ${total.toFixed(2)}</h3>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Note de la commande" name="notes_commande">
                  <Input.TextArea placeholder="Entrez une note pour la commande" onChange={(e) => setState({ ...state, notes_commande: e.target.value })} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Notes internes" name="notes_internes">
                  <Input.TextArea placeholder="Entrez une note interne" onChange={(e) => setState({ ...state, notes_internes: e.target.value })} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
        title={"Liste des fournisseur"}
        visible={IsModalFour}
        onCancel={() => setIsModalFour(false)}
        width={490}
        footer={[
            <Button key="cancel" onClick={() => setIsModalFour(false)}>
                Annuler
            </Button>]}
        >
          <Fournisseur/>

        </Modal>

        <Modal
        title={"Liste des transporteur"}
        visible={IsModalTrans}
        onCancel={() => setIsModalTrans(false)}
        width={420}
        footer={[
            <Button key="cancel" onClick={() => setIsModalTrans(false)}>
                Annuler
            </Button>]}
        >
          <Transporteur/>

        </Modal>

        <h3>Liste des Commandes</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredCommande} columns={columnsCommandes} rowKey="id" />
            </Spin> 
    </div>
  );
};


