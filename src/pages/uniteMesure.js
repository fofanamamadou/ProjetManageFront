import React, { useEffect, useState } from 'react';
import { Button, Input, message, Table, Spin, Modal, Form, Space, Popconfirm } from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"; // Import des icônes

export default function Unite() {
    const [messageApi, contextHolder] = message.useMessage();
    const [state, setState] = useState({ id: null, nom: "" });
    const [unite, setUnite] = useState([]);
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
        listunite();
    }, []);

    const showModal = (isEdit = false, record = null) => {
        setIsEditing(isEdit);
        setState(isEdit && record ? record : { id: null, nom: "" });
        form.resetFields(); // Ajout de resetFields pour éviter les résidus
        form.setFieldsValue(isEdit && record ? { nom: record.nom } : {});
        setIsModalVisible(true);
    };
    
    

    const handleApiError = () => {
            messageApi.error("Erreur survenu.");
        }
    

    const enregistrement = () => {
        setLoading(true);
        axios.post("http://localhost:8080/anonyme/unite", state, { headers }).then(
            (success) => {
                listunite();
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
        axios.put("http://localhost:8080/anonyme/unite/" + state.id, state, { headers }).then(
            (success) => {
                listunite();
                messageApi.success("unite modifier avec succes");
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

    const listunite = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/unite",{headers}).then(
            (success) => {
                setUnite(success.data);
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
            axios.delete("http://localhost:8080/anonyme/unite/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listunite();
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

    const filteredunite = unite.filter(unite => unite.nom.toLowerCase().includes(searchText.toLowerCase()));
    

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
                    onClick={() => showModal(record)}
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
            <h1 style={{ color: '#1890ff' }}>Gestion des unites</h1>
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
                title={isEditing ? "Modifier le unite" : "Ajouter un unite"}
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
                        label="Unite de mesure"
                        name="nom"
                        rules={[{ required: true, message: "Veuillez entrer l'unite de mesure" }]}
                    >
                        <Input onChange={(e) => setState({ ...state, nom: e.target.value })} />
                    </Form.Item>
                </Form>
            </Modal>
            <h3>Liste des unites</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table 
                dataSource={filteredunite}
                columns={columns} 
                rowKey="id" 
                
                />
            </Spin>
        </div>
    );
}
