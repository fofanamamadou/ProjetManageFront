// import React, { useState } from "react";
// import { Button, Input, message, Form, Spin } from "antd";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

// function Copyright() {
//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       Copyright © Votre Site {new Date().getFullYear()}
//     </div>
//   );
// }

// export default function Inscription() {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [messageApi, contextHolder] = message.useMessage();
  
//   // State pour les informations de l'utilisateur
//   const [state, setState] = useState({
//     id: null,
//     nom: "",
//     email: "",
//     mot_de_passe: "",
//     roles: "ROLE_USERS"
//   });
//   const token = btoa(state.email.trim() + ":" + state.mot_de_passe.trim());


//     const headers = {
//       "Content-Type": "application/json",
//       'Authorization': "Basic " + token
//     };

//     const enregistrement = () => {
//       setLoading(true);
//       axios.post("http://localhost:8080/anonyme/utilisateur", state, { headers}).then(
//           (success) => {
//               message.success("Inscription réussie !");
//               localStorage.setItem("token", token);
//               localStorage.setItem("utilisateur", JSON.stringify(success.data));
//               navigate("/");
//               window.location.reload();
//               setLoading(false);
//           },
//           (error) => {
//               console.log(error);
//               messageApi.open({
//                   type: 'error',
//                   content: 'Erreur lors de l\'inscription',
//               });
//               setLoading(false);
//           }
//       );
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 400,
//         margin: "100px auto",
//         padding: "20px",
//         textAlign: "center",
//         backgroundColor: "#fff",
//         borderRadius: 8,
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       {contextHolder}
//       <h1 style={{  marginBottom: "20px" }}>Inscription</h1>
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={state}
//         onFinish={enregistrement}
//       >
//         <Form.Item
//           label="Nom"
//           name="nom"
//           rules={[{ required: true, message: "Veuillez entrer votre nom" }]}
//         >
//           <Input
//             prefix={<UserOutlined />}
//             placeholder="Nom"
//             value={state.nom}
//             onChange={(e) => setState({ ...state, nom: e.target.value })}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[
//             { required: true, message: "Veuillez entrer votre email" },
//             { type: "email", message: "Veuillez entrer un email valide" },
//           ]}
//         >
//           <Input
//             prefix={<MailOutlined />}
//             placeholder="Email"
//             value={state.email}
//             onChange={(e) => setState({ ...state, email: e.target.value })}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Mot de passe"
//           name="mot_de_passe"
//           rules={[
//             { required: true, message: "Veuillez entrer un mot de passe" },
//             {
//               min: 6,
//               message: "Le mot de passe doit contenir au moins 6 caractères",
//             },
//           ]}
//         >
//           <Input.Password
//             prefix={<LockOutlined />}
//             placeholder="Mot de passe"
//             value={state.mot_de_passe}
//             onChange={(e) =>
//               setState({ ...state, mot_de_passe: e.target.value })
//             }
//           />
//         </Form.Item>
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             disabled={loading}
//             style={{ fontWeight: "bold" }}
//           >
//             {loading ? <Spin size="small" /> : "S'inscrire"}
//           </Button>
//         </Form.Item>
//       </Form>
//       <p style={{ marginTop: "16px" }}>
//         Déjà inscrit ?{" "}
//         <a
//           onClick={() => navigate("/connexion")}
//           style={{ color: "#1890ff", cursor: "pointer" }}
//         >
//           Connectez-vous.
//         </a>
//       </p>
//       <Copyright />
//     </div>
  
//   );
// }
