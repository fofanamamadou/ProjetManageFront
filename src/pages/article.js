import { FolderOpenOutlined, PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Tooltip, message,  Table, Checkbox, Upload, Popconfirm, Space, Spin, Card} from 'antd';
import React, { useEffect, useState } from 'react';
import Categorie from './categorie';
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Fournisseur from './fournisseur';
import Unite from './uniteMesure';
const { Option } = Select;

export default function Article() {

  const [selectedSites, setSelectedSites] = useState([]);
  const [site, setSite] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  const [state, setState] = useState({
    id : null,
    prix_achat: null,
    prix_vente: null,
    image: "",
    note: "",
    site_web: "",
    number_fournisseur: "",
    description: "",
    code_barre: "",
    uniteMesure_id: "",
    taxe: "",
    sousCategorie_id: null,
    categorie_id: null,
    fournisseur_id: null,
    sites: []
  }
  );
  const [categorie, setCategorie] = useState([]);
  const [unite, setUnite] = useState([]);
  const [article, setArticle] = useState([]);
  const [sousCategorie, setSousCategorie] = useState([]);
  const [sousCategorieFilt, setSousCategorieFilt] = useState([]);
  const [fournisseur, setFournisseur] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCat, setIsModalCat] = useState(false);
  const [IsModalUnite, setIsModalUnite] = useState(false);
  const [IsModalFour, setIsModalFour] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [activeSection, setActiveSection] = useState("article");
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();

  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Basic " + localStorage.getItem("token")
  };

  useEffect(() => {
    listCategorie();
    listSousCategorie();
    listFournisseur();
    listSite();
    listArticle();
    listUnite();
    document.title = "Gestion des Articles";
}, [IsModalUnite, IsModalFour, state.categorie_id]);






///Filtrage 
const [filters, setFilters] = useState({
  categorie: "toutes",
  sousCategorie: "toutes",
  site: "tous",
  article: "tous"
});

