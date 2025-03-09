import { Progress, Table } from 'antd';
import React from 'react';

const VueDensembleDesStocks = () => {
  const data = [
    {
      key: '1',
      nom: 'Produit A',
      quantite: 5,
      seuilMin: 10,
    },
    {
      key: '2',
      nom: 'Produit B',
      quantite: 15,
      seuilMin: 10,
    },
    // Ajoutez d'autres produits ici
  ];

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      render: (quantite, record) => (
        <>
          <Progress
            percent={(quantite / record.seuilMin) * 100}
            status={quantite < record.seuilMin ? 'exception' : 'normal'}
          />
          {quantite} / {record.seuilMin}
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default VueDensembleDesStocks;