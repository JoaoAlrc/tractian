import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useCreateUser, useUpdateUser } from '../../../../queries/users';
import { useCompanies } from '../../../../queries/companies';
import { useUnits } from '../../../../queries/units';
import { User } from '../../../../queries/users/types';

const UserForm = ({ data, onFinishForm }: { data: User; onFinishForm: () => void }) => {
  const [form] = Form.useForm();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const { data: companies } = useCompanies();
  const { data: units } = useUnits();

  useEffect(() => {
    form.resetFields();
  }, [data, form]);

  const onFinish = async (values: User) => {
    try {
      if (data.id) {
        await updateUserMutation.mutateAsync({ id: data?.id, data: values }).then(onFinishForm);
      } else {
        await createUserMutation.mutateAsync(values).then(onFinishForm);
      }
    } catch (error) {
      console.error('Error:', error);

      message.error('An error occurred while saving the user. Please try again later.');
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="name" label="User Name" initialValue={data.name}>
        <Input />
      </Form.Item>
      <Form.Item name="companyId" label="Company"  initialValue={data.companyId}>
        <Select>
          {companies?.map((company) => (
            <Select.Option key={company.id} value={company.id}>
              {company.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="unitId" label="Unit"  initialValue={data.unitId}>
        <Select>
          {units?.map((unit) => (
            <Select.Option key={unit.id} value={unit.id}>
              {unit.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
