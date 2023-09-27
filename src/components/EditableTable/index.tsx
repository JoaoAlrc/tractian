import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export interface RecordTable {
  label: string;
  value: string | number;
  key: string;
  keyName: string;
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  record: RecordTable;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `${title} required!`,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps {
  data: Array<RecordTable>;
  onUpdateData: (data: any) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ data, onUpdateData }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | string>('');

  const isEditing = (record: RecordTable) => record.key === editingKey;

  const edit = (record: RecordTable) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (keyName: string) => {
    try {
      const row = await form.validateFields();
      const { value } = row;

      const updateData = deepSet({}, keyName, value);

      onUpdateData(updateData);

      setEditingKey('');
    } catch (errorInfo) {
      console.log('Error:', errorInfo);
    }
  };

  const deepSet = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    }

    return obj;
  };

  const columns = [
    {
      title: 'Label',
      dataIndex: 'label',
      width: '25%',
      editable: false,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '25%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <CheckCircleOutlined onClick={() => save(record.keyName)} />
            <Popconfirm title="Are you sure?" onConfirm={cancel}>
              <CloseCircleOutlined />
            </Popconfirm>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: {
        label: string;
        value: string | number;
        key: string;
        keyName: string;
      }) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        showHeader={false}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;
