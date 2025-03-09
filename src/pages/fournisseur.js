import { Button, Form, Input, Modal, Row, Col, message, Space, Spin, Popconfirm,Table, Select, Tooltip, DatePicker} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"; // Import des icônes
import PhoneInput from 'react-phone-number-input';

export default function Fournisseur() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [state, setState] = useState({ id: null,  nom: "", autrui: "", prenom_autrui: "", fax: "", adresse: "", email: "", telephone: "", telephone_second: "", date_debut_collaboration: ""});
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [fournisseur, setFournisseur] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm(); // Utiliser un formulaire contrôlé
  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Basic " + localStorage.getItem("token")
  };

  useEffect(() => {
    listFournisseur();
    document.title = "Gestion des fournisseurs";
}, []);

  const showAddModal = () => {
    setIsEditing(false);
    setState({ id: null, nom: "", autrui: "", prenom_autrui: "", fax: "", adresse: "", email: "", telephone: "", telephone_second: "", date_debut_collaboration: ""}); // Réinitialiser l'état pour un nouvel ajout
    form.resetFields(); // Réinitialiser le formulaire
    setIsModalVisible(true);
};
  const showEditModal = (record) => {
        setIsEditing(true);
        setState(record); // Charger les données à modifier
        form.setFieldsValue({ nom: record.nom, adresse_expedition: record.adresse_expedition, adresse_facturation: record.adresse_facturation, autrui: record.autrui, code_postal: record.code_postal, email: record.email, etat_province: record.etat_province, numero_fax: record.numero_fax, prenom_autrui: record.prenom_autrui, telephone: record.telephone, telephone_second: record.telephone_second, ville_pays: record.ville_pays, representant_id: record.representant_id
        }); // Remplir le formulaire avec les données existantes
        setIsModalVisible(true);
    };


    const handleApiError = () => {
        messageApi.error("Erreur survenu.");
    }

  const enregistrement = () => {
    setLoading(true);
    axios.post("http://localhost:8080/anonyme/fournisseur", state, { headers }).then(
        (success) => {
            listFournisseur();
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
        axios.put("http://localhost:8080/anonyme/fournisseur/" + state.id, state, { headers }).then(
            (success) => {
                listFournisseur();
                messageApi.success("fournisseur modifier avec succes");
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

    const listFournisseur = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/fournisseur",{headers}).then(
            (success) => {
                setFournisseur(success.data);
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
            axios.delete("http://localhost:8080/anonyme/fournisseur/"+id,{headers}).then(
                (success) => {
                    messageApi.success({ content: success.data });
                    listFournisseur();
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

  const filteredFournisseur = fournisseur.filter(fournisseur => fournisseur.nom.toLowerCase().includes(searchText.toLowerCase()));


  const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'fournisseur',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Telephone',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: 'Adresse',
            dataIndex: 'adresse',
            key: 'adresse',
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
      <h1 style={{ color: '#1890ff' }}>Gestion des fournisseurs</h1>
      {/* Bouton pour ouvrir le modal */}
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
        title={isEditing ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
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
        
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nom du fournisseur :"
                name="nom"
                rules={[{ required: true, message: "Veuillez entrer le nom du fournisseur." }]}
              >
                <Input placeholder="Exemple : Société ABC" onChange={(e) => setState({ ...state, nom: e.target.value })} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Personne à contacter :"
                name="autrui"
                rules={[{ required: true, message: "Veuillez entrer le nom de la personne à contacter." }]}
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
                label="Date début Collaboration :"
                name="date_debut_collaboration"
                rules={[{ required: true, message: "Veuillez sélectionner une date." }]}
              >
                <DatePicker
                  placeholder="Sélectionnez la date"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  onChange={(date) => setState({ ...state, date_debut_collaboration: date?.format("YYYY-MM-DD") })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Adresse :" name="adresse">
                <Input placeholder="Exemple : 123 Rue des Fournisseurs" onChange={(e) => setState({ ...state, adresse: e.target.value })} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Fax :" name="fax">
                <Input placeholder="Numéro de fax" onChange={(e) => setState({ ...state, fax: e.target.value })} />
              </Form.Item>
            </Col>
          </Row>

          {/* Téléphones */}
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Téléphone (principal) :"
                name="telephone"
                rules={[{ required: true, message: "Veuillez entrer un numéro de téléphone valide." }]}
              >
                <PhoneInput
                  international
                  defaultCountry="ML"
                  value={state.telephone}
                  onChange={(value) => setState({ ...state, telephone: value })}
                  placeholder="+223 XX XX XX XX"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="default" style={{ marginTop: 30 }} block>
                Appeler
              </Button>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Téléphone (autre) :" name="telephone_second">
                <PhoneInput
                  international
                  defaultCountry="ML"
                  value={state.telephone_second}
                  onChange={(value) => setState({ ...state, telephone_second: value })}
                  placeholder="+223 XX XX XX XX"
                  style={{ width: "100%" }}
                />
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
        </Form>
      </Modal>

      <h3>Liste des fournisseurs</h3>
            <Input.Search
                placeholder="Rechercher un élément"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%', marginBottom: '20px' }}
            />
            {/* <Spin spinning={loadingTable}> */}
                <Table dataSource={filteredFournisseur} columns={columns} rowKey="id" />
            {/* </Spin> */}

    </div>
    </>
  );
}
