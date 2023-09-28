import { useQuery, useMutation, UseMutationResult, UseQueryResult, useQueryClient } from 'react-query';
import { Company } from './types';
import api from '../../api';

const fetchCompanies = async (): Promise<Company[]> => {
  const response = await api.get(`/companies`);
  return response.data;
};

const createCompany = async (newCompany: Company): Promise<Company> => {
  const response = await api.post(`/companies`, newCompany);
  return response.data;
};

const readCompany = async (id: number): Promise<Company | null> => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

const updateCompany = async (id: number, updatedCompany: Company): Promise<Company | null> => {
  const response = await api.put(`/companies/${id}`, updatedCompany);
  return response.data;
};

const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/companies/${id}`);
};

export const useCompanies = (): UseQueryResult<Company[], unknown> => {
  return useQuery('companies', fetchCompanies, {
    refetchOnMount: false
  });
};

export const useCreateCompany = (): UseMutationResult<Company, unknown, Company> => {
  const queryClient = useQueryClient();

  return useMutation(createCompany, {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<Company[]>('companies', (prevData) => {
          const newData = [...(prevData as Company[]), updatedData as Company];
          return newData;
        });
      }
    },
  });
};




export const useReadCompany = (id?: number): UseQueryResult<Company | null, unknown> => {
  return useQuery(['companies', id], () => readCompany(id!), {
    enabled: !!id,
  });
};

export const useUpdateCompany = (): UseMutationResult<Company | null, unknown, { id: number; data: Company }> => {
  const queryClient = useQueryClient();

  return useMutation(({ id, data }: { id: number; data: Company }) => updateCompany(id, data), {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<Company[] | undefined>('companies', (prevData) => {
          const updatedCompanies = prevData?.map((companyItem) => {
            if (companyItem.id === updatedData?.id) {
              companyItem = updatedData
            }

            return companyItem;
          });
          return updatedCompanies;
        });
      }
    },
  });
};

export const useDeleteCompany = (): UseMutationResult<void, unknown, number> => {
  return useMutation(deleteCompany, {
    onSuccess: () => {
    },
  });
};
