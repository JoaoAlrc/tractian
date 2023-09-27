import { useQuery, useMutation, UseMutationResult, UseQueryResult } from 'react-query';
import { Companie } from './types';
import api from '../../api';

const fetchCompanies = async (): Promise<Companie[]> => {
  const response = await api.get(`/companies`);
  return response.data;
};

const createCompanie = async (newCompanie: string): Promise<Companie> => {
  const response = await api.post(`/companies`, newCompanie);
  return response.data;
};

const readCompanie = async (id: number): Promise<Companie | null> => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

const updateCompanie = async (id: number, updatedCompanie: string): Promise<Companie | null> => {
  const response = await api.put(`/companies/${id}`, updatedCompanie);
  return response.data;
};

const deleteCompanie = async (id: number): Promise<void> => {
  await api.delete(`/companies/${id}`);
};

export const useCompanies = (): UseQueryResult<Companie[], unknown> => {
  return useQuery('companies', fetchCompanies, {
    refetchOnMount: false
  });
};
 
export const useCreateCompanie = (): UseMutationResult<Companie, unknown, string> => {
  return useMutation(createCompanie, {
    onSuccess: () => { 
    },
  });
};

export const useReadCompanie = (id?: number): UseQueryResult<Companie | null, unknown> => { 
  return useQuery(['companies', id], () => readCompanie(id!), {
    enabled: !!id,
  });
};

export const useUpdateCompanie = (): UseMutationResult<Companie | null, unknown, { id: number; data: string }> => {
  return useMutation(({ id, data }: { id: number; data: string }) => updateCompanie(id, data), {
    onSuccess: () => {
    },
  });
};

export const useDeleteCompanie = (): UseMutationResult<void, unknown, number> => {
  return useMutation(deleteCompanie, {
    onSuccess: () => {
    },
  });
};
