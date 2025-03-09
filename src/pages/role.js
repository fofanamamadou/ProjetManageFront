import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm, Row, Col } from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import des icônes

export default function Role() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, nom: "", description:"" });
    const [role, setRole] = useState([]);
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
        listRole();
    }, []);

    const showAddModal = () => {
        setIsEditing(false);
        setState({ id: null, nom: "", description:"" }); // Réinitialiser l'état pour un nouvel ajout
        form.resetFields(); // Réinitialiser le formulaire
        setIsModalVisible(true);
    };
    
    const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({ nom: record.nom, description: record.description}); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };

    const handleApiError = () => {
            messageApi.error("Erreur survenu.");
        }
    

    const enregistrement = () => {
        setLoading(true);
        axios.post("http://localhost:8080/anonyme/role", state, { headers }).then(
            (success) => {
                listRole();
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
        axios.put("http://localhost:8080/anonyme/role/" + state.id, state, { headers }).then(
            (success) => {
                listRole();
                messageApi.success("role modifier avec succes");
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

    const listRole = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/role",{headers}).then(
            (success) => {
                setRole(success.data);
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
            axios.delete("http://localhost:8080/anonyme/role/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listRole();
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

    const filteredrole = role.filter(role => role.nom.toLowerCase().includes(searchText.toLowerCase()));

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
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
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => showEditModal(record)}
                    />
                    
                    
                    <Popconfirm
                        title={`Confirmer la suppression de "${record.nom}" ?`}
                        onConfirm={() => suppression(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <h1 style={{ color: '#1890ff' }}>Gestion des roles</h1>
            {contextHolder}
            <Modal
                title={isEditing ? "Modifier le role" : "Ajouter un role"}
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
                    <Row gutter={16}>
                        <Col span={12} >
                            <Form.Item
                                label="Nom"
                                name="nom"
                                rules={[{ required: true, message: "Veuillez le nom du role" }]}
                            >
                                <Input onChange={(e) => setState({ ...state, nom: e.target.value })} />
                            </Form.Item>
                        </Col>

                        <Col span={12} >
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: "Veuillez le nom du role" }]}
                            >
                                <Input onChange={(e) => setState({ ...state, description: e.target.value })} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
                <Button type="primary" style={{ marginBottom: '20px' }} onClick={showAddModal}>
                    Ajouter un role
                </Button>
            <h3>Liste des roles</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredrole} columns={columns} rowKey="id" />
            </Spin>
        </div>
    );
}
