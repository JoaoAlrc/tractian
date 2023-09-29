import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Company } from '../../../../queries/companies/types';
import { useCreateCompany, useUpdateCompany } from '../../../../queries/companies';

const CompanyForm = ({ data, onFinishForm }: { data: Company; onFinishForm: () => void }) => {
    const [form] = Form.useForm();
    const createCompanyMutation = useCreateCompany();
    const updateCompanyMutation = useUpdateCompany();

    useEffect(() => {
        form.resetFields();
    }, [data, form]);

    const onFinish = async (values: Company) => {
        try {
            if (!!data?.id) {
                await updateCompanyMutation.mutateAsync({ id: data.id, data: values }).then(onFinishForm);
            } else {
                await createCompanyMutation.mutateAsync(values).then(onFinishForm);
            }
        } catch (error) {
            console.error('Error:', error);

            message.error('An error occurred while saving the company. Please try again later.');
        }
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item name="name" label="Company Name" initialValue={data?.name}>
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CompanyForm;
