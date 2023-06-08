import React from 'react';
import { Table } from 'antd';
import './index.css';

export function UserTable(props) {
  const { columns, data } = props;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
          hideOnSinglePage: true
        }}
      />
    </div>
  );
}

export function WordTable(props) {
  const { columns, data } = props;

  return (
    <div>
      <Table
        className="word-table"
        columns={columns}
        column={{
          align: 'center',
        }}
        dataSource={data}
        pagination={{
          position: ['bottomCenter'],
          pageSize: 15,
          hideOnSinglePage: true
        }}
        rowKey={(data) => data.id}
      />
    </div>
  );
}
