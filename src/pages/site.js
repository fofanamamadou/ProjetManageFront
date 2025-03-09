import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm } from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import des icônes

export default function Site() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, nom: "" , adresse: "", description: ""});
    const [site, setSite] = useState([]);
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
        listSite();
    }, []);

    const showAddModal = () => {
        setIsEditing(false);
        setState({ id: null, nom: "" , adresse: "", description: ""}); // Réinitialiser l'état pour un nouvel ajout
        form.resetFields(); // Réinitialiser le formulaire
        setIsModalVisible(true);
    };
    
    const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({ nom: record.nom, adresse: record.adresse, description : record.description}); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };

    const handleApiError = () => {
            messageApi.error("Erreur survenu.");
        }
    

    const enregistrement = () => {
        setLoading(true);
        axios.post("http://localhost:8080/anonyme/site", state, { headers }).then(
            (success) => {
                listSite();
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
    

    const modifier = () => {
        setLoading(true);
        axios.put("http://localhost:8080/anonyme/site/" + state.id, state, { headers }).then(
            (success) => {
                listSite();
                messageApi.success("Site modifier avec succes");
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

    const suppression = (id) => {
            setLoading(true);
            axios.delete("http://localhost:8080/anonyme/site/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listSite();
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

    const filteredsite = site.filter(site => site.nom.toLowerCase().includes(searchText.toLowerCase()));

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'adresse',
            dataIndex: 'adresse',
            key: 'adresse',
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
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

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <h1 style={{ color: '#1890ff' }}>Gestion des sites</h1>
            {contextHolder}
            <Modal
                title={isEditing ? "Modifier le site" : "Ajouter un site"}
                visible={isModalVisible}
                width={600} // Taille optimisée
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
                    <Form.Item
                    label="Nom du site"
                    name="nom"
                    rules={[{ required: true, message: "Veuillez entrer le nom du site" }]}
                    >
                    <Input placeholder="Exemple : Site Alpha" onChange={(e) => setState({ ...state, nom: e.target.value })} />
                    </Form.Item>

                    <Form.Item
                    label="Adresse du site"
                    name="adresse"
                    >
                    <Input placeholder="Exemple : 123 Rue du Site" onChange={(e) => setState({ ...state, adresse: e.target.value })} />
                    </Form.Item>

                    <Form.Item
                    label="Description du site"
                    name="description"
                    >
                    <Input.TextArea 
                        placeholder="Décrivez brièvement le site" 
                        rows={3} 
                        onChange={(e) => setState({ ...state, description: e.target.value })} 
                    />
                    </Form.Item>
                </Form>
                </Modal>
                
                <Button type="primary" style={{ marginBottom: '20px' }} onClick={showAddModal}>
                    Ajouter un site
                </Button>
            <h3>Liste des sites</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredsite} columns={columns} rowKey="id" />
            </Spin>
        </div>
    );
}
