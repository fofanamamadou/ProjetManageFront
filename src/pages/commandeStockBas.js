import React, { useState } from "react";
import { Radio, Select, Table, Button, Space } from "antd";

const { Option } = Select;

export default function CommandeStockBas () {
  const [selectedOption, setSelectedOption] = useState(1);
  const [percentage, setPercentage] = useState(undefined);

  const columns = [
    { title: "Article", dataIndex: "article", key: "article" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Site", dataIndex: "site", key: "site" },
    { title: "Fournisseur", dataIndex: "fournisseur", key: "fournisseur" },
    { title: "Commandé", dataIndex: "commande", key: "commande" },
  ];

  const data = []; // Ajoute ici les données des articles

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3>Commander les articles à stock bas</h3>

      <Radio.Group
        onChange={(e) => {
          setSelectedOption(e.target.value);
          if (e.target.value === 1) setPercentage(undefined); // Reset du Select
        }}
        value={selectedOption}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <Radio value={1}>
          Tous les articles avec un niveau de stock inférieur à la quantité idéale
        </Radio>
        <Radio value={2}>
          Articles avec un % de stock actuel inférieur à la quantité idéale
        </Radio>
      </Radio.Group>

      {selectedOption === 2 && (
        <div style={{ marginTop: 10 }}>
          <span style={{ marginRight: 10 }}>% en dessous :</span>
          <Select
            value={percentage}
            onChange={setPercentage}
            style={{ width: 100 }}
            placeholder="Sélectionner"
          >
            <Option value="10%">10%</Option>
            <Option value="20%">20%</Option>
            <Option value="30%">30%</Option>
            <Option value="50%">50%</Option>
          </Select>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{ marginTop: 20 }}
        bordered
      />

      <p style={{ marginTop: 10 }}>
        Si un article ne s'affiche pas, il pourrait être sur une commande en attente. Veuillez consulter la liste « Articles commandés ».
      </p>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary" disabled={selectedOption === 2 && !percentage}>
          Générer
        </Button>
        <Button>Annuler</Button>
        <Button>Aide</Button>
      </Space>
    </div>
  );
};


