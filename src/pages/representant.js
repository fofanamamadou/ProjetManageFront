import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm } from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import des icônes

export default function Representant() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, nom_representant: "" });
    const [representant, setRepresentant] = useState([]);
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
        listRepresentant();
    }, []);

    const showAddModal = () => {
        setIsEditing(false);
        setState({ id: null, nom_representant: "" }); // Réinitialiser l'état pour un nouvel ajout
        form.resetFields(); // Réinitialiser le formulaire
        setIsModalVisible(true);
    };
    
    const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({ nom_representant: record.nom_representant}); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };

    const handleApiError = () => {
            messageApi.error("Erreur survenu.");
        }
    

    const enregistrement = () => {
        setLoading(true);
        axios.post("http://localhost:8080/anonyme/representant", state, { headers }).then(
            (success) => {
                listRepresentant();
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
        axios.put("http://localhost:8080/anonyme/representant/" + state.id, state, { headers }).then(
            (success) => {
                listRepresentant();
                messageApi.success("representant modifier avec succes");
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

    const listRepresentant = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/representant",{headers}).then(
            (success) => {
                setRepresentant(success.data);
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
            axios.delete("http://localhost:8080/anonyme/representant/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listRepresentant();
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

    const filteredRepresentant = representant.filter(representant => representant.nom_representant.toLowerCase().includes(searchText.toLowerCase()));

    const columns = [
        {
            title: 'nom',
            dataIndex: 'nom_representant',
            key: 'nom_representant',
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
            <h1 style={{ color: '#1890ff' }}>Gestion des representants</h1>
            {contextHolder}
            <Modal
                title={isEditing ? "Modifier le representant" : "Ajouter un representant"}
                visible={isModalVisible}
                width={350}
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
                        label="Nouveau representant"
                        name="nom_representant"
                        rules={[{ required: true, message: "Veuillez entrer le nouveau representant" }]}
                    >
                        <Input onChange={(e) => setState({ ...state, nom_representant: e.target.value })} />
                    </Form.Item>
                </Form>
            </Modal>
                <Button type="primary" style={{ marginBottom: '20px' }} onClick={showAddModal}>
                    Ajouter un representant
                </Button>
            <h3>Liste des representants</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredRepresentant} columns={columns} rowKey="id" />
            </Spin>
        </div>
    );
}
