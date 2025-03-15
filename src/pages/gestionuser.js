import React, { useEffect, useState } from 'react';
import { Button, Input, message, Divider, Table, Popconfirm, Form, Row, Col, Modal, Select, Spin, Space} from 'antd';
import { UserSwitchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import des icônes nécessaires

import axios from 'axios';
import 'antd/dist/reset.css';
import { ClipLoader } from 'react-spinners';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function Gestionuser() {
    const [messageApi, contextHolder] = message.useMessage();
    let utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
    const [form] = Form.useForm();
    const [state, setState] = useState({
        id: null,
        nom: "",
        prenom: "",
        telephone: "",
        mot_de_passe: "",
        roles: "ROLE_USERS"
    });
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUtilisateur, setselectedUtilisateur] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const headers = {
        "Content-Type": "application/json",
        'Authorization': "Basic " + localStorage.getItem("token")
      };

    useEffect(() => {
        listUtilisateurs();
        listRoles();
    }, []);

    const listUtilisateurs = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/utilisateur").then(
            (success) => {
                const sortedUtilisateurs = success.data.sort((a, b) => new Date(b.dateajout) - new Date(a.dateajout));
                setUtilisateurs(sortedUtilisateurs);
                setLoadingTable(false);
            },
            (error) => {
                console.log('Error:', error);
                setLoadingTable(false);
            }
        );
    };

    const listRoles = () => {
        axios.get("http://localhost:8080/anonyme/role").then(
            (success) => {
                setRoles(success.data);
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    };

    const enregistrement = () => {
        setLoading(true);
        axios.post("http://localhost:8080/anonyme/utilisateur", state, { headers}).then(
            (success) => {
                listUtilisateurs();
                messageApi.open({
                    type: 'success',
                    content: 'utilisateur ajouté avec succès',
                });
                form.resetFields();
                setState({
                    id: null,
                    nom: "",
                    prenom: "",
                    telephone: "",
                    mot_de_passe: "",
                    roles: "ROLE_USERS"
                });
                setIsModalVisible(false);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Erreur lors de l\'ajout de l\'utilisateur',
                });
                setLoading(false);
            }
        );
    };

    const modification = () => {
        setLoading(true);
        const headers = {
            "Content-Type": "application/json",
        };
        const HEADERS = { 'Authorization': "Basic " + localStorage.getItem("token") };
        const updatedState = {
            ...state,
            roles: state.roles.map(role => role.id)
        };
        axios.put("http://localhost:8080/anonyme/utilisateur/" + state.id, updatedState, { headers: HEADERS }).then(
            (success) => {
                listUtilisateurs();
                messageApi.open({
                    type: 'success',
                    content: 'utilisateur modifié avec succès',
                });
                form.resetFields();
                setState({
                    id: null,
                    nom: "",
                    prenom: "",
                    telephone: "",
                    mot_de_passe: "",
                    roles: "ROLE_USERS"
                });
                setIsModalVisible(false);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Erreur lors de la modification de l\'utilisateur',
                });
                setLoading(false);
            }
        );
    };

    const suppression = (id) => {
        setLoading(true);
        axios.delete(`http://localhost:8080/anonyme/utilisateur/${id}`).then(
            (success) => {
                messageApi.success({ content: success.data });
                listUtilisateurs();
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setLoading(false);
            }
        );
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleEditRoles = (utilisateur) => {
        setselectedUtilisateur(utilisateur);
        setIsEditModalVisible(true);
    };

    const handleSaveRoles = () => {
        const headers = {
            "Content-Type": "application/json",
        };
        axios.post(`http://localhost:8080/anonyme/donnerRole/${selectedUtilisateur.id}`, selectedUtilisateur.roles.map(role => ({ id: role.id })), { headers }).then(
            (success) => {
                listUtilisateurs();
                messageApi.open({
                    type: 'success',
                    content: 'Rôles modifiés avec succès',
                });
                setIsEditModalVisible(false);
            },
            (error) => {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Erreur lors de la modification des rôles',
                });
            }
        );
    };

    const filteredUtilisateurs = utilisateurs.filter(emp =>
        emp.nom.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.telephone.toLowerCase().includes(searchText.toLowerCase())
    );
    const columns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
        },
        {
            title: 'Date derniere connection',
            dataIndex: 'derniere_connexion',
            key: 'derniere_connexion',
        },
        {
            title: 'Rôles',
            dataIndex: 'roles',
            key: 'roles',
            render: (_, record) => record.roles.map(role => role.nom).join(", ")
        },
        {
            title: 'Date d\'ajout',
            dataIndex: 'date_ajout',
            key: 'date_ajout',
            render: (text) => new Date(text).toLocaleDateString('fr-FR')
        },
        {
            title: 'Modifier les rôles',
            key: 'edit_roles',
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <UserSwitchOutlined
                    style={{ fontSize: "20px", color: "orange", cursor: "pointer" }}
                    onClick={() => handleEditRoles(record)}
                />

                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                <EditOutlined
                    style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                    onClick={() => {
                        form.setFieldsValue({
                            nom: record.nom,
                            prenom: record.prenom,
                            telephone: record.telephone,
                        });
                        setState(record);
                        setIsModalVisible(true);
                    }}
                />

                <Popconfirm
                    title="Confirmez-vous la suppression ?"
                    onConfirm={() => suppression(record.id)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <DeleteOutlined
                        style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                    />
                </Popconfirm>
            </Space>
            )
        }
    ];

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
            <h1 style={{ color: '#1890ff' }}>Gestion des utilisateurs</h1>
            {contextHolder}
            <Button type="primary" onClick={() => setIsModalVisible(true)}>Ajouter un utilisateur</Button>
            <Modal
                title={state.id === null ? "Ajouter un utilisateur" : "Modifier un utilisateur"}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false); form.resetFields(); setState({
                        id: null,
                        nom: "",
                        prenom: "",
                        telephone: "",
                        mot_de_passe: "",
                        roles: "ROLE_USERS"
                    });
                }}
                footer={null}
            >
                <Form form={form} layout="vertical" initialValues={state}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Nom"
                                name="nom"
                                rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
                            >
                                <Input
                                    value={state.nom}
                                    onChange={(e) => setState({ ...state, nom: e.target.value })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Prénom"
                                name="prenom"
                                rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}
                            >
                                <Input
                                    value={state.prenom}
                                    onChange={(e) => setState({ ...state, prenom: e.target.value })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Téléphone"
                                name="telephone"
                                rules={[{ required: true, message: 'Veuillez entrer le numéro de téléphone' }]}
                            >
                                <PhoneInput
                                    international
                                    defaultCountry="ML"
                                    value={state.telephone}
                                    onChange={(value) => setState({ ...state, telephone: value })}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        {state.id === null && (
                            <Col span={12}>
                                <Form.Item
                                    label="Mot de passe"
                                    name="mot_de_passe"
                                    rules={[{ required: true, message: 'Veuillez entrer le mot de passe' }]}
                                >
                                    <Input.Password
                                        value={state.mot_de_passe}
                                        onChange={(e) => setState({ ...state, mot_de_passe: e.target.value })}
                                    />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Form.Item>
                        {state.id === null ?
                            <Button type="primary" onClick={enregistrement} disabled={loading}>
                                {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Ajouter"}
                            </Button>
                            :
                            <Button type="primary" onClick={modification} disabled={loading}>
                                {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Modifier"}
                            </Button>
                        }
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Modifier les rôles de l'utilisateur"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsEditModalVisible(false)}>
                        Annuler
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSaveRoles}>
                        Enregistrer
                    </Button>
                ]}
            >
                <Select
                    mode="multiple"
                    value={selectedUtilisateur?.roles.map(role => role.id)}
                    onChange={(value) => {
                        const updatedRoles = value.map(roleId => roles.find(role => role.id === roleId));
                        setselectedUtilisateur({ ...selectedUtilisateur, roles: updatedRoles });
                    }}
                    style={{ width: '100%' }}
                >
                    {roles.map(role => (
                        <Select.Option key={role.id} value={role.id}>
                            {role.nom}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
            <Divider>Liste des utilisateurs</Divider>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table columns={columns} dataSource={filteredUtilisateurs} rowKey="id" />
            </Spin>
        </div>
    );
}
