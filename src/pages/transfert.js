import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm , Select, Divider, InputNumber} from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"; // Import des icônes

export default function Transfert() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, site_origine_id: null, site_tranferer_id: null, articles:[], quantite: 0 });
    const [transfert, setTransfert] = useState([]);
    const [site, setSite] = useState([]);
    const [articles, setArticles] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const headers = {
        "Content-Type": "application/json",
        'Authorization': "Basic " + localStorage.getItem("token")
      };

    useEffect(() => {
        listTransfert();
        listSite();
        listArticle();
    }, []);

    // const showModal = (isEdit = false, record = null) => {
    //     setIsEditing(isEdit);
    //     setState(isEdit && record ? record : { id: null, site_origine_id: null, site_tranferer_id: null, articles : [] ,quantite: 0});
    //     form.resetFields(); // Ajout de resetFields pour éviter les résidus
    //     form.setFieldsValue(isEdit && record ? { site_tranferer_id: record.site_tranferer_id, site_origine_id : record.site_origine_id,articles : record.articles,quantite : record.quantite  } : {});
    //     setIsModalVisible(true);
    // };
    const showModal = (isEdit = false, record = null) => {
      setIsEditing(isEdit);
      setState(isEdit && record ? record : { id: null, site_origine_id: null, site_tranferer_id: null, articles: [] , quantite: 0 });
      form.resetFields();
      form.setFieldsValue(isEdit && record ? { site_tranferer_id: record.site_tranferer_id, site_origine_id: record.site_origine_id, articles: record.articles, quantite: record.quantite } : {});
      
      // Mise à jour de l'état des articles en fonction du site d'origine
      if (isEdit && record) {
          const filteredArticles = articles.filter(article => article.sites.id === record.site_origine_id);
          setState(prevState => ({ ...prevState, articles: filteredArticles }));
      }
      
      setIsModalVisible(true);
  };
  
    
    

    const handleApiError = () => {
            messageApi.error("Erreur survenu.");
        }
    

    // const enregistrement = () => {
    //     setLoading(true);
    //     axios.post("http://localhost:8080/anonyme/transfert", state, { headers }).then(
    //         (success) => {
    //             listTransfert();
    //             console.log("Données envoyées : ", JSON.stringify(state, null, 2));
    //             messageApi.success({ content: success.data, style: { color: 'green' } });
    //             setLoading(false);
    //             setIsModalVisible(false); // Fermer le modal
    //         },
    //         (error) => {
    //             console.log(error);
    //             handleApiError();
    //             setLoading(false);
    //         }
    //     );
    // };

    const enregistrement = () => {
      setLoading(true);
  
      // Préparer les articles visibles uniquement
      const filteredState = {
          ...state,
          articles: state.articles.map(article => ({
              id: article.id,
              code_barre: article.code_barre,
              description: article.description,
              quantite: article.quantite,
          }))
      };
  
      axios.post("http://localhost:8080/anonyme/transfert", filteredState, { headers }).then(
          (success) => {
              listTransfert();
              console.log("Données envoyées : ", JSON.stringify(filteredState, null, 2));
              messageApi.success({ content: success.data, style: { color: 'green' } });
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
  
    

    // const modifier = () => {
    //     setLoading(true);
    //     axios.put("http://localhost:8080/anonyme/transfert/" + state.id, state, { headers }).then(
    //         (success) => {
    //             listTransfert();
    //             messageApi.success("transfert modifier avec succes");
    //             setLoading(false);
    //             setIsModalVisible(false); // Fermer le modal
    //         },
    //         (error) => {
    //             console.log(error);
    //             handleApiError();
    //             setLoading(false);
    //         }
    //     );
    // };

    const modifier = () => {
      setLoading(true);
  
      // Préparer les articles visibles uniquement
      const filteredState = {
          ...state,
          articles: state.articles.map(article => ({
              id: article.id,
              code_barre: article.code_barre,
              description: article.description,
              quantite: article.quantite,
          }))
      };
  
      axios.put("http://localhost:8080/anonyme/transfert/" + state.id, filteredState, { headers }).then(
          (success) => {
              listTransfert();
              messageApi.success("transfert modifié avec succès");
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
  

    const listTransfert = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/transfert",{headers}).then(
            (success) => {
                setTransfert(success.data);
                console.log(transfert);
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
            axios.delete("http://localhost:8080/anonyme/transfert/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listTransfert();
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

    
    

    const columnsTransfert = [
          {
            title: 'Site Origine',
            key: 'siteOrigine',
            render: (text, record) => {
              // Vérifie si uniteMesures est défini et a un nom
              return record.siteOrigine && record.siteOrigine.nom ? record.siteOrigine.nom : 'Inconnue';
          },
        },
          {
            title: 'Site Transferer',
            key: 'siteTransferer',
            render: (text, record) => {
              // Vérifie si uniteMesures est défini et a un nom
              return record.siteTransferer && record.siteTransferer.nom ? record.siteTransferer.nom : 'Inconnue';
          },
        },
        {
            title: 'Quantite',
            dataIndex: 'quantite',
            key: 'quantite',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                {/* <Button
                    icon={<EditOutlined />}
                    onClick={() => showModal(record)}
                    style={{ color: "blue" }}
                /> */}
                
                
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

    const filteredArticle = articles.filter(article => article.sites.id === state.site_origine_id);
    const columns = [
      
      {
        title: "Article",
        dataIndex: "code_barre",
        key: "code_barre"
      },  
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },  
      {
        title: 'Site',
        key: 'site',
        render: (text, record) => {
          return record.sites && record.sites.nom ? record.sites.nom : 'Inconnue';
      },
    }, 
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite"
    },
    {
      title: "Quantité Minimale",
      dataIndex: "seuil_minimum",
      key: "seuil_minimum"
    }
    ];

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <h1 style={{ color: '#1890ff' }}>Gestion des transferts</h1>
            {contextHolder}
            <div style={{ marginBottom: '20px' }}>
                <Space>
                    {/* Ajouter */}
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal(false)} // Ouvre le modal pour ajouter
                    />
                </Space>
            </div>

            
            <Modal
                title={isEditing ? "Modifier le transfert" : "Faire un transfert vers un site"}
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
                        {loading ? <ClipLoader size={20} color={"#ffffff"} /> : (isEditing ? "Enregistrer" : "Transferer")}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                    label="Site d'origine"
                    name="site_origine_id"
                    rules={[{ required: true, message: "Veuillez sélectionner un site d'origine" }]}
                    >

                          <Select
                              placeholder="Sélectionnez un site d'origine"
                              showSearch
                              onChange={(value) => {
                                  setState({ ...state, site_origine_id: value });
                                  const filteredArticles = articles.filter(article => article.sites.id === value);
                                  setState(prevState => ({ ...prevState, articles: filteredArticles }));
                              }}
                              optionFilterProp="children"
                          >
                              {site.map((sit) => (
                                  <Select.Option key={sit.id} value={sit.id}>
                                      {sit.nom}
                                  </Select.Option>
                              ))}
                          </Select>

                        {/* <Select 
                            placeholder="Sélectionnez un site d'origine" 
                            showSearch 
                            onChange={(value) => setState({ ...state, site_origine_id: value })}
                            optionFilterProp="children"
                            >
                            {site.map((sit) => (
                            <Select.Option key={sit.id} value={sit.id}>
                                {sit.nom}
                            </Select.Option>
                            ))}
                        </Select> */}
                    </Form.Item>

                    <Divider dashed>Articles</Divider>

                    <Table
                          dataSource={state.articles}  // Utilisation de state.articles au lieu de filteredArticle
                          columns={columns}
                          pagination={false}
                          rowKey="id"
                      />


                  <Divider dashed />

                  <Form.Item
                    label="Transferer vers ce site"
                    name="site_tranferer_id"
                    rules={[{ required: true, message: "Veuillez sélectionner le site vers lequel transferer" }]}
                    >
                        <Select 
                            placeholder="Sélectionnez un site de transfert" 
                            showSearch 
                            onChange={(value) => setState({ ...state, site_tranferer_id: value })}
                            optionFilterProp="children"
                            >
                            {site.map((sit) => (
                            <Select.Option key={sit.id} value={sit.id}>
                                {sit.nom}
                            </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Quantite"
                        name="quantite"
                        rules={[{ required: true, message: "Veuillez entrer la quantite a transferer" }]}
                    >
                        <InputNumber
                          min={1}
                          onChange={(value) => setState({ ...state, quantite: value })}
                        />
                    </Form.Item>

                </Form>
            </Modal>
            <h3>Liste des transferts</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table 
                dataSource={transfert}
                columns={columnsTransfert} 
                rowKey="id" 
                
                />
            </Spin>
        </div>
    );
}
