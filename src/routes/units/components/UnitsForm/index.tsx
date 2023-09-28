import React from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { Unit } from '../../../../queries/units/types';
import { useCreateUnit, useUpdateUnit } from '../../../../queries/units';
import { useCompanies } from '../../../../queries/companies';

const UnitsForm = ({ data, onFinishForm }: { data: Unit; onFinishForm: () => void }) => {
    const [form] = Form.useForm();
    const { data: companies } = useCompanies();
    const createUnitMutation = useCreateUnit();
    const updateUnitMutation = useUpdateUnit();

    const onFinish = async (values: Unit) => {
        try {
            if (data.id) {
                await updateUnitMutation.mutateAsync({ id: data.id, data: values }).then(onFinishForm);
            } else {
                await createUnitMutation.mutateAsync(values).then(onFinishForm);
            }
        } catch (error) {
            console.error('Error:', error);

            message.error('An error occurred while saving the unit. Please try again later.');
        }
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item name="name" label="Unit Name" initialValue={data.name}>
                <Input />
            </Form.Item>
            <Form.Item name="companyId" label="Company">
                <Select>
                    {companies?.map((company) => (
                        <Select.Option key={company.id} value={company.id}>
                            {company.name}
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

export default UnitsForm;
