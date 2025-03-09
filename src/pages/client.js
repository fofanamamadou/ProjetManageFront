import { Button, Form, Input, Modal, Row, Col, message, Space, Spin, Popconfirm,Table, Select, Tooltip} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined, FolderOpenOutlined, PlusOutlined } from "@ant-design/icons"; // Import des icônes
import Representation from './representant';

export default function Client() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsModalRepresentant, setIsModalRepresentant] = useState(false);
  const [state, setState] = useState({ id: null,  nom: "",adresse_expedition: "",adresse_facturation: "",autrui: "",code_postal: "",email: "",etat_province: "",numero_fax: "",prenom_autrui: "",telephone: "",telephone_second: "",ville_pays: "", note :"", representant_id :null});
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [client, setClient] = useState([]);
  const [representant, setRepresentant] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm(); // Utiliser un formulaire contrôlé
  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Basic " + localStorage.getItem("token")
  };

  useEffect(() => {
    listClient();
    listRepresentant();
    document.title = "Gestion des Clients";
}, [IsModalRepresentant]);

  const showAddModal = () => {
    setIsEditing(false);
    setState({ id: null, nom: "" , adresse_expedition: "",adresse_facturation: "",autrui: "",code_postal: "",email: "",etat_province: "",numero_fax: "",prenom_autrui: "",telephone: "",telephone_second: "",ville_pays: "", representant_id :null}); // Réinitialiser l'état pour un nouvel ajout
    form.resetFields(); // Réinitialiser le formulaire
    setIsModalVisible(true);
};
  const showEditModal = (record) => {
        setIsEditing(true);
        setState({id: record.id, note: record.note, nom: record.nom, adresse_expedition: record.adresse_expedition, adresse_facturation: record.adresse_facturation, autrui: record.autrui, code_postal: record.code_postal, email: record.email, etat_province: record.etat_province, numero_fax: record.numero_fax, prenom_autrui: record.prenom_autrui, telephone: record.telephone, telephone_second: record.telephone_second, ville_pays: record.ville_pays, representant_id: record.representants.id}); // Charger les données à modifier
        form.setFieldsValue({ nom: record.nom, note: record.note, adresse_expedition: record.adresse_expedition, adresse_facturation: record.adresse_facturation, autrui: record.autrui, code_postal: record.code_postal, email: record.email, etat_province: record.etat_province, numero_fax: record.numero_fax, prenom_autrui: record.prenom_autrui, telephone: record.telephone, telephone_second: record.telephone_second, ville_pays: record.ville_pays, representant_id: record.representants.id
        }); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };


    const handleApiError = () => {
        messageApi.error("Erreur survenu.");
    }

  const enregistrement = () => {
    setLoading(true);
    axios.post("http://localhost:8080/anonyme/client", state, { headers }).then(
        (success) => {
            listClient();
            messageApi.success({ content: success.data, style: { color: 'green' } });
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


    const modifier = () => {
        setLoading(true);
        axios.put("http://localhost:8080/anonyme/client/" + state.id, state, { headers }).then(
            (success) => {
                listClient();
                messageApi.success("client modifier avec succes");
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
    const listRepresentant = () => {
        axios.get("http://localhost:8080/anonyme/representant",{headers}).then(
            (success) => {
                setRepresentant(success.data);
            },
            (error) => {
                console.log(error);
                handleApiError();
            }
        );
    };

    const suppression = (id) => {
            setLoading(true);
            axios.delete("http://localhost:8080/anonyme/client/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listClient();
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

  const filteredClient = client.filter(client => client.nom.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Client',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Telephone',
            dataIndex: 'telephone',
            key: 'telephone',
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
    <>
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h1 style={{ color: '#1890ff' }}>Gestion des clients</h1>
         {contextHolder}
         <div style={{ marginBottom: '20px' }}>
             <Space>
                 {/* Ajouter */}
                 <Button
                     type="primary"
                     icon={<PlusOutlined />}
                     onClick={showAddModal} // Ouvre le modal pour ajouter
                 />
             </Space>
         </div>

      {/* Modal */}
      <Modal
        title={isEditing ? "Modifier le client" : "Ajouter un client"}
        visible={isModalVisible}
        width={720} // Taille optimisée
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
        style={{ maxHeight: "80vh", overflowY: "auto" }} // Ajout du scroll si nécessaire
        >
        <Form form={form} layout="vertical">
            <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                label="Nom du client :"
                name="nom"
                rules={[{ required: true, message: "Veuillez entrer le nom du client." }]}
                >
                <Input placeholder="Exemple : Société ABC" onChange={(e) => setState({ ...state, nom: e.target.value })} />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                label="Personne à contacter :"
                name="autrui"
                rules={[{ required: true, message: "Veuillez entrer la personne à contacter." }]}
                >
                <Input placeholder="Exemple : Untel" onChange={(e) => setState({ ...state, autrui: e.target.value })} />
                </Form.Item>
            </Col>
            </Row>

            <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                label="Prénom de la personne à contacter :"
                name="prenom_autrui"
                rules={[{ required: true, message: "Veuillez entrer le prénom de la personne à contacter." }]}
                >
                <Input placeholder="Exemple : Jean" onChange={(e) => setState({ ...state, prenom_autrui: e.target.value })} />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                label="Adresse postale de facturation :"
                name="adresse_facturation"
                >
                <Input placeholder="Exemple : 123 Rue des Affaires" onChange={(e) => setState({ ...state, adresse_facturation: e.target.value })} />
                </Form.Item>
            </Col>
            </Row>

            <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                label="Adresse postale d'expédition :"
                name="adresse_expedition"
                >
                <Input placeholder="Exemple : 456 Rue des Livraisons" onChange={(e) => setState({ ...state, adresse_expedition: e.target.value })} />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                label="Ville et Pays :"
                name="ville_pays"
                rules={[{ required: true, message: "Veuillez entrer la ville et le pays." }]}
                >
                <Input placeholder="Exemple : Bamako, Mali" onChange={(e) => setState({ ...state, ville_pays: e.target.value })} />
                </Form.Item>
            </Col>
            </Row>

            <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                label="État/Province :"
                name="etat_province"
                rules={[{ required: true, message: "Veuillez entrer l'État/Province." }]}
                >
                <Input placeholder="Exemple : District de Bamako" onChange={(e) => setState({ ...state, etat_province: e.target.value })} />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                label="Code postal :"
                name="code_postal"
                rules={[{ required: true, message: "Veuillez entrer le code postal." }]}
                >
                <Input placeholder="Exemple : 76017" onChange={(e) => setState({ ...state, code_postal: e.target.value })} />
                </Form.Item>
            </Col>
            </Row>

            {/* Téléphones */}
            <Row gutter={16}>
            <Col span={16}>
                <Form.Item
                label="Téléphone (principal) :"
                name="telephone"
                rules={[{ required: true, message: "Veuillez entrer un numéro valide." }]}
                >
                <Input placeholder="+223 XX XX XX XX" onChange={(e) => setState({ ...state, telephone: e.target.value })} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Button type="default" style={{ marginTop: 30 }} block>
                Appeler
                </Button>
            </Col>
            </Row>

            {/* Email */}
            <Row gutter={16}>
            <Col span={16}>
                <Form.Item
                label="Adresse email :"
                name="email"
                rules={[
                    { required: true, message: "Veuillez entrer une adresse email valide." },
                    { type: "email", message: "Le format de l’adresse email est invalide." },
                ]}
                >
                <Input placeholder="jean.untel@abc.com" onChange={(e) => setState({ ...state, email: e.target.value })} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Button type="default" style={{ marginTop: 30 }} block>
                Envoyer Email
                </Button>
            </Col>
            </Row>

            {/* Représentant commercial */}
            <Row gutter={16}>
            <Col span={16}>
                <Form.Item
                label="Représentant commercial :"
                name="representant_id"
                rules={[{ required: true, message: "Veuillez sélectionner un représentant." }]}
                >
                <Select
                    placeholder="Sélectionnez un représentant"
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => setState({ ...state, representant_id: value })}
                >
                    {representant.map((rep) => (
                    <Select.Option key={rep.id} value={rep.id}>
                        {rep.nom_representant}
                    </Select.Option>
                    ))}
                </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Tooltip title="Afficher la liste des représentants">
                <Button type="default" style={{ marginTop: 30 }} block onClick={() => setIsModalRepresentant(true)}>
                    <FolderOpenOutlined />
                </Button>
                </Tooltip>
            </Col>
            </Row>

            {/* Note */}
            <Form.Item label="Note client :" name="note">
            <Input.TextArea placeholder="Ajouter une note" onChange={(e) => setState({ ...state, note: e.target.value })} />
            </Form.Item>
        </Form>
        </Modal>

      <Modal
        title={"Liste des representations"}
        visible={IsModalRepresentant}
        onCancel={() => setIsModalRepresentant(false)}
        width={420}
        footer={[
            <Button key="cancel" onClick={() => setIsModalRepresentant(false)}>
                Annuler
            </Button>]}
      >
        <Representation/>

      </Modal>

      <h3>Liste des clients</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            <Spin spinning={loadingTable}>
                <Table dataSource={filteredClient} columns={columns} rowKey="id" />
            </Spin> 

    </div>
    </>
  );
}