const handleFilterChange = (key, value) => {
  setFilters((prev) => ({ ...prev, [key]: value }));

  if (key === "categorie") {
    
    if (value === "toutes") {
      setSousCategorieFilt([]); // Réinitialiser les sous-catégories
    } else {
      const categorieId = parseInt(value); // Convertir en nombre
      axios.get(`http://localhost:8080/anonyme/sousCategorie/categorie/${categorieId}`, { headers })
            .then((response) => {
                setSousCategorieFilt(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    setFilters((prev) => ({ ...prev, sousCategorie: "toutes" }));
  }
};




  const handleReset = () => {
    setFilters({
      categorie: "toutes",
      sousCategorie: "toutes",
      site: "tous",
      article: "tous",
    });
  };

  //Appliquer les filtrages
  const applyFilters = () => {
    setLoading(true);

    let filtered = article;

    // Filtrer par catégorie
    if (filters.categorie !== "toutes") {
      filtered = filtered.filter((art) => art.categories.id === parseInt(filters.categorie));
    }

    // Filtrer par sous-catégorie
    if (filters.sousCategorie !== "toutes") {
      filtered = filtered.filter((art) => art.sousCategories.id === parseInt(filters.sousCategorie));
    }

    // Filtrer par site
    if (filters.site !== "tous") {
      filtered = filtered.filter((art) => art.sites.id === parseInt(filters.site));
    }

    // Filtrer par article
    if (filters.article !== "tous" ) {
      filtered = filtered.filter((art) => art.id === parseInt(filters.article));
    }

    

    setFilteredArticles(filtered);
    setLoading(false);
  };


    const showAddModal = () => {
      setIsEditing(false);
      setState({ id : null, prix_achat: null, prix_vente: null, image: "", note: "", site_web: "", number_fournisseur: "", description: "", code_barre: "", uniteMesure_id: null, taxe: "", sousCategorie_id: null, categorie_id: null, fournisseur_id: null, sites:[]}); // Réinitialiser l'état pour un nouvel ajout
      form.resetFields(); // Réinitialiser le formulaire
      setIsModalVisible(true);
    };

    const showEditModal = (record) => {
          setIsEditing(true);
          setState(record); // Charger les données à modifier
          form.setFieldsValue({ prix_achat: record.prix_achat, prix_vente: record.prix_vente, image: record.image, note: record.note, site_web: record.site_web, number_fournisseur: record.number_fournisseur, description: record.description, code_barre: record.code_barre, uniteMesure_id: record.uniteMesure_id, taxe: record.taxe, sousCategorie_id: record.sousCategorie_id, categorie_id: record.categorie_id, fournisseur_id: record.fournisseur_id, sites: record.sites
          }); // Remplir le formulaire avec les données existantes
          setIsModalVisible(true);
      };

      const handleApiError = () => {
        messageApi.error("Erreur survenu.");
    }

    // const enregistrement = () => {
    //   setLoading(true);
    //   axios.post("http://localhost:8080/anonyme/produit", state, { headers }).then(
    //       (success) => {
    //           listArticle();
    //           console.log("Données envoyées : ", state);
    //           messageApi.success({ content: success.data, style: { color: 'green' } });
    //           setLoading(false);
    //           setIsModalVisible(false); // Fermer le modal
    //       },
    //       (error) => {
    //           console.log("Données envoyées : ", JSON.stringify(state, null, 2));
    //           console.log(error);
    //           handleApiError();
    //           setLoading(false);
    //       }
    //   );
    // };

    const enregistrement = () => {
      setLoading(true);
    
      // Transformation des données pour correspondre au format attendu
      const payload = 
      (state.sites && state.sites.length > 0) ?

      state.sites.map((site) => ({
        id: state.id,
        prix_achat: state.prix_achat,
        prix_vente: state.prix_vente,
        image: state.image,
        note: state.note,
        site_web: state.site_web,
        number_fournisseur: state.number_fournisseur,
        description: state.description,
        code_barre: state.code_barre,
        uniteMesure_id: state.uniteMesure_id,
        taxe: state.taxe,
        sousCategorie_id: state.sousCategorie_id,
        categorie_id: state.categorie_id,
        fournisseur_id: state.fournisseur_id,
        site_id: site.id,
        quantite: site.quantite,
        seuil_minimum: site.seuil_minimum,
        quantite_maximum: site.quantite_maximum,
      }))
      :
      [{
        id: state.id,
        prix_achat: state.prix_achat,
        prix_vente: state.prix_vente,
        image: state.image || "",
        note: state.note || "",
        site_web: state.site_web || "",
        number_fournisseur: state.number_fournisseur || "",
        description: state.description || "",
        code_barre: state.code_barre || "",
        uniteMesure_id: state.uniteMesure_id || null,
        taxe: state.taxe || "",
        sousCategorie_id: state.sousCategorie_id || null,
        categorie_id: state.categorie_id || null,
        fournisseur_id: state.fournisseur_id || null,
        site_id: null, // Pas de site renseigné
        quantite: 0, // Valeur par défaut
        seuil_minimum: 10, // Valeur par défaut
        quantite_maximum: 100, // Valeur par défaut
      } ]
    
      // Envoyer les données reformées
      axios
        .post("http://localhost:8080/anonyme/produit", payload, { headers })
        .then(
          (success) => {
            listArticle();
            console.log("Données envoyées : ", JSON.stringify(payload, null, 2));
            messageApi.success({ content: success.data, style: { color: "green" } });
            setLoading(false);
            setIsModalVisible(false); // Fermer le modal
          },
          (error) => {
            console.log("Données envoyées :",payload);
            console.log(error);
            handleApiError();
            setLoading(false);
          }
        );
    };
    
    
    
    const modifier = () => {
        setLoading(true);
        axios.put("http://localhost:8080/anonyme/produit/" + state.id, state, { headers }).then(
            (success) => {
                listArticle();
                messageApi.success("article modifier avec succes");
                setLoading(false);
                setIsModalVisible(false); // Fermer le modal
            },
            (error) => {
                console.log("Données envoyées : ", state);
                console.log(error);
                handleApiError();
                setLoading(false);
            }
        );
    };

    const listArticle = () => {
      setLoadingTable(true);
      axios.get("http://localhost:8080/anonyme/produit",{headers}).then(
          (success) => {
            console.log(success.data);
              setArticle(success.data);
              setFilteredArticles(success.data);
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
    axios.delete("http://localhost:8080/anonyme/produit/"+id,{headers}).then(
        (success) => {
            messageApi.success({ content: success.data });
            listArticle();
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

const filteredArticle = filteredArticles.filter((art) => art.description.toLowerCase().includes(searchText.toLowerCase()));


const columnsArticle = [
  {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
  },
  {
      title: 'Code Barre',
      dataIndex: 'code_barre',
      key: 'code_barre',
  },
  {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
  },
  {
    title: 'Quantité',
    dataIndex: 'quantite',
    key: 'quantite',
    render: (text, record) => {
        const isLowStock = record.quantite <= record.seuil_minimum; // Vérification
  
        return (
            <span style={{ color: isLowStock ? 'red' : 'black' }}>
                {record.quantite}
            </span>
        );
    },
  },
  {
      title: 'Seuil Minimum',
      dataIndex: 'seuil_minimum',
      key: 'seuil_minimum',
  },
  {
      title: 'Site',
      key: 'site',
      render: (text, record) => {
        // Vérifie si uniteMesures est défini et a un nom
        return record.sites && record.sites.nom ;
    },
  },
  {
      title: 'Categorie',
      key: 'categorie',
      render: (text, record) => {
        // Vérifie si uniteMesures est défini et a un nom
        return record.categories && record.categories.nom;
    },
  },
  {
    title: 'Unité de Mesure',
    key: 'unite_mesure',
    render: (text, record) => {
        // Vérifie si uniteMesures est défini et a un nom
        return record.uniteMesures && record.uniteMesures.nom ;
    },
},
  {
      title: 'Site web',
      dataIndex: 'site_web',
      key: 'site_web',
  },
  {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
          <Space size="middle">
             {/* <Button 
                style={{ color: "blue" }}
                icon={<EditOutlined />}
                onClick={() => showEditModal(record)}
              /> */}
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
          </Space>
      ),
  },
];


  // Liste des IDs déjà sélectionnés
  const selectedIds = state.sites.map((row) => row.id).filter((id) => id !== null);

    // Fonction pour ajouter une nouvelle ligne
  const addTableRow = () => {

    const newRow = {
      id: null,
      quantite: 0,
      seuil_minimum: 10,
      quantite_maximum: 100,
    };

    setState((prevState) => {
      const updatedSites = [...prevState.sites, newRow];
      return {
        ...prevState,
        sites: updatedSites,
      };
    });

  };

    
    
    
  
    // Fonction pour supprimer une ligne
    // Fonction pour supprimer une ligne
  const deleteTableRow = (index) => {
    setState((prevState) => {
      const updatedSites = [...prevState.sites];
      updatedSites.splice(index, 1); // Supprime le site par index
  
      return {
        ...prevState,
        sites: updatedSites,
      };
    });
  };

  // Fonction pour mettre à jour une ligne
  const updateTableRow = (index, field, value) => {
    setState((prevState) => {
      const updatedSites = [...prevState.sites];
      const updatedItem = { ...updatedSites[index], [field]: value };


      updatedSites[index] = updatedItem; // Mise à jour du site modifié

      return {
        ...prevState,
        sites: updatedSites,
      };
    });
  };

    
  
   // Colonnes du tableau
  const columns = [
    {
      title: "Sites",
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => (
        <Select
        value={record.id}
        onChange={(value) => {
          const selectedSite = site.find((sit) => sit.id === value);
          if (selectedSite) {
            updateTableRow(index, "id", value);
            updateTableRow(index, "nom", selectedSite.nom);
          }
        }}
        placeholder="Sélectionnez un site"
        showSearch
        optionFilterProp="children"
        disabled={!!record.id} // Désactive le Select si un ID est déjà sélectionné
        >
            {site
            .filter(
              (sit) => !selectedIds.includes(sit.id) || sit.id === record.id
            )
            .map((sit) => (
              <Option key={sit.id} value={sit.id}>
                {sit.nom}
              </Option>
            ))}

        </Select>
      ),
    },
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.quantite}
          onChange={(value) => updateTableRow(index, "quantite", value)}
        />
      ),
    },
    {
      title: "Seuil Minimum",
      dataIndex: "seuil_minimum",
      key: "seuil_minimum",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.seuil_minimum}
          onChange={(value) => updateTableRow(index, "seuil_minimum", value)}
        />
      ),
    },
    {
      title: "Quantité Maximum",
      dataIndex: "quantite_maximum",
      key: "quantite_maximum",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.quantite_maximum}
          onChange={(value) => updateTableRow(index, "quantite_maximum", value)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteTableRow(index)}
        >
          Supprimer
        </Button>
      ),
    },
  ];


  //Fonction pour convertir l'img en base64 et pouvoir le stocker

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setState((prevState) => ({
        ...prevState,
        image: reader.result, // Contenu de l'image en base64
      }));
    };
    reader.readAsDataURL(file);
    return false; // Empêche le téléchargement automatique
  };



  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction pour vérifier si une URL est valide
  const isValidURL = (string) => {
    try {
      new URL(string); // Essaie de créer un objet URL
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleButtonClick = () => {
    if (isValidURL(url)) {
      setIsError(false)
      setErrorMessage(""); // Efface le message d'erreur
      window.open(url, "_blank"); // Ouvre l'URL dans un nouvel onglet
    } else {
      setIsError(true);
      setErrorMessage(
        "Saisissez un url valide (ex : https://example.com)"
      );
    }}

    const listFournisseur = () => {
      axios.get("http://localhost:8080/anonyme/fournisseur",{headers}).then(
          (success) => {
              setFournisseur(success.data);
          },
          (error) => {
              console.log(error);
          }
      );
  };


    const listCategorie = () => {
      axios.get("http://localhost:8080/anonyme/categorie",{headers}).then(
          (success) => {
              setCategorie(success.data);
          },
          (error) => {
              console.log(error);
          }
      );
  };

    const listSousCategorie = () => {
      axios.get("http://localhost:8080/anonyme/sousCategorie/categorie/"+state.categorie_id,{headers}).then(
          (success) => {
              setSousCategorie(success.data);
          },
          (error) => {
              console.log(error);
          }
      );
  };

  const listSite = () => {
    axios.get("http://localhost:8080/anonyme/site", { headers }).then(
      (success) => {
        setSite(success.data);
      },
      (error) => {
        console.error("Erreur lors de la récupération des sites :", error);
      }
    );
  };

  const listUnite = () => {
    axios.get("http://localhost:8080/anonyme/unite", { headers }).then(
      (success) => {
        setUnite(success.data);
      },
      (error) => {
        console.error("Erreur lors de la récupération  :", error);
      }
    );
  };


  return (
    <>

    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          width: "1000px",
          margin: "auto",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Catégorie */}
          <Col span={12} md={6}>
            <label style={{ display: "block", fontWeight: "bold" }}>Catégorie :</label>
            <Select
              value={filters.categorie}
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("categorie", value)}
              optionFilterProp="children"
              showSearch 
            >
              <Option value="toutes">Toutes</Option>
              {/* Lister les categories */}
              {categorie.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.nom}
                            </Select.Option>
              ))}
            </Select>
          </Col>

          {/* Site */}
          <Col span={12} md={6}>
            <label style={{ display: "block", fontWeight: "bold" }}>Site :</label>
            <Select
              value={filters.site}
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("site", value)}
              optionFilterProp="children"
              showSearch
            >
              <Option value="tous">Tous</Option>
              {/* Lister les sites */}
              {site.map((site) => (
                            <Select.Option key={site.id} value={site.id}>
                                {site.nom}
                            </Select.Option>
              ))}
            </Select>
          </Col>

          {/* Sous-catégorie */}
          <Col span={12} md={6}>
            <label style={{ display: "block", fontWeight: "bold" }}>Sous-catégorie :</label>
            <Select
              value={filters.sousCategorie}
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("sousCategorie", value)}
              optionFilterProp="children"
              showSearch
              disabled={filters.categorie === "toutes"} // Désactiver si aucune catégorie sélectionnée
            >
              <Option value="toutes">Toutes</Option>
              {/* Lister les sous categories de la categorie selectionnee */}
              {sousCategorieFilt.map((sousCat) => (
                            <Select.Option key={sousCat.id} value={sousCat.id}>
                                {sousCat.nom_sous}
                            </Select.Option>
              ))}
            </Select>
          </Col>

          {/* Articles */}
          <Col span={12} md={6}>
            <label style={{ display: "block", fontWeight: "bold" }}>Articles :</label>
            <Select
              value={filters.article}
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("article", value)}
              optionFilterProp="children"
              showSearch
            >
              <Option value="tous">Tous</Option>
              {article.map((article) => (
                            <Select.Option key={article.id} value={article.id}>
                                {article.code_barre}
                            </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Boutons d'action */}
        <Row gutter={16} justify="center" style={{ marginTop: "20px" }}>
          <Col span={12} md={6}>
            <Button onClick={handleReset} block style={{ borderBlockColor: "#2196f3"}}>
              Renitialiser
            </Button>
          </Col>
          <Col span={12} md={6}>
            <Button  onClick={applyFilters} block style={{ borderBlockColor: "#2196f3" }}>
              Appliquer les filtres
            </Button>
          </Col>
        </Row>
      </div>
      <Divider  variant="dashed"  style={{    borderColor: '#2196f3',  }}  dashed></Divider>
      {/* Bouton pour ouvrir le modal */}
      <Button type="primary" style={{ marginBottom: '20px' }} onClick={showAddModal}>
        Ajouter un article
      </Button>

      {/* Modal */}
      <Modal
        title={isEditing ? "Modifier le article" : "Ajouter un article"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Annuler
            </Button>,
            <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={isEditing ? modifier : enregistrement}
            >
                {loading ? <ClipLoader size={20} color={"#ffffff"} /> : (isEditing ? "Enregistrer" : "Ajouter")}
            </Button>,
        ]}
      >
         {/* Boutons en haut du Modal */}
         <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
          <Button
            type={activeSection === "article" ? "primary" : "default"}
            onClick={() => setActiveSection("article")}
          >
            Article
          </Button>
          <Button
            type={activeSection === "stock" ? "primary" : "default"}
            onClick={() => setActiveSection("stock")}
          >
            Stock
          </Button>
        </div>
        {activeSection === "article" &&(
          <>
          {/* Formulaire */}
            <Form layout="horizontal">
              <Divider  variant="dashed"  style={{    borderColor: '#2196f3',  }}  dashed>
                Général
              </Divider>
              {/* Code d'article */}
              <Form.Item
                label="Code d'article (Entrer/scanner le code-barre)"
                name="code_barre"
                rules={[{ required: true, message: 'Veuillez entrer le code d\'article' }]}
              >
                <Input placeholder="Scanner ou entrer un code-barre" onChange={(e) => setState({ ...state, code_barre: e.target.value })}/>
              </Form.Item>

              {/* Description */}
              <Form.Item
                label="Description de l'article"
                name="description"
                rules={[{ required: false}]}
              >
                <Input.TextArea placeholder="Entrez une description complète ici" onChange={(e) => setState({ ...state, description: e.target.value })}/>
              </Form.Item>

              {/* Catégorie */}
              <Row>
                <Col sm={20}>
                  <Form.Item
                    label="Catégorie"
                    name="category"
                    rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                  >
                    <Select 
                        placeholder="Sélectionnez une catégorie" 
                        showSearch 
                        optionFilterProp="children"
                        onChange={(value) => setState({ ...state, categorie_id: value })}
                    >
                        {categorie.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                            {cat.nom}
                        </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                
                </Col>
                <Col sm={1}>
                </Col>
                <Col sm={3}>
                <Tooltip title="Afficher la liste des catégories" overlayInnerStyle={{backgroundColor:"white", color: "black"}}>

                <Button onClick={() => {setIsModalCat(true)}}>
                  <FolderOpenOutlined/>
                </Button>
                </Tooltip>
                </Col>
              </Row>

              {/* Sous-catégorie */}
              <Form.Item
                label="Sous Categorie"
                name="sousCategorie"
                rules={[{ required: true, message: 'Veuillez sélectionner une sous catégorie' }]}
              >
                <Select 
                    placeholder="Sélectionnez une sous catégorie" 
                    showSearch 
                    optionFilterProp="children"
                    onChange={(value) => setState({ ...state, sousCategorie_id: value })}
                    disabled={!state.categorie_id}
                >
                    {sousCategorie.map((souscat) => (
                    <Select.Option key={souscat.id} value={souscat.id}>
                        {souscat.nom_sous}
                    </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Divider  variant="dashed"  style={{    borderColor: '#2196f3',  }}  dashed>
                Tarifs
              </Divider>
              {/* Tarifs */}
              <Form.Item label="Coût d'achat unitaire ($)" name="prix_achat">
                <InputNumber placeholder="par ex. 20.90" style={{ width: '100%' }} onChange={(value) => setState({ ...state, prix_achat: value })} />
              </Form.Item>

              <Form.Item label="Prix de vente unitaire ($)" name="prix_vente">
                <InputNumber placeholder="par ex. 21.90" style={{ width: '100%' }} onChange={(value) => setState({ ...state, prix_vente: value })}/>
              </Form.Item>

              <Form.Item label="Taxes" name="taxe">
                <Select placeholder="Aucun"

                onChange={(value) => setState({ ...state, taxe: value })}
                
                >
                  <Option value="aucun">Aucun</Option>
                  <Option value="TVA">TVA</Option>
                </Select>
              </Form.Item>
              <Divider  variant="dashed"  style={{    borderColor: '#2196f3',  }}  dashed>
              </Divider>
              {/* Unité de mesure */}
              <Row>
                <Col sm={20}>
                  <Form.Item
                    label="Unité de mesure"
                    name="uniteMesure_id" 
                  >
                    <Select 
                        placeholder="Exemple : pied, mètre, lbs, kg" 
                        showSearch 
                        optionFilterProp="children"
                        onChange={(value) => setState({ ...state, uniteMesure_id: value })}
                    >
                        {unite.map((unite) => (
                        <Select.Option key={unite.id} value={unite.id}>
                            {unite.nom}
                        </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                
                </Col>
                <Col sm={1}>
                </Col>
                <Col sm={3}>
                <Tooltip title="Afficher la liste des unites de mesures" overlayInnerStyle={{backgroundColor:"white", color: "black"}}>

                <Button onClick={() => {setIsModalUnite(true)}}>
                  <FolderOpenOutlined/>
                </Button>
                </Tooltip>
                </Col>
              </Row>

              {/* Notes */}
              <Form.Item label="Note de l'article" name="note">
                <Input.TextArea placeholder="Entrez une note ici"  onChange={(e) => setState({ ...state, note: e.target.value })}/>
              </Form.Item>
              {/* Site web de l'article */}
              <Row>
                <Col sm={21}>
                  <Form.Item
                    label="Site de l'article"
                    rules={[{ required: false }]}
                    name="site_web"
                  >
                    <Input
                      placeholder="Entrez une URL (ex : https://example.com)"
                      value={url}
                      width={50}
                      onChange={(e) => {
                        setState({ ...state, site_web: e.target.value })
                        setUrl(e.target.value)

                      }}
                    />
                  </Form.Item>
                
                </Col>
                <Col sm={3}>
                  <Form.Item>
                      <Tooltip title={isError ? errorMessage : ""}
                                color="red"
                                visible={isError} // Affiche le tooltip seulement en cas d'erreur
                      >
                        <Button type="primary" onClick={handleButtonClick}>
                          Consulter
                        </Button>

                      </Tooltip>
                    </Form.Item>
                
                </Col>
              </Row>
            </Form>
          </>
         ) } 
         {activeSection === "stock" &&(
          <>

              <Form
                  layout="horizontal"
                >
                  {/* Tableau */}
                  <Form.Item>
                    <Table
                    
                      dataSource={state.sites}
                      columns={columns}
                      pagination={false}
                      rowKey={(record, index) => index}
                    />
                    <Button
                      type="dashed"
                      onClick={addTableRow}
                      style={{ width: "100%", marginTop: 16 }}
                      disabled={site.length === selectedIds.length} // Désactive si tous les sites sont sélectionnés
                    >
                      <PlusOutlined /> Ajouter un site
                    </Button>
                  </Form.Item>

                  <Row>
                    <Col sm={11}>
                    <Button
                            type="default"
                            // onClick={}
                            block
                            disabled // Désactivation 
                          >
                             Afficher l'historique des receptions
                          </Button>
                    </Col>
                    <Col sm={2}></Col>
                    <Col sm={11}>
                    <Button
                            type="default"
                            // onClick={}
                            block
                            disabled // Désactivation 
                          >
                            Afficher l'historique des ventes
                          </Button>
                    </Col>
                  </Row>
                  

                  {/* Notification */}
                  <Form.Item name="notifyByEmail" valuePropName="checked">
                    <Checkbox>
                      Envoyer un courriel lorsque la quantité atteint le niveau de sécurité
                    </Checkbox>
                  </Form.Item>

                  {/* Fournisseur */}
                    <Row>
                      <Col sm={20}>
                        <Form.Item label="Fournisseur par défaut" name="defaultSupplier">
                          <Select 
                              placeholder="Sélectionnez un fournisseur" 
                              showSearch 
                              optionFilterProp="children"
                              onChange={(value) => setState({ ...state, fournisseur_id: value })}
                          >
                              {fournisseur.map((fournisseur) => (
                              <Select.Option key={fournisseur.id} value={fournisseur.id}>
                                  {fournisseur.nom}
                              </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col sm={1}>
                      </Col>
                      <Col sm={3}>
                      <Tooltip title="Afficher la liste des catégories" overlayInnerStyle={{backgroundColor:"white", color: "black"}}>

                      <Button onClick={() => {setIsModalFour(true)}}>
                        <FolderOpenOutlined/>
                      </Button>
                      </Tooltip>
                      </Col>
                    </Row>

                  <Form.Item
                    label="Numéro de pièce fournisseur"
                    name="number_fournisseur"
                  >
                    <Input placeholder="Entrez le numéro de pièce"  onChange={(e) => setState({ ...state, number_fournisseur: e.target.value })}/>
                  </Form.Item>

                  {/* Image Upload */}
                  <Form.Item label="Image">
                    <Upload
                      name="image"
                      listType="picture"
                      beforeUpload={handleImageUpload} // Gestion de l'upload
                      showUploadList={false} // Optionnel : empêche l'affichage de la liste des fichiers
                    >
                      <Button icon={<UploadOutlined />}>Ajouter l'image...</Button>
                    </Upload>
                  </Form.Item>
                </Form>
          
          </>
           ) } 
         {/* First form end */}

        
      </Modal>

      <Modal
        title={"Liste des categories"}
        visible={isModalCat}
        onCancel={() => setIsModalCat(false)}
        footer={[
            <Button key="cancel" onClick={() => setIsModalCat(false)}>
                Annuler
            </Button>]}
      >
        <Categorie/>

      </Modal>
      <Modal
        title={"Liste des fournisseur"}
        visible={IsModalFour}
        onCancel={() => setIsModalFour(false)}
        footer={[
            <Button key="cancel" onClick={() => setIsModalFour(false)}>
                Annuler
            </Button>]}
      >
        <Fournisseur/>

      </Modal>

      <Modal
        title={"Liste des unites de mesure"}
        visible={IsModalUnite}
        onCancel={() => setIsModalUnite(false)}
        footer={[
            <Button key="cancel" onClick={() => setIsModalUnite(false)}>
                Annuler
            </Button>]}
      >
        <Unite/>

      </Modal>


      <h3>Liste des aricles</h3>
            <Input.Search
              placeholder="Rechercher un élément"
              value={searchText}
              onChange={handleSearch}
              style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredArticle} columns={columnsArticle} rowKey="id" />
            </Spin> 

    </div>
    </>
  );
}
