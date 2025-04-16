import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber } from 'antd';

type Client = {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
};

const initialData: Client[] = [
  {
    key: '1',
    firstName: 'Ivan',
    lastName: 'Petrenko',
    age: 30,
    address: 'Kyiv, Ukraine',
  },
  {
    key: '2',
    firstName: 'Olena',
    lastName: 'Shevchenko',
    age: 25,
    address: 'Lviv, Ukraine',
  },
  {
    key: '3',
    firstName: 'Taras',
    lastName: 'Koval',
    age: 40,
    address: 'Odesa, Ukraine',
  },
  {
    key: '4',
    firstName: 'Nadia',
    lastName: 'Kravchenko',
    age: 35,
    address: 'Kharkiv, Ukraine',
  },
  {
    key: '5',
    firstName: 'Andriy',
    lastName: 'Bondar',
    age: 28,
    address: 'Dnipro, Ukraine',
  },
  {
    key: '6',
    firstName: 'Svitlana',
    lastName: 'Maksymenko',
    age: 33,
    address: 'Vinnytsia, Ukraine',
  },
];

const ClientTable: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
    form.setFieldsValue(client); 
  };

  const handleDelete = (key: string) => {
    setClients(prev => prev.filter(client => client.key !== key));
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingClient) {
        setClients(prev =>
          prev.map(client =>
            client.key === editingClient.key ? { ...editingClient, ...values } : client
          )
        );
      } else {
        const newClient: Client = {
          key: Date.now().toString(),
          ...values,
        };
        setClients(prev => [...prev, newClient]);
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingClient(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingClient(null);
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Client) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger type="link" onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Button
        type="primary"
        style={{ marginBottom: '16px' }}
        onClick={() => {
          setEditingClient(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
      >
        Add Client
      </Button>

      <Table
        dataSource={clients}
        columns={columns}
        pagination={{ pageSize: 3 }}
      />

      <Modal
        title={editingClient ? 'Edit Client' : 'Add Client'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientTable;
