import { Button, Form, Input, Modal, Row, Col, message, Space, Spin, Popconfirm,Table, Select, InputNumber, DatePicker,  Divider, Tooltip, Checkbox} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined, PlusOutlined, FolderOpenOutlined } from "@ant-design/icons";
import Client from './client';

const { TextArea } = Input;
const { Option } = Select;


export default function Vente () {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsModalClient, setIsModalClient] = useState(false);
  const [form] = Form.useForm();
  const [state, setState] = useState({ id: null,  note: "",date_vente: "", client_id: null,articles: [] });
  const [messageApi, contextHolder] = message.useMessage();
  const [subTotal, setSubTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [vente, setVente] = useState([]);
  const [client, setClient] = useState([]);
  const [site, setSite] = useState([]);
  const [articles, setArticles] = useState([]); // Pour stocker les articles disponibles depuis l'API
  const [total, setTotal] = useState(0);

  const [searchText, setSearchText] = useState("");

  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Basic " + localStorage.getItem("token")
  };

  useEffect(() => {
    listVente();
    listArticle();
    listClient();
    listSite();
    document.title = "Gestion des Ventes";
  }, [IsModalClient]);
  const [count, setCount] = useState(2); // Pour gérer les clés uniques des nouvelles lignes


  


  const showAddModal = () => {
    setIsEditing(false);
    setState({ id: null, note: "",date_vente: "", site_id: null,client_id: null,articles: [] }); // Réinitialiser l'état pour un nouvel ajout
    form.resetFields(); // Réinitialiser le formulaire
    setIsModalVisible(true);
};
  const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({ nom: record.nom, note: record.note, site_id: record.site_id, client_id: record.client_id, articles: record.articles
        }); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };


    const handleApiError = () => {
        messageApi.error("Erreur survenu.");
    }

  const enregistrement = () => {
    setLoading(true);
    axios.post("http://localhost:8080/anonyme/vente", state, { headers }).then(
        (success) => {
            listVente();
            messageApi.success({ content: success.data, style: { color: 'green' } });
            setLoading(false);
            setIsModalVisible(false); // Fermer le modal
        },
        (error) => {
          
          console.log("Données envoyées : ", JSON.stringify(state, null, 2));
            console.log(error);
            messageApi.error(error.response?.data || "Erreur lors de l'enregistrement de la vente !");
            setLoading(false);
        }
    );
};


    const modifier = () => {
        setLoading(true);
        axios.put("http://localhost:8080/anonyme/vente/" + state.id, state, { headers }).then(
            (success) => {
                listVente();
                messageApi.success("vente modifier avec succes");
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

    const listVente = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/vente",{headers}).then(
            (success) => {
                setVente(success.data);
                setLoadingTable(false);
            },
            (error) => {
                console.log(error);
                handleApiError();
                setLoadingTable(false);
            }
        );
    };

    const listClient = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/client",{headers}).then(
            (success) => {
                setClient(success.data);
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
    

    const suppression = (id) => {
            setLoading(true);
            axios.delete("http://localhost:8080/anonyme/vente/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listVente();
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

  const filteredvente = vente.filter(vente => vente.note.toLowerCase().includes(searchText.toLowerCase()));

  const columnsvente = [
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
            title: 'Client',
            dataIndex: 'client',
            render: (text, record) => {
              return record.clients && record.clients.nom ? record.clients.nom : 'Inconnue';
          },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        style={{ color: "blue" }}
                    />
                    
                    
                    <Popconfirm
                        title={`Confirmer la suppression de "${record.nom}" ?`}
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


    // Ajouter un nouvel article au tableau
const handleAddArticle = () => {
  const newArticle = {
    id: null, // L'utilisateur sélectionnera l'article
    code_barre: null,
    prix_vente: 0, // Initialisé à 0
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
      if (field === "applyOnprixVente" && value) {
        updatedItem.applyOnTotal = false; // Désactive "Sur Total"
      }
      if (field === "applyOnTotal" && value) {
        updatedItem.applyOnprixVente = false; // Désactive "Sur Prix"
      }
  
      const prixVente = parseFloat(updatedItem.prix_vente || 0);
      const quantity = parseFloat(updatedItem.quantity || 1);
      let lineTotal = prixVente * quantity; // Mise à jour dynamique
  
      let remiseValue = parseFloat(updatedItem.remise || 0);
      let prixRemise = prixVente;
      let totalRemise = lineTotal;
  
      if (updatedItem.remiseType) { // Vérifier que remiseType est bien sélectionné
        if (updatedItem.applyOnprixVente) {
          prixRemise = updatedItem.remiseType === "%" 
            ? prixVente * (1 - remiseValue / 100) 
            : prixVente - remiseValue;
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
          (article) => article.sites?.id === state.site_id
        );
    
        return (
          <Select
            value={record.id}
            onChange={(value) => {
              const selectedArticle = articles.find((article) => article.id === value);
              if (selectedArticle) {
                handleInputChange(index, "id", value);
                handleInputChange(index, "code_barre", selectedArticle.code_barre);
                handleInputChange(index, "site", selectedArticle.sites.nom);
                handleInputChange(index, "unite", selectedArticle.uniteMesures.nom);
                handleInputChange(index, "prix_vente", parseFloat(selectedArticle.prix_vente || 0));
                handleInputChange(index, "lineTotal", parseFloat(selectedArticle.prix_vente || 0) * (record.quantity || 1));
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
      dataIndex: "prix_vente",
      key: "prix_vente",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.prix_vente}
          onChange={(value) => handleInputChange(index, "prix_vente", value)}
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
      render: (_, record) => `$${parseFloat(record.prixRemise || record.prix_vente).toFixed(2)}`,
    },
    {
      title: "Site",
      dataIndex: "site",
      key: "site",
      render: (_, record) => {
        return record.site;
      },
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
            checked={record.applyOnprixVente}
            onChange={(e) => handleInputChange(index, "applyOnprixVente", e.target.checked)}
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
    <>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ color: '#1890ff' }}>Gestion des ventes</h1>
        {/* Bouton pour ouvrir le modal */}
        <Button type="primary" style={{ marginBottom: '20px' }} onClick={showAddModal}>
          Faire un vente
        </Button>
        <Modal
          title={isEditing ? "Modifier le vente" : "Faire un vente"}
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
                  onClick={isEditing ? modifier : enregistrement}
              >
                  {loading ? <ClipLoader size={20} color={"#ffffff"} /> : (isEditing ? "Enregistrer" : "Ajouter")}
              </Button>,
          ]}
        >
          <Form layout="horizontal" form={form}>
            {/* vente Selection */}
            <Row>
              <Col sm={20}>
                  <Form.Item
                    label="Client :"
                    name="client_id"
                    rules={[{ required: true, message: "Veuillez sélectionner un client" }]}
                    >
                    <Select 
                          placeholder="Sélectionnez un client" 
                          showSearch 
                          onChange={(value) => setState({ ...state, client_id: value })}
                          optionFilterProp="children"
                          >
                          {client.map((clien) => (
                          <Select.Option key={clien.id} value={clien.id}>
                              {clien.nom}
                          </Select.Option>
                          ))}
                    </Select>
                  </Form.Item>
              </Col>
              <Col sm={1}>
              </Col>
              <Col sm={3}>
                <Tooltip title="Afficher la liste des clients" overlayInnerStyle={{backgroundColor:"white", color: "black"}}>
                  <Button onClick={() => {setIsModalClient(true)}}>
                    <FolderOpenOutlined/>
                  </Button>
                </Tooltip>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Item label="Date de la vente" >
                          <DatePicker
                            onChange={(date) =>
                              setState({ ...state, date_vente: date?.format("YYYY-MM-DD") })
                            }
                            format="YYYY-MM-DD"
                          />
                </Form.Item>
              </Col>
              <Col sm={12}>
                  <Form.Item
                    label="Site du produit"
                    name="site_id"
                    rules={[{ required: true, message: "Veuillez sélectionner un site" }]}
                    >
                    <Select 
                          placeholder="Sélectionnez un site" 
                          showSearch 
                          onChange={(value) => setState({ ...state, site_id: value })}
                          optionFilterProp="children"
                          >
                          {site.map((site) => (
                          <Select.Option key={site.id} value={site.id}>
                              {site.nom}
                          </Select.Option>
                          ))}
                    </Select>
                  </Form.Item>
              </Col>
            </Row>

            {/* Sale Date */}
                    



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
                  disabled={articles.length === selectedIds.length} // Désactive si tous les sites sont sélectionnés
                >
                  <PlusOutlined /> Ajouter un article
                </Button>


                <Divider dashed />
                <Row justify="space-between" style={{ marginTop: 16 }}>
                  <Col>
                    <h3>Sous-total : ${subTotal.toFixed(2)}</h3>
                    <h3>Total : ${total.toFixed(2)}</h3>
                  </Col>
                </Row>

           


          

            {/* Checkbox for Damaged Items */}
            {/* <Form.Item name="damagedLost" valuePropName="checked" style={{ marginTop: "16px" }}>
              <Checkbox>Article endommagé/perdu</Checkbox>
            </Form.Item> */}

            {/* Note Field */}
            <Form.Item label="Note" name="note">
              <TextArea rows={4} placeholder="Ajoutez une note ici" onChange={(e) => setState({ ...state, note: e.target.value })} />
            </Form.Item>
          </Form>
        </Modal>
        <h3>Liste des ventes</h3>
              <Input.Search
                  placeholder="Rechercher un élément"
                  value={searchText}
                  onChange={handleSearch}
                  style={{ width: '50%', marginBottom: '20px' }}
              />
              <Spin spinning={loadingTable}>
                  <Table dataSource={filteredvente} columns={columnsvente} rowKey="id" />
              </Spin> 

              <Modal
                title={"Liste des clients"}
                visible={IsModalClient}
                onCancel={() => setIsModalClient(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalClient(false)}>
                        Annuler
                    </Button>]}
              >
                <Client/>

              </Modal>


      </div>
    
    </>
  );
};

