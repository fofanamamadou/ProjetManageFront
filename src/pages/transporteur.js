import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm } from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import des icônes

export default function Transporteur() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, nom: "" });
    const [transporteur, setTransporteur] = useState([]);
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
        listTransporteur();
    }, []);

    const showAddModal = () => {
        setIsEditing(false);
        setState({ id: null, nom: "" }); // Réinitialiser l'état pour un nouvel ajout
        form.resetFields(); // Réinitialiser le formulaire
        setIsModalVisible(true);
    };
    
    const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({ nom: record.nom}); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };

    const handleApiError = () => {
            messageApi.error("Erreur survenu.");
        }
    

    const enregistrement = () => {
        setLoading(true);
        axios.post("http://localhost:8080/anonyme/transporteur", state, { headers }).then(
            (success) => {
                listTransporteur();
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
        axios.put("http://localhost:8080/anonyme/transporteur/" + state.id, state, { headers }).then(
            (success) => {
                listTransporteur();
                messageApi.success("transporteur modifier avec succes");
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

    const suppression = (id) => {
            setLoading(true);
            axios.delete("http://localhost:8080/anonyme/transporteur/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listTransporteur();
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

    const filteredtransporteur = transporteur.filter(transporteur => transporteur.nom.toLowerCase().includes(searchText.toLowerCase()));

    const columns = [
        {
            title: 'nom',
            dataIndex: 'nom',
            key: 'nom',
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
            <h1 style={{ color: '#1890ff' }}>Gestion des transporteurs</h1>
            {contextHolder}
            <Modal
                title={isEditing ? "Modifier le transporteur" : "Ajouter un transporteur"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
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
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Nouvelle option d'envoie"
                        name="nom"
                        rules={[{ required: true, message: "Veuillez la nouvelle option d'envoie" }]}
                    >
                        <Input onChange={(e) => setState({ ...state, nom: e.target.value })} />
                    </Form.Item>
                </Form>
            </Modal>
                <Button type="primary" style={{ marginBottom: '20px' }} onClick={showAddModal}>
                    Ajouter un transporteur
                </Button>
            <h3>Liste des transporteurs</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredtransporteur} columns={columns} rowKey="id" />
            </Spin>
        </div>
    );
}
