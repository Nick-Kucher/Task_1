import './Table.css';
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message } from 'antd';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { fetchClients, addClient, updateClient, deleteClient } from './redux/clientSlice';

const ClientTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(state => state.clients.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const resetModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingClient(null);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsModalOpen(true);
    form.setFieldsValue(client);
  };

  const handleDelete = (key: string) => {
    dispatch(deleteClient(key));
    message.success('Клієнт видалений успішно');
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        if (editingClient) {
          dispatch(updateClient({ ...editingClient, ...values }));
          message.success('Клієнт оновлений успішно');
        } else {
          dispatch(addClient({ ...values, key: Date.now().toString() }));
          message.success('Клієнт доданий успішно');
        }
        resetModal();
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
        message.error('Будь ласка, заповніть всі обов\'язкові поля');
      });
  };

  const handleModalCancel = () => {
    resetModal();
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName'
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="container">
      <Button
        type="primary"
        onClick={() => {
          setEditingClient(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
        className="add-btn"
      >
        Add Client
      </Button>

      <div className="table-wrapper">
        <Table
          dataSource={clients}
          columns={columns}
          pagination={{ pageSize: 3 }}
          rowKey="key"
        />
      </div>

      <Modal
        title={editingClient ? 'Edit Client' : 'Add Client'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
      >
        <Form form={form} layout="vertical" className="modal-form">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Будь ласка, введіть ім\'я' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Будь ласка, введіть прізвище' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Будь ласка, введіть вік' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Будь ласка, введіть адресу' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientTable;
