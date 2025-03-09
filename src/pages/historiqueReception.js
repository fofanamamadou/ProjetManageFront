import React, { useEffect, useState } from "react";
import { Form, Input, Select, InputNumber, Button, Table, Tooltip, Divider, Row, Col, Dropdown, Menu, Modal, message,Space,Spin,Popconfirm, DatePicker } from "antd";
import axios from "axios";


export default function HistoriqueReception() {
    const [reception, setReception] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const headers = {
        "Content-Type": "application/json",
        'Authorization': "Basic " + localStorage.getItem("token")
      };
    


    useEffect(() => {
        listReception();
        document.title = "Historique des Receptions";
    }, []);

    const listReception = () => {
        setLoadingTable(true);
        axios.get("http://localhost:8080/anonyme/commande/recue",{headers}).then(
            (success) => {
                console.log("Données envoyées : ", JSON.stringify(success.data, null, 2));
                setReception(success.data);
                setLoadingTable(false);
            },
            (error) => {
                console.log(error);
                setLoadingTable(false);
            }
        );
    };
      
      
        const columnsReceptions = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Adresse expedition',
            dataIndex: 'adresse_expedition',
            key: 'adresse_expedition',
        },
        {
            title: 'Adresse de facturation',
            dataIndex: 'adresse_facturation',
            key: 'adresse_facturation',
        },
        {
            title: 'Numero de suivi',
            dataIndex: 'numerosuivi',
            key: 'numerosuivi',
        }
        ];


    return(
        <>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

            <h3>Historique des Receptions</h3>
                        <Spin spinning={loadingTable}>
                            <Table dataSource={reception} columns={columnsReceptions} rowKey="id" />
                        </Spin> 

        </div>

        
        </>
    )




}