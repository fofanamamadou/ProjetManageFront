import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm, Row, Col,Divider} from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons"; // Import des icônes
export default function Categorie() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, nom: "", description:"" });
    const [stateSousCat, setStateSousCat] = useState({ id: null, nom_sous: "", description_sous:"", categorie_id:null });
    const [categorie, setCategorie] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchTextSousCat, setSearchTextSousCat] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSousCat, setLoadingSousCat] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [loadingTableSousCat, setLoadingTableSousCat] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleSousCat, setIsModalVisibleSousCat] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingSousCat, setIsEditingSousCat] = useState(false);
    const [form] = Form.useForm();
    const [selectedCategorie, setSelectedCategorie] = useState(null); // Catégorie sélectionnée



    const [formSousCat] = Form.useForm();
    const headers = {
        "Content-Type": "application/json",
        'Authorization': "Basic " + localStorage.getItem("token")
      };

    useEffect(() => {
        listCategorie();
        listSousCategorie();
        document.title = "Gestion des Catégories";
    }, []);

    const showAddModal = () => {
        setIsEditing(false);
        setState({ id: null, nom: "", description:"" }); // Réinitialiser l'état pour un nouvel ajout
        form.resetFields(); // Réinitialiser le formulaire
        setIsModalVisible(true);
    };

    const handleRowClick = (record) => {
        setSelectedCategorie(record); // Met à jour la catégorie sélectionnée
        listSousCategorie(record.id); // Charge les sous-catégories liées
    };
    
    

    const showAddModalSousCat = () => {
        if (!selectedCategorie) {
            messageApi.error("Veuillez sélectionner une catégorie pour ajouter une sous-catégorie.");
            return;
        }
    
        setIsEditingSousCat(false);
        setStateSousCat({
            id: null,
            nom_sous: "",
            description_sous: "",
            categorie_id: selectedCategorie.id, // ID de la catégorie sélectionnée
        });
        formSousCat.resetFields(); // Réinitialiser le formulaire
        setIsModalVisibleSousCat(true); // Afficher le modal
    };
    
    
    
    

    const showEditModalSousCat = (recordSous) => {
        setIsEditingSousCat(true);
        setStateSousCat(recordSous); // Charger les données à modifier
        formSousCat.setFieldsValue({ nom_sous: recordSous.nom_sous, description_sous: recordSous.description_sous }); // Remplir le formulaire avec les données existantes
    };

    const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données de la catégorie
        form.setFieldsValue({ nom: record.nom, description: record.description }); // Remplir le formulaire
        setIsModalVisible(true);
    
        // Charger les sous-catégories liées à cette catégorie
        listSousCategorie(record.id); // Ajout du filtre par catégorie
    };
    
    
    const enregistrement = () => {
        setLoading(true);
        axios
            .post("http://localhost:8080/anonyme/categorie", state, { headers })
            .then((success) => {
                const newCategoryId = success.data.id; // Récupérer l'ID de la réponse
                setSelectedCategorie({ ...state, id: newCategoryId }); // Mettre à jour la catégorie sélectionnée
                listCategorie(); // Recharger la liste des catégories
                messageApi.success({ content: success.data.message, style: { color: "green" } });
                setLoading(false);
                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error(error);
                messageApi.error({ content: error.data || "Erreur lors de l'ajout." });
                setLoading(false);
            });
    };
    
    
    
    

    const enregistrementSousCat = () => {
        if (!stateSousCat.categorie_id) {
            messageApi.error("Impossible d'ajouter une sous-catégorie : aucune catégorie associée.");
            return;
        }
        setLoadingSousCat(true);
        axios
            .post("http://localhost:8080/anonyme/sousCategorie", stateSousCat, { headers })
            .then((response) => {
                messageApi.success({ content: response.data, style: { color: "green" } });
                listSousCategorie(stateSousCat.categorie_id); // Recharger les sous-catégories
                setLoadingSousCat(false);
                setIsModalVisibleSousCat(false); // Fermer le modal
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout de la sous-catégorie :", error);
                messageApi.error({ content: error.response?.data || "Erreur lors de l'ajout." });
                setLoadingSousCat(false);
            });
    };
    
    
    
    
    
    const modifierSousCat = () => {
        setLoading(true);
        axios.put("http://localhost:8080/anonyme/sousCategorie/" + stateSousCat.id, stateSousCat, { headers }).then(
            (success) => {
                listSousCategorie();
                messageApi.success({ content: success.data, style: { color: 'green' } });
                setLoadingSousCat(false);
            },
            (error) => {
                console.log(error);
                messageApi.error({ content: error.data });
                setLoadingSousCat(false);
            }
        );
    };

    const modifier = () => {
        setLoading(true);
        axios.put("http://localhost:8080/anonyme/categorie/" + state.id, state, { headers }).then(
            (success) => {
                console.log(success);
                listCategorie();
                messageApi.success("Modification effectue avec success");
                setLoading(false);
                setIsModalVisible(false); // Fermer le modal
            },
            (error) => {
                console.log(error);
                messageApi.error({ content: error.data });
                setLoading(false);
            }
        );
    };

    const listCategorie = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/categorie",{headers}).then(
            (success) => {
                setCategorie(success.data);
                setLoadingTable(false);
            },
            (error) => {
                console.log(error);
                setLoadingTable(false);
            }
        );
    };


    //Liste des sous categories par categorie
    const listSousCategorie = (categorieId) => {
        if (!categorieId) return; // Si aucun ID n'est fourni, ne faites rien
        setLoadingSousCat(true);
        axios.get(`http://localhost:8080/anonyme/sousCategorie/categorie/${categorieId}`, { headers })
            .then((response) => {
                setSousCategories(response.data);
                setLoadingSousCat(false);
            })
            .catch((error) => {
                console.error(error);
                setLoadingSousCat(false);
            });
    };
    
    
    
    const suppression = (id) => {
            setLoading(true);
            axios.delete("http://localhost:8080/anonyme/categorie/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listCategorie();
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            );
        
    };

    const suppressionSousCat = (id) => {
       
            setLoadingSousCat(true);
            axios.delete("http://localhost:8080/anonyme/sousCategorie/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listSousCategorie();
                    setLoadingSousCat(false);
                },
                (error) => {
                    console.log(error);
                    setLoadingSousCat(false);
                }
            );
    
    };


    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Sous-Catégories",
            key: "SousCatégories",
            render: (text, record) => (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => {
                            handleRowClick(record); // Sélectionner la catégorie
                            showAddModalSousCat();
                
                        }}
                        style={{ fontSize: '18px', color: "green" }}
                    />
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} style={{ color: "blue" }} />
                    <Popconfirm
                        title={`Confirmer la suppression de "${record.nom}" ?`}
                        onConfirm={() => suppression(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    
    
    
    const columnsSousCat = [
        {
            title: 'Nom de la sous categorie',
            dataIndex: 'nom_sous',
            key: 'nom_sous',
        },
        {
            title: 'Description de la sous categorie',
            dataIndex: 'description_sous',
            key: 'description_sous',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, recordSous) => (
                <Space size="middle">

                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showEditModalSousCat(recordSous)}
                        style={{ color: "blue" }}
                    />
                    
                    
                    <Popconfirm
                        title={`Confirmer la suppression de "${recordSous.nom_sous}" ?`}
                        onConfirm={() => suppressionSousCat(recordSous.id)}
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

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            
            <h1 style={{ color: '#1890ff' }}>Gestion des catégories</h1>
            {contextHolder}
            <div style={{ marginBottom: '20px' }}>
                <Space>
                    {/* Ajouter */}
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}
                    />
                </Space>
            </div>
            {/* Modal Categorie */}
            <Modal
            title={isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}
            visible={isModalVisible}
            width={500} // Taille optimisée
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
                >
                    {loading ? <ClipLoader size={20} color={"#ffffff"} /> : isEditing ? "Enregistrer" : "Ajouter"}
                </Button>
                </div>
            }
            style={{ maxHeight: "80vh", overflowY: "auto" }} // Ajout du scroll automatique
            >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                    label="Nom"
                    name="nom"
                    rules={[{ required: true, message: "Veuillez entrer le nom de la catégorie" }]}
                    >
                    <Input placeholder="Exemple : Électronique" onChange={(e) => setState({ ...state, nom: e.target.value })} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Description" name="description">
                    <Input.TextArea 
                        placeholder="Ajoutez une description (facultatif)" 
                        rows={2} 
                        onChange={(e) => setState({ ...state, description: e.target.value })} 
                    />
                    </Form.Item>
                </Col>
                </Row>
            </Form>
            </Modal>
            {/* Modal Sous Categorie */}

            <Modal
            title={isEditingSousCat ? "Modifier la sous-catégorie" : "Ajouter une sous-catégorie"}
            visible={isModalVisibleSousCat}
            width={600} // Taille optimisée
            onCancel={() => setIsModalVisibleSousCat(false)}
            footer={
                <div style={{ textAlign: "right", marginTop: 10 }}>
                <Button key="cancel" onClick={() => setIsModalVisibleSousCat(false)}>
                    Annuler
                </Button>
                <Button
                    key="submit"
                    type="primary"
                    loading={loadingSousCat}
                    onClick={isEditingSousCat ? modifierSousCat : enregistrementSousCat}
                    style={{ marginLeft: 10 }}
                    
                >
                    {loadingSousCat ? <ClipLoader size={20} color={"#ffffff"} /> : isEditingSousCat ? "Enregistrer" : "Ajouter"}
                </Button>
                </div>
            }
            
            >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                    label="Nom"
                    name="nom_sous"
                    rules={[{ required: true, message: "Veuillez entrer le nom de la sous-catégorie" }]}
                    >
                    <Input placeholder="Exemple : Smartphones" onChange={(e) => setStateSousCat({ ...stateSousCat, nom_sous: e.target.value })} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Description" name="description_sous">
                    <Input.TextArea 
                        placeholder="Ajoutez une description (facultatif)" 
                        rows={2} 
                        onChange={(e) => setStateSousCat({ ...stateSousCat, description_sous: e.target.value })} 
                    />
                    </Form.Item>
                </Col>
                </Row>
            </Form>

            <h3 style={{ marginTop: 20 }}>
                Sous-catégories de : <strong>{selectedCategorie?.nom || "Sélectionnez une catégorie"}</strong>
            </h3>

            <Spin spinning={loadingSousCat}>
                <Table
                dataSource={sousCategories}
                columns={columnsSousCat}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                />
            </Spin>
            </Modal>

            <h3>Liste des catégories</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table
                    dataSource={categorie}
                    columns={columns}
                    rowKey="id"
                />

            </Spin>


        </div>
    );
}
